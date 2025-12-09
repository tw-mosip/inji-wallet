# Presentation During Issuance

When issuing credentials to a user, authentication or authorization is often required. The most common factor used is an OTP. However, using OTPs means the user must recall their identifier each time they access their credential. To simplify this, the specification allows submitting an existing credential to authorize the user for credential issuance — a process known as Presentation during Issuance.
In essence, it means presenting one credential to obtain another.

Example use cases:

- To issue a Student ID Credential, the user presents an Enrollment Credential issued by the educational institution.
- To issue a Health Insurance Credential, the user presents an Identity Credential issued by a government authority.

This document focuses on the tech design to support presentations during the issuance process, particularly in scenarios where the issuer requires a presentation to be made before issuing a credential.

## Clarifications

- The OVP request received is no different from current OVP request structure followed in Wallet. [Draft 23 OpenID4VP specification using DIF presentation exchange](https://openid.net/specs/openid-4-verifiable-presentations-1_0-ID3.html#name-dif-presentation-exchange-2).
- The VP response created is also similar to the current VP response structure followed in Wallet. [Draft 23 VP response (Presentation Exchange)](https://openid.net/specs/openid-4-verifiable-presentations-1_0-ID3.html#name-examples-presentation-excha).
- Wallet supports for `openid4vp_presentation` interaction type only. Other interaction types like `redirect_to_web` will be supported in the future.

### Future scope

- `redirect_to_web` interaction type support during issuance.

## Pre-requisites

- The Issuer supporting the Interactive Authorization Request Endpoint as per the specification.

## Overall Flow diagram

### Actors involved

1. **User**: The individual requesting the credential.
2. **Wallet - Inji Wallet**: The digital wallet application used by the user to manage credentials.
3. **Issuer (OAuth AS + VCI)**: The entity responsible for issuing the credential, which also acts as an OAuth Authorization Server and Verifiable Credential Issuer.

### Sequence of interactions between entities

```mermaid
sequenceDiagram
    participant user as 👤 User
    participant wallet as 👜 Wallet
    participant issuer as 🛡️ Issuer<br/>(OAuth AS + VCI)

    user->>wallet: Opens the wallet
    user->>wallet: Open Download Card Screen
    Note over wallet,issuer: <Trusted Issuer flow or Credential Offer flow>
    user->wallet: Selects Issuer and Credential to download Or User scans Credential Offer QR code
    Note over wallet,issuer: 0. Discovery of Metadata
    wallet->>issuer: 1. GET /.well-known/openid-credential-issuer
    issuer->>wallet: 2. Credential Issuer metadata
    wallet->>issuer: 3. GET /.well-known/oauth-authorization-server
    issuer->>wallet: 4. OAuth Authorization server(AS) metadata
    Note over wallet,issuer: 1. Authorization to download credential
    alt Authorization server supports interactive interaction <br/>(`interactive_authorization_endpoint` available in Authorization Server metadata)
        wallet->>issuer: 5. Initial request to interaction endpoint <br/>POST Content-Type: application/x-www-form-urlencoded /iar<br/>{response_type="code", client_id, code_challenge, code_challenge_method:"S256", redirect_uri, interaction_types_supported=openid4vp_presentation, <br/>authorization_details=[{"type": "openid_credential", "locations": [ "https://credential-issuer.example.com" ], "credential_configuration_id": "UniversityDegreeCredential" }]}
        issuer->>wallet: 6. 200 Interactive Authorization Response
        Note over wallet,issuer: 2. Presentation Flow with Issuer
        Note over wallet, issuer: The response body has the structure<br/>{status:"require_interaction", type:"openid4vp_presentation", auth_session:"..random string",<br/>//Presentation request<br/>openid4vp_request: {standard ovp request by value with response_mode as "iar-post" or "iar-post.jwt"}}
        wallet ->> user : consent to the interaction - openid4vp_presentation
        wallet->>wallet: 7. Validate the response and validate openid4vp_request
        wallet->>wallet: 8. Display and select credential(s) which satisfies presentation request criteria
        wallet->>user: 9. User consent
        wallet->>issuer: 10. Share VP response to the Issuer <br/>POST /iar<br/>Content-Type - application/x-www-form-urlencoded<br/>{auth_session=...&openid4vp_presentation=...}
        issuer->>issuer: 11. Validate auth_session and VP response
        alt If VP is valid
            issuer->>wallet: 12. 200 OK {status:"ok", authorization_code:"..."}
            wallet->>issuer: 13. Token exchange occurs
            wallet->>issuer: 14. Credential request and issuance occurs
        else
            issuer->>wallet: 12. 4xx Bad Request {error:"invalid_request", error_description:"VP verification failed"}
            wallet ->> user: 13: show Error screen UI to user reg Credential download failure
        end
    end
```

## Sequence of interactions between entities via inji-\* Libraries

### High-level interaction flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Wallet as 👜 Wallet
    participant VCIClient as 📚 VCI Client
    participant ovp as 📚 openid4vp Library
    participant Issuer as 🛡️ Issuer + Authorization Server

    User->>Wallet: Request credential download
    Wallet->>VCIClient: downloadCredential(...issuer, ...config, authorizationInteractions: listOf(presentationInteraction))
    Note over Wallet,VCIClient: Note: VCIClient exposes the PresentationAuthorization class.<br/>When consumers use this class, all OVP-related processing is handled internally by using inji-openid4vp library.<br/>The wallet only needs to supply the required wallet communications via callbacks for user consent, credential selection, and signing data during VP creation.

    Note over VCIClient,Issuer: Discovery & Authorization
    VCIClient->>Issuer: Discover metadata & initiate interactive authorization request to /iar<br/>POST Content-Type: application/x-www-form-urlencoded /iar<br/>{response_type="code", client_id, code_challenge, code_challenge_method:"S256", redirect_uri, interaction_types_supported=openid4vp_presentation, <br/>authorization_details=[{"type": "openid_credential", "locations": [ "https://credential-issuer.example.com" ], "credential_configuration_id": "UniversityDegreeCredential" }]}
    Issuer->>VCIClient: Interactive auth required (presentation)<br/>{status:"require_interaction", type:"openid4vp_presentation", auth_session:"..random string",<br/>//Presentation request<br/>openid4vp_request: {standard ovp request by value with response_mode as "iar-post" or "iar-post.jwt"}}

    Note over Wallet,VCIClient: Presentation Flow
    VCIClient ->> ovp: Validate openid4vp request
    ovp ->> VCIClient: Return AuthorizationRequest (ovpRequest)
    VCIClient -->> Wallet : Handle Presentation request<br/>input = vp request, output = selected credentials / error for consent rejection or no matching credentials. Internally wallet takes care of any consent as per need
    Wallet ->> VCIClient: Return selected credentials or error

    Note over Wallet,VCIClient: VP Creation & Submission
    VCIClient->>ovp: Prepares the data for signing using openid4vp library passing the selected credentials
    ovp->>VCIClient: Return unsigned data
    VCIClient->>Wallet: sign the data for VP creation (callback)
    Wallet->>VCIClient: Return signed data
    VCIClient->>ovp: Create VP response
    ovp->>VCIClient: Return VP response as Map<String, Any>
    VCIClient->>VCIClient: Prepare the response to be sent to /iar<br/>{openid4vp_presentation: vpResponse, auth_session: "..."}
    VCIClient->>Issuer: Share VP response to the Issuer /iar endpoint<br/>POST /iar<br/>Content-Type - application/x-www-form-urlencoded<br/>{auth_session=...&openid4vp_presentation=...}

    alt VP Valid
        Issuer->>VCIClient: Authorization code
        VCIClient->>Issuer: Exchange token & request credential
        Issuer->>VCIClient: Issue credential
        VCIClient->>Wallet: Credential download success
        Wallet->>User: Show success
    else VP Invalid
        Issuer->>VCIClient: Error response
        VCIClient->>Wallet: Propagate error
        Wallet->>User: Show error
    end
```

### Detailed interaction flow with inji-\* Libraries

#### Actors involved

1. **User**: The individual requesting the credential.
2. **Wallet - Inji Wallet**: The digital wallet application used by the user to manage credentials.
3. **Issuer (OAuth AS + VCI)**: The entity responsible for issuing the credential, which also acts as an OAuth Authorization Server and Verifiable Credential Issuer.
4. **Inji VCI Client Library**: The library used by the wallet to handle OpenID for VC issuance. (Download of credential into Wallet)
5. **Inji OpenID4VP Library**: The library used by the wallet to handle OpenID for Verifiable Presentations. (Wallet presenting of the credential to a Verifier)

```mermaid
sequenceDiagram
    participant user as 👤 User
    participant wallet as 👜 Wallet
    participant vciClient as 📚 Inji VCI Client Library (inji-vci-client)
    participant openid4vp as 📚 Inji OpenID4VP Library (inji-openid4vp)
    participant issuer as 🛡️ Issuer<br/>(OAuth AS + VCI)
    Note over user, vciClient: User initiates credential download in the wallet (via Credential offer or Trusted Issuer flow)
    wallet ->> vciClient: 0. requests for Credential download <br/> requestCredentialFromTrustedIssuer(<br/>"<credentialIssuer>",<br/><credentialConfigurationId>,<br/>ClientMetadata("client-id", "https://sampleApp/redirect-uri"),<br/>authorizeUser: authorizeUserCallback,<br/>getTokenResponse: tokenResponseCallback, <br/>getProofJwt: proofJwtCallback,<br/> authorizationInteractions: listOf(PresentationInteraction(...),..)<br/>)
    Note over vciClient, issuer: 1. Discovery of Issuer and Authorization Server metadata
    vciClient ->> issuer: 1.1. GET /.well-known/openid-credential-issuer
    issuer ->> vciClient: 1.2. Credential Issuer metadata
    vciClient ->> issuer: 1.3. GET /.well-known/oauth-authorization-server
    issuer ->> vciClient: 1.4. OAuth Authorization server(AS) metadata
    Note over wallet, issuer: Authorization to download credential
    alt Authorization server supports interactive interaction <br/>(`interactive_authorization_endpoint` available in Authorization Server metadata)
        vciClient ->> issuer: 2. Initial request to interaction endpoint <br/>POST Content-Type: application/x-www-form-urlencoded /iar<br/>{response_type="code", client_id, code_challenge, code_challenge_method:"S256", redirect_uri, interaction_types_supported=openid4vp_presentation, <br/>authorization_details=[{"type": "openid_credential", "locations": [ "https://credential-issuer.example.com" ], "credential_configuration_id": "UniversityDegreeCredential" }]}
        alt Successful interaction response
            issuer ->> vciClient: 3. 200 Interactive Authorization Response
            Note over wallet, issuer: Presentation Flow with Issuer
            Note over wallet, issuer: The response body has the structure<br/>{status:"require_interaction", type:"openid4vp_presentation", auth_session:"..random string",<br/>//Presentation request<br/>openid4vp_request: {standard ovp request by value with response_mode as "iar-post" or "iar-post.jwt"}}
            vciClient ->> openid4vp: 4. Validating the openid4vp request received from Issuer
            openid4vp ->> vciClient: Return AuthorizationRequest (ovpRequest)
            vciClient ->> wallet: 5 Handle presentation request callback to Wallet <br/>(Displaying the presentation request to the user and obtaining user consent, <br/>Filtering the credentials in Wallet which satisfies the presentation request criteria,<br/> Showing the filtered credentials to the user for selection,<br/> Obtaining user consent for sharing the selected credentials<br/>Note: The consent is a business context here<br/>)
            wallet ->> vciClient: Return selected credentials or error for consent rejection / no matching credentials
            note over wallet, openid4vp: Create VP response
            alt Successful (consent given + selected credentials)
                vciClient ->> openid4vp: 6. prepare the data for signing as per the selected credentials
                openid4vp ->> vciClient: Return unsigned data (unsignedVPToken)
                vciClient ->> wallet: sign the data for VP creation (callback)
                wallet ->> vciClient: Return signed data (vpTokenSigningResults)
                vciClient ->> openid4vp: Create the successful VP response
                openid4vp ->> vciClient: Return VP response as Map<String, Any>
            else Error (no matching credentials / consent rejected)
                vciClient ->> openid4vp: 6. Create VP response (error)
                openid4vp ->> vciClient: Return VP error response as Map<String, Any>
            end
            vciClient ->> vciClient: 7. Prepare the response to be sent to /iar<br/>{openid4vp_presentation: vpResponse, auth_session: "..."}
            vciClient ->> issuer: 8. Share VP response to the Issuer <br/>POST /iar<br/>Content-Type - application/x-www-form-urlencoded<br/>{auth_session=...&openid4vp_presentation=...}
            issuer ->> issuer: 9. Validate auth_session and VP response
            alt Server side validation of Submitted response is successful
                issuer ->> vciClient: 10. 200 OK {status:"ok", authorization_code:"..."}
                Note over wallet, issuer: Usual authorization Code Flow continuation
            else Server side validation of Submitted response failed
                issuer ->> vciClient: 10. 4xx Bad Request {error:"invalid_request", error_description:"VP verification failed"}
                vciClient ->> wallet: Propagate interaction error to wallet
                wallet ->> user: Show error to user
            end
        else Error interaction response
            issuer ->> vciClient: interaction error response<br/>4xx Bad Request {error:"missing_interaction_type", error_description:"interaction_types_supported in the request is missing the required interaction type 'openid4vp_presentation'"}
            vciClient ->> wallet: Propagate interaction error to wallet
            wallet ->> user: Show error to user
        else non Interactive Authorization Request flow
            vciClient ->> issuer: 2. Authorization Request to /authorize endpoint
            issuer ->> vciClient: 3. Authorization Response with authorization code
            Note over wallet, issuer: Usual authorization Code Flow continuation
            vciClient ->> issuer: 4. Token exchange occurs
            vciClient ->> issuer: 5. Credential request and issuance occurs
            issuer ->> vciClient: 6. Credential issuance response
            vciClient ->> wallet: 7. Propagate successful credential issuance response to wallet
            wallet ->> user: Show successful credential download to user 🪪
        end
    end
```

#### Notes

- In Step 0, why is it authorizationInteractions rather than just presentationRequestInteraction?
  - Because in the future, there can be other interaction types (eg - `redirect_to_web` or any custom interaction) supported during issuance as well. Hence, to keep it extensible, we have designed it this way.
- After step 5, why is it Create VP response rather than send VP response
  - Because in this flow, the VP response needs to be sent to the Issuer (/iar) which is known to vci client library.
  - The method `sendAuthorizationResponseToVerifier` is designed to send the VP response directly to the verifier endpoint, which is not applicable in this case.
  - check below point for more clarity on why vci-client needs only the OVP response.
- In Step 8, why is vci client library responsible for sharing VP response to issuer rather than inji-openid4vp library?
  - Because the vci client library is responsible for handling the overall issuance flow, including interactions with the issuer.
  - The inji-openid4vp library is focused on handling OpenID for Verifiable Presentations, including creating VP responses, but not managing the entire issuance process.
  - Also, There is a mandation to add authSession to the request which is more specific to issuance flow and not related to openid4vp.
  - The VP response submission body of OVP flow - {vp_token:..., presentation_submission:...} is wrapped inside but in PDI flow {auth_session:..., openid4vp_presentation:{vp_token:..., presentation_submission:...}} it differs. To handle this wrapping and addition of auth_session, it is better to keep this logic in vci client library to have more control.

#### Implementation details - Presentation Interaction

\*_Class diagram - authorizationMethods_

```mermaid
classDiagram
    class AuthorizationHandler {
        <<interface>>
        +AuthorizationResponse authorizeUser(AuthorizationRequestData requestData)
        +String type()
    }

    class AuthorizationRequestData {
        <<abstract>>
    }

    class PresentationAuthorizationRequestData {
        ovpRequest
        authSession
        iar
    }

    class RedirectToWebAuthorizationRequestData {
        requestUri
        expiresIn
        authSession
        authorizeUrl
        ...clientConfig // all details like client_id, code_challenge, redirect_uri etc.
    }

    class StandardAuthorizationRequestData {
        authorizeUrl
        ...clientConfig // all details like client_id, code_challenge, redirect_uri etc.
    }

    note for AuthorizationMethod "presentationDuringIssuance returns PresentationAuthorizationHandler instance\nredirectToWeb returns WebAuthorizationHandler instance"
    class AuthorizationMethod {
        <<object>>
        + presentationDuringIssuance(selectCredentialsForPresentation: (ovpRequest: AuthorizationRequest) -> PresentationSelectionResult, signVerifiablePresentation: (payload: unsignedVPToken) -> Map<FormatType, VPTokenSigningResult>) AuthorizationHandler
        + redirectToWeb(openWebPage: (url: String)) -> Map<String,Any>) AuthorizationHandler
    }

    note for PresentationSelectionResult "holderId and signatureSuite are optional fields as its only applicable for ldp_vc"
    class PresentationSelectionResult {
      selectedCredentials Map<String, Map<FormatType, List<Any>>>,
      holderId String? = null,
      signatureSuite String = "Ed25519Signature2020"
    }


    AuthorizationHandler <|.. PresentationAuthorizationHandler
    AuthorizationHandler <|.. WebAuthorizationHandler

  class PresentationAuthorizationHandler {
    + constructor(selectCredentialsForPresentation: (ovpRequest: AuthorizationRequest) -> PresentationSelectionResult, signVerifiablePresentation: (payload: unsignedVPToken) -> Map<FormatType, VPTokenSigningResult>)
    + authorizeUser(requestData: PresentationAuthorizationRequestData) AuthorizationResponse
    + type() String // returns openid4vp_presentation
    - validateAuthorizationRequest(authorizationRequest: Map<String,Any>) : void
    - handlePresentation(authRequest: Map<String,Any>) : Map<String, Any>
    - sendOVPAuthorizationResponseToIssuer(iar: String, authSession: String, vpResponse: VPResponse) : AuthorizationResponse
  }

  class WebAuthorizationHandler {
    + constructor(openWebPage: (url: String)) -> Map<String,Any>)
    + authorizeUser(requestData: AuthorizationRequestData) AuthorizationResponse
    + type() String // returns redirect_to_web
  }

  class AuthorizationResponse {
    status // success
    authorizationCode // success
    error // error
    errorDescription // error
    authSession // Authorization process not complete - just auth session returned for scenarios from redirect_to_web scenario where wallet makes follow up request
  }

    AuthorizationRequestData <|-- PresentationAuthorizationRequestData
    AuthorizationRequestData <|-- RedirectToWebAuthorizationRequestData
    AuthorizationRequestData <|-- StandardAuthorizationRequestData
```

```mermaid
---
config:
  layout: elk
---
classDiagram

    class InteractiveAuthorizationRequestService {
        + handle(endpoint: String) : String
        - initialAuthorizationRequest(endpoint: String) : InteractionResponse
        - handleInteractionResponse(interactionResponse: InteractionResponse) : AuthorizationResponse
        - exchangeToken(authorizationCode: String) : TokenResponse
    }
```

interface AuthorizationHandler

- Responsibility:
  - This interface defines the contract for different authorization interaction handlers.
  - It takes care of making the Authorization Request based on the interaction type and returning the Authorization Response.
- Methods:
  - authorizeUser(requestData: AuthorizationRequestData): AuthorizationResponse
    - responsibility: Handle authorization with the provided data by making authorization request and returning the response.
    - input: Data to initiate Authorization Request - AuthorizationRequestData
      - Presentation interaction -> i) ovpRequest (auth request for the credential presentation), ii) authSession (value to be attached in the API call), iii) iar (endpoint to make the API call)
      - Redirect to web interaction -> i) requestUri ii) expiresIn iii) authSession (value to be attached in the API call), iv) authorizeUrl (endpoint to make the API call) v) configurations to attach in API requests
      - Usual auth flow -> i) authorizeUrl (endpoint to make the API call) ii) configurations to attach in API request
      - Note: Redirect to web interaction and usual auth flow can be merged as one as both are similar in nature and for consumer wallet, both will be redirecting to web flow.
    - output: User authorization result - AuthorizationResponse
      - Successful response containing authorization_code, status etc.
      - Error response containing error_description and error_code or only auth_session to be attached in the subsequent API call
  - type(): String
    - This method returns the interaction type name, which is used in interaction_types_supported param during initial /iar request.
    - For presentation interaction, it returns "openid4vp_presentation".
    - For redirect to web interaction, it returns "redirect_to_web".

**Presentation Interaction**

- Class PresentationAuthorizationHandler implements AuthorizationHandler

- Requirements of the Presentation interaction from Wallet (got as constructor params)

  - `selectCredentialsForPresentation` callback
    - input: presentation request | output: PresentationSelectionResult holding selected credentials - map of {credential_type: {format_type: list of credentials}}, holderId (optional - public key to be attached to ldp_vp), signatureSuite (default param - signature suite to be used for ldp_vp)
    - selectCredentialsForPresentation: (ovpRequest: AuthorizationRequest) -> PresentationSelectionResult
    - This callback is responsible for
      - Obtaining any user consent for presentation request
      - filtering the credentials in Wallet which satisfies the presentation request criteria, showing the filtered credentials to the user for selection
  - `signVerifiablePresentation` callback
    - input: unsigned VP token | output: signed VP token - map of {format_type: signed data}
    - signVerifiablePresentation: (payload: unsignedVPToken) -> Map<FormatType, VPTokenSigningResult>
    - This callback is responsible for signing the data for VP creation.

- Methods

  - authorizeUser(requestData: PresentationRequestData) : AuthorizationResponse

    - This method is responsible for handling the entire presentation interaction flow.
    - It takes the ovpRequest, auth_session, interactive_authorization_endpoint (iar) as input and submits the VP response to the Issuer's /iar endpoint. Then returns back the AuthorizationResponse to the caller.
    - Responsibilities include
      - validate auth request
      - handle presentation (create authorization response by invoking selectCredentialsForPresentation callback and creating VP response)
      - submit VP response to Issuer's /iar endpoint
      - return AuthorizationResponse to caller

  - type() : String

    - This method returns the interaction type name, which is used in interaction_types_supported param as one of the element during initial /iar request.
    - For presentation interaction, it returns "openid4vp_presentation".

  - validateAuthorizationRequest(authorizationRequest: Map<String,Any>) : void [private]

    - This method is responsible for validating the openid4vp request received from Issuer.
    - It uses inji-openid4vp library's authenticateVerifier method to validate the request.
    - In case of any error (eg - request signature validation failure), it throws an exception which is caught in handle method to create error VP response.

  - handlePresentation(authRequest: Map<String,Any>) : Map<String, Any> [private]

    - This method is responsible for consent and creating the VP response based on selected credentials or creating VP error response on any consent rejection or error.
    - In case of any error (no matching credentials / consent rejected), it throws an exception which is caught in handle method to create error VP response.
    - For successful scenario, it creates the VP response using inji-openid4vp library by calling constructUnsignedVPToken and then using signVerifiablePresentation callback to get the signed data, pass the signed data to constructVPResponse method of inji-openid4vp library to get the final VP response.
    - Order of operations
      - Call selectCredentialsForPresentation callback to get selected credentials and other data - signatureSuite (default param), holderId (Optional) from Wallet
      - Create VP response (success / error) using inji-openid4vp library methods

  - sendOVPAuthorizationResponseToIssuer(iar: String, authSession: String, vpResponse: VPResponse) : AuthorizationResponse [private]
    - This method is responsible for sharing the VP response to Issuer's /iar endpoint.
    - It creates the final request body by attaching auth_session to the VP response received from handlePresentation method and makes the API call to Issuer's /iar endpoint.
    - It processes the response received from Issuer and creates the AuthorizationResponse to be returned to caller.

**Web Interaction**

- Class WebAuthorizationHandler implements AuthorizationHandler
- Responsibilities:
  - This class is responsible for handling the redirect to web interaction type.
  - It takes care of invoking wallet's openWebPage callback to open the authorizeUrl in web browser for user authorization and returns the response received from the authorization server.
- methods
  - authorizeUser(requestData: AuthorizationRequestData) : AuthorizationResponse
    - This method is responsible for handling the redirect to web interaction flow.
    - Construct authorize URL with required query params using the configurations received in requestData for both redirect_to_web interaction and usual auth flow.
    - invokes the wallet callback of openWebPage to open the constructed URL in web browser for user authorization.
    - Waits for the response from wallet (Map<String, Any> - {authorization_code=...}) and processes it to create AuthorizationResponse to be returned to caller.
  - type() : String
    - This method returns the interaction type name, which is used in interaction_types_supported param during initial /iar request.
    - For redirect to web interaction, it returns "redirect_to_web".

**Notes:**
The key difference between standard authorization flow and redirect to web is that

- In standard authorization flow, the VCI client constructs the authorization URL with configurations and asks Wallet to open the web view with that URL.
- In redirect to web flow, the VCI client would have pushed the authorization request to the authorization server and received an request_uri for it. The authorization URL is constructed using that request_uri and some major configurations. The VCI client then asks Wallet to open the web view with that URL.

- The part where VCI client asks Wallet to open the web view is common in both flows.
- This means that the consumer will behave the same way for both flows.

For the consumer of VCI client, the spec terms - interaction `redirect_to_web` and `standard authorization` is same flow (web based user authorization). So they can use the same WebAuthorizationHandler class for both flows.

1. For the VCI client library, both flows are similar (not same) as the request construction differs but using an authorization endpoint to open webview is same.
2. But for the consumer wallet, both flows will be handled in the same way (open web view for user authorization).
3. So we have merged both flows into one class - WebAuthorizationHandler.

**AuthorizationRequestData interface**

- This interface defines the contract for different interaction request data types returned by various interaction types.

**PresentationRequestData implemented by AuthorizationData**

- Fields
  - ovpRequest: AuthorizationRequest
    - The openid4vp request received from Issuer to be presented by Wallet.
  - authSession: String
    - The auth_session value received from Issuer to be attached in the /iar request while sharing VP response.
  - interactiveAuthorizationEndpoint: String
    - The endpoint URL of Issuer's /iar to which the VP response needs to be shared.

**RedirectToWebAuthorizationRequestData implemented by AuthorizationRequestData**

- Fields
  - requestUri: String
    - The request_uri received from Issuer to be used in authorize URL.
  - expiresIn: Long
    - The expiry time of request_uri received from Issuer.
  - authSession: String
    - The auth_session value received from Issuer to be attached in the /iar request while sharing VP response.
  - Other configurations like client_id, code_challenge, redirect_uri etc.

**StandardAuthorizationRequestData implemented by AuthorizationRequestData**

- Fields
  - authorizeUrl: String
    - The authorize URL endpoint received from Issuer to be used in authorize URL.
  - Other configurations like client_id, code_challenge, redirect_uri etc.

**Responsibilities - Presentation Interaction**

| Step                                                         | Task                                                                                  | Called by       | Responsibility handled by | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------- | --------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1                                                            | Validating the openid4vp request received from Issuer                                 | inji-vci-client | inji-openid4vp            | - vci-client communicates with openid4vp library to validate the request.<br/> - Method used: authenticateVerifier (openid4vp)<br/>- sample: `authenticateVerifer(urlEncodedAuthorizationRequest = null,authorizationRequest = ovpRequest,trustedVerifiers = emptyList()): AuthorizationRequest`                                                                                                                                                                                                                                                                                      |
| 2                                                            | Displaying the presentation request to the user and obtaining user consent            | inji-vci-client | wallet (callback)         | - inji-vci-client does a callback to wallet passing the VP request and getting the matching credentials selected by user (selectedCredentials), holderId and signatureSuite (PresentationSelectionResult) in response.<br/>- The user consent are all handled by the callback. Basically step no 2,3,4,5 are handled and the matching credentials are returned or error for consent rejection is thrown<br/>- Method used: selectCredentialsForPresentation (wallet)<br/>- sample: `selectCredentialsForPresentation(ovpRequest: AuthorizationRequest) : PresentationSelectionResult` |
| 3                                                            | Filtering the credentials in Wallet which satisfies the presentation request criteria | -               | wallet (callback)         | <same as before>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 4                                                            | Showing the filtered credentials to the user for selection                            | -               | wallet (callback)         | <same as before>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 5                                                            | Obtaining user consent for sharing the selected credentials                           | -               | wallet (callback)         | <same as before>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 6 (success - matching credentials available + consent given) | Creating the VP response based on selected credentials                                |                 |                           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 6.1                                                          | prepare the data for signing as per the selected credentials                          | inji-vci-client | inji-openid4vp            | - vci-client communicates with openid4vp library with the selected credentials (return of selectCredentialsForPresentation callback)<br/>- returns the unsigned data<br/>- Method used: constructUnsignedVPToken (openid4vp)<br/>- sample: `constructUnsignedVPToken(verifiableCredentials = selectedCredentials, holderId = holderId, signatureSuite = signatureSuite) :  Map<FormatType, UnsignedVPToken>`                                                                                                                                                                          |
| 6.2                                                          | sign the data for VP creation                                                         | inji-vci-client | wallet (callback)         | - vci-client does a callback to wallet with the unsigned data (unsignedVPToken) to get the signed data (vpTokenSigningResults)<br/>- Method: signVerifiablePresentation(payload: unsignedVPToken) : Map<FormatType, VPTokenSigningResult><br/>- sample: `signVerifiablePresentation(payload = unsignedVPToken): Map<FormatType, VPTokenSigningResult {//sign the data // return signed data}`                                                                                                                                                                                         |
| 6.3                                                          | Create the successful VP response                                                     | inji-vci-client | inji-openid4vp            | - vci-client communicates with openid4vp library to get the VP response<br/>- Method: constructVPResponse(vpTokenSigningResults: Map<FormatType, VPTokenSigningResult>) : Map<String,Any> <br/>- sample return: {vp_token: "...", presentation_submission: "..."} or {response: "..."} (encrypted - iar-post.jwt)                                                                                                                                                                                                                                                                     |
| 6 (failure - no matching credentials / no consent)           | Creating VP response based on error                                                   |                 |                           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 6.1                                                          | Create the error VP response                                                          | inji-vci-client | inji-openid4vp            | - vci-client communicates with openid4vp library to get the error VP response<br/>- Method: constructErrorInfo(exception: Exception): Map<String, Any><br/>sample return : {error: "access_denied", error_description: "user rejected consent"}                                                                                                                                                                                                                                                                                                                                       |
| 7                                                            | Prepare the response to be sent to /iar                                               | N/A             | inji-vci-client           | - Prepare the data for response body of /iar<br/>- returns map of {openid4vp_response: <vp error / success response>}                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 8                                                            | Sharing the VP response to Issuer                                                     | N/A             | inji-vci-client           | - Create the final response body for /iar request by attaching "auth_session" to the response body input provided by the specific interaction<br/>                                                                                                                                                                                                                                                                                                                                                                                                                                    |

Note:

- In step 1, why is authenticateVerifier called with urlEncodedAuthorizationRequest = null and authorizationRequest = ovpRequest?
  - Because in this flow, the openid4vp request is received by value (as JSON and not as a URL). Hence, we pass it as authorizationRequest.

#### Changes summary

1. Inji VCI Client Library
   - Add support for client metadata to accept supported interaction types of Wallet. (interactionTypesSupported field)
   - Create new methods to accept authorizationMethods to handle different authorization (interactions) types during issuance.
   - Implement logic to handle openid4vp_presentation interaction type, including invoking the appropriate callback in the Wallet.
   - Add logic to share VP response to Issuer's /iar endpoint after receiving it from Wallet.
   - Change in public method

(1) trusted offer flow method

```kotlin
fetchCredentialFromTrustedIssuer(
    credentialIssuer: String,
    credentialConfigurationId: String,
    clientMetadata: ClientMetadata,
    getTokenResponse: TokenResponseCallback,
    authorizationMethods: List<AuthorizationHandler>, // new
    getProofJwt: ProofJwtCallback,
    downloadTimeoutInMillis: Long = Constants.DEFAULT_NETWORK_TIMEOUT_IN_MILLIS,
): CredentialResponse
```

(2) Credential offer flow method

```kotlin
 fetchCredentialUsingCredentialOffer(
     credentialOffer: String,
     clientMetadata: ClientMetadata,
     getTxCode: TxCodeCallback?,
     authorizationMethods: List<AuthorizationHandler> // new
     getTokenResponse: TokenResponseCallback,
     getProofJwt: ProofJwtCallback,
     onCheckIssuerTrust: CheckIssuerTrustCallback? = null,
     downloadTimeoutInMillis: Long = Constants.DEFAULT_NETWORK_TIMEOUT_IN_MILLIS
 ): CredentialResponse
```

- Here authorizationMethods hold the logic for presentation / web auth flow (redirect_to_web / standard auth)

Note:

      1. Here the authorizationMethods holds the authorization interactions supported by the wallet
      2. PresentationAuthorizationHandler class will be exposed by the library which can be used by consumer Wallet
      3. WebAuthorizationHandler class will be exposed by the library which can be used by consumer Wallet
      4. Only the interaction types available in this will be added for the `interaction_types_supported` param in request body during initial interactive authorization request

2. Inji OpenID4VP Library
   - Add support to validate openid4vp request with response_mode as iar-post or iar-post.jwt by skipping response_uri check.
   - Add support to create VP response for openid4vp request with response_mode as iar-post or iar-post.jwt.
   - Add method `constructVPResponse` to create VP response & `constructErrorInfo` for creating error response and return it as Map<String, Any> to Wallet.
3. Inji Wallet
   - Implement the openid4vp interaction callback to handle the presentation request, display it to the user, and obtain user consent.
   - Use PresentationInteraction exposed from Inji VCI Client library
   - Handle error scenarios and propagate errors to the user appropriately.
   - Integrate with the updated inji-vci-client library to support the new interaction flow during credential issuance.
   - Align with the new changes of VCI client library public methods.
   - Adapt to WebAuthorizationHandler related changes

## References

- [OpenID for Verifiable Credentials Issuance 1.1 - Interactive Authorization Request Endpoint](https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-1_1-wg-draft.html#name-interactive-authorization-e)
- [OpenID for Verifiable Presentations - Draft 23](https://openid.github.io/openid4vp/draft-23.html)
- [RFC 9126 - Pushed Authorization Requests (PAR)](https://datatracker.ietf.org/doc/html/rfc9126)
- [Spike card](https://mosip.atlassian.net/browse/INJIMOB-3601)

## Questions

1. should OVP library know the context of “iar_post.jwt / iar_post”

**Context:**

openid4vp library takes care of validating auth request, construction auth response (success/ error) based on response_mode
We want to make use of the exisiting functionalities in OVP library for PDI flow’s VP response submission

**Answer:** Yes, OVP library can know about `iar_post.jwt / iar_post` as these are response modes and creating VP response is related to response mode.

2. Should consent be handled in VCI client or Wallet?

**Context:**
Consent is a business context and wallet is the one which interacts with user. So ideally consent should be handled in Wallet.

**Answer:** Consent should be handled in Wallet as it is a business context and Wallet interacts with the user.

3. Will there be any case where a consumer Wallet wants to support only standard auth flow and not redirect to web flow or vice versa?

   - If yes, then we can accept one more param in the constructor to indicate if redirect to web flow is to be supported or not. (isRedirectToWebInteractionSupported: Boolean = true)
   - If no, then we can merge both into one class as mentioned above.

1. abstract - AuthorizationMethod - exposed to consumers -> consumer wants to use as AuthorizationMethod.RedirectToWeb
1. internal - AuthorizationMethodHandler - library maps to the respective handler and call authorizeUser based on

# Proposal for AuthorizationMethod abstraction

⭐ Public API (What user sees)

```kotlin
sealed class AuthorizationMethod {

    class RedirectToWeb(
        val openWebPage: (String) -> Map<String, Any>
    ) : AuthorizationMethod()

    class PresentationDuringIssuance(
      private val selectCredentialsForPresentation: suspend (ovpRequest: AuthorizationRequest) -> PresentationSelectionResult,
      private val signVerifiablePresentation: suspend (
        payload: Map<FormatType, UnsignedVPToken>,
      ) -> Map<FormatType, VPTokenSigningResult>,
    ) : AuthorizationMethod()
}
```

⭐ Internal: Your existing handlers

```kotlin
interface AuthorizationMethodHandler {
  fun type(): String
  suspend fun authorizeUser(requestData: AuthorizationRequestData): AuthorizationResponse
  }

class RedirectToWebHandler(
  private val openWebPage: (String) -> Map<String, Any>
  ) : AuthorizationMethodHandler {
  override fun type() = "redirect_web"
  override suspend fun authorizeUser(requestData: AuthorizationRequestData): AuthorizationResponse { TODO() }
}

class PresentationDuringIssuanceHandler(
  private val selectCredentialsForPresentation: suspend (ovpRequest: AuthorizationRequest) -> PresentationSelectionResult,
  private val signVerifiablePresentation: suspend (
    payload: Map<FormatType, UnsignedVPToken>,
  ) -> Map<FormatType, VPTokenSigningResult>,
  ) : AuthorizationMethodHandler {
  override fun type() = "presentation_during_issuance"
  override suspend fun authorizeUser(requestData: AuthorizationRequestData): AuthorizationResponse { TODO() }
}

data class PresentationSelectionResult(
  val selectedCredentials: Map<String, Map<FormatType, List<Any>>>,
  val holderId: String? = null,
  val signatureSuite: String = "Ed25519Signature2020"
)
```

⭐ Convert AuthorizationMethod → AuthorizationHandler to use internally in the library

```kotlin
fun AuthorizationMethod.toHandler(): AuthorizationHandler {
  return when (this) {
    is AuthorizationMethod.RedirectToWeb -> RedirectToWebHandler(openWebPage)

   is AuthorizationMethod.PresentationDuringIssuance -> PresentationDuringIssuanceHandler(selectCredentialsForPresentation, signVerifiablePresentation)
  }
}
```

## downloadCredential methods - library

```kotlin
fetchCredentialUsingCredentialOffer(
     credentialOffer: String,
     clientMetadata: ClientMetadata,
     getTxCode: TxCodeCallback?,
     authorizationMethods: List<AuthorizationMethod> // new
     getTokenResponse: TokenResponseCallback,
     getProofJwt: ProofJwtCallback,
     onCheckIssuerTrust: CheckIssuerTrustCallback? = null,
     downloadTimeoutInMillis: Long = Constants.DEFAULT_NETWORK_TIMEOUT_IN_MILLIS
 ): CredentialResponse
```

### consumer usage example:

```kotlin
val authorizationMethods = listOf(
    AuthorizationMethod.RedirectToWeb(
        openWebPage = { url ->
            // Wallet logic to open web page and return response
        }
    ),
    AuthorizationMethod.PresentationDuringIssuance(
        selectCredentialsForPresentation = { ovpRequest ->
            // Wallet logic to handle presentation request and return selected credentials
        },
        signVerifiablePresentation = { payload ->
            // Wallet logic to sign verifiable presentation and return signed data
        },
    )
)

fetchCredentialUsingCredentialOffer(
    credentialOffer = credentialOffer,
    clientMetadata = clientMetadata,
    getTxCode = getTxCode,
    authorizationMethods = authorizationMethods,
    getTokenResponse = getTokenResponse,
    getProofJwt = getProofJwt
)
```

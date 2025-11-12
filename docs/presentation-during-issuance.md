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
3. **Issuer - Inji Certify (OAuth AS + VCI)**: The entity responsible for issuing the credential, which also acts as an OAuth Authorization Server and Verifiable Credential Issuer.

### Sequence of interactions between entities

```mermaid
sequenceDiagram
    participant user as 👤 User
    participant wallet as 👜 Wallet
    participant issuer as 🛡️ Inji Certify<br/>(OAuth AS + VCI)

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

### Actors involved

1. **User**: The individual requesting the credential.
2. **Wallet - Inji Wallet**: The digital wallet application used by the user to manage credentials.
3. **Issuer - Inji Certify (OAuth AS + VCI)**: The entity responsible for issuing the credential, which also acts as an OAuth Authorization Server and Verifiable Credential Issuer.
4. **Inji VCI Client Library**: The library used by the wallet to handle OpenID for VC issuance. (Download of credential into Wallet)
5. **Inji OpenID4VP Library**: The library used by the wallet to handle OpenID for Verifiable Presentations. (Wallet presenting of the credential to a Verifier)

```mermaid
sequenceDiagram
    participant user as 👤 User
    participant wallet as 👜 Wallet
    participant vciClient as 📚 Inji VCI Client Library (inji-vci-client)
    participant openid4vp as 📚 Inji OpenID4VP Library (inji-openid4vp)
    participant issuer as 🛡️ Inji Certify<br/>(OAuth AS + VCI)
    Note over user, vciClient: User initiates credential download in the wallet (via Credential offer or Trusted Issuer flow)
    wallet ->> vciClient: 0. requests for Credential download <br/> requestCredentialFromTrustedIssuer(<br/>"<credentialIssuer>",<br/><credentialConfigurationId>,<br/>ClientMetadata("client-id", "https://sampleApp/redirect-uri", supportedInteractionTypesOfWallet),<br/>authorizeUser: authorizeUserCallback,<br/>getTokenResponse: tokenResponseCallback, <br/>getProofJwt: proofJwtCallback,<br/> interactionCallbacks: mapOf(InteractionCallback(type=InteractionType.OPENID4VP_PRESENTATION, callback=openid4vpInteractionCallback))<br/>)
    Note over vciClient, issuer: 1. Discovery of Issuer and Authorization Server metadata
    vciClient->>issuer: 1.1. GET /.well-known/openid-credential-issuer
    issuer->>vciClient: 1.2. Credential Issuer metadata
    vciClient->>issuer: 1.3. GET /.well-known/oauth-authorization-server
    issuer->>vciClient: 1.4. OAuth Authorization server(AS) metadata
    Note over wallet, issuer: Authorization to download credential
    alt Authorization server supports interactive interaction <br/>(`interactive_authorization_endpoint` available in Authorization Server metadata)
        vciClient ->> issuer: 2. Initial request to interaction endpoint (Happens in PAR mode)<br/>POST Content-Type: application/x-www-form-urlencoded /iar<br/>{response_type="code", client_id, code_challenge, code_challenge_method:"S256", redirect_uri, interaction_types_supported=openid4vp_presentation, <br/>authorization_details=[{"type": "openid_credential", "locations": [ "https://credential-issuer.example.com" ], "credential_configuration_id": "UniversityDegreeCredential" }]}
        alt Successful interaction response
            issuer ->> vciClient: 3. 200 Interactive Authorization Response
            Note over wallet, issuer: Presentation Flow with Issuer
            Note over wallet, issuer: The response body has the structure<br/>{status:"require_interaction", type:"openid4vp_presentation", auth_session:"..random string",<br/>//Presentation request<br/>openid4vp_request: {standard ovp request by value with response_mode as "iar-post" or "iar-post.jwt"}}
            vciClient ->> openid4vp: 4. Validating the openid4vp request received from Issuer
            openid4vp ->> vciClient: Return AuthorizationRequest (ovpRequest)
            vciClient ->> wallet : 5. Handle presentation request callback to Wallet <br/>(Displaying the presentation request to the user and obtaining user consent, <br/>Filtering the credentials in Wallet which satisfies the presentation request criteria,<br/> Showing the filtered credentials to the user for selection,<br/> Obtaining user consent for sharing the selected credentials)
            wallet ->> vciClient: Return selected credentials or error for consent rejection
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
        end
    else non Interactive Authorization Request flow
        vciClient ->> issuer: i. Metadata discovery
        issuer ->> vciClient: ii. Authorization Server and Issuer metadata
        vciClient ->> issuer: iii. Authorization Request to /authorize endpoint
        issuer ->> vciClient: iv. Authorization Response with authorization code
        Note over wallet, issuer: Usual authorization Code Flow continuation
        vciClient ->> issuer: v. Token exchange occurs
        vciClient ->> issuer: vi. Credential request and issuance occurs
        issuer ->> vciClient: vii. Credential issuance response
        vciClient ->> wallet: viii. Propagate successful credential issuance response to wallet
        wallet ->> user: Show successful credential download to user 🪪
    end

```

#### Notes

- In Step 0, why is it interactionCallbacks rather than just presentationRequestCallback?
  - Because in the future, there can be other interaction types (eg - `redirect_to_web` or any custom interaction) supported during issuance as well. Hence, to keep it extensible, we have designed it this way.
- In Step 4, why is ovp request validation or any other processing propogated to Wallet rather than being handled in inji-openid4vp library?
  - Because the Wallet is responsible for user interactions, including displaying requests and obtaining user consent. Hence, the Wallet needs to validate the request and process it accordingly.
  - This also allows the Wallet to have control over how it wants to handle the presentation request and which library to use for VP response creation.
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

**Class diagram for Presentation Interaction**

```mermaid
---
config:
  layout: elk
---
classDiagram
    class PresentationInteraction {
        + constructor(handlePresentationRequest: (ovpRequest: AuthorizationRequest) -> Map<String, Map<FormatType, List<Any>>>,signVerifiablePresentation: (payload: unsignedVPToken) -> Map<FormatType, VPTokenSigningResult>,trustedVerifiers: List<Verifier>,holderId: String? = null,signatureSuite: String? = null,shouldValidateClient: Boolean = true)
        + handle(ovpRequest: Any) Map<String, Any>
    }
    class Interaction {
        <<interface>>
        +handle() Map<String, Any>
    }

    Interaction <|.. PresentationInteraction
    
    class InteractiveAuthorizationRequestService {
        + handle(endpoint: String) : String
        - initialAuthorizationRequest(endpoint: String) : InteractionResponse
        - handleInteractionResponse(interactionResponse: InteractionResponse) : void
        - submitInteractionResponse(interactionResponseBody: Map<String, Any>) : String // returns authorization code / error
    }
```

**Responsibilities - Presentation Interaction**

| Step                                                         | Task                                                                                  | Called by       | Responsibility handled by | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|--------------------------------------------------------------|---------------------------------------------------------------------------------------|-----------------|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1                                                            | Validating the openid4vp request received from Issuer                                 | inji-vci-client | inji-openid4vp            | - vci-client communicates with openid4vp library to validate the request.<br/> - Method used: authenticateVerifier (openid4vp)<br/>- sample: `authenticateVerifer(urlEncodedAuthorizationRequest = null,authorizationRequest = ovpRequest,trustedVerifiers = trustedVerifiers,shouldValidateClient = true): AuthorizationRequest`                                                                                                                                                                                        |
| 2                                                            | Displaying the presentation request to the user and obtaining user consent            | inji-vci-client | wallet (callback)         | - inji-vci-client does a callback to wallet passing the VP request and getting the matching credentials selected by user (selectedCredentials) in response.<br/>- The user consent are all handled by the callback. Basically step no 2,3,4,5 are handled and the matching credentials are returned or error for consent rejection is thrown<br/>- Method used: handlePresentationRequest (wallet)<br/>- sample: `handlePresentationRequest(ovpRequest: AuthorizationRequest) : Map<String, Map<FormatType, List<Any>>>` |
| 3                                                            | Filtering the credentials in Wallet which satisfies the presentation request criteria | -               | wallet (callback)         | <same as before>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 4                                                            | Showing the filtered credentials to the user for selection                            | -               | wallet (callback)         | <same as before>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 5                                                            | Obtaining user consent for sharing the selected credentials                           | -               | wallet (callback)         | <same as before>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 6 (success - matching credentials available + consent given) | Creating the VP response based on selected credentials                                |                 |                           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 6.1                                                          | prepare the data for signing as per the selected credentials                          | inji-vci-client | inji-openid4vp            | - vci-client communicates with openid4vp library with the selected credentials (return of handlePresentationRequest callback)<br/>- returns the unsigned data<br/>- Method used: constructUnsignedVPToken (openid4vp)<br/>- sample: `constructUnsignedVPToken(verifiableCredentials = selectedCredentials, holderId = holderId, signatureSuite = signatureSuite) :  Map<FormatType, UnsignedVPToken>`                                                                                                                    |
| 6.2                                                          | sign the data for VP creation                                                         | inji-vci-client | wallet (callback)         | - vci-client does a callback to wallet with the unsigned data (unsignedVPToken) to get the signed data (vpTokenSigningResults)<br/>- Method: signVerifiablePresentation(payload: unsignedVPToken) : Map<FormatType, VPTokenSigningResult><br/>- sample: `signVerifiablePresentation(payload = unsignedVPToken): Map<FormatType, VPTokenSigningResult {//sign the data // return signed data}`                                                                                                                            |
| 6.3                                                          | Create the successful VP response                                                     | inji-vci-client | inji-openid4vp            | - vci-client communicates with openid4vp library to get the VP response<br/>- Method: constructVPResponse(vpTokenSigningResults: Map<FormatType, VPTokenSigningResult>) : Map<String,Any>     <br/>- sample return: {vp_token: "...", presentation_submission: "..."} or {response: "..."} (encrypted - iar-post.jwt)                                                                                                                                                                                                    |
| 6 (failure - no matching credentials / no consent)           | Creating VP response based on error                                                   |                 |                           |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 6.1                                                          | Create the error VP response                                                          | inji-vci-client | inji-openid4vp            | - vci-client communicates with openid4vp library to get the error VP response<br/>- Method: constructErrorInfo(exception: Exception): Map<String, Any><br/>sample return : {error: "access_denied", error_description: "user rejected consent"}                                                                                                                                                                                                                                                                          |
| 7                                                            | Prepare the response to be sent to /iar                                               | N/A             | inji-vci-client           | - Prepare the data for response body of /iar<br/>- returns map of {openid4vp_response: <vp error / success response>}                                                                                                                                                                                                                                                                                                                                                                                                    |
| 8                                                            | Sharing the VP response to Issuer                                                     | N/A             | inji-vci-client           | - Create the final response body for /iar request by attaching "auth_session" to the response body input provided by the specific interaction<br/> (Note: The above steps are handled in PresentationInteraction whereas this step will be handled by InteractiveAuthorizationRequestService)                                                                                                                                                                                                                            |

Note: 
- Steps 1 to 7 are handled in the `PresentationInteraction` class of the `inji-vci-client` library, while step 8 is managed in the `InteractiveAuthorizationRequestService` class.
- This separation exists because step 8 is common across all interaction types, whereas steps 1 to 7 are specific to the presentation interaction type.
- Specific interaction classes provide the final response body for the `/iar` endpoint based on the interaction type only. For example:
  - In the presentation interaction type, the response body includes `auth_session` and `openid4vp_presentation`.
  - `openid4vp_presentation` is generated by the `PresentationInteraction` class, while `auth_session` is added by the `InteractiveAuthorizationRequestService` class, as it is common to all interaction types.
- In step 1, why is authenticateVerifier called with urlEncodedAuthorizationRequest = null and authorizationRequest = ovpRequest?
  - Because in this flow, the openid4vp request is received by value (as JSON and not as a URL). Hence, we pass it as authorizationRequest.


#### Changes summary

1. Inji VCI Client Library
   - Add support for client metadata to accept supported interaction types of Wallet. (interactionTypesSupported field)
   - Update requestCredentialFromTrustedIssuer and requestCredentialFromOffer methods to accept interactionCallbacks map to handle different interaction types during issuance.
   - Implement logic to handle openid4vp_presentation interaction type, including invoking the appropriate callback in the Wallet.
   - Add logic to share VP response to Issuer's /iar endpoint after receiving it from Wallet.
2. Inji OpenID4VP Library
   - Add support to validate openid4vp request with response_mode as iar-post or iar-post.jwt by skipping response_uri check.
   - Add support to create VP response for openid4vp request with response_mode as iar-post or iar-post.jwt.
   - Add method `constructVPResponse` to create VP response and return it as Map<String, Any> to Wallet.
3. Inji Wallet

- Implement the openid4vp interaction callback to handle the presentation request, display it to the user, and obtain user consent.
- Use inji-openid4vp library to process the openid4vp request and create the VP response.
- Handle error scenarios and propagate errors to the user appropriately.
- Integrate with the updated inji-vci-client library to support the new interaction flow during credential issuance.

## References

- [OpenID for Verifiable Credentials Issuance 1.1 - Interactive Authorization Request Endpoint](https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-1_1-wg-draft.html#name-interactive-authorization-e)
- [OpenID for Verifiable Presentations - Draft 23](https://openid.github.io/openid4vp/draft-23.html)
- [RFC 9126 - Pushed Authorization Requests (PAR)](https://datatracker.ietf.org/doc/html/rfc9126)
- [Spike card](https://mosip.atlassian.net/browse/INJIMOB-3601)

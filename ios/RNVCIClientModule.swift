import Foundation
import VCIClient
import React

extension Encodable {
    func toJsonString() throws -> String {
        let encoder = JSONEncoder()
        let data = try encoder.encode(self)
        return String(data: data, encoding: .utf8)!
    }
}

@objc(InjiVciClient)
class RNVCIClientModule: NSObject, RCTBridgeModule {
    
    private var vciClient: VCIClient?
    private var pendingProofContinuation: ((String) -> Void)?

    static func moduleName() -> String {
        return "InjiVciClient"
    }

    @objc
    func `init`(_ traceabilityId: String) {
        vciClient = VCIClient(traceabilityId: traceabilityId)
    }
    @objc
    func requestCredential(
        _ issuerMeta: AnyObject,
        proof: String,
        accessToken: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let issuerMetaObject = try parseIssuerMeta(from: issuerMeta)

                guard let vciClient = vciClient else {
                    reject(nil, "VCIClient is not initialized", nil)
                    return
                }

                let response = try await vciClient.requestCredential(
                    issuerMeta: issuerMetaObject,
                    proof: JWTProof(jwt: proof),
                    accessToken: accessToken
                )

                let responseString = try response?.toJsonString()
                resolve(responseString)
            } catch {
                reject(nil, error.localizedDescription, nil)
            }
        }
    }

    @objc
    func downloadCredentialViaPreAuth(
        _ issuerMeta: AnyObject,
        txCode: String?,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                let issuerMetaObject = try parseIssuerMeta(from: issuerMeta)

                guard let vciClient = vciClient else {
                    reject(nil, "VCIClient is not initialized", nil)
                    return
                }

                let response = try await vciClient.requestCredentialByPreAuthFlow(
                    issuerMetaData: issuerMetaObject,
                    txCode: txCode,
                    getProofJwt: { accessToken, cNonce in
                        if let bridge = RCTBridge.current() {
                            let payload: [String: Any] = [
                                "accessToken": accessToken,
                                "cNonce": cNonce ?? NSNull()
                            ]
                            bridge.eventDispatcher().sendAppEvent(withName: "onRequestProof", body: payload)
                        }

                        return try await withCheckedThrowingContinuation { continuation in
                            self.pendingProofContinuation = { proof in
                                continuation.resume(returning: proof)
                            }
                        }
                    }
                )

                let responseString = try response?.toJsonString()
                resolve(responseString)
            } catch {
                reject(nil, error.localizedDescription, nil)
            }
        }
    }

    @objc(sendProofFromJS:)
    func sendProofFromJS(_ proof: String) {
        pendingProofContinuation?(proof)
        pendingProofContinuation = nil
    }

    @objc
    func fetchCredentialOffer(
        _ credentialOfferData: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        Task {
            do {
                guard let vciClient = vciClient else {
                    reject(nil, "VCIClient is not initialized", nil)
                    return
                }

                let offer = try await vciClient.fetchCredentialOffer(credentialOfferData)
                let json = try offer.toJsonString()
                resolve(json)
            } catch {
                reject(nil, error.localizedDescription, nil)
            }
        }
    }

    private func parseIssuerMeta(from issuerMeta: AnyObject) throws -> IssuerMeta {
      guard let issuerMetaDict = issuerMeta as? [String: Any] else {
              throw NSError(domain: "Invalid issuerMeta format", code: 0)
          }

          guard let credentialAudience = issuerMetaDict["credentialAudience"] as? String,
                let credentialEndpoint = issuerMetaDict["credentialEndpoint"] as? String,
                let downloadTimeoutInMilliseconds = issuerMetaDict["downloadTimeoutInMilliSeconds"] as? Int,
                let credentialFormatString = issuerMetaDict["credentialFormat"] as? String,
                let credentialFormat = CredentialFormat(rawValue: credentialFormatString) else {
              throw NSError(domain: "Missing or invalid issuerMeta fields", code: 0)
          }
          let context = issuerMetaDict["context"] as? [String]
          let preAuthorizedCode = issuerMetaDict["preAuthorizedCode"] as? String
          let tokenEndpoint = issuerMetaDict["tokenEndpoint"] as? String

        switch credentialFormat {
        case .ldp_vc:
            guard let credentialType = issuerMetaDict["credentialType"] as? [String] else {
                throw NSError(domain: "Missing credentialType for ldp_vc", code: 0)
            }
            return IssuerMeta(
                credentialAudience: credentialAudience,
                credentialEndpoint: credentialEndpoint,
                downloadTimeoutInMilliseconds: downloadTimeoutInMilliseconds,
                credentialType: credentialType,
                credentialFormat: credentialFormat,
                preAuthorizedCode:preAuthorizedCode, tokenEndpoint: tokenEndpoint, context: context
            )
        case .mso_mdoc:
            guard let docType = issuerMetaDict["doctype"] as? String,
                  let claims = issuerMetaDict["claims"] as? [String: Any] else {
                throw NSError(domain: "Missing docType or claims for mso_mdoc", code: 0)
            }
            return IssuerMeta(
                credentialAudience: credentialAudience,
                credentialEndpoint: credentialEndpoint,
                downloadTimeoutInMilliseconds: downloadTimeoutInMilliseconds,
                credentialFormat: .mso_mdoc,
                docType: docType,
                claims: claims
            )
        }
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}

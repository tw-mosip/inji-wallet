import Foundation
import OpenId4VP
import React

@objc(InjiOpenId4VP)
class RNOpenId4VpModule: NSObject, RCTBridgeModule {
  
  private var openId4Vp: OpenId4VP?
  
  static func moduleName() -> String {
    return "InjiOpenId4VP"
  }
  
  @objc
  func `init`(_ traceabilityId: String) {
    openId4Vp = OpenId4VP(traceabilityId: traceabilityId)
  }
  
  @objc
  func authenticateVerifier(_ encodedAuthorizationRequest: String,
                            trustedVerifierJSON: AnyObject,
                            resolver resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        guard let verifierMeta = trustedVerifierJSON as? [[String:Any]] else {
          reject("OPENID4VP", "Invalid verifier meta format", nil)
          return
        }
      
        let trustedVerifiersList: [Verifier] = try verifierMeta.map { verifierDict in
              guard let clientId = verifierDict["client_id"] as? String,
                    let redirectUri = verifierDict["response_uri"] as? [String] else {
                  throw NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid Verifier data"])
              }
              return Verifier(clientId: clientId, redirectUri: redirectUri)
          }
        
        let authenticationResponse: AuthenticationResponse = try await openId4Vp!.authenticateVerifier(encodedAuthorizationRequest: encodedAuthorizationRequest, trustedVerifierJSON: trustedVerifiersList)
        let response = try toJsonString(authenticationResponse.response)
        resolve(response)
      } catch {
        reject("OPENID4VP", "Unable to authenticate the Verifier", error)
      }
    }
  }
  
  @objc
  func constructVerifiablePresentationToken(_ credentialsMap: AnyObject, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        guard let credentialsMap = credentialsMap as? [String:[String]] else {
          reject("OPENID4VP", "Invalid credentials map format", nil)
          return
        }
        
      let response = try await openId4Vp?.constructVerifiablePresentationToken(credentialsMap: credentialsMap)
        resolve(response)
        
      } catch {
        reject("OPENID4VP","Failed to construct verifiable presentation",error)
      }
    }
  }
  
  @objc
  func shareVerifiablePresentation(_ vpResponseMetadata: AnyObject, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    Task {
      do {
        guard let vpResponse = vpResponseMetadata as? [String:String] else {
          reject("OPENID4VP", "Invalid vp response meta format", nil)
          return
        }
        
        guard let jws = vpResponse["jws"] as String?,
              let signatureAlgorithm = vpResponse["signatureAlgorithm"] as String?,
              let publicKey = vpResponse["publicKey"] as String?,
              let domain = vpResponse["domain"] as String?
        else {
          reject("OPENID4VP", "Invalid vp response metat", nil)
          return
        }
        
        let vpResponseMeta = VPResponseMetadata(jws: jws, signatureAlgorithm: signatureAlgorithm, publicKey: publicKey, domain: domain)
        
        let response = try await openId4Vp?.shareVerifiablePresentation(vpResponseMetadata: vpResponseMeta)
        
        resolve(response)
      } catch {
        reject("OPENID4VP","Failed to send verifiable presentation",error)
      }
    }
  }
  
func toJsonString(_ jsonObject: Any) throws -> String {
    guard let jsonDict = jsonObject as? [String: String] else {
        throw NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid JSON object type"])
    }
    
    let jsonData = try JSONSerialization.data(withJSONObject: jsonDict, options: [])
    guard let jsonString = String(data: jsonData, encoding: .utf8) else {
        throw NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to convert data to string"])
    }
    
    return jsonString
}

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
}

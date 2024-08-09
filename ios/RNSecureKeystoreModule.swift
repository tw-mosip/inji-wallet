
import Foundation
import Security
import React
import securekeystore

@objc(SecureKeystore)
class SecureKeystore: NSObject, SecureKeystoreProtocol {
  
  private secureKeystore:SecureKeystoreProtocol
  
  override init() {
    self.secureKeystore=SecureKeystoreImpl()
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func generateKeyPair(_ type: String, isAuthRequired: Bool, authTimeout: Int32, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let successLambda: (Bool) -> Void = { success in
      resolve(success)
    }
    
    let failureLambda: (String, String) -> Void = { code, message in
      reject(code, message, nil)
    }
    
    
    secureKeystore.generateKeyPair(type: type, tag: type, isAuthRequired: isAuthRequired, authTimeout: authTimeout, onSuccess: successLambda, onFailure: failureLambda)
  }
  
  @objc
  func deleteKeyPair(tag: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let successLambda: (Bool) -> Void = { success in
      resolve(success)
    }
    
    let failureLambda: (String, String) -> Void = { code, message in
      reject(code, message, nil)
    }
    
    
    secureKeystore.deleteKeyPair(tag,successLambda,failureLambda)
  }
  
  @objc
  func hasAlias(tag: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let successLambda: (Bool) -> Void = { success in
      resolve(success)
    }
    
    let failureLambda: (String, String) -> Void = { code, message in
      reject(code, message, nil)
    }
    
    secureKeystore.deleteKeyPair(tag,successLambda,failureLambda)
  }
  
  @objc
  func sign(signAlgorithm: String, alias: String, data: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let successLambda: (Bool) -> Void = { success in
      resolve(success)
    }
    
    let failureLambda: (String, String) -> Void = { code, message in
      reject(code, message, nil)
    }
    secureKeystore.sign(signAlgorithm,alias,data,successLambda,failureLambda)
  }
  
  @objc
  func storeGenericKey(data: Data, account: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let successLambda: (Bool) -> Void = { success in
      resolve(success)
    }
    
    let failureLambda: (String, String) -> Void = { code, message in
      reject(code, message, nil)
    }
    
    secureKeystore.storeGenericKey(data: data, account: account)
  }
  
  @objc
  func retrieveGenericKey(account: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let successLambda: (Bool) -> Void = { success in
      resolve(success)
    }
    
    let failureLambda: (String, String) -> Void = { code, message in
      reject(code, message, nil)
    }
    
    secureKeystore.retrieveGenericKey(account: account,successLambda,failureLambda)
  }
}

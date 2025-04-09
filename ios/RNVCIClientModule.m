#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(InjiVciClient, NSObject)

// Initializes the VCIClient with appId
RCT_EXTERN_METHOD(init:(NSString *)appId)

// Requests a credential using issuer metadata, proof JWT, and access token
RCT_EXTERN_METHOD(requestCredential:(NSDictionary *)issuerMeta
                  proof:(NSString *)proof
                  accessToken:(NSString *)accessToken
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Downloads a credential using pre-authorized code flow
RCT_EXTERN_METHOD(downloadCredentialViaPreAuth:(NSDictionary *)issuerMeta
                  txCode:(NSString *)txCode
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Fetches a credential offer (value or URI)
RCT_EXTERN_METHOD(fetchCredentialOffer:(NSString *)credentialOfferData
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

// Sends proof JWT back to native side
RCT_EXTERN_METHOD(sendProofFromJS:(NSString *)jwtProof)

RCT_EXTERN_METHOD(requiresMainQueueSetup:(BOOL))

@end

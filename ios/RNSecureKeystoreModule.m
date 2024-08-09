#import <React/RCTBridgeModule.h>
#import "Inji-Swift.h" // Replace with the actual name of your Swift-generated header

@interface RCT_EXTERN_MODULE(SecureKeystore, NSObject)

RCT_EXTERN_METHOD(generateKeyPair:(NSString *)type
                  tag:(NSString *)tag
                  isAuthRequired:(BOOL)isAuthRequired
                  authTimeout:(int32_t)authTimeout
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(deleteKeyPair:(NSString *)tag
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(hasAlias:(NSString *)tag
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(sign:(NSString *)signAlgorithm
                  alias:(NSString *)alias
                  data:(NSString *)data
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(storeGenericKey:(NSData *)data
                  account:(NSString *)account
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(retrieveGenericKey:(NSString *)account
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end


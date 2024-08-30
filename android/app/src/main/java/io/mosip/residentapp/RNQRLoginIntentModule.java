package io.mosip.residentapp;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNQRLoginIntentModule extends ReactContextBaseJavaModule {


  @Override
  public String getName() {
    return "QRLoginIntent";
  }

  RNQRLoginIntentModule(ReactApplicationContext context) {
    super(context);
  }

  @ReactMethod
  public void isRequestIntent(Promise promise) {
    try {

      IntentData intentData = IntentData.getInstance();
      Boolean isIntendData = intentData.getIntendData();
      if (isIntendData) {
        promise.resolve(intentData.getQrData());
        return;
      }
      promise.resolve("");

    } catch (Exception e) {
      promise.reject("E_UNKNOWN", e.getMessage());
    }
  }

}
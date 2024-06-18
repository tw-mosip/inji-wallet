package io.mosip.residentapp;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import io.mosip.vercred.CredentialsVerifier;


public class VcVerifierModule extends ReactContextBaseJavaModule {

    public VcVerifierModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "VcVerifierModule";
    }

    @ReactMethod
    public boolean verify(String credential, Promise promise) {
        System.out.println("CredentialsVerifier verify ");
        boolean isCredentialVerified = new CredentialsVerifier().verifyCredentials(credential);
        System.out.println("CredentialsVerifier isCredentialVerified " + isCredentialVerified);
        return isCredentialVerified;
    }

}

package io.mosip.residentapp;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.text.ParseException;

import foundation.identity.jsonld.JsonLDException;
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
    public boolean verify(String credential, Promise promise) throws JsonLDException, GeneralSecurityException, IOException, ParseException {
        System.out.println("CredentialsVerifier verify ");
        boolean isCredentialVerified = new CredentialsVerifier().verifyCredentials(credential);
        System.out.println("CredentialsVerifier isCredentialVerified " + isCredentialVerified);
        return isCredentialVerified;
    }


}

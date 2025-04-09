package io.mosip.residentapp;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.gson.Gson;
import java.util.Objects;
import io.mosip.residentapp.InjiProofCallbackBridge;
import io.mosip.residentapp.VCIBridge;

import io.mosip.vciclient.VCIClient;
import io.mosip.vciclient.constants.CredentialFormat;
import io.mosip.vciclient.credentialOffer.CredentialOffer;
import io.mosip.vciclient.CredentialOfferIssuer.CredentialOfferIssuer;
import io.mosip.vciclient.credentialOffer.CredentialOfferService;
import io.mosip.vciclient.credentialResponse.CredentialResponse;
import io.mosip.vciclient.dto.IssuerMetaData;
import io.mosip.vciclient.proof.jwt.JWTProof;
import io.mosip.vciclient.proof.Proof;

public class InjiVciClientModule extends ReactContextBaseJavaModule {
    private VCIClient vciClient;
    private final ReactApplicationContext reactContext;

    public InjiVciClientModule(@Nullable ReactApplicationContext reactContext) {
        super(reactContext);

        this.reactContext = reactContext;
        VCIBridge.reactContext = this.reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "InjiVciClient";
    }

    @ReactMethod
    public void init(String appId) {
        Log.d("InjiVciClientModule", "Initializing InjiVciClientModule with " + appId);
        vciClient = new VCIClient(appId);
    }

    @ReactMethod
    public void requestCredential(ReadableMap issuerMetaData, String jwtProofValue, String accessToken,
            Promise promise) {
        try {
            IssuerMetaData constructedIssuerMetadata = constructIssuerMetaData(issuerMetaData);
            CredentialResponse response = vciClient.requestCredential(
                    constructedIssuerMetadata,
                    new JWTProof(jwtProofValue),
                    accessToken);
            promise.resolve(response.toJsonString());
        } catch (Exception exception) {
            promise.reject(exception);
        }
    }

    @ReactMethod
    public void downloadCredentialViaPreAuth(ReadableMap issuerMetaData, String userPin, Promise promise) {
        try {
            IssuerMetaData metaData = constructIssuerMetaData(issuerMetaData);

            new Thread(() -> {
                try {
                    CredentialResponse response = VCIBridge.requestCredentialByPreAuthSync(
                            vciClient,
                            metaData,
                            userPin);
                    reactContext.runOnUiQueueThread(() -> {
                        promise.resolve(response != null ? response.toJsonString() : null);
                    });
                } catch (Exception e) {
                    reactContext.runOnUiQueueThread(() -> {
                        promise.reject("VCI_DOWNLOAD_FAILED", e.getMessage(), e);
                    });
                }
            }).start();
        } catch (Exception e) {
            promise.reject("VCI_FLOW_ERROR", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void sendProofFromJS(String jwtProof) {
        InjiProofCallbackBridge.completeProof(jwtProof);
    }

    @ReactMethod
    public void fetchCredentialOfferIssuer(String input, Promise promise) {
        try {
            CredentialOfferIssuer credentialOffer = vciClient.fetchCredentialOfferIssuer(input);
            String json = new Gson().toJson(credentialOffer);
            promise.resolve(json);
        } catch (Exception e) {
            promise.reject("OFFER_FETCH_FAILED", e.getMessage(), e);
        }
    }

    private IssuerMetaData constructIssuerMetaData(ReadableMap issuerMetaData) {
        String format = issuerMetaData.getString("credentialFormat");
        String[] contextArray = null;
        if (issuerMetaData.hasKey("context") && !issuerMetaData.isNull("context")) {
            contextArray = convertReadableArrayToStringArray(issuerMetaData.getArray("context"));
        }
        if (Objects.equals(format, CredentialFormat.LDP_VC.getValue())) {
            return new IssuerMetaData(
                    issuerMetaData.getString("credentialAudience"),
                    issuerMetaData.getString("credentialEndpoint"),
                    issuerMetaData.getInt("downloadTimeoutInMilliSeconds"),
                    convertReadableArrayToStringArray(issuerMetaData.getArray("credentialType")),
                    contextArray,
                    CredentialFormat.LDP_VC,
                    null,
                    null,
                    issuerMetaData.getString("preAuthorizedCode"),
                    issuerMetaData.getString("tokenEndpoint"));
        } else if (Objects.equals(format, CredentialFormat.MSO_MDOC.getValue())) {
            return new IssuerMetaData(
                    issuerMetaData.getString("credentialAudience"),
                    issuerMetaData.getString("credentialEndpoint"),
                    issuerMetaData.getInt("downloadTimeoutInMilliSeconds"),
                    null,
                    null,
                    CredentialFormat.MSO_MDOC,
                    issuerMetaData.getString("doctype"),
                    issuerMetaData.getMap("claims").toHashMap(),
                    null,
                    null);
        } else {
            throw new IllegalStateException("Unexpected credential format: " + format);
        }
    }

    private String[] convertReadableArrayToStringArray(ReadableArray readableArray) {
        String[] stringArray = new String[readableArray.size()];
        for (int i = 0; i < readableArray.size(); i++) {
            stringArray[i] = readableArray.getString(i);
        }
        return stringArray;
    }
}

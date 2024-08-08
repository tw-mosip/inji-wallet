package io.mosip.residentapp;


import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

import io.mosip.injivcrenderer.InjiVcRenderer;

public class InjiVcRendererModule extends ReactContextBaseJavaModule {
    private InjiVcRenderer injiVcRenderer;
    public InjiVcRendererModule(ReactApplicationContext reactContext) {
        super(reactContext);
        injiVcRenderer = new InjiVcRenderer();

    }

    @Override
    public String getName() {
        return "InjiVcRenderer";
    }


    @ReactMethod
    public void renderSvg(String vcJsonString, Promise promise) {
        try {
            String replacedTemplate = injiVcRenderer.renderSvg(vcJsonString);
            promise.resolve(replacedTemplate);
        } catch (Exception e) {
            promise.reject("ERROR_REPLACING_PLACEHOLDERS", "Error while replacing placeholders in SVG Template: " + e.getMessage());
        }
    }
}
package io.mosip.residentapp

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.CompletableDeferred

class InjiProofCallbackBridge {
    companion object {
        private var deferredProof: CompletableDeferred<String>? = null

        @JvmStatic
        fun createAndSetDeferred(): CompletableDeferred<String> {
            val deferred = CompletableDeferred<String>()
            deferredProof = deferred
            return deferred
        }

        @JvmStatic
        fun emitAccessTokenToJS(context: ReactApplicationContext, accessToken: String, cNonce: String?) {
            val params = Arguments.createMap().apply {
                putString("accessToken", accessToken)
                if (cNonce != null) {
                    putString("cNonce", cNonce)
                }
            }
            context
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onRequestProof", params)
        }

        @JvmStatic
        fun completeProof(jwt: String) {
            deferredProof?.complete(jwt)
            deferredProof = null
        }

        @JvmStatic
        suspend fun awaitDeferredResult(): String {
            return deferredProof?.await()
                ?: throw IllegalStateException("No proof callback was set. Did you forget to call createAndSetDeferred()?")
        }
    }
}

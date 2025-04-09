package io.mosip.residentapp

import com.facebook.react.bridge.ReactApplicationContext
import io.mosip.vciclient.VCIClient
import io.mosip.vciclient.credentialResponse.CredentialResponse
import io.mosip.vciclient.dto.IssuerMetaData
import kotlinx.coroutines.runBlocking

object VCIBridge {

    // Must be set by the Java side (InjiVciClientModule) to emit events to JS
    lateinit var reactContext: ReactApplicationContext

    @JvmStatic
    fun requestCredentialByPreAuthSync(
        client: VCIClient,
        metaData: IssuerMetaData,
        userPin: String
    ): CredentialResponse? = runBlocking {
        client.requestCredentialByPreAuthFlow(
            issuerMetaData = metaData,
            userPin = userPin
        ) { accessToken: String, cNonce: String? ->
            InjiProofCallbackBridge.createAndSetDeferred()
            InjiProofCallbackBridge.emitAccessTokenToJS(reactContext, accessToken,cNonce)
            InjiProofCallbackBridge.awaitDeferredResult()
        }
    }
}

package io.mosip.residentapp.Utils;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;
import java.util.List;

import io.mosip.openID4VP.authorizationRequest.Verifier;

public class OVPUtils {
    static List<Verifier> parseVerifiers(ReadableArray verifiersArray) {
        List<Verifier> verifiers = new ArrayList();

        for (int i = 0; i < verifiersArray.size(); i++) {
            ReadableMap verifierMap = verifiersArray.getMap(i);
            String clientId = verifierMap.getString("client_id");
            ReadableArray responseUris = verifierMap.getArray("response_uris");
            List<String> responseUriList = FormatConverter.convertReadableArrayToList(responseUris);
            String jwksUri = null;
            if (verifierMap.hasKey("jwks_uri") && !verifierMap.isNull("jwks_uri")) {
                try {
                    jwksUri = verifierMap.getString("jwks_uri");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            if(verifierMap.hasKey("allow_unsigned_request")){
                boolean allowUnsignedRequest = verifierMap.getBoolean("allow_unsigned_request");
                verifiers.add(new Verifier(clientId, responseUriList, jwksUri, allowUnsignedRequest));
                continue;
            }

            verifiers.add(new Verifier(clientId, responseUriList, jwksUri));
        }

        return verifiers;
    }
}

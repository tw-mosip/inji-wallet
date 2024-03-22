import {DecodedCredential, VcIdType, VerifiableCredential} from "../../types/VC/ExistingMosipVC/vc";
import {WalletBindingResponse} from "../cryptoutil/cryptoUtil";

type VCContext = (string | Record<string, unknown>)[];
export interface VerifiablePresentation {
    '@context': VCContext;
    verifiableCredential: VerifiableCredential[];
    type: 'VerifiablePresentation';
    proof: {
        created: string;
        jws: string;
        proofPurpose: 'authentication' | string;
        type: 'RsaSignature2018' | string;
        verificationMethod: string;
        challenge: string;
        domain: string;
    };
}

export interface VC {
    id: string;
    idType: VcIdType;
    tag: string;
    credential: DecodedCredential;
    verifiableCredential: VerifiableCredential;
    verifiablePresentation?: VerifiablePresentation;
    generatedOn: Date;
    requestId: string;
    isVerified: boolean;
    lastVerifiedOn: number;
    locked: boolean;
    shouldVerifyPresence?: boolean;
    walletBindingResponse?: WalletBindingResponse;
    credentialRegistry?: string;
    isPinned?: boolean;
}

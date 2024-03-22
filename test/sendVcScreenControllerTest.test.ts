import {expect, jest, test} from '@jest/globals';
import {useSendVcScreen} from "../screens/Scan/SendVcScreenController"
import {ActorRef} from "xstate";
import {IReactXStateBridge, SelectOperator} from "../shared/interfaces/IReactXStateBridge";
import {IPlatformDependentActions} from "../shared/interfaces/IPlatformDependentActions";
import {ScanMachineEvents} from "../shared/interfaces/StateMachineEvents";
test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
});

const mockPlatformActions: IPlatformDependentActions = {
    isFaceVerificationConsent: jest.fn(),
    navigate: jest.fn(),
    SELECT_VC_ITEM: jest.fn(),
    shareableVcsMetadata: jest.fn()
}

const mockReactXStateBridge: IReactXStateBridge = {
    useSelector(scanService: ActorRef<any, any>, operator: SelectOperator): any {
    },
    useState<S>(initialState: S): any {
        return [0, null]
    },

}
test("VCScreenController can accept request", () => {
    console.log(useSendVcScreen)
    const x = jest.fn<ActorRef<any, any>>(() => {

    })
    const mockScanService = {
        send: jest.fn()
    }
    const vcService = {
        send: jest.fn()
    }
    const controller = useSendVcScreen(mockScanService as ActorRef<any, any>, vcService as ActorRef<any, any>, mockReactXStateBridge, mockPlatformActions);
    controller.ACCEPT_REQUEST()
    expect(mockScanService.send.mock.calls).toHaveLength(1)
    expect(mockScanService.send.mock.calls[0][0]).toStrictEqual(ScanMachineEvents.ACCEPT_REQUEST())
})
test("VCScreenController can request face verification consent", () => {
    console.log(useSendVcScreen)
    const x = jest.fn<ActorRef<any, any>>(() => {

    })
    const mockScanService = {
        send: jest.fn()
    }
    const vcService = {
        send: jest.fn()
    }
    const controller = useSendVcScreen(mockScanService as ActorRef<any, any>, vcService as ActorRef<any, any>, mockReactXStateBridge, mockPlatformActions);

    controller.FACE_VERIFICATION_CONSENT(true)
    expect(mockScanService.send.mock.calls).toHaveLength(1)
    expect(mockScanService.send.mock.calls[0][0]).toStrictEqual(ScanMachineEvents.FACE_VERIFICATION_CONSENT(true))
})

test("VCScreenController can send updated vc name", () => {
    console.log(useSendVcScreen)
    const x = jest.fn<ActorRef<any, any>>(() => {

    })
    const mockScanService = {
        send: jest.fn()
    }
    const vcService = {
        send: jest.fn()
    }
    const controller = useSendVcScreen(mockScanService as ActorRef<any, any>, vcService as ActorRef<any, any>, mockReactXStateBridge, mockPlatformActions);

    controller.UPDATE_VC_NAME("random")
    // expect(mockScanService.send.mock.calls).toHaveLength(1)
    console.log(ScanMachineEvents.UPDATE_VC_NAME("random"))
    expect(mockScanService.send.mock.calls[0][0]).toStrictEqual(ScanMachineEvents.UPDATE_VC_NAME("random"))
    expect(mockScanService.send.mock.calls[0][0]).toStrictEqual({vcName: "random"})
})

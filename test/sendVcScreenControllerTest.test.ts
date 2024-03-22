import {expect, jest, test} from '@jest/globals';
import {useSendVcScreen} from "../screens/Scan/SendVcScreenController"
import {ActorRef} from "xstate";
import {IReactStuff, SelectOperator} from "../shared/interfaces/IReactStuff";
import {IPlatformDependentActions} from "../shared/interfaces/IPlatformDependentActions";
test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
});

const mockPlatformActions: IPlatformDependentActions = {
    isFaceVerificationConsent: jest.fn(),
    navigate: jest.fn(),
    SELECT_VC_ITEM: jest.fn()
}

const mockReactStuff: IReactStuff = {
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
    const controller = useSendVcScreen(mockScanService as ActorRef<any, any>, vcService as ActorRef<any, any>, mockReactStuff, mockPlatformActions);
    controller.ACCEPT_REQUEST()
    controller.ACCEPT_REQUEST()
    expect(mockScanService.send.mock.calls).toHaveLength(2)
})

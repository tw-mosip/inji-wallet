import {expect, jest, test} from '@jest/globals';
import {useSendVcScreen} from "../screens/Scan/SendVcScreenController"
import {ActorRef} from "xstate";
test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
});

test("VCScreenController can accept request", () => {
    console.log(useSendVcScreen)
    // const x = jest.fn<ActorRef<any, any>>(() => {
    //
    // })
    // const mockScanService = {
    //     send: jest.fn()
    // }
    // const vcService = {
    //     send: jest.fn()
    // }
    // const controller = useSendVcScreen(mockScanService as ActorRef<any, any>, vcService as ActorRef<any, any>);
    // controller.ACCEPT_REQUEST()
    // expect(mockScanService.send.mock.calls).toHaveLength(1)
})

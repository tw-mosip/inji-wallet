import {ActorRef, ActorRefFrom} from "xstate";
import {ExistingMosipVCItemMachine} from "../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine";
import {ScanMachineEvents} from "./StateMachineEvents";
import {VCShareFlowType} from "../Utils";
import {IReactXStateBridge} from "./IReactXStateBridge";
import {selectIsFaceVerificationConsent} from "../../machines/bleShare/scan/scanMachine";
import {BOTTOM_TAB_ROUTES} from "../../routes/routesConstants";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {RootRouteProps} from "../../routes";
import {IPlatformDependentActions} from "./IPlatformDependentActions";
import {selectShareableVcsMetadata} from "../../machines/VCItemMachine/vc";

type MyVcsTabNavigation = NavigationProp<RootRouteProps>;

export class PlatformDependentActions implements IPlatformDependentActions {
    private bridge: IReactXStateBridge
    private scanService: ActorRef<any, any>
    isFaceVerificationConsent: ActorRef<any, any>
    private navigation: MyVcsTabNavigation;

    constructor(bridge: IReactXStateBridge, scanService: ActorRef<any, any>) {
        this.bridge = bridge;
        this.scanService = scanService;
        this.isFaceVerificationConsent = bridge.useSelector(scanService, selectIsFaceVerificationConsent)
        this.navigation = useNavigation<MyVcsTabNavigation>();

    }

    shareableVcsMetadata = (vcService: ActorRef<any, any>) => {
        return this.bridge.useSelector(
            vcService,
            selectShareableVcsMetadata,
        )
    }

    navigate = <RouteName extends string>(...args: RouteName extends unknown ? [screen: RouteName] | [screen: RouteName, params: object | undefined] : never) => {
        this.navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
    };
    SELECT_VC_ITEM = (index: number) => (vcRef: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => {
        const [selectedIndex, setSelectedIndex] = this.bridge.useState<number>(null);
        setSelectedIndex(index);
        const {serviceRefs, ...vcData} = vcRef.getSnapshot().context;
        this.scanService.send(
            ScanMachineEvents.SELECT_VC(vcData, VCShareFlowType.SIMPLE_SHARE),
        );
    }


    // navigate = (routeName: keyof MainBottomTabParamList, params: any) => {
    //     this.navigation.navigate(BOTTOM_TAB_ROUTES.home, {screen: 'HomeScreen'});
    //
    // }
}

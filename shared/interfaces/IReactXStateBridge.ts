import {ActorRef, StateFrom} from "xstate";
import {scanMachine} from "../../machines/bleShare/scan/scanMachine";
import {VCMetadata} from "../VCMetadata";

type State = StateFrom<typeof scanMachine>;
export type SelectOperator = (state: State) => any;

export interface IReactXStateBridge {
    useSelector: (scanService: ActorRef<any, any>, operator: (state: State) => VCMetadata[]) => any
    useState: <S>(initialState: S) => any
}

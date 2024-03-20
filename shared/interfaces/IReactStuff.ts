import {ActorRef, StateFrom} from "xstate";
import {scanMachine} from "../../machines/bleShare/scan/scanMachine";

type State = StateFrom<typeof scanMachine>;
export type SelectOperator = (state: State) => any;

export interface IReactStuff {
    useSelector: (scanService: ActorRef<any, any>, operator: SelectOperator) => any
    useState: <S>(initialState: S) => any
}

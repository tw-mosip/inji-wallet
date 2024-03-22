import {IReactXStateBridge, SelectOperator} from '../interfaces/IReactXStateBridge';
import {ActorRef} from 'xstate';
import {useSelector} from '@xstate/react';
import {useState} from 'react';

export const realReactXstateBridge: IReactXStateBridge = {
  useSelector: function (
    scanService: ActorRef<any, any>,
    operator: SelectOperator,
  ) {
    return useSelector(scanService, operator);
  },
  useState: function <S>(initialState: S) {
    return useState<S>(initialState);
  },
};

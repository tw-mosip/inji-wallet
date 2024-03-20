import {IReactStuff, SelectOperator} from '../interfaces/IReactStuff';
import {ActorRef} from 'xstate';
import {useSelector} from '@xstate/react';
import {useState} from 'react';

export const realReactStuff: IReactStuff = {
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

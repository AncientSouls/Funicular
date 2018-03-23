import * as _ from 'lodash';

import {
  TClass,
  IInstance,
} from 'ancient-mixins/lib/mixins';

import {
  Manager,
  IManager,
  IManagerEventsList,
} from 'ancient-mixins/lib/manager';

import {
  Funicular,
  IFunicular,
  IFunicularEventsList,
  IFunicularEventData,
  TFunicular,
} from './funicular';

type TFunicularsManager = IFunicularsManager<TFunicular, IFunicularsManagerEventsList>;

interface IFunicularsManagerEventsList
extends IManagerEventsList {}

interface IFunicularsManager
<IN extends TFunicular, IEventsList extends IFunicularsManagerEventsList>
extends IManager<IN, IEventsList> {}

function mixin<T extends TClass<IInstance>>(
  superClass: T,
  Node: TClass<IInstance> = Funicular,
): any {
  return class FunicularsManager extends superClass {
    Node = Node;
  };
}

const MixedFunicularsManager: TClass<TFunicularsManager> = mixin(Manager);
class FunicularsManager extends MixedFunicularsManager {}

export {
  mixin as default,
  mixin,
  MixedFunicularsManager,
  FunicularsManager,
  IFunicularsManager,
  IFunicularsManagerEventsList,
  TFunicularsManager,
};

import * as _ from 'lodash';

import {
  TClass,
  IInstance,
} from 'ancient-mixins/lib/mixins';

import {
  Node,
  INode,
  INodeEventsList,
} from 'ancient-mixins/lib/node';

import {
  TCursor,
  ICursor,
  ICursorEventsList,
} from 'ancient-cursor/lib/cursor';

import {
  IFunicularEventData,
  IFunicularEventsList,
  IFunicular,
  mixin as funicularMixin,
} from './funicular';

import {
  IFunicularsManager,
  IFunicularsManagerEventsList,
  FunicularsManager,
} from '../lib/funiculars-manager';

type TExecutableFunicular =
IExecutableFunicular<
TExecutableFunicularCursor,
IFunicularEventsList<IFunicularEventData>
>;

interface IExecutableFunicularCursorData {
  type: string;
  globalName: string;
  value: any;
  childs: { [localName: string]: string };
}

interface IExecutableFunicularCursor<IE extends ICursorEventsList> extends ICursor<IE>{
  data: undefined|IExecutableFunicularCursorData;
}

type TExecutableFunicularCursor = IExecutableFunicularCursor<ICursorEventsList>;

interface IExecutableFunicular<
IC extends TExecutableFunicularCursor,
IEventsList extends IFunicularEventsList<IFunicularEventData>
> extends IFunicular<IC, IEventsList> {}

export {
  IExecutableFunicular,
  TExecutableFunicular,
  IExecutableFunicularCursor,
  TExecutableFunicularCursor,
  IExecutableFunicularCursorData,
};

import { TClass, IInstance } from 'ancient-mixins/lib/mixins';
import { IManager, IManagerEventsList } from 'ancient-mixins/lib/manager';
import { TFunicular } from './funicular';
declare type TFunicularsManager = IFunicularsManager<TFunicular, IFunicularsManagerEventsList>;
interface IFunicularsManagerEventsList extends IManagerEventsList {
}
interface IFunicularsManager<IN extends TFunicular, IEventsList extends IFunicularsManagerEventsList> extends IManager<IN, IEventsList> {
}
declare function mixin<T extends TClass<IInstance>>(superClass: T, Node?: TClass<IInstance>): any;
declare const MixedFunicularsManager: TClass<TFunicularsManager>;
declare class FunicularsManager extends MixedFunicularsManager {
}
export { mixin as default, mixin, MixedFunicularsManager, FunicularsManager, IFunicularsManager, IFunicularsManagerEventsList, TFunicularsManager };

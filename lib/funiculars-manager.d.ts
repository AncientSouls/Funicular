import { TClass, IInstance } from 'ancient-mixins/lib/mixins';
import { IManager, IManagerEventsList } from 'ancient-mixins/lib/manager';
import { IFunicularEventsList, IFunicularEventData, TFunicular } from './funicular';
declare type TFunicularsManager = IFunicularsManager<TFunicular, IFunicularsManagerEventsList>;
interface IFunicularsManagerEventData extends IFunicularEventData {
    manager: TFunicularsManager;
}
interface IFunicularsManagerEventsList extends IManagerEventsList, IFunicularEventsList<IFunicularsManagerEventData> {
}
interface IFunicularsManager<IN extends TFunicular, IEventsList extends IFunicularsManagerEventsList> extends IManager<IN, IEventsList> {
}
declare function mixin<T extends TClass<IInstance>>(superClass: T): any;
declare const MixedFunicularsManager: TClass<TFunicularsManager>;
declare class FunicularsManager extends MixedFunicularsManager {
}
export { mixin as default, mixin, MixedFunicularsManager, FunicularsManager, IFunicularsManager, IFunicularsManagerEventData, IFunicularsManagerEventsList, TFunicularsManager };

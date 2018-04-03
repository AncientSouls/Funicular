import { TClass, IInstance } from 'ancient-mixins/lib/mixins';
import { INode, INodeEventsList } from 'ancient-mixins/lib/node';
import { TCursor } from 'ancient-cursor/lib/cursor';
import { TFunicularsManager } from './funiculars-manager';
declare type TFunicular = IFunicular<TCursor, IFunicularEventsList<IFunicularEventData>>;
declare enum EFunicularState {
    Constructed = 0,
    Mounting = 1,
    Mounted = 2,
    Remounting = 3,
    Unmounting = 4,
    Unmounted = 5,
}
interface IFunicularEventData {
    funicular: TFunicular;
}
interface IFunicularEventsList<ID extends IFunicularEventData> extends INodeEventsList {
    mount: ID;
    cursorFilling: ID;
    cursorFilled: ID;
    childsMounting: ID;
    childsMounted: ID;
    starting: ID;
    started: ID;
    mounted: ID;
    remount: ID;
    remounted: ID;
    unmount: ID;
    stopping: ID;
    stopped: ID;
    childsUnmounting: ID;
    childsUnmounted: ID;
    unmounted: ID;
}
interface IFunicularClone {
    (instance: IInstance): IInstance;
}
interface IFunicular<IC extends TCursor, IEventsList extends IFunicularEventsList<IFunicularEventData>> extends INode<IEventsList> {
    clone: IFunicularClone;
    state: EFunicularState;
    childs: TFunicularsManager;
    parents: TFunicularsManager;
    cursor: IC;
    result: any;
    needRemount: boolean;
    needUnmount: boolean;
    remounted: TFunicular;
    mount(cursor: IC): Promise<void>;
    remount(): Promise<any>;
    unmount(): Promise<any>;
    register(): Promise<any>;
    unregister(): Promise<any>;
    cursorFilling(): Promise<any>;
    childsMounting(): Promise<any>;
    childsUnmounting(): Promise<any>;
    requestChilds(): Promise<any>;
    abandonChilds(): Promise<any>;
    start(): Promise<any>;
    stop(): Promise<any>;
    starting(): Promise<any>;
    stopping(): Promise<any>;
    watchChildsEvents(): void;
    unwatchChildsEvents(): void;
    childDestroyed(child: TFunicular): void;
    childRemounted(child: TFunicular): void;
    addParentToChilds(): void;
    cloneAndMount(): Promise<any>;
}
declare function mixin<T extends TClass<IInstance>>(superClass: T, clone: IFunicularClone): any;
declare const MixedFunicular: TClass<TFunicular>;
declare class Funicular extends MixedFunicular {
}
export { mixin as default, mixin, MixedFunicular, Funicular, IFunicular, EFunicularState, IFunicularClone, IFunicularEventData, IFunicularEventsList, TFunicular };

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
} from 'ancient-cursor/lib/cursor';

import {
  FunicularsManager,
  TFunicularsManager,
} from './funiculars-manager';

type TFunicular = IFunicular<IFunicularEventsList<IFunicularEventData>>;

enum EFunicularState {
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

interface IFunicularEventListener {
  (data: IFunicularEventData): void;
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

interface IFunicularCallback {
  (): void;
}

interface IFunicular<IEventsList extends IFunicularEventsList<IFunicularEventData>>
extends INode<IEventsList> {
  Node: TClass<TFunicular>;
  
  state: EFunicularState;
  
  childs: TFunicularsManager;
  parents: TFunicularsManager;
  
  cursor: TCursor;
  result: any;
  
  needRemount: boolean;
  needUnmount: boolean;
  
  remounted: TFunicular;
  
  mount(cursor: TCursor): void;
  remount(): void;
  unmount(): void;
  
  register(callback: IFunicularCallback): void;
  unregister(callback: IFunicularCallback): void;
  
  cursorFilling(callback: IFunicularCallback): void;
  
  childsMounting(callback: IFunicularCallback): void;
  childsUnmounting(callback: IFunicularCallback): void;
  
  requestChilds(callback: IFunicularCallback): void;
  abandonChilds(callback: IFunicularCallback): void;
  
  start(callback: IFunicularCallback): void;
  stop(callback: IFunicularCallback): void;
  
  starting(callback: IFunicularCallback): void;
  stopping(callback: IFunicularCallback): void;
  
  watchChildsEvents(): void;
  unwatchChildsEvents(): void;
  
  childDestroyed(child: TFunicular): void;
  childRemounted(child: TFunicular): void;
  
  addParentToChilds(): void;
  cloneAndMount(callback: IFunicularCallback): void;
}

function mixin<T extends TClass<IInstance>>(
  superClass: T,
): any {
  return class Funicular extends Node {
    Node = Funicular;
    
    state = EFunicularState.Constructed;
    
    childs = new FunicularsManager();
    parents = new FunicularsManager();
    
    cursor;
    result;
    
    needRemount = false;
    needUnmount = false;
    
    remounted;
    
    mount(cursor) {
      if (this.state !== EFunicularState.Constructed) {
        throw new Error(`Funicular ${this.id} is already mounted.`);
      }
      
      this.cursor = cursor;
      
      this.state = EFunicularState.Mounting;
      this.emit('mounting', { funicular: this });
      this.register(_.once(() => {
        this.cursorFilling(_.once(() => {
          this.childsMounting(_.once(() => {
            this.start(_.once(() => {
              this.watchChildsEvents();
              this.addParentToChilds();
              this.state = EFunicularState.Mounted;
              this.emit('mounted', { funicular: this });
              
              if (this.needUnmount) this.unmount();
              else if (this.needRemount) this.remount();
            }));
          }));
        }));
      }));
    }
    
    remount() {
      if (this.state === EFunicularState.Mounted) {
        this.state = EFunicularState.Remounting;
        this.emit('remounting', { funicular: this });
        this.unregister(_.once(() => {
          this.cloneAndMount(_.once(() => {
            this.emit('remounted', { funicular: this });
            this.unmount();
          }));
        }));
      } else this.needRemount = true;
    }
    
    unmount() {
      if (this.state === EFunicularState.Mounted || this.state === EFunicularState.Remounting) {
        this.state = EFunicularState.Unmounting;
        this.emit('unmounting', { funicular: this });
        this.stop(_.once(() => {
          this.childsUnmounting(_.once(() => {
            this.unwatchChildsEvents();
            this.unregister(_.once(() => {
              this.state = EFunicularState.Unmounted;
              this.emit('unmounted', { funicular: this });
              this.destroy();
            }));
          }));
        }));
      } else this.needUnmount = true;
    }
    
    register(callback) {
      throw new Error('Method register must defined in this class!');
    }
    
    unregister(callback) {
      throw new Error('Method unregister must defined in this class!');
    }
    
    cursorFilling(callback) {
      this.emit('cursorFilling', { funicular: this });
      if (_.isUndefined(this.cursor.data)) {
        this.cursor.once('changed', () => this.cursorFilling(callback));
      } else {
        this.cursor.once('changed', () => this.remount());
        this.emit('cursorFilled', { funicular: this });
        callback();
      }
    }
    
    childsMounting(callback) {
      this.emit('childsMounting', { funicular: this });
      this.requestChilds(_.once(() => {
        this.emit('childsMounted', { funicular: this });
        callback();
      }));
    }
    
    childsUnmounting(callback) {
      this.emit('childsUnmounting', { funicular: this });
      this.abandonChilds(_.once(() => {
        this.emit('childsUnmounted', { funicular: this });
        callback();
      }));
    }
    
    requestChilds(callback) {
      throw new Error('Method requestChilds must defined in this class!');
    }
    
    abandonChilds(callback) {
      throw new Error('Method abandonChilds must defined in this class!');
    }
    
    start(callback) {
      this.emit('starting', { funicular: this });
      this.starting(_.once(() => {
        this.emit('started', { funicular: this });
        callback();
      }));
    }
    
    stop(callback) {
      this.emit('stopping', { funicular: this });
      this.stopping(_.once(() => {
        this.emit('stopped', { funicular: this });
        callback();
      }));
    }
    
    starting(callback) {
      throw new Error('Method starting must defined in this class!');
    }
    
    stopping(callback) {
      throw new Error('Method stopping must defined in this class!');
    }
    
    watchChildsEvents() {
      this.removedListener = ({ node }) => node.remounted || this.childDestroyed(node);
      this.remountedListener = ({ funicular }) => this.childRemounted(funicular);
      this.childs.on('removed', this.removedListener);
      this.childs.on('remounted', this.remountedListener);
    }
    
    unwatchChildsEvents() {
      this.childs.off('removed', this.removedListener);
      this.childs.off('remounted', this.remountedListener);
    }
    
    childDestroyed(child) {
      this.remount();
    }
    
    childRemounted(child) {
      this.remount();
    }
    
    addParentToChilds() {
      _.each(this.childs.nodes, child => child.parents.add(this));
    }
    
    cloneAndMount(callback) {
      const clone = new this.Node(this.id);
      clone.on('mounted', () => {
        this.remounted = clone;
        callback();
      });
      clone.mount(this.cursor);
    }
  };
}

const MixedFunicular: TClass<IFunicular<IFunicularEventsList<IFunicularEventData>>> = mixin(Node);
class Funicular extends MixedFunicular {}

export {
  mixin as default,
  mixin,
  MixedFunicular,
  Funicular,
  IFunicular,
  EFunicularState,
  IFunicularCallback,
  IFunicularEventData,
  IFunicularEventListener,
  IFunicularEventsList,
  TFunicular,
};

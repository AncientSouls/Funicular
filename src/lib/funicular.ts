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

type TFunicular = IFunicular<TCursor, IFunicularEventsList<IFunicularEventData>>;

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

interface IFunicular<
IC extends TCursor,
IEventsList extends IFunicularEventsList<IFunicularEventData>
> extends INode<IEventsList> {
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

function mixin<T extends TClass<IInstance>>(
  superClass: T,
  clone: IFunicularClone,
): any {
  return class FunicularMixed extends superClass {
    clone = clone;
    
    state = EFunicularState.Constructed;
    
    childs = new FunicularsManager();
    parents = new FunicularsManager();
    
    cursor;
    result;
    
    needRemount = false;
    needUnmount = false;
    
    remounted;
    
    async mount(cursor) {
      if (this.state !== EFunicularState.Constructed) {
        throw new Error(`Funicular ${this.id} is already mounted.`);
      }
      
      this.cursor = cursor;
      
      this.state = EFunicularState.Mounting;
      this.emit('mounting', { funicular: this });

      await this.register();
      await this.cursorFilling();
      await this.childsMounting();
      await this.start();
      
      this.watchChildsEvents();
      this.addParentToChilds();
      this.state = EFunicularState.Mounted;
      this.emit('mounted', { funicular: this });
              
      if (this.needUnmount) await this.unmount();
      else if (this.needRemount) await this.remount();
    }
    
    async remount() {
      if (this.state === EFunicularState.Mounted) {
        this.state = EFunicularState.Remounting;
        this.emit('remounting', { funicular: this });
        await this.unregister();
        await this.cloneAndMount();

        this.emit('remounted', { funicular: this });

        await this.unmount();
      } else this.needRemount = true;
    }
    
    async unmount() {
      if (this.state === EFunicularState.Mounted || this.state === EFunicularState.Remounting) {
        this.state = EFunicularState.Unmounting;
        this.emit('unmounting', { funicular: this });

        await this.stop();
        await this.childsUnmounting();
        this.unwatchChildsEvents();
        await this.unregister();
        
        this.state = EFunicularState.Unmounted;
        this.emit('unmounted', { funicular: this });
        await this.destroy();
      } else this.needUnmount = true;
    }
    
    register() {
      throw new Error('Method register must defined in this class!');
    }
    
    unregister() {
      throw new Error('Method unregister must defined in this class!');
    }
    
    cursorFilling() {
      this.emit('cursorFilling', { funicular: this });
      return new Promise((resolve) => {
        if (_.isUndefined(this.cursor.data)) {
          this.cursor.once('changed', async () => {
            await this.cursorFilling();
            resolve();
          });
        } else {
          this.cursor.once('changed', () => this.remount());
          this.emit('cursorFilled', { funicular: this });
          resolve();
        }
      });
    }
    
    async childsMounting() {
      this.emit('childsMounting', { funicular: this });
      await this.requestChilds();
      this.emit('childsMounted', { funicular: this });
    }
    
    async childsUnmounting() {
      this.emit('childsUnmounting', { funicular: this });
      await this.abandonChilds();
      this.emit('childsUnmounted', { funicular: this });
    }
    
    requestChilds() {
      throw new Error('Method requestChilds must defined in this class!');
    }
    
    abandonChilds() {
      throw new Error('Method abandonChilds must defined in this class!');
    }
    
    async start() {
      this.emit('starting', { funicular: this });
      await this.starting();
      this.emit('started', { funicular: this });
    }
    
    async stop() {
      this.emit('stopping', { funicular: this });
      await this.stopping();
      this.emit('stopped', { funicular: this });
    }
    
    starting() {
      throw new Error('Method starting must defined in this class!');
    }
    
    stopping() {
      throw new Error('Method stopping must defined in this class!');
    }
    
    watchChildsEvents() {
      this.removedListener = ({ node }) => node.remounted || this.childDestroyed(node);
      this.remountedListener = ({ funicular }) => this.childRemounted(funicular);
      this.childs.on('removed', this.removedListener);
      this.childs.list.on('remounted', this.remountedListener);
    }
    
    unwatchChildsEvents() {
      this.childs.off('removed', this.removedListener);
      this.childs.list.off('remounted', this.remountedListener);
    }
    
    childDestroyed(child) {
      this.remount();
    }
    
    childRemounted(child) {
      this.remount();
    }
    
    addParentToChilds() {
      _.each(this.childs.list.nodes, (child: any) => child.parents.add(this));
    }
    
    cloneAndMount() {
      return new Promise((resolve) => {
        const clone = this.clone(this);
        clone.once('mounted', () => {
          this.remounted = clone;
          resolve();
        });
        clone.mount(this.cursor);
      });
    }

    destroy() {
      if (this.state !== EFunicularState.Unmounted) {
        throw new Error(`Not unmounted funicular ${this.id} cant be destroyed.`);
      }
      return super.destroy();
    }
  };
}

const MixedFunicular: TClass<TFunicular> = mixin(Node, i => new Funicular(i.id));
class Funicular extends MixedFunicular {}

export {
  mixin as default,
  mixin,
  MixedFunicular,
  Funicular,
  IFunicular,
  EFunicularState,
  IFunicularClone,
  IFunicularEventData,
  IFunicularEventsList,
  TFunicular,
};

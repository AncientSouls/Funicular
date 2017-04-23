import each from 'async/each';

/**
 * @example
 * var carriage = new funicular.Carriage('abc');
 */
class Carriage {
  /**
   * @param {String} name
   */
  constructor(name) {
    this.name = name;
    
    /**
     * * `broken` - Broken in any method... somewere.
     * * `construct` - Not subscribed, fetched and mounted. Just constructed and registred in funicular.
     * * `fetched` - Subscribed and fetched.
     * * `mounted` - Mounted.
     * * `unmounted` - Unmounted.
     */
    this.stage = 'construct';
    // ['name']
    this.childs = [];
    // { name: Carriage }
    this._childs = {};
    // { name: Carriage }
    this._parents = {};
    this.data = undefined;
    this.roots = [];
    this.unmountedCallbacks = [];
    this.mountedCallbacks = [];
  }
  
  /**
   * Subscribe to get data, data updates and removes events.
   * Sets `carriage.unsubscribe` method for stop current subscription.
   * 
   * @param {Function} callback
   */
  subscribe(callback) {
    throw new Error('Method subscribe must be overriden!');
  }
  
  /**
   * Generate childs array from already fetched data.
   * Sets array `carriage.childs` with string names of child carriages.
   */
  getChildsNames(callback) {
    throw new Error('Method getChildsNames must be overriden!');
  }
  
  /**
   * Method for calling from subscribe method, when data is fetched.
   * Sets `this.data` key in carriage object.
   * 
   * @param error
   * @param newData
   */
  fetched(error, newData) {
    if (error) {
      this.stage = 'broken';
    } else {
      this.stage = 'fetched';
      this.data = newData;
    }
  }
  
  /**
   * Method for calling from subscribe method, when data is updated.
   * 
   * @param newData
   */
  updated(newData) {
    this.data = newData;
  }
  
  /**
   * Method for calling from subscribe method, when data is removed.
   */
  removed() {}
  
  /**
   * Register this carriage in childs.
  
  /**
   * Unsafe mount and do what need to do...
   * Attention! Not for external usage.
   * @param {Carriage~unmountCallback} [callback]
   */
  unsafeMount(callback) {
    this.stage = 'mounted';
    if (typeof(callback) == 'function') {
      callback();
    }
  }
  
  /**
   * Subscribed data by name, getting childs names, mount childs, then mount this carriage. If an error occurs, then transactions with subscriptions and children are rolled back.
   * @param {Carriage~mountCallback} [mountedCallback]
   */
  mount(mountedCallback) {
    var callback = (error) => {
      if (mountedCallback) mountedCallback(error, this);
      for (var callback of this.mountedCallbacks) {
        callback(error, this);
      }
    };
    this.subscribe((error) => {
      if (error) callback(error);
      else {
        this.getChildsNames();
        this.mountChilds((error) => {
          if (error) {
            this.unsubscribe();
            callback(error);
          }
          else this.unsafeMount(callback);
        });
      }
    });
  }
  
  /**
   * @callback Carriage~mountCallback
   * @param error
   * @param {Carriage} carriage
   */
  
  /**
   * Unsafe unmount and unregister from carriages in funicular.
   * Attention! Not for external usage.
   * @param {Carriage~unmountCallback} [callback]
   */
  unsafeUnmount(callback) {
    this.stage = 'unmounted';
    delete this.funicular.carriages[this.name][this.id];
    this.unsubscribe();
    for (var unmountedCallback of this.unmountedCallbacks) {
      unmountedCallback(this);
    }
    if (typeof(callback) == 'function') {
      callback();
    }
  }
  
  /**
   * Safe unmount, unregister from parents and childs lists in some carriages.
   * Attention! Not for external usage.
   * @param {Carriage~unmountCallback} [callback]
   */
  unmount(callback) {
    if (
      this.state != 'unmounted' && this.state != 'broken' &&
      Object.keys(this._parents).length === 0 && !this.roots.length
    ) {
      this.unmountChilds(() => {
        this.unsafeUnmount(callback);
      });
    } else if (typeof(callback) == 'function') {
      callback();
    }
  }
  
  /**
   * @callback Carriage~unmountCallback
   * @param error
   */
  
  /**
   * Mount all child names from array in `this.childs`.
   * @param {Carriage~mountCallback} [callback]
   */
  mountChilds(callback) {
    var childCarriages = [];
    each(this.childs, (child, nextChild) => {
      this.funicular.mount(child, (error, carriage) => {
        if (error) nextChild(error);
        else {
          childCarriages.push(carriage);
          nextChild();
        }
      });
    }, (error) => {
      if (error) {
        each(childCarriages, (child, nextChild) => {
          child.unmount(() => nextChild());
        }, () => {
          callback(error);
        });
      } else {
        for (var child of childCarriages) {
          this.tieChild(child);
        }
        callback();
      }
    });
  }
  
  /**
   * Tie one child with this carriage parent.
   * @param {Carriage} child
   */
  tieChild(child) {
    this._childs[child.name] = child;
    child._parents[this.name] = this;
  }
  
  /**
   * Unmount all childs from object in `this._childs`.
   * @param {Carriage~unmountCallback} [callback]
   */
  unmountChilds(callback) {
    each(this._childs, (child, nextChild) => {
      this.untieChild(child);
      child.unmount(() => nextChild());
    }, () => {
      callback();
    });
  }
  
  /**
   * Untie one child with this carriage parent.
   * @param {Carriage} child
   */
  untieChild(child) {
    delete this._childs[child.name];
    delete child._parents[this.name];
  }
  
  /**
   * Tie this carriage with some root id.
   * @param {number} rootId
   */
  tieRoot(rootId) {
    this.funicular.roots[rootId] = this;
    var index = this.roots.indexOf(rootId);
    if (index == -1) this.roots.push(rootId);
  }
  
  /**
   * Untie this carriage from some root id.
   * @param {number} rootId
   */
  untieRoot(rootId) {
    delete this.funicular.roots[rootId];
    var index = this.roots.indexOf(rootId);
    this.roots.splice(index, 1);
  }
  
  /**
   * Move roots from one carriage to other.
   * @param {Carriage} otherCarriage
   */
  moveRoots(otherCarriage) {
    otherCarriage.roots = this.roots;
    this.roots = [];
    for (var root in this.roots) {
      this.funicular.roots[root] = otherCarriage;
    }
  }
  
  /**
   * @callback Carriage~unmountedCallback
   * @param {Carriage} carriage
   */
  
}

/**
 * @example
 * import { Funicular } from 'ancient-funicular';
 * var funicular = new Funicular();
 * var OldCarriage = funicular.Carriage;
 * funicular.Carriage = class extends OldCarriage {}
 */
class Funicular {
  constructor() {
    var funicular = this;
    
    this.Carriage = class extends Carriage {
      constructor() {
        super(...arguments);
        this.funicular = funicular;
        this.id = ++this.funicular.lastCarriageId;
        
        funicular.carriages[this.name] = funicular.carriages[this.name] || {};
        funicular.carriages[this.name][this.id] = this;
      }
    };
    
    this.lastCarriageId = 0;
    this.lastRootId = 0;
    // { name: { id: Carriage, id: Carriage }, name: { id: Carriage, id: Carriage }, name: { id: Carriage, id: Carriage } }
    this.carriages = {};
    // { id: Carriage }
    this.roots = {};
  }
  
  /**
   * Method for mount new carriage in this funicular.
   * Attention! Not for external usage because not auto mark carriage aschild and parent. For external, custom usage please use method {@link Funicular#mountRoot}
   * 
   * @param {String} name
   * @param {Funicular~mountCallback} [mountedCallback] - Gets already mounted or broken carriage.
   * @param {Funicular~unmountedCallback} [unmountedCallback] - Gets unmounted carriage.
   */
  mount(name, mountedCallback, unmountedCallback) {
    var carriage = new this.Carriage(name);
    var mountedCallback = mountedCallback || ((error) => { throw error; });
    if (mountedCallback) carriage.mountedCallbacks.push(mountedCallback);
    if (unmountedCallback) carriage.unmountedCallbacks.push(unmountedCallback);
    carriage.mount();
  }
  
  /**
   * Method for mount new carriage in this funicular as root.
   * Use for unmount method {@link Carriage#unmountRoot}
   * 
   * @param {String} name
   * @param {Funicular~mountCallback} [mountedCallback] - Gets already mounted or broken carriage.
   * @param {Funicular~unmountedCallback} [unmountedCallback] - Gets unmounted carriage.
   * 
   * @example
   * funicular.mountRoot(
   *   'someDataReference',
   *   (error, carriage, unmountCarriage) => {
   *     // carriage someDataReference with all childs are mounted
   *     setTimeout(() => { unmountCarriage(); }, 1000);
   *   },
   *   (carriage) => {
   *     // carriage someDataReference and free of parents childs are unmounted 
   *   }
   * );
   */
  mountRoot(name, mountedCallback, unmountedCallback) {
    var rootId = ++this.lastRootId;
    this.mount(name, (error, carriage) => {
      if (!error) {
        carriage.tieRoot(rootId);
      }
      var unmountRoot = (callback) => {
        if (this.roots[rootId]) {
          var carriage = this.roots[rootId];
          carriage.untieRoot(rootId);
          carriage.unmount(callback);
        } else callback();
      };
      mountedCallback(error, carriage, unmountRoot);
    }, unmountedCallback);
  }
  
  /**
   * @callback Funicular~mountCallback
   * @param error
   * @param {Carriage} carriage
   */
  
  /**
   * @callback Funicular~unmountedCallback
   * @param {Carriage} carriage
   */
};

export {
  Funicular as default,
  Carriage,
}
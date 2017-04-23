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
     * * 'broken' - Broken in any method... somewere.
     * * 'construct' - Not subscribed, fetched and mounted. Just constructed and registred in funicular.
     * * 'fetched' - Subscribed and fetched.
     * * 'mounted' - Mounted.
     * * 'unmounted' - Unmounted.
     */
    this.stage = 'construct';
    // ['name']
    this.childs = [];
    // { name: Carriage }
    this._childs = {};
    // { name: Carriage }
    this._parents = {};
    this.data = undefined;
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
  generateChildNamesFromData(callback) {
    throw new Error('Method generateChildNamesFromData must be overriden!');
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
   * Attention! Not for personal usage.
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
   * @param {Carriage~mountCallback} [callback]
   */
  mount(callback) {
    this.subscribe((error) => {
      if (error) callback(error);
      else {
        this.generateChildNamesFromData();
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
   */
  
  /**
   * Unsafe unmount and unregister from carriages in funicular.
   * Attention! Not for personal usage.
   * @param {Carriage~unmountCallback} [callback]
   */
  unsafeUnmount(callback) {
    this.stage = 'unmounted';
    delete this.funicular.carriages[this.name][this.id];
    this.unsubscribe();
    if (typeof(callback) == 'function') {
      callback();
    }
  }
  
  /**
   * Safe unmount, unregister from parents and childs lists in some carriages.
   * @param {Carriage~unmountCallback} [callback]
   */
  unmount(callback) {
    if (Object.keys(this._parents).length === 0) {
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
        this.id = ++this.funicular.lastId;
        
        funicular.carriages[this.name] = funicular.carriages[this.name] || {};
        funicular.carriages[this.name][this.id] = this;
      }
    };
    
    this.lastId = 0;
    // { name: { id: Carriage, id: Carriage }, name: { id: Carriage, id: Carriage }, name: { id: Carriage, id: Carriage } }
    this.carriages = {};
  }
  
  /**
   * Method for mount new carriage in this funicular.
   * 
   * @param {String} name
   * @param {Funicular~mountCallback} [callback]
   */
  mount(name, callback) {
    var carriage = new this.Carriage(name);
    var callback = callback || ((error) => { throw error; });
    carriage.mount((error) => {
      callback(error, carriage);
    });
  }
  
  /**
   * @callback Funicular~mountCallback
   * @param error
   * @param {Carriage} carriage
   */
};

export {
  Funicular as default,
  Carriage,
}
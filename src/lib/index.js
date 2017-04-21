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
   * Sets `carriage.unsubscribe` method for stop current subscribtion.
   * 
   * @param {Function} callback
   */
  subscribe(callback) {}
  
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
   * Mount already subscribed data, with some custom logic.
   * @param {Carriage~mountCallback} [callback]
   */
  mount(callback) {
    this.stage = 'mounted';
    if (typeof(callback) == 'function') {
      callback();
    }
  }
  
  /**
   * @callback Carriage~mountCallback
   * @param error
   */
  
  /**
   * Unmount and unregister from carriages in funicular.
   * @param {Carriage~unmountCallback} [callback]
   */
  unmount(callback) {
    this.stage = 'unmounted';
    delete this.funicular.carriages[this.name][this.id];
    this.unsubscribe();
    if (typeof(callback) == 'function') {
      callback();
    }
  }
  
  /**
   * @callback Carriage~unmountCallback
   * @param error
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
    carriage.subscribe((error) => {
      if (error) callback(error);
      else carriage.mount((error) => {
        if (error) callback(error);
        else callback(undefined, carriage);
      });
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
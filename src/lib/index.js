/**
 * @example
 * var carriage = new Carriage('abc');
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
   * 
   * @param {Function} callback
   * @returns {Function} Method for stop current subscribtion.
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
    this.stage = 'fetched';
    this.data = newData;
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
}

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
    carriage.subscribe(() => {
      if (typeof(callback) == 'function') {
        callback(undefined, carriage);
      }
    });
  }
  
  /**
   * @callback Funicular~mountCallback
   * @param error
   * @param {Carriage} carriage
   */
};

export {
  Funicular,
  Carriage,
}
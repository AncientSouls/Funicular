var { EventEmitter } = require('fbemitter');

var counter = 1;

/**
 * @class
 * @memberof module:ancient-funicular
 */
class Item {
  
  /**
   * @constructs Item
   * @param {Manager} manager
   * @param {string} name
   * @param [query]
   */
  constructor(manager, name, query) {
    
    /**
     * @type {number}
     * @protected
     */
    this.index = counter++;
    
    /**
     * @type {Manager}
     * @protected
     */
    this.manager = manager;
    
    /**
     * @type {string}
     * @protected
     */
    this.name = name;
    
    /**
     * @protected
     */
    this.query = query;
    
    /**
     * @protected
     */
    this.data = undefined;
    
    /**
     * @type {boolean=}
     * @protected
     */
    this.isPrepared = undefined;
    
    /**
     * @type {boolean=}
     * @protected
     */
    this.isMounted = undefined;
    
    /**
     * @type {boolean=}
     * @protected
     */
    this.isUnmounted = undefined;
    
    /**
     * @type {boolean=}
     * @protected
     */
    this.isReplaced = undefined;
    
    /**
     * @type {Object}
     * @protected
     */
    this._childs = {};
    
    /**
     * @type {Object.<string,Item>}
     * @protected
     */
    this.childs = {};
    
    /**
     * @type {Object.<string,Item>}
     * @protected
     */
    this.parents = {};
    
    /**
     * @type {EventEmitter}
     * @public
     */
    this.emitter = new EventEmitter();
    this.emitter.__emitToSubscription = function(subscription, eventType) {
      var args = Array.prototype.slice.call(arguments, 2);
      subscription.listener.apply(subscription.context, args);
    };
  }
  
  /**
   * @param {LocalName} localName
   * @param {GlobalName} globalName
   * @param query
   */
  prepareChild(localName, globalName, query) {
    var child = this.manager.get(globalName, query);
    this._registerChild(localName, child);
    return child;
  }
  
  /**
   * @fires Item#replaced
   * @param {LocalName} localName
   * @param {Item} child
   */
  _registerChild(localName, child) {
    this._childs[localName] = child;
    this._childs[localName].emitter.once('replaced', (oldChild, newChild) => {
      this._childReplaced(localName, oldChild, newChild);
    });
    this._childs[localName].emitter.once('unmounted', (error, child) => {
      if (this._childs[localName] == child) this.childUnmounted(localName, child);
    });
    if (this.isMounted) child.mount();
    else if (this.isPrepared) child.prepare((childError, child) => {
      this._childPrepared(localName, childError, child);
    });
  }
  
  /**
   * @param {LocalName} localName
   * @param {Item} oldChild
   * @param {Item} newChild
   */
  _childReplaced(localName, oldChild, newChild) {
    if (!this.isPrepared || Object.keys(this._childs).length) this._registerChild(localName, newChild);
    else this.childReplaced(localName, oldChild, newChild);
  }
  
  /**
   * @param {LocalName} localName
   * @param {Item} oldChild
   * @param {Item} newChild
   * @description
   * **must override**
   */
  childReplaced(localName, oldChild, newChild) {
    throw new Error('Method childReplaced must be overrided.');
  }
  
  /**
   * @param {LocalName} localName
   * @param {Item} child
   * @description
   * **must override**
   */
  childUnmounted(localName, child) {
    throw new Error('Method childUnmounted must be overrided.');
  }
  
  /**
   * @param {Item~prepareCallback} [callback]
   */
  prepare(callback) {
    if (this.isPrepared) {
      if (callback) callback(this.error, this);
    } else if(this.isPrepared === false) {
      if (callback) this.emitter.once('prepared', callback);
    } else {
      this.isPrepared = false;
      if (callback) this.emitter.once('prepared', callback);
      this.preparation();
    }
  }
  
  /**
   * @callback Item~prepareCallback
   * @param [error]
   * @param {Item} item
   */
  
  /**
   * @description
   * **must override**
   */
  preparation() {
    throw new Error('Method preparation must be overrided.');
  }
  
  /**
   * @fires Item#prepared
   * @param [error]
   */
  prepared(error) {
    if (!this.isPrepared && !this.isReplaced) {
      this.isPrepared = true;
      if (!error && Object.keys(this._childs).length) {
        for (var c in this._childs) {
          this._childs[c].prepare((childError, child) => {
            this._childPrepared(c, childError, child);
          });
        }
      } else {
        this.emitter.emit('prepared', error, this);
      }
    }
  }
  
  /**
   * @param {LocalName} localName
   * @param [childError]
   * @param {Item} child
   */
  _childPrepared(localName, childError, child) {
    this.childs[localName] = this._childs[localName];
    delete this._childs[localName];
    child.parents[this.index] = this;
    if (!Object.keys(this._childs).length) {
      this.emitter.emit('prepared', undefined, this);
    }
  }
  
  /**
   * @param {GlobalName|Item} [nameOrItem]
   * @param [query]
   * @param [data]
   * @returns {Item} - Other active item.
   */
  replace() {
    if (this.isReplaced) {
      return this.getActive();
    } else this.isReplaced = true;
    
    var item;
    if (!arguments.length) {
      item = this.manager.get(this.name, this.query);
      if (!item.isPrepared) {
        item.data = this.data;
      }
    } else if (arguments.length == 1 && typeof(arguments[0]) == 'object' && arguments[0] instanceof this.manager._Item) {
      item = arguments[0];
    } else if (arguments.length >= 2) {
      item = this.manager.get(arguments[0], arguments[1]);
      if (arguments.length == 3 && !item.isPrepared) {
        item.data = arguments[2];
      }
    } else throw new Error('invalid arguments for replace');
    
    this.replacedTo = item;
    
    this.emitter.emit('replaced', this, item);
    return item;
  }
  
  getActive() {
    if (this.replacedTo) {
      if (this._getActiveCache) {
        this._getActiveCache = this._getActiveCache.getActive();
      } else {
        this._getActiveCache = this.replacedTo.getActive();
      }
      return this._getActiveCache;
    } else return this;
  }
  
  /**
   * @param {Item~mountCallback} [callback]
   */
  mount(callback) {
    this.prepare((error, item) => {
      if (this.isMounted) {
        if (callback) callback(undefined, this);
      } else if(this.isMounted === false) {
        this.shouldMount(callback);
      } else {
        this.isMounted = false;
        if (callback) this.emitter.once('mounted', callback);
        this.mounting();
      }
    });
  }
  
  /**
   * @param {Item~unmountCallback} [callback]
   * @description
   * **can override**
   */
  shouldMount(callback) {
    if (callback) callback(undefined, this);
  }
  
  /**
   * @callback Item~mountCallback
   * @param [error]
   * @param {Item} item
   */
  
  /**
   * @description
   * **must override**
   */
  mounting(callback) {
    throw new Error('Method mounting must be overrided.');
  }
  
  /**
   * @param {Item} parent
   * @description
   * **can override**
   */
  parentUnmounted(parent) {
    this.unmount();
  }
  
  /**
   * @fires Item#mounted
   * @param [error]
   */
  mounted(error) {
    if (this.isPrepared && !this.isMounted && !this.isReplaced) {
      this.isMounted = true;
      this.emitter.emit('mounted', error, this);
    }
  }
  
  /**
   * @param {Item~unmountCallback} [callback]
   */
  unmount(callback) {
    if (this.isUnmounted) {
      if (callback) callback(undefined, this);
    } else if(this.isUnmounted === false) {
      if (callback) this.emitter.once('unmounted', callback);
    } else {
      this.shouldUnmount(callback);
    }
  }
  
  /**
   * @param {Item~unmountCallback} [callback]
   * @description
   * **can override**
   */
  shouldUnmount(callback) {
    if (Object.keys(this.parents).length) {
      if (callback) callback();
    } else {
      this.forceUnmount(callback);
    }
  }
  
  /**
   * @param {Item~unmountCallback} [callback]
   */
  forceUnmount(callback) {
    this.isUnmounted = false;
    if (callback) this.emitter.once('unmounted', callback);
    this.unmounting();
  }
  
  /**
   * @callback Item~unmountCallback
   * @param [error]
   * @param {Item} item
   */
  
  /**
   * @description
   * **can ovveride**
   */
  unmounting() {
    for (var c in this.childs) {
      delete this.childs[c].parents[this.index];
      this.childs[c].parentUnmounted(this);
    }
    this.unmounted(undefined);
  }
  
  /**
   * @fires Item#unmounted
   * @param [error]
   */
  unmounted(error) {
    if (!this.isUnmounted) {
      this.isUnmounted = true;
      this.emitter.emit('unmounted', error, this);
    }
  }
}

/**
 * @event Item#replaced
 * @memberof module:ancient-funicular
 * @type {object}
 * @property {Item} oldItem
 * @property {Item} newItem
 */

/**
 * @event Item#prepared
 * @memberof module:ancient-funicular
 * @type {object}
 * @property error
 * @property {Item} item
 */

/**
 * @event Item#mounted
 * @memberof module:ancient-funicular
 * @type {object}
 * @property error
 * @property {Item} item
 */

/**
 * @event Item#unmounted
 * @memberof module:ancient-funicular
 * @type {object}
 * @property error
 * @property {Item} item
 */

export default Item;
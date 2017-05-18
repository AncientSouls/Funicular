var { EventEmitter } = require('fbemitter');

/**
 * @class
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
     * Should be positive, to complete the preparation.
     * `undefined`, before preparation, `false` on preparation, `true` if current item prepared (childs still can not be prepared).
     * @type {boolean=}
     * @protected
     */
    this.isPrepared = undefined;
    
    /**
     * Should be positive, to complete the mounting.
     * `undefined`, before mounting, `false` on mounting, `true` if mounted.
     * @type {boolean=}
     * @protected
     */
    this.isMounted = undefined;
    
    /**
     * Should be positive, if item fully unmounted.
     * Some parent items still can use this item as child, but they are notified of its unmounted stage.
     * @type {boolean=}
     * @protected
     */
    this.isUnmounted = undefined;
    
    /**
     * Should be empty, to complete the preparation.
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
    
    /**
     * Last catched error.
     * @protected
     */
    this.error = undefined;
  }
  
  /**
   * @param {string} event
   * @param {function} handler
   * @returns {Item}
   * @example
   * manager.get('a')
   *   .on('prepared', (error, item, event) => item.mount(() => {
   *     console.log('already mounted or just mounted, calls once');
   *   }))
   *   .on('mounted', (error, item, event) => item.remount(item.query, () => {
   *     console.log('just remounted once');
   *   }))
   *   .on('remounted', (unmountError, oldItem, mountError, newItem, event) => newItem.unmount(() => {
   *     console.log('just unmounted once');
   *   }))
   *   .on('unmounted', (error, item, event) => console.log('just fully unmounted, without remounting'))
   *   .prepare((error, item) => console.log('just prepared, calls once'))
   */
  on(event, handler) {
    this.emitter.addListener(event, handler);
    return this;
  }
  
  /**
   * @param {Item~prepareCallback} [callback]
   * @description
   * ##### Attention! Must be overrided.
   * Starts the pre-mount preparation actions. It includes:
   * * Subscribe and getting `data` based on `query`.
   * * Generate names and queries for childs.
   * * Call {@link Item#prepareChild} for each needed child, to generate list of not prepared childs. This list will be used to prepare childs.
   * * **Must call {@link Item#prepared} after all preparations are done.** It will complete stage `prepare` and set `true` into {@link Item#isPrepared}. Run childs preparation and only after all childs prepared, fires callback and `prepared` event.
   * This can lead to recursion of child preparation, everything is fine, the funicular itself will deal with this.
   * @example
   * new Manager(
   *   class extends Item {
   *     preparation(callback) {
   *       this.data = collection.get(this.query);
   *       // May be your data is { _id: 'a', childs: { b: { _id: 'b' }, c: { _id: 'c' } } }
   *       for (var c in this.data.childs) {
   *         this.prepareChild(c, this.data.childs[c]);
   *       }
   *       this.prepared(undefined, callback);
   *     }
   *   }
   * )
   */
  preparation(callback) {
    throw new Error('Must be overrided.');
  }
  
  /**
   * @param {string} name
   * @param query
   */
  prepareChild(name, query) {
    this._childs[name] = query;
  }
  
  /**
   * Start sequence of loading of this data and childs queries.
   * It will starts stage `mounting` and set `false` into {@link Item#isMounted}.
   * @param {Item~mountCallback} [callback]
   */
  prepare(callback) {
    if (this.isPrepared || this.error) {
      if (typeof(callback) == 'function') {
        callback(this.error, this);
      }
    } else if(this.isPrepared === false) {
      this.emitter.once('prepared', callback);
    } else {
      this.isPrepared = false;
      this.preparation(callback);
    }
  }
  
  /**
   * @fires Item#prepared
   * @param [error]
   * @param {Item~prepareCallback} [callback]
   */
  prepared(error, callback) {
    if (!this.isPrepared) {
      var _callback = () => {
        this.emitter.emit('prepared', this.error, this);
        if (typeof(callback) == 'function') callback(this.error, this);
      };
      this.error = error;
      this.isPrepared = true;
      if (!this.error) {
        if (Object.keys(this._childs).length) {
          for (var c in this._childs) {
            this.manager.get(c, this._childs[c]).prepare((error, child) => {
              if (!this.error) {
                if (error) {
                  this.error = new Error(`Child ${c.name} returns error on preparation.`);
                  _callback();
                } else {
                  delete this._childs[c];
                  this.childs[c] = child;
                  if (!Object.keys(this._childs).length) {
                    _callback();
                  }
                }
              }
            });
          }
        } else {
          _callback();
        }
      } else {
        _callback();
      }
    }
  }
  
  /**
   * @callback Item~prepareCallback
   * @param [error]
   * @param {Item} item
   * @param {Object} eventSubscription
   */
  
  /**
   * @param {Item~mountCallback} [callback]
   * @description
   * ##### Attention! Must be overrided.
   * Make or start making some work based on prepared childs.
   * Place link to results or status of work into {@link Item#result}
   * * **Must call {@link Item#mounted} after done work or starting work.** It will complete stage `mounting` and set `true` into {@link Item#isMounted}.
   * @example
   * new Manager(
   *   class extends Item {
   *     mounting(callback) {
   *       this.result = this.data + this.data;
   *       this.mounted(undefined, callback);
   *     }
   *   }
   * )
   */
  mounting(callback) {
    throw new Error('Must be overrided.');
  }
  
  /**
   * @param {Item} child
   * @param {Item~mountCallback} [callback]
   */
  mountChild(child, callback) {
    if (child.isMounted === false) {
      if (typeof(callback) == 'function') callback();
    } else {
      child.mount(callback);
    }
  }
  
  /**
   * Start sequence of needed actions for run, start, mount, execute and so on...
   * It will starts stage `mounting` and set `false` into {@link Item#isMounted}.
   * @param {Item~mountCallback} [callback]
   */
  mount(callback) {
    if (!this.isPrepared) throw new Error('Not prepared item can not be mount.');
    if (this.isMounted || this.error) {
      if (typeof(callback) == 'function') {
        callback(undefined, this);
      }
    } else if(this.isMounted === false) {
      this.emitter.once('mounted', callback);
    } else {
      this.isMounted = false;
      this.mounting(callback);
    }
  }
  
  /**
   * @fires Item#mounted
   * @param [error]
   * @param {Item~mountCallback} [callback]
   */
  mounted(error, callback) {
    if (!this.isMounted) {
      this.isMounted = true;
      this.error = error;
      this.emitter.emit('mounted', error, this);
      if (typeof(callback) == 'function') {
        callback(error, this);
      }
    }
  }
  
  /**
   * @callback Item~mountCallback
   * @param [error]
   * @param {Item} item
   * @param {Object} eventSubscription
   */
  
  /**
   * @fires Item#remounted
   * @param query
   * @param {Item~remountCallback} [callback]
   * @description
   * Mount new active item with equal name any may be other query, and then unmount current item.
   * > This can be used at the time of changing the data, for remounting this and its dependent items.
   * @example
   * item.remount(item.query, (unmountError, oldItem, mountError, oldItem) => {});
   */
  remount(query, callback) {
    if (this.isMounted && typeof(this.isUnmounted) != 'boolean') {
      var done = (unmountError, mountError, newItem) => {
        this.emitter.emit('remounted', unmountError, this, mountError, newItem);
        if (typeof(callback) == 'function') {
          callback(unmountError, this, mountError, newItem);
        }
      };
      delete this.manager._items[this.name];
      this.manager.get(this.name, query).prepare((error, item) => {
        if (error) done(undefined, error, item);
        else {
          item.mount((error, item) => {
            if (error) done(undefined, error, item);
            else {
              this.unmount((error) => {
                done(error, undefined, item);
              });
            }
          });
        }
      });
    } else throw new Error('You can not remount not mounted or unmounted item.');
  }
  
  /**
   * @callback Item~remountCallback
   * @param [unmountError] - only if there is not mountError
   * @param {oldItem} oldItem
   * @param [mountError] - only if there is not unmountError
   * @param {oldItem} newItem
   * @param {Object} eventSubscription
   */
  
  /**
   * @param {Item~unmountCallback} [callback]
   * @description
   * ##### Attention! Must be overrided.
   * Cancel all or stop making some work started in {@link Item#mount}.
   * * **Must call {@link Item#unmounted} after all.** It will complete stage `unmunting` and set `true` into {@link Item#isUnmounted}.
   * @example
   * new Manager(
   *   class extends Item {
   *     unmounting(callback) {
   *       for (var c in this.childs) {
   *         this.childs[c].unmount();
   *       }
   *       this.unmounted(undefined, callback);
   *     }
   *   }
   * )
   */
  unmounting(callback) {
    for (var c in this.childs) {
      this.childs[c].unmount();
    }
    this.unmounted(undefined, callback);
  }
  
  /**
   * Start sequence of needed actions forForget, stop, turn off and so on......
   * It will starts stage `mounting` and set `false` into {@link Item#isMounted}.
   * @param {Item~mountCallback} [callback]
   */
  unmount(callback) {
    if (!this.isMounted) throw new Error('Not mounted item can not be unmount.');
    if (this.isUnmounted || this.error) {
      if (typeof(callback) == 'function') {
        callback(undefined, this);
      }
    } else if(this.isUnmounted === false) {
      if (typeof(callback) == 'function') {
        this.emitter.once('unmounted', callback);
      }
    } else {
      if (Object.keys(this.parents).length) {
        if (typeof(callback) == 'function') {
          callback(undefined, this);
        }
      } else {
        this.isUnmounted = false;
        this.unmounting(callback);
      }
    }
  }
  
  /**
   * @fires Item#unmounted
   * @param [error]
   * @param {Item~unmountCallback} [callback]
   */
  unmounted(error, callback) {
    if (!this.isUnmounted) {
      this.isUnmounted = true;
      this.error = error;
      if (this.manager._items[this.name] && this.manager._items[this.name] == this) {
        delete this.manager._items[this.name];
      }
      this.emitter.emit('unmounted', error, this);
      if (typeof(callback) == 'function') {
        callback(error, this);
      }
    }
  }
  
  /**
   * @callback Item~unmountCallback
   * @param [error]
   * @param {Item} item
   * @param {Object} eventSubscription
   */
}

export default Item;
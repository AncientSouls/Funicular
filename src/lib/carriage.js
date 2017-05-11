/**
 * Universal basic carriage for funicular.
 * @memberof ancient-funicular
 */
class Carriage {
  
  /**
   * @param {Funicular} funicular - Link to instance of {@link Funicular}, used as namespace of carriages for this carriage.
   * @param {String} name - Unique name of this carriage.
   * @param data - Any outer system data needed for mounting one carriage.
   */
  constructor(funicular, name, data) {
    
    /**
     * Link to instance of {@link Funicular}, used as namespace of carriages for this carriage.
     * @type {Funicular}
     * @memberof Carriage
     * @protected
     */
    this.funicular = funicular;
    
    /**
     * Unique id of carriages in funicular instance.
     * @type {Number}
     * @memberof Carriage
     * @protected
     */
    this.id = funicular.lastCarriageId++;
    
    /**
     * Unique name of this carriage.
     * @type {String}
     * @memberof Carriage
     * @protected
     */
    this.name = name;
    
    /**
     * Any outer system data needed for mounting one carriage.
     * @memberof Carriage
     * @protected
     */
    this.data = data;
    
    /**
     * String stage of carriage. Used for place carriage in execution space.
     * @type {String}
     * @memberof Carriage
     * @protected
     */
    this.stage = 'constructed';
    
    /**
     * Object with childs carriages by names.
     * @type {CarriagesByNames}
     * @memberof Carriage
     * @protected
     */
    this.childs = {};
    
    /**
     * Object with parents carriages by names.
     * @type {CarriagesByIds}
     * @memberof Carriage
     * @protected
     */
    this.parents = {};
    
    /**
     * Callbacks after mount.
     * @type {Carriage~mountCallback[]}
     * @memberof Carriage
     * @private
     */
    this.mountedCallbacks = [];
    
    /**
     * @callback Carriage~mountedCallback
     * @param [error]
     * @param {Carriage} carriage
     */
    
    /**
     * Callbacks after remount.
     * @type {Carriage~remountedCallbacks[]}
     * @memberof Carriage
     * @private
     */
    this.remountedCallbacks = [];
    
    /**
     * @callback Carriage~remountedCallbacks
     * @param [unmountError]
     * @param {Carriage} oldCarriage
     * @param [mountError]
     * @param {Carriage} [newCarriage]
     */
    
    /**
     * Callbacks after unmount.
     * @type {Carriage~unmountCallback[]}
     * @memberof Carriage
     * @private
     */
    this.unmountedCallbacks = [];
    
    /**
     * @callback Carriage~unmountedCallback
     * @param [error]
     * @param {Carriage} carriage
     */
    
    /**
     * Last error. It is recorded if an error was received while mounting or unmounting.
     * Can be recorded anywhere, it is worth considering that it can be and check it before important actions.
     * @memberof Carriage
     * @protected
     */
    this.error;
    
  }
  
  /**
   * Get unique state. If sended argument `state` returns boolean.
   * @param {Boolean} [state] - if sended, set this carriage as unique primary of this name.
   * @returns {Boolean}
   */
  unique(state) {
    if (this.name) {
      if (typeof(state) == 'boolean') {
        if (state) {
          this.funicular.namedCarriages[this.name][0] = this;
        } else {
          delete this.funicular.namedCarriages[this.name][0];
        }
      }
      return this.funicular.namedCarriages[this.name][0] == this;
    } else return false;
  }
  
  /**
   * Tie one child with this carriage parent.
   * @param {Carriage} child
   */
  tieChild(child) {
    this.childs[child.name] = child;
    child.parents[this.id] = this;
  }
  
  /**
   * Untie one child with this carriage parent.
   * @param {Carriage} child
   */
  untieChild(child) {
    delete this.childs[child.name];
    delete child.parents[this.id];
  }
  
  /**
   * Based on data, mount this carriage.
   * Use {@link Carriage.enable} for useful functionality.
   * Calls all functions from {@link Carriage.mountedCallbacks}, if this carriage did unmount.
   */
  mount() {
    this.enable((error) => {
      this.error = error;
      this.stage = error?'error':'mounted';
      if (!error) {
        if (typeof(this.name) == 'string') {
          this.funicular.namedCarriages[this.name] = this.funicular.namedCarriages[this.name] || {};
          this.funicular.namedCarriages[this.name][this.id] = this;
          this.unique(true);
        } else {
          this.funicular.unnamedCarriages[this.id] = this;
        }
      }
      for (var c in this.mountedCallbacks) {
        this.mountedCallbacks[c].call(this, error, this);
      }
    });
  }
  
  /**
   * Mount carriage as child for this carriage.
   * @param {String} name
   * @param data
   * @param {Carriage~mountCallback} [callback]
   */
  mountChild(name, data, callback) {
    this.funicular.mount(
      name, data,
      (error, child) => {
        if (this.stage != 'unmounted') {
          this.tieChild(child);
          callback();
        }
      },
      (unmountError, oldChild, mountError, newChild) => {
        this.untieChild(oldChild);
        this.tieChild(newChild);
      },
      (error, child) => {
        this.untieChild(child);
      }
    );
  }
  
  /**
   * You must override it with useful functionality.
   * Can gets and mount childs carriages into {@link Carriage.childs}.
   * It method must added, enable, run and write all that was forgeted, disabled, stoped and erased at {@link Carriage.disable}.
   * It must call callback! Otherwise, the demounting chain may break.
   * @param {Carriage~enableCallback} callback
   */
  enable(callback) {
    callback();
  }
  
  /**
   * @callback Carriage~enableCallback
   * @param error
   */
  
  /**
   * Remount this carriage.
   * @todo
   * If {@link Carriage.invalid} is `true`, mount new carriage based on this name and data and unmount this carriage.
   */
  remount() {
    var tempMountedCallback = (mountError, carriage) => {
      carriage.mountedCallbacks.splice(carriage.mountedCallbacks.indexOf(tempMountedCallback), 1);
      carriage.mountedCallbacks = this.mountedCallbacks;
      this.mountedCallbacks = [];
      carriage.remountedCallbacks = this.remountedCallbacks;
      carriage.unmountedCallbacks = this.unmountedCallbacks;
      this.unmountedCallbacks = [];
      this.unmount((unmountError) => {
        for (var c in this.remountedCallbacks) {
          this.remountedCallbacks[c].call(this, unmountError, this, mountError, carriage);
        }
        this.remountedCallbacks = [];
        for (var parent in this.parents) {
          this.parents[parent].childDidRemount(unmountError, this, mountError, carriage);
        }
      });
    };
    this.funicular.mount(
      this.name, this.data,
      tempMountedCallback, undefined, undefined,
      true
    );
  }
  
  /**
   * Sort unmount this carriage with childs.
   * The carriages necessary for some other carriages will not be unmounted.
   * Calls all functions from {@link Carriage.unmountedCallbacks}, if this carriage did unmount.
   * Calls argument callback in any case, even if the unmount did not happen.
   * @param {Carriage~unmountCallback} [callback]
   */
  unmount(callback) {
    for (var p in this.parents) {
      if (callback) callback(undefined, this);
      return; // If parents exists, umount cannot be done.
    }
    if (this.stage == 'mounted') {
      this.unmountChilds();
      this.disable((error) => {
        this.error = error;
        this.stage = this.error?'error':'unmounted';
        if (typeof(this.name) == 'string') {
          delete this.funicular.namedCarriages[this.name][this.id];
          if (this.funicular.namedCarriages[this.name][0] == this) {
            delete this.funicular.namedCarriages[this.name][0];
          };
        } else {
          delete this.funicular.unnamedCarriages[this.id];
        }
        for (var c in this.unmountedCallbacks) {
          this.unmountedCallbacks[c].call(this, error, this);
        }
        if (callback) callback(error, this);
      });
    } else {
      if (callback) callback(undefined, this);
    }
  }
  
  /**
   * Cicle for sort unmount childs of this carriage.
   * Not asynchronously and with callback, because there is no sense in waiting for the end of the unmounting childs.
   * If you do not agree please describe the reason in the issues.
   */
  unmountChilds() {
    for (var c in this.childs) {
      var child = this.childs[c];
      this.untieChild(child);
      child.unmount();
    }
  }
  
  /**
   * You must override it with useful functionality.
   * It method must forget, disable, stop and erase all that was added, enabled, runned and writed at {@link Carriage.enable}.
   * It must call callback! Otherwise, the demounting chain may break.
   * @param {Carriage~disableCallback} callback
   */
  disable(callback) {
    callback();
  }
  
  /**
   * @callback Carriage~disableCallback
   * @param error
   */
  
  /**
   * You can override it with useful functionality.
   * Synchronously answers the question - is it necessary to remount this parent while remounting the child?
   * @param [unmountError]
   * @param {Carriage} oldCarriage
   * @param [mountError]
   * @param {Carriage} [newCarriage]
   */
  shouldRemount(unmountError, olda, mountError, newa) {
    return false;
  }
}

export default Carriage;
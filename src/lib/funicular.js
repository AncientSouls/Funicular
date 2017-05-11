import each from 'async/each';
import Carriage from './carriage';

/**
 * Basic controller of one namespace of carriages.
 * @memberof ancient-funicular
 */
class Funicular {
  
  constructor() {
    
    /**
     * @type {Number}
     * @memberof Funicular
     * @private
     */
    this.lastCarriageId = 1;
    
    /**
     * Must contain only fully assembled, ready-to-operate carriages with name.
     * Broken or dismantled carriages should not remain here.
     * Attention! A crutch was used. If the carriage is marked as unique, it additionally places itself in id 0. When unmounting or breaking it will also be removed from here.
     * @type {CarriageListsByNames}
     * @memberof Funicular
     * @private
     */
    this.namedCarriages = {};
    
    /**
     * Must contain only fully assembled, ready-to-operate carriages without name.
     * Broken or dismantled carriages should not remain here.
     * @type {CarriagesByIds}
     * @memberof Funicular
     * @private
     */
    this.unnamedCarriages = {};
    
    /**
     * @type {Function}
     * @memberof Funicular
     * @private
     */
     this.Carriage = Carriage;
    
  }
  
  /**
   * Based on name and data, mount new carriage of found already mounted unique carriage in {@link Funicular.namedCarriages} and register callbacks.
   * @param {String} name
   * @param data
   * @param {Carriage~mountCallback} [mountedCallback]
   * @param {Carriage~remountCallback} [remountedCallback]
   * @param {Carriage~unmountCallback} [unmountedCallback]
   * @param {Boolean} [force] - Mount despite the existence of an existing unique carriage.
   */
  mount(name, data, mountedCallback, remountedCallback, unmountedCallback, force = false) {
    if (!force && this.namedCarriages[name] && this.namedCarriages[name][0]) {
      var carriage = this.namedCarriages[name][0];
      if (mountedCallback) {
        carriage.mountedCallbacks.push(mountedCallback);
        mountedCallback(carriage.error, carriage);
      }
      if (remountedCallback) carriage.remountedCallbacks.push(remountedCallback);
      if (unmountedCallback) carriage.unmountedCallbacks.push(unmountedCallback);
    } else {
      var carriage = new this.Carriage(this, name, data);
      if (mountedCallback) carriage.mountedCallbacks.push(mountedCallback);
      if (remountedCallback) carriage.remountedCallbacks.push(remountedCallback);
      if (unmountedCallback) carriage.unmountedCallbacks.push(unmountedCallback);
      carriage.mount();
    }
  }
  
}

export default Funicular;
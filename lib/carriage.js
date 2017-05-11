'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _each=require('async/each');var _each2=_interopRequireDefault(_each);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/**
 * Universal basic carriage for funicular.
 * @memberof ancient-funicular
 */var Carriage=function(){/**
   * @param {Funicular} funicular - Link to instance of {@link Funicular}, used as namespace of carriages for this carriage.
   * @param {String} name - Unique name of this carriage.
   * @param data - Any outer system data needed for mounting one carriage.
   */function Carriage(funicular,name,data){_classCallCheck(this,Carriage);/**
     * Link to instance of {@link Funicular}, used as namespace of carriages for this carriage.
     * @type {Funicular}
     * @memberof Carriage
     * @protected
     */this.funicular=funicular;/**
     * Unique id of carriages in funicular instance.
     * @type {Number}
     * @memberof Carriage
     * @protected
     */this.id=funicular.lastCarriageId++;/**
     * Unique name of this carriage.
     * @type {String}
     * @memberof Carriage
     * @protected
     */this.name=name;/**
     * Any outer system data needed for mounting one carriage.
     * @memberof Carriage
     * @protected
     */this.data=data;/**
     * String stage of carriage. Used for place carriage in execution space.
     * @type {String}
     * @memberof Carriage
     * @protected
     */this.stage='constructed';/**
     * Object with childs carriages by names.
     * @type {CarriagesByNames}
     * @memberof Carriage
     * @protected
     */this.childs={};/**
     * Object with parents carriages by names.
     * @type {CarriagesByIds}
     * @memberof Carriage
     * @protected
     */this.parents={};/**
     * Callbacks after mount.
     * @type {Carriage~mountCallback[]}
     * @memberof Carriage
     * @private
     */this.mountedCallbacks=[];/**
     * @callback Carriage~mountedCallback
     * @param [error]
     * @param {Carriage} carriage
     *//**
     * Callbacks after remount.
     * @type {Carriage~remountedCallbacks[]}
     * @memberof Carriage
     * @private
     */this.remountedCallbacks=[];/**
     * @callback Carriage~remountedCallbacks
     * @param [unmountError]
     * @param {Carriage} oldCarriage
     * @param [mountError]
     * @param {Carriage} [newCarriage]
     *//**
     * Callbacks after unmount.
     * @type {Carriage~unmountCallback[]}
     * @memberof Carriage
     * @private
     */this.unmountedCallbacks=[];/**
     * @callback Carriage~unmountedCallback
     * @param [error]
     * @param {Carriage} carriage
     *//**
     * Last error. It is recorded if an error was received while mounting or unmounting.
     * Can be recorded anywhere, it is worth considering that it can be and check it before important actions.
     * @memberof Carriage
     * @protected
     */this.error}/**
   * Get unique state. If sended argument `state` returns boolean.
   * @param {Boolean} [state] - if sended, set this carriage as unique primary of this name.
   * @returns {Boolean}
   */_createClass(Carriage,[{key:'unique',value:function unique(state){if(this.name){if(typeof state=='boolean'){if(state){this.funicular.namedCarriages[this.name][0]=this}else{delete this.funicular.namedCarriages[this.name][0]}}return this.funicular.namedCarriages[this.name][0]==this}else return false}/**
   * Tie one child with this carriage parent.
   * @param {Carriage} child
   */},{key:'tieChild',value:function tieChild(child){this.childs[child.name]=child;child.parents[this.id]=this}/**
   * Untie one child with this carriage parent.
   * @param {Carriage} child
   */},{key:'untieChild',value:function untieChild(child){delete this.childs[child.name];delete child.parents[this.id]}/**
   * Based on data, mount this carriage.
   * Use {@link Carriage.enable} for useful functionality.
   * Calls all functions from {@link Carriage.mountedCallbacks}, if this carriage did unmount.
   */},{key:'mount',value:function mount(){var _this=this;this.enable(function(error){_this.error=error;_this.stage=error?'error':'mounted';if(!error){if(typeof _this.name=='string'){_this.funicular.namedCarriages[_this.name]=_this.funicular.namedCarriages[_this.name]||{};_this.funicular.namedCarriages[_this.name][_this.id]=_this;_this.unique(true)}else{_this.funicular.unnamedCarriages[_this.id]=_this}}for(var c in _this.mountedCallbacks){_this.mountedCallbacks[c].call(_this,error,_this)}})}/**
   * Mount carriage as child for this carriage.
   * @param {String} name
   * @param data
   * @param {Carriage~mountCallback} [callback]
   */},{key:'mountChild',value:function mountChild(name,data,callback){var _this2=this;this.funicular.mount(name,data,function(error,child){if(_this2.stage!='unmounted'){_this2.tieChild(child);callback()}},function(unmountError,oldChild,mountError,newChild){_this2.untieChild(oldChild);_this2.tieChild(newChild)},function(error,child){_this2.untieChild(child)})}/**
   * You must override it with useful functionality.
   * Can gets and mount childs carriages into {@link Carriage.childs}.
   * It method must added, enable, run and write all that was forgeted, disabled, stoped and erased at {@link Carriage.disable}.
   * It must call callback! Otherwise, the demounting chain may break.
   * @param {Carriage~enableCallback} callback
   */},{key:'enable',value:function enable(callback){callback()}/**
   * @callback Carriage~enableCallback
   * @param error
   *//**
   * Remount this carriage.
   * @todo
   * If {@link Carriage.invalid} is `true`, mount new carriage based on this name and data and unmount this carriage.
   */},{key:'remount',value:function remount(){var _this3=this;var tempMountedCallback=function tempMountedCallback(mountError,carriage){carriage.mountedCallbacks.splice(carriage.mountedCallbacks.indexOf(tempMountedCallback),1);carriage.mountedCallbacks=_this3.mountedCallbacks;_this3.mountedCallbacks=[];carriage.remountedCallbacks=_this3.remountedCallbacks;carriage.unmountedCallbacks=_this3.unmountedCallbacks;_this3.unmountedCallbacks=[];_this3.unmount(function(unmountError){for(var c in _this3.remountedCallbacks){_this3.remountedCallbacks[c].call(_this3,unmountError,_this3,mountError,carriage)}_this3.remountedCallbacks=[];for(var parent in _this3.parents){_this3.parents[parent].childDidRemount(unmountError,_this3,mountError,carriage)}})};this.funicular.mount(this.name,this.data,tempMountedCallback,undefined,undefined,true)}/**
   * Sort unmount this carriage with childs.
   * The carriages necessary for some other carriages will not be unmounted.
   * Calls all functions from {@link Carriage.unmountedCallbacks}, if this carriage did unmount.
   * Calls argument callback in any case, even if the unmount did not happen.
   * @param {Carriage~unmountCallback} [callback]
   */},{key:'unmount',value:function unmount(callback){var _this4=this;for(var p in this.parents){if(callback)callback(undefined,this);return;// If parents exists, umount cannot be done.
}if(this.stage=='mounted'){this.unmountChilds();this.disable(function(error){_this4.error=error;_this4.stage=_this4.error?'error':'unmounted';if(typeof _this4.name=='string'){delete _this4.funicular.namedCarriages[_this4.name][_this4.id];if(_this4.funicular.namedCarriages[_this4.name][0]==_this4){delete _this4.funicular.namedCarriages[_this4.name][0]};}else{delete _this4.funicular.unnamedCarriages[_this4.id]}for(var c in _this4.unmountedCallbacks){_this4.unmountedCallbacks[c].call(_this4,error,_this4)}if(callback)callback(error,_this4)})}else{if(callback)callback(undefined,this)}}/**
   * Cicle for sort unmount childs of this carriage.
   * Not asynchronously and with callback, because there is no sense in waiting for the end of the unmounting childs.
   * If you do not agree please describe the reason in the issues.
   */},{key:'unmountChilds',value:function unmountChilds(){for(var c in this.childs){var child=this.childs[c];this.untieChild(child);child.unmount()}}/**
   * You must override it with useful functionality.
   * It method must forget, disable, stop and erase all that was added, enabled, runned and writed at {@link Carriage.enable}.
   * It must call callback! Otherwise, the demounting chain may break.
   * @param {Carriage~disableCallback} callback
   */},{key:'disable',value:function disable(callback){callback()}/**
   * @callback Carriage~disableCallback
   * @param error
   *//**
   * You can override it with useful functionality.
   * Synchronously answers the question - is it necessary to remount this parent while remounting the child?
   * @param [unmountError]
   * @param {Carriage} oldCarriage
   * @param [mountError]
   * @param {Carriage} [newCarriage]
   */},{key:'shouldRemount',value:function shouldRemount(unmountError,olda,mountError,newa){return false}}]);return Carriage}();exports.default=Carriage;
//# sourceMappingURL=carriage.js.map
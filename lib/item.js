'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _typeof=typeof Symbol==='function'&&typeof Symbol.iterator==='symbol'?function(obj){return typeof obj}:function(obj){return obj&&typeof Symbol==='function'&&obj.constructor===Symbol&&obj!==Symbol.prototype?'symbol':typeof obj};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}var _require=require('fbemitter'),EventEmitter=_require.EventEmitter;var counter=1;/**
 * @class
 */var Item=function(){/**
   * @constructs Item
   * @param {Manager} manager
   * @param {string} name
   * @param [query]
   */function Item(manager,name,query){_classCallCheck(this,Item);/**
     * @type {number}
     * @protected
     */this.index=counter++;/**
     * @type {Manager}
     * @protected
     */this.manager=manager;/**
     * @type {string}
     * @protected
     */this.name=name;/**
     * @protected
     */this.query=query;/**
     * @protected
     */this.data=undefined;/**
     * @type {boolean=}
     * @protected
     */this.isPrepared=undefined;/**
     * @type {boolean=}
     * @protected
     */this.isMounted=undefined;/**
     * @type {boolean=}
     * @protected
     */this.isUnmounted=undefined;/**
     * @type {boolean=}
     * @protected
     */this.isReplaced=undefined;/**
     * @type {Object}
     * @protected
     */this._childs={};/**
     * @type {Object.<string,Item>}
     * @protected
     */this.childs={};/**
     * @type {Object.<string,Item>}
     * @protected
     */this.parents={};/**
     * @type {EventEmitter}
     * @public
     */this.emitter=new EventEmitter;this.emitter.__emitToSubscription=function(subscription,eventType){var args=Array.prototype.slice.call(arguments,2);subscription.listener.apply(subscription.context,args)}}/**
   * @param {LocalName} localName
   * @param {GlobalName} globalName
   * @param query
   */_createClass(Item,[{key:'prepareChild',value:function prepareChild(localName,globalName,query){var child=this.manager.get(globalName,query);this._registerChild(localName,child);return child}/**
   * @param {LocalName} localName
   * @param {Item} child
   */},{key:'_registerChild',value:function _registerChild(localName,child){var _this=this;this._childs[localName]=child;this._childs[localName].emitter.once('replaced',function(oldChild,newChild){_this._childReplaced(localName,oldChild,newChild)});this._childs[localName].emitter.once('unmounted',function(error,child){if(_this._childs[localName]==child)_this.childUnmounted(localName,child)});if(this.isMounted)child.mount();else if(this.isPrepared)child.prepare(function(childError,child){_this._childPrepared(localName,childError,child)})}/**
   * @param {LocalName} localName
   * @param {Item} oldChild
   * @param {Item} newChild
   */},{key:'_childReplaced',value:function _childReplaced(localName,oldChild,newChild){if(!this.isPrepared||Object.keys(this._childs).length)this._registerChild(localName,newChild);else this.childReplaced(localName,oldChild,newChild)}/**
   * @param {LocalName} localName
   * @param {Item} oldChild
   * @param {Item} newChild
   * @description
   * **must override**
   */},{key:'childReplaced',value:function childReplaced(localName,oldChild,newChild){throw new Error('Method childReplaced must be overrided.')}/**
   * @param {LocalName} localName
   * @param {Item} child
   * @description
   * **must override**
   */},{key:'childUnmounted',value:function childUnmounted(localName,child){throw new Error('Method childUnmounted must be overrided.')}/**
   * @param {Item~prepareCallback} [callback]
   */},{key:'prepare',value:function prepare(callback){if(this.isPrepared){if(callback)callback(this.error,this)}else if(this.isPrepared===false){if(callback)this.emitter.once('prepared',callback)}else{this.isPrepared=false;if(callback)this.emitter.once('prepared',callback);this.preparation()}}/**
   * @callback Item~prepareCallback
   * @param [error]
   * @param {Item} item
   *//**
   * @description
   * **must override**
   */},{key:'preparation',value:function preparation(){throw new Error('Method preparation must be overrided.')}/**
   * @fires Item#prepared
   * @param [error]
   */},{key:'prepared',value:function prepared(error){var _this2=this;if(!this.isPrepared&&!this.isReplaced){this.isPrepared=true;if(!error&&Object.keys(this._childs).length){for(var c in this._childs){this._childs[c].prepare(function(childError,child){_this2._childPrepared(c,childError,child)})}}else{this.emitter.emit('prepared',error,this)}}}/**
   * @event Item#prepared
   * @param [error]
   * @param {Item} item
   *//**
   * @param {LocalName} localName
   * @param [childError]
   * @param {Item} child
   */},{key:'_childPrepared',value:function _childPrepared(localName,childError,child){this.childs[localName]=this._childs[localName];delete this._childs[localName];child.parents[this.index]=this;if(!Object.keys(this._childs).length){this.emitter.emit('prepared',undefined,this)}}/**
   * @param {GlobalName|Item} [nameOrItem]
   * @param [query]
   * @param [data]
   * @returns {Item} - Other active item.
   */},{key:'replace',value:function replace(){if(this.isReplaced){return this.getActive()}else this.isReplaced=true;var item;if(!arguments.length){item=this.manager.get(this.name,this.query);if(!item.isPrepared){item.data=this.data}}else if(arguments.length==1&&_typeof(arguments[0])=='object'&&arguments[0]instanceof this.manager._Item){item=arguments[0]}else if(arguments.length>=2){item=this.manager.get(arguments[0],arguments[1]);if(arguments.length==3&&!item.isPrepared){item.data=arguments[2]}}else throw new Error('invalid arguments for replace');this.replacedTo=item;this.emitter.emit('replaced',this,item);return item}/**
   * @event Item#replaced
   * @param {Item} oldItem
   * @param {Item} newItem
   */},{key:'getActive',value:function getActive(){if(this.replacedTo){if(this._getActiveCache){this._getActiveCache=this._getActiveCache.getActive()}else{this._getActiveCache=this.replacedTo.getActive()}return this._getActiveCache}else return this}/**
   * @param {Item~mountCallback} [callback]
   */},{key:'mount',value:function mount(callback){var _this3=this;this.prepare(function(error,item){if(_this3.isMounted){if(callback)callback(undefined,_this3)}else if(_this3.isMounted===false){_this3.shouldMount(callback)}else{_this3.isMounted=false;if(callback)_this3.emitter.once('mounted',callback);_this3.mounting()}})}/**
   * @param {Item~unmountCallback} [callback]
   * @description
   * **can override**
   */},{key:'shouldMount',value:function shouldMount(callback){if(callback)callback(undefined,this)}/**
   * @callback Item~mountCallback
   * @param [error]
   * @param {Item} item
   *//**
   * @description
   * **must override**
   */},{key:'mounting',value:function mounting(callback){throw new Error('Method mounting must be overrided.')}/**
   * @param {Item} parent
   * @description
   * **can override**
   */},{key:'parentUnmounted',value:function parentUnmounted(parent){this.unmount()}/**
   * @fires Item#mounted
   * @param [error]
   */},{key:'mounted',value:function mounted(error){if(this.isPrepared&&!this.isMounted&&!this.isReplaced){this.isMounted=true;this.emitter.emit('mounted',error,this)}}/**
   * @event Item#mounted
   * @param [error]
   * @param {Item} item
   *//**
   * @param {Item~unmountCallback} [callback]
   */},{key:'unmount',value:function unmount(callback){if(this.isUnmounted){if(callback)callback(undefined,this)}else if(this.isUnmounted===false){if(callback)this.emitter.once('unmounted',callback)}else{this.shouldUnmount(callback)}}/**
   * @param {Item~unmountCallback} [callback]
   * @description
   * **can override**
   */},{key:'shouldUnmount',value:function shouldUnmount(callback){if(Object.keys(this.parents).length){if(callback)callback()}else{this.forceUnmount(callback)}}/**
   * @param {Item~unmountCallback} [callback]
   */},{key:'forceUnmount',value:function forceUnmount(callback){this.isUnmounted=false;if(callback)this.emitter.once('unmounted',callback);this.unmounting()}/**
   * @callback Item~unmountCallback
   * @param [error]
   * @param {Item} item
   *//**
   * @description
   * **can ovveride**
   */},{key:'unmounting',value:function unmounting(){for(var c in this.childs){delete this.childs[c].parents[this.index];this.childs[c].parentUnmounted(this)}this.unmounted(undefined)}/**
   * @fires Item#unmounted
   * @param [error]
   */},{key:'unmounted',value:function unmounted(error){if(!this.isUnmounted){this.isUnmounted=true;this.emitter.emit('unmounted',error,this)}}}]);return Item}();exports.default=Item;
//# sourceMappingURL=item.js.map
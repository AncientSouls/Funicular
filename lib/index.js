'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.Carriage=exports.default=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _each=require('async/each');var _each2=_interopRequireDefault(_each);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/**
 * @example
 * var carriage = new funicular.Carriage('abc');
 */var Carriage=function(){/**
   * @param {String} name
   */function Carriage(name){_classCallCheck(this,Carriage);this.name=name;/**
     * * 'broken' - Broken in any method... somewere.
     * * 'construct' - Not subscribed, fetched and mounted. Just constructed and registred in funicular.
     * * 'fetched' - Subscribed and fetched.
     * * 'mounted' - Mounted.
     * * 'unmounted' - Unmounted.
     */this.stage='construct';// ['name']
this.childs=[];// { name: Carriage }
this._childs={};// { name: Carriage }
this._parents={};this.data=undefined}/**
   * Subscribe to get data, data updates and removes events.
   * Sets `carriage.unsubscribe` method for stop current subscription.
   * 
   * @param {Function} callback
   */_createClass(Carriage,[{key:'subscribe',value:function subscribe(callback){throw new Error('Method subscribe must be overriden!')}/**
   * Generate childs array from already fetched data.
   * Sets array `carriage.childs` with string names of child carriages.
   */},{key:'generateChildNamesFromData',value:function generateChildNamesFromData(callback){throw new Error('Method generateChildNamesFromData must be overriden!')}/**
   * Method for calling from subscribe method, when data is fetched.
   * Sets `this.data` key in carriage object.
   * 
   * @param error
   * @param newData
   */},{key:'fetched',value:function fetched(error,newData){if(error){this.stage='broken'}else{this.stage='fetched';this.data=newData}}/**
   * Method for calling from subscribe method, when data is updated.
   * 
   * @param newData
   */},{key:'updated',value:function updated(newData){this.data=newData}/**
   * Method for calling from subscribe method, when data is removed.
   */},{key:'removed',value:function removed(){}/**
   * Register this carriage in childs.
  
  /**
   * Unsafe mount and do what need to do...
   * Attention! Not for personal usage.
   * @param {Carriage~unmountCallback} [callback]
   */},{key:'unsafeMount',value:function unsafeMount(callback){this.stage='mounted';if(typeof callback=='function'){callback()}}/**
   * Subscribed data by name, getting childs names, mount childs, then mount this carriage. If an error occurs, then transactions with subscriptions and children are rolled back.
   * @param {Carriage~mountCallback} [callback]
   */},{key:'mount',value:function mount(callback){var _this=this;this.subscribe(function(error){if(error)callback(error);else{_this.generateChildNamesFromData();_this.mountChilds(function(error){if(error){_this.unsubscribe();callback(error)}else _this.unsafeMount(callback)})}})}/**
   * @callback Carriage~mountCallback
   * @param error
   *//**
   * Unsafe unmount and unregister from carriages in funicular.
   * Attention! Not for personal usage.
   * @param {Carriage~unmountCallback} [callback]
   */},{key:'unsafeUnmount',value:function unsafeUnmount(callback){this.stage='unmounted';delete this.funicular.carriages[this.name][this.id];this.unsubscribe();if(typeof callback=='function'){callback()}}/**
   * Safe unmount, unregister from parents and childs lists in some carriages.
   * @param {Carriage~unmountCallback} [callback]
   */},{key:'unmount',value:function unmount(callback){this.unsafeUnmount(callback)}/**
   * @callback Carriage~unmountCallback
   * @param error
   *//**
   * Mount all child names from array in `this.childs`.
   * @param {Carriage~mountCallback} [callback]
   */},{key:'mountChilds',value:function mountChilds(callback){var _this2=this;var childCarriages=[];(0,_each2.default)(this.childs,function(child,nextChild){_this2.funicular.mount(child,function(error,carriage){if(error)nextChild(error);else{childCarriages.push(carriage);_this2.tieChild(carriage);nextChild()}})},function(error){if(error){(0,_each2.default)(childCarriages,function(child,nextChild){child.unmount(function(){return nextChild()})},function(){callback(error)})}else callback()})}/**
   * Tie one child with tihs carriage parent.
   * @param {Carriage} child
   */},{key:'tieChild',value:function tieChild(child){this._childs[child.name]=child;child._parents[this.name]=this}}]);return Carriage}();/**
 * @example
 * import { Funicular } from 'ancient-funicular';
 * var funicular = new Funicular();
 * var OldCarriage = funicular.Carriage;
 * funicular.Carriage = class extends OldCarriage {}
 */var Funicular=function(){function Funicular(){_classCallCheck(this,Funicular);var funicular=this;this.Carriage=function(_Carriage){_inherits(_class,_Carriage);function _class(){_classCallCheck(this,_class);var _this3=_possibleConstructorReturn(this,(_class.__proto__||Object.getPrototypeOf(_class)).apply(this,arguments));_this3.funicular=funicular;_this3.id=++_this3.funicular.lastId;funicular.carriages[_this3.name]=funicular.carriages[_this3.name]||{};funicular.carriages[_this3.name][_this3.id]=_this3;return _this3}return _class}(Carriage);this.lastId=0;// { name: { id: Carriage, id: Carriage }, name: { id: Carriage, id: Carriage }, name: { id: Carriage, id: Carriage } }
this.carriages={}}/**
   * Method for mount new carriage in this funicular.
   * 
   * @param {String} name
   * @param {Funicular~mountCallback} [callback]
   */_createClass(Funicular,[{key:'mount',value:function mount(name,callback){var carriage=new this.Carriage(name);var callback=callback||function(error){throw error};carriage.mount(function(error){callback(error,carriage)})}/**
   * @callback Funicular~mountCallback
   * @param error
   * @param {Carriage} carriage
   */}]);return Funicular}();;exports.default=Funicular;exports.Carriage=Carriage;
//# sourceMappingURL=index.js.map
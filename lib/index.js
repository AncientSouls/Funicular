'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/**
 * @example
 * var carriage = new Carriage('abc');
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
   * 
   * @param {Function} callback
   * @returns {Function} Method for stop current subscribtion.
   */_createClass(Carriage,[{key:'subscribe',value:function subscribe(callback){}/**
   * Method for calling from subscribe method, when data is fetched.
   * Sets `this.data` key in carriage object.
   * 
   * @param error
   * @param newData
   */},{key:'fetched',value:function fetched(error,newData){this.stage='fetched';this.data=newData}/**
   * Method for calling from subscribe method, when data is updated.
   * 
   * @param newData
   */},{key:'updated',value:function updated(newData){this.data=newData}/**
   * Method for calling from subscribe method, when data is removed.
   */},{key:'removed',value:function removed(){}}]);return Carriage}();var Funicular=function(){function Funicular(){_classCallCheck(this,Funicular);var funicular=this;this.Carriage=function(_Carriage){_inherits(_class,_Carriage);function _class(){_classCallCheck(this,_class);var _this=_possibleConstructorReturn(this,(_class.__proto__||Object.getPrototypeOf(_class)).apply(this,arguments));_this.funicular=funicular;_this.id=++_this.funicular.lastId;funicular.carriages[_this.name]=funicular.carriages[_this.name]||{};funicular.carriages[_this.name][_this.id]=_this;return _this}return _class}(Carriage);this.lastId=0;// { name: { id: Carriage, id: Carriage }, name: { id: Carriage, id: Carriage }, name: { id: Carriage, id: Carriage } }
this.carriages={}}/**
   * Method for mount new carriage in this funicular.
   * 
   * @param {String} name
   * @param {Funicular~mountCallback} [callback]
   */_createClass(Funicular,[{key:'mount',value:function mount(name,callback){var carriage=new this.Carriage(name);carriage.subscribe(function(){if(typeof callback=='function'){callback(undefined,carriage)}})}/**
   * @callback Funicular~mountCallback
   * @param error
   * @param {Carriage} carriage
   */}]);return Funicular}();;exports.Funicular=Funicular;exports.Carriage=Carriage;
//# sourceMappingURL=index.js.map
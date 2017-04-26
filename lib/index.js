'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.Carriage=exports.default=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _each=require('async/each');var _each2=_interopRequireDefault(_each);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/**
 * @example
 * var carriage = new funicular.Carriage('abc');
 */var Carriage=function(){/**
   * @param query
   */function Carriage(query){_classCallCheck(this,Carriage);this.query=query;/**
     * * `broken` - Broken in any method... somewere.
     * * `construct` - Not subscribed, fetched and mounted. Just constructed and registred in funicular.
     * * `fetched` - Subscribed and fetched.
     * * `mounted` - Mounted.
     * * `unmounted` - Unmounted.
     */this.stage='construct';// ['name']
this.childs=[];// { name: Carriage }
this._childs={};// { name: Carriage }
this._parents={};this.data=undefined;this.roots=[];this.unmountedCallbacks=[];this.mountedCallbacks=[]}/**
   * Subscribe to get data, data updates and removes events.
   * Must sets `carriage.unsubscribe` method for stop current subscription.
   * Must sets `this.name` string **before** calls `fetched`.
   * 
   * @param {Function} callback
   */_createClass(Carriage,[{key:'subscribe',value:function subscribe(callback){throw new Error('Method subscribe must be overriden!')}/**
   * Generate childs array from already fetched data.
   * Sets array `carriage.childs` with string names of child carriages.
   * @param {Function} callback
   */},{key:'getChildsQueries',value:function getChildsQueries(callback){throw new Error('Method getChildsQueries must be overriden!')}/**
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
   * Unsafe mount and do what need to do...
   * Attention! Not for external usage.
   * @param {Carriage~unmountCallback} [callback]
   */},{key:'unsafeMount',value:function unsafeMount(callback){this.stage='mounted';this.funicular.carriages[this.name]=this.funicular.carriages[this.name]||{};this.funicular.carriages[this.name][this.id]=this;if(typeof callback=='function'){callback()}}/**
   * Subscribed data by name, getting childs names, mount childs, then mount this carriage. If an error occurs, then transactions with subscriptions and children are rolled back.
   * @param {Carriage~mountCallback} [mountedCallback]
   */},{key:'mount',value:function mount(mountedCallback){var _this=this;var callback=function callback(error){if(mountedCallback)mountedCallback(error,_this);var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=_this.mountedCallbacks[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var callback=_step.value;callback(error,_this)}}catch(err){_didIteratorError=true;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}};this.subscribe(function(error){if(error)callback(error);else{_this.getChildsQueries(function(){_this.mountChilds(function(error){if(error){_this.unsubscribe();callback(error)}else _this.unsafeMount(callback)})})}})}/**
   * Argument for `funicular.mountRoot`.
   * 
   * @callback Carriage~mountCallback
   * @param error
   * @param {Carriage} carriage
   * @param {Function} unmountCarriage
   *//**
   * Unsafe unmount and unregister from carriages in funicular.
   * Attention! Not for external usage.
   * @param {Carriage~unmountCallback} [callback]
   */},{key:'unsafeUnmount',value:function unsafeUnmount(callback){this.stage='unmounted';delete this.funicular.carriages[this.name][this.id];this.unsubscribe();var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=this.unmountedCallbacks[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var unmountedCallback=_step2.value;unmountedCallback(this)}}catch(err){_didIteratorError2=true;_iteratorError2=err}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return()}}finally{if(_didIteratorError2){throw _iteratorError2}}}if(typeof callback=='function'){callback()}}/**
   * Safe unmount, unregister from parents and childs lists in some carriages.
   * Attention! Not for external usage.
   * @param {Carriage~unmountCallback} [callback]
   */},{key:'unmount',value:function unmount(callback){var _this2=this;if(this.state!='unmounted'&&this.state!='broken'&&Object.keys(this._parents).length===0&&!this.roots.length){this.unmountChilds(function(){_this2.unsafeUnmount(callback)})}else if(typeof callback=='function'){callback()}}/**
   * Argument for `funicular.mountRoot`.
   * 
   * @callback Carriage~unmountCallback
   * @param error
   *//**
   * Mount all child names from array in `this.childs`.
   * @param {Carriage~mountCallback} [callback]
   */},{key:'mountChilds',value:function mountChilds(callback){var _this3=this;var childCarriages=[];(0,_each2.default)(this.childs,function(child,nextChild){_this3.funicular.mount(child,function(error,carriage){if(error)nextChild(error);else{childCarriages.push(carriage);nextChild()}})},function(error){if(error){(0,_each2.default)(childCarriages,function(child,nextChild){child.unmount(function(){return nextChild()})},function(){callback(error)})}else{var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=childCarriages[Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){var child=_step3.value;_this3.tieChild(child)}}catch(err){_didIteratorError3=true;_iteratorError3=err}finally{try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return()}}finally{if(_didIteratorError3){throw _iteratorError3}}}callback()}})}/**
   * Tie one child with this carriage parent.
   * @param {Carriage} child
   */},{key:'tieChild',value:function tieChild(child){this._childs[child.name]=child;child._parents[this.name]=this}/**
   * Unmount all childs from object in `this._childs`.
   * @param {Carriage~unmountCallback} [callback]
   */},{key:'unmountChilds',value:function unmountChilds(callback){var _this4=this;(0,_each2.default)(this._childs,function(child,nextChild){_this4.untieChild(child);child.unmount(function(){return nextChild()})},function(){callback()})}/**
   * Untie one child with this carriage parent.
   * @param {Carriage} child
   */},{key:'untieChild',value:function untieChild(child){delete this._childs[child.name];delete child._parents[this.name]}/**
   * Tie this carriage with some root id.
   * @param {number} rootId
   */},{key:'tieRoot',value:function tieRoot(rootId){this.funicular.roots[rootId]=this;var index=this.roots.indexOf(rootId);if(index==-1)this.roots.push(rootId)}/**
   * Untie this carriage from some root id.
   * @param {number} rootId
   */},{key:'untieRoot',value:function untieRoot(rootId){delete this.funicular.roots[rootId];var index=this.roots.indexOf(rootId);this.roots.splice(index,1)}/**
   * Move roots from one carriage to other.
   * @param {Carriage} otherCarriage
   */},{key:'moveRoots',value:function moveRoots(otherCarriage){otherCarriage.roots=this.roots;this.roots=[];for(var root in this.roots){this.funicular.roots[root]=otherCarriage}}/**
   * @callback Carriage~unmountedCallback
   * @param {Carriage} carriage
   */}]);return Carriage}();/**
 * @example
 * import { Funicular } from 'ancient-funicular';
 * var funicular = new Funicular();
 * var OldCarriage = funicular.Carriage;
 * funicular.Carriage = class extends OldCarriage {}
 */var Funicular=function(){function Funicular(){_classCallCheck(this,Funicular);var funicular=this;this.Carriage=function(_Carriage){_inherits(_class,_Carriage);function _class(){_classCallCheck(this,_class);var _this5=_possibleConstructorReturn(this,(_class.__proto__||Object.getPrototypeOf(_class)).apply(this,arguments));_this5.funicular=funicular;_this5.id=++_this5.funicular.lastCarriageId;return _this5}return _class}(Carriage);this.lastCarriageId=0;this.lastRootId=0;// { name: { id: Carriage, id: Carriage }, name: { id: Carriage, id: Carriage }, name: { id: Carriage, id: Carriage } }
this.carriages={};// { id: Carriage }
this.roots={}}/**
   * Method for mount new carriage in this funicular.
   * Attention! Not for external usage because not auto mark carriage aschild and parent. For external, custom usage please use method {@link Funicular#mountRoot}
   * 
   * @param query
   * @param {Funicular~mountCallback} [mountedCallback] - Gets already mounted or broken carriage.
   * @param {Funicular~unmountedCallback} [unmountedCallback] - Gets unmounted carriage.
   */_createClass(Funicular,[{key:'mount',value:function mount(query,mountedCallback,unmountedCallback){var carriage=new this.Carriage(query);var mountedCallback=mountedCallback||function(error){throw error};if(mountedCallback)carriage.mountedCallbacks.push(mountedCallback);if(unmountedCallback)carriage.unmountedCallbacks.push(unmountedCallback);carriage.mount()}/**
   * Method for mount new carriage in this funicular as root.
   * Use for unmount method {@link Carriage#unmountRoot}
   * 
   * @param query
   * @param {Funicular~mountCallback} [mountedCallback] - Gets already mounted or broken carriage.
   * @param {Funicular~unmountedCallback} [unmountedCallback] - Gets unmounted carriage.
   * 
   * @example
   * funicular.mountRoot(
   *   'someDataReference',
   *   (error, carriage, unmountCarriage) => {
   *     // carriage someDataReference with all childs are mounted
   *     setTimeout(() => { unmountCarriage(); }, 1000);
   *   },
   *   (carriage) => {
   *     // carriage someDataReference and free of parents childs are unmounted 
   *   }
   * );
   */},{key:'mountRoot',value:function mountRoot(query,mountedCallback,unmountedCallback){var _this6=this;var rootId=++this.lastRootId;this.mount(query,function(error,carriage){if(!error){carriage.tieRoot(rootId)}var unmountRoot=function unmountRoot(callback){if(_this6.roots[rootId]){var carriage=_this6.roots[rootId];carriage.untieRoot(rootId);carriage.unmount(callback)}else callback()};mountedCallback(error,carriage,unmountRoot)},unmountedCallback)}/**
   * @callback Funicular~mountCallback
   * @param error
   * @param {Carriage} carriage
   *//**
   * @callback Funicular~unmountedCallback
   * @param {Carriage} carriage
   */}]);return Funicular}();;exports.default=Funicular;exports.Carriage=Carriage;
//# sourceMappingURL=index.js.map
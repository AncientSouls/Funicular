'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _typeof=typeof Symbol==='function'&&typeof Symbol.iterator==='symbol'?function(obj){return typeof obj}:function(obj){return obj&&typeof Symbol==='function'&&obj.constructor===Symbol&&obj!==Symbol.prototype?'symbol':typeof obj};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}var counter=1;/**
 * @class
 */function Parent(name,item){/**
   * Unique index of each item.
   * @type {Index}
   * @protected
   */this.name=name;/**
   * Unique index of each item.
   * @type {Index}
   * @protected
   */this.item=item}/**
 * @class
 * @description
 * Must be extended with custom logic of get and mount/unmount.
 * @example
 * import { Item as ProtoItem } from 'ancient-funicular';
 * class Item extends ProtoItem {
 *   mount() {
 *     if (this.isMounted()) return Promise.resolve(this);
 *     return new Promise((resolve) => {
 *       this.getResult = () => this.data;
 *       resolve(this);
 *     });
 *   }
 *   unmount() {
 *     if (!this.isMounted()) return Promise.resolve(this);
 *     return new Promise((resolve) => {
 *       delete this.getResult;
 *       resolve(this);
 *     });
 *   }
 *   get() {
 *     return new Promise((resolve) => { resolve(new Item('data')); });
 *   }
 * }
 */var Item=function(){/**
   * @constructs Item
   * @param {*} data
   */function Item(data){_classCallCheck(this,Item);/**
     * Unique index of each item.
     * @type {Index}
     * @protected
     */this.index=counter++;/**
     * A items connected to this item when moving away from the root. Sorted by local names.
     * @type {Object.<Id,Item>}
     * @protected
     */this.childs={};/**
     * The converse notion of a childs. Sorted by parents indexes.
     * @type {Object.<Index,Parent>}
     * @protected
     */this.parents={};/**
     * Interim results.
     * @type {*}
     * @protected
     */this.data=data;/**
     * Method for getting results.
     * @type {Item~getResult}
     */this.getResult;/**
     * Method for getting item by query.
     * @type {Item~get}
     */this.get}/**
   * Add `child` item as child to this by pseudo `name`.
   * Add this item as parent to `child` item.
   * @param {Item} child
   */_createClass(Item,[{key:'set',value:function set(name,child){if(typeof name!='string')throw new Error('name '+name+' must be a string');if(!isItem(child))throw new Error('child '+child+' must be a Item instance.');this.childs[name]=child;child.parents[this.index]=new Parent(name,this)}/**
   * Remove this item from parents of `child` item.
   * But not remove `child` item from childs pf thos .
   * @param {Item} child
   */},{key:'unset',value:function unset(child){if(!isItem(child))throw new Error('child '+child+' must be a Item instance.');delete child.parents[this.index]}/**
   * @return {Promise} - Resolve fully filled and mounted item, with .
   */},{key:'mount',value:function mount(){throw new Error('Method mount must be overrided.')}/**
   * @return {Promise} - Resolve cleared and stopped item.
   */},{key:'unmount',value:function unmount(){throw new Error('Method unmount must be overrided.')}/**
   * @return {boolean}
   */},{key:'isMounted',value:function isMounted(){return typeof this.getResult=='function'}}]);return Item}();;/**
 * Method for getting item by query.
 * Must returns Promise resolves already mounted {@link Item} instance by query.
 * @callback Item~get
 * @param {*} [query]
 * @return {Promise}
 *//**
 * Must be setted in mounted item. Must be unsetted if item is unmounted.
 * @callback Item~getResult
 * @return {*}
 *//**
 * @param {Item} item
 * @return {boolean}
 * @example
 * import { isItem, Item } from 'ancient-funicular';
 * isItem(new Item()); // true
 * isItem({}); // false
 */function isItem(item){return(typeof item==='undefined'?'undefined':_typeof(item))=='object'&&item instanceof Item};exports.Item=Item;exports.isItem=isItem;
//# sourceMappingURL=item.js.map
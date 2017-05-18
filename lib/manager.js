'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _item=require('./item');var _item2=_interopRequireDefault(_item);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/**
 * @class
 */var Manager=function(){/**
   * @constructs Manager
   * @param {function} Item - class extended from Item
   */function Manager(Item){_classCallCheck(this,Manager);/**
     * @type {Object.<string,Item>}
     * @protected
     */this._items={};/**
     * @type {function}
     * @protected
     */this.Item=Item}/**
   * Universal getter of items. Not mount or prepare item, just return it. You must manual use `prepare` and `mount` methods.
   * @param {string} name - If not sended, create new unnamed item.
   * @param [query] - Preparation is responsible for responding to the query. It may, query can be required in your Item class. 
   * @returns {Item}
   * @example
   * manager.get('a').prepare((error, a) => {});
   */_createClass(Manager,[{key:'get',value:function get(name,query){if(name){if(this._items[name])return this._items[name];else return this._items[name]=new this.Item(this,name,query)}else{return new this.Item(this,name,query)}}}]);return Manager}();exports.default=Manager;
//# sourceMappingURL=manager.js.map
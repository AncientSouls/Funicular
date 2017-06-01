'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _item=require('./item');var _item2=_interopRequireDefault(_item);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/**
 * @class
 */var Manager=function(){/**
   * @constructs Manager
   * @param {function} Item - class extended from Item
   */function Manager(Item){_classCallCheck(this,Manager);/**
     * @type {Object.<GlobalName,Item>}
     * @protected
     * @description
     * Contains last versions of registred named items by global names.
     */this._items={};/**
     * @type {function}
     * @protected
     */this._Item=Item}/**
   * @param {string} name - If not sended, create new unnamed item.
   * @param [query] - Preparation is responsible for responding to the query. It may, query can be required in your Item class. 
   * @returns {Item}
   * @description
   * Responsible for:
   * * Constructing new item, if not exists not remounted or unmounted item with equal name.
   * * Register items as in {@ling Manager#_items}
   * > Attention! It is not a mount tool, only a search. Prepare and mount manually!
   * @example
   * var a = manager.get('a');
   * a.name == 'a'; // true
   */_createClass(Manager,[{key:'get',value:function get(name,query){if(name){if(this._items[name]&&!this._items[name].isReplaced&&!this._items[name].isUnmounted)return this._items[name];else return this._items[name]=new this._Item(this,name,query)}else{return new this._Item(this,name,query)}}}]);return Manager}();exports.default=Manager;
//# sourceMappingURL=manager.js.map
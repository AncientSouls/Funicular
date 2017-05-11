'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _each=require('async/each');var _each2=_interopRequireDefault(_each);var _carriage=require('./carriage');var _carriage2=_interopRequireDefault(_carriage);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/**
 * Basic controller of one namespace of carriages.
 * @memberof ancient-funicular
 */var Funicular=function(){function Funicular(){_classCallCheck(this,Funicular);/**
     * @type {Number}
     * @memberof Funicular
     * @private
     */this.lastCarriageId=1;/**
     * Must contain only fully assembled, ready-to-operate carriages with name.
     * Broken or dismantled carriages should not remain here.
     * Attention! A crutch was used. If the carriage is marked as unique, it additionally places itself in id 0. When unmounting or breaking it will also be removed from here.
     * @type {CarriageListsByNames}
     * @memberof Funicular
     * @private
     */this.namedCarriages={};/**
     * Must contain only fully assembled, ready-to-operate carriages without name.
     * Broken or dismantled carriages should not remain here.
     * @type {CarriagesByIds}
     * @memberof Funicular
     * @private
     */this.unnamedCarriages={};/**
     * @type {Function}
     * @memberof Funicular
     * @private
     */this.Carriage=_carriage2.default}/**
   * Based on name and data, mount new carriage of found already mounted unique carriage in {@link Funicular.namedCarriages} and register callbacks.
   * @param {String} name
   * @param data
   * @param {Carriage~mountCallback} [mountedCallback]
   * @param {Carriage~remountCallback} [remountedCallback]
   * @param {Carriage~unmountCallback} [unmountedCallback]
   * @param {Boolean} [force] - Mount despite the existence of an existing unique carriage.
   */_createClass(Funicular,[{key:'mount',value:function mount(name,data,mountedCallback,remountedCallback,unmountedCallback){var force=arguments.length>5&&arguments[5]!==undefined?arguments[5]:false;if(!force&&this.namedCarriages[name]&&this.namedCarriages[name][0]){var carriage=this.namedCarriages[name][0];if(mountedCallback){carriage.mountedCallbacks.push(mountedCallback);mountedCallback(carriage.error,carriage)}if(remountedCallback)carriage.remountedCallbacks.push(remountedCallback);if(unmountedCallback)carriage.unmountedCallbacks.push(unmountedCallback)}else{var carriage=new this.Carriage(this,name,data);if(mountedCallback)carriage.mountedCallbacks.push(mountedCallback);if(remountedCallback)carriage.remountedCallbacks.push(remountedCallback);if(unmountedCallback)carriage.unmountedCallbacks.push(unmountedCallback);carriage.mount()}}}]);return Funicular}();exports.default=Funicular;
//# sourceMappingURL=funicular.js.map
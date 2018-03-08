"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var manager_1 = require("ancient-mixins/lib/manager");
var funicular_1 = require("./funicular");
function mixin(superClass, Node) {
    if (Node === void 0) { Node = funicular_1.Funicular; }
    return (function (_super) {
        __extends(FunicularsManager, _super);
        function FunicularsManager() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.Node = Node;
            return _this;
        }
        return FunicularsManager;
    }(superClass));
}
exports["default"] = mixin;
exports.mixin = mixin;
var MixedFunicularsManager = mixin(manager_1.Manager);
exports.MixedFunicularsManager = MixedFunicularsManager;
var FunicularsManager = (function (_super) {
    __extends(FunicularsManager, _super);
    function FunicularsManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FunicularsManager;
}(MixedFunicularsManager));
exports.FunicularsManager = FunicularsManager;
//# sourceMappingURL=funiculars-manager.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const manager_1 = require("ancient-mixins/lib/manager");
const funicular_1 = require("./funicular");
function mixin(superClass, Node = funicular_1.Funicular) {
    return class FunicularsManager extends superClass {
        constructor() {
            super(...arguments);
            this.Node = Node;
        }
    };
}
exports.default = mixin;
exports.mixin = mixin;
const MixedFunicularsManager = mixin(manager_1.Manager);
exports.MixedFunicularsManager = MixedFunicularsManager;
class FunicularsManager extends MixedFunicularsManager {
}
exports.FunicularsManager = FunicularsManager;
//# sourceMappingURL=funiculars-manager.js.map
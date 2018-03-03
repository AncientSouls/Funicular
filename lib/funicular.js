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
var _ = require("lodash");
var node_1 = require("ancient-mixins/lib/node");
var funiculars_manager_1 = require("./funiculars-manager");
var EFunicularState;
(function (EFunicularState) {
    EFunicularState[EFunicularState["Constructed"] = 0] = "Constructed";
    EFunicularState[EFunicularState["Mounting"] = 1] = "Mounting";
    EFunicularState[EFunicularState["Mounted"] = 2] = "Mounted";
    EFunicularState[EFunicularState["Remounting"] = 3] = "Remounting";
    EFunicularState[EFunicularState["Unmounting"] = 4] = "Unmounting";
    EFunicularState[EFunicularState["Unmounted"] = 5] = "Unmounted";
})(EFunicularState || (EFunicularState = {}));
exports.EFunicularState = EFunicularState;
function mixin(superClass) {
    return /** @class */ (function (_super) {
        __extends(Funicular, _super);
        function Funicular() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.Node = Funicular;
            _this.state = EFunicularState.Constructed;
            _this.childs = new funiculars_manager_1.FunicularsManager();
            _this.parents = new funiculars_manager_1.FunicularsManager();
            _this.needRemount = false;
            _this.needUnmount = false;
            return _this;
        }
        Funicular.prototype.mount = function (cursor) {
            var _this = this;
            if (this.state !== EFunicularState.Constructed)
                throw new Error("Funicular " + this.id + " is already mounted.");
            this.cursor = cursor;
            this.state = EFunicularState.Mounting;
            this.emit('mounting', { funicular: this });
            this.register(_.once(function () {
                _this.cursorFilling(_.once(function () {
                    _this.childsMounting(_.once(function () {
                        _this.start(_.once(function () {
                            _this.watchChildsEvents();
                            _this.addParentToChilds();
                            _this.state = EFunicularState.Mounted;
                            _this.emit('mounted', { funicular: _this });
                            if (_this.needUnmount)
                                _this.unmount();
                            else if (_this.needRemount)
                                _this.remount();
                        }));
                    }));
                }));
            }));
        };
        Funicular.prototype.remount = function () {
            var _this = this;
            if (this.state === EFunicularState.Mounted) {
                this.state = EFunicularState.Remounting;
                this.emit('remounting', { funicular: this });
                this.unregister(_.once(function () {
                    _this.cloneAndMount(_.once(function () {
                        _this.emit('remounted', { funicular: _this });
                        _this.unmount();
                    }));
                }));
            }
            else
                this.needRemount = true;
        };
        Funicular.prototype.unmount = function () {
            var _this = this;
            if (this.state === EFunicularState.Mounted || this.state === EFunicularState.Remounting) {
                this.state = EFunicularState.Unmounting;
                this.emit('unmounting', { funicular: this });
                this.stop(_.once(function () {
                    _this.childsUnmounting(_.once(function () {
                        _this.unwatchChildsEvents();
                        _this.unregister(_.once(function () {
                            _this.state = EFunicularState.Unmounted;
                            _this.emit('unmounted', { funicular: _this });
                            _this.destroy();
                        }));
                    }));
                }));
            }
            else
                this.needUnmount = true;
        };
        Funicular.prototype.register = function (callback) {
            throw new Error('Method register must defined in this class!');
        };
        Funicular.prototype.unregister = function (callback) {
            throw new Error('Method unregister must defined in this class!');
        };
        Funicular.prototype.cursorFilling = function (callback) {
            var _this = this;
            this.emit('cursorFilling', { funicular: this });
            if (_.isUndefined(this.cursor.data)) {
                this.cursor.once('changed', function () { return _this.cursorFilling(callback); });
            }
            else {
                this.cursor.once('changed', function () { return _this.remount(); });
                this.emit('cursorFilled', { funicular: this });
                callback();
            }
        };
        Funicular.prototype.childsMounting = function (callback) {
            var _this = this;
            this.emit('childsMounting', { funicular: this });
            this.requestChilds(_.once(function () {
                _this.emit('childsMounted', { funicular: _this });
                callback();
            }));
        };
        Funicular.prototype.childsUnmounting = function (callback) {
            var _this = this;
            this.emit('childsUnmounting', { funicular: this });
            this.abandonChilds(_.once(function () {
                _this.emit('childsUnmounted', { funicular: _this });
                callback();
            }));
        };
        Funicular.prototype.requestChilds = function (callback) {
            throw new Error('Method requestChilds must defined in this class!');
        };
        Funicular.prototype.abandonChilds = function (callback) {
            throw new Error('Method abandonChilds must defined in this class!');
        };
        Funicular.prototype.start = function (callback) {
            var _this = this;
            this.emit('starting', { funicular: this });
            this.starting(_.once(function () {
                _this.emit('started', { funicular: _this });
                callback();
            }));
        };
        Funicular.prototype.stop = function (callback) {
            var _this = this;
            this.emit('stopping', { funicular: this });
            this.stopping(_.once(function () {
                _this.emit('stopped', { funicular: _this });
                callback();
            }));
        };
        Funicular.prototype.starting = function (callback) {
            throw new Error('Method starting must defined in this class!');
        };
        Funicular.prototype.stopping = function (callback) {
            throw new Error('Method stopping must defined in this class!');
        };
        Funicular.prototype.watchChildsEvents = function () {
            var _this = this;
            this.removedListener = function (_a) {
                var node = _a.node;
                return node.remounted || _this.childDestroyed(node);
            };
            this.remountedListener = function (_a) {
                var funicular = _a.funicular;
                return _this.childRemounted(funicular);
            };
            this.childs.on('removed', this.removedListener);
            this.childs.on('remounted', this.remountedListener);
        };
        Funicular.prototype.unwatchChildsEvents = function () {
            this.childs.off('removed', this.removedListener);
            this.childs.off('remounted', this.remountedListener);
        };
        Funicular.prototype.childDestroyed = function (child) {
            this.remount();
        };
        Funicular.prototype.childRemounted = function (child) {
            this.remount();
        };
        Funicular.prototype.addParentToChilds = function () {
            var _this = this;
            _.each(this.childs.nodes, function (child) { return child.parents.add(_this); });
        };
        Funicular.prototype.cloneAndMount = function (callback) {
            var _this = this;
            var clone = new this.Node(this.id);
            clone.on('mounted', function () {
                _this.remounted = clone;
                callback();
            });
            clone.mount(this.cursor);
        };
        return Funicular;
    }(node_1.Node));
}
exports["default"] = mixin;
exports.mixin = mixin;
var MixedFunicular = mixin(node_1.Node);
exports.MixedFunicular = MixedFunicular;
var Funicular = /** @class */ (function (_super) {
    __extends(Funicular, _super);
    function Funicular() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Funicular;
}(MixedFunicular));
exports.Funicular = Funicular;
//# sourceMappingURL=funicular.js.map
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
var chai_1 = require("chai");
var vm = require("vm");
var async = require("async");
var manager_1 = require("ancient-mixins/lib/manager");
var cursor_1 = require("ancient-cursor/lib/cursor");
var childs_cursors_manager_1 = require("ancient-cursor/lib/childs-cursors-manager");
var funicular_1 = require("../lib/funicular");
var funiculars_manager_1 = require("../lib/funiculars-manager");
function default_1() {
    describe('ExecutableFunicular:', function () {
        it('lifecycle', function () {
            var ExecutableFunicular = funicular_1.mixin(funicular_1.Funicular, function (i) { return new ExecutableFunicular(i.id); });
            var ExecutableFunicularsManager = funiculars_manager_1.mixin(manager_1.Manager, ExecutableFunicular);
            var base = new cursor_1.Cursor();
            var ccm = new childs_cursors_manager_1.ChildsCursorsManager();
            base.on('changed', ccm.maintain(''));
            var all = new ExecutableFunicularsManager();
            var TestFunicular = /** @class */ (function (_super) {
                __extends(TestFunicular, _super);
                function TestFunicular() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.clone = function (i) { return new TestFunicular(i.id); };
                    return _this;
                }
                TestFunicular.prototype.register = function (callback) {
                    if (!all.nodes[this.id])
                        all.add(this);
                    callback();
                };
                TestFunicular.prototype.unregister = function (callback) {
                    if (all.nodes[this.id])
                        all.remove(this);
                    callback();
                };
                TestFunicular.prototype.requestChild = function (c, callback) {
                    var oldChild = all.nodes[c];
                    if (oldChild) {
                        if (oldChild.state === funicular_1.EFunicularState.Mounted)
                            callback(oldChild);
                        else
                            oldChild.on('mounted', function () { return callback(oldChild); });
                    }
                    else {
                        var newChild_1 = new TestFunicular(c);
                        newChild_1.on('mounted', function () { return callback(newChild_1); });
                        newChild_1.mount(ccm.nodes[newChild_1.id]);
                    }
                };
                TestFunicular.prototype.requestChilds = function (callback) {
                    var _this = this;
                    async.eachOf(this.cursor.get('childs'), function (globalName, localName, done) {
                        _this.requestChild(globalName, function (child) {
                            _this.childs.add(child);
                            done();
                        });
                    }, function () { return callback(); });
                };
                TestFunicular.prototype.abandonChilds = function (callback) {
                    var _this = this;
                    async.each(this.childs.nodes, function (child, done) {
                        child.parents.remove(_this);
                        if (!_.size(child.parents))
                            child.unmount();
                        done();
                    }, function () { return callback(); });
                };
                TestFunicular.prototype.starting = function (callback) {
                    var _this = this;
                    var context = {
                        require: function (localName) {
                            return _this.childs.nodes[_this.cursor.get('childs')[localName]].result;
                        },
                        module: {
                            exports: {}
                        }
                    };
                    vm.runInNewContext(this.cursor.get('value'), context, {
                        filename: this.cursor.get('globalName'),
                        timeout: 500
                    });
                    this.result = context.module.exports;
                    callback();
                };
                TestFunicular.prototype.stopping = function (callback) {
                    this.result = undefined;
                    callback();
                };
                return TestFunicular;
            }(ExecutableFunicular));
            base.exec(null, {
                a: {
                    type: 'js',
                    globalName: 'a',
                    value: "\nvar b = require('./b');\nvar c = require('./c');\nmodule.exports = 'a'+b+c;\n          ",
                    childs: {
                        './b': 'b',
                        './c': 'c'
                    }
                },
                b: {
                    type: 'js',
                    globalName: 'b',
                    value: "module.exports = 'b';",
                    childs: {}
                },
                c: {
                    type: 'js',
                    globalName: 'c',
                    value: "module.exports = 'c';",
                    childs: {}
                }
            });
            var f = new TestFunicular('a');
            var emits = [];
            f.on('emit', function (_a) {
                var eventName = _a.eventName;
                return emits.push(eventName);
            });
            f.mount(ccm.nodes[f.id]);
            chai_1.assert.deepEqual(emits, [
                'mounting',
                'cursorFilling', 'cursorFilled',
                'childsMounting', 'childsMounted',
                'starting', 'started',
                'mounted',
            ]);
            chai_1.assert.equal(f.state, funicular_1.EFunicularState.Mounted);
            chai_1.assert.equal(f.result, 'abc');
            base.apply({
                type: 'set',
                path: 'b.value',
                value: "module.exports = 'd';"
            });
            chai_1.assert.deepEqual(emits, [
                'mounting',
                'cursorFilling', 'cursorFilled',
                'childsMounting', 'childsMounted',
                'starting', 'started',
                'mounted',
                'remounting', 'remounted',
                'unmounting',
                'stopping', 'stopped',
                'childsUnmounting', 'childsUnmounted',
                'unmounted',
                'destroyed',
            ]);
            chai_1.assert.equal(f.state, funicular_1.EFunicularState.Unmounted);
            chai_1.assert.equal(f.remounted.state, funicular_1.EFunicularState.Mounted);
            chai_1.assert.equal(f.remounted.result, 'adc');
        });
    });
}
exports["default"] = default_1;
//# sourceMappingURL=executable-funicular.js.map
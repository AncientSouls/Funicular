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
var async = require("async");
var cursor_1 = require("ancient-cursor/lib/cursor");
var childs_cursors_manager_1 = require("ancient-cursor/lib/childs-cursors-manager");
var funicular_1 = require("../lib/funicular");
var funiculars_manager_1 = require("../lib/funiculars-manager");
function default_1() {
    describe('Funicular:', function () {
        it('lifecycle', function () {
            // In this test there are no situations outside the scope of the test, such as:
            // existance of necessary data, local and global funicular identifiers, executable data...
            var base = new cursor_1.Cursor();
            var ccm = new childs_cursors_manager_1.ChildsCursorsManager();
            base.on('changed', ccm.maintain(''));
            var all = new funiculars_manager_1.FunicularsManager();
            var TestFunicular = /** @class */ (function (_super) {
                __extends(TestFunicular, _super);
                function TestFunicular() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.Node = TestFunicular;
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
                        var newChild_1 = new this.Node(c);
                        newChild_1.on('mounted', function () { return callback(newChild_1); });
                        newChild_1.mount(ccm.nodes[newChild_1.id]);
                    }
                };
                TestFunicular.prototype.requestChilds = function (callback) {
                    var _this = this;
                    async.each(this.cursor.get('childs'), function (c, done) {
                        _this.requestChild(c, function (child) {
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
                    this.result = this.cursor.get('value') + _.map(this.childs.nodes, function (c) { return c.result; }).join('');
                    callback();
                };
                TestFunicular.prototype.stopping = function (callback) {
                    this.result = undefined;
                    callback();
                };
                return TestFunicular;
            }(funicular_1.Funicular));
            base.exec(null, {
                a: { value: 'a', childs: ['b', 'c'] },
                b: { value: 'b', childs: [] },
                c: { value: 'c', childs: [] }
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
                value: 'd'
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
//# sourceMappingURL=funicular.js.map
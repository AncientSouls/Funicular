"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const chai_1 = require("chai");
const vm = require("vm");
const async = require("async");
const manager_1 = require("ancient-mixins/lib/manager");
const cursor_1 = require("ancient-cursor/lib/cursor");
const childs_cursors_manager_1 = require("ancient-cursor/lib/childs-cursors-manager");
const funicular_1 = require("../lib/funicular");
const funiculars_manager_1 = require("../lib/funiculars-manager");
const delay = (t) => new Promise(resolve => setTimeout(resolve, t));
function default_1() {
    describe('ExecutableFunicular:', () => {
        it('lifecycle', () => __awaiter(this, void 0, void 0, function* () {
            const ExecutableFunicular = funicular_1.mixin(funicular_1.Funicular, i => new ExecutableFunicular(i.id));
            const ExecutableFunicularsManager = funiculars_manager_1.mixin(manager_1.Manager, ExecutableFunicular);
            const base = new cursor_1.Cursor();
            const ccm = new childs_cursors_manager_1.ChildsCursorsManager();
            base.on('changed', ccm.maintain(''));
            const all = new ExecutableFunicularsManager();
            class TestFunicular extends ExecutableFunicular {
                constructor() {
                    super(...arguments);
                    this.clone = i => new TestFunicular(i.id);
                }
                register() {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (!all.list.nodes[this.id])
                            all.add(this);
                    });
                }
                unregister() {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (all.list.nodes[this.id])
                            all.remove(this);
                    });
                }
                requestChild(c, callback) {
                    const oldChild = all.list.nodes[c];
                    if (oldChild) {
                        if (oldChild.state === funicular_1.EFunicularState.Mounted)
                            callback(oldChild);
                        else
                            oldChild.on('mounted', () => callback(oldChild));
                    }
                    else {
                        const newChild = new TestFunicular(c);
                        newChild.on('mounted', () => callback(newChild));
                        newChild.mount(ccm.list.nodes[newChild.id]);
                    }
                }
                requestChilds() {
                    return new Promise((resolve) => {
                        async.eachOf(this.cursor.get('childs'), (globalName, localName, done) => {
                            this.requestChild(globalName, (child) => {
                                this.childs.add(child);
                                done();
                            });
                        }, () => resolve());
                    });
                }
                abandonChilds() {
                    return new Promise((resolve) => {
                        async.each(this.childs.list.nodes, (child, done) => {
                            child.parents.remove(this);
                            if (!_.size(child.parents))
                                child.unmount();
                            done();
                        }, () => resolve());
                    });
                }
                starting() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const context = {
                            require: (localName) => {
                                return this.childs.list.nodes[this.cursor.get('childs')[localName]].result;
                            },
                            module: {
                                exports: {},
                            },
                        };
                        vm.runInNewContext(this.cursor.get('value'), context, {
                            filename: this.cursor.get('globalName'),
                            timeout: 500,
                        });
                        this.result = context.module.exports;
                    });
                }
                stopping() {
                    return __awaiter(this, void 0, void 0, function* () {
                        this.result = undefined;
                    });
                }
            }
            base.exec(null, {
                a: {
                    type: 'js',
                    globalName: 'a',
                    value: `
var b = require('./b');
var c = require('./c');
module.exports = 'a'+b+c;
          `,
                    childs: {
                        './b': 'b',
                        './c': 'c',
                    },
                },
                b: {
                    type: 'js',
                    globalName: 'b',
                    value: `module.exports = 'b';`,
                    childs: {},
                },
                c: {
                    type: 'js',
                    globalName: 'c',
                    value: `module.exports = 'c';`,
                    childs: {},
                },
            });
            const f = new TestFunicular('a');
            const emits = [];
            f.on('emit', ({ eventName }) => emits.push(eventName));
            yield f.mount(ccm.list.nodes[f.id]);
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
                value: `module.exports = 'd';`,
            });
            yield delay(1);
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
        }));
    });
}
exports.default = default_1;
//# sourceMappingURL=executable-funicular.js.map
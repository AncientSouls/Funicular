"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const chai_1 = require("chai");
const async = require("async");
const cursor_1 = require("ancient-cursor/lib/cursor");
const childs_cursors_manager_1 = require("ancient-cursor/lib/childs-cursors-manager");
const funicular_1 = require("../lib/funicular");
const funiculars_manager_1 = require("../lib/funiculars-manager");
function default_1() {
    describe('Funicular:', () => {
        it('lifecycle', () => {
            const base = new cursor_1.Cursor();
            const ccm = new childs_cursors_manager_1.ChildsCursorsManager();
            base.on('changed', ccm.maintain(''));
            const all = new funiculars_manager_1.FunicularsManager();
            class TestFunicular extends funicular_1.Funicular {
                constructor() {
                    super(...arguments);
                    this.clone = i => new TestFunicular(i.id);
                }
                register(callback) {
                    if (!all.list.nodes[this.id])
                        all.add(this);
                    callback();
                }
                unregister(callback) {
                    if (all.list.nodes[this.id])
                        all.remove(this);
                    callback();
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
                requestChilds(callback) {
                    async.each(this.cursor.get('childs'), (c, done) => {
                        this.requestChild(c, (child) => {
                            this.childs.add(child);
                            done();
                        });
                    }, () => callback());
                }
                abandonChilds(callback) {
                    async.each(this.childs.list.nodes, (child, done) => {
                        child.parents.remove(this);
                        if (!_.size(child.parents))
                            child.unmount();
                        done();
                    }, () => callback());
                }
                starting(callback) {
                    this.result = this.cursor.get('value') + _.map(this.childs.list.nodes, (c) => c.result).join('');
                    callback();
                }
                stopping(callback) {
                    this.result = undefined;
                    callback();
                }
            }
            base.exec(null, {
                a: { value: 'a', childs: ['b', 'c'] },
                b: { value: 'b', childs: [] },
                c: { value: 'c', childs: [] },
            });
            const f = new TestFunicular('a');
            const emits = [];
            f.on('emit', ({ eventName }) => emits.push(eventName));
            f.mount(ccm.list.nodes[f.id]);
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
                value: 'd',
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
exports.default = default_1;
//# sourceMappingURL=funicular.js.map
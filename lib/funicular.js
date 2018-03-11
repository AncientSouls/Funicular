"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const node_1 = require("ancient-mixins/lib/node");
const funiculars_manager_1 = require("./funiculars-manager");
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
function mixin(superClass, clone) {
    return class FunicularMixed extends superClass {
        constructor() {
            super(...arguments);
            this.clone = clone;
            this.state = EFunicularState.Constructed;
            this.childs = new funiculars_manager_1.FunicularsManager();
            this.parents = new funiculars_manager_1.FunicularsManager();
            this.needRemount = false;
            this.needUnmount = false;
        }
        mount(cursor) {
            if (this.state !== EFunicularState.Constructed) {
                throw new Error(`Funicular ${this.id} is already mounted.`);
            }
            this.cursor = cursor;
            this.state = EFunicularState.Mounting;
            this.emit('mounting', { funicular: this });
            this.register(_.once(() => {
                this.cursorFilling(_.once(() => {
                    this.childsMounting(_.once(() => {
                        this.start(_.once(() => {
                            this.watchChildsEvents();
                            this.addParentToChilds();
                            this.state = EFunicularState.Mounted;
                            this.emit('mounted', { funicular: this });
                            if (this.needUnmount)
                                this.unmount();
                            else if (this.needRemount)
                                this.remount();
                        }));
                    }));
                }));
            }));
        }
        remount() {
            if (this.state === EFunicularState.Mounted) {
                this.state = EFunicularState.Remounting;
                this.emit('remounting', { funicular: this });
                this.unregister(_.once(() => {
                    this.cloneAndMount(_.once(() => {
                        this.emit('remounted', { funicular: this });
                        this.unmount();
                    }));
                }));
            }
            else
                this.needRemount = true;
        }
        unmount() {
            if (this.state === EFunicularState.Mounted || this.state === EFunicularState.Remounting) {
                this.state = EFunicularState.Unmounting;
                this.emit('unmounting', { funicular: this });
                this.stop(_.once(() => {
                    this.childsUnmounting(_.once(() => {
                        this.unwatchChildsEvents();
                        this.unregister(_.once(() => {
                            this.state = EFunicularState.Unmounted;
                            this.emit('unmounted', { funicular: this });
                            this.destroy();
                        }));
                    }));
                }));
            }
            else
                this.needUnmount = true;
        }
        register(callback) {
            throw new Error('Method register must defined in this class!');
        }
        unregister(callback) {
            throw new Error('Method unregister must defined in this class!');
        }
        cursorFilling(callback) {
            this.emit('cursorFilling', { funicular: this });
            if (_.isUndefined(this.cursor.data)) {
                this.cursor.once('changed', () => this.cursorFilling(callback));
            }
            else {
                this.cursor.once('changed', () => this.remount());
                this.emit('cursorFilled', { funicular: this });
                callback();
            }
        }
        childsMounting(callback) {
            this.emit('childsMounting', { funicular: this });
            this.requestChilds(_.once(() => {
                this.emit('childsMounted', { funicular: this });
                callback();
            }));
        }
        childsUnmounting(callback) {
            this.emit('childsUnmounting', { funicular: this });
            this.abandonChilds(_.once(() => {
                this.emit('childsUnmounted', { funicular: this });
                callback();
            }));
        }
        requestChilds(callback) {
            throw new Error('Method requestChilds must defined in this class!');
        }
        abandonChilds(callback) {
            throw new Error('Method abandonChilds must defined in this class!');
        }
        start(callback) {
            this.emit('starting', { funicular: this });
            this.starting(_.once(() => {
                this.emit('started', { funicular: this });
                callback();
            }));
        }
        stop(callback) {
            this.emit('stopping', { funicular: this });
            this.stopping(_.once(() => {
                this.emit('stopped', { funicular: this });
                callback();
            }));
        }
        starting(callback) {
            throw new Error('Method starting must defined in this class!');
        }
        stopping(callback) {
            throw new Error('Method stopping must defined in this class!');
        }
        watchChildsEvents() {
            this.removedListener = ({ node }) => node.remounted || this.childDestroyed(node);
            this.remountedListener = ({ funicular }) => this.childRemounted(funicular);
            this.childs.on('removed', this.removedListener);
            this.childs.on('remounted', this.remountedListener);
        }
        unwatchChildsEvents() {
            this.childs.off('removed', this.removedListener);
            this.childs.off('remounted', this.remountedListener);
        }
        childDestroyed(child) {
            this.remount();
        }
        childRemounted(child) {
            this.remount();
        }
        addParentToChilds() {
            _.each(this.childs.nodes, (child) => child.parents.add(this));
        }
        cloneAndMount(callback) {
            const clone = this.clone(this);
            clone.on('mounted', () => {
                this.remounted = clone;
                callback();
            });
            clone.mount(this.cursor);
        }
    };
}
exports.default = mixin;
exports.mixin = mixin;
const MixedFunicular = mixin(node_1.Node, i => new Funicular(i.id));
exports.MixedFunicular = MixedFunicular;
class Funicular extends MixedFunicular {
}
exports.Funicular = Funicular;
//# sourceMappingURL=funicular.js.map
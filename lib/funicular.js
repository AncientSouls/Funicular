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
            return __awaiter(this, void 0, void 0, function* () {
                if (this.state !== EFunicularState.Constructed) {
                    throw new Error(`Funicular ${this.id} is already mounted.`);
                }
                this.cursor = cursor;
                this.state = EFunicularState.Mounting;
                this.emit('mounting', { funicular: this });
                yield this.register();
                yield this.cursorFilling();
                yield this.childsMounting();
                yield this.start();
                this.watchChildsEvents();
                this.addParentToChilds();
                this.state = EFunicularState.Mounted;
                this.emit('mounted', { funicular: this });
                if (this.needUnmount)
                    yield this.unmount();
                else if (this.needRemount)
                    yield this.remount();
            });
        }
        remount() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.state === EFunicularState.Mounted) {
                    this.state = EFunicularState.Remounting;
                    this.emit('remounting', { funicular: this });
                    yield this.unregister();
                    yield this.cloneAndMount();
                    this.emit('remounted', { funicular: this });
                    yield this.unmount();
                }
                else
                    this.needRemount = true;
            });
        }
        unmount() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.state === EFunicularState.Mounted || this.state === EFunicularState.Remounting) {
                    this.state = EFunicularState.Unmounting;
                    this.emit('unmounting', { funicular: this });
                    yield this.stop();
                    yield this.childsUnmounting();
                    this.unwatchChildsEvents();
                    yield this.unregister();
                    this.state = EFunicularState.Unmounted;
                    this.emit('unmounted', { funicular: this });
                    yield this.destroy();
                }
                else
                    this.needUnmount = true;
            });
        }
        register() {
            throw new Error('Method register must defined in this class!');
        }
        unregister() {
            throw new Error('Method unregister must defined in this class!');
        }
        cursorFilling() {
            this.emit('cursorFilling', { funicular: this });
            return new Promise((resolve) => {
                if (_.isUndefined(this.cursor.data)) {
                    this.cursor.once('changed', () => __awaiter(this, void 0, void 0, function* () {
                        yield this.cursorFilling();
                        resolve();
                    }));
                }
                else {
                    this.cursor.once('changed', () => this.remount());
                    this.emit('cursorFilled', { funicular: this });
                    resolve();
                }
            });
        }
        childsMounting() {
            return __awaiter(this, void 0, void 0, function* () {
                this.emit('childsMounting', { funicular: this });
                yield this.requestChilds();
                this.emit('childsMounted', { funicular: this });
            });
        }
        childsUnmounting() {
            return __awaiter(this, void 0, void 0, function* () {
                this.emit('childsUnmounting', { funicular: this });
                yield this.abandonChilds();
                this.emit('childsUnmounted', { funicular: this });
            });
        }
        requestChilds() {
            throw new Error('Method requestChilds must defined in this class!');
        }
        abandonChilds() {
            throw new Error('Method abandonChilds must defined in this class!');
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                this.emit('starting', { funicular: this });
                yield this.starting();
                this.emit('started', { funicular: this });
            });
        }
        stop() {
            return __awaiter(this, void 0, void 0, function* () {
                this.emit('stopping', { funicular: this });
                yield this.stopping();
                this.emit('stopped', { funicular: this });
            });
        }
        starting() {
            throw new Error('Method starting must defined in this class!');
        }
        stopping() {
            throw new Error('Method stopping must defined in this class!');
        }
        watchChildsEvents() {
            this.removedListener = ({ node }) => node.remounted || this.childDestroyed(node);
            this.remountedListener = ({ funicular }) => this.childRemounted(funicular);
            this.childs.on('removed', this.removedListener);
            this.childs.list.on('remounted', this.remountedListener);
        }
        unwatchChildsEvents() {
            this.childs.off('removed', this.removedListener);
            this.childs.list.off('remounted', this.remountedListener);
        }
        childDestroyed(child) {
            this.remount();
        }
        childRemounted(child) {
            this.remount();
        }
        addParentToChilds() {
            _.each(this.childs.list.nodes, (child) => child.parents.add(this));
        }
        cloneAndMount() {
            return new Promise((resolve) => {
                const clone = this.clone(this);
                clone.once('mounted', () => {
                    this.remounted = clone;
                    resolve();
                });
                clone.mount(this.cursor);
            });
        }
        destroy() {
            if (this.state !== EFunicularState.Unmounted) {
                throw new Error(`Not unmounted funicular ${this.id} cant be destroyed.`);
            }
            return super.destroy();
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
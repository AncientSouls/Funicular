import {
  Item as ProtoItem,
} from '../lib';

import vm from 'vm';
import PromiseProps from 'p-props';

// Freely extend this class with your custom logic.
class Item extends ProtoItem {
  mount() {
    if (this.isMounted()) return Promise.resolve(this);
    if (!this.data) return Promise.reject('Data not founded.');
    
    return new Promise((resolve, reject) => {
      if (this.data.type) {
        // Support for custom type mounter.
        this.get(this.data.type).then((typeItem) => {
          this.set(null, typeItem);
          var type = typeItem.getResult();
          if (type.mount) type.mount.call(this).then(() => resolve(this), reject);
          else resolve(this);
        }).catch(reject);
      } else {
        // Support for non-stored, system data types.
        this.getResult = () => this.data.result;
        resolve(this);
      }
    }).then((item) => {
      if (!item.isMounted()) throw new Error(`Item { id: "${this.data.id}", type: "${this.data.type}" } is not mounted. Type not define getResult method.`);
      return item;
    });
  }
  unmount() {
    if (!this.isMounted()) return Promise.resolve(this);
    if (Object.keys(this.parents).length) return Promise.resolve(this);
    
    delete this.getResult;
    
    return Promise
    // Unmount and unset childs before try unmount current item.
    .all(Object.keys(this.childs).map((c) => {
      this.unset(this.childs[c]);
      return this.childs[c].unmount();
    }))
    .then(() => {
      // System non-stored data, is not unmountable.
      if (!this.data.type) return this;
      
      // Load custom type unmounter.
      return this.get(this.data.type).then((typeItem) => {
        var type = typeItem.getResult();
        
        var unmountType = () => {
          this.unset(typeItem);
          return typeItem.unmount().then(() => this);
        };
        
        if (type.unmount) return type.unmount.call(this).then(unmountType);
        else {
          unmountType();
          return this;
        }
      }).then(() => this);
    })
  }
}

/**
 * @name Item#data
 * @type {Link=}
 */

/**
 * @interface Data
 */

/**
 * @name Data#id
 * @type {string=}
 */

/**
 * @name Data#type
 * @type {string=}
 * @descirption
 * If is undefined, result gets from data.result directly, without mounting.
 */


var Module = function(id, item) {
  this.id = id;
  this.children = [];
  this.parent = null;
  this.loaded = false;
  this.exports = {};
  this.item = item;
};

var js = {
  result: {
    mount() {
      var module = new Module(this.data.id, this);
      this.getResult = () => module.exports;
      
      var childs = {};
      if (this.data.childs) for (var c in this.data.childs)
        childs[c] = ((c) => this.get(this.data.childs[c]).then((child) => {
          this.set(c, child);
          return child;
        }))(c);
      
      return PromiseProps(childs).then((childs) => {
        vm.runInNewContext(this.data.code, {
          module,
          require: (name) => childs[name].getResult ? childs[name].getResult() : undefined,
        });
        
        return this;
      });
    },
  },
};

export {
  Module,
  Item,
  js,
};
# Funicular

[![npm version](https://badge.fury.io/js/ancient-funicular.svg)](https://badge.fury.io/js/ancient-funicular)
[![Join the chat at https://gitter.im/AncientSouls/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/AncientSouls/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Just async mounting, updating and unmounting hierarchical items.

## Install

```bash
npm install --save ancient-funicular
```

## Theory

[`Item`](https://ancientsouls.github.io/Funicular/Item.html) class represents the period of life of some data. Items are exists with name (`named`) and without name (`unnamed`). Unnamed items serve as the roots of a mointing tree. There can be as many as you need. Named items try to be unique and stores into `manager._items` by their unique names.

To work with the items, need instance of class[`Manager`](https://ancientsouls.github.io/Funicular/Manager.html) and your custom extended class [`Item`](https://ancientsouls.github.io/Funicular/Item.html).
You must override methods [`preparation`](https://ancientsouls.github.io/Funicular/Item.html#preparation), [`item.mounting`](https://ancientsouls.github.io/Funicular/Item.html#mounting), [`item.unmounting`](https://ancientsouls.github.io/Funicular/Item.html#unmounting) in [`Item`](https://ancientsouls.github.io/Funicular/Item.html), that would describe what in your application means mount and unmount data.

## Lifecycle

Any mount/unmount process consists of these steps:

* [`manager.get`](https://ancientsouls.github.io/Funicular/Manager.html#get) Universal getter of items. 
    * [`item.prepare`](https://ancientsouls.github.io/Funicular/Item.html#prepare) - Start sequence of loading of this data and childs queries.
        * [`item.mount`](https://ancientsouls.github.io/Funicular/Item.html#mount) - Start sequence of needed actions for run, start, mount, execute and so on...
* [`item.remount`](https://ancientsouls.github.io/Funicular/Item.html#remount) - Mount new active item with equal name any may be other query, and then unmount current item.
  * [`item.mount`](https://ancientsouls.github.io/Funicular/Item.html#mount) - Start sequence of needed actions for run, start, mount, execute and so on...
      * [`item.unmount`](https://ancientsouls.github.io/Funicular/Item.html#unmount) - Start sequence of needed actions forForget, stop, turn off and so on...
* [`item.unmount`](https://ancientsouls.github.io/Funicular/Item.html#unmount) - Start sequence of needed actions forForget, stop, turn off and so on...

## Examples

```js
import { Manager, Item } from 'ancient-funicular';
import { each } from 'async';

var memory = {
  a: { childs: ['b'] },
  b: {},
};

class Funicular extends NativeFunicular {
  constructor() {
    super();
    this.Carriage = extends class this.Carriage {
      enable(callback) {
        // Here it is necessary to subscribe to your data, get them and use the `carriage.mountChild` method to inform the parent carriage that this is her child.
        // In code below we just gets childs from example memory.
        if (this.data.childs) {
          async.each(this.data.childs, (child, next) => {
            this.mountChild(child, memory[child], (error) => {
              next(error); 
            });
          }, (error) => {
            if (error) {
              this.error = new Error('Broken child.');
              each(this.childs, (child, next) => {
                child.unmount();
              }, () => {
                callback();
              });
            } else {
              // Place here, before callback, useful work of current parent carriage.
              callback();
            }
          });
        } else callback();
      }
      disable(callback) {
        // Here it is necessary to unsubscribe of your data, forget and disable any processes.
      }
    }
  }
}

class CustomItem extends Item {
  preparation(callback) {
    if (this.name) this.data = memory[this.name];
    else if (this.query) this.data = this.query;
    
    for (var c in this.data.childs) {
      this.prepareChild(this.data.childs[c]);
    }
    this.exports = {};
    this.prepared(undefined, callback);
  },
  mounting(callback) {
    each(this.childs, (child, next) => {
      this.mountChild(child, () => {
        next();
      });
    }, () => {
      this.exports = this.data;
      this.mounted(undefined, callback);
    });
  },
  unmounting(callback) {
    for (var c in this.childs) {
      this.childs[c].unmount();
    }
    this.unmounted(undefined, callback);
  }
}

var manager = new Manager(CustomItem);
```

Any item can be tracked using events. Support events almost clearly described here:

```js
manager.get('a')
  .on('prepared', (error, item, event) => item.mount(() => {
    console.log('already mounted or just mounted, calls once');
  }))
  .on('mounted', (error, item, event) => item.remount(item.query, () => {
    console.log('just remounted once');
  }))
  .on('remounted', (unmountError, oldItem, mountError, newItem, event) => newItem.unmount(() => {
    console.log('just unmounted once');
  }))
  .on('unmounted', (error, item, event) => console.log('just fully unmounted, without remounting'))
  .prepare((error, item) => console.log('just prepared, calls once'))
```

Method `on` reacts to real events, but methods as [`item.prepare`](https://ancientsouls.github.io/Funicular/Item.html#prepare), [`item.mount`](https://ancientsouls.github.io/Funicular/Item.html#mount), [`item.remount`](https://ancientsouls.github.io/Funicular/Item.html#remount), [`item.unmount`](https://ancientsouls.github.io/Funicular/Item.html#unmount) call callback anyway. If item already prepared, and you call .prepare with callback, it be it will be called immediately.
Any unmounting occurs by calling [`item.unmount`](https://ancientsouls.github.io/Funicular/Item.html#unmount). Calling to [`item.unmount`](https://ancientsouls.github.io/Funicular/Item.html#unmount) does not mean that it does happen.
This means that the item will check whether there are other dependent parental item, and only if they are not exists, unmount self. If the carriage is unmount, it tries to unmount all her children. If childs do not have other parents, they too will be unmounted.

```js
manager.get('a', memory.a)
  .prepare((error, a) => {
    a.isPrepared; // true
    a.childs.b.isPrepared; // true
    
    a.data == memory.a; // true
    a.childs.b; // Contains mounted b carriage.
    a.childs.b.data == memory.b; // true
    
    manager._items.a == a; // true
    manager._items.b == a.childs.b; // true
    
    // We can try to unmount child, but it not work if parents still mounted.
    a.childs.b.unmount();
    
    a.mount((error, a) => {
      a.isMounted; // true
      a.childs.b.isMounted; // true
      
      a.exports == a.data; // true
      a.childs.b.exports == a.childs.b.data; // true
      
      // Remount parent a item, just creates new item `a` with new hierarchy of childs.
      a.remount(a.query, (unmountError, olda, mountError, newa) => {
        olda == a; // true
        newa == a; // false
        
        olda.isUnmounted; // true
        olda.childs.b.isUnmounted; // true
        
        newa.isMounted // true
        newa.childs.b.isMounted // true remounted.
        
        // Unmount this parent with all childs if they not have other parents.
        a.unmount((error, a) => {
          a == newa; // true
          
          a.isUnmounted; // true
          a.childs.b.isUnmounted // true
          
          manager._items.a; // undefined
          manager._items.b; // undefined
        });
      });
    });
  });
```

In practice, it can be very useful to use unnamed items, which can also act as parents to other items, but can not be child of other carriages. Since the same class of `Item` is applied to it, data can be transmitted to it in the same form.

```js
var memory = {
  a: { childs: ['b'] },
  b: {},
};

var manager = new Manager(CustomItem);

manager.get(undefined, { childs: ['a'] })
  .prepare((error, root) => {
    Object.keys(manager._items).length; // 1
    manager._items.b.data == memory.b; // true
    
    root.isPrepared; // true
    root.child.b.isPrepared; // true
    
    root.mount((error, root) => {
      root.isMounted; // true
      root.child.b.isMounted; // true
      
      root.remount((unmountError, olda, mountError, newa) => {
        olda.isUnmounted; // true
        olda.child.b.isUnmounted; // true
        
        newa.isMounted; // true
        newa.child.b.isMounted; // true
        
        newa.unmount((error, root) => {
          root.isUnmounted; // true
          root.child.b.isUnmounted; // true
          
          Object.keys(manager._items).length; // 0
        });
      });
    });
  });
```

## Errors

If at any stage an error occurs it can be written in `carriage.error` or sended into callback in `enable` and `disable` methods. It is used as invalid carriage marker.

## Tests

Tests can be started with comand `npm install ancient-funicular && cd ./node_modules/ancient-funicular && npm run compile && npm test`. For more information lern [src/tests/index.js](https://github.com/AncientSouls/Funicular/blob/master/src/tests/index.js).

## License

The MIT License (MIT)
Copyright (c) 2016 Ivan S Glazunov <ivansglazunov@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

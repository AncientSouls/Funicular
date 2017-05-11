# Funicular

[![npm version](https://badge.fury.io/js/ancient-funicular.svg)](https://badge.fury.io/js/ancient-funicular)
[![Join the chat at https://gitter.im/AncientSouls/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/AncientSouls/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Executions with mount, unmount and update logics.

## Install

```bash
npm install --save ancient-funicular
```

## Theory

The carriage represents the period of life of some data. Coaches are named and not named. Unnamed carriages serve as the roots of a mointing tree. There can be as many as you need. Named carriages try to be unique.

To work with the carriages, it is necessary to prepare a class for `Funicular` and class `Carriage`.
You must override methods `enable` and` disable` in `Carriage`, that would describe what in your application means mount and unmount data.

```js
import NativeFunicular from 'ancient-funicular';
import async from 'async';

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

var funicular = new Funicular();
```

Any coach is created and tracked using the `funicular.mount`. Named carriages will not be mount again, they will be taken from memory. If carriage no longer matches the actual data, you can use `this.remount` from `enable` method. It mount new carriage of this name, and mark previously version of carriage as invalid.
Any unmounting occurs by calling `carriage.unmount`. Calling to `carriage.unmount` does not mean that it does happen.
This means that the coach will check whether there are other dependent parental carriage, and only if they are not exists, unmount self. If the carriage is unmount, it tries to unmount all her children. If childs do not have other parents, they too will be unmounted.

```js
funicular.mount('a', memory.a,
  // mountedCallback - Calls after this carriage fully mounted with childs.
  (error, a) => {
    a.id // 1
    a.unique() // true
    
    a.childs.b // Contains mounted b carriage.
    a.childs.b.id // 2
    
    funicular.namedCarriages.a[1] == a // true
    funicular.namedCarriages.b[2] == a.childs.b // true
    
    // We can try to unmount child, but it not work if parents still mounted.
    a.childs.b.unmount();
    
    a.remount();
  },
  // remountedCallback - Calls when called remount method, new carriage fully mounted and old carriage fully unmounted.
  (unmountError, olda, mountError, newa) => {
    olda.id // 1
    olda.unique() // false
    newa.id // 3
    newa.unique() // true
    
    olda.childs // After old carriage is unmounted, childs object clears.
    newa.childs.b // New carriage contains mounted b carriage too.
    newa.childs.b.id // 2 // Child not remount when parent is remounted.
    
    funicular.namedCarriages.a[1] // undefined
    funicular.namedCarriages.a[3] == newa // true
    funicular.namedCarriages.b[2] == newa.childs.b // true
    
    a.unmount(); // Unmount this parent with all childs if they not have other parents.
  },
  // unmountedCallback - Calls after this carriage fully unmunted (not remounted but namely unmounted)
  (error, a) => {
    a.id // 3
    a.childs // After unmounted, childs object clears.
    
    funicular.namedCarriages.a[1] // undefined
    funicular.namedCarriages.a[3] // undefined
    funicular.namedCarriages.b[2] // undefined
    
    // All cariages are unmounted.
  }
);
```

In practice, it can be very useful to use unnamed carriages, which can also act as parents to other carriages, but can not be child of other carriages. Since the same class of `Carriage` is applied to it, data can be transmitted to it in the same form.

```js
var memory = {
  a: { childs: ['b'] },
  b: {},
};

var funicular = new Funicular();

funicular.mount(undefined, { childs: ['a'] },
  (error, root) => {
    root.id // 1
    root.childs.a.id // 2
    root.childs.a.childs.b.id // 3
    
    funicular.unnamedCarriages[1] == this // true
    
    this.remount();
  },
  (unmountError, oldRoot, mountError, newRoot) => {
    oldRoot.id // 1
    newRoot.id // 4
    
    newRoot.childs.a.id // 2
    newRoot.childs.a.childs.b.id // 3
    
    funicular.unnamedCarriages[1] // undefined
    funicular.unnamedCarriages[4] == this // true
    
    newRoot.unmount();
  },
  (error, root) => {
    root.id // 4
    
    funicular.unnamedCarriages[4] // undefined
  }
);
```

In this example, the data `a` will be remounted when the children are remounted.

```js
var memory = {
  a: { childs: ['b'], childRemount: true },
  b: {},
};

var funicular = new Funicular();

funicular.Carriage = class extends funicular.Carriage {
  // By default, this event is ignored, but it can be determined.
  childDidRemount(unmountError, oldRoot, mountError, newRoot) {
    this.remount();
  }
};

funicular.mount('a', memory.a,
  (error, a) => {
    a.id // 1
    a.childs.b.id // 2
    a.childs.b.remount();
  },
  (unmountError, olda, mountError, newa) => {
    newa.id // 4
    newa.childs.b // 3
    // Our `a` remounted.
    newa.unmount();
  },
  (error, a) => {
    // All unmounted.
  }
);
```

## Lifecycle

* [`funicular.mount(name, data, mountedCallback, remoutedCallback, unmountedCallback)`](https://ancientsouls.github.io/Funicular/Funicular.html#mount)
  * [`var carriage = new funicular.Carriage(funicular, name, data)`](https://ancientsouls.github.io/Funicular/Carriage.html)
    * [`carriage.mount()`](https://ancientsouls.github.io/Funicular/Carriage.html#mount)
      * [`carriage.enable(callback)`](https://ancientsouls.github.io/Funicular/Carriage.html#enable) **to override**
        * `carriage.mountedCallbacks` call all mount callback handlers of this carriage setted from multiple mounts
* [`carriage.remount()`](https://ancientsouls.github.io/Funicular/Carriage.html#remount)
  * [`funicular.mount(name, data, mountedCallback, remoutedCallback, unmountedCallback)`](https://ancientsouls.github.io/Funicular/Funicular.html#mount)
    * [`carriage.unmount()`](https://ancientsouls.github.io/Funicular/Carriage.html#unmount)
      * `carriage.remountedCallbacks` call all mount callback handlers of this carriage setted from multiple mounts
* [`carriage.unmount()`](https://ancientsouls.github.io/Funicular/Funicular.html#unmount)
  * [`carriage.disable(callback)`](https://ancientsouls.github.io/Funicular/Carriage.html#disable) **to override**
    * `carriage.unmountedCallbacks` call all mount callback handlers of this carriage setted from multiple mounts

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

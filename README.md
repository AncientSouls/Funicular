# Funicular

[![npm version](https://badge.fury.io/js/ancient-funicular.svg)](https://badge.fury.io/js/ancient-funicular)
[![Join the chat at https://gitter.im/AncientSouls/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/AncientSouls/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Executions with mount, unmount and update logics.

## Install

```bash
npm install --save ancient-funicular
```

## Theory

### Lifecycle

Any carriage goes through some stages of life:

#### Mounting

##### `funicular.mountRoot`

Starts the mounting of the root carriage.

Child carriages will be automatically assigned.

##### `funicular.mount`

A common method for a funicular to mount a new carriage.

Universal mount point for all carriages.

> Attention! Not for external usage.

##### `construct`

Carriages automatically constructs in funicular `mount` function.

At this point, the carriage is registered in the list of all existing carriages in `funicular.carriages`.

> Attention! Not for external usage.

##### `carriage.mount`

* `carriage.subscribe` - Getting necessary data by name, subscribing to them. **you must override it**
* `carriage.getChildsNames` - Getting child names array from gotted data. **you must override it**
* `carriage.mountChilds` - Mounting all childs from gotted data.
* `carriage.unsafeMount` - Any necessary actions for your custom mounting logic. **you can override it**

> Attention! Not for external usage.

### Updating

By default, update event just call `carriage.updated` method, with `carriage.data` reset, but you can override it for anything else.

For example you can use this code, for mount new carriage and unmount old, on easy updated event.

```js
var OldCarriage = funicular.Carriage;
funicular.Carriage = class extends OldCarriage {
  updated(newData) {
    funicular.mount(this.name, (error, newCarriage) => {
      this.remountedCarriage = newCarriage;
      newCarriage.mountedCallbacks = this.mountedCallbacks;
      this.mountedCallbacks = [];
      newCarriage.unmountedCallbacks = this.unmountedCallbacks;
      this.moveRoots(newCarriage);
      this.unmount();
      this.unmountedCallbacks = [];
    });
  }
};
```

### Unmounting

Carriages can not be unmounted while it has parents. It is necessary to unmount the parents first.
To unmount root, you should use `unmountRoot` argument from callback in `Funicular#mountRoot`.

##### `carriage.unmount`

* `carriage.unmountChilds` - Unmounting all childs from `carriage._childs`.
* `carriage.unsafeUnmount` - Unregister from list of carriages, mark starge `unmounted`, and any necessary actions for your custom mounting logic. **you can override it**
* `carriage.unsubscribe` - Run function setted in ovverided subscribe method.
* `carriage.unmountedCallbacks` - All callback handles unmount this carriage.

> Attention! Not for external usage.

### Carriage
Capsule for data.
Has several states in the stage:

 * `broken` - Broken in any method... somewere.
 * `construct` - Not subscribed, fetched and mounted. Just constructed and registred in funicular.
 * `fetched` - Subscribed and fetched.
 * `mounted` - Mounted.
 * `unmounted` - Unmounted.

All children are mounted and unmounted themselves if the `Carriage#getChildsNames` function is described correctly.
For manually mount carriage with root maintaining, need to use methods `Funicular#mountRoot` and `unmountRoot` argument in callback.

#### parents

Other carriages, with childs. If method `Carriage#getChildsNames` is described correctly, 

## Example

Funicular adapts to any data types and any databases, but in this example will be used https://github.com/AncientSouls/Graph.

### Simple

```js
import Funicular from 'ancient-funicular';
import { ObjectGraph } from 'ancient-graph';

var collection = new ObjectGraph(collection, { id: 'id', childs: 'childs', });

var OldCarriage = funicular.Carriage;
funicular.Carriage = class extends OldCarriage {
  subscribe(callback) {
    this.unsubscribe = () => {
      updateStop();
      removeStop();
    };
    var updateStop = collection.on('update', (oldData, newData) => {
      if (newData.id == this.name) this.updated(newData);
    });
    var removeStop = collection.on('remove', (oldData, newData) => {
      if (newData.id == this.name) this.removed();
    });
    collection.get(this.name, undefined, (error, data) => {
      this.fetched(error, data);
      callback(error);
    });
  }
  getChildsNames() {
    this.childs = this.data.childs;
  }
}

var funicular = new Funicular();

collection.insert({ id: 'a', childs: ['b'] });
collection.insert({ id: 'b' });

funicular.mountRoot('a', (error, a) => {
  a.id; // 1
  a.name; // 'a'
  a.data; // { id: 'a', childs: ['b'] }
  
  a._childs.b.id; // 2
  a._childs.b.name; // 'b'
  a._childs.b.data; // { id: 'b' }
  
  a._childs.b._parents.a == a;
});
```

For more information please see tests.

## Tests

Tests can be started with comand `npm install ancient-funicular && cd ./node_modules/ancient-funicular && npm run compile && npm test`. For more information lern [src/tests/index.js](https://github.com/AncientSouls/Funicular/blob/master/src/tests/index.js).

## License

The MIT License (MIT)
Copyright (c) 2016 Ivan S Glazunov <ivansglazunov@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

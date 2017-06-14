# Funicular

[![Greenkeeper badge](https://badges.greenkeeper.io/AncientSouls/Funicular.svg)](https://greenkeeper.io/)

> 3.0.0

---

[![npm version](https://badge.fury.io/js/ancient-funicular.svg)](https://badge.fury.io/js/ancient-funicular)
[![Join the chat at https://gitter.im/AncientSouls/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/AncientSouls/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Just async mounting, updating and unmounting hierarchical items.

## Install

```bash
npm install --save ancient-funicular
```

## Why

There are systems for managing hierarchies and performing items in hierarchies, such as React.
However, it works synchronously, children do not affect their parents, it is difficult to use for custom logic.

**Funicular** contains basic asynchronous constructs for managing mountable, unmountable, changeable, replaceable, hierarchies of abstract items.

It does not work out of the box, it must be extented for your own needs.

## Facts

### Manager

Instance of class `Manager`.

The namespace for the unique items.

Creates or return already created active items.

Each item can be created only with the help of `manager.get`.

### Item

Instance of class `Item`.

Must be extented for your own needs.

Must be sended into `Manager` class on it construct.

Provide all needed methods for control one item.

Some methods of this class marked as **safe** perform the service function and are designed to be used by you in from anywhere.

Some methods of this class marked as **can override** or **must override** must or can be overridden.

Each item can have many children on which it depends, and many parents who depend on it.

##### Childs

Childs are stored in `item.childs` object by local names.

The item fully gets childs when item item is fully prepared, and has state `item.isPrepared == true`.

Childs are load and preparу automatically immediately after the code of the `item.preporation` method is executed and `this.prepared(error)` is called.

> Childs can not be  resetted or deleted from `item.childs` by the funicular logic.

If child has a replacement, his parents calls must ovverride method `item.childReplaced(localName, oldChild, newChild)`. This can lead to different consequences.

You must describe this method, for example, so that it replace parent and unmount old parent if in your own logic parents is dependent on the actuality of the childs:

```js
class CustomItem extends Item {
  childReplaced(localName, oldChild, newChild) {
    this.replace(this.name, this.query, this.data).mount((error, item) => {
      this.unmount();
    });
  }
}
```

###### 

##### Parents

Parents are stored in `item.parents` object by unique number `item.index` of each parent.

Parents can appear only after the beginning of preparation, when has state `item.isPrepared == false`.

Parents appear after another `item` are prepared and has state `item.isPrepared == true`. Then in the process of registering children, he will record himself as a parent to each of his children.

> Parents change from time to time. When the parent is completely unmounted, it removes himself from the list of parents of his childs.

You can specify your handler for the child when the parent is unmounted.

```js
class CustomItem extends Item {
  parentUnmounted(parent) {
    this.unmount();
  }
}
```

By default, the child makes an attempt to unmount. By default, child will be unmounted only if it does not have `item.parents`.

> >To answer the question, will unmount work  `item.unmount` corresponds to the overridden method `item.shouldUnmount`.

```js
class CustomItem extends Item {
  shouldUnmount(callback) {
    if (Object.keys(this.parents).length) {
      if (callback) callback();
    } else {
      this.forceUnmount(callback);
    }
  }
}
```

##### Active

An item is considered active when:

* `item` exists in `manager._items[item.index]`
* `item` has `item.isReplaced` and `item.isUnmounted` are equal `undefined`

An item is considered not active when:

* `item` has `item.isUnmounted` is equal `true`
* `item` has `item.isReplaced` is equal `true` and `item.replacedTo` contains next item. It may also not be active, to get the last active, use the `item.getActive()`

#### Lifecycle of item

##### Construct

Occurs when `manager.get` does not find an active item.

> By idea should not be overridden, but you can experiment)

This item already has 4 states:

```js
item.isPrepared; // undefined
item.isMounted; // undefined
item.isUnmounted; // undefined
item.isReplaced; // undefined
```

##### Prepare

It is provoked by calling the `item.prepare(callback)` method.

> Preparation can already be performing or be performed. Calling this method does not mean that the preparation will be execute now, it's just a thread to return the prepared item into callback, when it did prepared.

It symbolizes `this.data` loading for this item, as well as preparing its child items.

If the method is called the first time, it will set the state `item.isPrepared = false` and call must override method `item.preparation`.

When the preparation is completed, and you call `this.prepared(error)` method, the state will be set `item.isPrepared = true` and the children's `item.prepare` is called.

If you call `item.prepare` between `item.isPrepared` `true` and `false`, callback will be added to the `prepared` event handler.

When the preparation of one item is completed, the `prepared` event is called.

```js
item.emitter.once('prepared', (error, item) => {});
```

If you call the method `item.prepare` when state `item.isPrepared == true`, the callback will be called immediately, since the item is already prepared.

> One item can not be prepared several times.

###### Recursion solution

If your hierarchies contain recursions at this stage, you do not need to worry about this. When childs start to prepare, the parent will already be marked as `item.isPrepared == true` and there will be no re-preparation. 

##### Mount

It is provoked by calling the `item.mount(callback)` method.

> Mounting can already be performing or be performed. Calling this method does not mean that the mount will be execute now, it's just a thread to return the mounted item into callback, when it did mounted.

It symbolizes the execute/run/eval/start/mount in your logic of loaded `this.data`.

If the item is not yet prepared at the time of the call to `item.mount`, the preparation will be done automatically. This means that you can immediately call the `item.mount` without thinking about the preparation.

If the method is called the first time, it will set the state `item.isMounted = false` and call must override method `item.mounting`.

When the mounting is completed, and you call `this.mounted(error)` method, the state will be set `item.isMounted = true`.

Unlike preparation, you decide how and when childs will be mounted.

When the mounting is completed, and you call `this.mounted(error)` method, the state will be set `item.isMounted = true`.

You must ovveride `item.mounting` method. For example:

```js
class CustomItem extends Item {
  mounting() {
    async.each(this.childs, (child, next) => {
      child.mount(() => {
        next();
      });
    }, () => this.mounted(undefined));
  }
}
```

If you call `item.mount` between `item.isMounted` `true` and `false`, callback will be added to the `mounted` event handler.

```js
item.emitter.once('prepared', (error, item) => {});
```

> One item can not be mounted several times.

###### Recursion solution

It is recommended to consider this in your code. Unlike the preparation stage, if you call `item.mount` when the mount is already started, the callback will be called immediately, in order to avoid recursion.

You can override this with shouldMount:

```js
class CustomItem extends Item {
  shouldMount(callback) {
    if (callback) callback(undefined, this);
  }
}
```

##### Replace

It is provoked by calling the `item.replace()`/`item.replace(newItem)`/`item.replace(name)`/`item.replace(name, query)`/`item.replace(name, query, data)` method, that returns other active item.

If the item was not replaced earlier, creates a new item based on the instructions given in replace, or identical to the previous one. Marks the original `item.isPrepared == true`.

If the item has already been replaced, it acts identically to `item.getActive()`, returning the last active item.

After replace, this item can not be getted from manager. It is understood that the element gradually dies. However, they can continue to use if your code allows you to do this.

You must describe this method, for example, so that it replace parent and unmount old parent if in your own logic parents is dependent on the actuality of the childs:

```js
class CustomItem extends Item {
  childReplaced(localName, oldChild, newChild) {
    this.replace(this.name, this.query, this.data).mount((error, item) => {
      this.unmount();
    });
  }
}
```

After replace, fires event.

```js
item.emitter.once('replaced', (error, item) => {});
```

> One item can not be replaced several times.

##### Unmount

It is provoked by calling the `item.unmount(callback)` method.

> Unmounting can already be performing or be performed. Calling this method does not mean that the unmount will be execute now, it's just a thread to return the unmounted item into callback, when it did unmounted.

It symbolizes the destroy/stop/forget/clear/unmount in your logic.

If the method is called the first time, it will set the state `item.isUnmounted = false` and call can override method `item.unmounting`, which by default call `item.unmount` for childs.

When the `unmounting` is completed, and from it called `this.unmounted(error)` method, the state will be set `item.isUnmounted = true`.


You can ovveride `item.unmounting` method. For example:

```js
class CustomItem extends Item {
  unmounting() {
    for (var c in this.childs) {
      delete this.childs[c].parents[this.index];
      this.parentUnmounted();
    }
    this.unmounted(undefined);
  }
}
```

## Tests

Tests can be started with comand `npm install ancient-funicular && cd ./node_modules/ancient-funicular && npm run compile && npm test`. For more information lern [src/tests/index.js](https://github.com/AncientSouls/Funicular/blob/master/src/tests/index.js).

## License

The MIT License (MIT)
Copyright (c) 2016 Ivan S Glazunov <ivansglazunov@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

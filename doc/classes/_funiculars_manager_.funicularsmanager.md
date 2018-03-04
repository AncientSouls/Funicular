[ancient-funicular](../README.md) > ["funiculars-manager"](../modules/_funiculars_manager_.md) > [FunicularsManager](../classes/_funiculars_manager_.funicularsmanager.md)



# Class: FunicularsManager

## Type parameters
#### IN :  [TFunicular](../modules/_funicular_.md#tfunicular)
#### IEventsList :  [IFunicularsManagerEventsList](../interfaces/_funiculars_manager_.ifunicularsmanagereventslist.md)
## Hierarchy


↳  [IFunicularsManager](../interfaces/_funiculars_manager_.ifunicularsmanager.md)

**↳ FunicularsManager**







## Indexable

\[key: `string`\]:&nbsp;`any`
## Index

### Constructors

* [constructor](_funiculars_manager_.funicularsmanager.md#constructor)


### Properties

* [Node](_funiculars_manager_.funicularsmanager.md#node)
* [destroy](_funiculars_manager_.funicularsmanager.md#destroy)
* [emitter](_funiculars_manager_.funicularsmanager.md#emitter)
* [generateId](_funiculars_manager_.funicularsmanager.md#generateid)
* [id](_funiculars_manager_.funicularsmanager.md#id)
* [isDestroyed](_funiculars_manager_.funicularsmanager.md#isdestroyed)
* [nodes](_funiculars_manager_.funicularsmanager.md#nodes)


### Methods

* [add](_funiculars_manager_.funicularsmanager.md#add)
* [create](_funiculars_manager_.funicularsmanager.md#create)
* [emit](_funiculars_manager_.funicularsmanager.md#emit)
* [off](_funiculars_manager_.funicularsmanager.md#off)
* [on](_funiculars_manager_.funicularsmanager.md#on)
* [once](_funiculars_manager_.funicularsmanager.md#once)
* [remove](_funiculars_manager_.funicularsmanager.md#remove)
* [wrap](_funiculars_manager_.funicularsmanager.md#wrap)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new FunicularsManager**(id?: *`string`*): `any`


*Inherited from INode.__new*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/node.d.ts:11*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| id | `string`   |  - |





**Returns:** `any`

---


## Properties
<a id="node"></a>

### «Static» Node

**●  Node**:  *`TClass`.<`IN`>* 

*Inherited from IManager.Node*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/manager.d.ts:13*





___

<a id="destroy"></a>

### «Static» destroy

**●  destroy**:  *`function`* 

*Inherited from INode.destroy*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/node.d.ts:15*


#### Type declaration
►(): `void`





**Returns:** `void`






___

<a id="emitter"></a>

### «Static» emitter

**●  emitter**:  *`EventEmitter`* 

*Inherited from IEvents.emitter*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/events.d.ts:5*





___

<a id="generateid"></a>

### «Static» generateId

**●  generateId**:  *`function`* 

*Inherited from INode.generateId*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/node.d.ts:13*


#### Type declaration
►(): `string`





**Returns:** `string`






___

<a id="id"></a>

### «Static» id

**●  id**:  *`string`* 

*Inherited from INode.id*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/node.d.ts:11*





___

<a id="isdestroyed"></a>

### «Static» isDestroyed

**●  isDestroyed**:  *`boolean`* 

*Inherited from INode.isDestroyed*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/node.d.ts:14*





___

<a id="nodes"></a>

### «Static» nodes

**●  nodes**:  *`object`* 

*Inherited from IManager.nodes*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/manager.d.ts:14*


#### Type declaration


[id: `string`]: `IN`






___


## Methods
<a id="add"></a>

### «Static» add

► **add**(node: *`IN`*): `this`



*Inherited from IManager.add*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/manager.d.ts:17*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| node | `IN`   |  - |





**Returns:** `this`





___

<a id="create"></a>

### «Static» create

► **create**(id?: *`string`*): `IN`



*Inherited from IManager.create*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/manager.d.ts:20*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| id | `string`   |  - |





**Returns:** `IN`





___

<a id="emit"></a>

### «Static» emit

► **emit**IE(eventName: *`string`*, data: *`IEventsList[IE]`*): `this`



*Inherited from IEvents.emit*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/events.d.ts:6*



**Type parameters:**

#### IE :  `keyof IEventsList`
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eventName | `string`   |  - |
| data | `IEventsList[IE]`   |  - |





**Returns:** `this`





___

<a id="off"></a>

### «Static» off

► **off**IE(eventName: *`string`*, listener: *`function`*): `this`



*Inherited from IEvents.off*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/events.d.ts:9*



**Type parameters:**

#### IE :  `keyof IEventsList`
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eventName | `string`   |  - |
| listener | `function`   |  - |





**Returns:** `this`





___

<a id="on"></a>

### «Static» on

► **on**IE(eventName: *`string`*, listener: *`function`*): `this`



*Inherited from IEvents.on*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/events.d.ts:7*



**Type parameters:**

#### IE :  `keyof IEventsList`
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eventName | `string`   |  - |
| listener | `function`   |  - |





**Returns:** `this`





___

<a id="once"></a>

### «Static» once

► **once**IE(eventName: *`string`*, listener: *`function`*): `this`



*Inherited from IEvents.once*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/events.d.ts:8*



**Type parameters:**

#### IE :  `keyof IEventsList`
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eventName | `string`   |  - |
| listener | `function`   |  - |





**Returns:** `this`





___

<a id="remove"></a>

### «Static» remove

► **remove**(node: *`IN`*): `this`



*Inherited from IManager.remove*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/manager.d.ts:19*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| node | `IN`   |  - |





**Returns:** `this`





___

<a id="wrap"></a>

### «Static» wrap

► **wrap**(node: *`IN`*): `this`



*Inherited from IManager.wrap*

*Defined in /home/ubuntu/workspace/dev/packages/ancient-funicular/node_modules/ancient-mixins/lib/manager.d.ts:18*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| node | `IN`   |  - |





**Returns:** `this`





___



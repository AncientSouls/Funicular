[ancient-funicular](../README.md) > ["funicular"](../modules/_funicular_.md) > [Funicular](../classes/_funicular_.funicular.md)



# Class: Funicular

## Type parameters
#### IEventsList :  [IFunicularEventsList](../interfaces/_funicular_.ifuniculareventslist.md)[IFunicularEventData](../interfaces/_funicular_.ifuniculareventdata.md)
## Hierarchy


↳  [IFunicular](../interfaces/_funicular_.ifunicular.md)

**↳ Funicular**







## Indexable

\[key: `string`\]:&nbsp;`any`
## Index

### Constructors

* [constructor](_funicular_.funicular.md#constructor)


### Properties

* [Node](_funicular_.funicular.md#node)
* [childs](_funicular_.funicular.md#childs)
* [cursor](_funicular_.funicular.md#cursor)
* [destroy](_funicular_.funicular.md#destroy)
* [emitter](_funicular_.funicular.md#emitter)
* [generateId](_funicular_.funicular.md#generateid)
* [id](_funicular_.funicular.md#id)
* [isDestroyed](_funicular_.funicular.md#isdestroyed)
* [needRemount](_funicular_.funicular.md#needremount)
* [needUnmount](_funicular_.funicular.md#needunmount)
* [parents](_funicular_.funicular.md#parents)
* [remounted](_funicular_.funicular.md#remounted)
* [result](_funicular_.funicular.md#result)
* [state](_funicular_.funicular.md#state)


### Methods

* [abandonChilds](_funicular_.funicular.md#abandonchilds)
* [addParentToChilds](_funicular_.funicular.md#addparenttochilds)
* [childDestroyed](_funicular_.funicular.md#childdestroyed)
* [childRemounted](_funicular_.funicular.md#childremounted)
* [childsMounting](_funicular_.funicular.md#childsmounting)
* [childsUnmounting](_funicular_.funicular.md#childsunmounting)
* [cloneAndMount](_funicular_.funicular.md#cloneandmount)
* [cursorFilling](_funicular_.funicular.md#cursorfilling)
* [emit](_funicular_.funicular.md#emit)
* [mount](_funicular_.funicular.md#mount)
* [off](_funicular_.funicular.md#off)
* [on](_funicular_.funicular.md#on)
* [once](_funicular_.funicular.md#once)
* [register](_funicular_.funicular.md#register)
* [remount](_funicular_.funicular.md#remount)
* [requestChilds](_funicular_.funicular.md#requestchilds)
* [start](_funicular_.funicular.md#start)
* [starting](_funicular_.funicular.md#starting)
* [stop](_funicular_.funicular.md#stop)
* [stopping](_funicular_.funicular.md#stopping)
* [unmount](_funicular_.funicular.md#unmount)
* [unregister](_funicular_.funicular.md#unregister)
* [unwatchChildsEvents](_funicular_.funicular.md#unwatchchildsevents)
* [watchChildsEvents](_funicular_.funicular.md#watchchildsevents)



---
## Constructors
<a id="constructor"></a>


### ⊕ **new Funicular**(id?: *`string`*): `any`


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

**●  Node**:  *`TClass`.<[TFunicular](../modules/_funicular_.md#tfunicular)>* 

*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[Node](../interfaces/_funicular_.ifunicular.md#node)*

*Defined in [funicular.ts:67](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L67)*





___

<a id="childs"></a>

### «Static» childs

**●  childs**:  *[TFunicularsManager](../modules/_funiculars_manager_.md#tfunicularsmanager)* 

*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[childs](../interfaces/_funicular_.ifunicular.md#childs)*

*Defined in [funicular.ts:71](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L71)*





___

<a id="cursor"></a>

### «Static» cursor

**●  cursor**:  *`TCursor`* 

*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[cursor](../interfaces/_funicular_.ifunicular.md#cursor)*

*Defined in [funicular.ts:74](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L74)*





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

<a id="needremount"></a>

### «Static» needRemount

**●  needRemount**:  *`boolean`* 

*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[needRemount](../interfaces/_funicular_.ifunicular.md#needremount)*

*Defined in [funicular.ts:77](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L77)*





___

<a id="needunmount"></a>

### «Static» needUnmount

**●  needUnmount**:  *`boolean`* 

*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[needUnmount](../interfaces/_funicular_.ifunicular.md#needunmount)*

*Defined in [funicular.ts:78](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L78)*





___

<a id="parents"></a>

### «Static» parents

**●  parents**:  *[TFunicularsManager](../modules/_funiculars_manager_.md#tfunicularsmanager)* 

*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[parents](../interfaces/_funicular_.ifunicular.md#parents)*

*Defined in [funicular.ts:72](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L72)*





___

<a id="remounted"></a>

### «Static» remounted

**●  remounted**:  *[TFunicular](../modules/_funicular_.md#tfunicular)* 

*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[remounted](../interfaces/_funicular_.ifunicular.md#remounted)*

*Defined in [funicular.ts:80](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L80)*





___

<a id="result"></a>

### «Static» result

**●  result**:  *`any`* 

*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[result](../interfaces/_funicular_.ifunicular.md#result)*

*Defined in [funicular.ts:75](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L75)*





___

<a id="state"></a>

### «Static» state

**●  state**:  *[EFunicularState](../enums/_funicular_.efunicularstate.md)* 

*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[state](../interfaces/_funicular_.ifunicular.md#state)*

*Defined in [funicular.ts:69](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L69)*





___


## Methods
<a id="abandonchilds"></a>

### «Static» abandonChilds

► **abandonChilds**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[abandonChilds](../interfaces/_funicular_.ifunicular.md#abandonchilds)*

*Defined in [funicular.ts:95](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L95)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="addparenttochilds"></a>

### «Static» addParentToChilds

► **addParentToChilds**(): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[addParentToChilds](../interfaces/_funicular_.ifunicular.md#addparenttochilds)*

*Defined in [funicular.ts:109](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L109)*





**Returns:** `void`





___

<a id="childdestroyed"></a>

### «Static» childDestroyed

► **childDestroyed**(child: *[TFunicular](../modules/_funicular_.md#tfunicular)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[childDestroyed](../interfaces/_funicular_.ifunicular.md#childdestroyed)*

*Defined in [funicular.ts:106](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L106)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| child | [TFunicular](../modules/_funicular_.md#tfunicular)   |  - |





**Returns:** `void`





___

<a id="childremounted"></a>

### «Static» childRemounted

► **childRemounted**(child: *[TFunicular](../modules/_funicular_.md#tfunicular)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[childRemounted](../interfaces/_funicular_.ifunicular.md#childremounted)*

*Defined in [funicular.ts:107](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L107)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| child | [TFunicular](../modules/_funicular_.md#tfunicular)   |  - |





**Returns:** `void`





___

<a id="childsmounting"></a>

### «Static» childsMounting

► **childsMounting**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[childsMounting](../interfaces/_funicular_.ifunicular.md#childsmounting)*

*Defined in [funicular.ts:91](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L91)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="childsunmounting"></a>

### «Static» childsUnmounting

► **childsUnmounting**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[childsUnmounting](../interfaces/_funicular_.ifunicular.md#childsunmounting)*

*Defined in [funicular.ts:92](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L92)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="cloneandmount"></a>

### «Static» cloneAndMount

► **cloneAndMount**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[cloneAndMount](../interfaces/_funicular_.ifunicular.md#cloneandmount)*

*Defined in [funicular.ts:110](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L110)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="cursorfilling"></a>

### «Static» cursorFilling

► **cursorFilling**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[cursorFilling](../interfaces/_funicular_.ifunicular.md#cursorfilling)*

*Defined in [funicular.ts:89](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L89)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





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

<a id="mount"></a>

### «Static» mount

► **mount**(cursor: *`TCursor`*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[mount](../interfaces/_funicular_.ifunicular.md#mount)*

*Defined in [funicular.ts:82](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L82)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| cursor | `TCursor`   |  - |





**Returns:** `void`





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

<a id="register"></a>

### «Static» register

► **register**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[register](../interfaces/_funicular_.ifunicular.md#register)*

*Defined in [funicular.ts:86](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L86)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="remount"></a>

### «Static» remount

► **remount**(): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[remount](../interfaces/_funicular_.ifunicular.md#remount)*

*Defined in [funicular.ts:83](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L83)*





**Returns:** `void`





___

<a id="requestchilds"></a>

### «Static» requestChilds

► **requestChilds**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[requestChilds](../interfaces/_funicular_.ifunicular.md#requestchilds)*

*Defined in [funicular.ts:94](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L94)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="start"></a>

### «Static» start

► **start**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[start](../interfaces/_funicular_.ifunicular.md#start)*

*Defined in [funicular.ts:97](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L97)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="starting"></a>

### «Static» starting

► **starting**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[starting](../interfaces/_funicular_.ifunicular.md#starting)*

*Defined in [funicular.ts:100](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L100)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="stop"></a>

### «Static» stop

► **stop**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[stop](../interfaces/_funicular_.ifunicular.md#stop)*

*Defined in [funicular.ts:98](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L98)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="stopping"></a>

### «Static» stopping

► **stopping**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[stopping](../interfaces/_funicular_.ifunicular.md#stopping)*

*Defined in [funicular.ts:101](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L101)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="unmount"></a>

### «Static» unmount

► **unmount**(): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[unmount](../interfaces/_funicular_.ifunicular.md#unmount)*

*Defined in [funicular.ts:84](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L84)*





**Returns:** `void`





___

<a id="unregister"></a>

### «Static» unregister

► **unregister**(callback: *[IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[unregister](../interfaces/_funicular_.ifunicular.md#unregister)*

*Defined in [funicular.ts:87](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L87)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/_funicular_.ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="unwatchchildsevents"></a>

### «Static» unwatchChildsEvents

► **unwatchChildsEvents**(): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[unwatchChildsEvents](../interfaces/_funicular_.ifunicular.md#unwatchchildsevents)*

*Defined in [funicular.ts:104](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L104)*





**Returns:** `void`





___

<a id="watchchildsevents"></a>

### «Static» watchChildsEvents

► **watchChildsEvents**(): `void`



*Inherited from [IFunicular](../interfaces/_funicular_.ifunicular.md).[watchChildsEvents](../interfaces/_funicular_.ifunicular.md#watchchildsevents)*

*Defined in [funicular.ts:103](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L103)*





**Returns:** `void`





___



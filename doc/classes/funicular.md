[ancient-funicular](../README.md) > [Funicular](../classes/funicular.md)



# Class: Funicular

## Type parameters
#### IEventsList :  [IFunicularEventsList](../interfaces/ifuniculareventslist.md)[IFunicularEventData](../interfaces/ifuniculareventdata.md)
## Hierarchy


↳  [IFunicular](../interfaces/ifunicular.md)

**↳ Funicular**







## Indexable

\[key: `string`\]:&nbsp;`any`
## Index

### Constructors

* [constructor](funicular.md#constructor)


### Properties

* [Node](funicular.md#node)
* [childs](funicular.md#childs)
* [cursor](funicular.md#cursor)
* [destroy](funicular.md#destroy)
* [emitter](funicular.md#emitter)
* [generateId](funicular.md#generateid)
* [id](funicular.md#id)
* [isDestroyed](funicular.md#isdestroyed)
* [needRemount](funicular.md#needremount)
* [needUnmount](funicular.md#needunmount)
* [parents](funicular.md#parents)
* [remounted](funicular.md#remounted)
* [result](funicular.md#result)
* [state](funicular.md#state)


### Methods

* [abandonChilds](funicular.md#abandonchilds)
* [addParentToChilds](funicular.md#addparenttochilds)
* [childDestroyed](funicular.md#childdestroyed)
* [childRemounted](funicular.md#childremounted)
* [childsMounting](funicular.md#childsmounting)
* [childsUnmounting](funicular.md#childsunmounting)
* [cloneAndMount](funicular.md#cloneandmount)
* [cursorFilling](funicular.md#cursorfilling)
* [emit](funicular.md#emit)
* [mount](funicular.md#mount)
* [off](funicular.md#off)
* [on](funicular.md#on)
* [once](funicular.md#once)
* [register](funicular.md#register)
* [remount](funicular.md#remount)
* [requestChilds](funicular.md#requestchilds)
* [start](funicular.md#start)
* [starting](funicular.md#starting)
* [stop](funicular.md#stop)
* [stopping](funicular.md#stopping)
* [unmount](funicular.md#unmount)
* [unregister](funicular.md#unregister)
* [unwatchChildsEvents](funicular.md#unwatchchildsevents)
* [watchChildsEvents](funicular.md#watchchildsevents)



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

**●  Node**:  *`TClass`.<[TFunicular](../#tfunicular)>* 

*Inherited from [IFunicular](../interfaces/ifunicular.md).[Node](../interfaces/ifunicular.md#node)*

*Defined in [lib/funicular.ts:67](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L67)*





___

<a id="childs"></a>

### «Static» childs

**●  childs**:  *[TFunicularsManager](../#tfunicularsmanager)* 

*Inherited from [IFunicular](../interfaces/ifunicular.md).[childs](../interfaces/ifunicular.md#childs)*

*Defined in [lib/funicular.ts:71](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L71)*





___

<a id="cursor"></a>

### «Static» cursor

**●  cursor**:  *`TCursor`* 

*Inherited from [IFunicular](../interfaces/ifunicular.md).[cursor](../interfaces/ifunicular.md#cursor)*

*Defined in [lib/funicular.ts:74](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L74)*





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

*Inherited from [IFunicular](../interfaces/ifunicular.md).[needRemount](../interfaces/ifunicular.md#needremount)*

*Defined in [lib/funicular.ts:77](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L77)*





___

<a id="needunmount"></a>

### «Static» needUnmount

**●  needUnmount**:  *`boolean`* 

*Inherited from [IFunicular](../interfaces/ifunicular.md).[needUnmount](../interfaces/ifunicular.md#needunmount)*

*Defined in [lib/funicular.ts:78](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L78)*





___

<a id="parents"></a>

### «Static» parents

**●  parents**:  *[TFunicularsManager](../#tfunicularsmanager)* 

*Inherited from [IFunicular](../interfaces/ifunicular.md).[parents](../interfaces/ifunicular.md#parents)*

*Defined in [lib/funicular.ts:72](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L72)*





___

<a id="remounted"></a>

### «Static» remounted

**●  remounted**:  *[TFunicular](../#tfunicular)* 

*Inherited from [IFunicular](../interfaces/ifunicular.md).[remounted](../interfaces/ifunicular.md#remounted)*

*Defined in [lib/funicular.ts:80](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L80)*





___

<a id="result"></a>

### «Static» result

**●  result**:  *`any`* 

*Inherited from [IFunicular](../interfaces/ifunicular.md).[result](../interfaces/ifunicular.md#result)*

*Defined in [lib/funicular.ts:75](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L75)*





___

<a id="state"></a>

### «Static» state

**●  state**:  *[EFunicularState](../enums/efunicularstate.md)* 

*Inherited from [IFunicular](../interfaces/ifunicular.md).[state](../interfaces/ifunicular.md#state)*

*Defined in [lib/funicular.ts:69](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L69)*





___


## Methods
<a id="abandonchilds"></a>

### «Static» abandonChilds

► **abandonChilds**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[abandonChilds](../interfaces/ifunicular.md#abandonchilds)*

*Defined in [lib/funicular.ts:95](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L95)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="addparenttochilds"></a>

### «Static» addParentToChilds

► **addParentToChilds**(): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[addParentToChilds](../interfaces/ifunicular.md#addparenttochilds)*

*Defined in [lib/funicular.ts:109](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L109)*





**Returns:** `void`





___

<a id="childdestroyed"></a>

### «Static» childDestroyed

► **childDestroyed**(child: *[TFunicular](../#tfunicular)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[childDestroyed](../interfaces/ifunicular.md#childdestroyed)*

*Defined in [lib/funicular.ts:106](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L106)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| child | [TFunicular](../#tfunicular)   |  - |





**Returns:** `void`





___

<a id="childremounted"></a>

### «Static» childRemounted

► **childRemounted**(child: *[TFunicular](../#tfunicular)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[childRemounted](../interfaces/ifunicular.md#childremounted)*

*Defined in [lib/funicular.ts:107](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L107)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| child | [TFunicular](../#tfunicular)   |  - |





**Returns:** `void`





___

<a id="childsmounting"></a>

### «Static» childsMounting

► **childsMounting**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[childsMounting](../interfaces/ifunicular.md#childsmounting)*

*Defined in [lib/funicular.ts:91](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L91)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="childsunmounting"></a>

### «Static» childsUnmounting

► **childsUnmounting**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[childsUnmounting](../interfaces/ifunicular.md#childsunmounting)*

*Defined in [lib/funicular.ts:92](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L92)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="cloneandmount"></a>

### «Static» cloneAndMount

► **cloneAndMount**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[cloneAndMount](../interfaces/ifunicular.md#cloneandmount)*

*Defined in [lib/funicular.ts:110](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L110)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="cursorfilling"></a>

### «Static» cursorFilling

► **cursorFilling**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[cursorFilling](../interfaces/ifunicular.md#cursorfilling)*

*Defined in [lib/funicular.ts:89](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L89)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





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



*Inherited from [IFunicular](../interfaces/ifunicular.md).[mount](../interfaces/ifunicular.md#mount)*

*Defined in [lib/funicular.ts:82](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L82)*



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

► **register**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[register](../interfaces/ifunicular.md#register)*

*Defined in [lib/funicular.ts:86](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L86)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="remount"></a>

### «Static» remount

► **remount**(): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[remount](../interfaces/ifunicular.md#remount)*

*Defined in [lib/funicular.ts:83](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L83)*





**Returns:** `void`





___

<a id="requestchilds"></a>

### «Static» requestChilds

► **requestChilds**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[requestChilds](../interfaces/ifunicular.md#requestchilds)*

*Defined in [lib/funicular.ts:94](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L94)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="start"></a>

### «Static» start

► **start**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[start](../interfaces/ifunicular.md#start)*

*Defined in [lib/funicular.ts:97](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L97)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="starting"></a>

### «Static» starting

► **starting**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[starting](../interfaces/ifunicular.md#starting)*

*Defined in [lib/funicular.ts:100](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L100)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="stop"></a>

### «Static» stop

► **stop**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[stop](../interfaces/ifunicular.md#stop)*

*Defined in [lib/funicular.ts:98](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L98)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="stopping"></a>

### «Static» stopping

► **stopping**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[stopping](../interfaces/ifunicular.md#stopping)*

*Defined in [lib/funicular.ts:101](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L101)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="unmount"></a>

### «Static» unmount

► **unmount**(): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[unmount](../interfaces/ifunicular.md#unmount)*

*Defined in [lib/funicular.ts:84](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L84)*





**Returns:** `void`





___

<a id="unregister"></a>

### «Static» unregister

► **unregister**(callback: *[IFunicularCallback](../interfaces/ifunicularcallback.md)*): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[unregister](../interfaces/ifunicular.md#unregister)*

*Defined in [lib/funicular.ts:87](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L87)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](../interfaces/ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="unwatchchildsevents"></a>

### «Static» unwatchChildsEvents

► **unwatchChildsEvents**(): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[unwatchChildsEvents](../interfaces/ifunicular.md#unwatchchildsevents)*

*Defined in [lib/funicular.ts:104](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L104)*





**Returns:** `void`





___

<a id="watchchildsevents"></a>

### «Static» watchChildsEvents

► **watchChildsEvents**(): `void`



*Inherited from [IFunicular](../interfaces/ifunicular.md).[watchChildsEvents](../interfaces/ifunicular.md#watchchildsevents)*

*Defined in [lib/funicular.ts:103](https://github.com/AncientSouls/Funicular/blob/3c4e18e/src/lib/funicular.ts#L103)*





**Returns:** `void`





___



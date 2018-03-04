[ancient-funicular](../README.md) > [IFunicular](../interfaces/ifunicular.md)



# Interface: IFunicular

## Type parameters
#### IEventsList :  [IFunicularEventsList](ifuniculareventslist.md)[IFunicularEventData](ifuniculareventdata.md)
## Hierarchy


 `any`

**↳ IFunicular**








## Properties
<a id="node"></a>

###  Node

**●  Node**:  *`TClass`.<[TFunicular](../#tfunicular)>* 

*Defined in [lib/funicular.ts:67](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L67)*





___

<a id="childs"></a>

###  childs

**●  childs**:  *[TFunicularsManager](../#tfunicularsmanager)* 

*Defined in [lib/funicular.ts:71](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L71)*





___

<a id="cursor"></a>

###  cursor

**●  cursor**:  *`TCursor`* 

*Defined in [lib/funicular.ts:74](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L74)*





___

<a id="needremount"></a>

###  needRemount

**●  needRemount**:  *`boolean`* 

*Defined in [lib/funicular.ts:77](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L77)*





___

<a id="needunmount"></a>

###  needUnmount

**●  needUnmount**:  *`boolean`* 

*Defined in [lib/funicular.ts:78](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L78)*





___

<a id="parents"></a>

###  parents

**●  parents**:  *[TFunicularsManager](../#tfunicularsmanager)* 

*Defined in [lib/funicular.ts:72](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L72)*





___

<a id="remounted"></a>

###  remounted

**●  remounted**:  *[TFunicular](../#tfunicular)* 

*Defined in [lib/funicular.ts:80](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L80)*





___

<a id="result"></a>

###  result

**●  result**:  *`any`* 

*Defined in [lib/funicular.ts:75](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L75)*





___

<a id="state"></a>

###  state

**●  state**:  *[EFunicularState](../enums/efunicularstate.md)* 

*Defined in [lib/funicular.ts:69](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L69)*





___


## Methods
<a id="abandonchilds"></a>

###  abandonChilds

► **abandonChilds**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:95](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L95)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="addparenttochilds"></a>

###  addParentToChilds

► **addParentToChilds**(): `void`



*Defined in [lib/funicular.ts:109](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L109)*





**Returns:** `void`





___

<a id="childdestroyed"></a>

###  childDestroyed

► **childDestroyed**(child: *[TFunicular](../#tfunicular)*): `void`



*Defined in [lib/funicular.ts:106](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L106)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| child | [TFunicular](../#tfunicular)   |  - |





**Returns:** `void`





___

<a id="childremounted"></a>

###  childRemounted

► **childRemounted**(child: *[TFunicular](../#tfunicular)*): `void`



*Defined in [lib/funicular.ts:107](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L107)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| child | [TFunicular](../#tfunicular)   |  - |





**Returns:** `void`





___

<a id="childsmounting"></a>

###  childsMounting

► **childsMounting**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:91](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L91)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="childsunmounting"></a>

###  childsUnmounting

► **childsUnmounting**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:92](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L92)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="cloneandmount"></a>

###  cloneAndMount

► **cloneAndMount**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:110](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L110)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="cursorfilling"></a>

###  cursorFilling

► **cursorFilling**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:89](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L89)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="mount"></a>

###  mount

► **mount**(cursor: *`TCursor`*): `void`



*Defined in [lib/funicular.ts:82](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L82)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| cursor | `TCursor`   |  - |





**Returns:** `void`





___

<a id="register"></a>

###  register

► **register**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:86](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L86)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="remount"></a>

###  remount

► **remount**(): `void`



*Defined in [lib/funicular.ts:83](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L83)*





**Returns:** `void`





___

<a id="requestchilds"></a>

###  requestChilds

► **requestChilds**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:94](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L94)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="start"></a>

###  start

► **start**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:97](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L97)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="starting"></a>

###  starting

► **starting**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:100](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L100)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="stop"></a>

###  stop

► **stop**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:98](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L98)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="stopping"></a>

###  stopping

► **stopping**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:101](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L101)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="unmount"></a>

###  unmount

► **unmount**(): `void`



*Defined in [lib/funicular.ts:84](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L84)*





**Returns:** `void`





___

<a id="unregister"></a>

###  unregister

► **unregister**(callback: *[IFunicularCallback](ifunicularcallback.md)*): `void`



*Defined in [lib/funicular.ts:87](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L87)*



**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| callback | [IFunicularCallback](ifunicularcallback.md)   |  - |





**Returns:** `void`





___

<a id="unwatchchildsevents"></a>

###  unwatchChildsEvents

► **unwatchChildsEvents**(): `void`



*Defined in [lib/funicular.ts:104](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L104)*





**Returns:** `void`





___

<a id="watchchildsevents"></a>

###  watchChildsEvents

► **watchChildsEvents**(): `void`



*Defined in [lib/funicular.ts:103](https://github.com/AncientSouls/Funicular/blob/9099b0f/src/lib/funicular.ts#L103)*





**Returns:** `void`





___



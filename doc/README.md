
Coming soon...


## Index

### Enumerations

* [EFunicularState](enums/efunicularstate.md)


### Classes

* [Funicular](classes/funicular.md)
* [FunicularsManager](classes/funicularsmanager.md)


### Interfaces

* [IFunicular](interfaces/ifunicular.md)
* [IFunicularCallback](interfaces/ifunicularcallback.md)
* [IFunicularEventData](interfaces/ifuniculareventdata.md)
* [IFunicularEventListener](interfaces/ifuniculareventlistener.md)
* [IFunicularEventsList](interfaces/ifuniculareventslist.md)
* [IFunicularsManager](interfaces/ifunicularsmanager.md)
* [IFunicularsManagerEventData](interfaces/ifunicularsmanagereventdata.md)
* [IFunicularsManagerEventsList](interfaces/ifunicularsmanagereventslist.md)


### Type aliases

* [TFunicular](#tfunicular)
* [TFunicularsManager](#tfunicularsmanager)


### Variables

* [MixedFunicular](#mixedfunicular)
* [MixedFunicularsManager](#mixedfunicularsmanager)


### Functions

* [mixin](#mixin)



---
# Type aliases
<a id="tfunicular"></a>

###  TFunicular

**Τ TFunicular**:  *[IFunicular](interfaces/ifunicular.md)[IFunicularEventsList](interfaces/ifuniculareventslist.md)[IFunicularEventData](interfaces/ifuniculareventdata.md)* 

*Defined in [funicular.ts:23](https://github.com/AncientSouls/Funicular/blob/2ac0df0/src/lib/funicular.ts#L23)*





___

<a id="tfunicularsmanager"></a>

###  TFunicularsManager

**Τ TFunicularsManager**:  *[IFunicularsManager](interfaces/ifunicularsmanager.md)[TFunicular](#tfunicular), [IFunicularsManagerEventsList](interfaces/ifunicularsmanagereventslist.md)* 

*Defined in [funiculars-manager.ts:22](https://github.com/AncientSouls/Funicular/blob/2ac0df0/src/lib/funiculars-manager.ts#L22)*





___


# Variables
<a id="mixedfunicular"></a>

### «Const» MixedFunicular

**●  MixedFunicular**:  *`TClass`.<[IFunicular](interfaces/ifunicular.md)[IFunicularEventsList](interfaces/ifuniculareventslist.md)[IFunicularEventData](interfaces/ifuniculareventdata.md)>*  =  mixin(Node)

*Defined in [funicular.ts:290](https://github.com/AncientSouls/Funicular/blob/2ac0df0/src/lib/funicular.ts#L290)*





___

<a id="mixedfunicularsmanager"></a>

### «Const» MixedFunicularsManager

**●  MixedFunicularsManager**:  *`TClass`.<[TFunicularsManager](#tfunicularsmanager)>*  =  mixin(Manager)

*Defined in [funiculars-manager.ts:43](https://github.com/AncientSouls/Funicular/blob/2ac0df0/src/lib/funiculars-manager.ts#L43)*





___


# Functions
<a id="mixin"></a>

###  mixin

► **mixin**T(superClass: *`T`*): `any`



*Defined in [funiculars-manager.ts:35](https://github.com/AncientSouls/Funicular/blob/2ac0df0/src/lib/funiculars-manager.ts#L35)*



**Type parameters:**

#### T :  `TClass`.<`IInstance`>
**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| superClass | `T`   |  - |





**Returns:** `any`





___



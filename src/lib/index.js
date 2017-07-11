var counter = 1;

/**
 * @class
 */
function Parent(name, item) {
  /**
   * Unique index of each item.
   * @type {Index}
   * @protected
   */
  this.name = name;
  
  /**
   * Unique index of each item.
   * @type {Index}
   * @protected
   */
  this.item = item;
}

/**
 * @class
 * @description
 * Must be extended with custom logic of get and mount/unmount.
 * @example
 * import { Item as ProtoItem } from 'ancient-funicular';
 * class Item extends ProtoItem {
 *   mount() {
 *     if (this.isMounted()) return Promise.resolve(this);
 *     return new Promise((resolve) => {
 *       this.getResult = () => this.data;
 *       resolve(this);
 *     });
 *   }
 *   unmount() {
 *     if (!this.isMounted()) return Promise.resolve(this);
 *     return new Promise((resolve) => {
 *       delete this.getResult;
 *       resolve(this);
 *     });
 *   }
 *   get() {
 *     return new Promise((resolve) => { resolve(new Item('data')); });
 *   }
 * }
 */
class Item {
  
  /**
   * @constructs Item
   * @param {*} data
   */
  constructor(data) {
    
    /**
     * Unique index of each item.
     * @type {Index}
     * @protected
     */
    this.index = counter++;
    
    /**
     * A items connected to this item when moving away from the root. Sorted by local names.
     * @type {Object.<Id,Item>}
     * @protected
     */
    this.childs = {};
    
    /**
     * The converse notion of a childs. Sorted by parents indexes.
     * @type {Object.<Index,Parent>}
     * @protected
     */
    this.parents = {};
    
    /**
     * Interim results.
     * @type {*}
     * @protected
     */
    this.data = data;
    
    /**
     * Method for getting results.
     * @type {Item~getResult}
     */
    this.getResult;
    
    /**
     * Method for getting item by query.
     * @type {Item~get}
     */
    this.get;
    
  }
  
  /**
   * Add `child` item as child to this by pseudo `name`.
   * Add this item as parent to `child` item.
   * @param {Item} child
   */
  set(name, child) {
    if (typeof(name) != 'string') throw new Error(`name ${name} must be a string`);
    if (!isItem(child)) throw new Error(`child ${child} must be a Item instance.`);
    this.childs[name] = child;
    child.parents[this.index] = new Parent(name, this);
  }
  
  /**
   * Remove this item from parents of `child` item.
   * But not remove `child` item from childs pf thos .
   * @param {Item} child
   */
  unset(child) {
    if (!isItem(child)) throw new Error(`child ${child} must be a Item instance.`);
    delete child.parents[this.index];
  }
  
  /**
   * @return {Promise} - Resolve fully filled and mounted item, with .
   */
  mount() {
    throw new Error('Method mount must be overrided.');
  }
  
  /**
   * @return {Promise} - Resolve cleared and stopped item.
   */
  unmount() {
    throw new Error('Method unmount must be overrided.');
  }
  
  /**
   * @return {boolean}
   */
  isMounted() { return typeof(this.getResult) == 'function'; }
};

/**
 * Method for getting item by query.
 * Must returns Promise resolves already mounted {@link Item} instance by query.
 * @callback Item~get
 * @param {*} [query]
 * @return {Promise}
 */

/**
 * Must be setted in mounted item. Must be unsetted if item is unmounted.
 * @callback Item~getResult
 * @return {*}
 */

/**
 * @param {Item} item
 * @return {boolean}
 * @example
 * import { isItem, Item } from 'ancient-funicular';
 * isItem(new Item()); // true
 * isItem({}); // false
 */
function isItem(item) {
  return typeof(item) == 'object' && item instanceof Item;
};

export {
  Item,
  isItem,
};
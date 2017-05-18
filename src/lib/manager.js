import Item from './item';

/**
 * @class
 */
class Manager {
  
  /**
   * @constructs Manager
   * @param {function} Item - class extended from Item
   */
  constructor(Item) {
    
    /**
     * @type {Object.<string,Item>}
     * @protected
     */
    this._items = {};
    
    /**
     * @type {function}
     * @protected
     */
     this.Item = Item;
    
  }
  
  /**
   * Universal getter of items. Not mount or prepare item, just return it. You must manual use `prepare` and `mount` methods.
   * @param {string} name - If not sended, create new unnamed item.
   * @param [query] - Preparation is responsible for responding to the query. It may, query can be required in your Item class. 
   * @returns {Item}
   * @example
   * manager.get('a').prepare((error, a) => {});
   */
  get(name, query) {
    if (name) {
      if (this._items[name]) return this._items[name];
      else return (this._items[name] = new this.Item(this, name, query));
    } else {
      return new this.Item(this, name, query);
    }
  }
  
}

export default Manager;
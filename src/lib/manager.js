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
     * @type {Object.<GlobalName,Item>}
     * @protected
     * @description
     * Contains last versions of registred named items by global names.
     */
    this._items = {};
    
    /**
     * @type {function}
     * @protected
     */
     this._Item = Item;
    
  }
  
  /**
   * @param {string} name - If not sended, create new unnamed item.
   * @param [query] - Preparation is responsible for responding to the query. It may, query can be required in your Item class. 
   * @returns {Item}
   * @description
   * Responsible for:
   * * Constructing new item, if not exists not remounted or unmounted item with equal name.
   * * Register items as in {@ling Manager#_items}
   * > Attention! It is not a mount tool, only a search. Prepare and mount manually!
   * @example
   * var a = manager.get('a');
   * a.name == 'a'; // true
   */
  get(name, query) {
    if (name) {
      if (this._items[name] && !this._items[name].isReplaced && !this._items[name].isUnmounted) return this._items[name];
      else return (this._items[name] = new this._Item(this, name, query));
    } else {
      return new this._Item(this, name, query);
    }
  }
  
}

export default Manager;
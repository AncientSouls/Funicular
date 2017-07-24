require('source-map-support').install();

import { assert } from 'chai';
import async from 'async';
import each from 'async/each';
import lodash from 'lodash';
import colors from 'colors';
import PromiseProps from 'p-props';

import documents from './documents';

import {
  Item as ProtoItem,
  js,
} from '../lib/implementation';

var cache = {};
function get(query) {
  if (!cache[query]) {
    if (query == 'executors://js') cache[query] = new Item(js);
    else if (!documents[query]) return Promise.reject(`Data by query ${query} not founded.`);
    else cache[query] = new Item(documents[query]);
  }
  
  return cache[query].mount();
};

class Item extends ProtoItem {
  get(query) {
    return get(query);
  }
}

describe('AncientSouls/Funicular', () => {
  it('js', () => (
    get('c')
    .then(i => {
      // Is items mounted?
      assert.equal(i.getResult(), 3);
      assert.equal(i.childs.a.getResult(), 1);
      assert.equal(i.childs.b.getResult(), 2);
      
      return i;
    })
    .then(i => i.unmount())
    .then(i => {
      // Is items unmounted?
      assert.isFalse(i.isMounted());
      assert.isFalse(i.childs.a.isMounted());
      assert.isFalse(i.childs.b.isMounted());
      
      return i;
    })
  ));
  it('css', () => (
    get('e')
    .then((i) => {
      // Is items mounted?
      assert.equal(i.getResult(), '<div>123</div>');
      assert.equal(typeof(i.childs.document.getResult()), 'object');
      assert.equal(i.childs.d.getResult(), 'body { color: red; }');
      // Document has been generated?
      assert.deepEqual(
        cache.document.getResult().getResults(),
        [ 'body { color: red; }', '<div>123</div>' ]
      );
      
      return i;
    })
    .then(i => i.unmount())
    .then(i => {
      // Is items unmounted?
      assert.isFalse(i.isMounted());
      assert.isFalse(i.childs.document.isMounted());
      assert.isFalse(i.childs.d.isMounted());
      
      return i;
    })
  ));
});
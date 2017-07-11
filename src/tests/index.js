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
  it('js', done => {
    get('c')
    .then(i => {
      assert.equal(i.getResult(), 3);
      return i;
    })
    .then(i => i.unmount())
    .then(i => assert.isFalse(i.isMounted()) || i)
    .then(i => done())
  });
  it('css', (done) => {
    get('e')
    .then((i) => {
      assert.deepEqual(
        cache.document.getResult().getResults(),
        [ 'body { color: red; }', '<div>123</div>' ]
      );
      done();
    })
  });
});
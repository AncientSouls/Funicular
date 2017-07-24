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

function getEnv(callback) {
  
  var cache = {};
  
  function get(query) {
    if (!cache[query]) {
      if (query == 'js') cache[query] = new Item(js);
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
  
  function assertAllUnmounted() {
    for (var c in cache) {
      assert.isFalse(cache[c].isMounted());
    }
  };
  
  return new Promise((resolve) => {
    resolve(callback(get, cache, assertAllUnmounted));
  });
}

describe('AncientSouls/Funicular', () => {
  
  // g:t(text)=test
  // text:text(js)=Object
  it('should unmount type as parent', () => getEnv((get, cache, assertAllUnmounted) => (
    get('g')
    // Is item mounted?
    .then(g => assert.equal(g.getResult(), 'test') || g)
    // Is type mounted?
    .then(g => get('text').then(text => assert.isTrue(text.isMounted())).then(() => g))
    .then(g => g.unmount())
    // Is item unmounted?
    .then(g => assert.isFalse(g.isMounted()) || g)
    // Is type unmounted?
    .then(g => assert.isFalse(cache.text.isMounted()) || g)
    .then(g => assertAllUnmounted())
  )));
  
  // c:x(js)={ a:z(js)=1, b:y(js)=2 }=3
  // f:u(js)={ a:z(js)=1, b:y(js)=2 }='12'
  it('should unmount only items without parents', () => getEnv((get, cache, assertAllUnmounted) => (
    get('c')
    .then(c => get('f'))
    .then((f) => {
      // Is items mounted?
      assert.equal(f.getResult(), '12');
      assert.equal(f.childs.a.getResult(), 1);
      assert.equal(f.childs.b.getResult(), 2);
      
      return f;
    })
    .then(f => f.unmount())
    .then(f => {
      // Is items unmounted?
      assert.isFalse(f.isMounted());
      assert.isTrue(f.childs.a.isMounted());
      assert.isTrue(f.childs.b.isMounted());
      
      return f;
    })
    .then(f => (
      get('c')
      .then(c => {
        // Is items mounted?
        assert.equal(c.getResult(), 3);
        assert.equal(c.childs.a.getResult(), 1);
        assert.equal(c.childs.b.getResult(), 2);
        
        return c;
      })
      .then(c => c.unmount())
      .then(c => {
        // Is items unmounted?
        assert.isFalse(c.isMounted());
        assert.isFalse(c.childs.a.isMounted());
        assert.isFalse(c.childs.b.isMounted());
        
        return c;
      })
      .then(c => f)
    ))
    .then(f => assertAllUnmounted())
  )));
  
  // c:x(js)={ a:z(js)=1, b:y(js)=2 }=3
  it('js concept', () => getEnv((get, cache, assertAllUnmounted) => (
    get('c')
    .then(c => {
      // Is items mounted?
      assert.equal(c.getResult(), 3);
      assert.equal(c.childs.a.getResult(), 1);
      assert.equal(c.childs.b.getResult(), 2);
      
      return c;
    })
    .then(c => c.unmount())
    .then(c => {
      // Is items unmounted?
      assert.isFalse(c.isMounted());
      assert.isFalse(c.childs.a.isMounted());
      assert.isFalse(c.childs.b.isMounted());
      
      return c;
    })
    .then(c => assertAllUnmounted())
  )));
  
  // e:v(js)={ document:document(js)=Object, d:w=String }=String
  // document = [w,e]
  it('css concept', () => getEnv((get, cache, assertAllUnmounted) => (
    get('e')
    .then(c => {
      // Is items mounted?
      assert.equal(c.getResult(), '<div>123</div>');
      assert.equal(typeof(c.childs.document.getResult()), 'object');
      assert.equal(c.childs.d.getResult(), 'body { color: red; }');
      
      return c;
    })
    .then(c => (
      get('document')
      .then(document => {
        // Document has been generated?
        assert.deepEqual(
          document.getResult().getResults(),
          [ 'body { color: red; }', '<div>123</div>' ]
        );
        
        return document;
      })
      .then(document => c)
    ))
    .then(c => c.unmount())
    .then(c => {
      // Is items unmounted?
      assert.isFalse(c.isMounted());
      assert.isFalse(c.childs.d.isMounted());
      assert.isFalse(c.childs.document.isMounted());
      
      return c;
    })
    .then(c => assertAllUnmounted())
  )));
});
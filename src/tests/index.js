require('source-map-support').install();

import { assert } from 'chai';
import { Manager, Item } from '../lib';
import { ObjectGraph } from 'ancient-graph';
import async from 'async';
import each from 'async/each';
import lodash from 'lodash';
import colors from 'colors';

function log(deep, item, replaced = false) {
  console.log(
    ...lodash.repeat(!replaced?'-':' ', deep),
    item.name || 'unnamed', `(${item.index})`,
    colors[item.isMounted?'bold':'gray']('isMounted'),
    colors[item.isUnmounted?'bold':'gray']('isUnmounted'),
    colors[item.isReplaced?'bold':'gray']('isReplaced'),
    '[', lodash.map(item.childs, (c) => `${c.name} (${c.index})`), ']',
    '[', lodash.map(item.parents, (c) => `(${c.index})`), ']'
  );
  if (item.isReplaced) {
    log(deep, item.getActive(), true);
  }
}

/**
 * @description
 * Example of Item extension.
 * Support for two query types:
 * * As function `lodash.find` selector for memory.
 * * As object with childs queries by local names.
 */
class CustomItem extends Item {
  // With this example, access to result provide method getResult.
  getResult() {
    return this.result;
  }
  preparation() {
    // With this examples, i use field exports for executed data.
    this.result = {};
    setTimeout(() => {
      if (typeof(this.query) == 'function') { // is single named item (currect or incorrect without name)
        this.data = lodash.find(this.manager._memory, this.query);
        if (this.data) { // if data founded
          if (this.name) { // if global name sended, it currect item
            for (var c in this.data.childs) {
              this.prepareChild(c, undefined, this.data.childs[c]);
            }
            this.result = this.data;
            this.prepared(undefined); // done prepare
          } else { // incorrect item without name
            this.replace(this.data.name, this.query, this.data); // reprepare new item with name and equal query and already existed data
          }
        } else { // if data not founded
          this.prepared('data-not-founded');
        }
      } else if (typeof(this.query) == 'object') { // is unnamed item for get childs named items
        // if this query used for named item, it... on your conscience
        for (var c in this.query) {
          this.prepareChild(c, undefined, this.query[c]);
        }
        this.result = this.childs;
        this.prepared(undefined); // done prepare
      } else {
        throw new Error('wrong query type');
      }
    }, this.manager._timeoutOfPreparation);
  }
  mounting() {
    setTimeout(() => {
      each(this.childs, (child, next) => {
        child.mount(() => {
          next();
        });
      }, () => this.mounted(undefined));
    }, this.manager._timeoutOfMounting);
  }
  unmounting() {
    setTimeout(() => {
      super.unmounting();
    }, this.manager._timeoutOfUnmounting);
  }
  childReplaced(localName, oldChild, newChild) {
    this.replace(this.name, this.query, this.data).mount((error, item) => {
      this.unmount();
    });
  }
}

function generateManager(memory, timeoutOfPreparation = 0, timeoutOfMounting = 0, timeoutOfUnmounting = 0) {
  var manager = new Manager(CustomItem);
  manager._memory = memory;
  manager._timeoutOfPreparation = timeoutOfPreparation;
  manager._timeoutOfMounting = timeoutOfMounting;
  manager._timeoutOfUnmounting = timeoutOfUnmounting;
  return manager;
};

describe('AncientSouls/Funicular', () => {
  describe('check methods', () => {
    describe('manager.get', () => {
      it('should return constructed item and register global item if name exists', () => {
        var memory = {
          a: { name: 'a' },
        };
        
        var manager = generateManager(memory, 0, 0 ,0);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        
        assert.equal(a1, manager._items.a);
        assert.equal(a1.name, 'a');
        
        var a2 = manager.get('a', (data) => data.name == 'a');
        
        assert.equal(a1, a2);
      });
    });
    describe('item.prepare', () => {
      it('should run preparation for item or add once listener for prepared event', (done) => {
        var memory = {
          a: { name: 'a' },
        };
        
        var manager = generateManager(memory, 5, 0 ,0);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        
        assert.equal(a1.isPrepared, undefined);
        
        a1.prepare((error, a2) => {
          assert.equal(a1, a2);
          assert.equal(a2.isPrepared, true);
        
          a2.prepare((error, a3) => {
            assert.equal(a2, a3);
            assert.equal(a3.isPrepared, true);
            done();
          });
        });
        
        assert.equal(a1.isPrepared, false);
      });
    });
    describe('item.prepareChild', () => {
      it('should return item, and after parent fully, run preparation for all childs called with prepareChild', (done) => {
        var memory = {
          a: { name: 'a', childs: { x: (d) => d.name == 'b' } },
          b: { name: 'b' },
        };
        
        var manager = generateManager(memory, 0, 0 ,0);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        
        assert.equal(a1.isPrepared, undefined);
        
        a1.prepare((error, a2) => {
          assert.equal(a1, a2);
          assert.equal(a2.isPrepared, true);
          
          assert.equal(a1, manager._items.a);
          assert.equal(a1.childs.x, manager._items.b);
          
          assert.equal(a1.childs.x.isPrepared, true);
          
          done();
        });
      });
    });
    describe('item.mount', () => {
      it('should prepare if not prepared, run mounting for item or add once listener for mounted event', (done) => {
        var memory = {
          a: { name: 'a', childs: { x: (d) => d.name == 'b' } },
          b: { name: 'b' },
        };
        
        var manager = generateManager(memory, 0, 0 ,0);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        
        assert.equal(a1.isPrepared, undefined);
        assert.equal(a1.isMounted, undefined);
        
        a1.mount((error, a2) => {
          assert.equal(a1, a2);
          
          assert.equal(a2.isPrepared, true);
          assert.equal(a2.isMounted, true);
          
          assert.equal(a1, manager._items.a);
          assert.equal(a1.childs.x, manager._items.b);
          
          assert.equal(a1.childs.x.isPrepared, true);
          assert.equal(a1.childs.x.isMounted, true);
          
          done();
        });
      });
    });
    describe('item.unmount', () => {
      it('should unmount childs', (done) => {
        var memory = {
          a: { name: 'a', childs: { x: (d) => d.name == 'b' } },
          b: { name: 'b' },
        };
        
        var manager = generateManager(memory, 0, 0 ,5);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        
        assert.equal(a1.isPrepared, undefined);
        assert.equal(a1.isMounted, undefined);
        
        a1.mount((error, a2) => {
          a2.unmount((error, a3) => {
            assert.equal(a1, a3);
            
            assert.equal(a3.isPrepared, true);
            assert.equal(a3.isMounted, true);
            assert.equal(a3.isUnmounted, true);
            
            assert.equal(a1, manager._items.a);
            assert.equal(a1.childs.x, manager._items.b);
            
            assert.equal(a1.childs.x.isPrepared, true);
            assert.equal(a1.childs.x.isMounted, true);
            assert.notEqual(a1.childs.x.isUnmounted, true);
            
            setTimeout(() => {
              assert.equal(a1.childs.x.isUnmounted, true);
            
              done();
            }, 10);
          });
        });
      });
      it('should unmount unnamed items', (done) => {
        var memory = {
          a: { name: 'a', childs: { x: (d) => d.name == 'b' } },
          b: { name: 'b' },
        };
        
        var manager = generateManager(memory, 0, 0 ,0);
        
        var root1 = manager.get(undefined, { z: (data) => data.name == 'a' });
        
        assert.equal(root1.isPrepared, undefined);
        assert.equal(root1.isMounted, undefined);
        
        root1.mount((error, root2) => {
          assert.equal(root1, root2);
          
          assert.equal(root2.isPrepared, true);
          assert.equal(root2.isMounted, true);
          
          assert.equal(root2.childs.z, manager._items.a);
          assert.equal(root2.childs.z.childs.x, manager._items.b);
          
          assert.equal(root2.childs.z.isPrepared, true);
          assert.equal(root2.childs.z.isMounted, true);
          assert.equal(root2.childs.z.childs.x.isPrepared, true);
          assert.equal(root2.childs.z.childs.x.isMounted, true);
          assert.equal(root2.childs.z.childs.x, manager._items.b);
          
          assert.lengthOf(Object.keys(manager._items), 2);
          
          root2.unmount((error, root3) => {
            assert.equal(root1, root3);
            
            setTimeout(() => {
              assert.equal(root2.isUnmounted, true);
              assert.equal(root2.childs.z.isUnmounted, true);
              assert.equal(root2.childs.z.childs.x.isUnmounted, true);
              
              done();
            }, 10);
          });
        });
      });
      it('should unmount items only if all parents are unmounted', (done) => {
        var memory = {
          a: { name: 'a', childs: { x: (d) => d.name == 'c' } },
          b: { name: 'b', childs: { x: (d) => d.name == 'c' } },
          c: { name: 'c' },
        };
        
        var manager = generateManager(memory, 0, 0 ,0);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        
        var b1 = manager.get('b', (data) => data.name == 'b');
        
        a1.mount((error, a2) => {
          b1.mount((error, b2) => {
            a2.unmount((error, a3) => {
              setTimeout(() => {
                assert.equal(a1.isUnmounted, true);
                assert.notEqual(b1.isUnmounted, true);
                assert.notEqual(a1.childs.x.isUnmounted, true);
                assert.lengthOf(Object.keys(a1.childs.x.parents), 1);
                
                b2.unmount((error, b3) => {
                  assert.notEqual(a1.childs.x.isUnmounted, true);
                  assert.lengthOf(Object.keys(a1.childs.x.parents), 0);
                  
                  done();
                });
              }, 10);
            });
          });
        });
      });
    });
    describe('item.replace', () => {
      it('should replace this item without changes', (done) => {
        var memory = {
          a: { name: 'a' },
        };
        
        var manager = generateManager(memory, 0, 0 ,0);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        
        a1.mount((error, a2) => {
          var a3 = a2.replace();
          assert.notEqual(a2, a3);
          assert.equal(a2.isPrepared, true);
          assert.notEqual(a3.isPrepared, true);
          assert.notEqual(a3.isMounted, true);
          
          done();
        });
      });
      it('should replace this item with already existed other item', (done) => {
        var memory = {
          a: { name: 'a' },
          b: { name: 'b' },
        };
        
        var manager = generateManager(memory, 0, 0 ,0);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        var b1 = manager.get('b', (data) => data.name == 'b');
        
        a1.mount((error, a2) => {
          var b2 = a2.replace(b1);
          assert.notEqual(a2, b2);
          assert.equal(a2.isPrepared, true);
          assert.notEqual(b2.isPrepared, true);
          assert.notEqual(b2.isMounted, true);
          
          done();
        });
      });
      it('should replace this item with different name, query and data', (done) => {
        var memory = {
          a: { name: 'a' },
          b: { name: 'b' },
        };
        
        var manager = generateManager(memory, 0, 0 ,0);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        var b1 = manager.get('b', (data) => data.name == 'b');
        
        a1.mount((error, a2) => {
          var b2 = a2.replace('b', (d) => d.name == 'b');
          assert.notEqual(a2, b2);
          assert.equal(a2.isPrepared, true);
          assert.notEqual(b2.isPrepared, true);
          assert.notEqual(b2.isMounted, true);
          
          done();
        });
      });
    });
  });
  describe('check concepts', () => {
    it('lifecicle', (done) => {
      var memory = {
        a: { name: 'a', childs: {
          x: (d) => d.name == 'b',
          y: (d) => d.name == 'c',
        }, },
        b: { name: 'b' },
        c: { name: 'c' },
      };
      
      var manager = generateManager(memory, 0, 0 ,0);
      
      var root0 = manager.get(undefined, { a: (d) => d.name == 'a' });
      
      root0.mount((error, root1) => {
        
        var a1 = root1.childs.a;
        var b1 = a1.childs.x;
        var c1 = a1.childs.y;
        
        assert.equal(a1, manager._items.a);
        assert.equal(b1, manager._items.b);
        assert.equal(c1, manager._items.c);
        
        assert.equal(root1.isPrepared, true);
        assert.equal(a1.isPrepared, true);
        assert.equal(b1.isPrepared, true);
        assert.equal(c1.isPrepared, true);
        
        assert.equal(root1.isMounted, true);
        assert.equal(a1.isMounted, true);
        assert.equal(b1.isMounted, true);
        assert.equal(c1.isMounted, true);
        
        root1.childs.a.replace().mount((error, a) => {
          setTimeout(() => {
            
            var root2 = root1.getActive();
            
            assert.equal(root1.isUnmounted, true);
            assert.equal(root1.isReplaced, true);
            
            assert.equal(root2.isMounted, true);
            assert.notEqual(root2.isUnmounted, true);
            assert.notEqual(root2.isReplaced, true);
            
            var a2 = a1.getActive();
            
            assert.equal(a1.isUnmounted, true);
            assert.equal(a1.isReplaced, true);
            
            assert.equal(a2.isMounted, true);
            assert.notEqual(a2.isUnmounted, true);
            assert.notEqual(a2.isReplaced, true);
            
            assert.notEqual(b1.isReplaced, true);
            assert.notEqual(c1.isReplaced, true);
            
            assert.notEqual(b1.isUnmounted, true);
            assert.notEqual(c1.isUnmounted, true);
            
            root2.unmount(() => {
              setTimeout(() => {
                
                assert.equal(root2.isUnmounted, true);
                assert.equal(a2.isUnmounted, true);
                assert.equal(b1.isUnmounted, true);
                assert.equal(c1.isUnmounted, true);
                
                done();
              }, 10);
            });
            
          }, 10);
        });
      });
    });
    describe('registrations', () => {
      it('should soft unregister global item when unmount method just runned, and rewrite new item when it constructed', (done) => {
        var memory = {
          a: { name: 'a' },
        };
        
        var manager = generateManager(memory, 0, 0 ,5);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        
        a1.mount((error, a2) => {
          a2.unmount((error, a3) => {
            
            // Old version still in _items, until someone not call manager.get method.
            assert.equal(manager._items.a, a1);
            // After that old item unregister from _items and new registered.
            assert.notEqual(manager.get('a', (data) => data.name == 'a'), a1);
            
            setTimeout(() => {
              done();
            }, 10);
          });
        });
      });
    });
    describe('recursions', () => {
      it('preparation', (done) => {
        var memory = {
          a: { name: 'a', childs: {
            x: (d) => d.name == 'b',
            y: (d) => d.name == 'c',
          }, },
          b: { name: 'b' },
          c: { name: 'c', childs: {
            z: (d) => d.name == 'a',
          }, },
        };
        
        var manager = generateManager(memory, 0, 0 ,0);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        
        a1.prepare(() => {
          
          assert.equal(a1.getResult(), a1.data);
          assert.equal(a1.childs.x.getResult(), a1.childs.x.data);
          assert.equal(a1.childs.y.getResult(), a1.childs.y.data);
          assert.equal(a1.childs.y.childs.z.getResult(), a1.childs.y.childs.z.data);
          
          done();
        });
      });
      it('mounting', (done) => {
        var memory = {
          a: { name: 'a', childs: {
            x: (d) => d.name == 'b',
            y: (d) => d.name == 'c',
          }, },
          b: { name: 'b' },
          c: { name: 'c', childs: {
            z: (d) => d.name == 'a',
          }, },
        };
        
        var manager = generateManager(memory, 0, 0 ,0);
        
        var a1 = manager.get('a', (data) => data.name == 'a');
        
        a1.mount(() => {
          
          assert.equal(a1.getResult(), a1.data);
          assert.equal(a1.childs.x.getResult(), a1.childs.x.data);
          assert.equal(a1.childs.y.getResult(), a1.childs.y.data);
          assert.equal(a1.childs.y.childs.z.getResult(), a1.childs.y.childs.z.data);
          
          done();
        });
      });
    });
  });
});
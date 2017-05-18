require('source-map-support').install();

import { assert } from 'chai';
import { Manager, Item } from '../lib';
import { ObjectGraph } from 'ancient-graph';
import async from 'async';
import each from 'async/each';

describe('AncientSouls/Funicular', () => {
  describe('core', () => {
    function generateManager() {
      return new Manager(
        class extends Item {
          preparation(callback) {
            this.prepared(undefined, callback);
          }
          mounting(callback) {
            this.mounted(undefined, callback);
          }
        }
      );
    };
    
    it('should check full lifecicle of one item', (done) => {
      var manager = generateManager();
      
      manager
        .get('a')
        .prepare((error, item) => {
          assert.ifError(error);
          assert.isTrue(item.isPrepared);
          assert.equal(manager._items.a, item);
          
          item.mount((error, item) => {
            assert.ifError(error);
            assert.isTrue(item.isMounted);
            
            item.remount(undefined, (oldE, oldI, newE, newI) => {
              assert.ifError(oldE);
              assert.ifError(newE);
              
              assert.isTrue(oldI.isUnmounted);
              assert.isTrue(newI.isMounted);
              assert.isNotOk(newI.isUnmounted);
              
              assert.isOk(manager._items.a == newI);
              assert.isNotOk(manager._items.a == oldI);
              
              newI.unmount((error, item) => {
                assert.ifError(error);
                assert.isTrue(item.isUnmounted);
                assert.isNotOk(manager._items.a);
                
                done();
              })
            });
          });
        })
      ;
    });
  });
  describe('hierarchical', () => {
    function generateManager(memory) {
      return new Manager(
        class extends Item {
          preparation(callback) {
            this.data = memory[this.name];
            for (var c in this.data.childs) {
              this.prepareChild(this.data.childs[c]);
            }
            this.prepared(undefined, callback);
          }
          mounting(callback) {
            each(this.childs, (child, next) => {
              this.mountChild(child, () => {
                next();
              });
            }, () => this.mounted(undefined, callback));
          }
        }
      );
    };
    
    it('should prepare, mount, unmount all', (done) => {
      var memory = {
        a: { childs: ['b'] },
        b: { childs: ['c'] },
        c: {},
      };
      
      var manager = generateManager(memory);
      
      manager
        .get('a')
        .prepare((error, item) => {
          assert.ifError(error);
          
          var a = item;
          var b = item.childs.b;
          var c = item.childs.b.childs.c;
          
          assert.equal(manager._items.a, a);
          assert.equal(manager._items.b, b);
          assert.equal(manager._items.c, c);
          
          assert.isTrue(a.isPrepared);
          assert.isTrue(b.isPrepared);
          assert.isTrue(c.isPrepared);
          
          item.mount((error, item) => {
            assert.ifError(error);
            
            assert.isTrue(a.isMounted);
            assert.isTrue(b.isMounted);
            assert.isTrue(c.isMounted);
            
            item.unmount((error, item) => {
              assert.isNotOk(manager._items.a);
              assert.isNotOk(manager._items.b, b);
              assert.isNotOk(manager._items.c, c);
              
              assert.isTrue(a.isUnmounted);
              assert.isTrue(b.isUnmounted);
              assert.isTrue(c.isUnmounted);
              
              done();
            })
          });
        })
      ;
    });
    
    it('should check simple recursion', (done) => {
      var memory = {
        a: { childs: ['b'] },
        b: { childs: ['c'] },
        c: { childs: ['a'] },
      };
      
      var manager = generateManager(memory);
      
      manager
        .get('a')
        .prepare((error, item) => {
          assert.ifError(error);
          
          var a = item;
          var b = item.childs.b;
          var c = item.childs.b.childs.c;
          
          assert.equal(manager._items.a, a);
          assert.equal(manager._items.b, b);
          assert.equal(manager._items.c, c);
          
          assert.isTrue(a.isPrepared);
          assert.isTrue(b.isPrepared);
          assert.isTrue(c.isPrepared);
          
          item.mount((error, item) => {
            assert.ifError(error);
            
            assert.isTrue(a.isMounted);
            assert.isTrue(b.isMounted);
            assert.isTrue(c.isMounted);
            
            item.unmount((error, item) => {
              assert.isNotOk(manager._items.a);
              assert.isNotOk(manager._items.b, b);
              assert.isNotOk(manager._items.c, c);
              
              assert.isTrue(a.isUnmounted);
              assert.isTrue(b.isUnmounted);
              assert.isTrue(c.isUnmounted);
              
              done();
            })
          });
        })
      ;
    });
    
    it('should check many recursions', (done) => {
      var memory = {
        a: { childs: ['b'] },
        b: { childs: ['c'] },
        c: { childs: ['a', 'd'] },
        d: { childs: ['e'] },
        e: { childs: ['f'] },
        f: { childs: ['d', 'a'] },
      };
      
      var manager = generateManager(memory);
      
      manager
        .get('a')
        .prepare((error, item) => {
          assert.ifError(error);
          
          var a = item;
          var b = item.childs.b;
          var c = b.childs.c;
          var d = c.childs.d;
          var e = d.childs.e;
          var f = e.childs.f;
          
          assert.equal(manager._items.a, a);
          assert.equal(manager._items.b, b);
          assert.equal(manager._items.c, c);
          assert.equal(manager._items.d, d);
          assert.equal(manager._items.e, e);
          assert.equal(manager._items.f, f);
          
          assert.isTrue(a.isPrepared);
          assert.isTrue(b.isPrepared);
          assert.isTrue(c.isPrepared);
          assert.isTrue(d.isPrepared);
          assert.isTrue(e.isPrepared);
          assert.isTrue(f.isPrepared);
          
          item.mount((error, item) => {
            assert.ifError(error);
            
            assert.isTrue(a.isMounted);
            assert.isTrue(b.isMounted);
            assert.isTrue(c.isMounted);
            assert.isTrue(d.isMounted);
            assert.isTrue(e.isMounted);
            assert.isTrue(f.isMounted);
            
            item.unmount((error, item) => {
              assert.isNotOk(manager._items.a);
              assert.isNotOk(manager._items.b);
              assert.isNotOk(manager._items.c);
              assert.isNotOk(manager._items.d);
              assert.isNotOk(manager._items.e);
              assert.isNotOk(manager._items.f);
              
              assert.isTrue(a.isUnmounted);
              assert.isTrue(b.isUnmounted);
              assert.isTrue(c.isUnmounted);
              assert.isTrue(d.isUnmounted);
              assert.isTrue(e.isUnmounted);
              assert.isTrue(f.isUnmounted);
              
              done();
            })
          });
        })
      ;
    });
  });
  describe('realistic', () => {
    function generateManager(memory) {
      return new Manager(
        class extends Item {
          preparation(callback) {
            this.data = memory[this.name];
            for (var c in this.data.childs) {
              this.prepareChild(this.data.childs[c]);
            }
            this.exports = {};
            this.prepared(undefined, callback);
          }
          mounting(callback) {
            var item = this;
            each(this.childs, (child, next) => {
              this.mountChild(child, () => {
                next();
              });
            }, () => {
              if (this.data.type == 'js') {
                eval(this.data.data);
              } else if (this.data.type == 'css') {
                this.exports = this.data.data;
                this.manager.get('a').exports[this.name] = this.exports;
              } else if (this.data.type == 'root') {
              }
              this.mounted(undefined, callback);
            });
          }
          unmounting(callback) {
            for (var c in this.childs) {
              this.childs[c].unmount();
            }
            if (this.data.type == 'css') {
              delete this.manager.get('a').exports[this.name];
            }
            this.unmounted(undefined, callback);
          }
        }
      );
    };
    
    it('should check fake js and css items', (done) => {
      var memory = {
        a: { childs: ['b'], type: 'root' },
        b: { childs: ['c', 'e'], type: 'js', data: 'item.exports = item.data' },
        c: { childs: ['d'], type: 'js', data: 'item.exports = item.data' },
        d: { type: 'css', data: 'body { color: black; }' },
        e: { childs: ['d'], type: 'js', data: 'item.exports = item.data' },
      };
      
      var manager = generateManager(memory);
      
      manager
        .get('a')
        .prepare((error, item) => {
          item.mount((error, item) => {
            assert.equal(manager._items.a.data, memory.a);
            assert.equal(manager._items.b.data, memory.b);
            assert.equal(manager._items.c.data, memory.c);
            assert.equal(manager._items.d.data, memory.d);
            assert.equal(manager._items.e.data, memory.e);
            
            assert.equal(item.exports.d, manager._items.d.exports);
            
            item.unmount((error, item) => {
              assert.isNotOk(manager._items.a);
              assert.isNotOk(manager._items.b);
              assert.isNotOk(manager._items.c);
              assert.isNotOk(manager._items.d);
              assert.isNotOk(manager._items.e);
            
              assert.isNotOk(item.exports.d);
              
              done();
            });
          });
        })
      ;
    });
  });
});
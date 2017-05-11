require('source-map-support').install();

import { assert } from 'chai';
import Funicular, { Carriage } from '../lib';
import { ObjectGraph } from 'ancient-graph';
import async from 'async';
import each from 'async/each';

var generateFunicular = (memory) => {
  var funicular = new Funicular();
  funicular.Carriage = class extends funicular.Carriage {
    childDidRemount(unmountError, oldChild, mountError, newChild) {
      if (this.data.childRemount) {
        this.remount();
      }
    }
    enable(callback) {
      if (this.data.childs) {
        each(this.data.childs, (child, next) => {
          this.mountChild(child, memory[child], (error) => {
            next(error); 
          });
        }, (error) => {
          if (error) {
            this.error = new Error('Broken child.');
            each(this.childs, (child, next) => {
              child.unmount();
            }, () => {
              callback();
            });
          } else {
            // Useful work.
            callback();   
          }
        });
      } else callback();
    }
  }
  return funicular;
}

describe('AncientSouls/Funicular', () => {
  it('mount remount unmount', (done) => {
    var memory = {
      a: { },
    };
    
    var funicular = generateFunicular(memory);
    
    funicular.mount('a', memory.a,
      (error, a) => {
        assert.ifError(error);
        
        assert.equal(a.id, 1);
        
        assert.equal(a.stage, 'mounted');
        
        assert.deepProperty(funicular.namedCarriages, `a.1`);
        
        a.remount();
      },
      (unmountError, olda, mountError, newa) => {
        assert.notEqual(olda, newa);
        
        assert.equal(olda.id, 1);
        assert.equal(newa.id, 2);
        
        assert.equal(olda.stage, 'unmounted');
        assert.equal(newa.stage, 'mounted');
        
        assert.ifError(unmountError);
        assert.ifError(mountError);
        
        assert.notDeepProperty(funicular.namedCarriages, `a.1`);
        assert.deepProperty(funicular.namedCarriages, `a.2`);
        
        newa.unmount();
      },
      (error, a) => {
        assert.ifError(error);
        
        assert.equal(a.id, 2);
        
        assert.equal(a.stage, 'unmounted');
        
        assert.notDeepProperty(funicular.namedCarriages, `a.2`);
        
        done()
      }
    );
  });
  it('one parent with child', (done) => {
    var memory = {
      a: {  childs: ['b'] },
      b: { },
    };
    
    var funicular = generateFunicular(memory);
    
    funicular.mount('a', memory.a,
      (error, a) => {
        assert.ifError(error);
        
        assert.equal(a.id, 1);
        assert.equal(a.childs.b.id, 2);
        
        assert.equal(a.stage, 'mounted');
        assert.equal(a.childs.b.stage, 'mounted');
        
        assert.deepProperty(funicular.namedCarriages, `a.1`);
        assert.deepProperty(funicular.namedCarriages, `b.2`);
        
        a.remount();
      },
      (unmountError, olda, mountError, newa) => {
        assert.ifError(unmountError);
        assert.ifError(mountError);
          
        assert.notDeepProperty(olda, `.childs.b`);
        
        assert.equal(olda.id, 1);
        assert.equal(newa.id, 3);
        assert.equal(newa.childs.b.id, 2);
        
        assert.equal(olda.stage, 'unmounted');
        assert.equal(newa.stage, 'mounted');
        assert.equal(newa.childs.b.stage, 'mounted');
        
        assert.notDeepProperty(funicular.namedCarriages, `a.1`);
        assert.deepProperty(funicular.namedCarriages, `a.3`);
        assert.deepProperty(funicular.namedCarriages, `b.2`);
        
        newa.unmount();
      },
      (error, a) => {
        assert.ifError(error);
        
        assert.equal(a.id, 3);
        
        assert.equal(a.stage, 'unmounted');
        
        assert.notDeepProperty(funicular.namedCarriages, `b.2`);
        assert.notDeepProperty(funicular.namedCarriages, `a.3`);
        
        done();
      }
    );
  });
  it('one with parent and unnamed parent', (done) => {
    var memory = {
      a: {  childs: ['b'] },
      b: { },
    };
    
    var funicular = generateFunicular(memory);
    
    funicular.mount(undefined, { childs: ['b'] }, (error, root) => {
      assert.ifError(error);
      
      assert.equal(root.id, 1);
      assert.equal(root.childs.b.id, 2);
        
      assert.equal(root.stage, 'mounted');
      assert.equal(root.childs.b.stage, 'mounted');
      
      assert.deepProperty(funicular.unnamedCarriages, `1`);
      assert.deepProperty(funicular.namedCarriages, `b.2`);
      assert.deepProperty(funicular.namedCarriages, `b.0`);
      
      funicular.mount('a', memory.a,
        (error, a) => {
          assert.ifError(error);
          
          assert.equal(a.id, 3);
          assert.equal(a.childs.b.id, 2);
          
          assert.equal(a.stage, 'mounted');
          assert.equal(a.childs.b.stage, 'mounted');
          
          assert.deepProperty(funicular.namedCarriages, `a.3`);
          assert.deepProperty(funicular.namedCarriages, `b.2`);
          
          a.remount();
        },
        (unmountError, olda, mountError, newa) => {
          assert.ifError(unmountError);
          assert.ifError(mountError);
          
          assert.notDeepProperty(olda, `.childs.b`);
          
          assert.equal(olda.id, 3);
          assert.equal(newa.id, 4);
          assert.equal(newa.childs.b.id, 2);
          
          assert.equal(olda.stage, 'unmounted');
          assert.equal(newa.stage, 'mounted');
          assert.equal(newa.childs.b.stage, 'mounted');
          
          assert.notDeepProperty(funicular.namedCarriages, `a.3`);
          assert.deepProperty(funicular.namedCarriages, `a.4`);
          assert.deepProperty(funicular.namedCarriages, `b.2`);
          
          newa.unmount();
        },
        (error, a) => {
          assert.ifError(error);
          
          assert.equal(a.id, 4);
          
          assert.equal(a.stage, 'unmounted');
          
          assert.notDeepProperty(funicular.namedCarriages, `a.3`);
          assert.deepProperty(funicular.namedCarriages, `b.2`);
          
          root.unmount();
        }
      );
    }, null, (error, root) => {
      assert.ifError(error);
      
      assert.equal(root.id, 1);
      
      assert.equal(root.stage, 'unmounted');
      
      assert.notDeepProperty(funicular.unnamedCarriages, `1`);
      assert.notDeepProperty(funicular.namedCarriages, `b.2`);
      
      done();
    });
  });
  it('childs remount and unmount handlers', (done) => {
    var memory = {
      a: {  childs: ['b'], childRemount: true },
      b: { },
    };
    
    var funicular = generateFunicular(memory);
    
    funicular.mount(undefined, { childs: ['b'] }, (error, root) => {
      funicular.mount('a', memory.a,
        (error, a) => {
          assert.ifError(error);
          a.childs.b.remount();
        },
        (unmountError, olda, mountError, newa) => {
          assert.ifError(unmountError);
          assert.ifError(mountError);
          
          assert.notDeepProperty(olda, `.childs.b`);
          
          assert.equal(olda.id, 3);
          assert.equal(newa.id, 5);
          assert.equal(newa.childs.b.id, 4);
          
          assert.equal(olda.stage, 'unmounted');
          assert.equal(newa.stage, 'mounted');
          assert.equal(newa.childs.b.stage, 'mounted');
          
          assert.notDeepProperty(funicular.namedCarriages, `a.3`);
          assert.notDeepProperty(funicular.namedCarriages, `b.2`);
          assert.deepProperty(funicular.namedCarriages, `a.5`);
          assert.deepProperty(funicular.namedCarriages, `b.4`);
          
          root.unmount();
        },
        (error, a) => {
          assert.ifError(error);
          
          assert.equal(a.id, 5);
          
          assert.equal(a.stage, 'unmounted');
          
          assert.notDeepProperty(funicular.namedCarriages, `a.5`);
          assert.notDeepProperty(funicular.namedCarriages, `b.4`);
          
          done();
        }
      );
    }, () => {
      throw new Error('this is wrong');
    }, (error, root) => {
      assert.ifError(error);
      
      assert.equal(root.id, 1);
      
      assert.equal(root.stage, 'unmounted');
      
      assert.notDeepProperty(funicular.unnamedCarriages, `1`);
      
      assert.deepProperty(funicular.namedCarriages, `a.5`);
      assert.deepProperty(funicular.namedCarriages, `b.4`);
      
      funicular.namedCarriages.a[5].unmount();
    });
  });
});
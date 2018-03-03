import 'mocha';
import * as _ from 'lodash';
import { assert } from 'chai';
import * as vm from 'vm';
import * as async from 'async';

import {
  Cursor,
} from 'ancient-cursors/lib/cursor';

import {
  ChildsCursorsManager,
} from 'ancient-cursors/lib/childs-cursors-manager';

import {
  Funicular,
  EFunicularState,
} from '../lib/funicular';

import {
  FunicularsManager,
} from '../lib/funiculars-manager';

export default function () {
  describe('Funicular:', () => {
    it('lifecycle', () => {
      // In this test there are no situations outside the scope of the test, such as:
      // existance of necessary data, local and global funicular identifiers, executable data...
      
      const base = new Cursor();
      const ccm = new ChildsCursorsManager();
      base.on('changed', ccm.maintain(''));
      const all = new FunicularsManager();
      
      class TestFunicular extends Funicular {
        Node = TestFunicular;
        
        register(callback) {
          if (!all.nodes[this.id]) all.add(this);
          callback();
        }
        
        unregister(callback) {
          if (all.nodes[this.id]) all.remove(this);
          callback();
        }
        
        requestChild(c, callback) {
          const oldChild = all.nodes[c];
          if (oldChild) {
            if (oldChild.state === EFunicularState.Mounted) callback(oldChild);
            else oldChild.on('mounted', () => callback(oldChild));
          } else {
            const newChild = new this.Node(c);
            newChild.on('mounted', () => callback(newChild));
            newChild.mount(ccm.nodes[newChild.id]);
          }
        }
        
        requestChilds(callback) {
          async.each(
            this.cursor.get('childs'),
            (c, done) => {
              this.requestChild(c, (child) => {
                this.childs.add(child);
                done();
              });
            },
            () => callback(),
          );
        }
        
        abandonChilds(callback) {
          async.each(
            this.childs.nodes,
            (child, done) => {
              child.parents.remove(this);
              if (!_.size(child.parents)) child.unmount();
              done();
            },
            () => callback(),
          );
        }
        
        starting(callback) {
          this.result = this.cursor.get('value') + _.map(this.childs.nodes, c => c.result).join('');
          callback();
        }
        
        stopping(callback) {
          this.result = undefined;
          callback();
        }
      }
      
      base.exec(null, {
        a: { value: 'a', childs: ['b','c'] },
        b: { value: 'b', childs: [] },
        c: { value: 'c', childs: [] },
      });
      
      const f = new TestFunicular('a');
      
      const emits = [];
      
      f.on('emit', ({ eventName }) => emits.push(eventName));
      
      f.mount(ccm.nodes[f.id]);
      
      assert.deepEqual(emits, [
        'mounting',
        'cursorFilling', 'cursorFilled',
        'childsMounting', 'childsMounted',
        'starting', 'started',
        'mounted',
      ]);
      assert.equal(f.state, EFunicularState.Mounted);
      assert.equal(f.result, 'abc');
      
      base.apply({
        type: 'set',
        path: 'b.value',
        value: 'd',
      });
      
      assert.deepEqual(emits, [
        'mounting',
        'cursorFilling', 'cursorFilled',
        'childsMounting', 'childsMounted',
        'starting', 'started',
        'mounted',
        'remounting', 'remounted',
        'unmounting',
        'stopping', 'stopped',
        'childsUnmounting', 'childsUnmounted',
        'unmounted',
        'destroyed',
      ]);
      
      assert.equal(f.state, EFunicularState.Unmounted);
      
      assert.equal(f.remounted.state, EFunicularState.Mounted);
      assert.equal(f.remounted.result, 'adc');
    });
  });
}

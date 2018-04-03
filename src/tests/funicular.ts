import * as _ from 'lodash';
import { assert } from 'chai';
import * as vm from 'vm';
import * as async from 'async';

import {
  Cursor,
} from 'ancient-cursor/lib/cursor';

import {
  ChildsCursorsManager,
} from 'ancient-cursor/lib/childs-cursors-manager';

import {
  Funicular,
  EFunicularState,
} from '../lib/funicular';

import {
  FunicularsManager,
} from '../lib/funiculars-manager';

const delay = (t): Promise<void> => new Promise(resolve => setTimeout(resolve, t));

export default function () {
  describe('Funicular:', () => {
    it('lifecycle', async () => {
      // In this test there are no situations outside the scope of the test, such as:
      // existance of necessary data, local and global funicular identifiers, executable data...
      
      const base = new Cursor();
      const ccm = new ChildsCursorsManager();
      base.on('changed', ccm.maintain(''));
      const all = new FunicularsManager();
      
      class TestFunicular extends Funicular {
        clone = i => new TestFunicular(i.id);

        async register() {
          if (!all.list.nodes[this.id]) all.add(this);
        }
        
        async unregister() {
          if (all.list.nodes[this.id]) all.remove(this);
        }
        
        requestChild(c, callback) {
          const oldChild = all.list.nodes[c];
          if (oldChild) {
            if (oldChild.state === EFunicularState.Mounted) callback(oldChild);
            else oldChild.on('mounted', () => callback(oldChild));
          } else {
            const newChild = new TestFunicular(c);
            newChild.on('mounted', () => callback(newChild));
            newChild.mount(ccm.list.nodes[newChild.id]);
          }
        }
        
        requestChilds() {
          return new Promise((resolve) => {
            async.each(
              this.cursor.get('childs'),
              (c, done) => {
                this.requestChild(c, (child) => {
                  this.childs.add(child);
                  done();
                });
              },
              () => resolve(),
            );
          });
        }
        
        abandonChilds() {
          return new Promise((resolve) => {
            async.each(
              this.childs.list.nodes,
              (child, done) => {
                child.parents.remove(this);
                if (!_.size(child.parents)) child.unmount();
                done();
              },
              () => resolve(),
            );
          });
        }
        
        async starting() {
          this.result = this.cursor.get('value') + _.map(
            this.childs.list.nodes,
            (c: any) => c.result,
          ).join('');
        }
        
        async stopping() {
          this.result = undefined;
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
      
      await f.mount(ccm.list.nodes[f.id]);
      
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

      await delay(1);
      
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

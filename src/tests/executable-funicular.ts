import * as _ from 'lodash';
import { assert } from 'chai';
import * as vm from 'vm';
import * as async from 'async';

import {
  TClass,
} from 'ancient-mixins/lib/mixins';

import {
  Manager,
} from 'ancient-mixins/lib/manager';

import {
  Cursor,
  spray,
} from 'ancient-cursor/lib/cursor';

import {
  Funicular,
  mixin as funicularMixin,
  EFunicularState,
} from '../lib/funicular';

import {
  TExecutableFunicular,
} from '../lib/executable-funicular';

import {
  mixin as funicularManagerMixin,
  TFunicularsManager,
} from '../lib/funiculars-manager';

const delay = (t): Promise<void> => new Promise(resolve => setTimeout(resolve, t));

export default function () {
  describe('ExecutableFunicular:', () => {
    it('lifecycle', async () => {
      const ExecutableFunicular: TClass<TExecutableFunicular> =
      funicularMixin(Funicular, i => new ExecutableFunicular(i.id));
      const ExecutableFunicularsManager: TClass<TFunicularsManager> =
      funicularManagerMixin(Manager, ExecutableFunicular);

      const base = new Cursor();
      const sprayed = new Manager();
      base.on('changed', spray('', sprayed));
      const all = new ExecutableFunicularsManager();
      
      class TestFunicular extends ExecutableFunicular {
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
            newChild.mount(sprayed.list.nodes[newChild.id]);
          }
        }
        
        requestChilds() {
          return new Promise((resolve) => {
            async.eachOf(
              this.cursor.get('childs'),
              (globalName, localName, done) => {
                this.requestChild(globalName, (child) => {
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
          const context = {
            require: (localName) => {
              return this.childs.list.nodes[this.cursor.get('childs')[localName]].result;
            },
            module: {
              exports: {},
            },
          };

          vm.runInNewContext(this.cursor.get('value'), context, {
            filename: this.cursor.get('globalName'),
            timeout: 500,
          });

          this.result = context.module.exports;
        }
        
        async stopping() {
          this.result = undefined;
        }
      }
      
      base.exec(null, {
        a: {
          type: 'js',
          globalName: 'a',
          value: `
var b = require('./b');
var c = require('./c');
module.exports = 'a'+b+c;
          `,
          childs: {
            './b': 'b',
            './c': 'c',
          },
        },
        b: {
          type: 'js',
          globalName: 'b',
          value: `module.exports = 'b';`,
          childs: {},
        },
        c: {
          type: 'js',
          globalName: 'c',
          value: `module.exports = 'c';`,
          childs: {},
        },
      });
      
      const f = new TestFunicular('a');
      
      const emits = [];
      
      f.on('emit', ({ eventName }) => emits.push(eventName));
      
      await f.mount(sprayed.list.nodes[f.id]);
      
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
        value: `module.exports = 'd';`,
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

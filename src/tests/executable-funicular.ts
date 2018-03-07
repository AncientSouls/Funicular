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
} from 'ancient-cursor/lib/cursor';

import {
  ChildsCursorsManager,
} from 'ancient-cursor/lib/childs-cursors-manager';

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

export default function () {
  describe('ExecutableFunicular:', () => {
    it('lifecycle', () => {
      const ExecutableFunicular: TClass<TExecutableFunicular> =
      funicularMixin(Funicular, i => new ExecutableFunicular(i.id));
      const ExecutableFunicularsManager: TClass<TFunicularsManager> =
      funicularManagerMixin(Manager, ExecutableFunicular);

      const base = new Cursor();
      const ccm = new ChildsCursorsManager();
      base.on('changed', ccm.maintain(''));
      const all = new ExecutableFunicularsManager();
      
      class TestFunicular extends ExecutableFunicular {
        clone = i => new TestFunicular(i.id);
        
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
            const newChild = new TestFunicular(c);
            newChild.on('mounted', () => callback(newChild));
            newChild.mount(ccm.nodes[newChild.id]);
          }
        }
        
        requestChilds(callback) {
          async.eachOf(
            this.cursor.get('childs'),
            (globalName, localName, done) => {
              this.requestChild(globalName, (child) => {
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
          const context = {
            require: (localName) => {
              return this.childs.nodes[this.cursor.get('childs')[localName]].result;
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
          callback();
        }
        
        stopping(callback) {
          this.result = undefined;
          callback();
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
        value: `module.exports = 'd';`,
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

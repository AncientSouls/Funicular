require('source-map-support').install();

import { assert } from 'chai';
import Funicular, { Carriage } from '../lib';
import { ObjectGraph } from 'ancient-graph';
import async from 'async';

function generateGraph(collection = []) {
  return new ObjectGraph(collection, { id: 'id', childs: 'childs', });
};

function generateFunicular(graph = generateGraph()) {
  var funicular = new Funicular();
  
  var OldCarriage = funicular.Carriage;
  funicular.Carriage = class extends OldCarriage {
    subscribe(callback) {
      this.unsubscribe = () => {
        updateStop();
        removeStop();
      };
      var updateStop = graph.on('update', (oldData, newData) => {
        if (newData.id == this.name) this.updated(newData);
      });
      var removeStop = graph.on('remove', (oldData, newData) => {
        if (newData.id == this.name) this.removed();
      });
      graph.get(this.name, undefined, (error, data) => {
        this.fetched(error, data);
        callback(error);
      });
    }
    generateChildNamesFromData() {
      this.childs = this.data.childs;
    }
  }
  
  return funicular;
}; 

describe('AncientSouls/Funicular', function() {
  it('new Funicular', function() {
    generateFunicular();
  });
  it('new funicular.Carriage', function() {
    var funicular = generateFunicular();
    var a = new funicular.Carriage('a');
    assert.deepProperty(funicular, 'carriages.a.'+a.id);
  });
  it('funicular.mount', function(done) {
    var graph = generateGraph();
    graph.insert({ id: 'a' });
    var funicular = generateFunicular(graph);
    funicular.mount('a', (error, a) => {
      assert.ifError(error);
      assert.instanceOf(a, Carriage);
      assert.deepProperty(a, 'data.id');
      assert.equal(a.data.id, 'a');
      assert.equal(a.stage, 'mounted');
      done();
    });
  });
  it('funicular.mount with childs', function(done) {
    var graph = generateGraph();
    graph.insert({ id: 'a', childs: ['b'] });
    graph.insert({ id: 'b' });
    var funicular = generateFunicular(graph);
    funicular.mount('a', (error, a) => {
      assert.ifError(error);
      assert.instanceOf(a, Carriage);
      assert.deepProperty(a, 'data.id');
      assert.equal(a.data.id, 'a');
      assert.equal(a.stage, 'mounted');
      assert.deepProperty(a, '_childs.b');
      assert.instanceOf(a._childs.b, Carriage);
      assert.deepProperty(a, '_childs.b._parents.a');
      assert.equal(a._childs.b._parents.a, a);
      assert.equal(a._childs.b.stage, 'mounted');
      done();
    });
  });
  it('carriage.unmount', function(done) {
    var graph = generateGraph();
    graph.insert({ id: 'a' });
    var funicular = generateFunicular(graph);
    funicular.mount('a', (error, a) => {
      a.unmount(() => {
        assert.notDeepProperty(funicular, 'carriages.a.'+a.id);
        assert.equal(a.stage, 'unmounted');
        done();
      });
    });
  });
  it('carriage.unmount with childs', function(done) {
    var graph = generateGraph();
    graph.insert({ id: 'a', childs: ['b'] });
    graph.insert({ id: 'b' });
    var funicular = generateFunicular(graph);
    funicular.mount('a', (error, a) => {
      var b = a._childs.b;
      a.unmount(() => {
        assert.notDeepProperty(funicular, 'carriages.a.'+a.id);
        assert.notDeepProperty(funicular, 'carriages.b.'+b.id);
        assert.equal(a.stage, 'unmounted');
        assert.equal(b.stage, 'unmounted');
        done();
      });
    });
  });
});
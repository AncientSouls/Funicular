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
    var carriage = new funicular.Carriage('a');
    assert.deepProperty(funicular, 'carriages.a.'+carriage.id);
  });
  it('funicular.mount', function(done) {
    var graph = generateGraph();
    graph.insert({ id: 'a' });
    var funicular = generateFunicular(graph);
    funicular.mount('a', (error, carriage) => {
      assert.ifError(error);
      assert.instanceOf(carriage, Carriage);
      assert.deepProperty(carriage, 'data.id');
      assert.equal(carriage.data.id, 'a');
      assert.equal(carriage.stage, 'mounted');
      done();
    });
  });
  it('funicular.mount with childs', function(done) {
    var graph = generateGraph();
    graph.insert({ id: 'a', childs: ['b'] });
    graph.insert({ id: 'b' });
    var funicular = generateFunicular(graph);
    funicular.mount('a', (error, carriage) => {
      assert.ifError(error);
      assert.instanceOf(carriage, Carriage);
      assert.deepProperty(carriage, 'data.id');
      assert.equal(carriage.data.id, 'a');
      assert.equal(carriage.stage, 'mounted');
      assert.deepProperty(carriage, '_childs.b');
      assert.instanceOf(carriage._childs.b, Carriage);
      assert.deepProperty(carriage, '_childs.b._parents.a');
      assert.equal(carriage._childs.b._parents.a, carriage);
      assert.equal(carriage._childs.b.stage, 'mounted');
      done();
    });
  });
  it('carriage.unmount', function(done) {
    var graph = generateGraph();
    graph.insert({ id: 'a' });
    var funicular = generateFunicular(graph);
    funicular.mount('a', (error, carriage) => {
      carriage.unmount(() => {
        assert.notDeepProperty(funicular, 'carriages.a.'+carriage.id);
        assert.equal(carriage.stage, 'unmounted');
        done();
      });
    });
  });
});
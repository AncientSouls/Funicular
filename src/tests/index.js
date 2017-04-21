require('source-map-support').install();

import { assert } from 'chai';
import { Funicular, Carriage } from '../lib';
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
      graph.on('update', (oldData, newData)  => {
        if (newData.id == this.name) this.updated(newData);
      });
      graph.on('remove', (oldData, newData)  => {
        if (newData.id == this.name) this.removed();
      });
      graph.get(this.name, undefined, (error, data) => {
        this.fetched(error, data);
        callback();
      });
      return () => {};
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
    var carriage = new funicular.Carriage('abc');
    assert.deepProperty(funicular, 'carriages.abc.'+carriage.id);
  });
  it('funicular.mount', function(done) {
    var graph = generateGraph();
    graph.insert({ id: 'abc' });
    var funicular = generateFunicular(graph);
    funicular.mount('abc', (error, carriage) => {
      assert.ifError(error);
      assert.instanceOf(carriage, Carriage);
      assert.deepProperty(carriage, 'data.id');
      assert.equal(carriage.data.id, 'abc');
      assert.equal(carriage.stage, 'fetched');
      done();
    });
  });
});
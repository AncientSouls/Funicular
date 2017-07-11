var documents = {
  a: {
    id: 'z',
    type: 'executors://js',
    code: `module.exports = 1;`,
  },
  b: {
    id: 'y',
    type: 'executors://js',
    code: `module.exports = 2;`,
  },
  c: {
    id: 'x',
    type: 'executors://js',
    childs: {
      'a': 'a',
      'b': 'b',
    },
    code: `
var a = require('a');
var b = require('b');
module.exports = a+b;
    `,
  },
  d: {
    id: 'w',
    type: 'css',
    code: `body { color: red; }`,
  },
  e: {
    id: 'v',
    type: 'executors://js',
    childs: {
      'document': 'document',
      'd': 'd',
    },
    code: `
var document = require('document');
require('d');
document.set(module.item);
module.exports = '<div>123</div>';
    `,
  },
  css: {
    id: 'css',
    type: 'executors://js',
    childs: {
      'document': 'document',
    },
    code: `
var document = require('document');
module.exports = {
  mount() {
    document.set(this);
    this.getResult = () => this.data.code;
    return Promise.resolve(this);
  },
  unmount() {
    document.unset(this);
    return Promise.resolve(this);
  },
};
    `
  },
  document: {
    id: 'document',
    type: 'executors://js',
    code: `
module.exports = {
  items: [],
  set: function(item) {
    this.items.push(item)
  },
  unset: function(item) {
    this.items.splice(this.items.indexOf(item), 1);
  },
  getResults() {
    return this.items.map(function(i) {
      return i.getResult();
    });
  },
};
    `,
  },
};

export default documents;
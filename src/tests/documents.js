var documents = {
  a: {
    id: 'z',
    type: 'js',
    code: `module.exports = 1;`,
  },
  b: {
    id: 'y',
    type: 'js',
    code: `module.exports = 2;`,
  },
  c: {
    id: 'x',
    type: 'js',
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
    type: 'js',
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
  f: {
    id: 'u',
    type: 'js',
    childs: {
      'a': 'a',
      'b': 'b',
    },
    code: `
var a = require('a');
var b = require('b');
module.exports = ''+a+b;
    `,
  },
  g: {
    id: 't',
    type: 'text',
    code: `test`,
  },
  css: {
    id: 'css',
    type: 'js',
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
  text: {
    id: 'text',
    type: 'js',
    code: `
module.exports = {
  mount() {
    this.getResult = () => this.data.code;
    return Promise.resolve(this);
  },
  unmount() {
    return Promise.resolve(this);
  },
};
    `
  },
  document: {
    id: 'document',
    type: 'js',
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
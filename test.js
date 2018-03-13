import assert from 'assert';
import tokenize from './src/tokenize';
import parse from './src/parse';
import transform from './src/transform';
import util from 'util';

describe('tokenizer', () => {
  it('should tokenize html template', () => {
    const template = `
      <h1 class="title">this is title</h1>
    `;
    assert.deepEqual(tokenize(template.trim()), [{
        type: 'startTagOpen',
        value: 'h1'
      },
      {
        type: 'attrName',
        value: 'class'
      },
      {
        type: 'attrValue',
        value: 'title'
      },
      {
        type: 'startTagClose',
        value: '>'
      },
      {
        type: 'text',
        value: 'this is title'
      },
      {
        type: 'endTag',
        value: 'h1'
      }
    ]);
  });
});

describe('parser', () => {
  it('should parse tokens to AST', () => {});
  const tokens = [{
      type: 'startTagOpen',
      value: 'h1'
    },
    {
      type: 'attrName',
      value: 'class'
    },
    {
      type: 'attrValue',
      value: 'title'
    },
    {
      type: 'startTagClose',
      value: '>'
    },
    {
      type: 'text',
      value: 'this is title'
    },
    {
      type: 'endTag',
      value: 'h1'
    }
  ];
  assert.deepEqual(parse(tokens), {
    type: 'root',
    children: [{
      tag: 'h1',
      attrs: {
        class: 'title'
      },
      children: [{
        tag: 'text',
        attrs: {},
        children: []
      }]
    }]
  });
});

describe('transformer', () => {
  it('should transform current AST to a new AST', () => {
    const ast = {
      type: 'root',
      children: [{
        tag: 'h1',
        attrs: {
          class: 'title'
        },
        children: [{
          tag: 'text',
          attrs: {},
          children: []
        }]
      }]
    };
    assert.deepEqual(transform(ast), {});
  });
});

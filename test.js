import assert from 'assert';
import {
  tokenizer
} from './src/tokenizer';
import {
  parser
} from './src/parser';
import util from 'util';

describe('tokenizer', () => {
  it('should tokenize html template', () => {
    const template = `
      <h1 class="title">this is title</h1>
    `;
    assert.deepEqual(tokenizer(template.trim()), [{
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
  assert.deepEqual(parser(tokens), {
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

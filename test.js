import assert from 'assert';
import {tokenizer} from './src/tokenizer';

describe('tokenizer', () => {
  it('should parse tag', () => {
    const template = `
      <h1 class="title">this is title</h1>
    `;
    assert.deepEqual(tokenizer(template.trim()), [
      {type: 'startTagOpen', value: 'h1'},
      {type: 'attrName', value: 'class'},
      {type: 'attrValue', value: 'title'},
      {type: 'startTagClose', value: '>'},
      {type: 'text', value: 'this is title'},
      {type: 'endTag', value: 'h1'}
    ]);
  });
});

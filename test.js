import assert from 'assert';
import tokenize from './src/tokenize';
import parse from './src/parse';
import traverse from './src/traverse';
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
      nodeName: 'h1',
      attrs: {
        class: 'title'
      },
      children: ['this is title']
    }]
  });
});

describe('tst', () => {
  it('test', () => {
    const template = `
      <div>
        <div>{{ title }}</div>
        <div>{{ desc }}</div>
        <button @click="btnClick">click</button>
      </div>
    `;

    const state = {
      title: 'this is title',
      desc: 'this is description',
      btnClick: () => {
        console.log('button is click');
      }
    }

    const interpolationRegex = /\{\{\s*(\w+)\s*\}\}/;
    // const interpolationRegex = /\w/;

    function render(template, state) {
      const tokens = tokenize(template.trim());
      const ast = parse(tokens);
      const root = createElement('div');
      // console.log(tokens);
      // console.log(util.inspect(ast, false, null));
      traverse(ast, (node, parent) => {
        if (typeof node === 'string') {
          const match = node.match(interpolationRegex);
          if (match) {
            parent.el.textContent = state[match[1]];
          }
        } else {
          const element = document.createElement(node.nodeName);
          const attrs = node.attrs;
          if (attrs) {
            Object.keys(attrs).forEach(key => {
              if (key.startsWith('@')) {
                // bind event
                const exp = attrs[key];
                const eventType = key.substring(1);
                const fn = state[exp];
                element.addEventListener(eventType, fn.bind(state), false);
              } else {
                // add attribute
                element.setAttribute(key, attr[key])
              }
            });
          }
          node.el = element;
          if (parent) {
            parent.el.appendChild(element);
          } else {
            root.appendChild(element);
          }
        }
      });
      return root;
    }

    const dom = render(template, state);
    console.log(dom);
  });
});

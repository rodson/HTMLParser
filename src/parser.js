/**
 * parse tokens to AST
 */
export function parser(tokens = []) {
  const root = {
    type: 'root',
    children: []
  };
  const parent = root;
  let current = 0;
  while (current < tokens.length) {
    let token = tokens[current];
    current++;
    if (token.type === 'startTagOpen') {
      const tagName = token.value;
      const attrs = {};
      current++;
      token = tokens[current];
      while (token.type !== 'startTagClose') {
        if (token.type === 'attrName') {
          attrs[token.value] = tokens[++current].value;
        }
        current++;
        token = tokens[current];
      }
      parent.children.push(createASTElement({tagName, attrs, parent}));
    }
  }
  return root;
}

function createASTElement({tag, attrs = [], parent}) {
  return {
    tag,
    attrs,
    parent,
    children: []
  };
}

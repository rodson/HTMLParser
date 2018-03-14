/**
 * parse tokens to AST
 */
export default function parse(tokens = []) {
  const root = {
    type: 'root',
    children: []
  };
  let current = 0;
  let tagStack = [];
  tagStack.push(root);
  while (current < tokens.length) {
    let token = tokens[current];
    current++;
    if (token.type === 'startTagOpen') {
      const tagName = token.value;
      const attrs = {};
      token = tokens[current];
      while (token.type !== 'startTagClose') {
        if (token.type === 'attrName') {
          attrs[token.value] = tokens[++current].value;
        }
        current++;
        token = tokens[current];
      }
      const element = createASTElement({
        nodeName: tagName,
        attrs
      });
      tagStack[tagStack.length - 1].children.push(element);
      tagStack.push(element);
      current++;
    } else if (token.type === 'endTag') {
      tagStack.pop();
      current++;
    } else if (token.type === 'text') {
      tagStack[tagStack.length - 1].children.push(token.value);
    }
  }
  return root;
}

function createASTElement({
  nodeName,
  attrs = {},
}) {
  return {
    nodeName,
    attrs,
    children: []
  };
}

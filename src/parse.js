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
        tag: tagName,
        attrs
      });
      tagStack[tagStack.length - 1].children.push(element);
      tagStack.push(element);
      current++;
    } else if (token.type === 'endTag') {
      tagStack.pop();
      current++;
    } else if (token.type === 'text') {
      const text = createASTElement({
        tag: 'text'
      });
      text.value = token.value;
      tagStack[tagStack.length - 1].children.push(text);
    }
  }
  return root;
}

function createASTElement({
  tag,
  attrs = {},
}) {
  return {
    tag,
    attrs,
    children: []
  };
}

/**
 * parse tokens to AST
 */
export function parser(tokens = []) {
  const root = {
    type: 'root',
    children: []
  };
  let parent = root;
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
      const element = createASTElement({
        tag: tagName,
        attrs,
        parent
      });
      parent.children.push(element);
      parent = element;
      current++;
    } else if (token.type === 'endTag') {
      parent = parent.parent;
      current++;
    } else if (token.type === 'text') {
      const text = createASTElement({
        tag: 'text'
      });
      parent.children.push(text);
      current++;
    }
  }
  return root;
}

function createASTElement({
  tag,
  attrs,
  parent
}) {
  return {
    tag,
    attrs,
    parent,
    children: []
  };
}

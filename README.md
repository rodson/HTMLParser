Parse HTML string to an AST

```
const tokens = tokenize('<div>test</div>');
const ast = parse(tokens);
traverse(ast, () => {});
```

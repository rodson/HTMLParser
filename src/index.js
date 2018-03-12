import {tokenizer} from './tokenizer';
import {parser} from './parser';
import {transformer} from './transformer';

export function parseTemplare(template, state) {
  const tokens = tokenizer(template);
  const ast = parser(tokens);
  const newAst = transformer(ast);
}

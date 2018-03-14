(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.rsHtmlParser = factory());
}(this, (function () { 'use strict';

/**
 * parse html string to tokens
 */
const attrRegex = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = '[a-zA-Z_][\\w\\-\\.]*';
const qname = `((?:${ncname}\\:)?${ncname})`;
const startTagOpenRegex = new RegExp(`^<${qname}`);
const startTagCloseRegex = /^\s*(\/?)>/;
const endTagRegex = new RegExp(`^<\\/${qname}>`);

function tokenize(html) {
  let tokens = [];
  while (html) {

    let textEnd = html.indexOf('<');
    if (textEnd === 0) {
      // start tag
      const startTagOpen = html.match(startTagOpenRegex);
      if (startTagOpen) {
        tokens.push({
          type: 'startTagOpen',
          value: startTagOpen[1]
        });
        advance(startTagOpen[0].length);
        let startTagClose;
        let attr;
        while (!(startTagClose = html.match(startTagCloseRegex)) &&
          (attr = html.match(attrRegex))
        ) {
          advance(attr[0].length);
          tokens.push({
            type: 'attrName',
            value: attr[1]
          });
          tokens.push({
            type: 'attrValue',
            value: attr[3] || attr[4] || attr[5] || ''
          });
        }
        if (startTagClose) {
          advance(startTagClose[0].length);
          tokens.push({
            type: 'startTagClose',
            value: '>'
          });
          if (startTagClose[1]) {
            tokens.push({
              type: 'endTag',
              value: startTagOpen[1]
            });
          }
        }
        continue;
      }
      // end tag
      const endTag = html.match(endTagRegex);
      if (endTag) {
        advance(endTag[0].length);
        tokens.push({
          type: 'endTag',
          value: endTag[1]
        });
        continue;
      }
    }

    // text content
    if (textEnd > 0) {
      const text = html.substring(0, textEnd);
      advance(textEnd);
      tokens.push({
        type: 'text',
        value: text
      });
    }

    if (textEnd < 0) {
      tokens.push({
        type: 'text',
        value: html
      });
      html = '';
    }
  }

  //============ helper function ============//
  function advance(n) {
    html = html.substring(n);
  }
  //========== end helper function ==========//

  return tokens;
}

/**
 * parse tokens to AST
 */
function parse(tokens = []) {
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

function traverse(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  function traverseNode(node, parent) {
    visitor(node, parent);
    if (node.children && Array.isArray(node.children)) {
      traverseArray(node.children, node);
    }
  }

  traverseNode(ast, null);
}

var index = {
  tokenize,
  parse,
  traverse
}

return index;

})));

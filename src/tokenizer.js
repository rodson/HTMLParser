/**
 * parse html string to tokens
 */

const attrRegex = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = '[a-zA-Z_][\\w\\-\\.]*';
const qname = `((?:${ncname}\\:)?${ncname})`;
const startTagOpenRegex = new RegExp(`^<${qname}`);
const startTagCloseRegex = /^\s*(\/?)>/;
const endTagRegex = new RegExp(`^<\\/${qname}>`);
const commentRegex = /^<!\--/;

// start tag, end tag, comment, content, attr
export function tokenizer(html) {
  let index = 0;
  let tokens = [];
  let last;
  while (html) {
    last = html;

    let textEnd = html.indexOf('<');
    if (textEnd === 0) {
      // comment
      if (commentRegex.test(html)) {
        const commentEnd = html.indexOf('-->');
        if (commentEnd > 0) {
          tokens.push({
            type: 'comment',
            value: html.substring(4, commentEnd)
          });
          advance(commentEnd + 3);
          continue;
        }
      }
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
        while (
          !(startTagClose = html.match(startTagCloseRegex)) &&
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
    index += n;
    html = html.substring(n);
  }
  //========== end helper function ==========//

  return tokens;
}

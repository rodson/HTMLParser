/**
 * parse html string to tokens
 */

const attriRegex = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
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
  let lastTag;
  while (html) {
    last = html;

    if (!lastTag) {
      let textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // comment
        if (commentRegex.test(html)) {
          const commentEnd = html.indexOf('-->')
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
        const tagOpen = html.match(startTagOpenRegex);
        if (tagOpen) {
          tokens.push({
            type: 'startTag',
            value: tagOpen[1]
          });
          advance(tagOpen[0].length);
          let tagClose;
          let attr;
          while (!(tagClose = html.match(startTagCloseRegex)) && attr = html.match(attrRegex)) {
            tokens.push({
              type: 'attrKey',
              value:
            })
          }
        }
        // end tag
      }
    }
  }

  //============ helper function ============//
  function advance(n) {
    index += n;
    html = html.substring(n);
  }
}

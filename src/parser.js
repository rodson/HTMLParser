/**
 * html string parser
 */
import {makeMap} from './utils';

const isPlainTextElement = makeMap('script,style,textarea');

const ncname = '[a-zA-Z_][\\w\\-\\.]';
const commentRegex = /^<!\--/;
const endTagRegex = 

export const parseHTML = (html, options) => {
  const stack = [];
  const expectHTML = true;
  const isUnaryTag =
    'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
    'link,meta,param,source,track,wbr';
  const canBeLeftOpenTag =
    'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source';
  let index = 0;
  let last;
  let lastTag;

  while (html) {
    last = html;

    // not in plain text element
    if (!lastTag || !isPlainTextElement(lastTag)) {
      let textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // comment
        if (commentRegex.test(html)) {
          const commentEnd = html.indexOf('-->');
          if (commentEnd >= 0) {
            parseComment(html);
            // 3 is the length of comment end(-->)
            advance(commentEnd + 3);
            continue;
          }
        }

        // end tag
        const endTagMatch = html.match(endTagRegex);
        // start tag
      }
    } else {
    }
  }

  function parseComment(html, options) {
    // 4 is the length of comment start(<!--)
    options.comment && options.comment(html.substring(4, commentRegex));
  }
};

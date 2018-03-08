/**
 * html string parser
 */

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
    // comment
    // start tag
    // end tag
  }
};

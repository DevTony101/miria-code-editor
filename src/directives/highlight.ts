export const highlightMiria = (el) => {
  if (el.dataset.highlighted) return;
  el.dataset.highlighted = true;
  
  let code = el.innerHTML.trim();
  
  // Clean up HTML entities to prevent regex matching inside tags
  code = code.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

  // Single-pass regex replacement to completely prevent overlapping HTML injection issues!
  const regex = /(\/\/.*)|(".*?")|(\b(?:define|as|fun|void|str|string|number|boolean|class|constructor|this|new|interface|implementing|inheriting|from|overriding|super|import|namespace|evaluate|if|not|else|repeat|while|once|log|return|break|switch|case|default|to|value|lambda|foreach|in|lmd|enum|const|static|property|try|catch|finally|throw|array|dictionary|true|false|null|undefined)\b)|(@\w+(?:\([^)]*\))?)|(\b(?:Math|Time|Logger)\b)|(\b[a-zA-Z_]\w*\b(?=\s*\())/g;

  code = code.replace(regex, (match, p1, p2, p3, p4, p5, p6) => {
    if (p1) return `<span class="syn-comment">${p1}</span>`;
    if (p2) return `<span class="syn-string">${p2}</span>`;
    if (p3) return `<span class="syn-keyword">${p3}</span>`;
    if (p4) return `<span class="syn-annotation">${p4}</span>`;
    if (p5) return `<span class="syn-type">${p5}</span>`;
    if (p6) return `<span class="syn-function">${p6}</span>`;
    return match;
  });

  el.innerHTML = code;
};

export default {
  mounted(el) {
    highlightMiria(el);
  },
  updated(el) {
    highlightMiria(el);
  }
};

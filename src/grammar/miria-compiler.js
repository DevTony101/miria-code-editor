import store from "../store/index";
const nearley = require("nearley");
const miria = require("./parser/miria");

function getMiriaParser() {
  return new nearley.Parser(nearley.Grammar.fromCompiled(miria));
}

export function compileMiriaCode(code) {
  store.dispatch("miria/setCompilationStatus", "success");
  const parser = getMiriaParser();
  try {
    parser.feed(code);
    store.dispatch("miria/setParserResults", parser.results);
    if (parser.results.length === 0) {
      console.warn("Compiled successfully with unexpected end of input");
    }
  } catch (err) {
    store.dispatch("miria/setCompilationStatus", "failed");
    let errorMsg = err.message;
    const endMsg = err.message.indexOf("Instead");
    if (endMsg !== -1) errorMsg = err.message.slice(0, endMsg - 1);
    store.dispatch("miria/setConsoleOutput", errorMsg);
    console.error(errorMsg);
  }
}

export function executeMiriaCode() {
  // TODO: Make the logic of the execution with the tokens
  const tokens = store.state.miria.results;
  console.log(tokens);
}

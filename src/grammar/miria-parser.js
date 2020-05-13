const nearley = require("nearley");
const miria = require("./miria");

export function getMiriaParser() {
  return new nearley.Parser(nearley.Grammar.fromCompiled(miria));
}

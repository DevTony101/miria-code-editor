import store from "../store/index";
const nearley = require("nearley");
const miria = require("./parser/miria");

function getMiriaParser() {
  return new nearley.Parser(nearley.Grammar.fromCompiled(miria));
}

export function compileMiriaCode(code) {
  store.dispatch("miria/setConsoleOutput", "");
  store.dispatch("miria/setCompilationStatus", "success");
  store.dispatch("miria/setExecutionStatus", "success");
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
  store.dispatch("miria/setExecutionStatus", "success");
  store.dispatch("miria/setConsoleOutput", "");

  // Map helper for keep track of variables
  const variables = new Map();

  let tokens = store.state.miria.results;
  tokens = tokens.flat(Infinity);
  const mainFun = tokens.find(el => el.name.value === "main");
  if (mainFun) {
    if (mainFun.returnType === "void") {
      for (const token of tokens) {
        const statements = token.body.statements;
        for (const statement of statements) {
          if (["var_definition", "var_declaration"].includes(statement.type)) {
            variableAssignment(variables, statement);
          } else if (statement.type === "var_reassignment") {
            variableReassignment(variables, statement);
          } else if (statement.type === "call_expression") {
            functionCall(variables, {
              ...statement,
              args: statement.arguments,
            });
          }
        }
      }
    } else {
      store.dispatch("miria/setExecutionStatus", "failed");
      store.dispatch(
        "miria/setConsoleOutput",
        "Error: Function main must return void"
      );
    }
  } else {
    store.dispatch("miria/setExecutionStatus", "failed");
    store.dispatch("miria/setConsoleOutput", "Error: No function named main");
  }
}

function variableAssignment(map, { var_name, datatype, value }) {
  var_name = var_name.value;
  value = value.value;
  if (datatype === "string") {
    if (!value) value = "";
    map.set(var_name, {
      datatype,
      value: String(value),
    });
  } else if (datatype === "number") {
    if (!value) value = 0;
    if (!Number.isNaN(Number(value))) {
      map.set(var_name, { datatype, value });
    }
  } else if (datatype === "boolean") {
    map.set(var_name, {
      datatype,
      value: Boolean(value),
    });
  }
  console.log(map);
}

function variableReassignment(map, { var_name, value }) {
  if (map.has(var_name.value)) {
    let datatype = map.get(var_name.value).datatype;
    variableAssignment(map, { var_name, datatype, value });
  }
}

function functionCall(map, { fun_name, args }) {
  console.log(map);
  if (fun_name.value === "log") {
    for (const arg of args) {
      if (arg.type === "var_reference") {
        let var_name = arg.var_name.value;
        if (map.has(var_name)) {
          flushToOutput(`${map.get(var_name).value}\n`);
        }
      } else if (
        ["string_literal", "number_literal", "boolean_literal"].includes(
          arg.type
        )
      ) {
        flushToOutput(`${arg.value}\n`);
      }
    }
  }
}

function flushToOutput(str) {
  let currentOutput = store.state.miria.output;
  currentOutput += str;
  store.dispatch("miria/setConsoleOutput", currentOutput);
}

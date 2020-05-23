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
        processStatements(variables, statements);
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

function processStatements(map, statements) {
  console.log(statements);
  for (const statement of statements) {
    if (["var_definition", "var_declaration"].includes(statement.type)) {
      variableAssignment(map, statement);
    } else if (statement.type === "var_reassignment") {
      variableReassignment(map, statement);
    } else if (statement.type === "call_expression") {
      functionCall(map, {
        ...statement,
        args: statement.arguments,
      });
    } else if (statement.type === "if_statement") {
      ifStatement(map, statement);
    } else if (statement.type === "for_loop") {
      forLoopStatement(map, statement);
    }
  }
}

function variableAssignment(map, { var_name, datatype, value }) {
  var_name = var_name.value;
  if (value) {
    if (value?.type === "var_reference") {
      value = map.get(value.var_name.value).value;
    } else if (value?.type === "binary_operation") {
      value = evaluateExpression(map, value);
    } else {
      value = value.value;
    }
  }
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
      } else if (arg.type === "binary_operation") {
        flushToOutput(`${evaluateExpression(map, arg)}\n`);
      } else if (
        ["string_literal", "number_literal", "boolean_literal"].includes(
          arg.type
        )
      ) {
        flushToOutput(`${arg.value}\n`);
      }
    }
  } else if (fun_name.value === "range") {
    if (args.length === 0) {
      throw new Error();
    } else if (args.length === 2) {
      let a = evaluateOperator(map, args[0]);
      let b = evaluateOperator(map, args[1]);
      return Array(Math.abs(a - b))
        .fill(0)
        .map(() => a++);
    } else if (args.length > 2) {
      throw new Error("");
    }
  }
}

function ifStatement(map, { condition, consequent, alternate }) {
  if (condition.type === "boolean_literal") {
    processIfStatements(condition.value);
  } else if (condition.type === "var_reference") {
    processIfStatements(evaluateOperator(map, condition));
  } else if (condition.type === "binary_operation") {
    processIfStatements(evaluateExpression(map, condition));
  }

  function processIfStatements(value) {
    if (value) {
      processStatements(map, consequent.statements);
    } else {
      if (alternate) {
        if (alternate.type === "if_statement") {
          ifStatement(map, alternate);
        } else {
          processStatements(map, alternate.statements);
        }
      }
    }
  }
}

function forLoopStatement(map, { loop_variable, iterable, body }) {
  if (loop_variable.type === "var_declaration") {
    variableAssignment(map, loop_variable);
  } else if (loop_variable.type === "identifier") {
    if (!map.has(loop_variable.value)) {
      throw new Error("");
    }
  }

  if (iterable.type === "call_expression") {
    const iter = functionCall(map, { ...iterable, args: iterable.arguments });
    for (let i of iter) {
      if (loop_variable.var_name) {
        const payload = { ...map.get(loop_variable.var_name.value), value: i };
        map.set(loop_variable.var_name.value, payload);
      } else {
        const payload = { ...map.get(loop_variable.value), value: i };
        map.set(loop_variable.value, payload);
      }
      processStatements(map, body.statements);
    }
  }
}

function evaluateExpression(map, { left, operator, right }) {
  left = evaluateOperator(map, left);
  right = evaluateOperator(map, right);
  const stringConcat = typeof left === "string" || typeof right === "string";
  if (stringConcat && operator.value === "+") {
    return left + right;
  } else if (stringConcat && operator.value !== "+") {
    left = left
      .split("")
      .map(x => x.charCodeAt(0))
      .reduce((a, b) => a + b);
    right = right
      .split("")
      .map(x => x.charCodeAt(0))
      .reduce((a, b) => a + b);
  }

  if (operator.type === "and") {
    operator = "&&";
  } else if (operator.type === "or") {
    operator = "||";
  } else {
    operator = operator.value;
  }

  return eval(`${left} ${operator} ${right}`);
}

function evaluateOperator(map, operator) {
  if (operator.type === "binary_operation") {
    return evaluateExpression(map, operator);
  } else if (
    ["boolean_literal", "number_literal", "string_literal"].includes(
      operator.type
    )
  ) {
    return operator.value;
  } else if (operator.type === "var_reference") {
    const payload = map.get(operator.var_name.value);
    return payload.value;
  }
}

function flushToOutput(str) {
  let currentOutput = store.state.miria.output;
  currentOutput += str;
  store.dispatch("miria/setConsoleOutput", currentOutput);
}

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
      console.warn("Compiled successfully with unexpected end of| input");
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
  store.dispatch("miria/setExecutionStatus", "success");
  store.dispatch("miria/setConsoleOutput", "");

  // To keep track of variables
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
    if (store.getters["miria/executionFailed"]) {
      break;
    } else {
      if (["var_definition", "var_declaration"].includes(statement.type)) {
        variableAssignment(map, statement, true);
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
      } else if (statement.type === "while_loop") {
        whileLoopStatement(map, statement);
      } else if (statement.type === "do_while_loop") {
        doWhileLoopStatement(map, statement);
      }
    }
  }
}

function variableAssignment(map, token, checkIfExist = false) {
  const var_name = token.var_name.value;
  const datatype = token.datatype;
  let value = token.value;

  if (checkIfExist) {
    if (map.has(var_name)) {
      logError(token, `Error - Variable ${var_name} already exists\n`);
      return;
    }
  }

  if (value) {
    if (value?.type === "var_reference") {
      value = evaluateOperator(map, value);
    } else if (value?.type === "binary_operation") {
      value = evaluateExpression(map, value);
    } else {
      value = value.value;
    }
  }

  if (datatype === "string") {
    if (["boolean", "number"].includes(typeof value)) {
      logError(token, `Error - Datatype string\nbut storing a ${typeof value}`);
    } else {
      if (value === undefined) value = "";
      map.set(var_name, { datatype, value });
    }
  } else if (datatype === "number") {
    if (["boolean", "string"].includes(typeof value)) {
      logError(token, `Error - Datatype number\nbut storing a ${typeof value}`);
    } else {
      if (value === undefined) value = 0;
      if (!Number.isNaN(Number(value))) {
        map.set(var_name, { datatype, value });
      }
    }
  } else if (datatype === "boolean") {
    map.set(var_name, {
      datatype,
      value: Boolean(value),
    });
  }
  console.log(map);
}

function variableReassignment(map, token) {
  const { var_name } = token;
  if (map.has(var_name.value)) {
    let datatype = map.get(var_name.value).datatype;
    variableAssignment(map, { ...token, datatype });
  }
}

function functionCall(map, { fun_name, args }) {
  if (fun_name.value === "log") {
    for (const arg of args) {
      if (arg.type === "var_reference") {
        let var_name = arg.var_name.value;
        if (map.has(var_name)) {
          flushToOutput(`${map.get(var_name).value}\n`);
        } else {
          logError(
            {},
            `Error - Variable ${var_name} referenced but\nnever defined`,
            false,
            false
          );
        }
      } else if (arg.type === "binary_operation") {
        flushToOutput(`${evaluateExpression(map, arg)}\n`);
      } else if (isDataPrimitive(arg.type)) {
        flushToOutput(`${arg.value}\n`);
      }
    }
  } else if (fun_name.value === "range") {
    if (args.length === 0) {
      logError(
        {},
        `Error - Range function should take\nexactly 2 arguments, none were given`,
        false,
        false
      );
    } else if (args.length === 1) {
      let b = evaluateOperator(map, args[0]);
      return range(0, b);
    } else if (args.length === 2) {
      let a = evaluateOperator(map, args[0]);
      let b = evaluateOperator(map, args[1]);
      return range(a, b);
    } else if (args.length > 2) {
      logError(
        {},
        `Error - Range function should take\nexactly 2 arguments, ${args.length} were given`,
        false,
        false
      );
    }
  }

  function range(a, b) {
    return Array(Math.abs(a - b))
      .fill(0)
      .map(() => a++);
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
      logError(
        loop_variable,
        `Error - Variable ${loop_variable.value} referenced but\nnever defined`,
        false
      );
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

function whileLoopStatement(map, { body, condition }) {
  let repeatCounter = 0;
  if (condition.type === "binary_operation") {
    while (evaluateExpression(map, condition)) {
      if (processWhileStatements()) break;
    }
  } else {
    while (evaluateOperator(map, condition)) {
      if (processWhileStatements()) break;
    }
  }

  function processWhileStatements() {
    processStatements(map, body.statements);
    repeatCounter++;
    if (repeatCounter >= 100) {
      // Prevent an infinite loop
      logError(
        {},
        `Error - While loop stopped beacause\nit took too long to finish...`,
        false,
        false
      );
      return true;
    }
    return false;
  }
}

function doWhileLoopStatement(map, statement) {
  processStatements(map, statement.body.statements);
  whileLoopStatement(map, statement);
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
  } else if (isDataPrimitive(operator.type)) {
    return operator.value;
  } else if (operator.type === "var_reference") {
    const payload = map.get(operator.var_name.value);
    console.log(payload);
    if (payload === undefined) {
      logError(
        operator,
        `Error - Variable ${operator.var_name.value} referenced but\nnever defined`,
        false
      );
    } else {
      return payload.value;
    }
  }
}

function logError(token, message, showDetails = true, needsFormatting = true) {
  // TODO: Establish a hierarchy in errors so previous errors that are more important dont get deleted
  store.dispatch("miria/setConsoleOutput", "");
  store.dispatch("miria/setExecutionStatus", "failed");
  if (needsFormatting) {
    flushToOutput(formatError(token, message, showDetails));
  } else {
    flushToOutput(message);
  }
}

function formatError({ start, var_name }, message, showDetails = true) {
  const { line, col } = start;
  message +=
    (message[message.length - 1] === "\n" ? "" : " ") +
    "at line " +
    line +
    " col " +
    col +
    (showDetails ? ":\n\n" : "");
  if (showDetails) {
    message += "  " + var_name.value + "\n";
    message += "  " + Array(col).join(" ") + "^";
  }

  return message;
}

function isDataPrimitive(value) {
  return ["boolean_literal", "number_literal", "string_literal"].includes(
    value
  );
}

function flushToOutput(str) {
  let currentOutput = store.state.miria.output;
  currentOutput += str;
  store.dispatch("miria/setConsoleOutput", currentOutput);
}

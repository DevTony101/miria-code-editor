
import store from "../store/index";
import * as nearleyModule from "nearley";
import * as miriaModule from "./parser/miria";

const nearley = nearleyModule.default || nearleyModule;
const miria = miriaModule.default || miriaModule;

function getMiriaParser() {
  let grammar = miria;
  if (grammar && !grammar.ParserRules && grammar.default && grammar.default.ParserRules) {
    grammar = grammar.default;
  } else if (grammar && !grammar.ParserRules && grammar.grammar && grammar.grammar.ParserRules) {
    grammar = grammar.grammar;
  }
  
  if ((!grammar || !grammar.ParserRules) && typeof window !== 'undefined' && window.grammar && window.grammar.ParserRules) {
    grammar = window.grammar;
  }
  
  if (!grammar || !grammar.ParserRules) {
    console.error("Critical parser load failure. Grammar object is:", grammar, "Original miria import:", miria);
  }
  
  return new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
}

class Environment {
  constructor(parent = null) {
    this.parent = parent;
    this.variables = new Map();
  }
  
  define(name, datatype, value, token, isConstant = false) {
    if (this.variables.has(name)) {
      throw new Error(`Variable ${name} already exists in this scope`);
    }
    this.variables.set(name, { datatype, value, isConstant });
  }

  assign(name, value, token) {
    if (this.variables.has(name)) {
      const data = this.variables.get(name);
      if (data.isConstant) throw new Error(`Cannot reassign constant variable '${name}'`);
      data.value = value;
      return;
    }
    
    // Check if it exists in parent scopes
    let current = this.parent;
    while (current) {
      if (current.variables.has(name)) {
        const data = current.variables.get(name);
        if (data.isConstant) throw new Error(`Cannot reassign constant variable '${name}'`);
        data.value = value;
        return;
      }
      current = current.parent;
    }
    
    // If not found anywhere, automatically declare it in the current scope
    this.variables.set(name, { datatype: "any", value: value, isConstant: false });
  }

  get(name, token) {
    if (this.variables.has(name)) {
      return this.variables.get(name);
    }
    if (this.parent) {
      return this.parent.get(name, token);
    }
    throw new Error(`Variable ${name} referenced but never defined`);
  }
}

class Interpreter {
  constructor(ast) {
    this.ast = ast;
    this.globalEnv = new Environment();
    this.functions = new Map();
    this.output = "";
  }

  flushToOutput(str) {
    this.output += str;
    store.dispatch("miria/setConsoleOutput", this.output);
  }
  
  logError(token, message) {
    let line = token?.start?.line || "?";
    let col = token?.start?.col || "?";
    const err = new Error(message);
    err.line = line;
    err.col = col;
    throw err;
  }

  execute(requireMain = true) {
    store.dispatch("miria/setExecutionStatus", "success");
    store.dispatch("miria/setConsoleOutput", "");
    
    // Register all functions
    for (const token of this.ast) {
      if (token.type === "fun_definition") {
        if (this.functions.has(token.name.value)) {
          this.logError(token, `Function ${token.name.value} is already defined`);
        }
        this.functions.set(token.name.value, token);
      } else {
        this.executeStatement(token, this.globalEnv);
      }
    }
    
    const shouldExecuteMain = requireMain || this.functions.has("main");
    if (shouldExecuteMain) {
      if (!this.functions.has("main")) {
        this.logError({}, "No function named main");
      }
      
      const mainFun = this.functions.get("main");
      if (mainFun.returnType !== "void") {
        this.logError(mainFun, "Function main must return void");
      }
      if (mainFun.parameters.length > 0) {
        this.logError(mainFun, "Function main takes no arguments");
      }
      
      try {
        this.executeBlock(mainFun.body.statements, new Environment(this.globalEnv));
      } catch (err) {
        store.dispatch("miria/setExecutionStatus", "failed");
        let line = err.line || "?";
        let col = err.col || "?";
        this.flushToOutput(`Error: ${err.message} at line ${line} col ${col}\n`);
      }
    }
  }

  executeBlock(statements, env) {
    for (const stmt of statements) {
      if (store.getters["miria/executionFailed"]) return;
      
      const result = this.executeStatement(stmt, env);
      if (result === 'break' || result === 'continue' || (result && result.type === 'return')) {
        return result;
      }
    }
  }
  
  executeStatement(stmt, env) {
    switch (stmt.type) {
      case "class_definition":
      case "interface_definition": {
        try {
          if (stmt.type === "class_definition") {
             stmt.staticProperties = {};
             stmt.staticMethods = {};
             for (const member of stmt.body) {
                if (member.type === "property" && member.isStatic) {
                   stmt.staticProperties[member.name] = null;
                } else if (member.type === "fun_definition" && member.isStatic) {
                   stmt.staticMethods[member.name.value] = member;
                }
             }
          }
          env.define(stmt.name.value, stmt.type === "class_definition" ? "class" : "interface", stmt, stmt);
        } catch (e) {
          this.logError(stmt, e.message);
        }
        break;
      }
      case "fun_definition": {
        if (this.functions.has(stmt.name.value)) {
          this.logError(stmt, `Function ${stmt.name.value} is already defined`);
        }
        this.functions.set(stmt.name.value, stmt);
        break;
      }
      case "enum_def": {
        let enumObj = { __isEnum: true };
        stmt.values.forEach((val, idx) => {
          enumObj[val] = idx;
        });
        this.globalEnv.define(stmt.name, "enum", enumObj, stmt);
        break;
      }
      case "try_catch": {
        let returnVal = undefined;
        try {
          returnVal = this.executeBlock(stmt.tryBlock.statements, new Environment(env));
        } catch (e) {
          let catchEnv = new Environment(env);
          catchEnv.define(stmt.catchVar, "string", e.message || String(e), stmt);
          returnVal = this.executeBlock(stmt.catchBlock.statements, catchEnv);
        } finally {
          if (stmt.finallyBlock) {
             const finallyVal = this.executeBlock(stmt.finallyBlock.statements, new Environment(env));
             if (finallyVal) returnVal = finallyVal;
          }
        }
        if (returnVal) return returnVal;
        break;
      }
      case "throw": {
        throw new Error(this.evaluate(stmt.value, env));
      }
      case "var_declaration":
      case "var_definition": {
        const name = stmt.var_name.value;
        const datatype = stmt.datatype;
        let value = null;
        if (stmt.type === "var_definition") {
          value = this.evaluate(stmt.value, env);
          value = this.enforceType(value, datatype, stmt);
        } else {
          if (datatype === "string") value = "";
          else if (datatype === "number") value = 0;
          else if (datatype === "boolean") value = false;
          else if (datatype === "array") value = [];
        }
        try {
          env.define(name, datatype, value, stmt, stmt.isConstant);
        } catch (e) {
          this.logError(stmt, e.message);
        }
        break;
      }
      case "var_reassignment": {
        const name = stmt.var_name.value;
        let value = this.evaluate(stmt.value, env);
        try {
          let data;
          try {
            data = env.get(name, stmt);
          } catch (e) {
            env.variables.set(name, { datatype: "any", value: value, isConstant: stmt.isConstant });
            break;
          }
          value = this.enforceType(value, data.datatype, stmt);
          env.assign(name, value, stmt);
        } catch (e) {
          this.logError(stmt, e.message);
        }
        break;
      }
      case "indexed_assignment": {
        const subject = this.evaluate(stmt.subject, env);
        const index = this.evaluate(stmt.index, env);
        const value = this.evaluate(stmt.value, env);
        if (Array.isArray(subject) || (subject && typeof subject === "object" && !subject.__isMiriaObject)) {
           subject[index] = value;
        } else {
           this.logError(stmt, "Subject is not an array or dictionary");
        }
        break;
      }
      case "property_assignment": {
        const subj = this.evaluate(stmt.subject, env);
        if (subj && subj.type === "class_definition") {
           if (subj.staticProperties && stmt.property in subj.staticProperties) {
              subj.staticProperties[stmt.property] = this.evaluate(stmt.value, env);
              return;
           } else {
              this.logError(stmt, `Static property '${stmt.property}' not found on class ${subj.name.value}`);
           }
        }
        const val = this.evaluate(stmt.value, env);
        if (subj && (subj.__isMiriaObject || subj.__isSuper)) {
          let isPrivateAccess = false;
          try {
             const thisRef = env.get("this", stmt).value;
             if (thisRef === subj || (subj.__isSuper && subj.obj === thisRef)) isPrivateAccess = true;
          } catch(e) {}
          
          if (!isPrivateAccess) {
             this.logError(stmt, `Cannot access private property '${stmt.property}' from outside the class`);
          }
          
          if (subj.__isSuper) {
             subj.obj.properties[stmt.property] = val;
          } else {
             if (!(stmt.property in subj.properties)) {
                const propName = stmt.property;
                let getterName = "get" + propName.charAt(0).toUpperCase() + propName.slice(1);
                let setterName = "set" + propName.charAt(0).toUpperCase() + propName.slice(1);
                
                if (!subj.methods[`__custom_getter_${propName}`] && !subj.methods[getterName]) {
                  subj.methods[getterName] = { type: "synthetic_getter", property: propName };
                }
                
                if (!subj.methods[`__custom_setter_${propName}`] && !subj.methods[setterName]) {
                  subj.methods[setterName] = { type: "synthetic_setter", property: propName };
                }
             }
             subj.properties[stmt.property] = val;
          }
        } else if (subj && typeof subj === "object") {
           subj[stmt.property] = val;
        } else {
          this.logError(stmt, "Cannot assign property to non-object");
        }
        break;
      }
      case "call_statement":
      case "call_expression":
        this.evaluateCall(stmt, env);
        break;
      case "method_call":
        this.evaluate(stmt, env);
        break;
      case "if_statement": {
        const cond = this.evaluate(stmt.condition, env);
        if (cond) {
          const res = this.executeBlock(stmt.consequent.statements, new Environment(env));
          if (res) return res;
        } else if (stmt.alternate) {
          if (stmt.alternate.type === "if_statement") {
            const res = this.executeStatement(stmt.alternate, env);
            if (res) return res;
          } else {
            const res = this.executeBlock(stmt.alternate.statements, new Environment(env));
            if (res) return res;
          }
        }
        break;
      }
      case "while_loop": {
        let counter = 0;
        while (this.evaluate(stmt.condition, env)) {
          if (counter++ > 1000) this.logError(stmt, "Infinite loop detected");
          const res = this.executeBlock(stmt.body.statements, new Environment(env));
          if (res === 'break') break;
          if (res && res.type === 'return') return res;
        }
        break;
      }
      case "do_while_loop": {
        let counter = 0;
        const loopEnv = new Environment(env);
        do {
          if (counter++ > 1000) this.logError(stmt, "Infinite loop detected");
          const res = this.executeBlock(stmt.body.statements, loopEnv);
          if (res === 'break') break;
          if (res && res.type === 'return') return res;
        } while (this.evaluate(stmt.condition, loopEnv));
        break;
      }
      case "for_loop": {
        const iter = this.evaluate(stmt.iterable, env);
        if (!Array.isArray(iter)) this.logError(stmt, "Not an iterable");
        
        for (const i of iter) {
          const loopEnv = new Environment(env);
          const loopVarName = stmt.loop_variable.type === "var_declaration" ? stmt.loop_variable.var_name.value : stmt.loop_variable.value;
          
          let exists = false;
          try { if (env.get(loopVarName, stmt)) exists = true; } catch(e) {}
          if (exists) this.logError(stmt, `Loop variable '${loopVarName}' is already defined in outer scope`);
          
          if (stmt.loop_variable.type === "var_declaration") {
            loopEnv.define(loopVarName, stmt.loop_variable.datatype, i, stmt);
          } else {
            loopEnv.define(loopVarName, 'any', i, stmt);
          }
          
          const res = this.executeBlock(stmt.body.statements, loopEnv);
          if (res === 'break') break;
          if (res && res.type === 'return') return res;
        }
        break;
      }
      case "break_statement":
        return 'break';
      case "return_statement":
        return { type: 'return', value: this.evaluate(stmt.value, env) };
      case "switch_fun": {
        const val = this.evaluate(stmt.subject, env);
        let matched = false;
        for (const c of stmt.cases) {
          if (c.type === "switch_case_expr" || c.type === "switch_case_block") {
            const matchVal = this.evaluate(c.match, env);
            if (val === matchVal) {
              matched = true;
              if (c.type === "switch_case_expr") {
                this.evaluate(c.body, env);
              } else {
                const res = this.executeBlock(c.body.statements, new Environment(env));
                if (res) return res;
              }
              break;
            }
          }
        }
        if (!matched) {
          for (const c of stmt.cases) {
            if (c.type === "switch_default_expr") {
              this.evaluate(c.body, env);
              break;
            } else if (c.type === "switch_default_block") {
              const res = this.executeBlock(c.body.statements, new Environment(env));
              if (res) return res;
              break;
            }
          }
        }
        break;
      }
    }
  }
  
  enforceType(value, datatype, token) {
    if (datatype === "string" && typeof value !== "string") this.logError(token, `Datatype string but storing ${typeof value}`);
    if (datatype === "number" && typeof value !== "number") this.logError(token, `Datatype number but storing ${typeof value}`);
    if (datatype === "boolean" && typeof value !== "boolean") this.logError(token, `Datatype boolean but storing ${typeof value}`);
    if (datatype === "array" && !Array.isArray(value)) this.logError(token, `Datatype array but storing ${typeof value}`);
    return value;
  }

  evaluate(expr, env) {
    if (!expr) return undefined;
    switch (expr.type) {
      case "number_literal":
      case "string_literal":
      case "boolean_literal":
      case "null_literal":
        return expr.value;
      case "unary_minus":
        return -this.evaluate(expr.expression, env);
      case "array_literal":
        return expr.elements.map(e => this.evaluate(e, env));
      case "dictionary": {
        let dict = {};
        for (let entry of expr.entries) {
          dict[entry.key] = this.evaluate(entry.value, env);
        }
        return dict;
      }
      case "ternary": {
        let condition = this.evaluate(expr.condition, env);
        if (condition) {
          return this.evaluate(expr.trueExpr, env);
        } else {
          return this.evaluate(expr.falseExpr, env);
        }
      }
      case "fstring": {
        let str = expr.value;
        let regex = /\{([^\}]+)\}/g;
        let parts = [];
        let lastIdx = 0;
        let match;
        while ((match = regex.exec(str)) !== null) {
          parts.push(str.substring(lastIdx, match.index));
          try {
              let raw = match[1].trim();
              let code = `define __dummy__ as fun() -> void { return ${raw} }`;
              try {
                let p = getMiriaParser();
                p.feed(code);
                let ast = p.results[0];
                let funDef = ast[0];
                let returnStmt = funDef.body.statements[0];
                let exprNode = returnStmt.value;
                let val = this.evaluate(exprNode, env);
                parts.push(String(val));
              } catch(parseErr) {
                // Fallback for edge cases where the dummy wrap fails for some syntax reason
                let val = undefined;
                if (raw.includes(".")) {
                  let split = raw.split(".");
                  let obj = env.get(split[0], expr).value;
                  for (let i = 1; i < split.length; i++) {
                    if (obj && obj.__isMiriaObject) obj = obj.properties[split[i]];
                    else if (obj) obj = obj[split[i]];
                  }
                  val = obj;
                } else {
                  val = env.get(raw, expr).value;
                }
                parts.push(String(val));
              }
           } catch(e) {
             parts.push("{Error evaluating: " + match[1] + "}");
          }
          lastIdx = regex.lastIndex;
        }
        parts.push(str.substring(lastIdx));
        return parts.join("");
      }
      case "var_reference":
        return env.get(expr.var_name.value, expr).value;
      case "namespace_property_access": {
        if (expr.namespace === "Math" && expr.property === "PI") return Math.PI;
        if (expr.namespace === "Math" && expr.property === "E") return Math.E;
        
        const nsName = expr.namespace + "::" + expr.property;
        try {
          return this.globalEnv.get(nsName, expr).value;
        } catch(e) {
          this.logError(expr, `Undefined namespace property '${nsName}'`);
        }
        return null;
      }
      case "indexed_access": {
        const subj = this.evaluate(expr.subject, env);
        const idx = this.evaluate(expr.index, env);
        if (Array.isArray(subj) || (subj && typeof subj === "object" && !subj.__isMiriaObject) || typeof subj === "string") {
           const val = subj[idx];
           return val === undefined ? null : val;
        }
        this.logError(expr, "Subject is not indexable");
        return null;
      }
      case "this_reference":
        return env.get("this", expr).value;
      case "anonymous_function":
        expr.parameters.forEach(p => {
          const pName = p.type === "typed_parameter" ? p.name.value : p.value;
          let exists = false;
          try {
             if (env.get(pName, expr)) exists = true;
          } catch(e) {}
          if (exists) {
             this.logError(expr, `Lambda parameter '${pName}' is already defined in outer scope`);
          }
        });
        expr.closureEnv = env;
        return expr;
      case "super_reference":
        return { __isSuper: true, obj: env.get("this", expr).value };
      case "property_access": {
        const subj = this.evaluate(expr.subject, env);
        if (subj && subj.type === "class_definition") {
          if (subj.staticProperties && expr.property in subj.staticProperties) return subj.staticProperties[expr.property];
          if (subj.staticMethods && expr.property in subj.staticMethods) return subj.staticMethods[expr.property];
          return undefined;
        }
        if (subj && (subj.__isMiriaObject || subj.__isSuper)) {
          let isPrivateAccess = false;
          try {
             const thisRef = env.get("this", expr).value;
             if (thisRef === subj || (subj.__isSuper && subj.obj === thisRef)) isPrivateAccess = true;
          } catch(e) {}
          
          if (!isPrivateAccess) {
             this.logError(expr, `Cannot access private property '${expr.property}' from outside the class`);
          }
          
          if (subj.__isSuper) return subj.obj.properties[expr.property] === undefined ? null : subj.obj.properties[expr.property];
          return subj.properties[expr.property] === undefined ? null : subj.properties[expr.property];
        } else if (subj && typeof subj === "object") {
          const val = subj[expr.property];
          return val === undefined ? null : val;
        }
        return null;
      }
      case "new_expression": {
        const classDef = env.get(expr.className, expr).value;
        if (!classDef || classDef.type !== "class_definition") this.logError(expr, "Not a class");
        
        const obj = { __isMiriaObject: true, className: expr.className, properties: {}, methods: this.getClassMethods(classDef, env, expr) };
        let constructorDef = null;
        for (const member of classDef.body) {
          if (member.type === "property" && !member.isStatic) obj.properties[member.name] = null;
          if (member.type === "constructor_definition") constructorDef = member;
        }
        
        if (constructorDef) {
          const methodEnv = new Environment(env);
          methodEnv.define("this", "object", obj, expr);
          const args = expr.arguments.map(a => this.evaluate(a, env));
          constructorDef.parameters.forEach((param, i) => {
            const pName = param.type === "typed_parameter" ? param.name.value : param.value;
            const pType = param.type === "typed_parameter" ? param.datatype : "any";
            methodEnv.define(pName, pType, args[i], expr);
          });
          this.executeBlock(constructorDef.body.statements, methodEnv);
        }
        return obj;
      }
      case "method_call": {
        const subj = this.evaluate(expr.subject, env);
        const args = expr.arguments.map(a => this.evaluate(a, env));
        
        let targetObj = subj;
        if (subj && subj.__isSuper) {
           targetObj = subj.obj;
           const classDef = this.globalEnv.get(targetObj.className, expr).value;
           if (classDef && classDef.heritage && classDef.heritage.inherits) {
              const parentClass = this.globalEnv.get(classDef.heritage.inherits, expr).value;
              const parentMethods = this.getClassMethods(parentClass, this.globalEnv, expr);
              const methodDef = parentMethods[expr.method];
              if (methodDef) {
                 return this.invokeMethod(targetObj, methodDef, args, env, expr);
              }
           }
           this.logError(expr, `Method '${expr.method}' does not exist on parent class`);
        }
        
        if (targetObj && targetObj.type === "class_definition") {
          const methodDef = targetObj.staticMethods && targetObj.staticMethods[expr.method];
          if (methodDef) {
             const staticObj = { __isMiriaObject: true, className: targetObj.name.value, properties: targetObj.staticProperties, methods: targetObj.staticMethods };
             return this.invokeMethod(staticObj, methodDef, args, env, expr);
          }
          this.logError(expr, `Static method '${expr.method}' does not exist on class ${targetObj.name.value}`);
        }
        
        if (targetObj && targetObj.__isMiriaObject) {
          const methodDef = targetObj.methods[expr.method];
          if (methodDef) {
            return this.invokeMethod(targetObj, methodDef, args, env, expr);
          }
          this.logError(expr, `Method '${expr.method}' does not exist on class ${targetObj.className}`);
        }
        
        if (typeof subj === "string") {
          if (expr.method === "length") return subj.length;
          if (expr.method === "upper") return subj.toUpperCase();
          if (expr.method === "lower") return subj.toLowerCase();
          
          if (expr.method === "concat") {
             return subj + args.join("");
          }
          if (expr.method === "replace") {
             if (args.length !== 2) this.logError(expr, "replace takes 2 arguments: search and replace");
             let search = args[0];
             const replace = args[1];
             if (typeof search === "string" && search.startsWith("/") && search.lastIndexOf("/") > 0) {
                 const lastSlash = search.lastIndexOf("/");
                 const pattern = search.substring(1, lastSlash);
                 const flags = search.substring(lastSlash + 1);
                 return subj.replace(new RegExp(pattern, flags), replace);
             } else {
                 return subj.replaceAll(search, replace);
             }
          }
          if (expr.method === "padLeft") {
             if (args.length !== 2) this.logError(expr, "padLeft takes 2 arguments");
             return (args[0] || "").toString().repeat(args[1] || 0) + subj;
          }
          if (expr.method === "padRight") {
             if (args.length !== 2) this.logError(expr, "padRight takes 2 arguments");
             return subj + (args[0] || "").toString().repeat(args[1] || 0);
          }
          if (expr.method === "padCenter") {
             if (args.length !== 2) this.logError(expr, "padCenter takes 2 arguments");
             const pad = (args[0] || "").toString().repeat(args[1] || 0);
             return pad + subj + pad;
          }
          if (expr.method === "strip") return subj.trim();
          if (expr.method === "stripLeft") return subj.trimStart();
          if (expr.method === "stripRight") return subj.trimEnd();
          if (expr.method === "format") {
             let res = subj;
             for (let i = 0; i < args.length; i++) {
                 res = res.replace(/%[a-zA-Z]/, args[i]);
             }
             return res;
          }
        } else if (Array.isArray(subj)) {
          if (expr.method === "length") return subj.length;
          if (expr.method === "push") { subj.push(...args); return subj; }
          if (expr.method === "pop") { return subj.pop(); }
          if (expr.method === "join") { return subj.join(args[0] || ","); }
          if (expr.method === "shift") { return subj.shift(); }
          if (expr.method === "unshift") { subj.unshift(...args); return subj; }
          if (expr.method === "reverse") { return subj.reverse(); }
          
          const executeFuncArg = (funcRef, funcArgs) => {
             let fun;
             if (typeof funcRef === "string") {
                 fun = this.functions.get(funcRef);
                 if (!fun && !funcRef.includes("::")) {
                    let ns = Array.from(this.functions.keys()).find(k => k.endsWith("::" + funcRef));
                    if (ns) fun = this.functions.get(ns);
                 }
                 if (!fun) this.logError(expr, `Function '${funcRef}' not found`);
             } else if (funcRef && funcRef.type === "anonymous_function") {
                 fun = funcRef;
             } else {
                 this.logError(expr, "Argument must be a function name (string) or lambda");
             }
             const callEnv = new Environment(fun.closureEnv || this.globalEnv);
             for (let i = 0; i < funcArgs.length; i++) {
               if (i < fun.parameters.length) {
                 const p = fun.parameters[i];
                 const pName = p.type === "typed_parameter" ? p.name.value : p.value;
                 callEnv.variables.set(pName, { datatype: 'any', value: funcArgs[i] });
               }
             }
             const res = this.executeBlock(fun.body.statements, callEnv);
             if (res && res.type === 'return') return res.value;
             return null;
          };

          if (expr.method === "sort") { 
             if (args.length === 1) return subj.sort((a, b) => executeFuncArg(args[0], [a, b]));
             return subj.sort(); 
          }
          if (expr.method === "map") { return subj.map(x => executeFuncArg(args[0], [x])); }
          if (expr.method === "filter") { return subj.filter(x => executeFuncArg(args[0], [x])); }
          if (expr.method === "reduce") { return subj.reduce((acc, x) => executeFuncArg(args[0], [acc, x]), args[1]); }
          if (expr.method === "flatMap") { return subj.flatMap(x => executeFuncArg(args[0], [x])); }
          if (expr.method === "lookup") { return subj.find(x => executeFuncArg(args[0], [x])); }
          if (expr.method === "forEach") { subj.forEach(x => executeFuncArg(args[0], [x])); return null; }
          if (expr.method === "peek") { subj.forEach(x => executeFuncArg(args[0], [x])); return subj; }

          if (expr.method === "slice") { return subj.slice(args[0], args[1]); }
          if (expr.method === "indexOf") { return subj.indexOf(args[0]); }
          if (expr.method === "contains") { return subj.includes(args[0]); }
          if (expr.method === "remove") { 
            const idx = subj.indexOf(args[0]);
            if (idx !== -1) subj.splice(idx, 1);
            return subj; 
          }
          if (expr.method === "clear") { subj.length = 0; return subj; }
        }
        
        this.logError(expr, `Method '${expr.method}' does not exist on type ${typeof subj}`);
        return null;
      }
      case "binary_operation": {
        const left = this.evaluate(expr.left, env);
        const right = this.evaluate(expr.right, env);
        const op = expr.operator.value || expr.operator;
        
        if (op === "+") {
          if (typeof left === "string" || typeof right === "string") return String(left) + String(right);
          return left + right;
        }
        if (op === "-") return left - right;
        if (op === "*") return left * right;
        if (op === "/") return left / right;
        if (op === "%") return left % right;
        if (op === "==") return left === right;
        if (op === "!=") return left !== right;
        if (op === "<") return left < right;
        if (op === "<=") return left <= right;
        if (op === ">") return left > right;
        if (op === ">=") return left >= right;
        if (op === "and") return left && right;
        if (op === "or") return left || right;
        break;
      }
      case "boolean_negation":
        return !this.evaluate(expr.expression, env);
      case "call_expression":
        return this.evaluateCall(expr, env);
      case "switch_value": {
        const val = this.evaluate(expr.subject, env);
        for (const c of expr.cases) {
          if (c.type === "switch_case_expr") {
            const matchVal = this.evaluate(c.match, env);
            if (val === matchVal) {
              return this.evaluate(c.body, env);
            }
          }
        }
        for (const c of expr.cases) {
          if (c.type === "switch_default_expr") {
            return this.evaluate(c.body, env);
          }
        }
        return null;
      }
    }
  }
  
  evaluateCall(expr, env) {
    let name = expr.fun_name.value;
    if (expr.namespace) {
      name = `${expr.namespace}::${name}`;
    }
    const args = expr.arguments.map(a => this.evaluate(a, env));
    
    if (name === "log") {
      this.flushToOutput(args.join(" ") + "\n");
      return;
    }
    if (name === "range") {
      if (args.length === 1) return Array.from({length: args[0]}, (_, i) => i);
      if (args.length === 2) return Array.from({length: args[1] - args[0]}, (_, i) => args[0] + i);
      this.logError(expr, "range takes 1 or 2 arguments");
    }
    if (name === "len") {
       if (args.length !== 1 || !Array.isArray(args[0])) this.logError(expr, "len takes 1 array argument");
       return args[0].length;
    }
    if (name === "push") {
       if (args.length !== 2 || !Array.isArray(args[0])) this.logError(expr, "push takes (array, element)");
       args[0].push(args[1]);
       return args[0];
    }
    
    if (name.startsWith("Math::")) {
      const func = name.substring(6);
      if (["pow", "sqrt", "sin", "cos", "tan", "floor", "ceil", "random", "abs", "min", "max"].includes(func)) {
         return Math[func](...args);
      }
    }
    
    if (name.startsWith("Time::")) {
      const func = name.substring(6);
      if (func === "now" || func === "today") {
         return this.createDateObject(new Date());
      }
      if (func === "create") {
         return this.createDateObject(new Date(args[0], (args[1] || 1) - 1, args[2] || 1));
      }
    }
    
    if (this.functions.has(name)) {
      const fun = this.functions.get(name);
      if (fun.parameters.length !== args.length) {
        this.logError(expr, `Function ${name} expects ${fun.parameters.length} arguments`);
      }
      const callEnv = new Environment(this.globalEnv);
      for (let i = 0; i < args.length; i++) {
        const param = fun.parameters[i];
        const pName = param.type === "typed_parameter" ? param.name.value : param.value;
        const pType = param.type === "typed_parameter" ? param.datatype : "any";
        callEnv.variables.set(pName, { datatype: pType, value: args[i] });
      }
      const res = this.executeBlock(fun.body.statements, callEnv);
      if (res && res.type === 'return') {
         return this.enforceType(res.value, fun.returnType, expr);
      }
      return null;
    }

    try {
      const lambdaVar = env.get(name, expr);
      if (lambdaVar && lambdaVar.value && lambdaVar.value.type === "anonymous_function") {
         const fun = lambdaVar.value;
         const callEnv = new Environment(fun.closureEnv || this.globalEnv);
         for (let i = 0; i < args.length; i++) {
           if (i < fun.parameters.length) {
             const p = fun.parameters[i];
             const pName = p.type === "typed_parameter" ? p.name.value : p.value;
             const pType = p.type === "typed_parameter" ? p.datatype : "any";
             callEnv.variables.set(pName, { datatype: pType, value: args[i] });
           }
         }
         const res = this.executeBlock(fun.body.statements, callEnv);
         if (res && res.type === 'return') return res.value;
         return null;
      }
    } catch (e) { }
    
    this.logError(expr, `Function ${name} is not defined`);
  }

  getClassMethods(classDef, env, expr) {
    const methods = {};
    if (classDef.heritage && classDef.heritage.inherits) {
      const parentClass = env.get(classDef.heritage.inherits, expr).value;
      if (!parentClass || parentClass.type !== "class_definition") this.logError(expr, "Parent class not found");
      const parentMethods = this.getClassMethods(parentClass, env, expr);
      Object.assign(methods, parentMethods);
    }
    
    if (classDef.heritage && classDef.heritage.implements) {
      const interfaceDef = env.get(classDef.heritage.implements, expr).value;
      if (interfaceDef && interfaceDef.type === "interface_definition") {
        for (const member of interfaceDef.body) {
          if (member.type === "interface_method") {
            methods[member.name.value] = { isInterfaceMethod: true };
          }
        }
      }
    }
    
    for (const member of classDef.body) {
      if (member.type === "fun_definition") {
        if (member.isOverriding && !methods[member.name.value]) {
          this.logError(member, `Method ${member.name.value} marked overriding but no super method found.`);
        }
        methods[member.name.value] = member;
        
        if (member.annotations) {
          for (const ann of member.annotations) {
            if (ann.name === "getter") {
              methods[`__custom_getter_${ann.arg}`] = member.name.value;
            }
            if (ann.name === "setter") {
              methods[`__custom_setter_${ann.arg}`] = member.name.value;
            }
          }
        }
      }
    }
    return methods;
  }
  
  invokeMethod(targetObj, methodDef, args, env, expr) {
    if (methodDef.type === "synthetic_getter") {
       return targetObj.properties[methodDef.property];
    }
    if (methodDef.type === "synthetic_setter") {
       targetObj.properties[methodDef.property] = args[0];
       return targetObj;
    }
    if (methodDef.type === "native_date") {
       const d = targetObj.properties.__value;
       const result = methodDef.func(d, args);
       return result === this ? targetObj : result; // if it returns 'this', return targetObj for chaining
    }
    
    const methodEnv = new Environment(this.globalEnv);
    methodEnv.define("this", "object", targetObj, expr);
    methodDef.parameters.forEach((param, i) => {
      const pName = param.type === "typed_parameter" ? param.name.value : param.value;
      const pType = param.type === "typed_parameter" ? param.datatype : "any";
      methodEnv.define(pName, pType, args[i], expr);
    });
    const res = this.executeBlock(methodDef.body.statements, methodEnv);
    if (res && res.type === 'return') return res.value;
    return null;
  }
  
  createDateObject(jsDate) {
      return {
          __isMiriaObject: true,
          className: "Date",
          properties: { __value: jsDate },
          methods: {
              year: { type: "native_date", func: (d) => d.getFullYear() },
              month: { type: "native_date", func: (d) => d.getMonth() + 1 },
              day: { type: "native_date", func: (d) => d.getDate() },
              addDays: { type: "native_date", func: (d, args) => { d.setDate(d.getDate() + args[0]); return this; } },
              subtractDays: { type: "native_date", func: (d, args) => { d.setDate(d.getDate() - args[0]); return this; } },
              addMonths: { type: "native_date", func: (d, args) => { d.setMonth(d.getMonth() + args[0]); return this; } },
              subtractMonths: { type: "native_date", func: (d, args) => { d.setMonth(d.getMonth() - args[0]); return this; } },
              addYears: { type: "native_date", func: (d, args) => { d.setFullYear(d.getFullYear() + args[0]); return this; } },
              subtractYears: { type: "native_date", func: (d, args) => { d.setFullYear(d.getFullYear() - args[0]); return this; } },
          }
      };
  }
}

export function compileMiriaProject(fileSystem) {
  store.dispatch("miria/setConsoleOutput", "");
  store.dispatch("miria/setCompilationStatus", "success");
  store.dispatch("miria/setExecutionStatus", "success");
  
  const files = new Map();
  function traverse(folder, currentPath) {
    for (const child of folder.children) {
      if (child.children) {
        traverse(child, currentPath + child.name + "/");
      } else {
        files.set(currentPath + child.name, child.content);
      }
    }
  }
  traverse(fileSystem[0], ""); 
  
  if (!files.has('main.mi')) {
    store.dispatch("miria/setCompilationStatus", "failed");
    store.dispatch("miria/setConsoleOutput", "Error: main.mi not found in the root directory");
    return;
  }
  
  let combinedAst = [];
  let parsedFiles = new Set();
  let filesToParse = ['main.mi'];
  
  while (filesToParse.length > 0) {
    let fileName = filesToParse.shift();
    if (parsedFiles.has(fileName)) continue;
    parsedFiles.add(fileName);
    
    let code = files.get(fileName);
    if (code === undefined) {
      if (fileName === "math.mi" || fileName === "time.mi") {
         code = "";
      } else {
        store.dispatch("miria/setCompilationStatus", "failed");
        store.dispatch("miria/setConsoleOutput", `Error: Could not resolve import '${fileName}'`);
        return;
      }
    }
    
    const parser = getMiriaParser();
    try {
      parser.feed(code);
      let ast = parser.results[0] || [];
      
      let currentNamespace = null;
      
      const processImport = (node) => {
        let targetPath = node.file;
        if (targetPath !== "math.mi" && targetPath !== "time.mi") {
          const currentDir = fileName.lastIndexOf("/") !== -1 ? fileName.substring(0, fileName.lastIndexOf("/") + 1) : "";
          
          if (targetPath.startsWith("./")) {
            targetPath = currentDir + targetPath.substring(2);
          } else if (targetPath.startsWith("../")) {
            let tempDir = currentDir;
            while (targetPath.startsWith("../")) {
               targetPath = targetPath.substring(3);
               if (tempDir.endsWith("/")) tempDir = tempDir.substring(0, tempDir.length - 1);
               const lastSlash = tempDir.lastIndexOf("/");
               tempDir = lastSlash === -1 ? "" : tempDir.substring(0, lastSlash + 1);
            }
            targetPath = tempDir + targetPath;
          } else if (!targetPath.startsWith("/")) {
            targetPath = currentDir + targetPath;
          }
        }
        filesToParse.push(targetPath);
      };

      for (const node of ast) {
        if (node.type === "namespace_statement") {
          currentNamespace = node.namespace;
        } else if (node.type === "import_statement") {
          processImport(node);
        } else if (node.type === "fun_definition" || node.type === "class_definition" || node.type === "interface_definition") {
          if (node.type === "fun_definition" && node.name.value === "main") {
            node.body.statements.forEach(stmt => {
              if (stmt.type === "import_statement") processImport(stmt);
            });
          }
          if (currentNamespace) {
            node.name.value = `${currentNamespace}::${node.name.value}`;
          }
        } else if (node.type === "var_definition" || node.type === "var_declaration") {
          if (currentNamespace) {
            node.var_name.value = `${currentNamespace}::${node.var_name.value}`;
          }
        }
      }
      
      combinedAst.push(...ast);
      
    } catch (err) {
      store.dispatch("miria/setCompilationStatus", "failed");
      let errorMsg = err && err.message ? err.message : String(err);
      const endMsg = errorMsg.indexOf("Instead");
      if (endMsg !== -1) errorMsg = errorMsg.slice(0, endMsg - 1);
      store.dispatch("miria/setConsoleOutput", `Error in ${fileName}:\n${errorMsg}`);
      console.error(errorMsg);
      return;
    }
  }
  
  store.dispatch("miria/setParserResults", combinedAst);
}

export function executeMiriaCode(requireMain = true) {
  const tokens = store.state.miria.results;
  if (!tokens || tokens.length === 0) return;
  const ast = tokens.flat(Infinity);
  const interpreter = new Interpreter(ast);
  try {
    interpreter.execute(requireMain);
  } catch (err) {
    store.dispatch("miria/setExecutionStatus", "failed");
    let line = err.line || "?";
    let col = err.col || "?";
    interpreter.flushToOutput(`Error: ${err.message} at line ${line} col ${col}\n`);
  }
}

export function executeSnippet(codeString) {
  store.dispatch("miria/setConsoleOutput", "");
  
  const fsChildren = [];
  const fileRegex = /\/\/\s*In\s+([a-zA-Z0-9_\-\.]+)/g;
  let matches = [...codeString.matchAll(fileRegex)];
  
  if (matches.length > 0) {
    for (let i = 0; i < matches.length; i++) {
      const fileName = matches[i][1];
      const startIndex = matches[i].index;
      const endIndex = (i + 1 < matches.length) ? matches[i+1].index : codeString.length;
      let fileContent = codeString.substring(startIndex, endIndex);
      
      if (fileName === "main.mi" && !fileContent.includes("define main as fun")) {
        // Strip the // In main.mi part so we wrap the actual code correctly
        const codeStart = fileContent.indexOf("\n");
        const firstLine = fileContent.substring(0, codeStart);
        const rest = fileContent.substring(codeStart);
        fileContent = firstLine + "\ndefine main as fun() -> void {\n" + rest + "\n}";
      }
      fsChildren.push({ name: fileName, content: fileContent });
    }
    if (!fsChildren.some(f => f.name === "main.mi")) {
      fsChildren.push({ name: "main.mi", content: "define main as fun() -> void {}" });
    }
  } else {
    let content = codeString;
    if (!content.includes("define main as fun")) {
       content = "define main as fun() -> void {\n" + content + "\n}";
    }
    fsChildren.push({ name: "main.mi", content: content });
  }

  const fs = [
    {
      name: "/",
      children: fsChildren
    }
  ];
  
  compileMiriaProject(fs);
  if (store.state.miria.compilationStatus !== "failed") {
    executeMiriaCode(false);
  }
  
  return store.state.miria.output;
}
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = window.moo;

const lexer = moo.compile({
  ws: /[ \t]+/,
  nl: { match: "\n", lineBreaks: true },
  lte: "<=",
  lt: "<",
  gte: ">=",
  gt: ">",
  eq: "==",
  neq: "!=",
  lparan: "(",
  rparan: ")",
  comma: ",",
  lbracket: "[",
  rbracket: "]",
  lbrace: "{",
  rbrace: "}",
  define: "->",
  assignment: ":=",
  dot: ".",
  comment: {
    match: /(?:#|\/\/)[^\n]*/,
    value: s => s.startsWith('//') ? s.substring(2) : s.substring(1)
  },
  plus: "+",
  minus: "-",
  multiply: "*",
  divide: "/",
  modulo: "%",
  namespace_sep: "::",
  colon: ":",
  question: "?",
  datatype: ["string", "number", "boolean", "void", "array"],
  string_literal: {
    match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
    value: s => JSON.parse(s)
  },
  fstring_literal: {
    match: /f"(?:[^\n\\"]|\\["\\ntbfr])*"/,
    value: s => s.substring(2, s.length - 1)
  },
  number_literal: {
    match: /[0-9]+(?:\.[0-9]+)?/,
    value: s => Number(s)
  },
  identifier: {
    match: /[a-zA-Z_][a-zA-Z_0-9]*/,
    type: moo.keywords({
      fun: "fun",
      while: "while",
      for: "for",
      else: "else",
      in: "in",
      if: "if",
      evaluate: "evaluate",
      not: "not",
      return: "return",
      and: "and",
      or: "or",
      true: "true",
      false: "false",
      null_kw: "null",
      break: "break",
      import_kw: "import",
      namespace_kw: "namespace",
      class_kw: "class",
      constructor_kw: "constructor",
      this_kw: "this",
      new_kw: "new",
      interface_kw: "interface",
      implementing_kw: "implementing",
      inheriting_kw: "inheriting",
      inherting_kw: "inherting", 
      from_kw: "from",
      overriding_kw: "overriding",
      super_kw: "super",
      switch_kw: "switch",
      to_kw: "to",
      value_kw: "value",
      case_kw: "case",
      default_kw: "default",
      lambda_kw: "lambda"
    })
  },
  at: "@"
});

function tokenStart(token) {
  return {
    line: token.line,
    col: token.col - 1
  };
}

function tokenEnd(token) {
  const lastNewLine = token.text.lastIndexOf("\n");
  if (lastNewLine !== -1) {
    throw new Error("Unsupported case: token with line breaks");
  }
  return {
    line: token.line,
    col: token.col + token.text.length - 1
  };
}

function convertToken(token) {
  return {
    type: token.type,
    value: token.value,
    start: tokenStart(token),
    end: tokenEnd(token)
  };
}

function convertTokenId(data) {
  return convertToken(data[0]);
}

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "input", "symbols": ["top_level_statements"], "postprocess": id},
    {"name": "top_level_statements$ebnf$1", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": id},
    {"name": "top_level_statements$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "top_level_statements", "symbols": ["top_level_statement", "_", "top_level_statements$ebnf$1"], "postprocess": d => [d[0]]},
    {"name": "top_level_statements$ebnf$2", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": id},
    {"name": "top_level_statements$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "top_level_statements", "symbols": ["top_level_statement", "_", "top_level_statements$ebnf$2", "_", {"literal":"\n"}, "_", "top_level_statements"], "postprocess": d => [d[0], ...d[6]]},
    {"name": "top_level_statements", "symbols": ["_", {"literal":"\n"}, "top_level_statements"], "postprocess": d => d[2]},
    {"name": "top_level_statements", "symbols": ["_"], "postprocess": d => []},
    {"name": "top_level_statement", "symbols": ["enum_def"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["try_catch"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["throw_stmt"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["fun_definition"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["line_comment"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["import_statement"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["namespace_statement"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["class_definition"], "postprocess": id},
    {"name": "top_level_statement", "symbols": ["interface_definition"], "postprocess": id},
    {"name": "class_definition", "symbols": [{"literal":"define"}, "__", (lexer.has("class_kw") ? {type: "class_kw"} : class_kw), "__", "identifier", "_", "class_heritage", "_", {"literal":"as"}, "_", {"literal":"{"}, "_", "class_body", "_", {"literal":"}"}], "postprocess": 
        d => ({
          type: "class_definition",
          name: d[4],
          heritage: d[6],
          body: d[12],
          start: tokenStart(d[0]),
          end: tokenEnd(d[14])
        })
        },
    {"name": "class_heritage", "symbols": [], "postprocess": () => ({})},
    {"name": "class_heritage", "symbols": [(lexer.has("implementing_kw") ? {type: "implementing_kw"} : implementing_kw), "__", "identifier"], "postprocess": d => ({ implements: d[2].value })},
    {"name": "class_heritage", "symbols": [(lexer.has("inheriting_kw") ? {type: "inheriting_kw"} : inheriting_kw), "__", (lexer.has("from_kw") ? {type: "from_kw"} : from_kw), "__", "identifier"], "postprocess": d => ({ inherits: d[4].value })},
    {"name": "class_heritage", "symbols": [(lexer.has("inherting_kw") ? {type: "inherting_kw"} : inherting_kw), "__", (lexer.has("from_kw") ? {type: "from_kw"} : from_kw), "__", "identifier"], "postprocess": d => ({ inherits: d[4].value })},
    {"name": "class_heritage", "symbols": [(lexer.has("inheriting_kw") ? {type: "inheriting_kw"} : inheriting_kw), "__", (lexer.has("from_kw") ? {type: "from_kw"} : from_kw), "__", "identifier", "__", (lexer.has("implementing_kw") ? {type: "implementing_kw"} : implementing_kw), "__", "identifier"], "postprocess": d => ({ inherits: d[4].value, implements: d[8].value })},
    {"name": "class_heritage", "symbols": [(lexer.has("inherting_kw") ? {type: "inherting_kw"} : inherting_kw), "__", (lexer.has("from_kw") ? {type: "from_kw"} : from_kw), "__", "identifier", "__", (lexer.has("implementing_kw") ? {type: "implementing_kw"} : implementing_kw), "__", "identifier"], "postprocess": d => ({ inherits: d[4].value, implements: d[8].value })},
    {"name": "interface_definition", "symbols": [{"literal":"define"}, "__", (lexer.has("interface_kw") ? {type: "interface_kw"} : interface_kw), "__", "identifier", "_", {"literal":"as"}, "_", {"literal":"{"}, "_", "interface_body", "_", {"literal":"}"}], "postprocess": 
        d => ({
          type: "interface_definition",
          name: d[4],
          body: d[10],
          start: tokenStart(d[0]),
          end: tokenEnd(d[12])
        })
        },
    {"name": "interface_body", "symbols": ["_"], "postprocess": () => []},
    {"name": "interface_body", "symbols": ["_", {"literal":"\n"}, "interface_body"], "postprocess": d => d[2]},
    {"name": "interface_body", "symbols": ["_", "interface_member", "_"], "postprocess": d => [d[1]]},
    {"name": "interface_body", "symbols": ["_", "interface_member", "_", {"literal":"\n"}, "interface_body"], "postprocess": d => [d[1], ...d[4]]},
    {"name": "interface_member", "symbols": [{"literal":"define"}, "__", "identifier", "_", {"literal":"as"}, "_", {"literal":"fun"}, "_", {"literal":"("}, "_", "parameter_list", "_", {"literal":")"}, "_", (lexer.has("define") ? {type: "define"} : define), "_", "type_annotation"], "postprocess": 
        d => ({
          type: "interface_method",
          name: d[2],
          parameters: d[10],
          returnType: d[16].value,
          start: tokenStart(d[0]),
          end: tokenEnd(d[0])
        })
        },
    {"name": "class_body", "symbols": ["_"], "postprocess": () => []},
    {"name": "class_body", "symbols": ["_", {"literal":"\n"}, "class_body"], "postprocess": d => d[2]},
    {"name": "class_body", "symbols": ["_", "class_member", "_"], "postprocess": d => [d[1]]},
    {"name": "class_body", "symbols": ["_", "class_member", "_", {"literal":"\n"}, "class_body"], "postprocess": d => [d[1], ...d[4]]},
    {"name": "class_member", "symbols": ["constructor_definition"], "postprocess": id},
    {"name": "class_member", "symbols": ["fun_definition"], "postprocess": id},
    {"name": "class_member", "symbols": ["static_fun_definition"], "postprocess": id},
    {"name": "class_member", "symbols": ["property_decl"], "postprocess": id},
    {"name": "class_member", "symbols": ["line_comment"], "postprocess": id},
    {"name": "static_fun_definition", "symbols": [{"literal":"static"}, "__", "fun_definition"], "postprocess": 
        d => {
          let fun = d[2];
          fun.isStatic = true;
          return fun;
        }
        },
    {"name": "property_decl", "symbols": [{"literal":"property"}, "__", "identifier", "_", {"literal":":"}, "_", "type_annotation"], "postprocess": 
        d => ({ type: "property", name: d[2].value, propertyType: d[6].value, isStatic: false })
        },
    {"name": "property_decl", "symbols": [{"literal":"static"}, "__", {"literal":"property"}, "__", "identifier", "_", {"literal":":"}, "_", "type_annotation"], "postprocess": 
        d => ({ type: "property", name: d[4].value, propertyType: d[8].value, isStatic: true })
        },
    {"name": "annotation_list", "symbols": [], "postprocess": () => []},
    {"name": "annotation_list", "symbols": ["annotation", "_", "annotation_list"], "postprocess": d => [d[0], ...d[2]]},
    {"name": "annotation_list", "symbols": ["annotation", {"literal":"\n"}, "_", "annotation_list"], "postprocess": d => [d[0], ...d[3]]},
    {"name": "annotation", "symbols": [(lexer.has("at") ? {type: "at"} : at), "identifier", "_", {"literal":"("}, "_", (lexer.has("this_kw") ? {type: "this_kw"} : this_kw), "_", (lexer.has("dot") ? {type: "dot"} : dot), "_", "identifier", "_", {"literal":")"}], "postprocess": 
        d => ({ type: "annotation", name: d[1].value, arg: d[7].value })
        },
    {"name": "constructor_definition", "symbols": [(lexer.has("constructor_kw") ? {type: "constructor_kw"} : constructor_kw), "_", {"literal":"("}, "_", "parameter_list", "_", {"literal":")"}, "_", (lexer.has("define") ? {type: "define"} : define), "_", "identifier", "_", "code_block"], "postprocess": 
        d => ({
          type: "constructor_definition",
          parameters: d[4],
          returnType: d[10].value,
          body: d[12],
          start: tokenStart(d[0]),
          end: d[12].end
        })
        },
    {"name": "import_statement", "symbols": [(lexer.has("import_kw") ? {type: "import_kw"} : import_kw), "__", (lexer.has("string_literal") ? {type: "string_literal"} : string_literal)], "postprocess": 
        d => ({
          type: "import_statement",
          file: d[2].value,
          start: tokenStart(d[0]),
          end: tokenEnd(d[2])
        })
        },
    {"name": "namespace_statement", "symbols": [(lexer.has("namespace_kw") ? {type: "namespace_kw"} : namespace_kw), "__", (lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": 
        d => ({
          type: "namespace_statement",
          namespace: d[2].value,
          start: tokenStart(d[0]),
          end: tokenEnd(d[2])
        })
        },
    {"name": "fun_modifier", "symbols": [], "postprocess": () => false},
    {"name": "fun_modifier", "symbols": [(lexer.has("overriding_kw") ? {type: "overriding_kw"} : overriding_kw), "__"], "postprocess": () => true},
    {"name": "fun_definition", "symbols": ["annotation_list", {"literal":"define"}, "__", "identifier", "_", {"literal":"as"}, "_", "fun_modifier", {"literal":"fun"}, "_", {"literal":"("}, "_", "parameter_list", "_", {"literal":")"}, "_", (lexer.has("define") ? {type: "define"} : define), "_", "type_annotation", "_", "code_block"], "postprocess": 
        d => ({
          type: "fun_definition",
          annotations: d[0],
          name: d[3],
          isOverriding: d[7],
          parameters: d[12],
          returnType: d[18].value,
          body: d[20],
          start: d[0].length > 0 ? d[0][0].start : tokenStart(d[1]),
          end: d[20].end
        })
        },
    {"name": "parameter_list_elements", "symbols": ["parameter_declaration"], "postprocess": d => [d[0]]},
    {"name": "parameter_list_elements", "symbols": ["parameter_declaration", "_ml", {"literal":","}, "_ml", "parameter_list_elements"], "postprocess": d => [d[0], ...d[4]]},
    {"name": "parameter_list", "symbols": ["_ml"], "postprocess": () => []},
    {"name": "parameter_list", "symbols": ["_ml", "parameter_list_elements", "_ml"], "postprocess": d => d[1]},
    {"name": "parameter_declaration", "symbols": ["identifier"], "postprocess": id},
    {"name": "parameter_declaration", "symbols": ["identifier", "_", (lexer.has("define") ? {type: "define"} : define), "_", "type_annotation"], "postprocess": d => ({ type: "typed_parameter", name: d[0], datatype: d[4].value })},
    {"name": "code_block", "symbols": [{"literal":"{"}, "executable_statements", {"literal":"}"}], "postprocess": 
        (d) => ({
          type: "code_block",
          statements: d[1],
          start: tokenStart(d[0]),
          end: tokenEnd(d[2])
        })
        },
    {"name": "executable_statements", "symbols": ["_"], "postprocess": () => []},
    {"name": "executable_statements", "symbols": ["_", {"literal":"\n"}, "executable_statements"], "postprocess": (d) => d[2]},
    {"name": "executable_statements$ebnf$1", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": id},
    {"name": "executable_statements$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "executable_statements", "symbols": ["_", "executable_statement", "_", "executable_statements$ebnf$1", "_"], "postprocess": d => [d[1]]},
    {"name": "executable_statements$ebnf$2", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": id},
    {"name": "executable_statements$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "executable_statements", "symbols": ["_", "executable_statement", "_", "executable_statements$ebnf$2", "_", {"literal":"\n"}, "executable_statements"], "postprocess": 
        d => [d[1], ...d[6]]
          },
    {"name": "executable_statement", "symbols": ["return_statement"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["var_declaration"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["var_definition"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["var_reassignment"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["property_assignment"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["call_statement"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["line_comment"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["indexed_assignment"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["while_loop"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["do_while_loop"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["if_statement"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["for_loop"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["break_statement"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["switch_statement"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["try_catch"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["throw_stmt"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["fun_definition"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["class_definition"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["interface_definition"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["enum_def"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["namespace_statement"], "postprocess": id},
    {"name": "executable_statement", "symbols": ["import_statement"], "postprocess": id},
    {"name": "return_statement", "symbols": [{"literal":"return"}, "__", "expression"], "postprocess": 
        d => ({
          type: "return_statement",
          value: d[2],
          start: tokenStart(d[0]),
          end: d[2].end
        })
        },
    {"name": "return_statement", "symbols": [{"literal":"return"}], "postprocess": 
        d => ({
          type: "return_statement",
          value: null,
          start: tokenStart(d[0]),
          end: tokenEnd(d[0])
        })
        },
    {"name": "break_statement", "symbols": [{"literal":"break"}], "postprocess":  
        d => ({ type: "break_statement", start: tokenStart(d[0]), end: tokenEnd(d[0]) })
        },
    {"name": "var_declaration", "symbols": ["identifier", "_", (lexer.has("define") ? {type: "define"} : define), "_", "type_annotation"], "postprocess": 
        d => ({
          type: "var_declaration",
          var_name: d[0],
          datatype: d[4].value,
          start: d[0].start,
          end: d[0].end
        })
        },
    {"name": "var_definition", "symbols": ["identifier", "_", (lexer.has("define") ? {type: "define"} : define), "_", "type_annotation", "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", "expression"], "postprocess": 
        d => ({
          type: "var_definition",
          var_name: d[0],
          datatype: d[4].value,
          value: d[8],
          start: d[0].start,
          end: d[8].end
        })
        },
    {"name": "var_definition", "symbols": ["identifier", "_", (lexer.has("define") ? {type: "define"} : define), "_", "type_annotation", "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", {"literal":"as"}, "_", {"literal":"const"}, "_", "expression"], "postprocess": 
        d => ({
          type: "var_definition",
          var_name: d[0],
          datatype: d[4].value,
          value: d[10],
          isConstant: true,
          start: d[0].start,
          end: d[10].end
        })
        },
    {"name": "var_reassignment", "symbols": ["identifier", "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", "expression"], "postprocess": 
        d => ({
          type: "var_reassignment",
          var_name: d[0],
          value: d[4],
          start: d[0].start,
          end: d[4].end
        })
        },
    {"name": "var_reassignment", "symbols": ["identifier", "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", {"literal":"as"}, "_", {"literal":"const"}, "_", "expression"], "postprocess": 
        d => ({
          type: "var_reassignment",
          var_name: d[0],
          value: d[8],
          isConstant: true,
          start: d[0].start,
          end: d[8].end
        })
        },
    {"name": "property_assignment", "symbols": ["expression", "_ml", (lexer.has("dot") ? {type: "dot"} : dot), "_", "identifier", "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", "expression"], "postprocess": 
        d => ({
          type: "property_assignment",
          subject: d[0],
          property: d[4].value,
          value: d[8],
          start: d[0].start,
          end: d[8].end
        })
        },
    {"name": "call_statement", "symbols": ["call_expression"], "postprocess": id},
    {"name": "call_expression", "symbols": ["identifier", "_", {"literal":"("}, "argument_list", {"literal":")"}], "postprocess": 
        d => ({
          type: "call_expression",
          fun_name: d[0],
          arguments: d[3],
          start: d[0].start,
          end: tokenEnd(d[4])
        })
        },
    {"name": "call_expression", "symbols": ["identifier", (lexer.has("namespace_sep") ? {type: "namespace_sep"} : namespace_sep), "identifier", "_", {"literal":"("}, "argument_list", {"literal":")"}], "postprocess": 
        d => ({
          type: "call_expression",
          namespace: d[0].value,
          fun_name: d[2],
          arguments: d[5],
          start: d[0].start,
          end: tokenEnd(d[6])
        })
        },
    {"name": "call_expression", "symbols": ["unary_expression", "_ml", (lexer.has("dot") ? {type: "dot"} : dot), "_", "identifier", "_", {"literal":"("}, "argument_list", {"literal":")"}], "postprocess": 
        d => ({
          type: "method_call",
          subject: d[0],
          method: d[4].value,
          arguments: d[7],
          start: d[0].start,
          end: tokenEnd(d[8])
        })
        },
    {"name": "indexed_access", "symbols": ["unary_expression", "_ml", {"literal":"["}, "_ml", "expression", "_ml", {"literal":"]"}], "postprocess": 
        d => ({
          type: "indexed_access",
          subject: d[0],
          index: d[4],
          start: d[0].start,
          end: tokenEnd(d[6])
        })
        },
    {"name": "indexed_assignment", "symbols": ["unary_expression", "_", {"literal":"["}, "_", "expression", "_", {"literal":"]"}, "_", (lexer.has("assignment") ? {type: "assignment"} : assignment), "_", "expression"], "postprocess": 
        d => ({
          type: "indexed_assignment",
          subject: d[0],
          index: d[4],
          value: d[10],
          start: d[0].start,
          end: d[10].end
        })
        },
    {"name": "while_loop", "symbols": [{"literal":"repeat"}, "_", "code_block", "_", {"literal":"while"}, "_", {"literal":"("}, "_", "expression", "_", {"literal":")"}], "postprocess": 
        d => ({
          type: "do_while_loop",
          condition: d[8],
          body: d[2],
          start: tokenStart(d[0]),
          end: d[10].end
        })
        },
    {"name": "do_while_loop", "symbols": [{"literal":"once"}, "_", {"literal":"repeat"}, "_", "code_block", "_", {"literal":"while"}, "_", {"literal":"("}, "_", "expression", "_", {"literal":")"}], "postprocess": 
        d => ({
          type: "do_while_loop",
          condition: d[10],
          body: d[4],
          start: tokenStart(d[0]),
          end: d[12].end
        })
        },
    {"name": "if_statement", "symbols": [{"literal":"evaluate"}, "_", {"literal":"if"}, "_", {"literal":"("}, "_", "expression", "_", {"literal":")"}, "_", "code_block"], "postprocess": 
        d => ({
          type: "if_statement",
          condition: d[6],
          consequent: d[10],
          start: tokenStart(d[0]),
          end: d[10].end
        })
        },
    {"name": "if_statement", "symbols": [{"literal":"evaluate"}, "_", {"literal":"if"}, "_", {"literal":"("}, "_", "expression", "_", {"literal":")"}, "_", "code_block", "_", {"literal":"if"}, "_", {"literal":"not"}, "_", "code_block"], "postprocess": 
        d => ({
          type: "if_statement",
          condition: d[6],
          consequent: d[10],
          alternate: d[16],
          start: tokenStart(d[0]),
          end: d[16].end
        })
        },
    {"name": "if_statement", "symbols": [{"literal":"evaluate"}, "_", {"literal":"if"}, "_", {"literal":"("}, "_", "expression", "_", {"literal":")"}, "_", "code_block", "_", {"literal":"else"}, "_", "if_statement"], "postprocess": 
        d => ({
          type: "if_statement",
          condition: d[6],
          consequent: d[10],
          alternate: d[14],
          start: tokenStart(d[0]),
          end: d[14].end
        })
        },
    {"name": "for_loop", "symbols": [{"literal":"foreach"}, "_", {"literal":"("}, "_ml", "var_declaration", "_ml", {"literal":"in"}, "_ml", "expression", "_ml", {"literal":")"}, "_ml", "code_block"], "postprocess": 
        d => ({
          type: "for_loop",
          loop_variable: d[4],
          iterable: d[8],
          body: d[12],
          start: tokenStart(d[0]),
          end: d[12].end
        })
        },
    {"name": "for_loop", "symbols": [{"literal":"foreach"}, "_", {"literal":"("}, "_ml", "identifier", "_ml", {"literal":"in"}, "_ml", "expression", "_ml", {"literal":")"}, "_ml", "code_block"], "postprocess": 
        d => ({
          type: "for_loop",
          loop_variable: d[4],
          iterable: d[8],
          body: d[12],
          start: tokenStart(d[0]),
          end: d[12].end
        })
        },
    {"name": "argument_list_elements", "symbols": ["expression"], "postprocess": d => [d[0]]},
    {"name": "argument_list_elements", "symbols": ["expression", "_ml", {"literal":","}, "_ml", "argument_list_elements"], "postprocess": 
        d => [d[0], ...d[4]]
        },
    {"name": "argument_list", "symbols": ["_ml"], "postprocess": () => []},
    {"name": "argument_list", "symbols": ["_ml", "argument_list_elements", "_ml"], "postprocess": d => d[1]},
    {"name": "expression", "symbols": ["boolean_expression"], "postprocess": id},
    {"name": "expression", "symbols": ["lambda_expression"], "postprocess": id},
    {"name": "expression", "symbols": ["ternary"], "postprocess": id},
    {"name": "boolean_expression", "symbols": ["boolean_negation"], "postprocess": id},
    {"name": "boolean_expression", "symbols": ["comparison_expression"], "postprocess": id},
    {"name": "boolean_expression", "symbols": ["comparison_expression", "_", "boolean_operator", "_", "boolean_expression"], "postprocess": 
        d => ({
          type: "binary_operation",
          operator: convertToken(d[2]),
          left: d[0],
          right: d[4],
          start: d[0].start,
          end: d[4].end
        })
        },
    {"name": "boolean_negation", "symbols": [{"literal":"not"}, "_", "expression"], "postprocess": 
        d => ({
          type: "boolean_negation",
          expression: d[2],
          start: tokenStart(d[0]),
          end: d[2].end
        })
        },
    {"name": "boolean_operator", "symbols": [{"literal":"and"}], "postprocess": id},
    {"name": "boolean_operator", "symbols": [{"literal":"or"}], "postprocess": id},
    {"name": "comparison_expression", "symbols": ["additive_expression"], "postprocess": id},
    {"name": "comparison_expression", "symbols": ["additive_expression", "_", "comparison_operator", "_", "comparison_expression"], "postprocess": 
        d => ({
          type: "binary_operation",
          operator: d[2],
          left: d[0],
          right: d[4],
          start: d[0].start,
          end: d[4].end
        })
        },
    {"name": "comparison_operator", "symbols": [{"literal":">"}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":">="}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"<"}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"<="}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"=="}], "postprocess": convertTokenId},
    {"name": "comparison_operator", "symbols": [{"literal":"!="}], "postprocess": convertTokenId},
    {"name": "additive_expression", "symbols": ["multiplicative_expression"], "postprocess": id},
    {"name": "additive_expression", "symbols": ["additive_expression", "_", /[+-]/, "_", "multiplicative_expression"], "postprocess": 
        d => ({
          type: "binary_operation",
          operator: convertToken(d[2]),
          left: d[0],
          right: d[4],
          start: d[0].start,
          end: d[4].end
        })
        },
    {"name": "multiplicative_expression", "symbols": ["unary_expression"], "postprocess": id},
    {"name": "multiplicative_expression", "symbols": ["multiplicative_expression", "_", /[*/%]/, "_", "unary_expression"], "postprocess": 
        d => ({
          type: "binary_operation",
          operator: convertToken(d[2]),
          left: d[0],
          right: d[4],
          start: d[0].start,
          end: d[4].end
        })
        },
    {"name": "unary_expression", "symbols": ["number"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["call_expression"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["string_literal"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["boolean_literal"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["array_literal"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["dictionary"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["property_access"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["new_expression"], "postprocess": id},
    {"name": "unary_expression", "symbols": [(lexer.has("fstring_literal") ? {type: "fstring_literal"} : fstring_literal)], "postprocess": 
        d => ({
          type: "fstring",
          value: d[0].value,
          start: tokenStart(d[0]),
          end: tokenEnd(d[0])
        })
        },
    {"name": "unary_expression", "symbols": [(lexer.has("this_kw") ? {type: "this_kw"} : this_kw)], "postprocess": d => ({ type: "this_reference", start: tokenStart(d[0]), end: tokenEnd(d[0]) })},
    {"name": "unary_expression", "symbols": [(lexer.has("super_kw") ? {type: "super_kw"} : super_kw)], "postprocess": d => ({ type: "super_reference", start: tokenStart(d[0]), end: tokenEnd(d[0]) })},
    {"name": "unary_expression", "symbols": [(lexer.has("null_kw") ? {type: "null_kw"} : null_kw)], "postprocess": d => ({ type: "null_literal", value: null, start: tokenStart(d[0]), end: tokenEnd(d[0]) })},
    {"name": "unary_expression", "symbols": ["switch_value_expr"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["indexed_access"], "postprocess": id},
    {"name": "unary_expression", "symbols": ["identifier"], "postprocess": 
        d => ({
          type: "var_reference",
          var_name: d[0],
          start: d[0].start,
          end: d[0].end
        })
        },
    {"name": "unary_expression", "symbols": [(lexer.has("minus") ? {type: "minus"} : minus), "_", "unary_expression"], "postprocess": 
        d => ({
          type: "unary_minus",
          expression: d[2],
          start: tokenStart(d[0]),
          end: d[2].end
        })
        },
    {"name": "unary_expression", "symbols": [{"literal":"("}, "expression", {"literal":")"}], "postprocess": 
        data => data[1]
        },
    {"name": "unary_expression", "symbols": ["namespace_property_access"], "postprocess": id},
    {"name": "namespace_property_access", "symbols": ["identifier", (lexer.has("namespace_sep") ? {type: "namespace_sep"} : namespace_sep), "identifier"], "postprocess": 
        d => ({
          type: "namespace_property_access",
          namespace: d[0].value,
          property: d[2].value,
          start: d[0].start,
          end: d[2].end
        })
        },
    {"name": "property_access", "symbols": ["unary_expression", "_ml", (lexer.has("dot") ? {type: "dot"} : dot), "_", "identifier"], "postprocess": 
        d => ({
          type: "property_access",
          subject: d[0],
          property: d[4].value,
          start: d[0].start,
          end: d[4].end
        })
        },
    {"name": "new_expression", "symbols": [(lexer.has("new_kw") ? {type: "new_kw"} : new_kw), "_", "identifier", "_", {"literal":"("}, "argument_list", {"literal":")"}], "postprocess": 
        d => ({
          type: "new_expression",
          className: d[2].value,
          arguments: d[5],
          start: tokenStart(d[0]),
          end: tokenEnd(d[6])
        })
        },
    {"name": "new_expression", "symbols": [(lexer.has("new_kw") ? {type: "new_kw"} : new_kw), "_", "identifier", (lexer.has("namespace_sep") ? {type: "namespace_sep"} : namespace_sep), "identifier", "_", {"literal":"("}, "argument_list", {"literal":")"}], "postprocess": 
        d => ({
          type: "new_expression",
          className: d[2].value + "::" + d[4].value,
          arguments: d[7],
          start: tokenStart(d[0]),
          end: tokenEnd(d[8])
        })
        },
    {"name": "type_annotation", "symbols": [(lexer.has("datatype") ? {type: "datatype"} : datatype)], "postprocess": d => ({ value: d[0].value })},
    {"name": "type_annotation", "symbols": ["identifier"], "postprocess": d => ({ value: d[0].value })},
    {"name": "type_annotation", "symbols": [{"literal":"lmd"}, "_", {"literal":"("}, "parameter_list", {"literal":")"}, "_", {"literal":"->"}, "_", "type_annotation"], "postprocess": d => ({ value: "lambda" })},
    {"name": "type_annotation", "symbols": [{"literal":"lmd"}, "_", {"literal":"("}, "parameter_list", {"literal":")"}], "postprocess": d => ({ value: "lambda" })},
    {"name": "lambda_expression", "symbols": [(lexer.has("lambda_kw") ? {type: "lambda_kw"} : lambda_kw), "_", {"literal":"("}, "parameter_list", {"literal":")"}, "_", {"literal":"->"}, "_", "expression"], "postprocess": 
        d => ({
          type: "anonymous_function",
          parameters: d[3],
          body: {
            type: "code_block",
            statements: [{ type: "return_statement", value: d[8], start: d[8].start, end: d[8].end }],
            start: d[8].start,
            end: d[8].end
          },
          start: tokenStart(d[0]),
          end: d[8].end
        })
        },
    {"name": "lambda_expression", "symbols": [(lexer.has("lambda_kw") ? {type: "lambda_kw"} : lambda_kw), "_", {"literal":"("}, "parameter_list", {"literal":")"}, "_", "code_block"], "postprocess": 
        d => ({
          type: "anonymous_function",
          parameters: d[3],
          body: d[6],
          start: tokenStart(d[0]),
          end: d[6].end
        })
        },
    {"name": "array_literal", "symbols": [{"literal":"["}, "argument_list", {"literal":"]"}], "postprocess": d => ({ type: "array_literal", elements: d[1], start: tokenStart(d[0]), end: tokenEnd(d[2]) })},
    {"name": "boolean_literal", "symbols": [{"literal":"true"}], "postprocess": 
        d => ({
          type: "boolean_literal",
          value: true,
          start: tokenStart(d[0]),
          end: tokenEnd(d[0])
        })
        },
    {"name": "boolean_literal", "symbols": [{"literal":"false"}], "postprocess": 
        d => ({
          type: "boolean_literal",
          value: false,
          start: tokenStart(d[0]),
          end: tokenEnd(d[0])
        })
        },
    {"name": "line_comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": convertTokenId},
    {"name": "string_literal", "symbols": [(lexer.has("string_literal") ? {type: "string_literal"} : string_literal)], "postprocess": convertTokenId},
    {"name": "number", "symbols": [(lexer.has("number_literal") ? {type: "number_literal"} : number_literal)], "postprocess": convertTokenId},
    {"name": "identifier", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": convertTokenId},
    {"name": "switch_statement", "symbols": [(lexer.has("switch_kw") ? {type: "switch_kw"} : switch_kw), "_", (lexer.has("from_kw") ? {type: "from_kw"} : from_kw), "_", {"literal":"("}, "_", "expression", "_", {"literal":")"}, "_", (lexer.has("to_kw") ? {type: "to_kw"} : to_kw), "_", (lexer.has("fun") ? {type: "fun"} : fun), "_", {"literal":"{"}, "_ml", "switch_fun_cases", "_ml", {"literal":"}"}], "postprocess": 
        d => ({
          type: "switch_fun",
          subject: d[6],
          cases: d[16],
          start: tokenStart(d[0]),
          end: tokenEnd(d[18])
        })
        },
    {"name": "switch_fun_cases", "symbols": ["switch_fun_case", "_ml", "switch_fun_cases"], "postprocess": 
        d => [d[0], ...d[2]]
        },
    {"name": "switch_fun_cases", "symbols": ["switch_fun_default"], "postprocess": 
        d => [d[0]]
        },
    {"name": "switch_fun_cases", "symbols": ["switch_fun_case"], "postprocess": 
        d => [d[0]]
        },
    {"name": "switch_fun_cases", "symbols": ["switch_fun_case", "_ml", "switch_fun_default"], "postprocess": 
        d => [d[0], d[2]]
        },
    {"name": "switch_fun_case", "symbols": [(lexer.has("case_kw") ? {type: "case_kw"} : case_kw), "__", "expression", "_", {"literal":"->"}, "_", "expression"], "postprocess": 
        d => ({
          type: "switch_case_expr",
          match: d[2],
          body: d[6]
        })
        },
    {"name": "switch_fun_case", "symbols": [(lexer.has("case_kw") ? {type: "case_kw"} : case_kw), "__", "expression", "_", {"literal":"as"}, "_", (lexer.has("fun") ? {type: "fun"} : fun), "_", {"literal":"("}, "_", {"literal":")"}, "_", {"literal":"->"}, "_", {"literal":"void"}, "_", "code_block"], "postprocess": 
        d => ({
          type: "switch_case_block",
          match: d[2],
          body: d[16]
        })
        },
    {"name": "switch_fun_default", "symbols": [(lexer.has("default_kw") ? {type: "default_kw"} : default_kw), "_", {"literal":"->"}, "_", "expression"], "postprocess": 
        d => ({
          type: "switch_default_expr",
          body: d[4]
        })
        },
    {"name": "switch_fun_default", "symbols": [(lexer.has("default_kw") ? {type: "default_kw"} : default_kw), "_", {"literal":"as"}, "_", (lexer.has("fun") ? {type: "fun"} : fun), "_", {"literal":"("}, "_", {"literal":")"}, "_", {"literal":"->"}, "_", {"literal":"void"}, "_", "code_block"], "postprocess": 
        d => ({
          type: "switch_default_block",
          body: d[14]
        })
        },
    {"name": "switch_value_expr", "symbols": [(lexer.has("switch_kw") ? {type: "switch_kw"} : switch_kw), "_", (lexer.has("from_kw") ? {type: "from_kw"} : from_kw), "_", {"literal":"("}, "_", "expression", "_", {"literal":")"}, "_", (lexer.has("to_kw") ? {type: "to_kw"} : to_kw), "_", (lexer.has("value_kw") ? {type: "value_kw"} : value_kw), "_", {"literal":"{"}, "_ml", "switch_val_cases", "_ml", {"literal":"}"}], "postprocess": 
        d => ({
          type: "switch_value",
          subject: d[6],
          cases: d[16],
          start: tokenStart(d[0]),
          end: tokenEnd(d[18])
        })
        },
    {"name": "switch_val_cases", "symbols": ["switch_val_case", "_ml", "switch_val_cases"], "postprocess": 
        d => [d[0], ...d[2]]
        },
    {"name": "switch_val_cases", "symbols": ["switch_val_default"], "postprocess": 
        d => [d[0]]
        },
    {"name": "switch_val_cases", "symbols": ["switch_val_case"], "postprocess": 
        d => [d[0]]
        },
    {"name": "switch_val_cases", "symbols": ["switch_val_case", "_ml", "switch_val_default"], "postprocess": 
        d => [d[0], d[2]]
        },
    {"name": "switch_val_case", "symbols": [(lexer.has("case_kw") ? {type: "case_kw"} : case_kw), "__", "expression", "_", {"literal":"->"}, "_", "expression"], "postprocess": 
        d => ({
          type: "switch_case_expr",
          match: d[2],
          body: d[6]
        })
        },
    {"name": "switch_val_default", "symbols": [(lexer.has("default_kw") ? {type: "default_kw"} : default_kw), "_", {"literal":"->"}, "_", "expression"], "postprocess": 
        d => ({
          type: "switch_default_expr",
          body: d[4]
        })
        },
    {"name": "_ml$ebnf$1", "symbols": []},
    {"name": "_ml$ebnf$1", "symbols": ["_ml$ebnf$1", "multi_line_ws_char"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_ml", "symbols": ["_ml$ebnf$1"]},
    {"name": "multi_line_ws_char", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "multi_line_ws_char", "symbols": [{"literal":"\n"}]},
    {"name": "__$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "dictionary$ebnf$1", "symbols": ["dictionary_entries"], "postprocess": id},
    {"name": "dictionary$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "dictionary", "symbols": [{"literal":"{"}, "_ml", "dictionary$ebnf$1", "_ml", {"literal":"}"}], "postprocess": 
        d => ({
            type: "dictionary",
            entries: d[2] ? d[2] : []
        })
        },
    {"name": "dictionary_entries", "symbols": ["dictionary_entry"], "postprocess": d => [d[0]]},
    {"name": "dictionary_entries", "symbols": ["dictionary_entries", "_ml", {"literal":","}, "_ml", "dictionary_entry"], "postprocess": d => [...d[0], d[4]]},
    {"name": "dictionary_entry$subexpression$1", "symbols": [(lexer.has("string_literal") ? {type: "string_literal"} : string_literal)]},
    {"name": "dictionary_entry$subexpression$1", "symbols": ["identifier"]},
    {"name": "dictionary_entry", "symbols": ["dictionary_entry$subexpression$1", "_ml", {"literal":":"}, "_ml", "expression"], "postprocess": 
        d => ({
            key: d[0][0].type === 'identifier' ? d[0][0].value : d[0][0].value,
            value: d[4]
        })
            },
    {"name": "try_catch", "symbols": [{"literal":"try"}, "_ml", "code_block", "_ml", {"literal":"catch"}, "_ml", {"literal":"("}, "_ml", "identifier", "_ml", {"literal":")"}, "_ml", "code_block"], "postprocess": 
        d => ({
            type: "try_catch",
            tryBlock: d[2],
            catchVar: d[8].value,
            catchBlock: d[12]
        })
        },
    {"name": "try_catch", "symbols": [{"literal":"try"}, "_ml", "code_block", "_ml", {"literal":"catch"}, "_ml", {"literal":"("}, "_ml", "identifier", "_ml", {"literal":")"}, "_ml", "code_block", "_ml", {"literal":"finally"}, "_ml", "code_block"], "postprocess": 
        d => ({
            type: "try_catch",
            tryBlock: d[2],
            catchVar: d[8].value,
            catchBlock: d[12],
            finallyBlock: d[16]
        })
        },
    {"name": "throw_stmt", "symbols": [{"literal":"throw"}, "_", "expression"], "postprocess": 
        d => ({
            type: "throw",
            value: d[2]
        })
        },
    {"name": "ternary", "symbols": [{"literal":"evaluate"}, "_", "boolean_expression", "_", {"literal":"?"}, "_", "expression", "_", {"literal":":"}, "_", "expression"], "postprocess": 
        d => ({
            type: "ternary",
            condition: d[2],
            trueExpr: d[6],
            falseExpr: d[10]
        })
        },
    {"name": "enum_def$ebnf$1", "symbols": ["enum_values"], "postprocess": id},
    {"name": "enum_def$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "enum_def", "symbols": [{"literal":"define"}, "_", {"literal":"enum"}, "_", "identifier", "_ml", {"literal":"{"}, "_ml", "enum_def$ebnf$1", "_ml", {"literal":"}"}], "postprocess": 
        d => ({
            type: "enum_def",
            name: d[4].value,
            values: d[8] || []
        })
        },
    {"name": "enum_values", "symbols": ["identifier"], "postprocess": d => [d[0].value]},
    {"name": "enum_values", "symbols": ["enum_values", "_ml", {"literal":","}, "_ml", "identifier"], "postprocess": d => [...d[0], d[4].value]}
]
  , ParserStart: "input"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

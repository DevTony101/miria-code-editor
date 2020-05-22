@{%
const moo = require("moo");

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
  plus: "+",
  minus: "-",
  multiply: "*",
  divide: "/",
  modulo: "%",
  colon: ":",
  datatype: ["string", "number", "boolean", "void"],
  comment: {
    match: /#[^\n]*/,
    value: s => s.substring(1)
  },
  string_literal: {
    match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
    value: s => JSON.parse(s)
  },
  number_literal: {
    match: /[0-9]+(?:\.[0-9]+)?/,
    value: s => Number(s)
  },
  identifier: {
    match: /[a-z_][A-Za-z_0-9]*/,
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
      false: "false"
    })
  }
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

%}

@lexer lexer

input -> top_level_statements {% id %}

top_level_statements -> top_level_statement {% d => [d[0]] %}
| top_level_statement _ "\n" _ top_level_statements {% d => [d[0], ...d[4]] %}
# below 2 sub-rules handle blank lines
| _ "\n" top_level_statements {% d => d[2] %}
| _ {% d => [] %}

top_level_statement -> fun_definition {% id %} | line_comment {% id %}

fun_definition -> "define" __ identifier _ "as" _ "fun" _ "(" _ parameter_list _ ")" _ %define _ %datatype _ code_block {%
  d => ({
    type: "fun_definition",
    name: d[2],
    parameters: d[10],
    returnType: d[16].text,
    body: d[18],
    start: tokenStart(d[0]),
    end: d[18].end
  })
%}

parameter_list -> null {% () => [] %} | identifier {% d => [d[0]] %}
  | identifier _ "," _ parameter_list {%
    d => [d[0], ...d[4]]
  %}

code_block -> "{" executable_statements "}" {%
  (d) => ({
    type: "code_block",
    statements: d[1],
    start: tokenStart(d[0]),
    end: tokenEnd(d[2])
  })
%}

executable_statements -> _ {% () => [] %} | _ "\n" executable_statements {% (d) => d[2] %} 
  | _ executable_statement _ {% d => [d[1]] %}
  | _ executable_statement _ "\n" executable_statements {%
    d => [d[1], ...d[4]]
  %}

executable_statement -> return_statement {% id %}
  |  var_declaration      {% id %}
  |  var_definition       {% id %}
  |  var_reassignment     {% id %}
  |  call_statement       {% id %}
  |  line_comment         {% id %}
  |  indexed_assignment   {% id %}
  |  while_loop           {% id %}
  |  do_while_loop        {% id %}
  |  if_statement         {% id %}
  |  for_loop             {% id %}

return_statement -> "return" __ expression {%
  d => ({
    type: "return_statement",
    value: d[2],
    start: tokenStart(d[0]),
    end: d[2].end
  })
%}

var_declaration -> identifier _ %define _ %datatype {%
  d => ({
    type: "var_declaration",
    var_name: d[0],
    datatype: d[4].text,
    start: d[0].start,
    end: tokenEnd(d[4])
  })
%}

var_definition -> identifier _ %define _ %datatype _ %assignment _ expression {%
  d => ({
    type: "var_definition",
    var_name: d[0],
    datatype: d[4].text,
    value: d[8],
    start: d[0].start,
    end: d[8].end
  })
%}

var_reassignment -> identifier _ %assignment _ expression {%
  d => ({
    type: "var_reassignment",
    var_name: d[0],
    value: d[4],
    start: d[0].start,
    end: d[4].end
  })
%}

call_statement -> call_expression  {% id %}

call_expression -> identifier _ "(" argument_list ")" {%
  d => ({
    type: "call_expression",
    fun_name: d[0],
    arguments: d[3],
    start: d[0].start,
    end: tokenEnd(d[4])
  })
%}

indexed_access -> unary_expression _ "[" _ expression _ "]" {%
  d => ({
    type: "indexed_access",
    subject: d[0],
    index: d[4],
    start: d[0].start,
    end: tokenEnd(d[6])
  })
%}

indexed_assignment -> unary_expression _ "[" _ expression _ "]" _ "=" _ expression {%
  d => ({
    type: "indexed_assignment",
    subject: d[0],
    index: d[4],
    value: d[10],
    start: d[0].start,
    end: d[10].end
  })
%}

while_loop -> "repeat" _ code_block _ "while" _ "(" _ expression _ ")" {%
  d => ({
    type: "while_loop",
    condition: d[8],
    body: d[2],
    start: tokenStart(d[0]),
    end: d[10].end
  })
%}

do_while_loop -> "once" _ "repeat" _ code_block _ "while" _ "(" _ expression _ ")" {%
  d => ({
    type: "do_while_loop",
    condition: d[10],
    body: d[4],
    start: tokenStart(d[0]),
    end: d[12].end
  })
%}

if_statement -> "evaluate" _ "if" _ "(" _ expression _ ")" _ code_block {%
  d => ({
    type: "if_statement",
    condition: d[6],
    consequent: d[10],
    start: tokenStart(d[0]),
    end: d[10].end
  })
%} | 
"evaluate" _ "if" _ "(" _ expression _ ")" _ code_block _ "if" _ "not" _ code_block {%
  d => ({
    type: "if_statement",
    condition: d[6],
    consequent: d[10],
    alternate: d[16],
    start: tokenStart(d[0]),
    end: d[16].end
  })
%} | 
"evaluate" _ "if" _ "(" _ expression _ ")" _ code_block _ "else" _ if_statement {%
  d => ({
    type: "if_statement",
    condition: d[6],
    consequent: d[10],
    alternate: d[14],
    start: tokenStart(d[0]),
    end: d[14].end
  })
%}

for_loop -> "foreach" _ "(" _ var_declaration _ "in" _ call_expression _ ")" _ code_block {%
  d => ({
    type: "for_loop",
    loop_variable: d[4],
    iterable: d[8],
    body: d[12],
    start: tokenStart(d[0]),
    end: d[12].end
  })
%}
| "foreach" _ "(" _ identifier _ "in" _ call_expression _ ")" _ code_block {%
  d => ({
    type: "for_loop",
    loop_variable: d[4],
    iterable: d[8],
    body: d[12],
    start: tokenStart(d[0]),
    end: d[12].end
  })
%}

argument_list -> null {% () => [] %} | _ expression _  {% d => [d[1]] %}
| _ expression _ "," argument_list {%
  d => [d[1], ...d[4]]
%}

expression -> boolean_expression {% id %}

boolean_expression -> boolean_negation {% id %} | comparison_expression {% id %}
| comparison_expression _ boolean_operator _ boolean_expression {%
  d => ({
    type: "binary_operation",
    operator: convertToken(d[2]),
    left: d[0],
    right: d[4],
    start: d[0].start,
    end: d[4].end
  })
%} 

boolean_negation -> "not" _ expression {%
  d => ({
    type: "boolean_negation",
    expression: d[2],
    start: tokenStart(d[0]),
    end: d[2].end
  })
%}

boolean_operator -> "and" {% id %} | "or" {% id %}

comparison_expression -> additive_expression {% id %} | additive_expression _ comparison_operator _ comparison_expression {%
  d => ({
    type: "binary_operation",
    operator: d[2],
    left: d[0],
    right: d[4],
    start: d[0].start,
    end: d[4].end
  })
%}

comparison_operator -> ">" {% convertTokenId %} | ">=" {% convertTokenId %}
| "<" {% convertTokenId %} | "<=" {% convertTokenId %}
| "==" {% convertTokenId %} | "!=" {% convertTokenId %}

additive_expression -> multiplicative_expression {% id %} | multiplicative_expression _ [+-] _ additive_expression {%
  d => ({
    type: "binary_operation",
    operator: convertToken(d[2]),
    left: d[0],
    right: d[4],
    start: d[0].start,
    end: d[4].end
  })
%}

multiplicative_expression -> unary_expression {% id %} | unary_expression _ [*/%] _ multiplicative_expression {%
  d => ({
    type: "binary_operation",
    operator: convertToken(d[2]),
    left: d[0],
    right: d[4],
    start: d[0].start,
    end: d[4].end
  })
%}

unary_expression -> number {% id %}
| call_expression {% id %} | string_literal {% id %} | boolean_literal {% id %} 
| indexed_access {% id %} | identifier {%
  d => ({
    type: "var_reference",
    var_name: d[0],
    start: d[0].start,
    end: d[0].end
  })
%}
| "(" expression ")" {%
  data => data[1]
%}

boolean_literal -> "true" {%
  d => ({
    type: "boolean_literal",
    value: true,
    start: tokenStart(d[0]),
    end: tokenEnd(d[0])
  })
%} | 
"false" {%
  d => ({
    type: "boolean_literal",
    value: false,
    start: tokenStart(d[0]),
    end: tokenEnd(d[0])
  })
%}

# Tokens
line_comment -> %comment {% convertTokenId %}
string_literal -> %string_literal {% convertTokenId %}
number -> %number_literal {% convertTokenId %}
identifier -> %identifier {% convertTokenId %}

# Multilines
_ml -> multi_line_ws_char:*
multi_line_ws_char -> %ws | "\n"

# Whitespaces
__ -> %ws:+
_ -> %ws:*
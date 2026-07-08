@{%
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

%}

@lexer lexer

input -> top_level_statements {% id %}

top_level_statements -> top_level_statement _ %comment:? {% d => [d[0]] %}
| top_level_statement _ %comment:? _ "\n" _ top_level_statements {% d => [d[0], ...d[6]] %}
# below 2 sub-rules handle blank lines
| _ "\n" top_level_statements {% d => d[2] %}
| _ {% d => [] %}

top_level_statement -> enum_def {% id %} | try_catch {% id %} | throw_stmt {% id %} | fun_definition {% id %} | line_comment {% id %} | import_statement {% id %} | namespace_statement {% id %} | class_definition {% id %} | interface_definition {% id %}

class_definition -> "define" __ %class_kw __ identifier _ class_heritage _ "as" _ "{" _ class_body _ "}" {%
  d => ({
    type: "class_definition",
    name: d[4],
    heritage: d[6],
    body: d[12],
    start: tokenStart(d[0]),
    end: tokenEnd(d[14])
  })
%}

class_heritage -> null {% () => ({}) %}
  | %implementing_kw __ identifier {% d => ({ implements: d[2].value }) %}
  | %inheriting_kw __ %from_kw __ identifier {% d => ({ inherits: d[4].value }) %}
  | %inherting_kw __ %from_kw __ identifier {% d => ({ inherits: d[4].value }) %}
  | %inheriting_kw __ %from_kw __ identifier __ %implementing_kw __ identifier {% d => ({ inherits: d[4].value, implements: d[8].value }) %}
  | %inherting_kw __ %from_kw __ identifier __ %implementing_kw __ identifier {% d => ({ inherits: d[4].value, implements: d[8].value }) %}

interface_definition -> "define" __ %interface_kw __ identifier _ "as" _ "{" _ interface_body _ "}" {%
  d => ({
    type: "interface_definition",
    name: d[4],
    body: d[10],
    start: tokenStart(d[0]),
    end: tokenEnd(d[12])
  })
%}

interface_body -> _ {% () => [] %}
  | _ "\n" interface_body {% d => d[2] %}
  | _ interface_member _ {% d => [d[1]] %}
  | _ interface_member _ "\n" interface_body {% d => [d[1], ...d[4]] %}

interface_member -> "define" __ identifier _ "as" _ "fun" _ "(" _ parameter_list _ ")" _ %define _ type_annotation {%
  d => ({
    type: "interface_method",
    name: d[2],
    parameters: d[10],
    returnType: d[16].value,
    start: tokenStart(d[0]),
    end: tokenEnd(d[0])
  })
%}

class_body -> _ {% () => [] %} 
  | _ "\n" class_body {% d => d[2] %}
  | _ class_member _ {% d => [d[1]] %}
  | _ class_member _ "\n" class_body {% d => [d[1], ...d[4]] %}

class_member -> constructor_definition {% id %} | fun_definition {% id %} | static_fun_definition {% id %} | property_decl {% id %} | line_comment {% id %}

static_fun_definition -> "static" __ fun_definition {%
  d => {
    let fun = d[2];
    fun.isStatic = true;
    return fun;
  }
%}

property_decl -> "property" __ identifier _ ":" _ type_annotation {%
  d => ({ type: "property", name: d[2].value, propertyType: d[6].value, isStatic: false })
%} | "static" __ "property" __ identifier _ ":" _ type_annotation {%
  d => ({ type: "property", name: d[4].value, propertyType: d[8].value, isStatic: true })
%}

annotation_list -> null {% () => [] %}
  | annotation _ annotation_list {% d => [d[0], ...d[2]] %}
  | annotation "\n" _ annotation_list {% d => [d[0], ...d[3]] %}

annotation -> %at identifier _ "(" _ %this_kw _ %dot _ identifier _ ")" {%
  d => ({ type: "annotation", name: d[1].value, arg: d[7].value })
%}

constructor_definition -> %constructor_kw _ "(" _ parameter_list _ ")" _ %define _ identifier _ code_block {%
  d => ({
    type: "constructor_definition",
    parameters: d[4],
    returnType: d[10].value,
    body: d[12],
    start: tokenStart(d[0]),
    end: d[12].end
  })
%}

import_statement -> %import_kw __ %string_literal {%
  d => ({
    type: "import_statement",
    file: d[2].value,
    start: tokenStart(d[0]),
    end: tokenEnd(d[2])
  })
%}

namespace_statement -> %namespace_kw __ %identifier {%
  d => ({
    type: "namespace_statement",
    namespace: d[2].value,
    start: tokenStart(d[0]),
    end: tokenEnd(d[2])
  })
%}

fun_modifier -> null {% () => false %}
  | %overriding_kw __ {% () => true %}

fun_definition -> annotation_list "define" __ identifier _ "as" _ fun_modifier "fun" _ "(" _ parameter_list _ ")" _ %define _ type_annotation _ code_block {%
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
%}

parameter_list_elements -> parameter_declaration {% d => [d[0]] %}
  | parameter_declaration _ml "," _ml parameter_list_elements {% d => [d[0], ...d[4]] %}

parameter_list -> _ml {% () => [] %} 
  | _ml parameter_list_elements _ml {% d => d[1] %}

parameter_declaration -> identifier {% id %}
  | identifier _ %define _ type_annotation {% d => ({ type: "typed_parameter", name: d[0], datatype: d[4].value }) %}

code_block -> "{" executable_statements "}" {%
  (d) => ({
    type: "code_block",
    statements: d[1],
    start: tokenStart(d[0]),
    end: tokenEnd(d[2])
  })
%}

executable_statements -> _ {% () => [] %} | _ "\n" executable_statements {% (d) => d[2] %} 
  | _ executable_statement _ %comment:? _ {% d => [d[1]] %}
  | _ executable_statement _ %comment:? _ "\n" executable_statements {%
    d => [d[1], ...d[6]]
  %}

executable_statement -> return_statement {% id %}
  |  var_declaration      {% id %}
  |  var_definition       {% id %}
  |  var_reassignment     {% id %}
  |  property_assignment  {% id %}
  |  call_statement       {% id %}
  |  line_comment         {% id %}
  |  indexed_assignment   {% id %}
  |  while_loop           {% id %}
  |  do_while_loop        {% id %}
  |  if_statement         {% id %}
  |  for_loop             {% id %}
  |  break_statement      {% id %}
  |  switch_statement     {% id %}
  |  try_catch            {% id %}
  |  throw_stmt           {% id %}
  |  fun_definition       {% id %}
  |  class_definition     {% id %}
  |  interface_definition {% id %}
  |  enum_def             {% id %}
  |  namespace_statement  {% id %}
  |  import_statement     {% id %}

return_statement -> "return" __ expression {%
  d => ({
    type: "return_statement",
    value: d[2],
    start: tokenStart(d[0]),
    end: d[2].end
  })
%} | "return" {%
  d => ({
    type: "return_statement",
    value: null,
    start: tokenStart(d[0]),
    end: tokenEnd(d[0])
  })
%}

break_statement -> "break" {% 
  d => ({ type: "break_statement", start: tokenStart(d[0]), end: tokenEnd(d[0]) })
%}

var_declaration -> identifier _ %define _ type_annotation {%
  d => ({
    type: "var_declaration",
    var_name: d[0],
    datatype: d[4].value,
    start: d[0].start,
    end: d[0].end
  })
%}

var_definition -> identifier _ %define _ type_annotation _ %assignment _ expression {%
  d => ({
    type: "var_definition",
    var_name: d[0],
    datatype: d[4].value,
    value: d[8],
    start: d[0].start,
    end: d[8].end
  })
%} | identifier _ %define _ type_annotation _ %assignment _ "as" _ "const" _ expression {%
  d => ({
    type: "var_definition",
    var_name: d[0],
    datatype: d[4].value,
    value: d[10],
    isConstant: true,
    start: d[0].start,
    end: d[10].end
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
%} | identifier _ %assignment _ "as" _ "const" _ expression {%
  d => ({
    type: "var_reassignment",
    var_name: d[0],
    value: d[8],
    isConstant: true,
    start: d[0].start,
    end: d[8].end
  })
%}

property_assignment -> expression _ml %dot _ identifier _ %assignment _ expression {%
  d => ({
    type: "property_assignment",
    subject: d[0],
    property: d[4].value,
    value: d[8],
    start: d[0].start,
    end: d[8].end
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
  | identifier %namespace_sep identifier _ "(" argument_list ")" {%
  d => ({
    type: "call_expression",
    namespace: d[0].value,
    fun_name: d[2],
    arguments: d[5],
    start: d[0].start,
    end: tokenEnd(d[6])
  })
%}
  | unary_expression _ml %dot _ identifier _ "(" argument_list ")" {%
  d => ({
    type: "method_call",
    subject: d[0],
    method: d[4].value,
    arguments: d[7],
    start: d[0].start,
    end: tokenEnd(d[8])
  })
%}

indexed_access -> unary_expression _ml "[" _ml expression _ml "]" {%
  d => ({
    type: "indexed_access",
    subject: d[0],
    index: d[4],
    start: d[0].start,
    end: tokenEnd(d[6])
  })
%}

indexed_assignment -> unary_expression _ "[" _ expression _ "]" _ %assignment _ expression {%
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
    type: "do_while_loop",
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

for_loop -> "foreach" _ "(" _ml var_declaration _ml "in" _ml expression _ml ")" _ml code_block {%
  d => ({
    type: "for_loop",
    loop_variable: d[4],
    iterable: d[8],
    body: d[12],
    start: tokenStart(d[0]),
    end: d[12].end
  })
%}
| "foreach" _ "(" _ml identifier _ml "in" _ml expression _ml ")" _ml code_block {%
  d => ({
    type: "for_loop",
    loop_variable: d[4],
    iterable: d[8],
    body: d[12],
    start: tokenStart(d[0]),
    end: d[12].end
  })
%}

argument_list_elements -> expression {% d => [d[0]] %}
| expression _ml "," _ml argument_list_elements {%
  d => [d[0], ...d[4]]
%}

argument_list -> _ml {% () => [] %}
| _ml argument_list_elements _ml {% d => d[1] %}

expression -> boolean_expression {% id %}
  | lambda_expression {% id %}
  | ternary {% id %}

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

additive_expression -> multiplicative_expression {% id %} | additive_expression _ [+-] _ multiplicative_expression {%
  d => ({
    type: "binary_operation",
    operator: convertToken(d[2]),
    left: d[0],
    right: d[4],
    start: d[0].start,
    end: d[4].end
  })
%}

multiplicative_expression -> unary_expression {% id %} | multiplicative_expression _ [*/%] _ unary_expression {%
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
| array_literal {% id %} | dictionary {% id %}
| property_access {% id %}
| new_expression {% id %}
| %fstring_literal {%
  d => ({
    type: "fstring",
    value: d[0].value,
    start: tokenStart(d[0]),
    end: tokenEnd(d[0])
  })
%}

| %this_kw {% d => ({ type: "this_reference", start: tokenStart(d[0]), end: tokenEnd(d[0]) }) %}
| %super_kw {% d => ({ type: "super_reference", start: tokenStart(d[0]), end: tokenEnd(d[0]) }) %}
| %null_kw {% d => ({ type: "null_literal", value: null, start: tokenStart(d[0]), end: tokenEnd(d[0]) }) %}
| switch_value_expr {% id %}
| indexed_access {% id %} | identifier {%
  d => ({
    type: "var_reference",
    var_name: d[0],
    start: d[0].start,
    end: d[0].end
  })
%}
| %minus _ unary_expression {%
  d => ({
    type: "unary_minus",
    expression: d[2],
    start: tokenStart(d[0]),
    end: d[2].end
  })
%}
| "(" expression ")" {%
  data => data[1]
%}
| namespace_property_access {% id %}

namespace_property_access -> identifier %namespace_sep identifier {%
  d => ({
    type: "namespace_property_access",
    namespace: d[0].value,
    property: d[2].value,
    start: d[0].start,
    end: d[2].end
  })
%}

property_access -> unary_expression _ml %dot _ identifier {%
  d => ({
    type: "property_access",
    subject: d[0],
    property: d[4].value,
    start: d[0].start,
    end: d[4].end
  })
%}

new_expression -> %new_kw _ identifier _ "(" argument_list ")" {%
  d => ({
    type: "new_expression",
    className: d[2].value,
    arguments: d[5],
    start: tokenStart(d[0]),
    end: tokenEnd(d[6])
  })
%}
  | %new_kw _ identifier %namespace_sep identifier _ "(" argument_list ")" {%
  d => ({
    type: "new_expression",
    className: d[2].value + "::" + d[4].value,
    arguments: d[7],
    start: tokenStart(d[0]),
    end: tokenEnd(d[8])
  })
%}

type_annotation -> %datatype {% d => ({ value: d[0].value }) %}
  | identifier {% d => ({ value: d[0].value }) %}
  | "lmd" _ "(" parameter_list ")" _ "->" _ type_annotation {% d => ({ value: "lambda" }) %}
  | "lmd" _ "(" parameter_list ")" {% d => ({ value: "lambda" }) %}

lambda_expression -> %lambda_kw _ "(" parameter_list ")" _ "->" _ expression {%
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
%} | %lambda_kw _ "(" parameter_list ")" _ code_block {%
  d => ({
    type: "anonymous_function",
    parameters: d[3],
    body: d[6],
    start: tokenStart(d[0]),
    end: d[6].end
  })
%}

array_literal -> "[" argument_list "]" {% d => ({ type: "array_literal", elements: d[1], start: tokenStart(d[0]), end: tokenEnd(d[2]) }) %}

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

# Switch Statement (fun cases)
switch_statement -> %switch_kw _ %from_kw _ "(" _ expression _ ")" _ %to_kw _ %fun _ "{" _ml switch_fun_cases _ml "}" {%
  d => ({
    type: "switch_fun",
    subject: d[6],
    cases: d[16],
    start: tokenStart(d[0]),
    end: tokenEnd(d[18])
  })
%}

switch_fun_cases -> switch_fun_case _ml switch_fun_cases {%
  d => [d[0], ...d[2]]
%} | switch_fun_default {%
  d => [d[0]]
%} | switch_fun_case {%
  d => [d[0]]
%} | switch_fun_case _ml switch_fun_default {%
  d => [d[0], d[2]]
%}

switch_fun_case -> %case_kw __ expression _ "->" _ expression {%
  d => ({
    type: "switch_case_expr",
    match: d[2],
    body: d[6]
  })
%} | %case_kw __ expression _ "as" _ %fun _ "(" _ ")" _ "->" _ "void" _ code_block {%
  d => ({
    type: "switch_case_block",
    match: d[2],
    body: d[16]
  })
%}

switch_fun_default -> %default_kw _ "->" _ expression {%
  d => ({
    type: "switch_default_expr",
    body: d[4]
  })
%} | %default_kw _ "as" _ %fun _ "(" _ ")" _ "->" _ "void" _ code_block {%
  d => ({
    type: "switch_default_block",
    body: d[14]
  })
%}

# Switch Value Expression
switch_value_expr -> %switch_kw _ %from_kw _ "(" _ expression _ ")" _ %to_kw _ %value_kw _ "{" _ml switch_val_cases _ml "}" {%
  d => ({
    type: "switch_value",
    subject: d[6],
    cases: d[16],
    start: tokenStart(d[0]),
    end: tokenEnd(d[18])
  })
%}

switch_val_cases -> switch_val_case _ml switch_val_cases {%
  d => [d[0], ...d[2]]
%} | switch_val_default {%
  d => [d[0]]
%} | switch_val_case {%
  d => [d[0]]
%} | switch_val_case _ml switch_val_default {%
  d => [d[0], d[2]]
%}

switch_val_case -> %case_kw __ expression _ "->" _ expression {%
  d => ({
    type: "switch_case_expr",
    match: d[2],
    body: d[6]
  })
%}

switch_val_default -> %default_kw _ "->" _ expression {%
  d => ({
    type: "switch_default_expr",
    body: d[4]
  })
%}

# Multilines
_ml -> multi_line_ws_char:*
multi_line_ws_char -> %ws | "\n"

# Whitespaces
__ -> %ws:+
_ -> %ws:*

dictionary -> "{" _ml dictionary_entries:? _ml "}" {%
    d => ({
        type: "dictionary",
        entries: d[2] ? d[2] : []
    })
%}

dictionary_entries ->
    dictionary_entry {% d => [d[0]] %}
  | dictionary_entries _ml "," _ml dictionary_entry {% d => [...d[0], d[4]] %}

dictionary_entry ->
    (%string_literal | identifier) _ml ":" _ml expression {%
        d => ({
            key: d[0][0].type === 'identifier' ? d[0][0].value : d[0][0].value,
            value: d[4]
        })
    %}

try_catch -> "try" _ml code_block _ml "catch" _ml "(" _ml identifier _ml ")" _ml code_block {%
    d => ({
        type: "try_catch",
        tryBlock: d[2],
        catchVar: d[8].value,
        catchBlock: d[12]
    })
%} | "try" _ml code_block _ml "catch" _ml "(" _ml identifier _ml ")" _ml code_block _ml "finally" _ml code_block {%
    d => ({
        type: "try_catch",
        tryBlock: d[2],
        catchVar: d[8].value,
        catchBlock: d[12],
        finallyBlock: d[16]
    })
%}

throw_stmt -> "throw" _ expression {%
    d => ({
        type: "throw",
        value: d[2]
    })
%}

ternary -> "evaluate" _ boolean_expression _ "?" _ expression _ ":" _ expression {%
    d => ({
        type: "ternary",
        condition: d[2],
        trueExpr: d[6],
        falseExpr: d[10]
    })
%}

enum_def -> "define" _ "enum" _ identifier _ml "{" _ml enum_values:? _ml "}" {%
    d => ({
        type: "enum_def",
        name: d[4].value,
        values: d[8] || []
    })
%}

enum_values ->
    identifier {% d => [d[0].value] %}
  | enum_values _ml "," _ml identifier {% d => [...d[0], d[4].value] %}
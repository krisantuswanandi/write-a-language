module.exports = grammar({
  name: "mongkee",
  rules: {
    program: $ => repeat($.statement),
    statement: $ => choice($.let_statement),
    let_statement: $ => seq(
      'let',
      $.identifier,
      '=',
      $.expression,
    ),
    expression: $ => $.integer_literal,
    identifier: () => /[a-zA-Z_]+/,
    integer_literal: () => /\d+/,
  }
});

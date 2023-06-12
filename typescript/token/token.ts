export const TOKEN = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",
  IDENT: "IDENT",
  INT: "INT",
  ASSIGN: "=",
  PLUS: "+",
  MINUS: "-",
  BANG: "!",
  ASTERISK: "*",
  SLASH: "/",
  LT: "<",
  GT: ">",
  EQUAL: "==",
  NOT_EQUAL: "!=",
  COMMA: ",",
  SEMICOLON: ";",
  COLON: ":",
  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",
  LBRACKET: "[",
  RBRACKET: "]",
  FUNCTION: "FUNCTION",
  LET: "LET",
  TRUE: "TRUE",
  FALSE: "FALSE",
  IF: "IF",
  ELSE: "ELSE",
  RETURN: "RETURN",
  STRING: "STRING",
} as const;

type TokenType = typeof TOKEN[keyof typeof TOKEN];

export type Token = {
  type: TokenType;
  literal: string;
};

const keywords = {
  fn: TOKEN.FUNCTION,
  let: TOKEN.LET,
  true: TOKEN.TRUE,
  false: TOKEN.FALSE,
  if: TOKEN.IF,
  else: TOKEN.ELSE,
  return: TOKEN.RETURN,
} as const;

function isKeyword(ident: string): ident is keyof typeof keywords {
  return Object.keys(keywords).includes(ident);
}

export function lookupIdent(ident: string) {
  if (isKeyword(ident)) {
    return keywords[ident];
  }
  return TOKEN.IDENT;
}

package token

type TokenType string

type Token struct {
	Type TokenType
	Literal string
}

const ILLEGAL = "ILLEGAL"
const EOF = "EOF"

const IDENT = "IDENT"
const INT = "INT"

const ASSIGN = "="
const PLUS = "+"
const MINUS = "-"
const BANG = "!"
const ASTERISK = "*"
const SLASH = "/"

const LT = "<"
const GT = ">"

const EQUAL = "=="
const NOT_EQUAL = "!="

const COMMA = ","
const SEMICOLON = ";"

const LPAREN = "("
const RPAREN = ")"
const LBRACE = "{"
const RBRACE = "}"
const LBRACKET = "["
const RBRACKET = "]"

const FUNCTION = "FUNCTION"
const LET = "LET"
const TRUE = "TRUE"
const FALSE = "FALSE"
const IF = "IF"
const ELSE = "ELSE"
const RETURN = "RETURN"
const STRING = "STRING"

var keywords = map[string]TokenType {
	"fn": FUNCTION,
	"let": LET,
	"true": TRUE,
	"false": FALSE,
	"if": IF,
	"else": ELSE,
	"return": RETURN,
}

func LookupIdent(ident string) TokenType {
	if tok, ok := keywords[ident]; ok {
		return tok
	}
	return IDENT
}

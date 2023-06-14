import { test, expect } from "bun:test";
import { TOKEN } from "../token/token.ts";
import { Lexer } from "./lexer.ts";

test("test next token", () => {
	const input = `let five = 5;
	let ten = 10;

	let add = fn(x, y) {
	x + y;
	};

	let result = add(five, ten);
	!-/*5;
	5 < 10 > 5;

	if (5 < 10) {
	return true;
	} else {
	return false;
	}

	10 == 10;
	10 != 9;
	"foobar"
	"foo bar"
	[1, 2];
	{"foo": "bar"};
	`;

	const tests = [
		{ type: TOKEN.LET, literal: "let" },
		{ type: TOKEN.IDENT, literal: "five" },
		{ type: TOKEN.ASSIGN, literal: "=" },
		{ type: TOKEN.INT, literal: "5" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.LET, literal: "let" },
		{ type: TOKEN.IDENT, literal: "ten" },
		{ type: TOKEN.ASSIGN, literal: "=" },
		{ type: TOKEN.INT, literal: "10" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.LET, literal: "let" },
		{ type: TOKEN.IDENT, literal: "add" },
		{ type: TOKEN.ASSIGN, literal: "=" },
		{ type: TOKEN.FUNCTION, literal: "fn" },
		{ type: TOKEN.LPAREN, literal: "(" },
		{ type: TOKEN.IDENT, literal: "x" },
		{ type: TOKEN.COMMA, literal: "," },
		{ type: TOKEN.IDENT, literal: "y" },
		{ type: TOKEN.RPAREN, literal: ")" },
		{ type: TOKEN.LBRACE, literal: "{" },
		{ type: TOKEN.IDENT, literal: "x" },
		{ type: TOKEN.PLUS, literal: "+" },
		{ type: TOKEN.IDENT, literal: "y" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.RBRACE, literal: "}" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.LET, literal: "let" },
		{ type: TOKEN.IDENT, literal: "result" },
		{ type: TOKEN.ASSIGN, literal: "=" },
		{ type: TOKEN.IDENT, literal: "add" },
		{ type: TOKEN.LPAREN, literal: "(" },
		{ type: TOKEN.IDENT, literal: "five" },
		{ type: TOKEN.COMMA, literal: "," },
		{ type: TOKEN.IDENT, literal: "ten" },
		{ type: TOKEN.RPAREN, literal: ")" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.BANG, literal: "!" },
		{ type: TOKEN.MINUS, literal: "-" },
		{ type: TOKEN.SLASH, literal: "/" },
		{ type: TOKEN.ASTERISK, literal: "*" },
		{ type: TOKEN.INT, literal: "5" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.INT, literal: "5" },
		{ type: TOKEN.LT, literal: "<" },
		{ type: TOKEN.INT, literal: "10" },
		{ type: TOKEN.GT, literal: ">" },
		{ type: TOKEN.INT, literal: "5" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.IF, literal: "if" },
		{ type: TOKEN.LPAREN, literal: "(" },
		{ type: TOKEN.INT, literal: "5" },
		{ type: TOKEN.LT, literal: "<" },
		{ type: TOKEN.INT, literal: "10" },
		{ type: TOKEN.RPAREN, literal: ")" },
		{ type: TOKEN.LBRACE, literal: "{" },
		{ type: TOKEN.RETURN, literal: "return" },
		{ type: TOKEN.TRUE, literal: "true" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.RBRACE, literal: "}" },
		{ type: TOKEN.ELSE, literal: "else" },
		{ type: TOKEN.LBRACE, literal: "{" },
		{ type: TOKEN.RETURN, literal: "return" },
		{ type: TOKEN.FALSE, literal: "false" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.RBRACE, literal: "}" },
		{ type: TOKEN.INT, literal: "10" },
		{ type: TOKEN.EQUAL, literal: "==" },
		{ type: TOKEN.INT, literal: "10" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.INT, literal: "10" },
		{ type: TOKEN.NOT_EQUAL, literal: "!=" },
		{ type: TOKEN.INT, literal: "9" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.STRING, literal: "foobar" },
		{ type: TOKEN.STRING, literal: "foo bar" },
		{ type: TOKEN.LBRACKET, literal: "[" },
		{ type: TOKEN.INT, literal: "1" },
		{ type: TOKEN.COMMA, literal: "," },
		{ type: TOKEN.INT, literal: "2" },
		{ type: TOKEN.RBRACKET, literal: "]" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.LBRACE, literal: "{" },
		{ type: TOKEN.STRING, literal: "foo" },
		{ type: TOKEN.COLON, literal: ":" },
		{ type: TOKEN.STRING, literal: "bar" },
		{ type: TOKEN.RBRACE, literal: "}" },
		{ type: TOKEN.SEMICOLON, literal: ";" },
		{ type: TOKEN.EOF, literal: "\0" },
	];

	const lexer = new Lexer(input);

	for (let i = 0; i < tests.length; i++) {
		const token = lexer.nextToken();
		expect(token).toEqual(tests[i]);
	}
})

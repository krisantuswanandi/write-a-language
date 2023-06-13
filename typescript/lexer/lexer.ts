import { TOKEN, Token, TokenType, lookupIdent } from "../token/token.ts"

export class Lexer {
	input = ""
	position = 0
	readPosition = 0
	ch = ""

	constructor(input: string) {
		this.input = input
		this.readChar()
	}

	nextToken() {
		this.skipWhitespace()

		let token: Token

		switch (this.ch) {
			case "(":
				token = this.createToken(TOKEN.LPAREN)
				break;
			case ")":
				token = this.createToken(TOKEN.RPAREN)
				break;
			case "{":
				token = this.createToken(TOKEN.LBRACE)
				break;
			case "}":
				token = this.createToken(TOKEN.RBRACE)
				break;
			case "[":
				token = this.createToken(TOKEN.LBRACKET)
				break;
			case "]":
				token = this.createToken(TOKEN.RBRACKET)
				break;
			case ":":
				token = this.createToken(TOKEN.COLON)
				break;
			case ";":
				token = this.createToken(TOKEN.SEMICOLON)
				break;
			case ",":
				token = this.createToken(TOKEN.COMMA)
				break;
			case "+":
				token = this.createToken(TOKEN.PLUS)
				break;
			case "-":
				token = this.createToken(TOKEN.MINUS)
				break;
			case "*":
				token = this.createToken(TOKEN.ASTERISK)
				break;
			case "/":
				token = this.createToken(TOKEN.SLASH)
				break;
			case "<":
				token = this.createToken(TOKEN.LT)
				break;
			case ">":
				token = this.createToken(TOKEN.GT)
				break;
			case "=":
				if (this.peekChar() === "=") {
					token = this.createToken(TOKEN.EQUAL, "==")
					this.readChar()
				} else {
					token = this.createToken(TOKEN.ASSIGN)
				}
				break;
			case "!":
				if (this.peekChar() === "=") {
					token = this.createToken(TOKEN.NOT_EQUAL, "!=")
					this.readChar()
				} else {
					token = this.createToken(TOKEN.BANG)
				}
				break;
			case "\"":
				token = this.createToken(TOKEN.STRING, this.readString())
				break;
			case "\0":
				token = this.createToken(TOKEN.EOF)
				break;
			default:
				let literal: string
				let type: TokenType

				if (this.isLetter(this.ch)) {
					literal = this.readIdentifier()
					type = lookupIdent(literal)
				} else if (this.isDigit(this.ch)){
					literal = this.readNumber()
					type = TOKEN.INT
				} else {
					literal = this.ch
					type = TOKEN.ILLEGAL
				}
				token = this.createToken(type, literal)
		}

		this.readChar()
		return token
	}

	readChar() {
		if (this.readPosition >= this.input.length) {
			this.ch = "\0"
		} else {
			this.ch = this.input[this.readPosition]
		}

		this.position = this.readPosition
		this.readPosition += 1
	}

	readIdentifier() {
		const position = this.position

		while (this.isLetter(this.ch)) {
			this.readChar()
		}

		return this.input.slice(position, this.position)
	}

	readNumber() {
		const position = this.position

		while (this.isDigit(this.ch)) {
			this.readChar()
		}

		return this.input.slice(position, this.position)
	}

	readString() {
		const position = this.position + 1

		this.readChar()
		while (this.ch !== "\0" && this.ch !== "\"") {
			this.readChar()
		}

		return this.input.slice(position, this.position)
	}

	peekChar() {
		if (this.readPosition >= this.input.length) {
			return "\0"
		} else {
			return this.input[this.readPosition]
		}
	}

	skipWhitespace() {
		const whitespaces = [" ", "\n", "\r", "\t"]
		while (whitespaces.includes(this.ch)) {
			this.readChar()
		}
	}

	createToken(type: TokenType, literal?: string): Token {
		return {
			type,
			literal: literal || this.ch
		}
	}

	isLetter(ch: string) {
		const a = "a".charCodeAt(0)
		const z = "z".charCodeAt(0)
		const A = "A".charCodeAt(0)
		const Z = "Z".charCodeAt(0)
		const chCode = ch.charCodeAt(0)

		return chCode >= a && chCode <= z || chCode >= A && chCode <= Z || ch === "-"
	}

	isDigit(ch: string) {
		const _0 = "0".charCodeAt(0)
		const _9 = "9".charCodeAt(0)
		const chCode = ch.charCodeAt(0)

		return chCode >= _0 && chCode <= _9
	}
}

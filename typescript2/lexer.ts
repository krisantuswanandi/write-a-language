export enum TokenType {
	Number = "Number",
	Identifier = "Identifier",
	Equals = "Equals",
	OpenParen = "OpenParen",
	CloseParen = "CloseParen",
	BinaryOperator = "BinaryOperator",
	Let = "Let",
	EOF = "EOF",
}

const KEYWORDS: Record<string, TokenType> = {
	"let": TokenType.Let,
}

export interface Token {
	value: string;
	type: TokenType;
}

function createToken(value = "", type: TokenType): Token {
	return { value, type }
}

function isLetter(ch: string) {
	const a = "a".charCodeAt(0)
	const z = "z".charCodeAt(0)
	const A = "A".charCodeAt(0)
	const Z = "Z".charCodeAt(0)
	const chCode = ch.charCodeAt(0)

	return chCode >= a && chCode <= z || chCode >= A && chCode <= Z || ch === "_"
}

function isDigit(ch: string) {
	const _0 = "0".charCodeAt(0)
	const _9 = "9".charCodeAt(0)
	const chCode = ch.charCodeAt(0)

	return chCode >= _0 && chCode <= _9
}

function isWhitespace(ch: string) {
	return ch === " " || ch === "\t" || ch === "\n" || ch === "\r"
}

export function tokenize(sourceCode: string): Token[] {
	const tokens: Token[] = []
	const src = sourceCode.split("")

	while (src.length > 0) {
		if (src[0] === "(") {
			tokens.push(createToken(src.shift(), TokenType.OpenParen))
		} else if (src[0] === ")") {
			tokens.push(createToken(src.shift(), TokenType.CloseParen))
		} else if (src[0] === "+" || src[0] === "-" || src[0] === "*" || src[0] === "/") {
			tokens.push(createToken(src.shift(), TokenType.BinaryOperator))
		} else if (src[0] === "=") {
			tokens.push(createToken(src.shift(), TokenType.Equals))
		} else {
			if (isDigit(src[0])) {
				let num = ""
				while (src.length > 0 && isDigit(src[0])) {
					num += src.shift()
				}
				tokens.push(createToken(num, TokenType.Number))
			} else if (isLetter(src[0])) {
				let ident = ""
				while (src.length > 0 && isLetter(src[0])) {
					ident += src.shift()
				}

				const keyword = KEYWORDS[ident]

				if (keyword) {
					tokens.push(createToken(ident, keyword))
				} else {
					tokens.push(createToken(ident, TokenType.Identifier))
				}
			} else if (isWhitespace(src[0])) {
				src.shift()
			} else {
				console.log("unrecognized character found in source: ", src[0])
				process.exit(0)
			}
		}
	}

	tokens.push(createToken("", TokenType.EOF))
	return tokens
}

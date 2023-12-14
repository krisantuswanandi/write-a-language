import { tokenize, Token, TokenType } from "./lexer"
import { NodeType, Stmt, Program, Expr, Identifier, NumericLiteral } from "./ast"

export class Parser {
	private tokens: Token[] = []

	private isEOF() {
		return this.tokens[0].type === TokenType.EOF
	}

	private nextToken() {
		return this.tokens.shift()
	}

	public produceAST(sourceCode: string): Program {
		this.tokens = tokenize(sourceCode)
		const program: Program = {
			kind: NodeType.Program,
			body: [],
		}

		while (!this.isEOF()) {
			program.body.push(this.parseStmt())
		}

		return program
	}

	private parseStmt(): Stmt {
		return this.parseExpr()
	}

	private parseExpr(): Expr {
		const token = this.nextToken()

		if (!token) {
			console.error("unexpected token during parsing: undefined")
			process.exit(1)
		}

		switch (token.type) {
			case TokenType.Identifier:
				return {
					kind: NodeType.Identifier,
					symbol: token.value,
				} as Identifier
			case TokenType.Number:
				return {
					kind: NodeType.NumericLiteral,
					value: parseFloat(token.value),
				} as NumericLiteral
			default:
				console.error("unexpected token during parsing: ", token)
				process.exit(1)
		}
	}
}

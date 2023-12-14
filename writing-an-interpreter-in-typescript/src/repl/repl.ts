import { TOKEN } from "../token/token.ts"
import { Lexer } from "../lexer/lexer.ts"

console.write(">> ");
for await (const line of console) {
	if (line === "exit") break

	const lexer = new Lexer(line)
	while (true) {
		const token = lexer.nextToken()
		console.log(`${token.type}: ${token.literal}`)

		if (token.type === TOKEN.EOF) break
	}

	console.write(">> ");
}

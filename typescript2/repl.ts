import { tokenize } from "./lexer"

console.write(">> ");
for await (const line of console) {
	if (line === "exit") break

	const tokens = tokenize(line)
	tokens.forEach((token) => {
		console.log(`${token.type}: ${token.value}`)
	})

	console.write(">> ");
}

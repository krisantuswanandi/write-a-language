import { Parser } from "./parser"

const parser = new Parser()

console.write(">> ");
for await (const line of console) {
	if (line === "exit") break

	const program = parser.produceAST(line)
	console.log(program)

	console.write(">> ");
}

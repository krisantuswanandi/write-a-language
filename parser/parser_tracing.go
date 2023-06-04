package parser

import "fmt"
import "strings"

var traceLevel int = 0
var traceEnabled bool = false

const traceIndentPlaceholder string = "  "

func indentLevel() string {
	return strings.Repeat(traceIndentPlaceholder, traceLevel-1)
}

func tracePrint(fs string) {
	if traceEnabled {
		fmt.Printf("%s%s\n", indentLevel(), fs)
	}
}

func incIndent() { traceLevel += 1 }
func decIndent() { traceLevel -= 1 }

func trace(msg string) string {
	incIndent()
	tracePrint(msg)
	return msg
}

func untrace(msg string) {
	decIndent()
}

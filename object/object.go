package object

import "bytes"
import "fmt"
import "strings"
import "mongkee/ast"

const INTEGER_OBJ = "INTEGER"
const BOOLEAN_OBJ = "BOOLEAN"
const NULL_OBJ = "NULL"
const RETURN_OBJ = "RETURN"
const ERROR_OBJ = "ERROR"
const FUNCTION_OBJ = "FUNCTION"

type ObjectType string

type Object interface {
	Type() ObjectType
	Inspect() string
}

type Integer struct {
	Value int64
}
func (i *Integer) Type() ObjectType { return INTEGER_OBJ }
func (i *Integer) Inspect() string { return fmt.Sprintf("%d", i.Value) }

type Boolean struct {
	Value bool
}
func (b *Boolean) Type() ObjectType { return BOOLEAN_OBJ }
func (b *Boolean) Inspect() string { return fmt.Sprintf("%t", b.Value) }

type Null struct {}
func (n *Null) Type() ObjectType { return NULL_OBJ }
func (n *Null) Inspect() string { return "null" }

type Return struct {
	Value Object
}
func (r *Return) Type() ObjectType { return RETURN_OBJ }
func (r *Return) Inspect() string { return r.Value.Inspect() }

type Error struct {
	Message string
}
func (e *Error) Type() ObjectType { return ERROR_OBJ }
func (e *Error) Inspect() string { return "ERROR: " + e.Message }

type Function struct {
	Parameters []*ast.Identifier
	Body *ast.BlockStatement
	Env *Environment
}
func (f *Function) Type() ObjectType { return FUNCTION_OBJ }
func (f *Function) Inspect() string {
	var out bytes.Buffer

	params := []string{}
	for _, p := range f.Parameters {
		params = append(params, p.String())
	}

	out.WriteString("fn")
	out.WriteString("(")
	out.WriteString(strings.Join(params, ", "))
	out.WriteString(") {\n")
	out.WriteString(f.Body.String())
	out.WriteString("\n}")
	
	return out.String()
}

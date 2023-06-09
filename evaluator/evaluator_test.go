package evaluator

import "testing"
import "mongkee/lexer"
import "mongkee/parser"
import "mongkee/object"

func TestEvalIntegerExpression(t *testing.T) {
	tests := []struct {
		input    string
		expected int64
	}{
		{"5", 5},
		{"10", 10},
		{"-5", -5},
		{"-10", -10},
		{"5 + 5 + 5 + 5 - 10", 10},
		{"2 * 2 * 2 * 2 * 2", 32},
		{"-50 + 100 + -50", 0},
		{"5 * 2 + 10", 20},
		{"5 + 2 * 10", 25},
		{"20 + 2 * -10", 0},
		{"50 / 2 * 2 + 10", 60},
		{"2 * (5 + 10)", 30},
		{"3 * 3 * 3 + 10", 37},
		{"3 * (3 * 3) + 10", 37},
		{"(5 + 10 * 2 + 15 / 3) * 2 + -10", 50},
	}

	for _, tt := range tests {
		evaluated := testEval(tt.input)
		testIntegerObject(t, evaluated, tt.expected)
	}
}

func TestEvalBooleanExpression(t *testing.T) {
	tests := []struct {
		input    string
		expected bool
	}{
		{"true", true},
		{"false", false},
		{"1 < 2", true},
		{"1 > 2", false},
		{"1 < 1", false},
		{"1 > 1", false},
		{"1 == 1", true},
		{"1 != 1", false},
		{"1 == 2", false},
		{"1 != 2", true},
		{"true == true", true},
		{"false == false", true},
		{"true == false", false},
		{"true != false", true},
		{"false != true", true},
		{"1 < 2 == true", true},
		{"1 < 2 == false", false},
		{"1 > 2 == true", false},
		{"1 > 2 == false", true},
		{`"foo" == "foo"`, true},
		{`"foo" == "bar"`, false},
		{`"foo" > "bar"`, true},
		{`"foo" < "bar"`, false},
	}

	for _, tt := range tests {
		evaluated := testEval(tt.input)
		testBooleanObject(t, evaluated, tt.expected)
	}
}

func TestBangOperator(t *testing.T) {
	tests := []struct {
		input    string
		expected bool
	}{
		{"!true", false},
		{"!false", true},
		{"!5", false},
		{`!"foobar"`, false},
		{"!!true", true},
		{"!!false", false},
		{"!!5", true},
		{`!!"foobar"`, true},
	}

	for _, tt := range tests {
		evaluated := testEval(tt.input)
		testBooleanObject(t, evaluated, tt.expected)
	}
}

func TestIfElseExpression(t *testing.T) {
	tests := []struct {
		input    string
		expected interface{}
	}{
		{"if (true) { 10 }", 10},
		{"if (false) { 10 }", nil},
		{"if (1) { 10 }", 10},
		{"if (1 < 2) { 10 }", 10},
		{"if (1 > 2) { 10 }", nil},
		{"if (1 > 2) { 10 } else { 20 }", 20},
		{"if (1 < 2) { 10 } else { 20 }", 10},
		{`if (true) { "foobar" }`, "foobar"},
		{`if ("foo") { "foobar" }`, "foobar"},
		{`if ("foo" < "bar") { "foobar" }`, nil},
	}

	for _, tt := range tests {
		evaluated := testEval(tt.input)
		switch v := tt.expected.(type) {
		case int:
			testIntegerObject(t, evaluated, int64(v))
		case string:
			testStringObject(t, evaluated, v)
		default:
			testNullObject(t, evaluated)
		}
	}
}

func TestReturnStatement(t *testing.T) {
	tests := []struct {
		input    string
		expected interface{}
	}{
		{"return 10;", 10},
		{"return 10; 9;", 10},
		{"return 2 * 5; 9;", 10},
		{"9; return 2 * 5; 9;", 10},
		{"if (1) { if (1) { return 10; } return 1; }", 10},
		{`return "foobar";`, "foobar"},
		{`return "foobar"; "foo";`, "foobar"},
		{`return "foo" + "bar"; "foo";`, "foobar"},
	}

	for _, tt := range tests {
		evaluated := testEval(tt.input)
		switch v := tt.expected.(type) {
		case int:
			testIntegerObject(t, evaluated, int64(v))
		case string:
			testStringObject(t, evaluated, v)
		default:
			testNullObject(t, evaluated)
		}
	}
}

func TestErrorHandling(t *testing.T) {
	tests := []struct {
		input           string
		expectedMessage string
	}{
		{
			"5 + true;",
			"type mismatch: INTEGER + BOOLEAN",
		},
		{
			"5 + true; 5;",
			"type mismatch: INTEGER + BOOLEAN",
		},
		{
			"-true",
			"unknown operator: -BOOLEAN",
		},
		{
			"true + false;",
			"unknown operator: BOOLEAN + BOOLEAN",
		},
		{
			"5; true + false; 5",
			"unknown operator: BOOLEAN + BOOLEAN",
		},
		{
			"if (10 > 1) { true + false; }",
			"unknown operator: BOOLEAN + BOOLEAN",
		},
		{
			"if (10 > 1) { if (10 > 1) { return true + false; } return 1; }",
			"unknown operator: BOOLEAN + BOOLEAN",
		},
		{
			"foobar",
			"identifier not found: foobar",
		},
		{
			`"Hello" - "World"`,
			"unknown operator: STRING - STRING",
		},
	}

	for _, tt := range tests {
		evaluated := testEval(tt.input)

		errObj, ok := evaluated.(*object.Error)
		if !ok {
			t.Errorf("no error object returned. got=%T", evaluated)
			continue
		}

		if errObj.Message != tt.expectedMessage {
			t.Errorf("wrong error message. got=%q", errObj.Message)
		}
	}
}

func TestLetStatements(t *testing.T) {
	tests := []struct {
		input    string
		expected int64
	}{
		{"let a = 5; a;", 5},
		{"let a = 5 * 5; a;", 25},
		{"let a = 5; let b = a; b;", 5},
		{"let a = 5; let b = a; let c = a + b + 5; c;", 15},
	}

	for _, tt := range tests {
		evaluated := testEval(tt.input)
		testIntegerObject(t, evaluated, tt.expected)
	}
}

func TestFunctionObject(t *testing.T) {
	input := "fn(x) { x + 2; };"

	evaluated := testEval(input)
	fn, ok := evaluated.(*object.Function)
	if !ok {
		t.Fatalf("object is not Function. got=%T", evaluated)
	}

	if len(fn.Parameters) != 1 {
		t.Fatalf("wrong parameters. got=%d", len(fn.Parameters))
	}

	if fn.Parameters[0].String() != "x" {
		t.Fatalf("parameter is not 'x'. got=%q", fn.Parameters[0])
	}

	expectedBody := "(x + 2)"

	if fn.Body.String() != expectedBody {
		t.Fatalf("wrong function body. got=%q", fn.Body.String())
	}
}

func TestFunctionApplication(t *testing.T) {
	tests := []struct {
		input    string
		expected int64
	}{
		{"let identity = fn(x) { x; }; identity(5);", 5},
		{"let identity = fn(x) { return x; }; identity(5);", 5},
		{"let double = fn(x) { x * 2; }; double(5);", 10},
		{"let add = fn(x, y) { x + y; }; add(5, 5);", 10},
		{"let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));", 20},
		{"fn(x) { x; }(5)", 5},
	}

	for _, tt := range tests {
		evaluated := testEval(tt.input)
		testIntegerObject(t, evaluated, tt.expected)
	}
}

func TestClosures(t *testing.T) {
	input := "let newAdder = fn(x) { fn(y) { x + y }; }; let addTwo = newAdder(2); addTwo(2);"

	evaluated := testEval(input)
	testIntegerObject(t, evaluated, 4)
}

func TestStringLiteral(t *testing.T) {
	input := `"Hello World!";`

	evaluated := testEval(input)
	testStringObject(t, evaluated, "Hello World!")
}

func TestStringConcatenation(t *testing.T) {
	input := `"Hello" + " " + "World!";`

	evaluated := testEval(input)
	str, ok := evaluated.(*object.String)

	if !ok {
		t.Fatalf("object is not string. got=%T", evaluated)
	}

	if str.Value != "Hello World!" {
		t.Fatalf("wrong string value. got=%q", str.Value)
	}
}

func testEval(input string) object.Object {
	l := lexer.New(input)
	p := parser.New(l)
	program := p.ParseProgram()
	env := object.NewEnvironment()

	return Eval(program, env)
}

func testIntegerObject(t *testing.T, obj object.Object, expected int64) bool {
	result, ok := obj.(*object.Integer)
	if !ok {
		t.Errorf("object is not Integer. got=%T", obj)
		return false
	}

	if result.Value != expected {
		t.Errorf("wrong integer value. got=%d", result.Value)
		return false
	}

	return true
}

func testBooleanObject(t *testing.T, obj object.Object, expected bool) bool {
	result, ok := obj.(*object.Boolean)
	if !ok {
		t.Errorf("object is not Boolean. got=%T", obj)
		return false
	}

	if result.Value != expected {
		t.Errorf("wrong boolean value. got=%t", result.Value)
		return false
	}

	return true
}

func testNullObject(t *testing.T, obj object.Object) bool {
	if obj != NULL {
		t.Errorf("object is not NULL. got=%T", obj)
		return false
	}
	return true
}

func testStringObject(t *testing.T, obj object.Object, expected string) bool {
	result, ok := obj.(*object.String)
	if !ok {
		t.Errorf("object is not String. got=%T", obj)
		return false
	}

	if result.Value != expected {
		t.Errorf("wrong string value. got=%s", result.Value)
		return false
	}

	return true
}

// bornocode.h - BornoCode, a Bangla-inspired programming language.
// All declarations live here; everything is implemented in bornocode.cpp.
#pragma once

#include <cmath>
#include <cstdio>
#include <functional>
#include <memory>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

// ======================================================================
// Errors
// ======================================================================
// Shared error / control-flow types for BornoCode.

// Any lexer, parser or runtime error. Carries the source line.
struct BornoError : public std::runtime_error {
    int line;
    BornoError(const std::string& msg, int line_) : std::runtime_error(msg), line(line_) {}
};

// Thrown by ber() to end the program cleanly.
struct ExitRequest {
    int code;
};

// ======================================================================
// Runtime values
// ======================================================================
// Runtime value used by the BornoCode interpreter.

struct Value {
    enum class Type { Nil, Number, String, Bool };

    Type type = Type::Nil;
    double num = 0.0;
    std::string str;
    bool flag = false;

    static Value makeNil() { return Value(); }
    static Value makeNum(double n) { Value v; v.type = Type::Number; v.num = n; return v; }
    static Value makeStr(const std::string& s) { Value v; v.type = Type::String; v.str = s; return v; }
    static Value makeBool(bool b) { Value v; v.type = Type::Bool; v.flag = b; return v; }

    bool isNil() const { return type == Type::Nil; }
    bool isNum() const { return type == Type::Number; }
    bool isStr() const { return type == Type::String; }
    bool isBool() const { return type == Type::Bool; }

    bool truthy() const {
        switch (type) {
            case Type::Nil:    return false;
            case Type::Number: return num != 0.0;
            case Type::String: return !str.empty();
            case Type::Bool:   return flag;
        }
        return false;
    }

    const char* typeName() const {
        switch (type) {
            case Type::Nil:    return "nil";
            case Type::Number: return "number";
            case Type::String: return "string";
            case Type::Bool:   return "bool";
        }
        return "unknown";
    }

    static std::string formatNumber(double n) {
        if (std::isnan(n)) return "nan";
        if (std::isinf(n)) return n < 0 ? "-inf" : "inf";
        char buf[64];
        if (n == std::floor(n) && std::fabs(n) < 1e15) {
            std::snprintf(buf, sizeof buf, "%.0f", n);
            if (std::string(buf) == "-0") return "0";
        } else {
            std::snprintf(buf, sizeof buf, "%.10g", n);
        }
        return buf;
    }

    std::string toString() const {
        switch (type) {
            case Type::Nil:    return "nil";
            case Type::Number: return formatNumber(num);
            case Type::String: return str;
            case Type::Bool:   return flag ? "sotti" : "mittha";
        }
        return "";
    }
};

// ======================================================================
// Lexer (text -> tokens)
// ======================================================================
// Phase 1: turns source text into tokens.

enum class TokenKind {
    Number, String, Identifier,
    KwIf, KwElse, KwWhile, KwTrue, KwFalse,   // jodi nahole jotokhon sotti mittha
    LParen, RParen, LBrace, RBrace, Comma, Semicolon,
    Assign, Plus, Minus, Star, Slash, Percent,
    EqEq, NotEq, Less, LessEq, Greater, GreaterEq,
    AndAnd, OrOr, Bang,
    End
};

struct Token {
    TokenKind type = TokenKind::End;
    std::string text;      // lexeme (string literals hold the decoded contents)
    double number = 0.0;   // value for Number tokens
    int line = 1;
};

class Lexer {
public:
    explicit Lexer(std::string source);
    std::vector<Token> tokenize();

private:
    std::string src_;
    size_t pos_ = 0;
    int line_ = 1;

    bool atEnd() const;
    char peek(size_t offset = 0) const;
    char advance();
    bool match(char expected);
    void skipSpaceAndComments();
    Token make(TokenKind type, const std::string& text) const;
    Token readNumber();
    Token readString(char quote);
    Token readIdentifier();
};

// ======================================================================
// AST
// ======================================================================
// Phase 2 output: the abstract syntax tree.

struct Expr;
using ExprPtr = std::unique_ptr<Expr>;

struct Expr {
    enum class Kind { Number, String, Bool, Variable, Unary, Binary, Call };

    Kind kind;
    int line;
    double number = 0.0;                 // Number
    bool flag = false;                   // Bool
    std::string text;                    // String value / variable name / operator / function name
    std::vector<ExprPtr> children;       // Unary: 1 operand, Binary: 2 operands, Call: arguments

    Expr(Kind k, int ln) : kind(k), line(ln) {}
};

struct Stmt;
using StmtPtr = std::unique_ptr<Stmt>;

struct Stmt {
    enum class Kind { ExprStmt, Assign, If, While, Block };

    Kind kind;
    int line;
    std::string name;                    // Assign: variable name
    ExprPtr expr;                        // ExprStmt / Assign value / If & While condition
    std::vector<StmtPtr> body;           // Block statements
    StmtPtr thenBranch;                  // If: then-part, While: loop body
    StmtPtr elseBranch;                  // If: optional else-part

    Stmt(Kind k, int ln) : kind(k), line(ln) {}
};

using Program = std::vector<StmtPtr>;

// ======================================================================
// Parser (tokens -> AST)
// ======================================================================
// Phase 2: recursive-descent parser (tokens -> AST).
//
// Grammar
//   program    -> statement* END
//   statement  -> block | ifStmt | whileStmt | assignment | exprStmt
//   block      -> "{" statement* "}"
//   ifStmt     -> "jodi" "(" expr ")" statement ( "nahole" statement )?
//   whileStmt  -> "jotokhon" "(" expr ")" statement
//   assignment -> IDENT "=" expr ";"
//   exprStmt   -> expr ";"
//   expr       -> or
//   or         -> and ( "||" and )*
//   and        -> equality ( "&&" equality )*
//   equality   -> comparison ( ("==" | "!=") comparison )*
//   comparison -> term ( ("<" | "<=" | ">" | ">=") term )*
//   term       -> factor ( ("+" | "-") factor )*
//   factor     -> unary ( ("*" | "/" | "%") unary )*
//   unary      -> ("!" | "-") unary | call
//   call       -> IDENT "(" ( expr ("," expr)* )? ")" | primary
//   primary    -> NUMBER | STRING | "sotti" | "mittha" | IDENT | "(" expr ")"


class Parser {
public:
    explicit Parser(std::vector<Token> tokens);
    Program parseProgram();

private:
    std::vector<Token> toks_;
    size_t cur_ = 0;

    const Token& peek(size_t offset = 0) const;
    const Token& advance();
    bool check(TokenKind t) const;
    bool match(TokenKind t);
    const Token& expect(TokenKind t, const std::string& what);
    void expectSemicolon();

    StmtPtr statement();
    StmtPtr block();
    StmtPtr ifStatement();
    StmtPtr whileStatement();
    StmtPtr assignment();
    StmtPtr expressionStatement();

    ExprPtr expression();
    ExprPtr logicOr();
    ExprPtr logicAnd();
    ExprPtr equality();
    ExprPtr comparison();
    ExprPtr term();
    ExprPtr factor();
    ExprPtr unary();
    ExprPtr call();
    ExprPtr primary();

    static ExprPtr binary(const Token& op, ExprPtr left, ExprPtr right);
};

// ======================================================================
// Interpreter (AST -> output)
// ======================================================================
// Phase 3: tree-walking evaluator.


class Interpreter {
public:
    // Runs a program. With echo = true (REPL), bare expression results are printed.
    void run(const Program& program, bool echo = false);

private:
    std::unordered_map<std::string, Value> vars_;

    void exec(const Stmt& s);
    Value eval(const Expr& e);
    Value evalUnary(const Expr& e);
    Value evalBinary(const Expr& e);
    Value evalCall(const Expr& e);
};

// ======================================================================
// Built-in functions
// ======================================================================
// The BornoCode standard library: every function in the project's function table.


using BuiltinFn = std::function<Value(const std::vector<Value>&, int line)>;

struct Builtin {
    std::string name;         // BornoCode name, e.g. "jog"
    std::string english;      // standard function name, e.g. "sum"
    std::string description;  // short description (same as the table)
    int minArgs;
    int maxArgs;              // -1 = unlimited
    BuiltinFn fn;
};

const std::vector<Builtin>& allBuiltins();
const Builtin* findBuiltin(const std::string& name);   // case-insensitive, nullptr if missing
void resetTerminalColor();                              // undo any rong() colour

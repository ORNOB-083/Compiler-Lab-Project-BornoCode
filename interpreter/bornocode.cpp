// bornocode.cpp - implementation of BornoCode (lexer, parser, interpreter, built-ins, main).
// Build:  g++ -std=c++17 -O2 bornocode.cpp -o bornocode
// Run:    ./bornocode program.bc     (or ./bornocode for the interactive shell)
#include "bornocode.h"

#include <algorithm>
#include <cctype>
#include <cstdlib>
#include <ctime>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <map>
#include <random>
#include <sstream>
#include <utility>

#ifdef _WIN32
#define NOMINMAX
#include <windows.h>
#endif

// ======================================================================
// Lexer
// ======================================================================
namespace {
bool isDigit(char c) { return c >= '0' && c <= '9'; }
bool isAlpha(char c) { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_'; }
bool isAlnum(char c) { return isAlpha(c) || isDigit(c); }
}  // namespace

Lexer::Lexer(std::string source) : src_(std::move(source)) {}

bool Lexer::atEnd() const { return pos_ >= src_.size(); }

char Lexer::peek(size_t offset) const {
    return (pos_ + offset < src_.size()) ? src_[pos_ + offset] : '\0';
}

char Lexer::advance() {
    char c = src_[pos_++];
    if (c == '\n') ++line_;
    return c;
}

bool Lexer::match(char expected) {
    if (atEnd() || src_[pos_] != expected) return false;
    advance();
    return true;
}

Token Lexer::make(TokenType type, const std::string& text) const {
    Token t;
    t.type = type;
    t.text = text;
    t.line = line_;
    return t;
}

void Lexer::skipSpaceAndComments() {
    for (;;) {
        if (atEnd()) return;
        char c = peek();
        if (c == ' ' || c == '\t' || c == '\r' || c == '\n') {
            advance();
        } else if (c == '#' || (c == '/' && peek(1) == '/')) {
            while (!atEnd() && peek() != '\n') advance();          // line comment
        } else if (c == '/' && peek(1) == '*') {
            int startLine = line_;
            advance(); advance();
            bool closed = false;
            while (!atEnd()) {
                if (peek() == '*' && peek(1) == '/') { advance(); advance(); closed = true; break; }
                advance();
            }
            if (!closed) throw BornoError("Unterminated /* comment", startLine);
        } else {
            return;
        }
    }
}

Token Lexer::readNumber() {
    size_t start = pos_;
    while (isDigit(peek())) advance();
    if (peek() == '.' && isDigit(peek(1))) {
        advance();
        while (isDigit(peek())) advance();
    }
    std::string text = src_.substr(start, pos_ - start);
    Token t = make(TokenType::Number, text);
    t.number = std::strtod(text.c_str(), nullptr);
    return t;
}

Token Lexer::readString(char quote) {
    int startLine = line_;
    std::string value;
    for (;;) {
        if (atEnd()) throw BornoError("Unterminated string", startLine);
        char c = advance();
        if (c == quote) break;
        if (c == '\\') {
            if (atEnd()) throw BornoError("Unterminated string", startLine);
            char e = advance();
            switch (e) {
                case 'n': value += '\n'; break;
                case 't': value += '\t'; break;
                case 'r': value += '\r'; break;
                case '0': value += '\0'; break;
                case '\\': value += '\\'; break;
                case '"': value += '"'; break;
                case '\'': value += '\''; break;
                default: value += e; break;
            }
        } else {
            value += c;
        }
    }
    Token t = make(TokenType::String, value);
    t.line = startLine;
    return t;
}

Token Lexer::readIdentifier() {
    static const std::unordered_map<std::string, TokenType> keywords = {
        {"jodi", TokenType::KwIf},       {"nahole", TokenType::KwElse},
        {"jotokhon", TokenType::KwWhile}, {"sotti", TokenType::KwTrue},
        {"mittha", TokenType::KwFalse},
    };
    size_t start = pos_;
    while (isAlnum(peek())) advance();
    std::string text = src_.substr(start, pos_ - start);
    auto it = keywords.find(text);
    return make(it != keywords.end() ? it->second : TokenType::Identifier, text);
}

std::vector<Token> Lexer::tokenize() {
    std::vector<Token> out;
    for (;;) {
        skipSpaceAndComments();
        if (atEnd()) break;

        char c = peek();
        if (isDigit(c) || (c == '.' && isDigit(peek(1)))) { out.push_back(readNumber()); continue; }
        if (c == '"' || c == '\'')                         { advance(); out.push_back(readString(c)); continue; }
        if (isAlpha(c))                                    { out.push_back(readIdentifier()); continue; }

        advance();
        switch (c) {
            case '(': out.push_back(make(TokenType::LParen, "(")); break;
            case ')': out.push_back(make(TokenType::RParen, ")")); break;
            case '{': out.push_back(make(TokenType::LBrace, "{")); break;
            case '}': out.push_back(make(TokenType::RBrace, "}")); break;
            case ',': out.push_back(make(TokenType::Comma, ",")); break;
            case ';': out.push_back(make(TokenType::Semicolon, ";")); break;
            case '+': out.push_back(make(TokenType::Plus, "+")); break;
            case '-': out.push_back(make(TokenType::Minus, "-")); break;
            case '*': out.push_back(make(TokenType::Star, "*")); break;
            case '/': out.push_back(make(TokenType::Slash, "/")); break;
            case '%': out.push_back(make(TokenType::Percent, "%")); break;
            case '=': out.push_back(match('=') ? make(TokenType::EqEq, "==") : make(TokenType::Assign, "=")); break;
            case '!': out.push_back(match('=') ? make(TokenType::NotEq, "!=") : make(TokenType::Bang, "!")); break;
            case '<': out.push_back(match('=') ? make(TokenType::LessEq, "<=") : make(TokenType::Less, "<")); break;
            case '>': out.push_back(match('=') ? make(TokenType::GreaterEq, ">=") : make(TokenType::Greater, ">")); break;
            case '&':
                if (!match('&')) throw BornoError("Unexpected '&' (did you mean '&&'?)", line_);
                out.push_back(make(TokenType::AndAnd, "&&"));
                break;
            case '|':
                if (!match('|')) throw BornoError("Unexpected '|' (did you mean '||'?)", line_);
                out.push_back(make(TokenType::OrOr, "||"));
                break;
            default:
                throw BornoError(std::string("Unexpected character '") + c + "'", line_);
        }
    }
    out.push_back(make(TokenType::End, ""));
    return out;
}

// ======================================================================
// Parser
// ======================================================================
namespace {
std::string describe(const Token& t) {
    switch (t.type) {
        case TokenType::End:    return "end of file";
        case TokenType::String: return "\"" + t.text + "\"";
        default:                return "'" + t.text + "'";
    }
}
}  // namespace

Parser::Parser(std::vector<Token> tokens) : toks_(std::move(tokens)) {
    if (toks_.empty() || toks_.back().type != TokenType::End) {
        Token end;
        end.type = TokenType::End;
        end.line = toks_.empty() ? 1 : toks_.back().line;
        toks_.push_back(end);
    }
}

const Token& Parser::peek(size_t offset) const {
    size_t i = cur_ + offset;
    if (i >= toks_.size()) i = toks_.size() - 1;
    return toks_[i];
}

const Token& Parser::advance() {
    const Token& t = toks_[cur_];
    if (cur_ + 1 < toks_.size()) ++cur_;
    return t;
}

bool Parser::check(TokenType t) const { return peek().type == t; }

bool Parser::match(TokenType t) {
    if (!check(t)) return false;
    advance();
    return true;
}

const Token& Parser::expect(TokenType t, const std::string& what) {
    if (check(t)) return advance();
    throw BornoError("Expected " + what + ", found " + describe(peek()), peek().line);
}

void Parser::expectSemicolon() {
    if (match(TokenType::Semicolon)) return;
    // Report on the line where the statement ended, not the next one.
    int line = cur_ > 0 ? toks_[cur_ - 1].line : peek().line;
    throw BornoError("Expected ';' after statement, found " + describe(peek()), line);
}

// ---------- statements ----------

Program Parser::parseProgram() {
    Program program;
    while (!check(TokenType::End)) program.push_back(statement());
    return program;
}

StmtPtr Parser::statement() {
    if (check(TokenType::KwElse))
        throw BornoError("'nahole' without a matching 'jodi'", peek().line);
    if (check(TokenType::RBrace))
        throw BornoError("Unexpected '}'", peek().line);

    if (check(TokenType::LBrace))    return block();
    if (check(TokenType::KwIf))      return ifStatement();
    if (check(TokenType::KwWhile))   return whileStatement();
    if (check(TokenType::Identifier) && peek(1).type == TokenType::Assign) return assignment();
    return expressionStatement();
}

StmtPtr Parser::block() {
    int line = advance().line;  // '{'
    auto s = std::make_unique<Stmt>(Stmt::Kind::Block, line);
    while (!check(TokenType::RBrace)) {
        if (check(TokenType::End))
            throw BornoError("Missing '}' to close the block opened on line " + std::to_string(line), peek().line);
        s->body.push_back(statement());
    }
    advance();  // '}'
    return s;
}

StmtPtr Parser::ifStatement() {
    int line = advance().line;  // 'jodi'
    expect(TokenType::LParen, "'(' after 'jodi'");
    auto s = std::make_unique<Stmt>(Stmt::Kind::If, line);
    s->expr = expression();
    expect(TokenType::RParen, "')' after condition");
    s->thenBranch = statement();
    if (match(TokenType::KwElse)) s->elseBranch = statement();
    return s;
}

StmtPtr Parser::whileStatement() {
    int line = advance().line;  // 'jotokhon'
    expect(TokenType::LParen, "'(' after 'jotokhon'");
    auto s = std::make_unique<Stmt>(Stmt::Kind::While, line);
    s->expr = expression();
    expect(TokenType::RParen, "')' after condition");
    s->thenBranch = statement();
    return s;
}

StmtPtr Parser::assignment() {
    const Token& id = advance();
    advance();  // '='
    auto s = std::make_unique<Stmt>(Stmt::Kind::Assign, id.line);
    s->name = id.text;
    s->expr = expression();
    expectSemicolon();
    return s;
}

StmtPtr Parser::expressionStatement() {
    auto s = std::make_unique<Stmt>(Stmt::Kind::ExprStmt, peek().line);
    s->expr = expression();
    expectSemicolon();
    return s;
}

// ---------- expressions ----------

ExprPtr Parser::binary(const Token& op, ExprPtr left, ExprPtr right) {
    auto e = std::make_unique<Expr>(Expr::Kind::Binary, op.line);
    e->text = op.text;
    e->children.push_back(std::move(left));
    e->children.push_back(std::move(right));
    return e;
}

ExprPtr Parser::expression() { return logicOr(); }

ExprPtr Parser::logicOr() {
    ExprPtr left = logicAnd();
    while (check(TokenType::OrOr)) {
        const Token& op = advance();
        ExprPtr right = logicAnd();
        left = binary(op, std::move(left), std::move(right));
    }
    return left;
}

ExprPtr Parser::logicAnd() {
    ExprPtr left = equality();
    while (check(TokenType::AndAnd)) {
        const Token& op = advance();
        ExprPtr right = equality();
        left = binary(op, std::move(left), std::move(right));
    }
    return left;
}

ExprPtr Parser::equality() {
    ExprPtr left = comparison();
    while (check(TokenType::EqEq) || check(TokenType::NotEq)) {
        const Token& op = advance();
        ExprPtr right = comparison();
        left = binary(op, std::move(left), std::move(right));
    }
    return left;
}

ExprPtr Parser::comparison() {
    ExprPtr left = term();
    while (check(TokenType::Less) || check(TokenType::LessEq) ||
           check(TokenType::Greater) || check(TokenType::GreaterEq)) {
        const Token& op = advance();
        ExprPtr right = term();
        left = binary(op, std::move(left), std::move(right));
    }
    return left;
}

ExprPtr Parser::term() {
    ExprPtr left = factor();
    while (check(TokenType::Plus) || check(TokenType::Minus)) {
        const Token& op = advance();
        ExprPtr right = factor();
        left = binary(op, std::move(left), std::move(right));
    }
    return left;
}

ExprPtr Parser::factor() {
    ExprPtr left = unary();
    while (check(TokenType::Star) || check(TokenType::Slash) || check(TokenType::Percent)) {
        const Token& op = advance();
        ExprPtr right = unary();
        left = binary(op, std::move(left), std::move(right));
    }
    return left;
}

ExprPtr Parser::unary() {
    if (check(TokenType::Bang) || check(TokenType::Minus)) {
        const Token& op = advance();
        auto e = std::make_unique<Expr>(Expr::Kind::Unary, op.line);
        e->text = op.text;
        e->children.push_back(unary());
        return e;
    }
    return call();
}

ExprPtr Parser::call() {
    if (check(TokenType::Identifier) && peek(1).type == TokenType::LParen) {
        const Token& name = advance();
        advance();  // '('
        auto e = std::make_unique<Expr>(Expr::Kind::Call, name.line);
        e->text = name.text;
        if (!check(TokenType::RParen)) {
            do {
                e->children.push_back(expression());
            } while (match(TokenType::Comma));
        }
        expect(TokenType::RParen, "')' after arguments");
        return e;
    }
    return primary();
}

ExprPtr Parser::primary() {
    const Token& t = peek();
    switch (t.type) {
        case TokenType::Number: {
            advance();
            auto e = std::make_unique<Expr>(Expr::Kind::Number, t.line);
            e->number = t.number;
            return e;
        }
        case TokenType::String: {
            advance();
            auto e = std::make_unique<Expr>(Expr::Kind::String, t.line);
            e->text = t.text;
            return e;
        }
        case TokenType::KwTrue:
        case TokenType::KwFalse: {
            advance();
            auto e = std::make_unique<Expr>(Expr::Kind::Bool, t.line);
            e->flag = (t.type == TokenType::KwTrue);
            return e;
        }
        case TokenType::Identifier: {
            advance();
            auto e = std::make_unique<Expr>(Expr::Kind::Variable, t.line);
            e->text = t.text;
            return e;
        }
        case TokenType::LParen: {
            advance();
            ExprPtr inner = expression();
            expect(TokenType::RParen, "')' to close the group");
            return inner;
        }
        default:
            throw BornoError("Expected an expression, found " + describe(t), t.line);
    }
}

// ======================================================================
// Interpreter
// ======================================================================
namespace {

bool valuesEqual(const Value& a, const Value& b) {
    if (a.type != b.type) return false;
    switch (a.type) {
        case Value::Type::Nil:    return true;
        case Value::Type::Number: return a.num == b.num;
        case Value::Type::String: return a.str == b.str;
        case Value::Type::Bool:   return a.flag == b.flag;
    }
    return false;
}

void needNumbers(const Value& l, const Value& r, const std::string& op, int line) {
    if (!l.isNum() || !r.isNum())
        throw BornoError("Operator '" + op + "' needs two numbers, got " + l.typeName() +
                         " and " + r.typeName(), line);
}

}  // namespace

void Interpreter::run(const Program& program, bool echo) {
    for (const auto& s : program) {
        if (echo && s->kind == Stmt::Kind::ExprStmt) {
            Value v = eval(*s->expr);
            if (!v.isNil()) std::cout << v.toString() << "\n";
        } else {
            exec(*s);
        }
    }
}

void Interpreter::exec(const Stmt& s) {
    switch (s.kind) {
        case Stmt::Kind::ExprStmt:
            eval(*s.expr);
            break;
        case Stmt::Kind::Assign:
            if (findBuiltin(s.name))
                throw BornoError("'" + s.name + "' is a built-in function and can't be used as a variable name", s.line);
            vars_[s.name] = eval(*s.expr);
            break;
        case Stmt::Kind::If:
            if (eval(*s.expr).truthy()) exec(*s.thenBranch);
            else if (s.elseBranch) exec(*s.elseBranch);
            break;
        case Stmt::Kind::While:
            while (eval(*s.expr).truthy()) exec(*s.thenBranch);
            break;
        case Stmt::Kind::Block:
            for (const auto& st : s.body) exec(*st);
            break;
    }
}

Value Interpreter::eval(const Expr& e) {
    switch (e.kind) {
        case Expr::Kind::Number: return Value::makeNum(e.number);
        case Expr::Kind::String: return Value::makeStr(e.text);
        case Expr::Kind::Bool:   return Value::makeBool(e.flag);
        case Expr::Kind::Variable: {
            auto it = vars_.find(e.text);
            if (it != vars_.end()) return it->second;
            std::string msg = "Undefined variable '" + e.text + "'";
            if (findBuiltin(e.text)) msg += " (did you mean " + e.text + "(...)?)";
            throw BornoError(msg, e.line);
        }
        case Expr::Kind::Unary:  return evalUnary(e);
        case Expr::Kind::Binary: return evalBinary(e);
        case Expr::Kind::Call:   return evalCall(e);
    }
    return Value::makeNil();
}

Value Interpreter::evalUnary(const Expr& e) {
    Value v = eval(*e.children[0]);
    if (e.text == "!") return Value::makeBool(!v.truthy());
    if (!v.isNum())
        throw BornoError(std::string("Unary '-' needs a number, got ") + v.typeName(), e.line);
    return Value::makeNum(-v.num);
}

Value Interpreter::evalBinary(const Expr& e) {
    const std::string& op = e.text;

    // Short-circuit operators evaluate the right side lazily.
    if (op == "&&") {
        if (!eval(*e.children[0]).truthy()) return Value::makeBool(false);
        return Value::makeBool(eval(*e.children[1]).truthy());
    }
    if (op == "||") {
        if (eval(*e.children[0]).truthy()) return Value::makeBool(true);
        return Value::makeBool(eval(*e.children[1]).truthy());
    }

    Value l = eval(*e.children[0]);
    Value r = eval(*e.children[1]);

    if (op == "==") return Value::makeBool(valuesEqual(l, r));
    if (op == "!=") return Value::makeBool(!valuesEqual(l, r));

    if (op == "+") {
        if (l.isStr() || r.isStr()) return Value::makeStr(l.toString() + r.toString());
        needNumbers(l, r, op, e.line);
        return Value::makeNum(l.num + r.num);
    }

    if (op == "<" || op == "<=" || op == ">" || op == ">=") {
        int cmp;
        if (l.isNum() && r.isNum())      cmp = (l.num < r.num) ? -1 : (l.num > r.num ? 1 : 0);
        else if (l.isStr() && r.isStr()) cmp = l.str.compare(r.str);
        else throw BornoError("Operator '" + op + "' needs two numbers or two strings, got " +
                              l.typeName() + " and " + r.typeName(), e.line);
        if (op == "<")  return Value::makeBool(cmp < 0);
        if (op == "<=") return Value::makeBool(cmp <= 0);
        if (op == ">")  return Value::makeBool(cmp > 0);
        return Value::makeBool(cmp >= 0);
    }

    needNumbers(l, r, op, e.line);
    if (op == "-") return Value::makeNum(l.num - r.num);
    if (op == "*") return Value::makeNum(l.num * r.num);
    if (op == "/") {
        if (r.num == 0) throw BornoError("Division by zero", e.line);
        return Value::makeNum(l.num / r.num);
    }
    if (op == "%") {
        if (r.num == 0) throw BornoError("Modulo by zero", e.line);
        return Value::makeNum(std::fmod(l.num, r.num));
    }
    throw BornoError("Unknown operator '" + op + "'", e.line);
}

Value Interpreter::evalCall(const Expr& e) {
    const Builtin* fn = findBuiltin(e.text);
    if (!fn) throw BornoError("Unknown function '" + e.text + "' (run with --functions to see all)", e.line);

    std::vector<Value> args;
    args.reserve(e.children.size());
    for (const auto& c : e.children) args.push_back(eval(*c));

    int n = static_cast<int>(args.size());
    if (n < fn->minArgs || (fn->maxArgs >= 0 && n > fn->maxArgs)) {
        std::string expected;
        if (fn->maxArgs < 0)                   expected = "at least " + std::to_string(fn->minArgs);
        else if (fn->minArgs == fn->maxArgs)   expected = std::to_string(fn->minArgs);
        else expected = std::to_string(fn->minArgs) + " to " + std::to_string(fn->maxArgs);
        throw BornoError(fn->name + "() takes " + expected + " argument(s), got " + std::to_string(n), e.line);
    }
    return fn->fn(args, e.line);
}

// ======================================================================
// Built-in functions
// ======================================================================
namespace {

using Args = const std::vector<Value>&;

// Unused parameters are normal here (many functions ignore `line`).
#define BARGS [[maybe_unused]] Args a, [[maybe_unused]] int line

[[noreturn]] void fail(int line, const std::string& msg) { throw BornoError(msg, line); }

double needNum(Args a, size_t i, const char* fn, int line) {
    if (!a[i].isNum())
        fail(line, std::string(fn) + "() expects a number for argument " + std::to_string(i + 1) +
                   ", got " + a[i].typeName());
    return a[i].num;
}

std::string lowerStr(std::string s) {
    for (char& c : s) c = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
    return s;
}

std::string upperStr(std::string s) {
    for (char& c : s) c = static_cast<char>(std::toupper(static_cast<unsigned char>(c)));
    return s;
}

// ---------- UTF-8 helpers (so Bangla / emoji count as one character) ----------

std::vector<std::string> utf8Chars(const std::string& s) {
    std::vector<std::string> out;
    size_t i = 0;
    while (i < s.size()) {
        unsigned char c = static_cast<unsigned char>(s[i]);
        size_t len = 1;
        if (c >= 0xF0) len = 4;
        else if (c >= 0xE0) len = 3;
        else if (c >= 0xC0) len = 2;
        len = std::min(len, s.size() - i);
        out.push_back(s.substr(i, len));
        i += len;
    }
    return out;
}

// ---------- random ----------

std::mt19937_64& rng() {
    static std::mt19937_64 gen{std::random_device{}()};
    return gen;
}

// ---------- date / time ----------

void localTime(std::time_t t, std::tm& out) {
#ifdef _WIN32
    localtime_s(&out, &t);
#else
    localtime_r(&t, &out);
#endif
}

std::string formatTime(const char* fmt, std::time_t t) {
    std::tm tmv{};
    localTime(t, tmv);
    char buf[64];
    std::strftime(buf, sizeof buf, fmt, &tmv);
    return buf;
}

// Parses "YYYY-MM-DD" into a time_t at local noon (noon avoids DST edge cases).
bool parseDate(const std::string& s, std::time_t& out) {
    int y, m, d;
    char extra;
    if (std::sscanf(s.c_str(), "%d-%d-%d%c", &y, &m, &d, &extra) != 3) return false;
    std::tm t{};
    t.tm_year = y - 1900;
    t.tm_mon = m - 1;
    t.tm_mday = d;
    t.tm_hour = 12;
    t.tm_isdst = -1;
    std::tm check = t;
    std::time_t r = std::mktime(&check);
    if (r == static_cast<std::time_t>(-1) || check.tm_year != t.tm_year ||
        check.tm_mon != t.tm_mon || check.tm_mday != t.tm_mday)
        return false;
    out = r;
    return true;
}

std::time_t needDate(Args a, size_t i, const char* fn, int line) {
    std::time_t t;
    if (!a[i].isStr() || !parseDate(a[i].str, t))
        fail(line, std::string(fn) + "() expects a date like \"2026-09-05\" for argument " +
                   std::to_string(i + 1));
    return t;
}

// ---------- terminal colour ----------

bool g_colorActive = false;

const char* colorCode(const std::string& name) {
    static const std::unordered_map<std::string, const char*> codes = {
        {"kalo", "\033[30m"},    {"black", "\033[30m"},
        {"lal", "\033[31m"},     {"red", "\033[31m"},
        {"sobuj", "\033[32m"},   {"green", "\033[32m"},
        {"holud", "\033[33m"},   {"yellow", "\033[33m"},
        {"nil", "\033[34m"},     {"blue", "\033[34m"},
        {"beguni", "\033[35m"},  {"magenta", "\033[35m"},
        {"firoja", "\033[36m"},  {"cyan", "\033[36m"},
        {"shada", "\033[37m"},   {"white", "\033[37m"},
        {"reset", "\033[0m"},    {"normal", "\033[0m"},
    };
    auto it = codes.find(lowerStr(name));
    return it == codes.end() ? nullptr : it->second;
}

// ---------- emoji ----------

const std::vector<std::pair<std::string, std::string>>& emojiTable() {
    static const std::vector<std::pair<std::string, std::string>> t = {
        {"hashi", "😄"}, {"smile", "😄"},   {"bhalobasha", "❤️"}, {"heart", "❤️"},
        {"tara", "⭐"},  {"star", "⭐"},    {"agun", "🔥"},        {"fire", "🔥"},
        {"rocket", "🚀"}, {"bhalo", "👍"},  {"thumbsup", "👍"},    {"phul", "🌸"},
        {"flower", "🌸"}, {"chand", "🌙"},  {"moon", "🌙"},        {"shurjo", "☀️"},
        {"sun", "☀️"},   {"party", "🎉"},   {"cool", "😎"},        {"kanna", "😢"},
        {"cry", "😢"},   {"cake", "🎂"},    {"bd", "🇧🇩"},
    };
    return t;
}

// ---------- persistent store for rakho() / tule() ----------

const char* STORE_FILE = "bornocode_store.txt";

std::string escapeField(const std::string& s) {
    std::string o;
    for (char c : s) {
        switch (c) {
            case '\\': o += "\\\\"; break;
            case '\n': o += "\\n"; break;
            case '\t': o += "\\t"; break;
            case '\r': o += "\\r"; break;
            default:   o += c;
        }
    }
    return o;
}

std::string unescapeField(const std::string& s) {
    std::string o;
    for (size_t i = 0; i < s.size(); ++i) {
        if (s[i] == '\\' && i + 1 < s.size()) {
            char n = s[++i];
            switch (n) {
                case 'n': o += '\n'; break;
                case 't': o += '\t'; break;
                case 'r': o += '\r'; break;
                default:  o += n;
            }
        } else {
            o += s[i];
        }
    }
    return o;
}

std::map<std::string, Value> loadStore() {
    std::map<std::string, Value> store;
    std::ifstream in(STORE_FILE);
    std::string line;
    while (std::getline(in, line)) {
        size_t t1 = line.find('\t');
        size_t t2 = (t1 == std::string::npos) ? t1 : line.find('\t', t1 + 1);
        if (t2 == std::string::npos || t2 != t1 + 2) continue;
        std::string key = unescapeField(line.substr(0, t1));
        char type = line[t1 + 1];
        std::string val = unescapeField(line.substr(t2 + 1));
        if (type == 'n')      store[key] = Value::makeNum(std::strtod(val.c_str(), nullptr));
        else if (type == 'b') store[key] = Value::makeBool(val == "1");
        else                  store[key] = Value::makeStr(val);
    }
    return store;
}

void saveStore(const std::map<std::string, Value>& store, int line) {
    std::ofstream out(STORE_FILE, std::ios::trunc);
    if (!out) fail(line, std::string("Could not write ") + STORE_FILE);
    for (const auto& kv : store) {
        char type = kv.second.isNum() ? 'n' : (kv.second.isBool() ? 'b' : 's');
        std::string val = kv.second.isBool() ? (kv.second.flag ? "1" : "0")
                          : kv.second.isNum() ? Value::formatNumber(kv.second.num)
                                              : kv.second.str;
        out << escapeField(kv.first) << '\t' << type << '\t' << escapeField(val) << '\n';
    }
}

// ---------- the function table ----------

std::vector<Builtin> makeBuiltins() {
    std::vector<Builtin> b;

    // ===== Math =====
    b.push_back({"jog", "sum", "Adds two numbers", 2, 2, [](BARGS) {
        return Value::makeNum(needNum(a, 0, "jog", line) + needNum(a, 1, "jog", line));
    }});
    b.push_back({"biyog", "sub", "Subtracts two numbers", 2, 2, [](BARGS) {
        return Value::makeNum(needNum(a, 0, "biyog", line) - needNum(a, 1, "biyog", line));
    }});
    b.push_back({"gun", "mul", "Multiplies two numbers", 2, 2, [](BARGS) {
        return Value::makeNum(needNum(a, 0, "gun", line) * needNum(a, 1, "gun", line));
    }});
    b.push_back({"vag", "div", "Divides two numbers", 2, 2, [](BARGS) {
        double x = needNum(a, 0, "vag", line), y = needNum(a, 1, "vag", line);
        if (y == 0) fail(line, "Division by zero in vag()");
        return Value::makeNum(x / y);
    }});
    b.push_back({"shokti", "pow", "Raises a number to a power", 2, 2, [](BARGS) {
        double r = std::pow(needNum(a, 0, "shokti", line), needNum(a, 1, "shokti", line));
        if (!std::isfinite(r)) fail(line, "shokti() result is not a finite number");
        return Value::makeNum(r);
    }});
    b.push_back({"mulmul", "sqrt", "Finds the square root", 1, 1, [](BARGS) {
        double x = needNum(a, 0, "mulmul", line);
        if (x < 0) fail(line, "mulmul() can't take the square root of a negative number");
        return Value::makeNum(std::sqrt(x));
    }});
    b.push_back({"vagsesh", "mod", "Finds the remainder", 2, 2, [](BARGS) {
        double x = needNum(a, 0, "vagsesh", line), y = needNum(a, 1, "vagsesh", line);
        if (y == 0) fail(line, "Modulo by zero in vagsesh()");
        return Value::makeNum(std::fmod(x, y));
    }});
    b.push_back({"nishchit", "abs", "Returns the absolute value", 1, 1, [](BARGS) {
        return Value::makeNum(std::fabs(needNum(a, 0, "nishchit", line)));
    }});
    // jorbhaggo()      -> real number in [0, 1)
    // jorbhaggo(n)     -> whole number in [0, n]
    // jorbhaggo(lo,hi) -> whole number in [lo, hi]
    b.push_back({"jorbhaggo", "rand", "Generates a random number", 0, 2, [](BARGS) {
        if (a.empty()) return Value::makeNum(std::uniform_real_distribution<double>(0.0, 1.0)(rng()));
        long long lo = 0, hi = 0;
        if (a.size() == 1) {
            hi = static_cast<long long>(std::floor(needNum(a, 0, "jorbhaggo", line)));
        } else {
            lo = static_cast<long long>(std::floor(needNum(a, 0, "jorbhaggo", line)));
            hi = static_cast<long long>(std::floor(needNum(a, 1, "jorbhaggo", line)));
        }
        if (lo > hi) std::swap(lo, hi);
        return Value::makeNum(static_cast<double>(std::uniform_int_distribution<long long>(lo, hi)(rng())));
    }});

    // ===== Strings =====
    b.push_back({"jukto", "concat", "Joins two strings together", 2, -1, [](BARGS) {
        std::string s;
        for (const auto& v : a) s += v.toString();
        return Value::makeStr(s);
    }});
    b.push_back({"doro", "len", "Finds the length of a string", 1, 1, [](BARGS) {
        return Value::makeNum(static_cast<double>(utf8Chars(a[0].toString()).size()));
    }});
    b.push_back({"boro", "upper", "Converts text to uppercase", 1, 1, [](BARGS) {
        return Value::makeStr(upperStr(a[0].toString()));
    }});
    b.push_back({"chhoto", "lower", "Converts text to lowercase", 1, 1, [](BARGS) {
        return Value::makeStr(lowerStr(a[0].toString()));
    }});
    b.push_back({"ulto", "reverse", "Reverses a string", 1, 1, [](BARGS) {
        auto chars = utf8Chars(a[0].toString());
        std::string s;
        for (auto it = chars.rbegin(); it != chars.rend(); ++it) s += *it;
        return Value::makeStr(s);
    }});

    // ===== Date & time (dates are "YYYY-MM-DD" strings) =====
    b.push_back({"ekhon", "now", "Gets the current time", 0, 0, [](BARGS) {
        return Value::makeStr(formatTime("%H:%M:%S", std::time(nullptr)));
    }});
    b.push_back({"tarikh", "date", "Gets the current date", 0, 0, [](BARGS) {
        return Value::makeStr(formatTime("%Y-%m-%d", std::time(nullptr)));
    }});
    b.push_back({"dinjukto", "addDays", "Adds days to a date", 2, 2, [](BARGS) {
        std::time_t base = needDate(a, 0, "dinjukto", line);
        double days = needNum(a, 1, "dinjukto", line);
        if (std::fabs(days) > 3650000) fail(line, "dinjukto() day count is too large");
        std::tm t{};
        localTime(base, t);
        t.tm_mday += static_cast<int>(std::llround(days));
        t.tm_hour = 12;
        t.tm_isdst = -1;
        std::time_t r = std::mktime(&t);
        if (r == static_cast<std::time_t>(-1)) fail(line, "dinjukto() produced an invalid date");
        return Value::makeStr(formatTime("%Y-%m-%d", r));
    }});
    // porthokko(d1, d2) -> number of days from d1 to d2 (negative if d2 is earlier)
    b.push_back({"porthokko", "diff", "Finds difference between two dates", 2, 2, [](BARGS) {
        std::time_t t1 = needDate(a, 0, "porthokko", line);
        std::time_t t2 = needDate(a, 1, "porthokko", line);
        return Value::makeNum(static_cast<double>(std::llround(std::difftime(t2, t1) / 86400.0)));
    }});

    // ===== Fun =====
    b.push_back({"nach", "dance", "Prints a dancing emoji", 0, 1, [](BARGS) {
        int times = a.empty() ? 2 : std::max(1, static_cast<int>(needNum(a, 0, "nach", line)));
        for (int i = 0; i < times; ++i) std::cout << "💃🕺";
        std::cout << "\n";
        return Value::makeNil();
    }});
    b.push_back({"hash", "laugh", "Prints a laughing message", 0, 1, [](BARGS) {
        int times = a.empty() ? 4 : std::max(1, static_cast<int>(needNum(a, 0, "hash", line)));
        std::cout << "😂";
        for (int i = 0; i < times; ++i) std::cout << " ha";
        std::cout << "!\n";
        return Value::makeNil();
    }});
    b.push_back({"gaan", "song", "Plays a short tune", 0, 1, [](BARGS) {
        std::cout << "\a\a";
        if (!a.empty()) std::cout << "🎵 Now playing: " << a[0].toString() << "\n";
        std::cout << "♪ ♫ ♪ ♫ ♬ ♪ ♫\n";
        return Value::makeNil();
    }});
    // rong("lal")        -> switches the terminal text colour
    // rong("lal", text)  -> returns text wrapped in that colour
    b.push_back({"rong", "color", "Changes text color", 1, 2, [](BARGS) {
        std::string name = a[0].toString();
        const char* code = colorCode(name);
        if (!code)
            fail(line, "Unknown colour '" + name + "'. Try: lal, sobuj, holud, nil, beguni, firoja, shada, kalo, reset");
        if (a.size() == 2) return Value::makeStr(std::string(code) + a[1].toString() + "\033[0m");
        std::cout << code << std::flush;
        g_colorActive = (lowerStr(name) != "reset" && lowerStr(name) != "normal");
        return Value::makeNil();
    }});
    b.push_back({"chinho", "emoji", "Inserts an emoji", 0, 1, [](BARGS) {
        const auto& table = emojiTable();
        if (a.empty())
            return Value::makeStr(table[std::uniform_int_distribution<size_t>(0, table.size() - 1)(rng())].second);
        std::string key = lowerStr(a[0].toString());
        for (const auto& kv : table)
            if (kv.first == key) return Value::makeStr(kv.second);
        return Value::makeStr("🙂");
    }});

    // ===== Input / output / control =====
    b.push_back({"dekhao", "print", "Displays output on screen", 0, -1, [](BARGS) {
        for (size_t i = 0; i < a.size(); ++i) {
            if (i) std::cout << ' ';
            std::cout << a[i].toString();
        }
        std::cout << "\n";
        return Value::makeNil();
    }});
    b.push_back({"nite", "input", "Takes input from the user", 0, 1, [](BARGS) {
        if (!a.empty()) std::cout << a[0].toString() << std::flush;
        std::string text;
        if (!std::getline(std::cin, text)) return Value::makeStr("");
        while (!text.empty() && (text.back() == '\r' || text.back() == ' ' || text.back() == '\t')) text.pop_back();
        size_t start = text.find_first_not_of(" \t");
        std::string trimmed = (start == std::string::npos) ? "" : text.substr(start);
        // Looks like a plain number? Return it as a number, otherwise as a string.
        if (!trimmed.empty() && trimmed.find_first_not_of("+-0123456789.eE") == std::string::npos) {
            char* end = nullptr;
            double d = std::strtod(trimmed.c_str(), &end);
            if (end && *end == '\0') return Value::makeNum(d);
        }
        return Value::makeStr(text);
    }});
    b.push_back({"ber", "exit", "Ends the running program", 0, 1, [](BARGS) -> Value {
        int code = a.empty() ? 0 : static_cast<int>(needNum(a, 0, "ber", line));
        throw ExitRequest{code};
    }});

    // ===== Storage (kept in bornocode_store.txt next to where you run the program) =====
    b.push_back({"rakho", "save", "Stores data to memory/file", 2, 2, [](BARGS) {
        if (a[1].isNil()) fail(line, "rakho() can't store a nil value");
        auto store = loadStore();
        store[a[0].toString()] = a[1];
        saveStore(store, line);
        return a[1];
    }});
    // tule(key) or tule(key, fallback)
    b.push_back({"tule", "load", "Retrieves stored data", 1, 2, [](BARGS) {
        auto store = loadStore();
        auto it = store.find(a[0].toString());
        if (it != store.end()) return it->second;
        return a.size() == 2 ? a[1] : Value::makeNil();
    }});

    return b;
}

}  // namespace

const std::vector<Builtin>& allBuiltins() {
    static const std::vector<Builtin> table = makeBuiltins();
    return table;
}

const Builtin* findBuiltin(const std::string& name) {
    static const std::unordered_map<std::string, const Builtin*> index = [] {
        std::unordered_map<std::string, const Builtin*> m;
        for (const auto& fn : allBuiltins()) m[lowerStr(fn.name)] = &fn;
        return m;
    }();
    auto it = index.find(lowerStr(name));
    return it == index.end() ? nullptr : it->second;
}

void resetTerminalColor() {
    if (g_colorActive) {
        std::cout << "\033[0m" << std::flush;
        g_colorActive = false;
    }
}

// ======================================================================
// Main: file runner + interactive shell
// ======================================================================
// BornoCode - a tiny Bangla-inspired programming language.
// Usage:  bornocode <file.bc>   run a program
//         bornocode             start the interactive shell
//         bornocode --functions print the function table



static const char* VERSION = "1.0.0";

// Make emoji and colours work on the Windows console.
static void setupConsole() {
#ifdef _WIN32
    SetConsoleOutputCP(CP_UTF8);
    SetConsoleCP(CP_UTF8);
    HANDLE h = GetStdHandle(STD_OUTPUT_HANDLE);
    DWORD mode = 0;
    if (h != INVALID_HANDLE_VALUE && GetConsoleMode(h, &mode))
        SetConsoleMode(h, mode | 0x0004);  // ENABLE_VIRTUAL_TERMINAL_PROCESSING
#endif
}

static void printUsage() {
    std::cout <<
        "BornoCode " << VERSION << " - a Bangla-inspired programming language\n"
        "\n"
        "Usage:\n"
        "  bornocode <file.bc>     run a program\n"
        "  bornocode               start the interactive shell\n"
        "  bornocode --functions   list all built-in functions\n"
        "  bornocode --help        show this help\n"
        "  bornocode --version     show the version\n";
}

static void printFunctions() {
    const auto& fns = allBuiltins();
    std::cout << std::left << std::setw(20) << "Standard Function"
              << std::setw(16) << "BornoCode" << "Description\n";
    std::cout << std::string(70, '-') << "\n";
    for (const auto& f : fns)
        std::cout << std::left << std::setw(20) << f.english
                  << std::setw(16) << f.name << f.description << "\n";
    std::cout << "\n" << fns.size() << " functions.\n";
}

static bool readFile(const std::string& path, std::string& out) {
    std::ifstream in(path, std::ios::binary);
    if (!in) return false;
    std::ostringstream ss;
    ss << in.rdbuf();
    out = ss.str();
    return true;
}

// Lex + parse + run. Returns 0 on success, 1 on a BornoCode error.
// ExitRequest (from ber()) is left for the caller to handle.
static int runSource(const std::string& source, Interpreter& interp, bool echo) {
    try {
        Lexer lexer(source);
        Parser parser(lexer.tokenize());
        Program program = parser.parseProgram();
        interp.run(program, echo);
        return 0;
    } catch (const BornoError& e) {
        resetTerminalColor();
        std::cout.flush();
        std::cerr << "BornoCode Error (line " << e.line << "): " << e.what() << "\n";
        return 1;
    }
}

static int runFile(const std::string& path) {
    std::string source;
    if (!readFile(path, source)) {
        std::cerr << "Cannot open file: " << path << "\n";
        return 1;
    }
    Interpreter interp;
    int status = 0;
    try {
        status = runSource(source, interp, false);
    } catch (const ExitRequest& x) {
        status = x.code;
    }
    resetTerminalColor();
    std::cout.flush();
    return status;
}

// Net change in '{' minus '}' on a line, ignoring braces inside strings.
static int braceDelta(const std::string& line) {
    int delta = 0;
    char quote = 0;
    for (size_t i = 0; i < line.size(); ++i) {
        char c = line[i];
        if (quote) {
            if (c == '\\') ++i;
            else if (c == quote) quote = 0;
        } else if (c == '"' || c == '\'') {
            quote = c;
        } else if (c == '{') {
            ++delta;
        } else if (c == '}') {
            --delta;
        }
    }
    return delta;
}

static std::string trim(const std::string& s) {
    size_t a = s.find_first_not_of(" \t\r\n");
    if (a == std::string::npos) return "";
    size_t b = s.find_last_not_of(" \t\r\n");
    return s.substr(a, b - a + 1);
}

static int repl() {
    std::cout << "BornoCode " << VERSION << " shell  (type 'exit' to quit, '.functions' for the list)\n";
    Interpreter interp;
    std::string buffer, line;
    int depth = 0;

    for (;;) {
        std::cout << (buffer.empty() ? "born> " : "  ... ") << std::flush;
        if (!std::getline(std::cin, line)) { std::cout << "\n"; break; }
        line = trim(line);

        if (buffer.empty()) {
            if (line.empty()) continue;
            if (line == "exit" || line == "quit" || line == ".exit") break;
            if (line == ".functions") { printFunctions(); continue; }
            if (line == ".help")      { printUsage(); continue; }
        }

        buffer += line + "\n";
        depth += braceDelta(line);
        if (depth > 0) continue;  // block still open: keep reading

        std::string t = trim(buffer);
        if (!t.empty() && t.back() != ';' && t.back() != '}') buffer = t + ";\n";  // forgive a missing ';'

        try {
            runSource(buffer, interp, true);
        } catch (const ExitRequest& x) {
            resetTerminalColor();
            return x.code;
        }
        buffer.clear();
        depth = 0;
    }
    resetTerminalColor();
    return 0;
}

int main(int argc, char** argv) {
    setupConsole();

    if (argc == 1) return repl();

    std::string arg = argv[1];
    if (arg == "-h" || arg == "--help")      { printUsage(); return 0; }
    if (arg == "-v" || arg == "--version")   { std::cout << "BornoCode " << VERSION << "\n"; return 0; }
    if (arg == "--functions")                { printFunctions(); return 0; }
    return runFile(arg);
}

// Game content. All programs/answers verified against the real interpreter.

export const GAMES = [
    {
        slug: "keyword-master",
        title: "Keyword Master",
        tagline: "Remember BornoCode's keywords and built-in functions.",
        icon: "keyboard",
        difficulty: "Easy",
        minutes: 5,
    },
    {
        slug: "guess-output",
        title: "Guess the Output",
        tagline: "Trace short programs and predict exactly what they print.",
        icon: "eye",
        difficulty: "Medium",
        minutes: 8,
    },
    {
        slug: "bug-hunter",
        title: "Bug Hunter",
        tagline: "Each program has one real bug. Find it before it finds you.",
        icon: "bug",
        difficulty: "Medium",
        minutes: 8,
    },
];

// ---------- Guess the Output ----------
// Verified outputs captured from interpreter/bin/bornocode.exe
export const OUTPUT_QUESTIONS = [
    {
        code: `a = 4;
b = 7;
dekhao(jog(a, b) * 2);
dekhao(vagsesh(jog(a, b), 3));`,
        options: ["22\n2", "11\n2", "22\n3", "14\n2"],
        answer: 0,
        explain: "jog(4,7)=11; 11*2=22 and 11%3=2. Arithmetic inside dekhao is evaluated first.",
    },
    {
        code: `x = 10;
y = x;
x = 20;
dekhao(x, y);`,
        options: ["20 20", "10 10", "20 10", "10 20"],
        answer: 2,
        explain: "y = x copies the *value* 10 at that moment. Changing x later doesn't change y.",
    },
    {
        code: `dekhao(boro("Bornocode"));
dekhao(doro("Bornocode"));
dekhao(ulto("Bornocode"));`,
        options: ["BORNOCODE\n9\nedoconroB", "BORNOCODE\n9\nedocnoroB", "bornocode\n9\nBORNOCODE", "BORNOCODE\n8\nedoconroB"],
        answer: 0,
        explain: "boro uppercases, doro counts 9 characters, ulto reverses to edoconroB.",
    },
    {
        code: `i = 1;
total = 0;
jotokhon (i <= 4) {
    total = jog(total, gun(i, i));
    i = jog(i, 1);
}
dekhao("total =", total);`,
        options: ["total = 10", "total = 14", "total = 30", "total = 24"],
        answer: 2,
        explain: "It sums i*i for i=1..4: 1+4+9+16 = 30.",
    },
    {
        code: `n = 9;
jodi (vagsesh(n, 2) == 0) {
    dekhao(n, "even");
} nahole {
    dekhao(n, "odd");
}`,
        options: ["9 even", "9 odd", "even", "Nothing prints"],
        answer: 1,
        explain: "9 % 2 = 1, not 0, so the nahole branch runs.",
    },
    {
        code: `dekhao(jukto("Born", "o", "Code"));
dekhao(nishchit(biyog(3, 10)));
dekhao(shokti(3, 3));`,
        options: ["BornoCode\n7\n27", "BornoCode\n-7\n27", "Born o Code\n7\n9", "BornoCode\n7\n9"],
        answer: 0,
        explain: "jukto joins without spaces; biyog(3,10) = -7 and nishchit(-7) = 7 (absolute value); shokti(3,3) = 27.",
    },
];

// ---------- Bug Hunter ----------
// error = the real interpreter message; fix = corrected snippet line(s)
export const BUG_QUESTIONS = [
    {
        code: `x = 5
dekhao(x);`,
        bug: "Missing semicolon",
        error: "Expected ';' after statement",
        fix: "Add ; after x = 5",
        explain: "Every statement must end with ;. Without it the parser reads dekhao as part of the same statement.",
        options: ["Missing semicolon after x = 5", "x is never used", "dekhao needs quotes", "Numbers can't be assigned"],
        answer: 0,
    },
    {
        code: `dekhao(total);`,
        bug: "Undefined variable",
        error: "Undefined variable 'total'",
        fix: "Assign total first, e.g. total = 0;",
        explain: "Variables must be assigned before use. There's no total anywhere in this program.",
        options: ["dekhao can't print variables", "total was never assigned", "Missing import", "total is a keyword"],
        answer: 1,
    },
    {
        code: `score = 50;
jodi score >= 40 {
    dekhao("pass");
}`,
        bug: "Missing parentheses",
        error: "Expected '(' after 'jodi'",
        fix: "Write jodi (score >= 40) { ... }",
        explain: "jodi and jotokhon require parentheses around the condition.",
        options: ["score should be a string", "jodi needs parentheses around the condition", "Missing semicolon after 50", "jodi can't compare numbers"],
        answer: 1,
    },
    {
        code: `dekhao("unclosed;`,
        bug: "Unterminated string",
        error: "Unterminated string",
        fix: "Close the quote: dekhao(\"unclosed\");",
        explain: "A string must end with the same quote it started with.",
        options: ["Missing semicolon", "Unterminated string — the quote is never closed", "dekhao needs two arguments", "Strings can't contain letters"],
        answer: 1,
    },
    {
        code: `i = 1;
jotokhon (i <= 3) {
    dekhao(i);
}`,
        bug: "Infinite loop",
        error: "(runs forever — Playground stops it after 5s)",
        fix: "Add i = jog(i, 1); inside the loop",
        explain: "i never changes, so i <= 3 stays true forever. The counter must be updated inside the block.",
        options: ["Missing semicolon", "jotokhon needs jotokhon back", "i is never updated — infinite loop", "dekhao is inside the loop"],
        answer: 2,
    },
    {
        code: `foo(1);`,
        bug: "Unknown function",
        error: "Unknown function 'foo'",
        fix: "Use a real built-in like dekhao(1); or jog(1, 2);",
        explain: "Only the 28 built-in functions exist — there are no user-defined functions yet. Run bornocode --functions to list them.",
        options: ["foo needs two arguments", "foo is a keyword", "Unknown function — foo doesn't exist", "Functions must be declared first"],
        answer: 2,
    },
];

// ---------- Keyword Master ----------
// Built from KEYWORDS + a selection of FUNCTIONS in lib/bornocode.js
export const KEYWORD_ROUNDS = [
    { kind: "keyword", prompt: "jodi", options: ["else", "while", "if", "true"], answer: 2, explain: "jodi means 'if' — run a block when a condition is true." },
    { kind: "keyword", prompt: "nahole", options: ["if", "while", "else", "false"], answer: 2, explain: "nahole means 'else'." },
    { kind: "keyword", prompt: "jotokhon", options: ["for", "while", "function", "repeat"], answer: 1, explain: "jotokhon is the while loop." },
    { kind: "keyword", prompt: "sotti", options: ["false", "true", "nil", "zero"], answer: 1, explain: "sotti = true; mittha = false." },
    { kind: "keyword", prompt: "mittha", options: ["true", "nil", "false", "empty"], answer: 2, explain: "mittha = false." },
    { kind: "function", prompt: "dekhao", options: ["read input", "print output", "exit program", "store data"], answer: 1, explain: "dekhao = print. It displays its arguments separated by spaces." },
    { kind: "function", prompt: "nite", options: ["print a prompt forever", "read one line of input", "generate random numbers", "write to a file"], answer: 1, explain: "nite reads a line from stdin (with an optional prompt)." },
    { kind: "function", prompt: "jog", options: ["subtract", "multiply", "add", "divide"], answer: 2, explain: "jog = sum/add." },
    { kind: "function", prompt: "gun", options: ["add", "multiply", "power", "divide"], answer: 1, explain: "gun = multiply." },
    { kind: "function", prompt: "vag", options: ["multiply", "divide", "modulo", "power"], answer: 1, explain: "vag = divide. vag(a,0) raises a division-by-zero error." },
    { kind: "function", prompt: "vagsesh", options: ["divide", "remainder/modulo", "percentage", "square root"], answer: 1, explain: "vagsesh = modulo — the remainder after division." },
    { kind: "function", prompt: "shokti", options: ["square root", "square", "power/exponent", "factorial"], answer: 2, explain: "shokti = pow: shokti(2,10) = 1024." },
    { kind: "function", prompt: "mulmul", options: ["multiply", "square", "square root", "cube"], answer: 2, explain: "mulmul = sqrt." },
    { kind: "function", prompt: "doro", options: ["open", "close", "length of a string", "reverse"], answer: 2, explain: "doro = len." },
    { kind: "function", prompt: "ulto", options: ["uppercase", "lowercase", "reverse a string", "join strings"], answer: 2, explain: "ulto = reverse." },
    { kind: "function", prompt: "jukto", options: ["split a string", "join/concat strings", "count words", "uppercase"], answer: 1, explain: "jukto = concat." },
    { kind: "function", prompt: "boro", options: ["big/uppercase", "small/lowercase", "bold", "reverse"], answer: 0, explain: "boro = upper (boro means 'big')." },
    { kind: "function", prompt: "chhoto", options: ["shorten", "lowercase", "count", "slice"], answer: 1, explain: "chhoto = lower (chhoto means 'small')." },
    { kind: "function", prompt: "ber", options: ["begin", "print", "exit/end program", "sleep"], answer: 2, explain: "ber = exit — ends the program with an optional code." },
];

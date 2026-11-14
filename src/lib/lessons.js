// Guided beginner lessons. Every code block uses only verified language
// features (see interpreter/LANGUAGE.md). "example" links open the matching
// program in the Playground via /playground?example=<id>.

export const MODULES = [
    { id: "start", title: "Getting started", blurb: "What BornoCode is and how to run a program." },
    { id: "core", title: "Core concepts", blurb: "Variables, operators, conditions and loops." },
    { id: "practice", title: "Putting it together", blurb: "Functions and a first real challenge." },
];

export const LESSONS = [
    {
        slug: "first-program",
        module: "start",
        title: "Your first program",
        minutes: 5,
        objectives: [
            "Understand what a program is",
            "Run a BornoCode program in the Playground",
            "Use dekhao() to print output",
            "Recognise statements, semicolons and comments",
        ],
        blocks: [
            {
                type: "p",
                text: "A program is a list of instructions that the computer follows from top to bottom. BornoCode programs are plain text — each instruction is called a **statement** and ends with a semicolon.",
            },
            {
                type: "code",
                title: "hello.bc",
                example: "hello",
                code: `// Your first BornoCode program
dekhao("Hello, BornoCode!");
dekhao("2 + 3 =", jog(2, 3));
nach();`,
            },
            {
                type: "list",
                items: [
                    "`dekhao(...)` prints its arguments to the screen, separated by spaces.",
                    "`jog(2, 3)` is the built-in **sum** function — it returns 5.",
                    "`nach()` prints a dancing emoji for fun.",
                    "`//` starts a comment — everything after it on the line is ignored.",
                ],
            },
            {
                type: "p",
                text: "Open the Playground, press **Run** (or Ctrl + Enter), and check the Output panel. Try changing the text inside the quotes and run it again.",
            },
            {
                type: "practice",
                text: "Change the greeting to your name and add one more `dekhao()` line that prints something you like.",
            },
        ],
        quiz: [
            {
                q: "What does `dekhao(\"hi\")` do?",
                options: ["Stores 'hi' in a variable", "Prints 'hi' to the screen", "Reads 'hi' from the user", "Ends the program"],
                answer: 1,
                explain: "dekhao is BornoCode's print function — it displays its arguments.",
            },
            {
                q: "How do you write a comment in BornoCode?",
                options: ["<!-- comment -->", "// comment", "REM comment", "* comment"],
                answer: 1,
                explain: "// starts a line comment. # and /* */ also work.",
            },
            {
                q: "What must every statement end with?",
                options: ["A period .", "A comma ,", "A semicolon ;", "Nothing"],
                answer: 2,
                explain: "Statements end with ; — it tells the interpreter the instruction is complete.",
            },
        ],
    },

    {
        slug: "variables",
        module: "core",
        title: "Variables and values",
        minutes: 6,
        objectives: [
            "Create variables with =",
            "Understand numbers, strings and booleans",
            "Reassign variables and use them in expressions",
        ],
        blocks: [
            {
                type: "p",
                text: "A **variable** is a named box that stores a value. You create one by assigning with `=` — no declaration keyword needed. BornoCode has three main value types: numbers, strings (text in quotes) and booleans (`sotti` = true, `mittha` = false).",
            },
            {
                type: "code",
                title: "variables.bc",
                example: "variables",
                code: `name = "Borno";
age = 5;
score = 91.5;
passed = sotti;

dekhao(name, "is", age, "years old");
dekhao("score:", score, "passed:", passed);`,
            },
            {
                type: "list",
                items: [
                    "Variables can hold numbers (`5`, `3.14`), strings (`\"hello\"`) or booleans (`sotti`, `mittha`).",
                    "Assign a new value any time: `age = jog(age, 1)` adds 1.",
                    "Using a variable before assigning it gives an **Undefined variable** error.",
                ],
            },
            {
                type: "p",
                text: "Variables make programs flexible — change one value and the whole program updates. Try editing `age` in the example and watch the output change.",
            },
            {
                type: "practice",
                text: "Create two variables, `price` and `quantity`, multiply them with `gun()`, and print the total with a label.",
            },
        ],
        quiz: [
            {
                q: "Which line creates a variable correctly?",
                options: ["var age = 5;", "age == 5;", "age = 5;", "let age 5;"],
                answer: 2,
                explain: "BornoCode uses plain = for assignment. == is for comparison.",
            },
            {
                q: "What type is `\"hello\"`?",
                options: ["Number", "String", "Bool", "Nil"],
                answer: 1,
                explain: "Text in quotes is a string.",
            },
            {
                q: "What is `mittha`?",
                options: ["The number 0", "A string", "The boolean false", "A keyword for loops"],
                answer: 2,
                explain: "sotti = true, mittha = false.",
            },
        ],
    },

    {
        slug: "operators",
        module: "core",
        title: "Operators and logic",
        minutes: 7,
        objectives: [
            "Use arithmetic, comparison and logic operators",
            "Predict operator precedence",
            "Combine operators with parentheses",
        ],
        blocks: [
            {
                type: "p",
                text: "Operators combine values into new values. Arithmetic works on numbers; comparisons produce `sotti` or `mittha`; `&&` (and), `||` (or) and `!` (not) combine conditions.",
            },
            {
                type: "code",
                title: "operators.bc",
                example: "operators",
                code: `a = 17;
b = 5;
dekhao("a + b =", a + b);
dekhao("a - b =", a - b);
dekhao("a * b =", a * b);
dekhao("a / b =", a / b);
dekhao("a % b =", a % b);
dekhao("(a + b) * 2 =", (a + b) * 2);
dekhao("a > b && b > 0:", a > b && b > 0);`,
            },
            {
                type: "list",
                items: [
                    "Precedence: `* / %` before `+ -`; comparisons before `&&` before `||`.",
                    "`=` assigns — `==` compares. `x = 5` stores; `x == 5` asks a question.",
                    "Parentheses override precedence: `(a + b) * 2` is not the same as `a + b * 2`.",
                    "Comparisons and logic return booleans you can store: `ok = a > b && b > 0`.",
                ],
            },
            {
                type: "practice",
                text: "Predict the output of `dekhao(2 + 3 * 4)` before running it. Then try `dekhao((2 + 3) * 4)`.",
            },
        ],
        quiz: [
            {
                q: "What does `dekhao(2 + 3 * 4)` print?",
                options: ["20", "14", "24", "9"],
                answer: 1,
                explain: "* binds tighter than +, so it's 2 + (3*4) = 14.",
            },
            {
                q: "Which operator checks equality?",
                options: ["=", "==", "===", "equals"],
                answer: 1,
                explain: "== compares values. A single = assigns.",
            },
            {
                q: "What does `sotti && mittha` evaluate to?",
                options: ["sotti", "mittha", "An error", "0"],
                answer: 1,
                explain: "&& is logical and: true && false = false.",
            },
        ],
    },

    {
        slug: "conditions",
        module: "core",
        title: "Conditions — jodi & nahole",
        minutes: 7,
        objectives: [
            "Make decisions with jodi/nahole",
            "Nest conditions for multiple branches",
            "Combine conditions with comparison and logic operators",
        ],
        blocks: [
            {
                type: "p",
                text: "Programs rarely run straight through — they need to **decide**. `jodi` (if) runs a block when its condition is true; `nahole` (else) runs a different block when it's false. Conditions are expressions that produce `sotti` or `mittha`.",
            },
            {
                type: "code",
                title: "conditions.bc",
                example: "conditions",
                code: `score = 72;

jodi (score >= 80) {
    dekhao("Grade: A");
} nahole {
    jodi (score >= 60) {
        dekhao("Grade: B");
    } nahole {
        dekhao("Grade: C");
    }
}`,
            },
            {
                type: "list",
                items: [
                    "`jodi` and `jotokhon` require parentheses around the condition: `jodi (x > 5) { ... }`.",
                    "There is no `else if` — put a `jodi` inside `nahole` to chain branches.",
                    "Blocks use `{ }`. `nahole` binds to the nearest `jodi`.",
                    "Any expression works as a condition: `jodi (score >= 60 && passed)`.",
                ],
            },
            {
                type: "practice",
                text: "Write a program that asks for a number with `nite()`, then prints \"positive\", \"negative\" or \"zero\" using jodi/nahole.",
            },
        ],
        quiz: [
            {
                q: "What does `nahole` mean?",
                options: ["Repeat forever", "Else — run when the condition is false", "Stop the program", "Define a function"],
                answer: 1,
                explain: "nahole is BornoCode's else.",
            },
            {
                q: "How do you write 'else if' in BornoCode?",
                options: ["Use the keyword nahole jodi", "Nest jodi inside nahole", "Use elif", "It's not possible"],
                answer: 1,
                explain: "Put a jodi statement inside the nahole block.",
            },
            {
                q: "What does this print? `jodi (5 > 3) { dekhao(\"yes\") }`",
                options: ["yes", "no", "Nothing — missing else", "An error"],
                answer: 0,
                explain: "5 > 3 is sotti, so the block runs.",
            },
        ],
    },

    {
        slug: "loops",
        module: "core",
        title: "Loops — jotokhon",
        minutes: 8,
        objectives: [
            "Repeat code with jotokhon",
            "Write a counter loop",
            "Understand why loops must end",
        ],
        blocks: [
            {
                type: "p",
                text: "`jotokhon` (while) repeats its block as long as the condition stays true. The classic pattern is a **counter**: start at 1, do work, add 1, and stop when the counter passes the limit.",
            },
            {
                type: "code",
                title: "loops.bc",
                example: "loops",
                code: `i = 1;
jotokhon (i <= 5) {
    dekhao(i);
    i = jog(i, 1);   // add 1 each round
}`,
            },
            {
                type: "list",
                items: [
                    "Trace it: i=1 prints 1, becomes 2; ... i=5 prints 5, becomes 6; 6 <= 5 is false — loop ends.",
                    "If the condition never becomes false, the loop runs forever — the Playground stops it after 5 seconds.",
                    "The update (`i = jog(i, 1)`) must be **inside** the block, or the loop never ends.",
                ],
            },
            {
                type: "code",
                title: "countdown.bc",
                code: `n = 3;
jotokhon (n > 0) {
    dekhao(n);
    n = biyog(n, 1);   // subtract 1
}
dekhao("Liftoff!");`,
            },
            {
                type: "practice",
                text: "Write a loop that prints the multiples of 2 from 2 to 20. Hint: keep a counter and use `gun(i, 2)`.",
            },
        ],
        quiz: [
            {
                q: "What does `jotokhon` mean?",
                options: ["If", "While / repeat", "For each", "Function"],
                answer: 1,
                explain: "jotokhon is BornoCode's while loop.",
            },
            {
                q: "In a counter loop, what makes it stop?",
                options: ["The block ends", "The condition becomes false", "dekhao finishes", "Nothing — it always stops"],
                answer: 1,
                explain: "The condition is checked before every round; when it's false the loop exits.",
            },
            {
                q: "What happens if you forget `i = jog(i, 1)` inside the loop?",
                options: ["Nothing changes", "The loop may never end", "The program crashes", "i resets to 0"],
                answer: 1,
                explain: "Without updating the counter the condition stays true forever.",
            },
        ],
    },

    {
        slug: "functions",
        module: "core",
        title: "Built-in functions",
        minutes: 8,
        objectives: [
            "Call built-in functions with arguments",
            "Use math, string and date functions",
            "Read input with nite() and end with ber()",
        ],
        blocks: [
            {
                type: "p",
                text: "BornoCode has **28 built-in functions** — ready-made tools for math, text, dates and fun. You can't write your own functions yet, but the built-ins cover a lot. Full list in the Docs.",
            },
            {
                type: "code",
                title: "builtins.bc",
                example: "strings",
                code: `name = "Bornocode";
dekhao("Upper   :", boro(name));
dekhao("Reversed:", ulto(name));
dekhao("Length  :", doro(name));
dekhao("Joined  :", jukto("Hello, ", name, "!"));
dekhao("sqrt144 :", mulmul(144));
dekhao("2^10    :", shokti(2, 10));`,
            },
            {
                type: "list",
                items: [
                    "Math: `jog` `biyog` `gun` `vag` `shokti` `mulmul` `vagsesh` `nishchit` `jorbhaggo`.",
                    "Strings: `jukto` (join) `doro` (length) `boro` `chhoto` `ulto`.",
                    "Dates: `ekhon()` `tarikh()` `dinjukto()` `porthokko()`.",
                    "I/O: `dekhao()` prints, `nite()` reads a line, `ber()` exits.",
                ],
            },
            {
                type: "code",
                title: "input.bc",
                example: "calculator",
                code: `name = nite("Your name: ");
dekhao("Hello", name, "!");
dekhao("Tomorrow is:", dinjukto(tarikh(), 1));`,
            },
            {
                type: "p",
                text: "`nite()` reads one line from the Standard Input box in the Playground — fill it in before pressing Run. If the input looks like a number you get a number back, otherwise a string.",
            },
        ],
        quiz: [
            {
                q: "Which function joins two strings?",
                options: ["doro", "jukto", "ulto", "boro"],
                answer: 1,
                explain: "jukto = concat. doro = length, ulto = reverse, boro = uppercase.",
            },
            {
                q: "What does `nite()` do?",
                options: ["Prints a prompt only", "Reads one line of input", "Ends the program", "Generates a random number"],
                answer: 1,
                explain: "nite reads a line from stdin and returns it as a number or string.",
            },
            {
                q: "Which function ends the program immediately?",
                options: ["dekhao", "nite", "ber", "tule"],
                answer: 2,
                explain: "ber() throws an exit request — the program stops with the given code.",
            },
        ],
    },

    {
        slug: "problem-solving",
        module: "practice",
        title: "Problem solving challenge",
        minutes: 10,
        objectives: [
            "Combine loops, conditions and functions",
            "Solve a small real problem",
            "Read error messages and debug",
        ],
        blocks: [
            {
                type: "p",
                text: "Real programs combine everything you've learned. Here's a classic: print numbers 1–15, but label multiples of 3 as \"tick\", multiples of 5 as \"toe\", and multiples of both as \"ticktoe\".",
            },
            {
                type: "code",
                title: "challenge.bc",
                example: "challenge",
                code: `i = 1;
jotokhon (i <= 15) {
    jodi (vagsesh(i, 15) == 0) {
        dekhao(i, "ticktoe");
    } nahole {
        jodi (vagsesh(i, 3) == 0) {
            dekhao(i, "tick");
        } nahole {
            jodi (vagsesh(i, 5) == 0) {
                dekhao(i, "toe");
            } nahole {
                dekhao(i);
            }
        }
    }
    i = jog(i, 1);
}`,
            },
            {
                type: "list",
                items: [
                    "The outer `jodi` checks the rarest case first (multiples of 15 = 3 AND 5).",
                    "`vagsesh(i, 3) == 0` asks: is i divisible by 3?",
                    "Nesting `jodi` inside `nahole` gives us if / else-if / else.",
                ],
            },
            {
                type: "p",
                text: "This pattern — loop + condition + function calls — is the skeleton of most beginner programs. You've now used every core feature of BornoCode.",
            },
            {
                type: "practice",
                text: "Change the range to 1–30 and add a rule: multiples of 7 print \"seven\". Run it and check the output carefully.",
            },
        ],
        quiz: [
            {
                q: "Why check multiples of 15 first?",
                options: ["15 is the biggest number", "It's the rarest case — checking it first avoids wrong labels", "Random order", "Because 15 comes first alphabetically"],
                answer: 1,
                explain: "A multiple of 15 is also a multiple of 3 and 5; check it first so it isn't labelled 'tick' or 'toe'.",
            },
            {
                q: "What does `vagsesh(i, 3) == 0` test?",
                options: ["i equals 3", "i is divisible by 3", "i is greater than 3", "3 divided by i"],
                answer: 1,
                explain: "vagsesh is modulo — remainder 0 means divisible.",
            },
            {
                q: "You've now learned: variables, operators, jodi/nahole, jotokhon, and built-ins. What's next?",
                options: ["Give up", "Explore the Docs reference and the Games section", "Learn Python instead", "Nothing — you're done forever"],
                answer: 1,
                explain: "The Docs have the full reference; Games let you practise what you learned.",
            },
        ],
    },
];

export function getLesson(slug) {
    return LESSONS.find((l) => l.slug === slug);
}

export function lessonsByModule(moduleId) {
    return LESSONS.filter((l) => l.module === moduleId);
}

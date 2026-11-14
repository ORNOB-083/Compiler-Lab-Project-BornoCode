// Starter programs for the Playground. Every one uses only features the interpreter supports.
// Use ?example=<id> in the URL to open one directly, e.g. /playground?example=loops

export const DEFAULT_EXAMPLE = "hello";

export const EXAMPLES = {
    hello: {
        title: "Hello World",
        code: `// Your first BornoCode program
dekhao("Hello, BornoCode!");
dekhao("2 + 3 =", jog(2, 3));
nach();
`,
    },

    variables: {
        title: "Variables and math",
        code: `// Variables and arithmetic
a = 12;
b = 5;
dekhao("a =", a);
dekhao("b =", b);
dekhao("a + b =", jog(a, b));
dekhao("a - b =", biyog(a, b));
dekhao("a * b =", gun(a, b));
dekhao("a / b =", vag(a, b));
dekhao("a % b =", vagsesh(a, b));
dekhao("a squared =", shokti(a, 2));
dekhao("sqrt(144) =", mulmul(144));
dekhao("a + b * 2 =", a + b * 2);
`,
    },

    conditions: {
        title: "Conditions (jodi / nahole)",
        code: `// jodi = if, nahole = else
score = 72;

jodi (score >= 80) {
    dekhao("Grade: A");
} nahole {
    jodi (score >= 60) {
        dekhao("Grade: B");
    } nahole {
        dekhao("Grade: C");
    }
}
`,
    },

    loops: {
        title: "Loops (jotokhon)",
        code: `// jotokhon = while. Print the table of 7
i = 1;
jotokhon (i <= 10) {
    dekhao("7 x", i, "=", gun(7, i));
    i = jog(i, 1);
}
`,
    },

    strings: {
        title: "Strings",
        code: `// String functions
name = "Bornocode";
dekhao("Original :", name);
dekhao("Upper    :", boro(name));
dekhao("Lower    :", chhoto(name));
dekhao("Reversed :", ulto(name));
dekhao("Length   :", doro(name));
dekhao("Joined   :", jukto("Hello, ", name, "!"));
`,
    },

    calculator: {
        title: "Calculator (uses input)",
        stdin: "12\n5\n",
        code: `// nite() reads from the Standard Input box under the editor.
// One value per line: the first line is the first number, and so on.
a = nite("First number : ");
b = nite("Second number: ");

dekhao("jog    (a + b):", jog(a, b));
dekhao("biyog  (a - b):", biyog(a, b));
dekhao("gun    (a * b):", gun(a, b));

jodi (b != 0) {
    dekhao("vag    (a / b):", vag(a, b));
} nahole {
    dekhao("Cannot divide by zero!");
}
`,
    },

    dates: {
        title: "Date and time",
        code: `// Dates are text like "2026-09-05"
dekhao("Time now  :", ekhon());
dekhao("Today     :", tarikh());
dekhao("In 30 days:", dinjukto(tarikh(), 30));
dekhao("Days from 2026-01-01 to 2026-09-05:", porthokko("2026-01-01", "2026-09-05"));
`,
    },

    fun: {
        title: "Fun functions",
        code: `// Emoji and fun
dekhao("Emoji:", chinho("agun"), chinho("rocket"), chinho("phul"));
nach();
hash();
gaan("Amar Sonar Bangla");
`,
    },

    error: {
        title: "Error example",
        code: `// This program has a mistake. Run it to see the error message.
x = 10;
dekhao("x is", x);
dekhao("y is", y);
`,
    },
};
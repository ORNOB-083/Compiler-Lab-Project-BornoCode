// Single source of truth for the website.
// Keywords and function names come from the real BornoCode interpreter (bornocode.cpp).

export const GITHUB_URL = "https://github.com/ORNOB-083"; // change to your repo URL

// Language keywords (from the lexer)
export const KEYWORDS = ["jodi", "nahole", "jotokhon", "sotti", "mittha"];

// All 28 built-in functions
export const FUNCTIONS = [
    { english: "sum", name: "jog", desc: "Adds two numbers" },
    { english: "sub", name: "biyog", desc: "Subtracts two numbers" },
    { english: "mul", name: "gun", desc: "Multiplies two numbers" },
    { english: "div", name: "vag", desc: "Divides two numbers" },
    { english: "pow", name: "shokti", desc: "Raises a number to a power" },
    { english: "sqrt", name: "mulmul", desc: "Finds the square root" },
    { english: "mod", name: "vagsesh", desc: "Finds the remainder" },
    { english: "abs", name: "nishchit", desc: "Returns the absolute value" },
    { english: "rand", name: "jorbhaggo", desc: "Generates a random number" },
    { english: "concat", name: "jukto", desc: "Joins two strings together" },
    { english: "len", name: "doro", desc: "Finds the length of a string" },
    { english: "upper", name: "boro", desc: "Converts text to uppercase" },
    { english: "lower", name: "chhoto", desc: "Converts text to lowercase" },
    { english: "reverse", name: "ulto", desc: "Reverses a string" },
    { english: "now", name: "ekhon", desc: "Gets the current time" },
    { english: "date", name: "tarikh", desc: "Gets the current date" },
    { english: "addDays", name: "dinjukto", desc: "Adds days to a date" },
    { english: "diff", name: "porthokko", desc: "Finds difference between two dates" },
    { english: "dance", name: "nach", desc: "Prints a dancing emoji" },
    { english: "laugh", name: "hash", desc: "Prints a laughing message" },
    { english: "song", name: "gaan", desc: "Plays a short tune" },
    { english: "color", name: "rong", desc: "Changes text color" },
    { english: "emoji", name: "chinho", desc: "Inserts an emoji" },
    { english: "print", name: "dekhao", desc: "Displays output on screen" },
    { english: "input", name: "nite", desc: "Takes input from the user" },
    { english: "exit", name: "ber", desc: "Ends the running program" },
    { english: "save", name: "rakho", desc: "Stores data to memory/file" },
    { english: "load", name: "tule", desc: "Retrieves stored data" },
];

const FUNCTION_NAMES = FUNCTIONS.map((f) => f.name);

// Sample program shown on the homepage
export const SAMPLE_FILE = "odd-even.bc";

export const SAMPLE_CODE = `// Odd or even?
i = 1;
jotokhon (i <= 5) {
    jodi (vagsesh(i, 2) == 0) {
        dekhao(i, "is even");
    } nahole {
        dekhao(i, "is odd");
    }
    i = jog(i, 1);
}`;

export const SAMPLE_OUTPUT = `1 is odd
2 is even
3 is odd
4 is even
5 is odd`;

// Tiny highlighter: splits one line into typed tokens.
export function tokenizeLine(line) {
    const re = /(\/\/[^\n]*|#[^\n]*|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|\d+(?:\.\d+)?|[A-Za-z_]\w*)/g;
    const out = [];
    let last = 0;
    let m;
    while ((m = re.exec(line)) !== null) {
        if (m.index > last) out.push({ text: line.slice(last, m.index), type: "plain" });
        const t = m[0];
        let type = "plain";
        if (t.startsWith("//") || t.startsWith("#")) type = "comment";
        else if (t[0] === '"' || t[0] === "'") type = "string";
        else if (/^\d/.test(t)) type = "number";
        else if (KEYWORDS.includes(t)) type = "keyword";
        else if (FUNCTION_NAMES.includes(t.toLowerCase())) type = "function";
        out.push({ text: t, type });
        last = m.index + t.length;
    }
    if (last < line.length) out.push({ text: line.slice(last), type: "plain" });
    return out;
}
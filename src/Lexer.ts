import { Token } from "./Token";

// some predicates...
const isDigit = (x: string) => x >= '0' && x <= '9';

const RESERVED_WORDS = [
    'False', 'await', 'else', 'import', 'pass', 'None', 'break',
    'except', 'in', 'raise', 'True', 'class', 'finally', 'is',
    'return', 'and', 'continue', 'for', 'lambda', 'try', 'as',
    'def', 'from', 'nonlocal', 'while', 'assert', 'del', 'global',
    'not', 'with', 'async', 'elif', 'if', 'or', 'yield'
];

const _expectIntegerLiteral = (input: string) => {
    if (!isDigit(input[0])) return null;
    // if the first char is '0', then it must be:
    // 1. one of bininteger/octinteger/hexinteger
    // 2. decimal integer 0.
    
    if (input[0] === '0') {
        if (input[1]) {
            switch (input[1]) {
                
            }
        }
    }
}


export const Lexer
: (input: string) => Token[]
= (input: string) => {
    let 
}

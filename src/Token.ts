export enum TokenType {
    PLAIN, NUMBER, STRING, IDENTIFIER, KEYWORD, COMMENT, EDITOR_PLACEHOLDER, SYMBOL, WHITESPACE
}

export enum TokenClass {
    // NUMBER
    INTEGER, FLOAT, COMPLEX,
    // STRING
    STRPART, ESCSEQ,

    // SYMBOL
    LPAR, RPAR, LSQB, RSQB, COLON, COMMA, SEMI, PLUS, MINUS, STAR, SLASH,
    VBAR, AMPER, LESS, GREATER, EQUAL, DOT, PERCENT, LBRACE, RBRACE, EQEQUAL,
    NOTEQUAL, LESSEQUAL, GREATEREQUAL, TILDE, CIRCUMFLEX, LEFTSHIFT,
    RIGHTSHIFT, DOUBLESTAR, PLUSEQUAL, MINEQUAL, STAREQUAL, SLASHEQUAL,
    PERCENTEQUAL, AMPEREQUAL, VBAREQUAL, CIRCUMFLEXEQUAL, LEFTSHIFTEQUAL,
    RIGHTSHIFTEQUAL, DOUBLESTAREQUAL, DOUBLESLASH, DOUBLESLASHEQUAL,
    AT, ATEQUAL, RARROW, ELLIPSIS,

    // WHITESPACE
    NEWLINE, INDENT, DEDENT, NL,

    // GENERAL
    NORMAL, ERROR
}

export interface Token {
    type: TokenType;
    class: TokenClass;
    start: number;
    end: number;
}

export
const _prettyPrint = (token: Token) => {
    return JSON.stringify({type: TokenType[token.type], class: TokenClass[token.class], start: token.start, end: token.end });
};

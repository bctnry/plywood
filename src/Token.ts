export enum TokenType {
    PLAIN, NUMBER, STRING, IDENTIFIER, KEYWORD, COMMENT, EDITOR_PLACEHOLDER
}

export enum TokenClass {
    // NUMBER
    INTEGER, FLOAT, COMPLEX
}

export interface Token {
    type: TokenType;
}

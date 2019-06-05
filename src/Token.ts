export enum TokenType {
    PLAIN, NUMBER, STRING, IDENTIFIER, KEYWORD, COMMENT, EDITOR_PLACEHOLDER
}

export interface Token {
    type: TokenType;
}

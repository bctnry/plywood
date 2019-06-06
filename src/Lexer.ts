import { Token, TokenType, TokenClass } from "./Token";

// some predicates...
const isDigit = (x: string) => x >= '0' && x <= '9';

const RESERVED_WORDS = [
    'False', 'await', 'else', 'import', 'pass', 'None', 'break',
    'except', 'in', 'raise', 'True', 'class', 'finally', 'is',
    'return', 'and', 'continue', 'for', 'lambda', 'try', 'as',
    'def', 'from', 'nonlocal', 'while', 'assert', 'del', 'global',
    'not', 'with', 'async', 'elif', 'if', 'or', 'yield'
];

enum _LSTATENUM {
    START, FR_1, FR_1_1, FR_E_1, FR_E_P_1, FR_E_E, FR_E_E_1,
    FR_D_2, J_1, DIGIT_1, DIGIT_2, FLOAT_1, ZERO_1, ZERO_2, ZERO_3, ZERO_E,
    BIN, BIN_1, BIN_2, OCT, OCT_1, OCT_2, HEX, HEX_1, HEX_2,
    STOP
}
const _isNonZeroDigit = (x: any) => x >= '1' && x <= '9';
const _isDigit = (x: any) => x >= '0' && x <= '9';
const _isHexDigit = (x: any) => (x >= 'a' && x <= 'z') || (x >= 'A' && x <= 'Z') || _isDigit(x);
const _isBinDigit = (x: any) => x === '0' || x === '1';
const _isOctDigit = (x: any) => x >= '0' && x <= '7';
export
const _expectNumber = (input: string) => {
    let i = 0;
    let st: any = _LSTATENUM.START;
    let lastst: any = null;
    let inputlen = input.length;
    while (input[i] && st != _LSTATENUM.STOP) {
        console.log(_LSTATENUM[st]);
        switch (st) {
            case _LSTATENUM.START: { switch (input[i]) {
                case '.': { i += 1; st = _LSTATENUM.FR_1; break; }
                case '0': { i += 1; st = _LSTATENUM.ZERO_1; break; }
                default: {
                    if (_isNonZeroDigit(input[i])) { i += 1; st = _LSTATENUM.DIGIT_1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.FR_1: { switch (input[i]) {
                default: {
                    if (input[i] >= '0' && input[i] <= '9') { i += 1; st = _LSTATENUM.FR_1_1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break;}
            } break; }
            case _LSTATENUM.FR_1_1: { switch (input[i]) {
                case 'e': case 'E': { i += 1; st = _LSTATENUM.FR_E_1; break; }
                case '_': { i += 1; st = _LSTATENUM.FR_D_2; break; }
                default: {
                    if (_isDigit(input[i])) { i += 1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.FR_E_1: { switch (input[i]) {
                case '-': case '+': { i += 1; st = _LSTATENUM.FR_E_P_1; break; }
                default: {
                    if (_isDigit(input[i])) { i += 1; st = _LSTATENUM.FR_E_E; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.FR_E_P_1: { switch (input[i]) {
                default: {
                    if (_isDigit(input[i])) { i += 1; st = _LSTATENUM.FR_E_E; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.FR_E_E: { switch (input[i]) {
                case 'j': case 'J': { i += 1; st = _LSTATENUM.J_1; break; }
                case '_': { i += 1; st = _LSTATENUM.FR_E_E_1; break; }
                default: {
                    if (_isDigit(input[i])) { i += 1; st = _LSTATENUM.FR_E_E; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.FR_E_E_1: { switch (input[i]) {
                default: {
                    if (_isDigit(input[i])) { i += 1; st = _LSTATENUM.FR_E_E; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.J_1: { switch (input[i]) {
                default: { lastst = st; st = _LSTATENUM.STOP; break; }
            } break; }
            case _LSTATENUM.DIGIT_1: { switch (input[i]) {
                case 'j': case 'J': { i += 1; st = _LSTATENUM.J_1; break; }
                case '.': { i += 1; st = _LSTATENUM.FLOAT_1; break; }
                case '_': { i += 1; st = _LSTATENUM.DIGIT_2; break; }
                default: {
                    if (_isDigit(input[i])) { i += 1; st = _LSTATENUM.DIGIT_1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.DIGIT_2: { switch (input[i]) {
                default: {
                    if (_isDigit(input[i])) { i += 1; st = _LSTATENUM.DIGIT_1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.ZERO_1: { switch (input[i]) {
                case '.': { i += 1; st = _LSTATENUM.FLOAT_1; break; }
                case '0': { i += 1; st = _LSTATENUM.ZERO_E; break; }
                case 'b': case 'B': { i += 1; st = _LSTATENUM.BIN; break; }
                case 'o': case 'O': { i += 1; st = _LSTATENUM.OCT; break; }
                case 'x': case 'X': { i += 1; st = _LSTATENUM.HEX; break; }
                default: { lastst = st; st = _LSTATENUM.STOP; break; }
            } break; }
            case _LSTATENUM.ZERO_E: { switch (input[i]) {
                case '.': { i += 1; st = _LSTATENUM.FLOAT_1; break; }
                case '0': { i += 1; break; }
                case '_': { i += 1; st = _LSTATENUM.ZERO_2; break; }
                default: { lastst = st; st = _LSTATENUM.STOP; break; }
            } break; }
            case _LSTATENUM.FLOAT_1: { switch (input[i]) {
                case 'j': case 'J': { i += 1; st = _LSTATENUM.J_1; break; }
                default: {
                    if (_isDigit(input[i])) { i += 1; st = _LSTATENUM.FR_1_1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.ZERO_2: { switch (input[i]) {
                case '0': { i += 1; st = _LSTATENUM.ZERO_3; break; }
                default: { lastst = st; st = _LSTATENUM.STOP; break; }
            } break; }
            case _LSTATENUM.ZERO_3: { switch (input[i]) {
                case '0': { i += 1; break; }
                default: { lastst = st; st = _LSTATENUM.STOP; break; }
            } break; }
            case _LSTATENUM.BIN: { switch (input[i]) {
                case '_': { i += 1; st = _LSTATENUM.BIN_2; break; }
                default: {
                    if (_isBinDigit(input[i])) { i += 1; st = _LSTATENUM.BIN_1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.BIN_1: { switch (input[i]) {
                case '_': { i += 1; st = _LSTATENUM.BIN_2; break; }
                default: {
                    if (_isBinDigit(input[i])) { i += 1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.BIN_2: { switch (input[i]) {
                default: {
                    if (_isBinDigit(input[i])) { i += 1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.OCT: { switch (input[i]) {
                case '_': { i += 1; st = _LSTATENUM.OCT_2; break; }
                default: {
                    if (_isOctDigit(input[i])) { i += 1; st = _LSTATENUM.OCT_1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.OCT_1: { switch (input[i]) {
                case '_': { i += 1; st = _LSTATENUM.OCT_2; break; }
                default: {
                    if (_isOctDigit(input[i])) { i += 1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.OCT_2: { switch (input[i]) {
                default: {
                    if (_isOctDigit(input[i])) { i += 1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.HEX: { switch (input[i]) {
                case '_': { i += 1; st = _LSTATENUM.HEX_2; break; }
                default: {
                    if (_isHexDigit(input[i])) { i += 1; st = _LSTATENUM.HEX_1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.HEX_1: { switch (input[i]) {
                case '_': { i += 1; st = _LSTATENUM.HEX_2; break; }
                default: {
                    if (_isHexDigit(input[i])) { i += 1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
            case _LSTATENUM.HEX_2: { switch (input[i]) {
                default: {
                    if (_isHexDigit(input[i])) { i += 1; }
                    else { lastst = st; st = _LSTATENUM.STOP; } break; }
            } break; }
        }
    }
    console.log(_LSTATENUM[lastst]);
    switch (lastst) {
        case _LSTATENUM.J_1:
            { return ({ type: TokenType.NUMBER, class: TokenClass.COMPLEX, i }); }
        case _LSTATENUM.FR_1_1:
        case _LSTATENUM.FLOAT_1:
        case _LSTATENUM.FR_E_E:
            { return ({ type: TokenType.NUMBER, class: TokenClass.FLOAT, i }); }
        case _LSTATENUM.DIGIT_1:
        case _LSTATENUM.ZERO_1:
        case _LSTATENUM.ZERO_E:
        case _LSTATENUM.ZERO_3:
        case _LSTATENUM.BIN_1:
        case _LSTATENUM.OCT_1:
        case _LSTATENUM.HEX_1:
            { return ({ type: TokenType.NUMBER, class: TokenClass.INTEGER, i }); }
        default: {
            return null;
        }
    }
}



import { Token, TokenType, TokenClass } from "./Token";

// some predicates...
const _isNonZeroDigit = (x: any) => x >= '1' && x <= '9';
const _isDigit = (x: any) => x >= '0' && x <= '9';
const _isHexDigit = (x: any) => (x >= 'a' && x <= 'z') || (x >= 'A' && x <= 'Z') || _isDigit(x);
const _isBinDigit = (x: any) => x === '0' || x === '1';
const _isOctDigit = (x: any) => x >= '0' && x <= '7';
const _isLowerAlphabet = (x: any) => x >= 'a' && x <= 'z';
const _isUpperAlphabet = (x: any) => x >= 'A' && x <= 'Z';
const _isAlphabet = (x: any) => _isLowerAlphabet(x) || _isUpperAlphabet(x);
const _isWhitespace = (x: any) => ' \n\t\r'.includes(x);
const _isNewline = (x: any) => '\n\r'.includes(x);

const RESERVED_WORDS = [
    'False', 'await', 'else', 'import', 'pass', 'None', 'break',
    'except', 'in', 'raise', 'True', 'class', 'finally', 'is',
    'return', 'and', 'continue', 'for', 'lambda', 'try', 'as',
    'def', 'from', 'nonlocal', 'while', 'assert', 'del', 'global',
    'not', 'with', 'async', 'elif', 'if', 'or', 'yield'
];

// see docs/automata_numberLIteral for how this works.
export enum _LSTATENUM {
    START, FR_1, FR_1_1, FR_E_1, FR_E_P_1, FR_E_E, FR_E_E_1,
    FR_D_2, J_1, DIGIT_1, DIGIT_2, FLOAT_1, ZERO_1, ZERO_2, ZERO_3, ZERO_E,
    BIN, BIN_1, BIN_2, OCT, OCT_1, OCT_2, HEX, HEX_1, HEX_2,
    STOP
}
export
const _expectNumber = (i: number, input: string) => {
    let st: any = _LSTATENUM.START;
    let lastst: any = null;
    let start = i;
    while (input[i] && st != _LSTATENUM.STOP) {
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
    if (st !== _LSTATENUM.STOP) {
        lastst = st;
    }
    switch (lastst) {
        case _LSTATENUM.J_1:
            { return ({ type: TokenType.NUMBER, class: TokenClass.COMPLEX, start, end: i }); }
        case _LSTATENUM.FR_1_1:
        case _LSTATENUM.FLOAT_1:
        case _LSTATENUM.FR_E_E:
            { return ({ type: TokenType.NUMBER, class: TokenClass.FLOAT, start, end: i }); }
        case _LSTATENUM.DIGIT_1:
        case _LSTATENUM.ZERO_1:
        case _LSTATENUM.ZERO_E:
        case _LSTATENUM.ZERO_3:
        case _LSTATENUM.BIN_1:
        case _LSTATENUM.OCT_1:
        case _LSTATENUM.HEX_1:
            { return ({ type: TokenType.NUMBER, class: TokenClass.INTEGER, start, end: i }); }
        default: {
            return null;
        }
    }
}

type _LSTRFLAG = {
    byte: boolean,
    raw: boolean,
    unicode: boolean,
    fstr: boolean,
    multiline: boolean,
    escaping: string|null
};

export
const _expectEscapeSequence
= (flag: any) => (i: number, input: string) => {
    // few things to remember:
    // when the source string the caller is processing denotes a bytestring,
    // some char sequence are not considered to be escape sequence (i.e.
    // \u \U and \N as of Python 3.7), this function will returns `true`
    // just in case someone just do `if (_expectEscapeSequence(flag)(i, s))`
    // instead of testing whether it's `null` explicitly. (when a "real"
    // escape sequence is detected, this function will return an object.)
    let res = ({ type: TokenType.STRING, class: TokenClass.ESCSEQ, start: i, end: i });

    if (input[i] !== '\\') return null;
    i += 1;

    if (flag.raw) {
        if (input[i] === flag.escaping) {
            i += 1; res.end = i; return res;
        } else {
            return true;
        }
    } else {
        // single escape:
        switch (input[i]) {
            case '\n': case '\\': case '\'': case '"': case 'a': case 'b':
            case 'f': case 'n': case 'r': case 't': case 'v': {
                i += 1; res.end = i; return res;
            }
            // this case is somewhat special, because there are 3 different ways
            // to represent a linebreak: \n in *nix, \r\n in windows, and \r in 
            // classic macos (the macos before mac os x). so here's the thing...
            case '\r': {
                i += 1;
                if (input[i + 1] === '\n') i += 1;
                res.end = i; return res;
            }
            // it might be a better idea to do the octal case in the default clause
            case 'x': {
                i += 1;
                if (!_isHexDigit(input[i]) || !_isHexDigit(input[i + 1])) return null;
                i += 2; res.end = i; return res;
            }
            case 'u': {
                // remember: in bytestrings and raw strings the sequence \u is not
                // considered to be an escape sequence, 
                if (flag.byte) return true;

                i += 1;
                for (let _i = 0; _i < 4; _i++) {
                    if (!_isHexDigit(input[i + _i])) {
                        return null;
                    }
                }
                i += 4; res.end = i; return res;            
            }
            case 'U': {
                // here, is another problem: CPython will throw a SyntaxError even
                // if the user *did* have 8 hex digit following the 'U' character,
                // if those 8 hex digit does not form a valid unicode codepoint.
                // but i'm not gonna do it here simply because it's a different
                // kind of syntax error.
                if (flag.byte) return true;

                i += 1;
                for (let _i = 0; _i < 8; _i++) {
                    if (!_isHexDigit(input[i + _i])) {
                        return null;
                    }
                }
                i += 8; res.end = i; return res;        
            }
            case 'N': {
                // \N escape has the same problem in the \U escape: if the name
                // following \N does not resemble an alias in the alias table,
                // it's a syntax error. i'm not gonna handle this here, too.
                // the said alias table:
                //   http://www.unicode.org/Public/11.0.0/ucd/NameAliases.txt
                if (flag.byte) return true;

                i += 1;
                if (input[i] !== '{') return null; i += 1;
                while (_isAlphabet(input[i]) || input[i] === ' ') i++;
                if (input[i] !== '}') return null; i += 1;
                res.end = i; return res;
            }
            default: {
                if (_isDigit(input[i])) {
                    let _i = 0;
                    while (_isDigit(input[i + _i]) && _i < 3) _i++;
                    i += _i;
                    res.end = i; return res;
                } else {
                    return true;
                }
            }
        }
    }
}

export
const _expectString
: (i: number, input: string) => Token[]|null
= (i: number, input: string) => {
    let res = [];
    let done = false;
    let start = i;

    let flag: _LSTRFLAG = {
        byte: false,
        raw: false,
        unicode: false,
        fstr: false,
        multiline: false,
        escaping: null as string|null
    }
    // this is for the prefix...
    let flagMapping
    : {prefix:string, flag:('byte'|'raw'|'fstr')[], len:number}[]
    = [
        { prefix: 'br', flag: ['byte', 'raw'], len: 2 },
        { prefix: 'bR', flag: ['byte', 'raw'], len: 2 },
        { prefix: 'Br', flag: ['byte', 'raw'], len: 2 },
        { prefix: 'BR', flag: ['byte', 'raw'], len: 2 },
        { prefix: 'rb', flag: ['byte', 'raw'], len: 2 },
        { prefix: 'rB', flag: ['byte', 'raw'], len: 2 },
        { prefix: 'Rb', flag: ['byte', 'raw'], len: 2 },
        { prefix: 'RB', flag: ['byte', 'raw'], len: 2 },
        { prefix: 'fr', flag: ['fstr', 'raw'], len: 2 },
        { prefix: 'fR', flag: ['fstr', 'raw'], len: 2 },
        { prefix: 'Fr', flag: ['fstr', 'raw'], len: 2 },
        { prefix: 'FR', flag: ['fstr', 'raw'], len: 2 },
        { prefix: 'rf', flag: ['fstr', 'raw'], len: 2 },
        { prefix: 'rF', flag: ['fstr', 'raw'], len: 2 },
        { prefix: 'Rf', flag: ['fstr', 'raw'], len: 2 },
        { prefix: 'RF', flag: ['fstr', 'raw'], len: 2 },
        { prefix: 'r', flag: ['raw'], len: 1 },
        { prefix: 'R', flag: ['raw'], len: 1 },
        { prefix: 'f', flag: ['fstr'], len: 1 },
        { prefix: 'F', flag: ['fstr'], len: 1 },
        { prefix: 'b', flag: ['byte'], len: 1 },
        { prefix: 'B', flag: ['byte'], len: 1 },
    ];
    for (let _i in flagMapping) {
        if (input.startsWith(flagMapping[_i].prefix, i)) {
            for (let _j in flagMapping[_i].flag) {
                flag[flagMapping[_i].flag[_j]] = true;
            }
            i += flagMapping[_i].len;
            break;
        }
    }
    // and this is for the single/multi line...
    if (input[i] == '"') {
        flag.escaping = '"';
    } else if (input[i] == '\'') {
        flag.escaping = '\'';
    } else {
        return null;
    }
    // if it's not single or double quote the call will have already returned.
    i++;
    if (input[i] === flag.escaping && input[i+1] === flag.escaping) {
        flag.multiline = true; i += 2;
    }
    // now here's the fun part...
    // if you use builtin javascript string, then it's wrong because python3
    // sources are meant to be encoded in utf8 when there's no "encoding
    // header", while in javascript strings are utf16...
    let FORCE_NORMAL = false;
    while (input[i]) {
        if (input[i] === '\\' && !FORCE_NORMAL) {
            let lastEnd: number = res && res.length? (res[res.length - 1] as any).end : start;
            res.push({ type: TokenType.STRING, class: TokenClass.STRPART, start: lastEnd, end: i });
            let newI = _expectEscapeSequence(flag)(i, input);
            if (!newI) return ([{ type: TokenType.STRING, class: TokenClass.ERROR, start, end: input.indexOf('\n', i) }]);
            if (newI === true) {
                res.pop();
                FORCE_NORMAL = true;
            } else {
                res.push(newI);
                i = newI.end;
                start = newI.end;
            }
        } else if (input[i] === flag.escaping) {
            // now we have to check if it's a multiline string, because in a
            // multiline string the enclosing character can occur freely as
            // long as there isn't three of them occuring at the same time,
            // e.g. `'''a''a''a'''` evals to "a''a''a", and `'''a'''a''a'''`
            // contains a syntax error.
            if (
                flag.multiline &&
                    (input[i+1] && input[i+2] && input[i+1] === flag.escaping && input[i+2] === flag.escaping)
                ||
                !flag.multiline
            ) {
                done = true;
                i += flag.multiline? 3 : 1;
                break;
            } else {
                i += 1;
            }
        } else if (_isNewline(input[i])) {
            if (!flag.multiline) return ([{ type: TokenType.STRING, class: TokenClass.ERROR, start, end: input.indexOf('\n', i) }]);
            i += 1;
            FORCE_NORMAL = false;
        } else {
            i += 1;
            FORCE_NORMAL = false;
        }
    }
    if (done) {
        res.push({ type: TokenType.STRING, class: TokenClass.STRPART, start, end: i });
        return res as any;
    }
    else { return null; }
}

export
const _expectIdentifier = (i: number, input: string) => {
    // this function currently does not support unicode character.
    // assuming that an identifier can only be started with letters and
    // underscore, and can only contain letters and numbers.
    if (!(_isAlphabet(input[i]) || input[i] !== '_')) return null;
    let start = i;
    i += 1;
    while (_isAlphabet(input[i]) || _isDigit(input[i]) || input[i] === '_') i++;
    return ({ type: TokenType.IDENTIFIER, class: TokenClass.NORMAL, start, end: i });
}

export
const _expectSymbol
: (i: number, input: string) => Token|null
= (i: number, input: string) => {
    let start = i;
    const symbolTable = [
        { string: "+=", class: TokenClass.PLUSEQUAL },
        { string: "-=", class: TokenClass.MINEQUAL },
        { string: "*=", class: TokenClass.STAREQUAL },
        { string: "/=", class: TokenClass.SLASHEQUAL },
        { string: "//=", class: TokenClass.DOUBLESLASHEQUAL },
        { string: "%=", class: TokenClass.PERCENTEQUAL },
        { string: "@=", class: TokenClass.ATEQUAL },
        { string: "&=", class: TokenClass.AMPEREQUAL },
        { string: "|=", class: TokenClass.VBAREQUAL },
        { string: "^=", class: TokenClass.CIRCUMFLEXEQUAL },
        { string: ">>=", class: TokenClass.RIGHTSHIFTEQUAL },
        { string: "<<=", class: TokenClass.LEFTSHIFTEQUAL },
        { string: "**=", class: TokenClass.DOUBLESTAREQUAL },
        { string: '+=', class: TokenClass.PLUSEQUAL },
        { string: "(", class: TokenClass.LPAR },
        { string: ")", class: TokenClass.RPAR },
        { string: "[", class: TokenClass.LSQB },
        { string: "]", class: TokenClass.RSQB },
        { string: "{", class: TokenClass.LBRACE },
        { string: "}", class: TokenClass.RBRACE },
        { string: ",", class: TokenClass.COMMA },
        { string: ":", class: TokenClass.COLON },
        { string: ".", class: TokenClass.DOT },
        { string: ";", class: TokenClass.SEMI },
        { string: "@", class: TokenClass.AT },
        { string: "=", class: TokenClass.EQUAL },
        { string: "->", class: TokenClass.RARROW },
        { string: "+", class: TokenClass.PLUS },
        { string: "-", class: TokenClass.MINUS },
        { string: "*", class: TokenClass.STAR },
        { string: "**", class: TokenClass.DOUBLESTAR },
        { string: "/", class: TokenClass.SLASH },
        { string: "//", class: TokenClass.DOUBLESLASH },
        { string: "%", class: TokenClass.PERCENT },
        { string: "@", class: TokenClass.AMPER },
        { string: "<<", class: TokenClass.LEFTSHIFT },
        { string: ">>", class: TokenClass.RIGHTSHIFT },
        { string: "&", class: TokenClass.AMPEREQUAL },
        { string: "|", class: TokenClass.VBAR },
        { string: "^", class: TokenClass.CIRCUMFLEX },
        { string: "~", class: TokenClass.TILDE },
        { string: "<", class: TokenClass.LESS },
        { string: ">", class: TokenClass.GREATER },
        { string: "<=", class: TokenClass.LESSEQUAL },
        { string: ">=", class: TokenClass.GREATEREQUAL },
        { string: "==", class: TokenClass.EQEQUAL },
        { string: "!=", class: TokenClass.NOTEQUAL },
    ];
    for (let _i in symbolTable) {
        if (input.startsWith(symbolTable[_i].string, i)) {
            return ({ type: TokenType.SYMBOL, class: symbolTable[_i].class, start, end: i +  symbolTable[_i].string.length}) as any;
        }
    }
    return null;
}

export
const _expectWhitespace = (i: number, input: string) => {
    // note 2019.6.8: this version of lexer is just for syntax highlighting
    // so no special treatment for indentation.
    let start = i;
    let _i = 0;
    while (_isWhitespace(input[i + _i])) _i += 1;
    if (_i === 0) return null;
    return ({ type: TokenType.WHITESPACE, class: TokenClass.NORMAL, start, end: i + _i });
}

export
const _expectComment = (i: number, input: string) => {
    // this function expects that input[i] points to the hash character.
    let start = i;
    i += 1;
    while (input[i] && !_isNewline(input[i])) i += 1;
    return ({ type: TokenType.COMMENT, class: TokenClass.NORMAL, start, end: i });
}

export
const _lex = (input: string) => {
    let res: Token[] = [];
    let i = 0;
    while (input[i]) {
        if (_isWhitespace(input[i])) {
            let matchres = _expectWhitespace(i, input);
            if (matchres) {
                res.push(matchres); i = matchres.end; continue;
            }
        }
        if (_isDigit(input[i]) || input[i] === '.') {
            let matchres = _expectNumber(i, input);
            if (matchres) {
                res.push(matchres); i = matchres.end; continue;
            }
        }
        if ('rbuf\'\"'.includes(input[i])) {
            let matchres = _expectString(i, input);
            if (matchres && matchres.length) {
                res = res.concat(matchres); i = matchres[matchres.length - 1].end; continue;
            }
        }
        if (input[i] === '_' || _isAlphabet(input[i])) {
            let matchres = _expectIdentifier(i, input);
            if (matchres) {
                let prevI = res.length? res[res.length - 1].end : 0;
                let pattern = input.substring(prevI, matchres.end);
                res.push(
                    RESERVED_WORDS.includes(pattern)?
                        ({ type: TokenType.KEYWORD, class: TokenClass.NORMAL, start: matchres.start, end: matchres.end })
                        : matchres
                ); i = matchres.end; continue;
            }
        }
        if (input[i] === '#') {
            let matchres = _expectComment(i, input);
            if (matchres) {
                res.push(matchres);
                i = matchres.end; continue;
            }
        }
        let matchres = _expectSymbol(i, input);
        if (matchres) {
            res.push(matchres); i = matchres.end; continue;
        } else {
            let lineEnd = input.indexOf('\n', i);
            if (lineEnd === -1) lineEnd = input.length;
            res.push({ type: TokenType.PLAIN, class: TokenClass.ERROR, start: i, end: lineEnd });
            i = lineEnd; continue;
        }
    }
    return res;
}

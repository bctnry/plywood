var Plywood = (function () {
    'use strict';

    var TokenType;
    (function (TokenType) {
        TokenType[TokenType["PLAIN"] = 0] = "PLAIN";
        TokenType[TokenType["NUMBER"] = 1] = "NUMBER";
        TokenType[TokenType["STRING"] = 2] = "STRING";
        TokenType[TokenType["IDENTIFIER"] = 3] = "IDENTIFIER";
        TokenType[TokenType["KEYWORD"] = 4] = "KEYWORD";
        TokenType[TokenType["COMMENT"] = 5] = "COMMENT";
        TokenType[TokenType["EDITOR_PLACEHOLDER"] = 6] = "EDITOR_PLACEHOLDER";
        TokenType[TokenType["SYMBOL"] = 7] = "SYMBOL";
        TokenType[TokenType["WHITESPACE"] = 8] = "WHITESPACE";
    })(TokenType || (TokenType = {}));
    var TokenClass;
    (function (TokenClass) {
        // NUMBER
        TokenClass[TokenClass["INTEGER"] = 0] = "INTEGER";
        TokenClass[TokenClass["FLOAT"] = 1] = "FLOAT";
        TokenClass[TokenClass["COMPLEX"] = 2] = "COMPLEX";
        // STRING
        TokenClass[TokenClass["STRPART"] = 3] = "STRPART";
        TokenClass[TokenClass["ESCSEQ"] = 4] = "ESCSEQ";
        // SYMBOL
        TokenClass[TokenClass["LPAR"] = 5] = "LPAR";
        TokenClass[TokenClass["RPAR"] = 6] = "RPAR";
        TokenClass[TokenClass["LSQB"] = 7] = "LSQB";
        TokenClass[TokenClass["RSQB"] = 8] = "RSQB";
        TokenClass[TokenClass["COLON"] = 9] = "COLON";
        TokenClass[TokenClass["COMMA"] = 10] = "COMMA";
        TokenClass[TokenClass["SEMI"] = 11] = "SEMI";
        TokenClass[TokenClass["PLUS"] = 12] = "PLUS";
        TokenClass[TokenClass["MINUS"] = 13] = "MINUS";
        TokenClass[TokenClass["STAR"] = 14] = "STAR";
        TokenClass[TokenClass["SLASH"] = 15] = "SLASH";
        TokenClass[TokenClass["VBAR"] = 16] = "VBAR";
        TokenClass[TokenClass["AMPER"] = 17] = "AMPER";
        TokenClass[TokenClass["LESS"] = 18] = "LESS";
        TokenClass[TokenClass["GREATER"] = 19] = "GREATER";
        TokenClass[TokenClass["EQUAL"] = 20] = "EQUAL";
        TokenClass[TokenClass["DOT"] = 21] = "DOT";
        TokenClass[TokenClass["PERCENT"] = 22] = "PERCENT";
        TokenClass[TokenClass["LBRACE"] = 23] = "LBRACE";
        TokenClass[TokenClass["RBRACE"] = 24] = "RBRACE";
        TokenClass[TokenClass["EQEQUAL"] = 25] = "EQEQUAL";
        TokenClass[TokenClass["NOTEQUAL"] = 26] = "NOTEQUAL";
        TokenClass[TokenClass["LESSEQUAL"] = 27] = "LESSEQUAL";
        TokenClass[TokenClass["GREATEREQUAL"] = 28] = "GREATEREQUAL";
        TokenClass[TokenClass["TILDE"] = 29] = "TILDE";
        TokenClass[TokenClass["CIRCUMFLEX"] = 30] = "CIRCUMFLEX";
        TokenClass[TokenClass["LEFTSHIFT"] = 31] = "LEFTSHIFT";
        TokenClass[TokenClass["RIGHTSHIFT"] = 32] = "RIGHTSHIFT";
        TokenClass[TokenClass["DOUBLESTAR"] = 33] = "DOUBLESTAR";
        TokenClass[TokenClass["PLUSEQUAL"] = 34] = "PLUSEQUAL";
        TokenClass[TokenClass["MINEQUAL"] = 35] = "MINEQUAL";
        TokenClass[TokenClass["STAREQUAL"] = 36] = "STAREQUAL";
        TokenClass[TokenClass["SLASHEQUAL"] = 37] = "SLASHEQUAL";
        TokenClass[TokenClass["PERCENTEQUAL"] = 38] = "PERCENTEQUAL";
        TokenClass[TokenClass["AMPEREQUAL"] = 39] = "AMPEREQUAL";
        TokenClass[TokenClass["VBAREQUAL"] = 40] = "VBAREQUAL";
        TokenClass[TokenClass["CIRCUMFLEXEQUAL"] = 41] = "CIRCUMFLEXEQUAL";
        TokenClass[TokenClass["LEFTSHIFTEQUAL"] = 42] = "LEFTSHIFTEQUAL";
        TokenClass[TokenClass["RIGHTSHIFTEQUAL"] = 43] = "RIGHTSHIFTEQUAL";
        TokenClass[TokenClass["DOUBLESTAREQUAL"] = 44] = "DOUBLESTAREQUAL";
        TokenClass[TokenClass["DOUBLESLASH"] = 45] = "DOUBLESLASH";
        TokenClass[TokenClass["DOUBLESLASHEQUAL"] = 46] = "DOUBLESLASHEQUAL";
        TokenClass[TokenClass["AT"] = 47] = "AT";
        TokenClass[TokenClass["ATEQUAL"] = 48] = "ATEQUAL";
        TokenClass[TokenClass["RARROW"] = 49] = "RARROW";
        TokenClass[TokenClass["ELLIPSIS"] = 50] = "ELLIPSIS";
        // WHITESPACE
        TokenClass[TokenClass["NEWLINE"] = 51] = "NEWLINE";
        TokenClass[TokenClass["INDENT"] = 52] = "INDENT";
        TokenClass[TokenClass["DEDENT"] = 53] = "DEDENT";
        TokenClass[TokenClass["NL"] = 54] = "NL";
        // GENERAL
        TokenClass[TokenClass["NORMAL"] = 55] = "NORMAL";
        TokenClass[TokenClass["ERROR"] = 56] = "ERROR";
    })(TokenClass || (TokenClass = {}));
    var _prettyPrint = function (token) {
        return JSON.stringify({ type: TokenType[token.type], "class": TokenClass[token["class"]], start: token.start, end: token.end });
    };

    var Token = /*#__PURE__*/Object.freeze({
        get TokenType () { return TokenType; },
        get TokenClass () { return TokenClass; },
        _prettyPrint: _prettyPrint
    });

    // some predicates...
    var _isNonZeroDigit = function (x) { return x >= '1' && x <= '9'; };
    var _isDigit = function (x) { return x >= '0' && x <= '9'; };
    var _isHexDigit = function (x) { return (x >= 'a' && x <= 'z') || (x >= 'A' && x <= 'Z') || _isDigit(x); };
    var _isBinDigit = function (x) { return x === '0' || x === '1'; };
    var _isOctDigit = function (x) { return x >= '0' && x <= '7'; };
    var _isLowerAlphabet = function (x) { return x >= 'a' && x <= 'z'; };
    var _isUpperAlphabet = function (x) { return x >= 'A' && x <= 'Z'; };
    var _isAlphabet = function (x) { return _isLowerAlphabet(x) || _isUpperAlphabet(x); };
    var _isWhitespace = function (x) { return ' \n\t\r'.includes(x); };
    var _isNewline = function (x) { return '\n\r'.includes(x); };
    var RESERVED_WORDS = [
        'False', 'await', 'else', 'import', 'pass', 'None', 'break',
        'except', 'in', 'raise', 'True', 'class', 'finally', 'is',
        'return', 'and', 'continue', 'for', 'lambda', 'try', 'as',
        'def', 'from', 'nonlocal', 'while', 'assert', 'del', 'global',
        'not', 'with', 'async', 'elif', 'if', 'or', 'yield'
    ];
    // see docs/automata_numberLIteral for how this works.
    var _LSTATENUM;
    (function (_LSTATENUM) {
        _LSTATENUM[_LSTATENUM["START"] = 0] = "START";
        _LSTATENUM[_LSTATENUM["FR_1"] = 1] = "FR_1";
        _LSTATENUM[_LSTATENUM["FR_1_1"] = 2] = "FR_1_1";
        _LSTATENUM[_LSTATENUM["FR_E_1"] = 3] = "FR_E_1";
        _LSTATENUM[_LSTATENUM["FR_E_P_1"] = 4] = "FR_E_P_1";
        _LSTATENUM[_LSTATENUM["FR_E_E"] = 5] = "FR_E_E";
        _LSTATENUM[_LSTATENUM["FR_E_E_1"] = 6] = "FR_E_E_1";
        _LSTATENUM[_LSTATENUM["FR_D_2"] = 7] = "FR_D_2";
        _LSTATENUM[_LSTATENUM["J_1"] = 8] = "J_1";
        _LSTATENUM[_LSTATENUM["DIGIT_1"] = 9] = "DIGIT_1";
        _LSTATENUM[_LSTATENUM["DIGIT_2"] = 10] = "DIGIT_2";
        _LSTATENUM[_LSTATENUM["FLOAT_1"] = 11] = "FLOAT_1";
        _LSTATENUM[_LSTATENUM["ZERO_1"] = 12] = "ZERO_1";
        _LSTATENUM[_LSTATENUM["ZERO_2"] = 13] = "ZERO_2";
        _LSTATENUM[_LSTATENUM["ZERO_3"] = 14] = "ZERO_3";
        _LSTATENUM[_LSTATENUM["ZERO_E"] = 15] = "ZERO_E";
        _LSTATENUM[_LSTATENUM["BIN"] = 16] = "BIN";
        _LSTATENUM[_LSTATENUM["BIN_1"] = 17] = "BIN_1";
        _LSTATENUM[_LSTATENUM["BIN_2"] = 18] = "BIN_2";
        _LSTATENUM[_LSTATENUM["OCT"] = 19] = "OCT";
        _LSTATENUM[_LSTATENUM["OCT_1"] = 20] = "OCT_1";
        _LSTATENUM[_LSTATENUM["OCT_2"] = 21] = "OCT_2";
        _LSTATENUM[_LSTATENUM["HEX"] = 22] = "HEX";
        _LSTATENUM[_LSTATENUM["HEX_1"] = 23] = "HEX_1";
        _LSTATENUM[_LSTATENUM["HEX_2"] = 24] = "HEX_2";
        _LSTATENUM[_LSTATENUM["STOP"] = 25] = "STOP";
    })(_LSTATENUM || (_LSTATENUM = {}));
    var _expectNumber = function (i, input) {
        var st = _LSTATENUM.START;
        var lastst = null;
        var start = i;
        while (input[i] && st != _LSTATENUM.STOP) {
            switch (st) {
                case _LSTATENUM.START: {
                    switch (input[i]) {
                        case '.': {
                            i += 1;
                            st = _LSTATENUM.FR_1;
                            break;
                        }
                        case '0': {
                            i += 1;
                            st = _LSTATENUM.ZERO_1;
                            break;
                        }
                        default: {
                            if (_isNonZeroDigit(input[i])) {
                                i += 1;
                                st = _LSTATENUM.DIGIT_1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.FR_1: {
                    switch (input[i]) {
                        default: {
                            if (input[i] >= '0' && input[i] <= '9') {
                                i += 1;
                                st = _LSTATENUM.FR_1_1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.FR_1_1: {
                    switch (input[i]) {
                        case 'e':
                        case 'E': {
                            i += 1;
                            st = _LSTATENUM.FR_E_1;
                            break;
                        }
                        case '_': {
                            i += 1;
                            st = _LSTATENUM.FR_D_2;
                            break;
                        }
                        case 'j':
                        case 'J': {
                            i += 1;
                            st = _LSTATENUM.J_1;
                            break;
                        }
                        default: {
                            if (_isDigit(input[i])) {
                                i += 1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.FR_E_1: {
                    switch (input[i]) {
                        case '-':
                        case '+': {
                            i += 1;
                            st = _LSTATENUM.FR_E_P_1;
                            break;
                        }
                        default: {
                            if (_isDigit(input[i])) {
                                i += 1;
                                st = _LSTATENUM.FR_E_E;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.FR_E_P_1: {
                    switch (input[i]) {
                        default: {
                            if (_isDigit(input[i])) {
                                i += 1;
                                st = _LSTATENUM.FR_E_E;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.FR_E_E: {
                    switch (input[i]) {
                        case 'j':
                        case 'J': {
                            i += 1;
                            st = _LSTATENUM.J_1;
                            break;
                        }
                        case '_': {
                            i += 1;
                            st = _LSTATENUM.FR_E_E_1;
                            break;
                        }
                        default: {
                            if (_isDigit(input[i])) {
                                i += 1;
                                st = _LSTATENUM.FR_E_E;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.FR_E_E_1: {
                    switch (input[i]) {
                        default: {
                            if (_isDigit(input[i])) {
                                i += 1;
                                st = _LSTATENUM.FR_E_E;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.J_1: {
                    switch (input[i]) {
                        default: {
                            lastst = st;
                            st = _LSTATENUM.STOP;
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.DIGIT_1: {
                    switch (input[i]) {
                        case 'j':
                        case 'J': {
                            i += 1;
                            st = _LSTATENUM.J_1;
                            break;
                        }
                        case '.': {
                            i += 1;
                            st = _LSTATENUM.FLOAT_1;
                            break;
                        }
                        case '_': {
                            i += 1;
                            st = _LSTATENUM.DIGIT_2;
                            break;
                        }
                        default: {
                            if (_isDigit(input[i])) {
                                i += 1;
                                st = _LSTATENUM.DIGIT_1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.DIGIT_2: {
                    switch (input[i]) {
                        default: {
                            if (_isDigit(input[i])) {
                                i += 1;
                                st = _LSTATENUM.DIGIT_1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.ZERO_1: {
                    switch (input[i]) {
                        case '.': {
                            i += 1;
                            st = _LSTATENUM.FLOAT_1;
                            break;
                        }
                        case '0': {
                            i += 1;
                            st = _LSTATENUM.ZERO_E;
                            break;
                        }
                        case 'b':
                        case 'B': {
                            i += 1;
                            st = _LSTATENUM.BIN;
                            break;
                        }
                        case 'o':
                        case 'O': {
                            i += 1;
                            st = _LSTATENUM.OCT;
                            break;
                        }
                        case 'x':
                        case 'X': {
                            i += 1;
                            st = _LSTATENUM.HEX;
                            break;
                        }
                        case 'j':
                        case 'J': {
                            i += 1;
                            st = _LSTATENUM.J_1;
                            break;
                        }
                        default: {
                            lastst = st;
                            st = _LSTATENUM.STOP;
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.ZERO_E: {
                    switch (input[i]) {
                        case '.': {
                            i += 1;
                            st = _LSTATENUM.FLOAT_1;
                            break;
                        }
                        case '0': {
                            i += 1;
                            break;
                        }
                        case '_': {
                            i += 1;
                            st = _LSTATENUM.ZERO_2;
                            break;
                        }
                        default: {
                            lastst = st;
                            st = _LSTATENUM.STOP;
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.FLOAT_1: {
                    switch (input[i]) {
                        case 'j':
                        case 'J': {
                            i += 1;
                            st = _LSTATENUM.J_1;
                            break;
                        }
                        default: {
                            if (_isDigit(input[i])) {
                                i += 1;
                                st = _LSTATENUM.FR_1_1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.ZERO_2: {
                    switch (input[i]) {
                        case '0': {
                            i += 1;
                            st = _LSTATENUM.ZERO_3;
                            break;
                        }
                        default: {
                            lastst = st;
                            st = _LSTATENUM.STOP;
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.ZERO_3: {
                    switch (input[i]) {
                        case '0': {
                            i += 1;
                            break;
                        }
                        default: {
                            lastst = st;
                            st = _LSTATENUM.STOP;
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.BIN: {
                    switch (input[i]) {
                        case '_': {
                            i += 1;
                            st = _LSTATENUM.BIN_2;
                            break;
                        }
                        default: {
                            if (_isBinDigit(input[i])) {
                                i += 1;
                                st = _LSTATENUM.BIN_1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.BIN_1: {
                    switch (input[i]) {
                        case '_': {
                            i += 1;
                            st = _LSTATENUM.BIN_2;
                            break;
                        }
                        default: {
                            if (_isBinDigit(input[i])) {
                                i += 1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.BIN_2: {
                    switch (input[i]) {
                        default: {
                            if (_isBinDigit(input[i])) {
                                i += 1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.OCT: {
                    switch (input[i]) {
                        case '_': {
                            i += 1;
                            st = _LSTATENUM.OCT_2;
                            break;
                        }
                        default: {
                            if (_isOctDigit(input[i])) {
                                i += 1;
                                st = _LSTATENUM.OCT_1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.OCT_1: {
                    switch (input[i]) {
                        case '_': {
                            i += 1;
                            st = _LSTATENUM.OCT_2;
                            break;
                        }
                        default: {
                            if (_isOctDigit(input[i])) {
                                i += 1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.OCT_2: {
                    switch (input[i]) {
                        default: {
                            if (_isOctDigit(input[i])) {
                                i += 1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.HEX: {
                    switch (input[i]) {
                        case '_': {
                            i += 1;
                            st = _LSTATENUM.HEX_2;
                            break;
                        }
                        default: {
                            if (_isHexDigit(input[i])) {
                                i += 1;
                                st = _LSTATENUM.HEX_1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.HEX_1: {
                    switch (input[i]) {
                        case '_': {
                            i += 1;
                            st = _LSTATENUM.HEX_2;
                            break;
                        }
                        default: {
                            if (_isHexDigit(input[i])) {
                                i += 1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
                case _LSTATENUM.HEX_2: {
                    switch (input[i]) {
                        default: {
                            if (_isHexDigit(input[i])) {
                                i += 1;
                            }
                            else {
                                lastst = st;
                                st = _LSTATENUM.STOP;
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
        if (st !== _LSTATENUM.STOP) {
            lastst = st;
        }
        switch (lastst) {
            case _LSTATENUM.J_1:
                {
                    return ({ type: TokenType.NUMBER, "class": TokenClass.COMPLEX, start: start, end: i });
                }
            case _LSTATENUM.FR_1_1:
            case _LSTATENUM.FLOAT_1:
            case _LSTATENUM.FR_E_E:
                {
                    return ({ type: TokenType.NUMBER, "class": TokenClass.FLOAT, start: start, end: i });
                }
            case _LSTATENUM.DIGIT_1:
            case _LSTATENUM.ZERO_1:
            case _LSTATENUM.ZERO_E:
            case _LSTATENUM.ZERO_3:
            case _LSTATENUM.BIN_1:
            case _LSTATENUM.OCT_1:
            case _LSTATENUM.HEX_1:
                {
                    return ({ type: TokenType.NUMBER, "class": TokenClass.INTEGER, start: start, end: i });
                }
            default: {
                return null;
            }
        }
    };
    var _expectEscapeSequence = function (flag) { return function (i, input) {
        // few things to remember:
        // when the source string the caller is processing denotes a bytestring,
        // some char sequence are not considered to be escape sequence (i.e.
        // \u \U and \N as of Python 3.7), this function will returns `true`
        // just in case someone just do `if (_expectEscapeSequence(flag)(i, s))`
        // instead of testing whether it's `null` explicitly. (when a "real"
        // escape sequence is detected, this function will return an object.)
        var res = ({ type: TokenType.STRING, "class": TokenClass.ESCSEQ, start: i, end: i });
        if (input[i] !== '\\')
            return null;
        i += 1;
        if (flag.raw) {
            if (input[i] === flag.escaping) {
                i += 1;
                res.end = i;
                return res;
            }
            else {
                return true;
            }
        }
        else {
            // single escape:
            switch (input[i]) {
                case '\n':
                case '\\':
                case '\'':
                case '"':
                case 'a':
                case 'b':
                case 'f':
                case 'n':
                case 'r':
                case 't':
                case 'v': {
                    i += 1;
                    res.end = i;
                    return res;
                }
                // this case is somewhat special, because there are 3 different ways
                // to represent a linebreak: \n in *nix, \r\n in windows, and \r in 
                // classic macos (the macos before mac os x). so here's the thing...
                case '\r': {
                    i += 1;
                    if (input[i + 1] === '\n')
                        i += 1;
                    res.end = i;
                    return res;
                }
                // it might be a better idea to do the octal case in the default clause
                case 'x': {
                    i += 1;
                    if (!_isHexDigit(input[i]) || !_isHexDigit(input[i + 1]))
                        return null;
                    i += 2;
                    res.end = i;
                    return res;
                }
                case 'u': {
                    // remember: in bytestrings and raw strings the sequence \u is not
                    // considered to be an escape sequence, 
                    if (flag.byte)
                        return true;
                    i += 1;
                    for (var _i = 0; _i < 4; _i++) {
                        if (!_isHexDigit(input[i + _i])) {
                            return null;
                        }
                    }
                    i += 4;
                    res.end = i;
                    return res;
                }
                case 'U': {
                    // here, is another problem: CPython will throw a SyntaxError even
                    // if the user *did* have 8 hex digit following the 'U' character,
                    // if those 8 hex digit does not form a valid unicode codepoint.
                    // but i'm not gonna do it here simply because it's a different
                    // kind of syntax error.
                    if (flag.byte)
                        return true;
                    i += 1;
                    for (var _i = 0; _i < 8; _i++) {
                        if (!_isHexDigit(input[i + _i])) {
                            return null;
                        }
                    }
                    i += 8;
                    res.end = i;
                    return res;
                }
                case 'N': {
                    // \N escape has the same problem in the \U escape: if the name
                    // following \N does not resemble an alias in the alias table,
                    // it's a syntax error. i'm not gonna handle this here, too.
                    // the said alias table:
                    //   http://www.unicode.org/Public/11.0.0/ucd/NameAliases.txt
                    if (flag.byte)
                        return true;
                    i += 1;
                    if (input[i] !== '{')
                        return null;
                    i += 1;
                    while (_isAlphabet(input[i]) || input[i] === ' ')
                        i++;
                    if (input[i] !== '}')
                        return null;
                    i += 1;
                    res.end = i;
                    return res;
                }
                default: {
                    if (_isDigit(input[i])) {
                        var _i = 0;
                        while (_isDigit(input[i + _i]) && _i < 3)
                            _i++;
                        i += _i;
                        res.end = i;
                        return res;
                    }
                    else {
                        return true;
                    }
                }
            }
        }
    }; };
    var _expectString = function (i, input) {
        var res = [];
        var done = false;
        var start = i;
        var flag = {
            byte: false,
            raw: false,
            unicode: false,
            fstr: false,
            multiline: false,
            escaping: null
        };
        // this is for the prefix...
        var flagMapping = [
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
        for (var _i in flagMapping) {
            if (input.startsWith(flagMapping[_i].prefix, i)) {
                for (var _j in flagMapping[_i].flag) {
                    flag[flagMapping[_i].flag[_j]] = true;
                }
                i += flagMapping[_i].len;
                break;
            }
        }
        // and this is for the single/multi line...
        if (input[i] == '"') {
            flag.escaping = '"';
        }
        else if (input[i] == '\'') {
            flag.escaping = '\'';
        }
        else {
            return null;
        }
        // if it's not single or double quote the call will have already returned.
        i++;
        if (input[i] === flag.escaping && input[i + 1] === flag.escaping) {
            flag.multiline = true;
            i += 2;
        }
        // now here's the fun part...
        // if you use builtin javascript string, then it's wrong because python3
        // sources are meant to be encoded in utf8 when there's no "encoding
        // header", while in javascript strings are utf16...
        var FORCE_NORMAL = false;
        while (input[i]) {
            if (input[i] === '\\' && !FORCE_NORMAL) {
                var lastEnd = res && res.length ? res[res.length - 1].end : start;
                res.push({ type: TokenType.STRING, "class": TokenClass.STRPART, start: lastEnd, end: i });
                var newI = _expectEscapeSequence(flag)(i, input);
                if (!newI)
                    return ([{ type: TokenType.STRING, "class": TokenClass.ERROR, start: start, end: input.indexOf('\n', i) }]);
                if (newI === true) {
                    res.pop();
                    FORCE_NORMAL = true;
                }
                else {
                    res.push(newI);
                    i = newI.end;
                    start = newI.end;
                }
            }
            else if (input[i] === flag.escaping) {
                // now we have to check if it's a multiline string, because in a
                // multiline string the enclosing character can occur freely as
                // long as there isn't three of them occuring at the same time,
                // e.g. `'''a''a''a'''` evals to "a''a''a", and `'''a'''a''a'''`
                // contains a syntax error.
                if (flag.multiline &&
                    (input[i + 1] && input[i + 2] && input[i + 1] === flag.escaping && input[i + 2] === flag.escaping)
                    ||
                        !flag.multiline) {
                    done = true;
                    i += flag.multiline ? 3 : 1;
                    break;
                }
                else {
                    i += 1;
                }
            }
            else if (_isNewline(input[i])) {
                if (!flag.multiline)
                    return ([{ type: TokenType.STRING, "class": TokenClass.ERROR, start: start, end: input.indexOf('\n', i) }]);
                i += 1;
                FORCE_NORMAL = false;
            }
            else {
                i += 1;
                FORCE_NORMAL = false;
            }
        }
        if (done) {
            res.push({ type: TokenType.STRING, "class": TokenClass.STRPART, start: start, end: i });
            return res;
        }
        else {
            return null;
        }
    };
    var _expectIdentifier = function (i, input) {
        // this function currently does not support unicode character.
        // assuming that an identifier can only be started with letters and
        // underscore, and can only contain letters and numbers.
        if (!(_isAlphabet(input[i]) || input[i] !== '_'))
            return null;
        var start = i;
        i += 1;
        while (_isAlphabet(input[i]) || _isDigit(input[i]) || input[i] === '_')
            i++;
        return ({ type: TokenType.IDENTIFIER, "class": TokenClass.NORMAL, start: start, end: i });
    };
    var _expectSymbol = function (i, input) {
        var start = i;
        var symbolTable = [
            { string: "+=", "class": TokenClass.PLUSEQUAL },
            { string: "-=", "class": TokenClass.MINEQUAL },
            { string: "*=", "class": TokenClass.STAREQUAL },
            { string: "/=", "class": TokenClass.SLASHEQUAL },
            { string: "//=", "class": TokenClass.DOUBLESLASHEQUAL },
            { string: "%=", "class": TokenClass.PERCENTEQUAL },
            { string: "@=", "class": TokenClass.ATEQUAL },
            { string: "&=", "class": TokenClass.AMPEREQUAL },
            { string: "|=", "class": TokenClass.VBAREQUAL },
            { string: "^=", "class": TokenClass.CIRCUMFLEXEQUAL },
            { string: ">>=", "class": TokenClass.RIGHTSHIFTEQUAL },
            { string: "<<=", "class": TokenClass.LEFTSHIFTEQUAL },
            { string: "**=", "class": TokenClass.DOUBLESTAREQUAL },
            { string: '+=', "class": TokenClass.PLUSEQUAL },
            { string: "(", "class": TokenClass.LPAR },
            { string: ")", "class": TokenClass.RPAR },
            { string: "[", "class": TokenClass.LSQB },
            { string: "]", "class": TokenClass.RSQB },
            { string: "{", "class": TokenClass.LBRACE },
            { string: "}", "class": TokenClass.RBRACE },
            { string: ",", "class": TokenClass.COMMA },
            { string: ":", "class": TokenClass.COLON },
            { string: ".", "class": TokenClass.DOT },
            { string: ";", "class": TokenClass.SEMI },
            { string: "@", "class": TokenClass.AT },
            { string: "=", "class": TokenClass.EQUAL },
            { string: "->", "class": TokenClass.RARROW },
            { string: "+", "class": TokenClass.PLUS },
            { string: "-", "class": TokenClass.MINUS },
            { string: "*", "class": TokenClass.STAR },
            { string: "**", "class": TokenClass.DOUBLESTAR },
            { string: "/", "class": TokenClass.SLASH },
            { string: "//", "class": TokenClass.DOUBLESLASH },
            { string: "%", "class": TokenClass.PERCENT },
            { string: "@", "class": TokenClass.AMPER },
            { string: "<<", "class": TokenClass.LEFTSHIFT },
            { string: ">>", "class": TokenClass.RIGHTSHIFT },
            { string: "&", "class": TokenClass.AMPEREQUAL },
            { string: "|", "class": TokenClass.VBAR },
            { string: "^", "class": TokenClass.CIRCUMFLEX },
            { string: "~", "class": TokenClass.TILDE },
            { string: "<", "class": TokenClass.LESS },
            { string: ">", "class": TokenClass.GREATER },
            { string: "<=", "class": TokenClass.LESSEQUAL },
            { string: ">=", "class": TokenClass.GREATEREQUAL },
            { string: "==", "class": TokenClass.EQEQUAL },
            { string: "!=", "class": TokenClass.NOTEQUAL },
        ];
        for (var _i in symbolTable) {
            if (input.startsWith(symbolTable[_i].string, i)) {
                return ({ type: TokenType.SYMBOL, "class": symbolTable[_i]["class"], start: start, end: i + symbolTable[_i].string.length });
            }
        }
        return null;
    };
    var _expectWhitespace = function (i, input) {
        // note 2019.6.8: this version of lexer is just for syntax highlighting
        // so no special treatment for indentation.
        var start = i;
        var _i = 0;
        while (_isWhitespace(input[i + _i]))
            _i += 1;
        if (_i === 0)
            return null;
        return ({ type: TokenType.WHITESPACE, "class": TokenClass.NORMAL, start: start, end: i + _i });
    };
    var _expectComment = function (i, input) {
        // this function expects that input[i] points to the hash character.
        var start = i;
        i += 1;
        while (input[i] && !_isNewline(input[i]))
            i += 1;
        return ({ type: TokenType.COMMENT, "class": TokenClass.NORMAL, start: start, end: i });
    };
    var _lex = function (input) {
        var res = [];
        var i = 0;
        while (input[i]) {
            if (_isWhitespace(input[i])) {
                var matchres_1 = _expectWhitespace(i, input);
                if (matchres_1) {
                    res.push(matchres_1);
                    i = matchres_1.end;
                    continue;
                }
            }
            if (_isDigit(input[i]) || input[i] === '.') {
                var matchres_2 = _expectNumber(i, input);
                if (matchres_2) {
                    res.push(matchres_2);
                    i = matchres_2.end;
                    continue;
                }
            }
            if ('rbuf\'\"'.includes(input[i])) {
                var matchres_3 = _expectString(i, input);
                if (matchres_3 && matchres_3.length) {
                    res = res.concat(matchres_3);
                    i = matchres_3[matchres_3.length - 1].end;
                    continue;
                }
            }
            if (input[i] === '_' || _isAlphabet(input[i])) {
                var matchres_4 = _expectIdentifier(i, input);
                if (matchres_4) {
                    var prevI = res.length ? res[res.length - 1].end : 0;
                    var pattern = input.substring(prevI, matchres_4.end);
                    res.push(RESERVED_WORDS.includes(pattern) ?
                        ({ type: TokenType.KEYWORD, "class": TokenClass.NORMAL, start: matchres_4.start, end: matchres_4.end })
                        : matchres_4);
                    i = matchres_4.end;
                    continue;
                }
            }
            if (input[i] === '#') {
                var matchres_5 = _expectComment(i, input);
                if (matchres_5) {
                    res.push(matchres_5);
                    i = matchres_5.end;
                    continue;
                }
            }
            var matchres = _expectSymbol(i, input);
            if (matchres) {
                res.push(matchres);
                i = matchres.end;
                continue;
            }
            else {
                var lineEnd = input.indexOf('\n', i);
                if (lineEnd === -1)
                    lineEnd = input.length;
                res.push({ type: TokenType.PLAIN, "class": TokenClass.ERROR, start: i, end: lineEnd });
                i = lineEnd;
                continue;
            }
        }
        return res;
    };

    var Lexer = /*#__PURE__*/Object.freeze({
        get _LSTATENUM () { return _LSTATENUM; },
        _expectNumber: _expectNumber,
        _expectEscapeSequence: _expectEscapeSequence,
        _expectString: _expectString,
        _expectIdentifier: _expectIdentifier,
        _expectSymbol: _expectSymbol,
        _expectWhitespace: _expectWhitespace,
        _expectComment: _expectComment,
        _lex: _lex
    });

    var Test = /** @class */ (function () {
        function Test() {
        }
        Test.Lexer = Lexer;
        Test.Token = Token;
        return Test;
    }());

    return Test;

}());
//# sourceMappingURL=bundle.js.map

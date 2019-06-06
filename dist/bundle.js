var Plywood = (function () {
    'use strict';

    var Test2 = /** @class */ (function () {
        function Test2() {
        }
        Test2.hello = function () {
            console.log('hello');
        };
        return Test2;
    }());

    var TokenType;
    (function (TokenType) {
        TokenType[TokenType["PLAIN"] = 0] = "PLAIN";
        TokenType[TokenType["NUMBER"] = 1] = "NUMBER";
        TokenType[TokenType["STRING"] = 2] = "STRING";
        TokenType[TokenType["IDENTIFIER"] = 3] = "IDENTIFIER";
        TokenType[TokenType["KEYWORD"] = 4] = "KEYWORD";
        TokenType[TokenType["COMMENT"] = 5] = "COMMENT";
        TokenType[TokenType["EDITOR_PLACEHOLDER"] = 6] = "EDITOR_PLACEHOLDER";
    })(TokenType || (TokenType = {}));
    var TokenClass;
    (function (TokenClass) {
        // NUMBER
        TokenClass[TokenClass["INTEGER"] = 0] = "INTEGER";
        TokenClass[TokenClass["FLOAT"] = 1] = "FLOAT";
        TokenClass[TokenClass["COMPLEX"] = 2] = "COMPLEX";
    })(TokenClass || (TokenClass = {}));

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
    var _isNonZeroDigit = function (x) { return x >= '1' && x <= '9'; };
    var _isDigit = function (x) { return x >= '0' && x <= '9'; };
    var _isHexDigit = function (x) { return (x >= 'a' && x <= 'z') || (x >= 'A' && x <= 'Z') || _isDigit(x); };
    var _isBinDigit = function (x) { return x === '0' || x === '1'; };
    var _isOctDigit = function (x) { return x >= '0' && x <= '7'; };
    var _expectNumber = function (input) {
        var i = 0;
        var st = _LSTATENUM.START;
        var lastst = null;
        var inputlen = input.length;
        while (input[i] && st != _LSTATENUM.STOP) {
            console.log(_LSTATENUM[st]);
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
        console.log(_LSTATENUM[lastst]);
        switch (lastst) {
            case _LSTATENUM.J_1:
                {
                    return ({ type: TokenType.NUMBER, "class": TokenClass.COMPLEX, i: i });
                }
            case _LSTATENUM.FR_1_1:
            case _LSTATENUM.FLOAT_1:
            case _LSTATENUM.FR_E_E:
                {
                    return ({ type: TokenType.NUMBER, "class": TokenClass.FLOAT, i: i });
                }
            case _LSTATENUM.DIGIT_1:
            case _LSTATENUM.ZERO_1:
            case _LSTATENUM.ZERO_E:
            case _LSTATENUM.ZERO_3:
            case _LSTATENUM.BIN_1:
            case _LSTATENUM.OCT_1:
            case _LSTATENUM.HEX_1:
                {
                    return ({ type: TokenType.NUMBER, "class": TokenClass.INTEGER, i: i });
                }
            default: {
                return null;
            }
        }
    };

    var Test = /** @class */ (function () {
        function Test() {
        }
        Test.hello = function () {
            console.log('hello');
            Test2.hello();
            Test2.hello();
        };
        Test.expectNumber = _expectNumber;
        return Test;
    }());

    return Test;

}());
//# sourceMappingURL=bundle.js.map

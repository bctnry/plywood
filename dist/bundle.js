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
    //# sourceMappingURL=main2.js.map

    var Test = /** @class */ (function () {
        function Test() {
        }
        Test.hello = function () {
            console.log('hello');
            Test2.hello();
            Test2.hello();
        };
        return Test;
    }());
    //# sourceMappingURL=main.js.map

    return Test;

}());
//# sourceMappingURL=bundle.js.map

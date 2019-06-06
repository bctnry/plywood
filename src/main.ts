import Test2 from "./main2";
import { _expectNumber } from './Lexer';

class Test {
    public static expectNumber = _expectNumber;
    public static hello() {
        console.log('hello');
        Test2.hello();
        Test2.hello();
    }
}

export default Test;

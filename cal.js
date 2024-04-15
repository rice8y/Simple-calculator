const rst = document.getElementById("result");
const cop = document.getElementById("consoleOutput");
let lastInputIsOperator = false;
let countIndex = 0;
let piPressed = false;
let sqrtPressed = false;
let logPressed = false;
let lnPressed = false;
let inputBuffer = '';
let capturingInput = false;
rst.style.fontFamily = "STIXT2Math";

function clear() {
    document.getElementById("result").value = "";
}

document.addEventListener("keydown", pressed);

function calculate() {
    const expression = rst.value;
    let inputValue = rst.value.replace(/π/g, Math.PI).replace(/e/g, Math.E);
    if (!checkParentheses(inputValue)) {
        rst.value = "Parentheses mismatch error";
        setTimeout(() => {
            rst.value = expression;
        }, 1300);
        return;
    }

    inputValue = sqrt(inputValue);
    inputValue = log(inputValue);
    inputValue = ln(inputValue);
    inputValue = evaluateTrigonometric(inputValue);

    const calculateValue = eval(inputValue || null);
    if (isNaN(calculateValue)) {
        rst.value = "NaN";
        setTimeout(() => {
            rst.value = expression;
        }, 1300);
    } else if (calculateValue == null) {
        rst.value = "Invalid input value";
        setTimeout(() => {
            rst.value = expression;
        }, 1300);
    } else {
        rst.value = calculateValue;
        displayConsoleOutput(expression + " = " + rst.value);
    }
}

document.addEventListener("keydown", function (event) {
    event.preventDefault();
    if (event.key === "\\" && !capturingInput) {
        capturingInput = true;
        inputBuffer = "";
    } else if (event.key === "Tab" && capturingInput) {
        capturingInput = false;
        const extractedText = inputBuffer;
        if (isTrig(extractedText) || isLog(extractedText)) {
            display(extractedText);
            lastInputIsOperator = false;
        } else if (extractedText === "sqrt") {
            display('√');
            lastInputIsOperator = false;
        } else if (extractedText === "pi") {
            display('π');
            lastInputIsOperator = false;
        } else if (extractedText === "e") {
            display('e');
            lastInputIsOperator = false;
        }
    } else if (capturingInput) {
        inputBuffer += event.key;
    }
});

function pressed(btn) {
    btn.preventDefault();
    if (btn.key === "0" || btn.key === "1" || btn.key === "2" || btn.key === "3" || btn.key === "4" || btn.key === "5" || btn.key === "6" || btn.key === "7" || btn.key === "8" || btn.key === "9" || btn.key === "." || btn.key === "(" || btn.key === ")") {
        display(btn.key);
        lastInputIsOperator = false;
    } else if (btn.key === "@") {
        display('+/-');
    }
    else if (btn.key === "+" || btn.key === "-" || btn.key === "*" || btn.key === "/") {
        display(btn.key);
        lastInputIsOperator = true;
    } else if (btn.key === "Backspace") {
        backSpace();
    } else if (btn.key === "Delete") {
        clear();
    } else if (btn.key === "Insert") {
        clearConsoleOutput();
    }
    else if
        (btn.key === "=" || btn.key === "Enter") {
        calculate(result.value);
    }
}

function sqrt(expression) {
    let result = expression;
    const regex = /√\(([^()]+)\)/g;
    let match;

    while ((match = regex.exec(expression)) !== null) {
        const innerExpression = match[1];
        const innerResult = Math.sqrt(evaluateExpression(innerExpression));
        result = result.replace(match[0], innerResult);
    }

    result = result.replace(/√\(\)/g, "");

    return result;
}


function checkParentheses(expression) {
    const stack = [];
    for (let char of expression) {
        if (char === '(') {
            stack.push('(');
        } else if (char === ')') {
            if (stack.length === 0) {
                return false;
            }
            stack.pop();
        }
    }
    return stack.length === 0;
}

function isOperator(val) {
    return val === "+" || val === "-" || val === "*" || val === "/";
}

function isNumeric(val) {
    return !isNaN(parseFloat(val)) && isFinite(val);
}

function isSymbol(val) {
    return val === "π" || val === "e";
}

function isTrig(val) {
    return val === "sin" || val === "cos" || val === "tan" || val === "asin" || val === "acos" || val === "atan" || val === "sinh" || val === "cosh" || val === "tanh";
}

function isRoot(val) {
    return val === "√";
}

function isLog(val) {
    return val === "log" || val === "ln";
}

function isEmpty(val) {
    return val === "";
}

function isRightParentheses(val) {
    return val === ")";
}

function isLeftParentheses(val) {
    return val === "(";
}

function isDecimalPoint(val) {
    return val === ".";
}

function isSpecial(val) {
    return isTrig(val) || isRoot(val) || isLog(val);
}

function isZero(val) {
    return val === "0";
}

function countDecimalPoint() {
    let cnt = 0;
    for (let char of rst.value) {
        if (char === ".") {
            cnt++;
        }
    }
    return cnt;
}

function display(val) {
    if (!rst.value) {
        rst.value = "";
    }
    const lastChar = rst.value.charAt(rst.value.length - 1);

    if ((!isOperator(val) || !lastInputIsOperator) && !(isNumeric(val) && isSymbol(lastChar)) && (!(isSymbol(val) && isNumeric(lastChar)) || (isSymbol(lastChar) && isOperator(val))) && !(isSymbol(val) && isSymbol(lastChar)) && !(isOperator(val) && isEmpty(lastChar)) && !(isRightParentheses(val) && isEmpty(lastChar)) && !(isDecimalPoint(val) && isEmpty(lastChar)) && !(isDecimalPoint(val) && isDecimalPoint(lastChar)) && !(isZero(val) && isZero(lastChar) && (rst.value.length == 1)) && !(isDecimalPoint(val) && (countDecimalPoint() >= 1)) && !(isZero(lastChar) && (rst.value.length == 1) && isNumeric(val)) && !(isNumeric(lastChar) && isSpecial(val)) && !(isLeftParentheses(lastChar) && isOperator(val)) && !(isOperator(lastChar) && isRightParentheses(val))) {
        if (isRoot(val) || isTrig(val) || isLog(val)) {
            rst.value += val + "(";
            lastInputIsOperator = false;
        } else if (val === "+/-") {
            if (rst.value.charAt(0) === '-') {
                rst.value = rst.value.slice(1);
            }
            else {
                rst.value = "-" + rst.value;
            }
        } else {
            rst.value += val;
        }
        if (isOperator(val)) {
            lastInputIsOperator = true;
        } else {
            lastInputIsOperator = false;
        }
    }
}

function evaluateParentheses(expression) {
    let result = expression;
    const regex = /\(([^()]+)\)/g;
    let match;

    while ((match = regex.exec(expression)) !== null) {
        const innerExpression = match[1];
        const innerResult = evaluateExpression(innerExpression);
        result = result.replace(match[0], innerResult);
    }

    return result;
}

function evaluateExpression(expression) {
    try {
        return eval(expression);
    } catch (error) {
        return NaN;
    }
}

function evaluateTrigonometric(expression) {
    let result = expression;
    const regex = /(\b(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh)\(([^()]+)\))/g;


    let match;
    while ((match = regex.exec(expression)) !== null) {
        const func = match[2];
        const innerExpression = match[3];
        const innerResult = Decimal(evaluateExpression(innerExpression))[func]().toDecimalPlaces(12);
        result = result.replace(match[0], innerResult);
    }

    result = result.replace(/(sin|cos|tan|asin|acos|atan|sinh|cosh|tanh)\(([^()]*)\)/g, "");

    return result;
}

function log(expression) {
    let result = expression;
    const regex = /log\(([^()]+)\)/g;
    let match;

    while ((match = regex.exec(expression)) !== null) {
        const innerExpression = match[1];
        const innerResult = Decimal(evaluateExpression(innerExpression)).log().toDecimalPlaces(10);
        result = result.replace(match[0], innerResult);
    }

    result = result.replace(/log\(\)/g, "");

    return result;
}

function ln(expression) {
    let result = expression;
    const regex = /ln\(([^()]+)\)/g;
    let match;

    while ((match = regex.exec(expression)) !== null) {
        const innerExpression = match[1];
        const innerResult = Decimal(evaluateExpression(innerExpression)).ln().toDecimalPlaces(10);
        result = result.replace(match[0], innerResult);
    }

    result = result.replace(/ln\(\)/g, "");

    return result;
}

function backSpace() {
    const resultInput = rst.value;
    rst.value = resultInput.substring(0, rst.value.length - 1);
}

function displayConsoleOutput(message) {
    const scrollDown = cop.scrollHeight - cop.clientHeight <= cop.scrollTop + 1;

    countIndex++;
    cop.innerHTML += "[" + countIndex + "]: " + message + "<br>";

    if (scrollDown) {
        cop.scrollTop = cop.scrollHeight - cop.clientHeight;
    }
    cop.style.fontFamily = "STIXT2Math";
}

function clearConsoleOutput() {
    cop.innerHTML = "";
    countIndex = 0;
}
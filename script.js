// Calculator state variables
let displayValue = '0';
let firstOperand = null;
let waitingForOperand = false;
let operator = null;
let justCalculated = false;

// Get display element
const display = document.getElementById('display');

// Basic math operations
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "Nice try, genius! 🤓";
    }
    return a / b;
}

// Main operate function
function operate(operator, a, b) {
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '×':
            return multiply(a, b);
        case '÷':
            return divide(a, b);
        default:
            return b;
    }
}

// Update display
function updateDisplay() {
    display.textContent = displayValue;
}

// Handle number input
function inputDigit(digit) {
    if (justCalculated) {
        // Start fresh calculation after showing result
        displayValue = digit;
        justCalculated = false;
    } else if (waitingForOperand) {
        displayValue = digit;
        waitingForOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
}

// Handle decimal point
function inputDecimal() {
    if (justCalculated) {
        displayValue = '0.';
        justCalculated = false;
    } else if (waitingForOperand) {
        displayValue = '0.';
        waitingForOperand = false;
    } else if (displayValue.indexOf('.') === -1) {
        displayValue += '.';
    }
    updateDisplay();
}

// Handle operator input
function inputOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator && !waitingForOperand) {
        // Perform calculation with previous operator
        const currentValue = firstOperand || 0;
        const newValue = operate(operator, currentValue, inputValue);

        // Handle division by zero error
        if (typeof newValue === 'string') {
            displayValue = newValue;
            firstOperand = null;
            operator = null;
            waitingForOperand = true;
            justCalculated = true;
            updateDisplay();
            return;
        }

        // Round long decimals to prevent overflow
        displayValue = String(Math.round(newValue * 100000000) / 100000000);
        firstOperand = newValue;
        updateDisplay();
    }

    waitingForOperand = true;
    operator = nextOperator;
    justCalculated = false;
}

// Handle equals
function calculate() {
    const inputValue = parseFloat(displayValue);

    if (firstOperand !== null && operator && !waitingForOperand) {
        const newValue = operate(operator, firstOperand, inputValue);

        // Handle division by zero error
        if (typeof newValue === 'string') {
            displayValue = newValue;
            firstOperand = null;
            operator = null;
            waitingForOperand = true;
            justCalculated = true;
            updateDisplay();
            return;
        }

        // Round long decimals to prevent overflow
        displayValue = String(Math.round(newValue * 100000000) / 100000000);
        firstOperand = null;
        operator = null;
        waitingForOperand = true;
        justCalculated = true;
        updateDisplay();
    }
}

// Clear calculator
function clear() {
    displayValue = '0';
    firstOperand = null;
    waitingForOperand = false;
    operator = null;
    justCalculated = false;
    updateDisplay();
}

// Backspace function
function backspace() {
    if (justCalculated) {
        clear();
        return;
    }
    
    if (displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1);
    } else {
        displayValue = '0';
    }
    updateDisplay();
}

// Event listeners for button clicks
document.querySelector('.buttons').addEventListener('click', (e) => {
    const target = e.target;
    const buttonText = target.textContent;

    // Handle different button types
    if (target.matches('div')) {
        if ('0123456789'.includes(buttonText)) {
            inputDigit(buttonText);
        } else if (buttonText === '.') {
            inputDecimal();
        } else if ('+-×÷'.includes(buttonText)) {
            inputOperator(buttonText);
        } else if (buttonText === '=') {
            calculate();
        } else if (buttonText === 'C') {
            clear();
        } else if (buttonText === '⌫') {
            backspace();
        }
    }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/=.'.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        e.preventDefault();
    }

    if ('0123456789'.includes(key)) {
        inputDigit(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (key === '+') {
        inputOperator('+');
    } else if (key === '-') {
        inputOperator('-');
    } else if (key === '*') {
        inputOperator('×');
    } else if (key === '/') {
        inputOperator('÷');
    } else if (key === '=' || key === 'Enter') {
        calculate();
    } else if (key === 'Escape') {
        clear();
    } else if (key === 'Backspace') {
        backspace();
    }
});

// Initialize display
updateDisplay();
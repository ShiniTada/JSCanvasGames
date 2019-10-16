var openBracket = 0;
var nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var activeOperands = ['+', '-', '*', '/'];
var answer = 0;
var maxNumberLength = 12;

var numsInInputVar = [];
var filledNumber = '';
var hasDot = false;
var firstIsZero = false;

function createNumber(num) {
    if(filledNumber.length <= maxNumberLength) {
        if (((num !== '.') && !(num == '0' && filledNumber.length === 1 && firstIsZero == true)) || (num === '.' && hasDot == false)) {
            getNumber(num);
            filledNumber += String(num);
        }
    }
}

function deleteFirstZero() {
    if(filledNumber.length == 1 && firstIsZero === true) {
        filledNumber = filledNumber.substring(0, filledNumber.length - 1);
        var input_var = document.getElementById('input');
        var temp = input_var.value;
        temp = temp.substring(0, temp.length - 1);
        input_var.value = temp;
        firstIsZero = false;
    }

}

function getNumber(num) {
    var inputVar = document.getElementById('input');
    switch (num) {
        case 0:
            if(filledNumber.length === 0) {
                firstIsZero = true;
            }
            inputVar.value += '0';
            break;
        case 1:
            deleteFirstZero();
            inputVar.value += '1';
            break;
        case 2:
            deleteFirstZero();
            inputVar.value += '2';
            break;
        case 3:
            deleteFirstZero();
            inputVar.value += '3';
            break;
        case 4:
            deleteFirstZero();
            inputVar.value += '4';
            break;
        case 5:
            deleteFirstZero();
            inputVar.value += '5';
            break;
        case 6:
            deleteFirstZero();
            inputVar.value += '6';
            break;
        case 7:
            deleteFirstZero();
            inputVar.value += '7';
            break;
        case 8:
            deleteFirstZero();
            inputVar.value += '8';
            break;
        case 9:
            deleteFirstZero();
            inputVar.value += '9';
            break;
        case '.':
            inputVar.value += '.';
            hasDot = true;
            break;
    }

}


function saveNumber() {
    if(filledNumber !== '' ) {
        numsInInputVar.push(filledNumber);
        hasDot = false;
        filledNumber = '';
    }
}

function returnToPreviousFilledNumber() {
    filledNumber = numsInInputVar.pop();
    numsInInputVar.slice(numsInInputVar.length - 1, 1);
    if(filledNumber !== undefined) {
        hasDot = (~filledNumber.indexOf("."));
        var haveFirstZero = filledNumber.match( /0+\d*/i );
        if(haveFirstZero != null) {
            firstIsZero = true;
        }
    }
}

function getOperand(operand) {
    saveNumber();
    var inputVar = document.getElementById('input');
    checkHaveAnswer();
    var temp = inputVar.value;
    var lastSymbol =  temp.substring(temp.length - 1,  temp.length);
    for(var index = 0; index < activeOperands.length; index++) {
        if(lastSymbol === activeOperands[index]) {
            backspace();
        }
    }
    if (lastSymbol !== '(') {
        switch (operand) {
            case '+' :
                inputVar.value += '+';
                hasDot = false;
                break;
            case '-' :
                inputVar.value += '-';
                hasDot = false;
                break;
            case 'x' :
                inputVar.value += '*';
                hasDot = false;
                break;
            case '/' :
                inputVar.value += '/';
                hasDot = false;
                break;
            case '+/-' :
                inputVar.value = '-(' + inputVar.value + ')';
                break;
        }
    }
    else if(operand === '-') {
        inputVar.value += '-';
    }
}

function brackets() {
    saveNumber();
    var inputVar = document.getElementById('input');
    var temp = inputVar.value;
    var lastSymbol =  temp.substring(temp.length - 1,  temp.length);

    if(temp === '') {
        inputVar.value += '(';
        openBracket++;
    } else if(openBracket === 0) {
        var lastNumber = false;
        for (var index = 0; index < nums.length; index++) {
            if (lastSymbol === nums[index]) {
                inputVar.value += '*(';
                openBracket++;
                lastNumber = true;
            }
        }
        if(lastNumber === false) {
            if(lastSymbol === ')') {
                inputVar.value += '*(';
            } else {
                inputVar.value += '(';
            }
            openBracket++;
        }

    } else {
        var addClose = false;
        for (var index = 0; index < nums.length; index++) {
            if (lastSymbol === nums[index]) {
                inputVar.value += ')';
                openBracket--;
                addClose = true;
            }
        }
        if(lastSymbol === ')') {
            inputVar.value += ')';
            openBracket--;
            addClose = true;
        }
        if(addClose === false) {
            inputVar.value += '(';
            openBracket++;
        }
    }
}

function buttonOpenBracket() {
    saveNumber();
    var inputVar = document.getElementById('input');
    inputVar.value += '(';
    openBracket++;
}


function buttonCloseBracket() {
    saveNumber();
    var inputVar = document.getElementById('input');
    inputVar.value += ')';
    openBracket--;
}

function clearScreen() {
    document.getElementById('input').value = "";
    document.getElementById('answer').value = "";
    openBracket = 0;
    hasDot = false;
    firstIsZero = false;
    filledNumber = '';
    answer = 0;
    numsInInputVar = [];
}


function backspace() {
    console.log(numsInInputVar);
    var input_var = document.getElementById('input');
    var temp = input_var.value;
    if(temp.length > 0) {
        var shouldBeDeleted = temp.substring(temp.length - 1, temp.length);
        if(shouldBeDeleted === '.') {
            hasDot = false;
            filledNumber = filledNumber.substring(0, filledNumber.length - 1);
        }
        if(shouldBeDeleted === ')') {
            openBracket++;
            returnToPreviousFilledNumber();
        }
        if(shouldBeDeleted === '(') {
            openBracket--;
        }
        if(shouldBeDeleted === '+' || shouldBeDeleted === '-' ||
            shouldBeDeleted === '*' || shouldBeDeleted === '/') {
            var previous = temp.substring(temp.length - 2, temp.length - 1);
            if(previous !== ')') {
                returnToPreviousFilledNumber();
            }
        }
        if(shouldBeDeleted === '0' && filledNumber.length === 1) {
            firstIsZero = false;
        }
        for(var index = 0; index < nums.length; index++) {
            if(shouldBeDeleted === nums[index]) {
                filledNumber = filledNumber.substring(0, filledNumber.length - 1);
            }
        }
        temp = temp.substring(0, temp.length - 1);
        input_var.value = temp;
    }
    console.log("filledNumber " + filledNumber);
}

function compute() {
    var inputVar = document.getElementById('input');
    answer = eval(inputVar.value);
    if (answer == 'Infinity'  || answer == '-Infinity'|| isNaN(answer)) {
        document.getElementById('answer').value = '=Error';
    } else {
        var longAnswer = String(answer).match(/\d{7}\d+/i);
        var longAnswerTail = String(answer).match(/.*\.\d{5}\d+/i);
        if (longAnswer != null) {
            answer = answer.toExponential();
        } else if (longAnswerTail != null) {
            answer = answer.toExponential();
        }
        document.getElementById('answer').value = '=' + answer;
    }
}



function checkHaveAnswer() {
    var inputVar = document.getElementById('input');
    if(answer !== 0) {
        var longAnswer = String(answer).match( /\d*e.*/i );
        if(longAnswer != null) {
            inputVar.value = '(' + answer + ')';
        } else {
            inputVar.value = answer;
        }
        hasDot = false;
        filledNumber = '';
        numsInInputVar = [];
        numsInInputVar.push(String(answer));
        answer = 0;
        document.getElementById('answer').value = '';
    }
}

(function() {
    this.addEventListener("keypress", function(e) {
        e.preventDefault();
        if (e.keyCode === 40) {
            buttonOpenBracket();
        }
        if (e.keyCode === 41) {
            buttonCloseBracket();
        }

        if (e.keyCode === 13 || e.keyCode === 61) {
            compute();
        }
        if(e.keyCode === 8) {
            backspace();
        }
        for(var number = 0, code = 48; code <= 57; number++, code++) {
            if(e.keyCode === code) {
                createNumber(number);
            }
        }
        if(e.keyCode === 42) {
            getOperand('x');
        }
        if(e.keyCode === 43) {
            getOperand('+');
        }
        if(e.keyCode === 45) {
            getOperand('-');
        }
        if(e.keyCode === 46) {
            createNumber('.');
        }
        if(e.keyCode === 47) {
            getOperand('/');
        }
    });
})();


(function() {
    this.addEventListener("keydown", function(e) {
        if(e.keyCode === 8) {
            backspace();
        }
    });
})();


















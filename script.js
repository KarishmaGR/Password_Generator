console.log("hello world")


const Slider_length = document.querySelector("[data_sliderlength]");
const lengthDisp = document.querySelector('[data-length]');
const reset = document.getElementById('#reset');
const password_display = document.querySelector('[data-passwordDisplay]');
const copymsg = document.querySelector('[data-copyMsg]');
const copybtn = document.querySelector('[data-copyBtn]');
const UppercaseCheck = document.querySelector('#uppercase');
const LowercaseCheck = document.querySelector('#lowercase');
const NumberCheck = document.querySelector('#number');
const SymbolCheck = document.querySelector('#symbol');
const indicator = document.querySelector('[data-indecator]');
const Password_Genrator = document.querySelector('.generate-password');
const allCheckbox = document.querySelectorAll("input[type=checkbox]");

const Symbols = '~!@#$%^&*(){}[]":><.,?/||_-+;';

let password = "";
let passwordLength = 10;
let Checkcount = 0;
handleSlider();
function handleSlider() {
    Slider_length.value = passwordLength;
    lengthDisp.innerText = passwordLength;
    const min = Slider_length.min;
    const max = Slider_length.max;
    Slider_length.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "%100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
setIndicator("#ccc")
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;

}

function generateNumber() {
    return getRandomInteger(0, 9);
}

function gnerateUppercase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateLowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateSymbol() {
    const randomNumber = getRandomInteger(0, Symbols.length);
    return Symbols.charAt(randomNumber);
}


function calStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (UppercaseCheck.checked) hasUpper = true;
    if (LowercaseCheck.checked) hasLower = true;
    if (NumberCheck.checked) hasNumber = true;
    if (SymbolCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");

    } else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }

}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(password_display.value);
        copymsg.innerText = "Coppied"
    }
    catch (e) {
        copymsg.innerText = "Failed";
    }

    copymsg.classList.add("active");
    setTimeout(() => {
        copymsg.classList.remove("active");
    }, 2000);


}

Slider_length.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copybtn.addEventListener('click', (e) => {
    if (password_display.value) {
        copyContent();
    }
})
//handle checkbox count
function handleCheckBoxChange() {
    Checkcount = 0;
    allCheckbox.forEach((checkbox) => {
        if (checkbox.checked) {
            Checkcount++;
        }
    });
    if (passwordLength < Checkcount) {
        passwordLength = Checkcount;
        handleSlider();
    }
}
//check if check box are clicked or not
allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});


//creating function for suffle the generated password
function sufflePassword(array) {
    for (let i = array.length; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[j];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => {
        str += el;
    })
    return str;
}
Password_Genrator.addEventListener('click', () => {
    if (Checkcount == 0) {
        return;
    }
    if (passwordLength < Checkcount) {
        passwordLength = Checkcount;
        handleSlider();
    }

    password = "";

    //create a empty arr for storing all the funciton which generate random values;
    let funcArr = [];

    if (UppercaseCheck.checked) {
        funcArr.push(gnerateUppercase);
    }
    if (LowercaseCheck.checked) {
        funcArr.push(generateLowercase);
    }
    if (NumberCheck.checked) {
        funcArr.push(generateNumber);
    }

    if (SymbolCheck.checked) {
        funcArr.push(generateSymbol);
    }

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randomIdx = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIdx]();
    }

    password = sufflePassword(Array.from(password));
    password_display.value = password;
    calStrength();
})


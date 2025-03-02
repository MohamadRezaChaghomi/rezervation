var $ = document
let national_code_Register = $.getElementById('national_code_Register');
let phone_number_Register = $.getElementById('phone_number_Register');
let password_Register = $.getElementById('password_Register');
let password_second_Register = $.getElementById('password_second_Register');
let btn_signup = $.getElementById('btn_signup');

function createErrorSpan(element, message) {
    if (!element) return;
    let span = document.createElement("span");
    span.className = "font-size-12 text-danger d-none";
    span.innerText = message;
    element.parentNode.appendChild(span);
    return span;
}

let underNationalIdEmptyRegister = createErrorSpan(national_code_Register, "کد ملی نمی‌تواند خالی باشد");
let underPhoneEmptyRegister = createErrorSpan(phone_number_Register, "شماره تلفن نمی‌تواند خالی باشد");
let underPasswordEmptyRegister = createErrorSpan(password_Register, "رمز عبور نمی‌تواند خالی باشد");
let underConfirmPasswordEmptyRegister = createErrorSpan(password_second_Register, "تکرار رمز عبور نمی‌تواند خالی باشد");
let underPasswordMismatch = createErrorSpan(password_second_Register, "رمز عبور و تکرار آن یکسان نیستند");


btn_Register.addEventListener("click", () => {
    let isValid = true;

    if (national_code_Register.value.trim() === "") {
        underNationalIdEmptyRegister.classList.remove('d-none');
        isValid = false;
    } else {
        underNationalIdEmptyRegister.classList.add('d-none');
    }

    if (phone_number_Register.value.trim() === "") {
        underPhoneEmptyRegister.classList.remove('d-none');
        isValid = false;
    } else {
        underPhoneEmptyRegister.classList.add('d-none');
    }

    if (password_Register.value.trim() === "") {
        underPasswordEmptyRegister.classList.remove('d-none');
        isValid = false;
    } else {
        underPasswordEmptyRegister.classList.add('d-none');
    }

    if (password_second_Register.value.trim() === "") {
        underConfirmPasswordEmptyRegister.classList.remove('d-none');
        isValid = false;
    } else {
        underConfirmPasswordEmptyRegister.classList.add('d-none');
    }

    if (password_Register.value.trim() !== password_second_Register.value.trim()) {
        underPasswordMismatch.classList.remove('d-none');
        isValid = false;
    } else {
        underPasswordMismatch.classList.add('d-none');
    }

    if (!isValid) return;


    let userData = {
        "national_code": national_code_Register.value,
        "phone": phone_number_Register.value,
        "password": password_Register.value,
    };

    fetch('http://avatoop.com/marina_kish/api/register', {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(response => console.log(response))
});
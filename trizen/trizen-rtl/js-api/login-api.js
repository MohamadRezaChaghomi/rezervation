let national_code_login = document.getElementById('national_code_login');
let password_login = document.getElementById('password_login');
let btn_login = document.getElementById('btn_login');

function createErrorSpan(element, message) {
    if (!element) return;
    let span = document.createElement("span");
    span.className = "font-size-12 text-danger d-none";
    span.innerText = message;
    element.parentNode.appendChild(span);
    return span;
}

let underNationalIdEmptyLogin = createErrorSpan(national_code_login, "کد ملی نمی‌تواند خالی باشد");
let underPasswordEmptyLogin = createErrorSpan(password_login, "رمز عبور نمی‌تواند خالی باشد");
let underNationalIdWrong = createErrorSpan(national_code_login, "کد ملی اشتباه است");
let underPasswordWrong = createErrorSpan(password_login, "گذرواژه اشتباه است");


btn_login.addEventListener("click", () => {
    let isValid = true;

    if (national_code_login.value.trim() === "") {
        underNationalIdEmptyLogin.classList.remove('d-none');
        isValid = false;
    } else {
        underNationalIdEmptyLogin.classList.add('d-none');
    }

    if (password_login.value.trim() === "") {
        underPasswordEmptyLogin.classList.remove('d-none');
        isValid = false;
    } else {
        underPasswordEmptyLogin.classList.add('d-none');
    }

    if (!isValid) return;

    underNationalIdWrong.classList.add('d-none');
    underPasswordWrong.classList.add('d-none');

    let userData = {
        "national_code": national_code_login.value,
        "password": password_login.value,
    };

    fetch('http://avatoop.com/marina_kish/api/login', {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            'Accept': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data === 'national_code wrong') {
            underNationalIdWrong.classList.remove('d-none');
        }

        if (data === 'password wrong') {
            underPasswordWrong.classList.remove('d-none');
        }

        if (data.token) {
            localStorage.setItem("Token", data.token);
            localStorage.setItem("role", data.role);

            if (data.role.includes('admin')) {
                window.location.href = "admin-dashboard.html";
            } else {
                window.location.reload()
            }
        }
        console.log(data)
    })
    .catch(error => {
        console.error('خطا در ورود:', error);
    });
});
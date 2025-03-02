let national_code_login = document.getElementById('national_code_login');
let password_login = document.getElementById('password_login');
let btn_login = document.getElementById('btn_login');

let underNationalIdEmptyLogin = document.createElement("span");
underNationalIdEmptyLogin.className = "font-size-12 text-danger d-none";
underNationalIdEmptyLogin.innerText = "کد ملی نمی‌تواند خالی باشد";
national_code_login.parentNode.appendChild(underNationalIdEmptyLogin);

let underPasswordEmptyLogin = document.createElement("span");
underPasswordEmptyLogin.className = "font-size-12 text-danger d-none";
underPasswordEmptyLogin.innerText = "رمز عبور نمی‌تواند خالی باشد";
password_login.parentNode.appendChild(underPasswordEmptyLogin);

let underNationalIdWrong = document.createElement("span");
underNationalIdWrong.className = "font-size-12 text-danger d-none";
underNationalIdWrong.innerText = "کد ملی اشتباه است";
national_code_login.parentNode.appendChild(underNationalIdWrong);

let underPasswordWrong = document.createElement("span");
underPasswordWrong.className = "font-size-12 text-danger d-none";
underPasswordWrong.innerText = "گذرواژه اشتباه است";
password_login.parentNode.appendChild(underPasswordWrong);

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
            "content-type": "application/json"
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

            console.log(localStorage)


            if (data.role.includes('admin')) {
                window.location.href = "admin-dashboard.html";
            } else {
                window.location.href = "user-dashboard.html";
            }
        }
        console.log(data)
    })
    .catch(error => {
        console.error('خطا در ورود:', error);
    });
});

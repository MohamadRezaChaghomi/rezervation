let ulFAQ = document.getElementById('ulFAQ');
let pTagLoading = document.getElementById('pTagLoading');
let sendTicketFAQ = document.getElementById('sendTicketFAQ');
let alertLogin = document.getElementById('alertLogin');
let nameOfUserHeader = document.getElementById('nameOfUserHeader');
let loginAndSignUpDiv = document.getElementById('loginAndSignUpDiv');

window.addEventListener("DOMContentLoaded", () => {

<<<<<<< HEAD
    let token = localStorage.getItem('Token');

    if(token){

        fetch('http://avatoop.com/marina_kish/api/users/ME', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.first_name && data.last_name){
                localStorage.setItem('id', data.id)
                let fullName = data.first_name + " " + data.last_name;
    
                loginAndSignUpDiv.classList.add('d-none');
                nameOfUserHeader.parentNode.classList.remove('d-none');
                nameOfUserHeader.innerHTML = `
                    <span class="la la-user form-icon font-size-24 mr-2"></span>
                    <span>${fullName}</span>
                `;  
            }else{
                localStorage.setItem('id', data.id)
                loginAndSignUpDiv.classList.add('d-none');
                nameOfUserHeader.parentNode.classList.remove('d-none');
                nameOfUserHeader.innerHTML = `
                    <span class="la la-user form-icon font-size-24 mr-2"></span>
                    <span></span>
                `;  
            }
        })
        .catch(error => {
            console.error('خطا در دریافت اطلاعات کاربر:', error);
        });
    }else{
        nameOfUserHeader.parentNode.classList.add('d-none');
=======
    let userToken = localStorage.getItem('Token');
    let firstName_lastName = localStorage.getItem('firstName_lastName');
    if(userToken){
        loginAndSignUpDiv.classList.add('d-none');
        if(firstName_lastName){
            nameOfUserHeader.parentNode.classList.remove('d-none');
            nameOfUserHeader.innerHTML = '<span class="la la-user form-icon font-size-24 mr-2"></span> ' + '<span>' + firstName_lastName + '</span>'
        }else{
            nameOfUserHeader.parentNode.classList.remove('d-none');
        }

>>>>>>> 0e212a1d3f23be4a15b559431705a304661e8455
    }

    alertLogin.classList.add('d-none')

    fetch('http://avatoop.com/marina_kish/api/faqs/index/1', {
        method: 'GET',
        headers: {
            "content-type": "application/json",
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.faqs.data && Array.isArray(data.faqs.data) && data.faqs.data.length > 0) {
            pTagLoading.classList.add('d-none');
            data.faqs.data.forEach(user => {
                ulFAQ.insertAdjacentHTML('beforeend', `
                    <li class="mb-2">
                        <a href="#" class="toggle-menu-icon d-flex justify-content-between align-items-center section-bg p-3">
                            ${user.question}
                            <i class="la la-angle-down"></i>
                        </a>
                        <ul class="toggle-drop-menu pt-2">
                            <li class="line-height-26">${user.answer}</li>
                        </ul>
                    </li>
                `);
            });
        } else {
            pTagLoading.innerHTML = 'موردی یافت نشد!';
        }
    })
    .catch(error => {
        console.error('خطا در دریافت داده‌ها:', error);
    });
});

sendTicketFAQ.addEventListener('click', () => {
    let userToken = localStorage.getItem('token');

    if (userToken) {
        window.location.href = "user-no-ticket-send.html";
    } else {
        alertLogin.classList.remove('d-none')
    }
});




document.addEventListener("DOMContentLoaded", () => {
    console.log("Script Loaded");

    let national_code_Register = document.getElementById('national_code_Register');
    let phone_number_Register = document.getElementById('phone_number_Register');
    let password_Register = document.getElementById('password_Register');
    let password_second_Register = document.getElementById('password_second_Register');
    let btn_Register = document.getElementById('btn_Register');

    if (!national_code_Register || !phone_number_Register || !password_Register || !password_second_Register || !btn_Register) {
        console.error("One or more elements not found! Check HTML IDs.");
        return;
    }

    let underPhoneEmptyRegister = createErrorSpan("شماره تلفن نمی‌تواند خالی باشد", phone_number_Register);
    let underNationalIdEmptyRegister = createErrorSpan("کد ملی نمی‌تواند خالی باشد", national_code_Register);
    let underPasswordEmptyRegister = createErrorSpan("رمز عبور نمی‌تواند خالی باشد", password_Register);
    let underPasswordMismatch = createErrorSpan("رمز عبور و تکرار آن یکسان نیستند", password_second_Register);

    btn_Register.addEventListener("click", async (event) => {
        let signupPopupForm = document.getElementById('signupPopupForm')
        signupPopupForm.classList.add('d-none')
        console.log("Button Clicked!");
        event.preventDefault();

        let isPhoneValid = validateField(phone_number_Register, underPhoneEmptyRegister);
        if (!isPhoneValid) {
            console.log("Phone validation failed. Form not submitted.");
            return;
        }

        showVerificationPopup(phone_number_Register.value);

        try {
            await sendData('http://avatoop.com/marina_kish/api/verifing', { "phone": phone_number_Register.value });
            console.log("Phone number sent for verification.");
        } catch (error) {
            console.error("Error occurred while sending phone number:", error);
        }
    });

    function createErrorSpan(message, inputElement) {
        let span = document.createElement("span");
        span.className = "font-size-12 text-danger d-none";
        span.innerText = message;
        inputElement.parentNode.appendChild(span);
        return span;
    }

    function validateField(inputElement, errorSpan) {
        if (inputElement.value.trim() === "") {
            errorSpan.classList.remove('d-none');
            return false;
        }
        errorSpan.classList.add('d-none');
        return true;
    }

    async function sendData(url, data) {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        return response.json();
    }

    function showVerificationPopup(phone) {
        let verificationPopup = document.createElement("div");
        verificationPopup.className = "modal fade show";
        verificationPopup.style.display = "block";
        verificationPopup.style.position = "fixed";
        verificationPopup.style.top = "50%";
        verificationPopup.style.left = "50%";
        verificationPopup.style.transform = "translate(-50%, -50%)";
        verificationPopup.style.zIndex = "1050";
        

        verificationPopup.innerHTML = `
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">تأیید شماره تلفن</h5>
                        <button type="button" class="close" onclick="this.closest('.modal').remove();" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="font-size-14">کد تأیید به شماره ${phone} ارسال شد. لطفاً کد را وارد کنید.</p>
                        <div class="input-group mb-3">
                            <input type="text" maxlength="5" class="form-control" id="verification_code" placeholder="کد تأیید">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button  type="button" class="btn btn-primary" id="btn_verify">تأیید</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(verificationPopup);

        let btn_verify = verificationPopup.querySelector("#btn_verify");
        let verification_code = verificationPopup.querySelector("#verification_code");

        btn_verify.addEventListener("click", async () => {
            try {
                let verificationData = {
                    "phone": phone,
                    "code": verification_code.value
                };

                await sendData('http://avatoop.com/marina_kish/api/verifing/check', verificationData);

                let userData = {
                    "national_code": national_code_Register.value,
                    "phone": phone,
                    "password": password_Register.value,
                };

                let isValid = true;
                isValid &= validateField(national_code_Register, underNationalIdEmptyRegister);
                isValid &= validateField(password_Register, underPasswordEmptyRegister);
                isValid &= validatePasswords(password_Register, password_second_Register, underPasswordMismatch);

                if (!isValid) {
                    alert("لطفاً تمام فیلدها را به درستی پر کنید.");
                    return;
                }

                await sendData('http://avatoop.com/marina_kish/api/register', userData);
                alert("حساب کاربری شما با موفقیت ایجاد شد!");
                verificationPopup.remove();
            } catch (error) {
                alert("کد تأیید اشتباه است یا مشکلی رخ داده است!");
                console.error("Verification or registration error:", error);
            }
        });
    }

    function validatePasswords(password1, password2, errorSpan) {
        if (password1.value.trim() !== password2.value.trim()) {
            errorSpan.classList.remove('d-none');
            return false;
        }
        errorSpan.classList.add('d-none');
        return true;
    }
});
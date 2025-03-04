document.addEventListener("DOMContentLoaded", () => {
    console.log("Script Loaded");

    let national_code_Register = document.getElementById('national_code_Register');
    let phone_number_Register = document.getElementById('phone_number_Register');
    let password_Register = document.getElementById('password_Register');
    let password_second_Register = document.getElementById('password_second_Register');
    let btn_Register = document.getElementById('btn_Register');

    // بررسی وجود تمام فیلدها
    if (!national_code_Register || !phone_number_Register || !password_Register || !password_second_Register || !btn_Register) {
        console.error("One or more elements not found! Check HTML IDs.");
        return;
    }

    // ایجاد عناصر پیام خطا
    let underPhoneEmptyRegister = createErrorSpan("شماره تلفن نمی‌تواند خالی باشد", phone_number_Register);
    let underNationalIdEmptyRegister = createErrorSpan("کد ملی نمی‌تواند خالی باشد", national_code_Register);
    let underPasswordEmptyRegister = createErrorSpan("رمز عبور نمی‌تواند خالی باشد", password_Register);
    let underPasswordMismatch = createErrorSpan("رمز عبور و تکرار آن یکسان نیستند", password_second_Register);
    let underPasswordInvalid = createErrorSpan(
        "رمز عبور حداقل باید شامل 8 کاراکتر باشد و حتما دارای حداقل یک حرف بزرگ و یک کاراکتر خاص (#,$,@,%)باشد",
        password_Register
    );

    // افزودن Event Listener برای ثبت حساب
    btn_Register.addEventListener("click", async (event) => {
        console.log("Button Clicked!");
        event.preventDefault();

        // بررسی فیلدهای ثبت‌نام
        let isValid = true;
        isValid &= validateField(phone_number_Register, underPhoneEmptyRegister);
        isValid &= validateField(national_code_Register, underNationalIdEmptyRegister);
        isValid &= validateField(password_Register, underPasswordEmptyRegister);
        isValid &= validatePasswordStrength(password_Register, underPasswordInvalid); // اعتبارسنجی رمز عبور
        isValid &= validatePasswords(password_Register, password_second_Register, underPasswordMismatch);

        if (!isValid) {
            return; // اگر فیلدی خالی بود، فرآیند ثبت‌نام ادامه نخواهد داشت
        }

        // بستن پاپ‌آپ اصلی (فقط اگر اطلاعات صحیح بود)
        let mainPopup = document.querySelector('.modal-popup');
        if (mainPopup) {
            mainPopup.style.display = 'none'; // مخفی کردن پاپ‌آپ قبلی
        }

        // نمایش پاپ‌آپ تأیید شماره تلفن
        showVerificationPopup(phone_number_Register.value);

        try {
            // ارسال شماره تلفن به API برای ارسال کد تأیید
            await sendData('http://avatoop.com/marina_kish/api/verifing', { "phone": phone_number_Register.value });
            console.log("Phone number sent for verification.");
        } catch (error) {
            console.error("Error occurred while sending phone number:", error);
        }
    });

    // توابع کمکی
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

    function validatePasswordStrength(passwordElement, errorSpan) {
        const password = passwordElement.value.trim();

        // شرط‌های رمز عبور: حداقل 8 کاراکتر، حداقل یک حرف بزرگ و حداقل یک کاراکتر خاص
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

        if (!passwordRegex.test(password)) {
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
                        <button type="button" class="btn btn-primary" id="btn_verify">تأیید</button>
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

                await sendData('http://avatoop.com/marina_kish/api/register', userData);
                showAlertModal2("ثبت نام شما با موفقیت انجام شد")
                verificationPopup.remove();
                setTimeout(() => {
                    location.reload();
                }, 2000);
                
            } catch (error) {
                showAlertModal2("کد تایید اشتباه است یا مشکلی رخ داده است")
                console.error("Verification or registration error:", error);
                setTimeout(() => {
                    location.reload()
                }, 2000);
            }
        });
    }


    function showAlertModal2(message) {
        let modal = document.getElementById('successAddNewTourist');
    
        if (!modal) {
            console.error("مدال successAddNewTourist در HTML پیدا نشد!");
            return;
        }
    
        let modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `<p>${message}</p>`;
    
        // بررسی و حذف هر لایه تیره‌ای که قبلاً اضافه شده باشد
        let existingOverlay = document.querySelector(".modal-overlay");
        if (existingOverlay) {
            existingOverlay.remove();
        }
    
        // ایجاد و اضافه کردن پس‌زمینه‌ی تیره (بین پاپ‌آپ کد تأیید و مدال پیام)
        let overlay = document.createElement("div");
        overlay.className = "modal-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0, 0, 0, 0.5)"; // نیمه‌شفاف برای تأکید روی مدال
        overlay.style.zIndex = "1060"; // بین پاپ‌آپ و مدال قرار بگیرد
    
        document.body.appendChild(overlay);
    
        // نمایش مدال
        modal.style.zIndex = "1070"; // مدال بالاتر از لایه تیره باشد
        modal.style.display = "block";
        modal.classList.add("show");
    
        document.body.classList.add("modal-open");
    
        // بستن مدال و حذف پس‌زمینه‌ی تیره بعد از ۲ ثانیه
        setTimeout(() => {
            modal.style.display = "none";
            modal.classList.remove("show");
            document.body.classList.remove("modal-open");
    
            // حذف پس‌زمینه‌ی تیره
            if (overlay) {
                overlay.remove();
            }
    
        }, 2000);
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

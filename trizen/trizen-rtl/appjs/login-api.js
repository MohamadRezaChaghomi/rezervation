let national_code_login = document.getElementById('national_code_login');
let password_login = document.getElementById('password_login');
let btn_login = document.getElementById('btn_login');

// عناصر خطا
let error_national_code = document.getElementById('error_national_code');
let error_password = document.getElementById('error_password');

btn_login.addEventListener("click", () => {
    let isValid = true;

    // پاک کردن پیام‌های خطای قبلی
    error_national_code.classList.add('d-none');
    error_password.classList.add('d-none');

    // اعتبارسنجی فیلدهای ورودی
    if (national_code_login.value.trim() === "") {
        error_national_code.textContent = "کد ملی نمی‌تواند خالی باشد";
        error_national_code.classList.remove('d-none');
        isValid = false;
    }

    if (password_login.value.trim() === "") {
        error_password.textContent = "رمز عبور نمی‌تواند خالی باشد";
        error_password.classList.remove('d-none');
        isValid = false;
    }

    if (!isValid) return;

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
        .then(response => response.text())
        .then(data => {
            console.log("🚀 پاسخ سرور (خام):", data);
            console.log("🚀 پاسخ سرور (trim):", data.trim());
            console.log(`🚀 پاسخ سرور (خام): "${data}"`);
            console.log(`🚀 طول پاسخ سرور: ${data.length}`);
            console.log(`🚀 پاسخ سرور (trim): "${data.trim()}"`);

            let cleanData = data.replace(/['"]+/g, '').trim(); // حذف گیومه‌ها و فاصله‌ها
            // بررسی وضعیت‌های مختلف پاسخ سرور
            if (cleanData=== "national_code wrong") {
                error_national_code.textContent = "کد ملی اشتباه است";
                error_national_code.classList.remove('d-none');
                return;
            }

            if (cleanData === "password wrong") {
                error_password.textContent = "رمز عبور اشتباه است";
                error_password.classList.remove('d-none');
                return;
            }

            if (cleanData === "user_not_found") {
                alert("لطفاً ابتدا ثبت‌نام کنید.");
                return;
            }

            // بررسی اگر پاسخ JSON معتبر باشد
            try {
                let parsedData = JSON.parse(data);
                if (parsedData.token) {
                    localStorage.setItem("Token", parsedData.token);
                    localStorage.setItem("role", parsedData.role);

                    if (data.role.includes('admin')) {
                        window.location.href = "admin-dashboard.html";
                    } else {
                        window.location.reload()
                    }
                }
            } catch (error) {
                console.error("❌ خطا در پردازش پاسخ JSON:", error);
            }
        })
        .catch(error => {
            console.error('❌ خطا در ورود:', error);
        });
});


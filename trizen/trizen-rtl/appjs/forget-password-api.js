let btn_change_password = document.getElementById("btn_change_password");
let change_password_number = document.getElementById("change_password_number");

// ایجاد یک المان برای نمایش خطای شماره تلفن در صورت نادرست بودن
let errorMessage = document.createElement("span");
errorMessage.className = "error-message";
errorMessage.style.color = "red"; 
errorMessage.style.fontSize = "12px"; 
errorMessage.style.marginTop = "5px";
change_password_number.parentNode.appendChild(errorMessage);

btn_change_password.addEventListener("click", (e) => {
    e.preventDefault();

    let phone = change_password_number.value.trim();

    // بررسی خالی بودن فیلد
    if (phone === "") {
        errorMessage.innerText = "لطفاً شماره تلفن را وارد کنید";
        return; // متوقف کردن ارسال درخواست
    }

    // بررسی اینکه شماره تلفن ۱۱ رقمی باشد و با 09 شروع شود
    let phonePattern = /^09\d{9}$/;
    if (!phonePattern.test(phone)) {
        errorMessage.innerText = "شماره تلفن باید ۱۱ رقم و با 09 شروع شود";
        return; // متوقف کردن ارسال درخواست
    }

    // حذف پیام خطا در صورت معتبر بودن شماره تلفن
    errorMessage.innerText = "";

    let userData = {
        "phone": phone
    };

    fetch("http://avatoop.com/marina_kish/api/forgot_password", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(res => res.json())
    .then(data =>{
        console.log(data)
        showAlertModal("رمز عبور جدید برای شما ارسال شد")
    } )
    .catch(error => console.error("خطا در ارسال درخواست:", error));
});

function showAlertModal(message) {
    let modal = document.getElementById('successAddNewTourist');
    let modalBody = modal.querySelector('.modal-body');

    // نمایش پیام داخل مدال
    modalBody.innerHTML = `<p>${message}</p>`;

    // ایجاد بک‌گراند تیره (Overlay)
  

    // نمایش مدال با Bootstrap
    let bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    // بستن مدال و حذف بک‌گراند تیره بعد از ۲ ثانیه
    setTimeout(() => {
        bootstrapModal.hide();

        setTimeout(() => {
            overlay.remove(); // حذف بک‌گراند تیره
        }, 500);
    }, 2000);
}
let btn_email = document.getElementById("btn_email");
let input_email = document.getElementById("input_email");

let errorMessage = document.createElement("span");
errorMessage.className = "error-message";
errorMessage.style.color = "red"; 
errorMessage.style.fontSize = "12px"; 
errorMessage.style.marginTop = "5px";
input_email.parentNode.appendChild(errorMessage);
btn_email.addEventListener("click", (e) => {
    e.preventDefault();

    let email = input_email.value.trim();
    
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
        errorMessage.innerText = "لطفاً یک ایمیل معتبر وارد کنید";
        return; 
    } else {
        errorMessage.innerText = ""; 
    }

    let userData = {
        "email": email
    };

    fetch("http://avatoop.com/marina_kish/api/news_join", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        // نمایش پیغام موفقیت
       showAlertModal("با موفقیت در خبرنامه عضو شدید")
    })
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
        }, 500);
    }, 2000);
}
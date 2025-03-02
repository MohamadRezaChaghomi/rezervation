var $ = document;
let btnSendTicket = $.getElementById("btnSendTicket");
let titleTicket = $.getElementById("titleTicket");
let priorityTicket = $.getElementById("priorityTicket");
let bodyTicket = $.getElementById("bodyTicket");

const id = localStorage.getItem('id');
const token = localStorage.getItem('Token');
if (!id) {
    console.error("ID کاربر در localStorage موجود نیست.");
}

function createErrorSpan(element, message) {
    let span = document.createElement("span");
    span.className = "font-size-14 text-danger d-none";
    span.innerText = message;
    element.parentNode.appendChild(span);
    return span;
}

let underTitleEmptyTicket = createErrorSpan(titleTicket, "عنوان نمیتواند خالی باشد");
let underBodyEmptyTicket = createErrorSpan(bodyTicket, "توضیحات نمیتواند خالی باشد");


btnSendTicket.addEventListener("click", (event) => {

    event.preventDefault();
    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }
    let isValid = true;

    if (titleTicket.value.trim() === "") {
        underTitleEmptyTicket.classList.remove('d-none');
        isValid = false;
    } else {
        underTitleEmptyTicket.classList.add('d-none');
    }

    if (bodyTicket.value.trim() === "") {
        underBodyEmptyTicket.classList.remove('d-none');
        isValid = false;
    } else {
        underBodyEmptyTicket.classList.add('d-none');
    }

    if (!isValid) return;

    let userData = {
        "user_id": id,
        "title": titleTicket.value,
        "body": bodyTicket.value,
        "priority": priorityTicket.value
    };
    
    fetch('http://avatoop.com/marina_kish/api/tickets/store', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(data => {
            if(data) {
                let successAlert = $.createElement("span");
                successAlert.className = "font-size-14 text-success d-flex fleex-column align-items-center justify-content-center p-2";
                successAlert.innerText = "تیکت با موفقیت ارسال شد";
                btnSendTicket.parentNode.appendChild(successAlert);
                setTimeout(() => {
                    window.location.reload()
                }, 2000);

            }else {
                let errorAlert = $.createElement("span");
                errorAlert.className = "font-size-14 text-danger d-flex fleex-column align-items-center justify-content-center p-2";
                errorAlert.innerText = "خطا در ارسال تیکت";
                btnSendTicket.parentNode.appendChild(errorAlert);
            }
        })
});


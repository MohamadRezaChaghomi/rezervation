$ = document
let nameAndFamily = $.getElementById('nameAndFamily')
let phoneNumber = $.getElementById('phoneNumber')
let nationalCode = $.getElementById('nationalCode')
let gender = $.getElementById('gender')
let BirthDate = $.getElementById('updateBirthDate')
let submitNewTourist = $.getElementById('submitNewTourist')
<<<<<<< HEAD
let newTouristModal = $.getElementById('newTouristModal')
=======
>>>>>>> 0e212a1d3f23be4a15b559431705a304661e8455


function createErrorSpan(element, message) {
    let span = document.createElement("span");
    span.className = "font-size-12 text-danger d-none";
    span.innerText = message;
    element.parentNode.appendChild(span);
    return span;
}

let underNameAndFamilyError = createErrorSpan(nameAndFamily, "نام و نام خانوادگی نمی‌تواند خالی باشد");
let underPhoneError = createErrorSpan(phoneNumber, "شماره تلفن نمی‌تواند خالی باشد");
let underNationalCodeError = createErrorSpan(nationalCode, "کد ملی نمی‌تواند خالی باشد");
let underNationalCodeErrorSame = createErrorSpan(nationalCode, "کد ملی نمی‌تواند تکراری است");
let underGenderError = createErrorSpan(BirthDate, "تاریخ تولد نمی تواند خالی باشد");
let underBirthDateError = createErrorSpan(gender, "لطفاً جنسیت را انتخاب کنید");

submitNewTourist.addEventListener("click", () => {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('Token');
    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }

    let isValid = true;

    if (nameAndFamily.value.trim() === "") {
        underNameAndFamilyError.classList.remove('d-none');
        isValid = false;
    } else {
        underNameAndFamilyError.classList.add('d-none');
    }

    if (phoneNumber.value.trim() === "") {
        underPhoneError.classList.remove('d-none');
        isValid = false;
    } else {
        underPhoneError.classList.add('d-none');
    }

    if (nationalCode.value.trim() === "") {
        underNationalCodeError.classList.remove('d-none');
        isValid = false;
    } else {
        underNationalCodeError.classList.add('d-none');
    }

    if (gender.value.trim() === "") {
        underGenderError.classList.remove('d-none');
        isValid = false;
    } else {
        underGenderError.classList.add('d-none');
    }

    if (BirthDate.value.trim() === "") {
        underBirthDateError.classList.remove('d-none');
        isValid = false;
    } else {
        underBirthDateError.classList.add('d-none');
    }

    if (!isValid) return;

    fetch(`http://avatoop.com/marina_kish/api/passengers/index?user_id=${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        let isDuplicate = data.data.some(user => user.national_code === nationalCode.value);

        if (isDuplicate) {
            underNationalCodeErrorSame.classList.remove('d-none');
            return;
        } else {
            underNationalCodeErrorSame.classList.add('d-none');
        }

        let userData = {
            "user_id": id,
            "name": nameAndFamily.value,
            "national_code": nationalCode.value,
            "phone": phoneNumber.value,
            "birth_day": BirthDate.value,
            "gender": gender.value
        };

        fetch('http://avatoop.com/marina_kish/api/passengers/store', {
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
<<<<<<< HEAD
            if(data.message === "گردشگر با موفقیت ثبت شد"){

                newTouristModal.classList.remove('show');
                newTouristModal.style.display = 'none';
                document.body.classList.remove('modal-open');

                successAddNewTourist.classList.add('show');
                successAddNewTourist.style.display = 'block';
                document.body.classList.add('modal-open');

                successAddNewTourist.addEventListener('hidden.bs.modal', function () {
                    window.location.reload();
                });

                const closeModalButton = successAddNewTourist.querySelector('[data-dismiss="modal"]');
                closeModalButton.addEventListener('click', function () {
                    successAddNewTourist.classList.remove('show');
                    successAddNewTourist.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    window.location.reload();
                });
            }
=======
            console.log(userData);
            console.log(data);
            console.log(token);
            // window.location.href = "user-no-tourist.html";
>>>>>>> 0e212a1d3f23be4a15b559431705a304661e8455
        });
    })
    .catch(error => {
        console.error("خطا در دریافت لیست گردشگران:", error);
    });
});

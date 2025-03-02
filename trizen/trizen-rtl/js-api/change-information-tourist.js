let $ = document
let changeTouristBtn = $.getElementById('changeTouristBtn')
let changeNameAndFamilyTourist = $.getElementById('nameAndFamilyChange')
let changePhoneNumberTourist = $.getElementById('phoneNumberChange')
let changeNationalCodeTourist = $.getElementById('nationalCodeChange')
let changeGenderTourist = $.getElementById('genderChange')
let changeBirthDateTourist = $.getElementById('updateBirthDateChange')
let changeSubmitNewTourist = $.getElementById('changeSubmitNewTourist')

function createErrorSpan(element, message) {
    if (!element) return; 
    let span = document.createElement("span");
    span.className = "font-size-14 text-danger d-none";
    span.innerText = message;
    element.parentNode.appendChild(span);
    return span;
}

let underNameAndFamilyChangeTourist = createErrorSpan(changeNameAndFamilyTourist, "نام و نام خانوادگی نمی‌تواند خالی باشد");
let underGenderChangeTourist = createErrorSpan(changeGenderTourist, "جنسیت نمی‌تواند خالی باشد");
let underPhoneNumberChangeTourist = createErrorSpan(changePhoneNumberTourist, "شماره تلفن نمی‌تواند خالی باشد");
let underBirthDateChangeTourist = createErrorSpan(changeBirthDateTourist, "تاریخ تولد نمی‌تواند خالی باشد");
let underNationalCodeChangeTourist = createErrorSpan(changeNationalCodeTourist, "کد ملی نمی‌تواند خالی باشد");


changeSubmitNewTourist.addEventListener('click', function () {
    let isValid = true;

    if (changeNameAndFamilyTourist.value.trim() === "") {
        underNameAndFamilyChangeTourist.classList.remove('d-none');
        isValid = false;
    } else {
        underNameAndFamilyChangeTourist.classList.add('d-none');
    }

    if (changePhoneNumberTourist.value.trim() === "") {
        underPhoneNumberChangeTourist.classList.remove('d-none');
        isValid = false;
    } else {
        underPhoneNumberChangeTourist.classList.add('d-none');
    }

    if (changeGenderTourist.value.trim() === '') {
        underGenderChangeTourist.classList.remove('d-none');
        isValid = false;
    } else {
        underGenderChangeTourist.classList.add('d-none');
    }

    if (changeBirthDateTourist.value.trim() === "") {
        underBirthDateChangeTourist.classList.remove('d-none');
        isValid = false;
    } else {
        underBirthDateChangeTourist.classList.add('d-none');
    }
    
    if (changeNationalCodeTourist.value.trim() === "") {
        underNationalCodeChangeTourist.classList.remove('d-none');
        isValid = false;
    } else {
        underNationalCodeChangeTourist.classList.add('d-none');
    }

    if (!isValid) return;

    const token = localStorage.getItem('Token');
    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }
    
    let userId = localStorage.getItem('tourist-userid')

    function formatToCustomISO(dateString) {
        return dateString + "T00:00:00.000000Z";
    }
    
    let inputDate = changeBirthDateTourist.value;
    let formattedDate = formatToCustomISO(inputDate);
    
    let userData = {
        "id": userId,
        "name": changeNameAndFamilyTourist.value,
        "national_code": changeNationalCodeTourist.value,
        "phone": changePhoneNumberTourist.value,
        "birth_date": formattedDate,
        "gender": changeGenderTourist.value
    };
    
    fetch(`http://avatoop.com/marina_kish/api/passengers/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(userData)
        if(data){
            let successAlert = $.createElement("span");
            successAlert.className = "font-size-14 text-success d-flex flex-column align-items-center justify-content-center p-2";
            successAlert.innerText = "اطلاعات با موفقیت تکمیل شد";
            changeSubmitNewTourist.parentNode.appendChild(successAlert);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
})



document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'changeTouristBtn') {
        let userId = event.target.getAttribute('tourist-userid');

        localStorage.setItem("tourist-userid", userId);

        changeNameAndFamilyTourist.value = "در حال بارگذاری...";
        changePhoneNumberTourist.value = "در حال بارگذاری...";
        changeNationalCodeTourist.value = "در حال بارگذاری...";
        changeGenderTourist.value = " ";
        changeBirthDateTourist.value = "در حال بارگذاری...";

        fetch(`http://avatoop.com/marina_kish/api/passengers/index?id=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(localStorage)
            if (data.data && data.data.length > 0) {  
                let user = data.data.find(u => u.id == userId);
                
                if (user) {
                    changeNameAndFamilyTourist.value = user.name;
                    changePhoneNumberTourist.value = user.phone;
                    changeNationalCodeTourist.value = user.national_code;
                    changeGenderTourist.value = user.gender;
                    changeBirthDateTourist.value = user.birth_day.split('T')[0];

                    changeGenderTourist.dispatchEvent(new Event("change"));
                } else {
                    console.warn("کاربری با این ID یافت نشد!");
                }
            } else {
                console.warn("هیچ اطلاعاتی برای این کاربر یافت نشد!");
            }
        })
        .catch(error => {
            console.error('خطا در دریافت اطلاعات کاربر:', error);
        });
    }
});





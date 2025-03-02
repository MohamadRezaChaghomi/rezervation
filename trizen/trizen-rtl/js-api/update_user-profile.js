let $ = document
let updateProfile = $.getElementById('updateProfile')
let updateName = $.getElementById('updateName')
let updateFamily = $.getElementById('updateFamily')
let updateGender = $.getElementById('updateGender')
let updateNationalCode = $.getElementById('updateNationalCode')
let updatePhone = $.getElementById('updatePhone')
let updateEmail = $.getElementById('updateEmail')
let updateBirthDate = $.getElementById('updateBirthDate')
let updateEmergencyName = $.getElementById('updateEmergencyName')
let updateEmergencyPhone = $.getElementById('updateEmergencyPhone')

function createErrorSpan(element, message) {
    if (!element) return; 
    let span = document.createElement("span");
    span.className = "font-size-14 text-danger d-none";
    span.innerText = message;
    element.parentNode.appendChild(span);
    return span;
}

let underNameUpdateProfile = createErrorSpan(updateName, "نام نمی‌تواند خالی باشد");
let underFamilyUpdateProfile = createErrorSpan(updateFamily, "نام خانوادگی نمی‌تواند خالی باشد");
let underGenderUpdateProfile = createErrorSpan(updateGender, "جنسیت نمی‌تواند خالی باشد");
let underEmailUpdateProfile = createErrorSpan(updateEmail, "ایمیل نمی‌تواند خالی باشد");
let underDateUpdateProfile = createErrorSpan(updateBirthDate, "تاریخ تولد نمی‌تواند خالی باشد");


updateProfile.addEventListener('click', function (event) {
    
    event.preventDefault();

    let isValid = true;

    if (updateName.value.trim() === "") {
        underNameUpdateProfile.classList.remove('d-none');
        isValid = false;
    } else {
        underNameUpdateProfile.classList.add('d-none');
    }

    if (updateFamily.value.trim() === "") {
        underFamilyUpdateProfile.classList.remove('d-none');
        isValid = false;
    } else {
        underFamilyUpdateProfile.classList.add('d-none');
    }

    if (updateGender.value.trim() === '') {
        underGenderUpdateProfile.classList.remove('d-none');
        isValid = false;
    } else {
        underGenderUpdateProfile.classList.add('d-none');
    }

    if (updateEmail.value.trim() === "") {
        underEmailUpdateProfile.classList.remove('d-none');
        isValid = false;
    } else {
        underEmailUpdateProfile.classList.add('d-none');
    }

    if (updateBirthDate.value.trim() === "") {
        underDateUpdateProfile.classList.remove('d-none');
        isValid = false;
    } else {
        underDateUpdateProfile.classList.add('d-none');
    }
    if (!isValid) return;

    const token = localStorage.getItem('Token');
    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }

        
    let userData = {
        "first_name": updateName.value,
        "last_name": updateFamily.value,
        "email": updateEmail.value,
        "gender": updateGender.value,
        "birth_day": updateBirthDate.value,
        "emergency_phone":{
            "first_name": updateEmergencyName.value,
            "last_name": updateEmergencyName.value,
            "phone": updateEmergencyPhone.value
        }
    };

    fetch('http://avatoop.com/marina_kish/api/users/update_profile', {
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
        if(data && data.id){
            let successAlert = $.createElement("span");
            successAlert.className = "font-size-14 text-success d-flex fleex-column align-items-center justify-content-center p-2";
            successAlert.innerText = "اطلاعات با موفقیت تکمیل شد";
            updateProfile.parentNode.appendChild(successAlert);
            
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
})

window.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('Token');
    const national_code = localStorage.getItem('national_code');
    const phone = localStorage.getItem('phone');
    
    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }

    updateName.value = "در حال بارگذاری...";
    updateFamily.value = "در حال بارگذاری...";
    updateGender.value = "";
    updateEmail.value = "در حال بارگذاری...";
    updateBirthDate.value = "در حال بارگذاری...";
    updateEmergencyName.value = "در حال بارگذاری...";
    updateEmergencyPhone.value = "در حال بارگذاری...";
    updateNationalCode.value = "در حال بارگذاری...";
    updatePhone.value = "در حال بارگذاری...";
    updateNationalCode.value = national_code;
    updatePhone.value = phone;
    
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
        if (data.first_name) {
            updateName.value = data.first_name;
            updateFamily.value = data.last_name;
            updateGender.value = data.gender;
            updateEmail.value = data.email;
            updateBirthDate.value = data.birth_day.split('T')[0];
            updateEmergencyName.value = data.emergency_phone.first_name;
            updateEmergencyPhone.value = data.emergency_phone.phone;

            updateGender.dispatchEvent(new Event("change"));

            const firstName_lastName = localStorage.getItem('firstName_lastName');

            let navNameOfUser = $.getElementById('navNameOfUser');
        
            if (firstName_lastName) {
                navNameOfUser.innerText = firstName_lastName;
            }else{
                navNameOfUser.innerText = "کاربر";
            }
            
            let sidebarNameOfUser = $.getElementById('sidebarNameOfUser');
            if (firstName_lastName) {
                sidebarNameOfUser.innerText = firstName_lastName;
            }else{
                sidebarNameOfUser.innerText = "کاربر";
            }
        }
        else{
            updateName.value = "";
            updateFamily.value = "";
            updateGender.value = "";
            updateEmail.value = "";
            updateBirthDate.value = "";
            updateEmergencyName.value = "";
            updateEmergencyPhone.value = "";
            
            const firstName_lastName = localStorage.getItem('firstName_lastName');

            let navNameOfUser = $.getElementById('navNameOfUser');
        
            if (firstName_lastName) {
                navNameOfUser.innerText = firstName_lastName;
            }else{
                navNameOfUser.innerText = "کاربر";
            }
            
            let sidebarNameOfUser = $.getElementById('sidebarNameOfUser');
            if (firstName_lastName) {
                sidebarNameOfUser.innerText = firstName_lastName;
            }else{
                sidebarNameOfUser.innerText = "کاربر";
            }
        }
    })
    .catch(error => {
        console.error('خطا در دریافت اطلاعات کاربر:', error);
    });
});

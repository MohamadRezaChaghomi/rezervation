let $ = document;
let updateProfile = $.getElementById('updateProfile');
let updateName = $.getElementById('updateName');
let updateFamily = $.getElementById('updateFamily');
let updateGender = $.getElementById('updateGender');
let updateNationalCode = $.getElementById('updateNationalCode');
let updatePhone = $.getElementById('updatePhone');
let updateEmail = $.getElementById('updateEmail');
let updateBirthDate = $.getElementById('updateBirthDate');
let updateEmergencyName = $.getElementById('updateEmergencyName');
let updateEmergencyPhone = $.getElementById('updateEmergencyPhone');
let changePasswordButton = $.getElementById('changePasswordButton');
let oldPassword = $.getElementById('oldPassword');
let newPassword = $.getElementById('newPassword');
let confirmPassword = $.getElementById('confirmPassword');
let oldPasswordError = $.getElementById('oldPasswordError');
let newPasswordError = $.getElementById('newPasswordError');
let confirmPasswordError = $.getElementById('confirmPasswordError');
let togglePasswordVisibility = $.getElementById('togglePasswordVisibility');
let phoneError = $.getElementById('phoneError');

updateProfile.addEventListener('click', function () {
    let gender = updateGender.value;

    const token = localStorage.getItem('Token');
    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }

    if (!validatePhone(updatePhone.value)) {
        phoneError.innerText = 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد';
        return;
    } else {
        phoneError.innerText = '';
    }

    let userData = {
        "first_name": updateName.value,
        "last_name": updateFamily.value,
        "email": updateEmail.value,
        "gender": gender,
        "birth_day": updateBirthDate.value,
        "emergency_phone": {
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
        showResponseModal('اطلاعات با موفقیت تکمیل شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
});

function validatePhone(phone) {
    const phonePattern = /^09\d{9}$/;
    return phonePattern.test(phone);
}

updatePhone.addEventListener('input', function () {
    if (!validatePhone(updatePhone.value)) {
        phoneError.innerText = 'شماره موبایل باید با 09 شروع شود و 11 رقم باشد';
    } else {
        phoneError.innerText = '';
    }
});

changePasswordButton.addEventListener('click', function () {
    const token = localStorage.getItem('Token');
    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }

    oldPasswordError.innerText = '';
    newPasswordError.innerText = '';
    confirmPasswordError.innerText = '';

    if (newPassword.value !== confirmPassword.value) {
        confirmPasswordError.innerText = 'گذرواژه‌های جدید مطابقت ندارند';
        return;
    }

    if (newPassword.value.length < 8 || !/\d/.test(newPassword.value) || !/[a-zA-Z]/.test(newPassword.value)) {
        newPasswordError.innerText = 'گذرواژه باید حداقل 8 نویسه و شامل حروف و اعداد باشد';
        return;
    }

    let passwordData = {
        "old_password": oldPassword.value,
        "new_password": newPassword.value
    };

    fetch('http://avatoop.com/marina_kish/api/users/chpass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => { throw new Error(data.message) });
        }
        return response.json();
    })
    .then(data => {
        showResponseModal(data.message, 'success');
        jQuery('#changepassword').modal('hide');
    })
    .catch(error => {
        oldPasswordError.innerText = 'گذرواژه قدیمی اشتباه است';
    });
});

togglePasswordVisibility.addEventListener('change', function () {
    const passwordFields = [oldPassword, newPassword, confirmPassword];
    passwordFields.forEach(field => {
        if (togglePasswordVisibility.checked) {
            field.type = 'text';
        } else {
            field.type = 'password';
        }
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('Token');
    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }

    const sumOrders = document.getElementsByClassName('title__orders')[0];
    const sumReviews = document.getElementsByClassName('title__reviews')[0];
    const sumTickets = document.getElementsByClassName('title__tickets')[0];
    const sumUsers = document.getElementsByClassName('title__users')[0];

    fetch('http://avatoop.com/marina_kish/api/orders/admin/index', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        sumOrders.innerHTML = data.order.length;
    })
    .catch(error => console.error('Error fetching orders:', error));

    fetch(`http://avatoop.com/marina_kish/api/comments/comment_admin/index`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در دریافت نظرات');
        return response.json();
    })
    .then(data => {
        const pendingComments = data.data.filter(comment => comment.status === 'pending');
        sumReviews.innerHTML = pendingComments.length;
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));

    fetch(`http://avatoop.com/marina_kish/api/tickets/ticket_admin`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در دریافت تیکت‌ها');
        return response.json();
    })
    .then(data => {
        const waitingTickets = data.filter(ticket => ticket.status === 'wating');
        sumTickets.innerHTML = waitingTickets.length;
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));

    fetch('http://avatoop.com/marina_kish/api/users/index', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        sumUsers.innerHTML = data.users.total;
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));

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
        if (data.national_code) {
            updateName.value = data.first_name;
            updateFamily.value = data.last_name;
            updateNationalCode.value = data.national_code;
            updatePhone.value = data.phone;
            updateEmail.value = data.email;
            updateBirthDate.value = data.birth_day ? data.birth_day.split("T")[0] : "نامشخص";


            if (data.emergency_phone) {
                updateEmergencyName.value = data.emergency_phone.first_name;
                updateEmergencyPhone.value = data.emergency_phone.phone;
            } else {
                updateEmergencyName.value = '';
                updateEmergencyPhone.value = '';
            }
            if (data.gender === 'mail') {
                updateGender.value = 'mail';
            } else if (data.gender === 'female') {
                updateGender.value = 'female';
            } else {
                updateGender.value = 'null';
            }
        }
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
});

function showResponseModal(message, type) {
    const responseModalBody = document.getElementById('responseModalBody');
    responseModalBody.innerText = message;
    if (type === 'success') {
        responseModalBody.classList.remove('text-danger');
        responseModalBody.classList.add('text-success');
    } else {
        responseModalBody.classList.remove('text-success');
        responseModalBody.classList.add('text-danger');
    }
    jQuery('#responseModal').modal('show');
}
const userToken = localStorage.getItem('Token');
if (!userToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchUsers();
    document.getElementById('editUserForm').addEventListener('submit', handleEditUser);
    document.getElementById('confirmDeleteButton').addEventListener('click', handleDeleteUser);
});

let deleteUserId = null;
let editUserId = null;

function fetchUsers() {
    fetch('http://avatoop.com/marina_kish/api/users/index', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${userToken}`,
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
        renderUserTable(data.users.data);
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function renderUserTable(users) {
    const userContainer = document.querySelector('.users-container');
    userContainer.innerHTML = '';
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');
    table.innerHTML = `
        <thead>
            <tr>
                <th>شماره</th>
                <th>نام</th>
                <th>نام خانوادگی</th>
                <th>کد ملی</th>
                <th>ایمیل</th>
                <th>تلفن</th>
                <th>جنسیت</th>
                <th>تاریخ تولد</th>
                <th>عملیات</th>
            </tr>
        </thead>
        <tbody>
        ${users.map(user => {
            let isAdmin = user.national_code === 'admin';
            const gender = user.gender === 'mail' ? 'مرد' : user.gender === 'female' ? 'زن' : '';
        
            return `
                <tr>
                    <td>${user.id || ''}</td>
                    <td>${user.first_name || ''}</td>
                    <td>${user.last_name || ''}</td>
                    <td>${user.national_code}</td>
                    <td>${user.email || ''}</td>
                    <td>${user.phone}</td>
                    <td>${gender}</td>
                    <td>${user.birth_day ? user.birth_day.split("T")[0] : "نامشخص"}</td>
                    <td>
                        <button class="btn btn-warning" onclick="openEditUserModal(${user.id}, '${user.first_name}', '${user.last_name}', '${user.national_code}', '${user.email}', '${user.phone}', '${user.gender}', '${user.birth_day}', ${user.emergency_phone ? `'${user.emergency_phone.first_name}', '${user.emergency_phone.last_name}', '${user.emergency_phone.phone}'` : `'','',''`})">ویرایش</button>
                        ${!isAdmin ? `<button class="btn btn-danger" onclick="openDeleteUserModal(${user.id})">حذف</button>` : ''}
                    </td>
                </tr>
            `;
        }).join('')}
                </tbody>
    `;
    userContainer.appendChild(table);
}

function openEditUserModal(id, firstName, lastName, nationalCode, email, phone, gender, birthDay, emergencyFirstName, emergencyLastName, emergencyPhone) {
    editUserId = id;
    document.getElementById('editFirstName').value = firstName;
    document.getElementById('editLastName').value = lastName;
    document.getElementById('editNationalCode').value = nationalCode;
    document.getElementById('editEmail').value = email;
    document.getElementById('editPhone').value = phone;
    document.getElementById('editGender').value = gender;
    document.getElementById('editBirthDay').value = birthDay ? moment(birthDay).format('jYYYY-jMM-jDD') : '';
    document.getElementById('editEmergencyFirstName').value = emergencyFirstName;
    document.getElementById('editEmergencyLastName').value = emergencyLastName;
    document.getElementById('editEmergencyPhone').value = emergencyPhone;
    clearErrors();
    $('#editUserModal').modal('show');
}

function handleEditUser(event) {
    event.preventDefault();
    if (!editUserId) return;

    const phone = document.getElementById('editPhone').value;
    const emergencyPhone = document.getElementById('editEmergencyPhone').value;
    const birthDay = document.getElementById('editBirthDay').value;
    const birthDayParts = birthDay.split('-');
    const birthYear = parseInt(birthDayParts[0], 10);
    const birthMonth = parseInt(birthDayParts[1], 10);
    const birthDayOfMonth = parseInt(birthDayParts[2], 10);

    let isValid = true;

    // Validate phone number
    if (!/^09\d{9}$/.test(phone)) {
        isValid = false;
        document.getElementById('editPhoneError').innerHTML = 'شماره تلفن باید با 09 شروع شود و 11 رقمی باشد.';
    } else {
        document.getElementById('editPhoneError').innerHTML = '';
    }

    // Validate emergency phone number
    if (!/^09\d{9}$/.test(emergencyPhone)) {
        isValid = false;
        document.getElementById('editEmergencyPhoneError').innerHTML = 'شماره تلفن اضطراری باید با 09 شروع شود و 11 رقمی باشد.';
    } else {
        document.getElementById('editEmergencyPhoneError').innerHTML = '';
    }

    // Validate birth date
    if (birthYear < 1300 || birthMonth > 12 || birthDayOfMonth > 31) {
        isValid = false;
        document.getElementById('editBirthDayError').innerHTML = 'تاریخ تولد نامعتبر است. سال باید بزرگتر از 1300، ماه حداکثر 12 و روز حداکثر 31 باشد.';
    } else {
        document.getElementById('editBirthDayError').innerHTML = '';
    }

    if (!isValid) {
        return;
    }

    const updatedUser = {
        id: editUserId,
        first_name: document.getElementById('editFirstName').value,
        last_name: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        phone: phone,
        birth_day: moment(birthDay, 'jYYYY-jMM-jDD').add(1, 'day').format('YYYY-MM-DD'),
        gender: document.getElementById('editGender').value,
        emergency_phone: {
            first_name: document.getElementById('editEmergencyFirstName').value,
            last_name: document.getElementById('editEmergencyLastName').value,
            phone: emergencyPhone
        }
    };

    fetch(`http://avatoop.com/marina_kish/api/users/admin/update/${editUserId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${userToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'        
        },
        body: JSON.stringify(updatedUser)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        fetchUsers();
        $('#editUserModal').modal('hide');
        showResponseModal('کاربر با موفقیت ویرایش شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function openDeleteUserModal(userId) {
    deleteUserId = userId;
    $('#confirmDeleteModal').modal('show');
}

function handleDeleteUser() {
    fetch(`http://avatoop.com/marina_kish/api/users/admin/delete/${deleteUserId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${userToken}`,
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
        fetchUsers();
        $('#confirmDeleteModal').modal('hide');
        showResponseModal('کاربر با موفقیت حذف شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}

function clearErrors() {
    document.getElementById('editPhoneError').innerHTML = '';
    document.getElementById('editEmergencyPhoneError').innerHTML = '';
    document.getElementById('editBirthDayError').innerHTML = '';
}
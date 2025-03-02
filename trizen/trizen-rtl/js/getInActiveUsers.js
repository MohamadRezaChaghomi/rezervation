const userToken = localStorage.getItem('Token');
if (!userToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchUsers();
    document.getElementById('confirmRestoreButton').addEventListener('click', handleRestoreUser);
});

let restoreUserId = null;

function fetchUsers() {
    fetch('http://avatoop.com/marina_kish/api/users/admin/trash', {
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
        renderUserTable(data.user);
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
                            <button class="btn btn-success btn-sm" onclick="openRestoreUserModal(${user.id})">بازگردانی</button>
                        </td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    userContainer.appendChild(table);
}

function openRestoreUserModal(userId) {
    restoreUserId = userId;
    $('#restoreUserModal').modal('show');
}

function handleRestoreUser() {
    fetch(`http://avatoop.com/marina_kish/api/users/restore/${restoreUserId}`, {
        method: 'POST',
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
        $('#restoreUserModal').modal('hide');
        showResponseModal('کاربر با موفقیت بازگردانی شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
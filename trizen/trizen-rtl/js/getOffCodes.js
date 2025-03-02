const offCodeApiUrl = 'http://avatoop.com/marina_kish/api/off_codes';
const offCodeToken = localStorage.getItem('Token');
if (!offCodeToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchOffCodes();
    document.getElementById('addOffCodeForm').addEventListener('submit', handleAddOffCode);
    document.getElementById('editOffCodeForm').addEventListener('submit', handleEditOffCode);
    document.getElementById('confirmDeleteButton').addEventListener('click', handleDeleteOffCode);
});

let deleteOffCodeId = null;
let editOffCodeId = null;

function fetchOffCodes() {
    fetch(`${offCodeApiUrl}/index`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${offCodeToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در دریافت کدهای تخفیف');
        return response.json();
    })
    .then(data => {
        renderOffCodeTable(data['off code']);
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function renderOffCodeTable(offCodes) {
    const offCodeContainer = document.querySelector('.offCode-container');
    offCodeContainer.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');

    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>شماره</th>
            <th>عنوان</th>
            <th>کد</th>
            <th>درصد</th>
            <th>تعداد</th>
            <th>تاریخ شروع</th>
            <th>تاریخ انقضا</th>
            <th>عملیات</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    offCodes.forEach(offCode => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${offCode.id}</td>
            <td>${offCode.title}</td>
            <td>${offCode.code}</td>
            <td>${offCode.percent}</td>
            <td>${offCode.number}</td>
            <td>${offCode.start_time ? offCode.start_time.split("T")[0] : "نامشخص"}</td>
            <td>${offCode.expire_time ? offCode.expire_time.split("T")[0] : "نامشخص"}</td>
            <td>
                <button class="btn btn-warning" onclick="openEditOffCodeModal(${offCode.id}, '${offCode.title}', '${offCode.code}', ${offCode.percent}, ${offCode.number}, '${offCode.expire_time}', '${offCode.start_time}')">ویرایش</button>
                <button class="btn btn-danger" onclick="openDeleteOffCodeModal(${offCode.id})">حذف</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    offCodeContainer.appendChild(table);
}

function openAddOffCodeModal() {
    document.getElementById('addOffCodeForm').reset();
    $('#addOffCodeModal').modal('show');
}

function openEditOffCodeModal(offCodeId, title, code, percent, number, expire_time, start_time) {
    document.getElementById('editOffCodeId').value = offCodeId;
    editOffCodeId = offCodeId;
    document.getElementById('editTitle').value = title;
    document.getElementById('editCode').value = code;
    document.getElementById('editPercent').value = percent;
    document.getElementById('editNumber').value = number;
    document.getElementById('editExpireTime').value = new Date(expire_time).toISOString().substring(0, 10);
    document.getElementById('editStartTime').value = new Date(start_time).toISOString().substring(0, 10);
    $('#editOffCodeModal').modal('show');
}

function handleEditOffCode(event) {
    event.preventDefault();
    const updatedOffCode = {
        title: document.getElementById('editTitle').value,
        code: document.getElementById('editCode').value,
        percent: document.getElementById('editPercent').value,
        number: document.getElementById('editNumber').value,
        expire_time: document.getElementById('editExpireTime').value,
        start_time: document.getElementById('editStartTime').value
    };

    fetch(`${offCodeApiUrl}/update/${editOffCodeId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${offCodeToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedOffCode)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در ویرایش کد تخفیف');
        return response.json();
    })
    .then(data => {
        fetchOffCodes();    
        $('#editOffCodeModal').modal('hide');
        showResponseModal('کد تخفیف با موفقیت ویرایش شد', 'success');
        
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function handleAddOffCode(event) {
    event.preventDefault();
    const newOffCode = {
        title: document.getElementById('offCodeTitle').value,
        code: document.getElementById('offCode').value,
        percent: document.getElementById('offCodePercent').value,
        number: document.getElementById('offCodeNumber').value,
        expire_time: document.getElementById('offCodeExpireTime').value,
        start_time: document.getElementById('offCodeStartTime').value
    };

    fetch(`${offCodeApiUrl}/store`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${offCodeToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOffCode)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در افزودن کد تخفیف');
        return response.json();
    })
    .then(data => {
        fetchOffCodes();
        $('#addOffCodeModal').modal('hide');
        showResponseModal('کد تخفیف با موفقیت اضافه شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function openDeleteOffCodeModal(offCodeId) {
    deleteOffCodeId = offCodeId;
    $('#confirmDeleteModal').modal('show');
}

function handleDeleteOffCode() {
    fetch(`${offCodeApiUrl}/delete/${deleteOffCodeId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${offCodeToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در حذف کد تخفیف');
        return response.json();
    })
    .then(data => {
        fetchOffCodes();
        $('#confirmDeleteModal').modal('hide');
        showResponseModal('کد تخفیف با موفقیت حذف شد', 'success');
        
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function restoreOffCode(offCodeId) {
    fetch(`${offCodeApiUrl}/restore/${offCodeId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${offCodeToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deleted_at: null })
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در فعال کردن مجدد کد تخفیف');
        return response.json();
    })
    .then(data => {
        fetchOffCodes();
        showResponseModal('کد تخفیف با موفقیت فعال شد', 'success');
        
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
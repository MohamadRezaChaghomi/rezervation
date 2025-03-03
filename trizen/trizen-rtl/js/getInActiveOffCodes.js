const offCodeApiUrl = 'http://avatoop.com/marina_kish/api/off_codes';
const offCodeRestoreApiUrl = 'http://avatoop.com/marina_kish/api/off_codes/restore';
const userToken = localStorage.getItem('Token');
if (!userToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchOffCodes();
    document.getElementById('confirmRestoreButton').addEventListener('click', handleRestoreOffCode);
});

let restoreOffCodeId = null;

async function fetchOffCodes() {
    try {
        const response = await fetch(`${offCodeApiUrl}/admin/trash`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${userToken}`, 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('خطا در دریافت کدهای تخفیف');
        const data = await response.json();
        renderOffCodeTable(data['off code']);
    } catch (error) {
        showResponseModal(`خطا: ${error.message}`, 'error');
    }
}

function renderOffCodeTable(offCodes) {
    const offCodeContainer = document.querySelector('.offCode-container');
    offCodeContainer.innerHTML = ''; // پاک کردن محتوای قبلی

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');
    table.innerHTML = `
        <thead>
            <tr>
                <th>عنوان</th>
                <th>کد</th>
                <th>درصد</th>
                <th>تعداد</th>
                <th>تاریخ انقضا</th>
                <th>تاریخ شروع</th>
                <th>عملیات</th>
            </tr>
        </thead>
        <tbody>
            ${offCodes.map(offCode => {
                return `
                    <tr>
                        <td>${offCode.title || ''}</td>
                        <td>${offCode.code || ''}</td>
                        <td>${offCode.percent || ''}</td>
                        <td>${offCode.number || ''}</td>
                        <td>${offCode.start_time ? offCode.start_time.split("T")[0] : "نامشخص"}</td>
                        <td>${offCode.expire_time ? offCode.expire_time.split("T")[0] : "نامشخص"}</td>
                        <td>
                            <button class="btn btn-success btn-sm" onclick="openRestoreOffCodeModal(${offCode.id})">بازگردانی</button>
                        </td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    offCodeContainer.appendChild(table);
}

function openRestoreOffCodeModal(offCodeId) {
    restoreOffCodeId = offCodeId;
    $('#restoreOffCodeModal').modal('show');
}

function handleRestoreOffCode() {
    fetch(`${offCodeRestoreApiUrl}/${restoreOffCodeId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در فعال کردن مجدد کد تخفیف');
        return response.json();
    })
    .then(data => {
        fetchOffCodes(); // بارگذاری مجدد کدهای تخفیف غیرفعال
        $('#restoreOffCodeModal').modal('hide');
        showResponseModal('کد تخفیف با موفقیت فعال شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
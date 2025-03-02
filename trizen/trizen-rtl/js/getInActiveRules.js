const ruleApiUrl = 'http://avatoop.com/marina_kish/api/rules';
const ruleRestoreApiUrl = 'http://avatoop.com/marina_kish/api/rules/restore';
const userToken = localStorage.getItem('Token');
if (!userToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchRules();
    document.getElementById('confirmRestoreButton').addEventListener('click', handleRestoreRule);
});

let restoreRuleId = null;

async function fetchRules() {
    try {
        const response = await fetch(`${ruleApiUrl}/admin/trash`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${userToken}`, 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('خطا در دریافت قوانین');
        const data = await response.json();
        renderRuleTable(data.rule);
    } catch (error) {
        showResponseModal(`خطا: ${error.message}`, 'error');
    }
}

function renderRuleTable(rules) {
    const ruleContainer = document.querySelector('.rules-container');
    ruleContainer.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');

    // Create table header
    const thead = document.createElement('thead');

    thead.innerHTML = `
        <tr>
            <th>شماره</th>
            <th>متن قانون</th>
            <th>تاریخ ایجاد</th>
            <th>تاریخ بروزرسانی</th>
            <th>عملیات</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    rules.forEach(rule => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${rule.id}</td>
            <td>${rule.body}</td>
            <td>${rule.created_at ? rule.created_at.split("T")[0] : "نامشخص"}</td>
            <td>${rule.updated_at ? rule.updated_at.split("T")[0] : "نامشخص"}</td>
            <td>
                <button class="btn btn-success btn-sm" onclick="openRestoreRuleModal(${rule.id})">بازگردانی</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    ruleContainer.appendChild(table);
}

function openRestoreRuleModal(ruleId) {
    restoreRuleId = ruleId;
    $('#restoreRuleModal').modal('show');
}


function handleRestoreRule() {
    fetch(`${ruleRestoreApiUrl}/${restoreRuleId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در فعال کردن مجدد قانون');
        return response.json();
    })
    .then(data => {
        fetchRules(); // بارگذاری مجدد قوانین غیرفعال
        $('#restoreRuleModal').modal('hide');
        showResponseModal('قانون با موفقیت فعال شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
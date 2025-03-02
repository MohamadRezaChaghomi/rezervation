const ruleApiUrl = 'http://avatoop.com/marina_kish/api/rules';
const ruleToken = localStorage.getItem('Token');
if (!ruleToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchRules();
    document.getElementById('addRuleForm').addEventListener('submit', handleAddRule);
    document.getElementById('editRuleForm').addEventListener('submit', handleEditRule);
    document.getElementById('confirmDeleteButton').addEventListener('click', handleDeleteRule);
});

let deleteRuleId = null;
let editRuleId = null;

function fetchRules() {
    fetch(`${ruleApiUrl}/index/admin`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ruleToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در دریافت قوانین');
        return response.json();
    })
    .then(data => {
        renderRuleTable(data.rules);
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
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
                <button class="btn btn-warning" onclick="openEditRuleModal(${rule.id}, '${rule.body}')">ویرایش</button>
                <button class="btn btn-danger" onclick="openDeleteRuleModal(${rule.id})">حذف</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    ruleContainer.appendChild(table);
}

function openAddRuleModal() {
    document.getElementById('addRuleForm').reset();
    $('#addRuleModal').modal('show');
}

function openEditRuleModal(ruleId, body) {
    editRuleId = ruleId;
    document.getElementById('editRuleId').value = ruleId;
    document.getElementById('editRuleBody').value = body;
    $('#editRuleModal').modal('show');
}

function handleEditRule(event) {
    event.preventDefault();
    const updatedRule = {
        body: document.getElementById('editRuleBody').value
    };

    fetch(`${ruleApiUrl}/update/${editRuleId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${ruleToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRule)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در ویرایش قانون');
        return response.json();
    })
    .then(data => {
        fetchRules(); 
        $('#editRuleModal').modal('hide');
        showResponseModal('قانون با موفقیت ویرایش شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}
function handleAddRule(event) {
    event.preventDefault();
    const newRule = {
        body: document.getElementById('ruleBody').value
    };

    fetch(`${ruleApiUrl}/store`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ruleToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRule)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در افزودن قانون');
        return response.json();
    })
    .then(data => {
        fetchRules(); 
        $('#addRuleModal').modal('hide');
        showResponseModal('قانون با موفقیت اضافه شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function openDeleteRuleModal(ruleId) {
    deleteRuleId = ruleId;
    $('#confirmDeleteModal').modal('show');
}

function handleDeleteRule() {
    fetch(`${ruleApiUrl}/delete/${deleteRuleId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${ruleToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در حذف قانون');
        return response.json();
    })
    .then(data => {
        fetchRules(); 
        $('#confirmDeleteModal').modal('hide');
        showResponseModal('قانون با موفقیت حذف شد', 'success');
        
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function restoreRule(ruleId) {
    fetch(`${ruleApiUrl}/restore/${ruleId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ruleToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deleted_at: null })
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در فعال کردن مجدد قانون');
        return response.json();
    })
    .then(data => {
        renderRuleTable(rulesArray); // Refresh the table
        showResponseModal('قانون با موفقیت فعال شد', 'success');
        fetchRules(); 
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
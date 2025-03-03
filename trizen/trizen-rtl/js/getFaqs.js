const faqApiUrl = 'http://avatoop.com/marina_kish/api/faqs';
const faqToken = localStorage.getItem('Token');
if (!faqToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchFaqs();
    document.getElementById('addFaqForm').addEventListener('submit', handleAddFaq);
    document.getElementById('editFaqForm').addEventListener('submit', handleEditFaq);
    document.getElementById('confirmDeleteButton').addEventListener('click', handleDeleteFaq);
});

let deleteFaqId = null;
let editFaqId = null;


function fetchFaqs() {
    fetch(`${faqApiUrl}/index/1`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${faqToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در دریافت سوالات متداول');
        return response.json();
    })
    .then(data => {
        renderFaqTable(data.faqs.data);
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function renderFaqTable(faqs) {
    const faqContainer = document.querySelector('.faq-container');  
    faqContainer.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');

    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>سوال</th>
            <th>جواب</th>
            <th>تاریخ ایجاد</th>
            <th>تاریخ بروزرسانی</th>
            <th>عملیات</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    faqs.forEach(faq => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${faq.question}</td>
            <td>${faq.answer}</td>
            <td>${new Date(faq.created_at).toLocaleDateString('fa-IR')}</td>
            <td>${new Date(faq.updated_at).toLocaleDateString('fa-IR')}</td>
            <td>
                <button class="btn btn-warning" onclick="openEditFaqModal(${faq.id}, '${faq.question}', '${faq.answer}')">ویرایش</button>
                    <button class="btn btn-danger" onclick="openDeleteFaqModal(${faq.id})">حذف</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    faqContainer.appendChild(table);
}

function openAddFaqModal() {
    document.getElementById('addFaqForm').reset();
    $('#addFaqModal').modal('show');
}

function openEditFaqModal(faqId, question, answer) {
    editFaqId = faqId;
    document.getElementById('editFaqId').value = faqId;
    document.getElementById('editQuestion').value = question;
    document.getElementById('editAnswer').value = answer;
    $('#editFaqModal').modal('show');
}

function handleEditFaq(event) {
    event.preventDefault();
    const updatedFaq = {
        question: document.getElementById('editQuestion').value,
        answer: document.getElementById('editAnswer').value
    };

    fetch(`${faqApiUrl}/update/${editFaqId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${faqToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFaq)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در ویرایش سوال');
        return response.json();
    })
    .then(data => {
        fetchFaqs();
        $('#editFaqModal').modal('hide');
        showResponseModal('سوال با موفقیت ویرایش شد', 'success');
        
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}
function handleAddFaq(event) {
    event.preventDefault();
    const newFaq = {
        question: document.getElementById('faqQuestion').value,
        answer: document.getElementById('faqAnswer').value
    };

    fetch(`${faqApiUrl}/store`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${faqToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFaq)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در افزودن سوال');
        return response.json();
    })
    .then(data => {
        fetchFaqs(); 
        $('#addFaqModal').modal('hide');
        showResponseModal('سوال با موفقیت اضافه شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function openDeleteFaqModal(faqId) {
    deleteFaqId = faqId;
    $('#confirmDeleteModal').modal('show');
}

function handleDeleteFaq() {
    fetch(`${faqApiUrl}/delete/${deleteFaqId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${faqToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در حذف سوال');
        return response.json();
    })
    .then(data => {
        fetchFaqs();   
        $('#confirmDeleteModal').modal('hide');
        showResponseModal('سوال با موفقیت حذف شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
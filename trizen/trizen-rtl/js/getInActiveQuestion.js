const questionApiUrl = 'http://avatoop.com/marina_kish/api/faqs';
const questionRestoreApiUrl = 'http://avatoop.com/marina_kish/api/faqs/restore';
const userToken = localStorage.getItem('Token');
if (!userToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchQuestions();
    document.getElementById('confirmRestoreButton').addEventListener('click', handleRestoreQuestion);
});

let restoreQuestionId = null;

async function fetchQuestions() {
    try {
        const response = await fetch(`${questionApiUrl}/admin/trash`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${userToken}`, 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('خطا در دریافت سوالات');
        const data = await response.json();
        renderFaqTable(data.faq);
    } catch (error) {
        showResponseModal(`خطا: ${error.message}`, 'error');
    }
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
            <td>${faq.created_at ? faq.created_at.split("T")[0] : "نامشخص"}</td>
            <td>${faq.updated_at ? faq.updated_at.split("T")[0] : "نامشخص"}</td>
            <td>
                <button class="btn btn-success" onclick="openRestoreQuestionModal(${faq.id})">بازگردانی</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    faqContainer.appendChild(table);
}

function openRestoreQuestionModal(questionId) {
    restoreQuestionId = questionId;
    $('#restoreFaqModal').modal('show');
}

function handleRestoreQuestion() {
    fetch(`${questionRestoreApiUrl}/${restoreQuestionId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در فعال کردن مجدد سوال');
        return response.json();
    })
    .then(data => {
        fetchQuestions(); // بارگذاری مجدد سوالات غیرفعال
        $('#restoreFaqModal').modal('hide');
        showResponseModal('سوال با موفقیت فعال شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
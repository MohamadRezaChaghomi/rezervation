const commentApiUrl = 'http://avatoop.com/marina_kish/api/comments/comment_admin/index';
const productsApiUrl = 'http://avatoop.com/marina_kish/api/products/admin/index';
const usersApiUrl = 'http://avatoop.com/marina_kish/api/users/index';
const token = localStorage.getItem('Token');
if (!token) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchComments();
    document.getElementById('confirmApproveButton').addEventListener('click', handleApproveComment);
    document.getElementById('confirmRejectButton').addEventListener('click', handleRejectComment);
    document.getElementById('editCommentForm').addEventListener('submit', handleEditComment);
});

let editCommentId = null;
let approveCommentId = null;
let rejectCommentId = null;
let products = [];
let users = [];


function fetchComments() {
    fetch(productsApiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        products = data.product;
        return fetch(usersApiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    })
    .then(response => response.json())
    .then(data => {
        users = data.users.data;
        return fetch(commentApiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    })
    .then(response => response.json())
    .then(data => {
        renderCommentTable(data.data);
    })
    .catch(error => console.error('Error fetching data:', error));
    
}

function renderCommentTable(comments) {
    const commentContainer = document.querySelector('.comment-container');
    commentContainer.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');

    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>شماره</th>
            <th>محصول</th>
            <th>کاربر</th>
            <th>متن نظر</th>
            <th>جواب</th>
            <th>ستاره ها</th>
            <th>وضعیت</th>
            <th>تاریخ ایجاد</th>
            <th>عملیات</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    comments.forEach(comment => {
        const product = products.find(p => p.id === comment.product_id);
        const user = users.find(u => u.id === comment.user_id);

        const productName = product ? product.name : 'نامشخص';
        const nationalCode = user ? user.national_code : 'نامشخص';
        if(comment.status == 'approved'){
            comment.status = 'تایید شده';
        }else if(comment.status == 'rejected'){
            comment.status = 'رد شده';
        }
        else{
            comment.status = 'در انتظار';
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${comment.id}</td>
            <td>${productName}</td>
            <td>${nationalCode}</td>
            <td>${comment.body}</td>
            <td>${comment.answer}</td>
            <td>${comment.star}</td>
            <td>${comment.status}</td>
            <td>${new Date(comment.created_at).toLocaleDateString('fa-IR')}</td>
            <td class="'d-flex justify-content-center">
                <button class="btn btn-success btn-sm" onclick="openApproveCommentModal(${comment.id})">تایید</button>
                <button class="btn btn-danger btn-sm" onclick="openRejectCommentModal(${comment.id})">رد</button>
                <button class="btn btn-warning btn-sm" 
                    onclick="openEditCommentModal('${comment.id}', '${comment.body}', ${comment.star}, '${comment.answer}')">
                    جواب دادن
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    commentContainer.appendChild(table);
}

function openApproveCommentModal(commentId) {
    approveCommentId = commentId;
    $('#confirmApproveModal').modal('show');
}

function openRejectCommentModal(commentId) {
    rejectCommentId = commentId;
    $('#confirmRejectModal').modal('show');
}


function handleApproveComment() {
    fetch(`http://avatoop.com/marina_kish/api/comments/update/${approveCommentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'approved' })
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در تایید نظر');
        return response.json();
    })
    .then(data => {
        fetchComments(); 
        $('#confirmApproveModal').modal('hide');
        showResponseModal('نظر با موفقیت تایید شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function handleRejectComment() {
    fetch(`http://avatoop.com/marina_kish/api/comments/update/${rejectCommentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'rejected' })
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در رد نظر');
        return response.json();
    })
    .then(data => {
        fetchComments(); 
        $('#confirmRejectModal').modal('hide');
        showResponseModal('نظر با موفقیت رد شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}


function openEditCommentModal(id, body, star , answer) {
    editCommentId = id;
    document.getElementById('editCommentBody').value = body;
    document.getElementById('editCommentStar').value = star;
    document.getElementById('editCommentAnswer').value = answer;
    $('#editCommentModal').modal('show');
}

function handleEditComment(event) {
    event.preventDefault();
    const updatedComment = {
        answer: document.getElementById('editCommentAnswer').value,
        status: "approved",
    };
    console.log(updatedComment);
    fetch(`http://avatoop.com/marina_kish/api/comments/update/${editCommentId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedComment)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در ویرایش نظر');
        return response.json();
    })
    .then(data => {
        fetchComments(); 
        $('#editCommentModal').modal('hide');
        showResponseModal('نظر با موفقیت ویرایش شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
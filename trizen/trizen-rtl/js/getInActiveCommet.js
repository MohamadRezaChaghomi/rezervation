const commentTrashApiUrl = 'http://avatoop.com/marina_kish/api/comments/admin/trash';
const productsApiUrl = 'http://avatoop.com/marina_kish/api/products/admin/index';
const usersApiUrl = 'http://avatoop.com/marina_kish/api/users/index';

const commentRestoreApiUrl = 'http://avatoop.com/marina_kish/api/comments/restore';
const token = localStorage.getItem('Token');
if (!token) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchComments();
});

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
        return fetch(commentTrashApiUrl, {
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
        console.log(data);
        renderCommentTable(data.comment);
    })
    .catch(error => console.error('Error fetching data:', error));
    
    
}


function renderCommentTable(comments) {
    const commentContainer = document.querySelector('.comment-container');
    commentContainer.innerHTML = ''; // پاک کردن محتوای قبلی

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');
    table.innerHTML = `
        <thead>
        <tr>
            <th>شماره</th>
            <th>محصول</th>
            <th>کاربر</th>
            <th>متن نظر</th>
            <th>جواب</th>
            <th>ستاره ها</th>
            <th>وضعیت</th>
            <th>تاریخ ایجاد</th>
        </tr>
        </thead>
        <tbody>
            ${comments.map(comment => {
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

        
                const createdAt = comment.created_at ? moment(comment.created_at).format('jYYYY/jMM/jDD') : '';
                return `
                    <tr>
                        <td>${comment.id}</td>
                        <td>${productName}</td>
                        <td>${nationalCode}</td>
                        <td>${comment.body}</td>
                        <td>${comment.answer}</td>
                        <td>${comment.star}</td>
                        <td>${comment.status}</td>
                        <td>${new Date(comment.created_at).toLocaleDateString('fa-IR')}</td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    commentContainer.appendChild(table);
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
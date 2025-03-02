const TrashOrderApiUrl = 'http://avatoop.com/marina_kish/api/orders/admin/trash';
const productsApiUrl = 'http://avatoop.com/marina_kish/api/products/admin/index';
const usersApiUrl = 'http://avatoop.com/marina_kish/api/users/index';

const token = localStorage.getItem('Token');
if (!token) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

let products = [];
let users = [];

async function fetchTrashOrders() {
    try {
        const response = await fetch(TrashOrderApiUrl, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('خطا در دریافت سفارشات حذف‌شده');

        const data = await response.json();
        populateOrdersTable(data.order);
    } catch (error) {
        showResponseModal(`خطا: ${error.message}`, 'error');
    }
}

async function fetchDataAndRender() {
    try {
        await Promise.all([renderProductArrays(), renderUserArrays()]);
        await fetchTrashOrders();
    } catch (error) {
        console.error("خطا در دریافت داده‌ها:", error);
    }
}

async function renderProductArrays() {
    try {
        const response = await fetch(productsApiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        products = data.product;
    } catch (error) {
        showResponseModal(`خطا در دریافت محصولات: ${error.message}`, 'error');
    }
}

async function renderUserArrays() {
    try {
        const response = await fetch(usersApiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        users = data.users?.data || [];
    } catch (error) {
        showResponseModal(`خطا در دریافت کاربران: ${error.message}`, 'error');
    }
}

document.addEventListener('DOMContentLoaded', fetchDataAndRender);

function populateOrdersTable(orders) {

    const orderContainer = document.querySelector('.order-container');
    orderContainer.innerHTML = '';
    
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>شماره</th>
            <th>نام محصول (آیدی)</th>
            <th>کد ملی کاربر</th>
            <th>سانس</th>
            <th>تعداد</th>
            <th>قیمت کل</th>
            <th>وضعیت</th>
            <th>کد تخفیف</th>
            <th>تاریخ رزرو</th>
            <th>تاریخ ایجاد</th>
            <th>حذف شده</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    orders.forEach(order => {
        const product = products.find(p => p.id == order.product_id);
        const user = users.find(u => u.id == order.user_id);


        const productName = product ? product.name : 'نامشخص';
        const userNationalCode = user ? user.national_code : 'نامشخص';
        const totalPrice = order.factor ? order.factor.total_price : 'نامشخص';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${productName} (${order.product_id})</td>
            <td>${userNationalCode}</td>
            <td>${order.sans_id}</td>
            <td>${order.number}</td>
            <td>${totalPrice}</td>
            <td>حذف شده</td>
            <td>${order.off_code}</td>
            <td>${order.day_reserved ? order.day_reserved.split("T")[0] : "نامشخص"}</td>
            <td>${order.created_at ? order.created_at.split("T")[0] : "نامشخص"}</td>
            <td>✅</td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    orderContainer.appendChild(table);
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}

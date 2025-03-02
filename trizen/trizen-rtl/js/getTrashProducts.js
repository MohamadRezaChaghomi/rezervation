const productTrashApiUrl = 'http://avatoop.com/marina_kish/api/products/admin/trash';
const productRestoreApiUrl = 'http://avatoop.com/marina_kish/api/products/restore';
const productToken = localStorage.getItem('Token');

if (!productToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchTrashProducts();
    document.getElementById('confirmRestoreButton').addEventListener('click', handleRestoreProduct);
});

let restoreProductId = null;

function fetchTrashProducts() {
    fetch(productTrashApiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${productToken}`,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        renderTrashProductCards(data.product);
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function renderTrashProductCards(products) {
    const productContainer = document.querySelector('.product-container');
    productContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('card', 'mb-3', 'shadow-sm');
        productCard.innerHTML = `
        <div class="row no-gutters">
            <div class="col-md-4">
                <img src="../images/default__img.jpg" class="card-img" alt="${product.name}">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text"><strong>شماره:</strong> ${product.id}</p>
                    <p class="card-text"><strong>قیمت:</strong> ${product.price} تومان</p>
                    <p class="card-text"><strong>زمان:</strong> ${product.time} دقیقه</p>
                    <p class="card-text"><strong>محدودیت سنی:</strong> ${product.age_limited}</p>
                    <p class="card-text"><strong>تعداد کل:</strong> ${product.total}</p>
                    <p class="card-text"><strong>تعداد در انتظار:</strong> ${product.pending}</p>
                    <p class="card-text"><strong>درصد تخفیف :</strong> ${product.off_percent}</p>
                    <p class="card-text"><strong>توضیحات:</strong> ${product.description}</p>
                    <p class="card-text"><strong>نکته:</strong> ${product.tip}</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-success btn-sm" onclick="openRestoreProductModal(${product.id})">بازگردانی</button>                </div>
                </div>
        </div>
    `;
productContainer.appendChild(productCard);
    });
}

function handleRestoreProduct() {
    fetch(`http://avatoop.com/marina_kish/api/products/restore/${restoreProductId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${productToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در فعال کردن مجدد محصول');
        return response.json();
    })
    .then(data => {
        fetchTrashProducts();
        $('#restoreProductModal').modal('hide');

        showResponseModal('محصول با موفقیت فعال شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function openRestoreProductModal(productId) {
    restoreProductId = productId;
    $('#restoreProductModal').modal('show');
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
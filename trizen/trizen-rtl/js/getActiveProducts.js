const productApiUrl = 'http://avatoop.com/marina_kish/api/products/admin/index';
const productToken = localStorage.getItem('Token');

if (!productToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('editProductForm').addEventListener('submit', handleEditProduct);
    document.getElementById('confirmDeleteButton').addEventListener('click', handleDeleteProduct);
    document.getElementById('editProductImageForm').addEventListener('submit', handleEditProductImage);
    fetchProducts();
});

let deleteProductId = null;
let editProductId = null;
let editProductImageId = null;

function fetchProducts() {
    fetch(productApiUrl, {
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
        renderProductCards(data.product);
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function renderProductCards(products) {
    const productContainer = document.querySelector('.product-container');
    productContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('card', 'mb-3', 'shadow-sm');

        fetch(`http://avatoop.com/marina_kish/api/media/get_image/product/${product.id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${productToken}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('خطا در دریافت عکس محصول');
            return response.json();
        })
        .then(data => {
            const imageData = data.data[Object.keys(data.data)[0]];
            const imageUrl = imageData;
            productCard.innerHTML = `
            <div class="row no-gutters">
                <div class="col-md-4">
                    <img src="${imageUrl}" class="card-img" alt="${product.name}">
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
                    <button class="btn btn-warning btn-sm" onclick="openEditProductModal(${product.id}, '${product.name}', '${product.price}', '${product.time}', '${product.age_limited}', '${product.total}', '${product.pending}', '${product.description}', '${product.tip}', '${product.off_suggestion}', '${product.marina_suggestion}', '${product.started_at}', '${product.ended_at}')">ویرایش اطلاعات</button>
                    <button class="btn btn-info btn-sm" onclick="openEditProductImageModal(${product.id})">ویرایش عکس</button>
                    <button class="btn btn-danger btn-sm" onclick="openDeleteProductModal(${product.id})">حذف</button>
                    </div>
                </div>
            </div>
            `;
        productContainer.appendChild(productCard);
        })
        .catch(error => {
        const imageUrl = '../images/default__img.jpg';
        productCard.innerHTML = `
        <div class="row no-gutters">
            <div class="col-md-4">
                <img src="${imageUrl}" class="card-img" alt="${product.name}">
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
                <button class="btn btn-warning btn-sm" onclick="openEditProductModal(${product.id}, '${product.name}', '${product.price}', '${product.time}', '${product.age_limited}', '${product.total}', '${product.pending}', '${product.description}', '${product.tip}', '${product.off_suggestion}', '${product.marina_suggestion}', '${product.started_at}', '${product.ended_at}')">ویرایش اطلاعات</button>
                <button class="btn btn-info btn-sm" onclick="openEditProductImageModal(${product.id})">ویرایش عکس</button>
                <button class="btn btn-danger btn-sm" onclick="openDeleteProductModal(${product.id})">حذف</button>
                </div>
            </div>
        </div>
        `;
        });
    });
}

function openAddProductModal() {
    document.getElementById('addProductForm').reset();
    $('#addProductModal').modal('show');
}

function openEditProductModal(productId, name, price, time, age_limited, total, pending, description, tip, off_suggestion, marina_suggestion, started_at, ended_at) {
    editProductId = productId;
    document.getElementById('editProductId').value = productId;
    document.getElementById('editProductName').value = name;
    document.getElementById('editProductPrice').value = price;
    document.getElementById('editProductTime').value = time;
    document.getElementById('editProductAgeLimited').value = age_limited;
    document.getElementById('editProductTotal').value = total;
    document.getElementById('editProductPending').value = pending;
    document.getElementById('editProductDescription').value = description;
    document.getElementById('editProductTip').value = tip;
    document.getElementById('editProductOffSuggestion').value = off_suggestion;
    document.getElementById('editProductMarinaSuggestion').value = marina_suggestion;
    document.getElementById('editProductStartedAt').value = started_at;
    document.getElementById('editProductEndedAt').value = ended_at;
    $('#editProductModal').modal('show');
}


function openEditProductImageModal(productId) {
    editProductImageId = productId;
    $('#editProductImageModal').modal('show');
}

function handleEditProductImage(event) {
    event.preventDefault();
    const formData = new FormData();
    const imageInput = document.getElementById('productImageInput');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);

        fetch(`http://avatoop.com/marina_kish/api/media/save_image/product/${editProductImageId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/atom+xml',
                'Authorization': `Bearer ${productToken}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('خطا در آپلود عکس محصول');
            return response.json();
        })
        .then(data => {
            showResponseModal('عکس محصول با موفقیت آپلود شد', 'success');
            $('#editProductImageModal').modal('hide');
            fetchProducts();  
            })
        .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
    } else {
        showResponseModal('لطفاً یک عکس انتخاب کنید', 'error');
    }
}

function handleEditProduct(event) {
    event.preventDefault();
    const updatedProduct = {
        name: document.getElementById('editProductName').value,
        price: document.getElementById('editProductPrice').value,
        time: document.getElementById('editProductTime').value,
        off_percent: document.getElementById('editProductOffPercent').value,
        age_limited: document.getElementById('editProductAgeLimited').value,
        total: document.getElementById('editProductTotal').value,
        pending: document.getElementById('editProductPending').value,
        description: document.getElementById('editProductDescription').value,
        tip: document.getElementById('editProductTip').value,
        off_suggestion: document.getElementById('editProductOffSuggestion').value,
        marina_suggestion: document.getElementById('editProductMarinaSuggestion').value,
        started_at: document.getElementById('editProductStartedAt').value,
        ended_at: document.getElementById('editProductEndedAt').value
    };

    fetch(`http://avatoop.com/marina_kish/api/products/update/${editProductId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${productToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در ویرایش محصول');
        return response.json();
    })
    .then(data => {
        fetchProducts(); 
        $('#editProductModal').modal('hide');
        showResponseModal('محصول با موفقیت ویرایش شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function handleAddProduct(event) {
    event.preventDefault();
    const newProduct = {
        name: document.getElementById('productName').value,
        price: document.getElementById('productPrice').value,
        time: document.getElementById('productTime').value,
        off_percent: document.getElementById('productOffPercent').value,
        age_limited: document.getElementById('productAgeLimited').value,
        total: document.getElementById('productTotal').value,
        pending: document.getElementById('productPending').value,
        description: document.getElementById('productDescription').value,
        tip: document.getElementById('productTip').value,
        off_suggestion: document.getElementById('productOffSuggestion').value,
        marina_suggestion: document.getElementById('productMarinaSuggestion').value,
        started_at: document.getElementById('productStartedAt').value,
        ended_at: document.getElementById('productEndedAt').value
    };

    fetch(`http://avatoop.com/marina_kish/api/products/store`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${productToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در افزودن محصول');
        return response.json();
    })
    .then(data => {
        fetchProducts(); 
        $('#addProductModal').modal('hide');
        showResponseModal('محصول با موفقیت اضافه شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function openDeleteProductModal(productId) {
    deleteProductId = productId;
    $('#deleteProductModal').modal('show');
}

function handleDeleteProduct() {
    fetch(`http://avatoop.com/marina_kish/api/products/delete/${deleteProductId}`, {
        method: 'DELETE',
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
        fetchProducts();
        $('#deleteProductModal').modal('hide');
        showResponseModal('محصول با موفقیت حذف شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
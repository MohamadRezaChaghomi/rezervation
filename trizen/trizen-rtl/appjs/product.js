document.addEventListener("DOMContentLoaded", function () {
    const productsApiUrl = "http://avatoop.com/marina_kish/api/products/index"; // API محصولات
    const imagesApiBaseUrl = "http://avatoop.com/marina_kish/api/media/get_image/product/"; // API تصاویر

    fetch(productsApiUrl)
        .then(response => response.json())
        .then(productsData => {
            const productsContainer = document.getElementById("products-container");

            productsData.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("col-lg-4", "col-md-6", "col-sm-12");

                // مقدار پیش‌فرض تصویر
                // دریافت تصویر محصول از API
                fetch(`${imagesApiBaseUrl}${product.id}`)
                    .then(response => response.json())
                    .then(imageData => {
                        if (imageData.data && imageData.data.length > 0) {
                            productImage = imageData.data[0]; // اولین تصویر محصول
                        }

                        // نمایش کارت محصول
                        productCard.innerHTML = `
                            <div class="product-card">
                                <img src="${productImage}" alt="${product.name}" class="product-image" 
                                     style="width: 100%; height: auto;" 
                                     onerror="this.onerror=null; this.src='default.jpg';">
                                <h3 class="product-name">${product.name}</h3>
                                <p class="product-price">قیمت: ${product.price.toLocaleString()} تومان</p>
                                <p class="product-time">زمان: ${product.started_at} تا ${product.ended_at}</p>
                                <p class="product-description">${product.description.substring(0, 50)}...</p>
                                <a href="#" class="btn btn-primary">مشاهده جزئیات</a>
                            </div>
                        `;

                        productsContainer.appendChild(productCard);
                    })
                    .catch(error => console.error(`خطا در دریافت تصویر محصول ${product.id}:`, error));
            });
        })
        .catch(error => console.error("خطا در دریافت محصولات:", error));
});

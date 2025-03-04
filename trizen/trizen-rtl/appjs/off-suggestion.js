document.addEventListener("DOMContentLoaded", function () {
    const productsApiUrl = "http://avatoop.com/marina_kish/api/off_suggestion";
    const productsContainer = document.getElementById("discount-products");
    const noProductsMessage = document.getElementById("no-products-message");
    const pTagLoadingOff = document.getElementById("pTagLoadingOff");

    // دکمه‌های اسکرول
    const scrollLeftBtnOff = document.getElementById("scroll-left-btn-off");
    const scrollRightBtnOff = document.getElementById("scroll-right-btn-off");

    // عرض یک محصول
    let productWidth = 0;

    // دریافت محصولات از API
    fetch(productsApiUrl)
        .then(response => response.json())
        .then(productsData => {
            if (productsData.data.length == 0) {
                noProductsMessage.textContent = "محصولی وجود ندارد";
                return;
            } else {
                noProductsMessage.textContent = '';
            }
            if (productsData.data && productsData.data !== 0) {
                productsData.data.forEach(product => {
                    const productCard = document.createElement("div");
                    productCard.classList.add("product-card");

                    fetch(`http://avatoop.com/marina_kish/api/media/get_image/product/${product.id}`)
                        .then(response => response.json())
                        .then(imageData => {
                            let productImage = '';
                            if (imageData.data && Array.isArray(imageData.data) && imageData.data.length > 0) {
                                productImage = imageData.data[0]; // اولین تصویر محصول
                            }
                            productCard.innerHTML = `
                                <a href="car-single.html?id=${product.id}" 
                                   class="product-card"
                                   product_id="${product.id}">
                                    <img src="${productImage}" alt="${product.name}" class="product-image" 
                                         onerror="this.onerror=null; this.src='default.jpg';">
                                    <h3 class="product-name mt-2 font-size-16">${product.name}</h3>
                                    <p class="product-time d-flex font-size-14 pl-3"><i class="la la-clock"></i>&nbsp;${product.time} دقیقه</p>
                                    <div class="card-price d-flex align-items-center justify-content-between mb-3 mt-2">
                                        <p class="product-price d-flex font-size-14 pl-3">${product.price.toLocaleString()}&nbsp;&nbsp;تومان</p>
                                    </div>
                                    <a href="car-single.html?id=${product.id}">مشاهده جزئیات<i class="la la-angle-left"></i></a>
                                </a>
                            `;

                            productCard.querySelector(".product-card").addEventListener("click", function (event) {
                                event.preventDefault();
                                let product_id = this.getAttribute("product_id");
                                localStorage.setItem("product_id", product_id);
                                window.location.href = `car-single.html?id=${product_id}`;
                            });
                            productsContainer.appendChild(productCard);

                            if (productWidth === 0) {
                                productWidth = productCard.offsetWidth + 20; // عرض محصول + فاصله بین محصولات
                            }
                        })
                        .catch(error => console.error(`خطا در دریافت تصویر محصول ${product.id}:`, error));
                });

                pTagLoadingOff.parentElement.classList.add("mt-0");
                pTagLoadingOff.classList.add("d-none");
            } else {
                pTagLoadingOff.classList.add('d-none');
                noProductsMessage.textContent = "خطا در دریافت اطلاعات محصولات";
            }
        })
        .catch(error => {
            console.error("خطا در دریافت محصولات:", error);
        });

    // اسکرول محصولات به اندازه یک محصول با کلیک روی دکمه‌ها
    scrollLeftBtnOff.addEventListener("click", () => {
        productsContainer.scrollBy({
            left: -productWidth,
            behavior: 'smooth' // اسکرول نرم
        });
    });

    scrollRightBtnOff.addEventListener("click", () => {
        productsContainer.scrollBy({
            left: productWidth,
            behavior: 'smooth' // اسکرول نرم
        });
    });
});
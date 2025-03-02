let pTagLoading = document.getElementById('pTagLoading');

document.addEventListener("DOMContentLoaded", function () {

    let token = localStorage.getItem('Token');

    if(token){

        fetch('http://avatoop.com/marina_kish/api/users/ME', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('id', data.id)
            let fullName = data.first_name + " " + data.last_name;

            loginAndSignUpDiv.classList.add('d-none');
            nameOfUserHeader.parentNode.classList.remove('d-none');
            nameOfUserHeader.innerHTML = `
                <span class="la la-user form-icon font-size-24 mr-2"></span>
                <span>${fullName}</span>
            `;        
        })
        .catch(error => {
            console.error('خطا در دریافت اطلاعات کاربر:', error);
        });
    }else{
        nameOfUserHeader.parentNode.classList.remove('d-none');
    }

    const productsApiUrl = "http://avatoop.com/marina_kish/api/products/index";
    const imagesApiBaseUrl = "http://avatoop.com/marina_kish/api/media/get_image/product/";
    const productsContainer = document.getElementById("products-container");
    const noProductsMessage = document.getElementById("no-products-message"); // اسپن برای نمایش پیام

    fetch(productsApiUrl)
        .then(response => response.json())
        .then(productsData => {
            // بررسی کنیم که آیا محصولی وجود دارد یا نه
            if (productsData.length === 0) {
                noProductsMessage.textContent = "محصولی وجود ندارد"; // نمایش پیام درون اسپن
                return; // اجرای کدهای بعدی متوقف شود
            } else {
                noProductsMessage.textContent = ""; // اگر محصول وجود داشت، متن اسپن را پاک کنیم
            }

            productsData.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("col-lg-4", "col-md-4", "col-sm-6", "d-flex", "justify-content-center");

                fetch(`${imagesApiBaseUrl}${product.id}`)
                    .then(response => response.json())
                    .then(imageData => {
                        let productImage = "default.jpg";
                        if (imageData.data && imageData.data.length > 0) {
                            productImage = imageData.data[0];
                        }

                        productCard.innerHTML = `
                            <a href="car-single.html?id=${product.id}" 
                               class="product-card"
                               product_id="${product.id}">
                                <img src="${productImage}" alt="${product.name}" class="product-image" 
                                     style="width: 100%; height: auto;" 
                                     onerror="this.onerror=null; this.src='default.jpg';">
                                <h3 class="product-name mt-4 font-size-18">${product.name}</h3>
                                <p class="product-time d-flex font-size-16"><i class="la la-clock"></i>&nbsp;${product.time} دقیقه</p>
                                <div class="card-price d-flex align-items-center justify-content-between mb-4 mt-2">
                                    <p class="product-price d-flex font-size-18" style="color:#2255d7;">${product.price.toLocaleString()}&nbsp;&nbsp;تومان</p>
                                </div>
                                <span class="btn-text">مشاهده جزئیات<i class="la la-angle-left"></i></span>
                            </a>
                        `;

                        productCard.querySelector(".product-card").addEventListener("click", function (event) {
                            event.preventDefault();

                            let product_id = this.getAttribute("product_id");
                            localStorage.setItem("product_id", product_id);

                            console.log("product_id", product_id);

                            window.location.href = `car-single.html?id=${product_id}`;
                        });

                        productsContainer.appendChild(productCard);
                        pTagLoading.parentElement.classList.add("mt-0");
                        pTagLoading.classList.add("d-none")      
                    })
                    .catch(error => console.error(`خطا در دریافت تصویر محصول ${product.id}:`, error));
            });
        })
        .catch(error => {
            console.error("خطا در دریافت محصولات:", error);
            noProductsMessage.textContent = "خطا در دریافت اطلاعات محصولات";
        });
});

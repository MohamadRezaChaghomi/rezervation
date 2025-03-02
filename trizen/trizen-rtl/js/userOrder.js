const BASE_URL = "http://avatoop.com/marina_kish/api";
const ruleToken = localStorage.getItem('Token');
if (!ruleToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

let user_Id;
let product_Id;

document.addEventListener("DOMContentLoaded", async function () {
    let storedOrder = localStorage.getItem("orderData");
    let order = JSON.parse(storedOrder);
    if (!order) {
        console.error("Order data not found in local storage");
        return;
    }

    user_Id = order.user_id;
    product_Id = order.product_id;

    let ageLimit = await fetchProductAgeLimit(product_Id);
    let productName = await fetchProductName(product_Id);
    let productImage = await fetchProductImage(product_Id);
    let total_price = order.number * order.price;

    renderOrderDetails(order, productName, productImage, total_price, ageLimit);
    renderTravelerForms(order.number, ageLimit);

    document.querySelectorAll(".select-old-traveler").forEach((button, index) => {
        button.addEventListener("click", function () {
            fetchTravelers(user_Id, index);
            const modal = new bootstrap.Modal(document.getElementById('selectTravelerModal'));
            modal.show();
        });
    });

    const errorMessage = document.createElement("p");
    errorMessage.className = "text-danger mt-2 errorFormPassengers";
    errorMessage.style.display = "none";
    errorMessage.textContent = "لطفاً اطلاعات تمام گردشگران را تکمیل کنید.";

    const paymentContainer = document.querySelector(".payment-container");
    paymentContainer.appendChild(errorMessage);
});

async function fetchProductAgeLimit(productId) {
    try {
        const response = await fetch(`${BASE_URL}/products/index/${productId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${ruleToken}`
            }
        });

        if (response.ok) {
            const productData = await response.json();
            return productData[0]?.age_limited || 0;
        }
    } catch (error) {
        console.error("Error fetching product age limit:", error);
    }
    return 0;
}

async function fetchProductName(productId) {
    try {
        const response = await fetch(`${BASE_URL}/products/index/${productId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${ruleToken}`
            }
        });
        if (response.ok) {
            const productData = await response.json();
            return productData.name || "نامشخص";
        }
    } catch (error) {
        console.error("Error fetching product name:", error);
    }
    return "نامشخص";
}

async function fetchProductImage(productId) {
    try {
        const response = await fetch(`${BASE_URL}/media/get_image/product/${productId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${ruleToken}`
            }
        });

        if (response.ok) {
            const imageData = await response.json();
            const imageKey = Object.keys(imageData.data)[0];
            return imageData.data[imageKey];
        }
    } catch (error) {
        console.error("Error fetching product image:", error);
    }
    return "../images/default__img.jpg";
}

function renderOrderDetails(order, productName, productImage, total_price, ageLimit) {
    const user_id = order.user_id;
    const orderContainer = document.querySelector(".card-order");
    orderContainer.innerHTML = `
        <div class="card mb-3">
            <div class="row no-gutters">
                <div class="col-md-4">
                    <img src="${productImage}" class="card-img" alt="تصویر محصول">
                </div>
                <div class="col-md-8">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${productName}</h5>
                        <p class="card-text"><strong>تاریخ:</strong><span class="date">${order.day_reserved}</span></p>
                        <p class="card-text"><strong>سانس:</strong><span class="sans">${order.sans_id}</span></p>
                        <p class="card-text"><strong>تعداد:</strong> <span id="order-count">${order.number}</span></p>
                        <p class="card-text"><strong>سن مجاز:</strong> <span id="order-ageLimit">${ageLimit}</span></p>
                        <p class="card-text">مجموع قیمت: <span id="original-price">${total_price} تومان</span></p>
                        <p class="card-text text-success font-weight-bold" id="discounted-price"></p>
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <input type="text" class="form-control w-100" id="discount-code" placeholder="کد تخفیف" style="max-width: 200px;">
                            </div>
                            <div class="col-md-8">
                                <button class="btn btn-success" onclick="applyDiscount(${order.user_id})">اعمال تخفیف</button>
                            </div>
                        </div>
                        <p class="text-danger error-message" id="discount-error" style="display: none;">کد تخفیف معتبر نمی‌باشد.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function applyDiscount(user_id) {
    const discountCode = document.getElementById('discount-code').value;
    const totalPrice = parseFloat(document.getElementById('original-price').textContent);
    const discountError = document.getElementById('discount-error');

    try {
        const response = await fetch(`${BASE_URL}/off_codes/use/${user_id}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${ruleToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "code": discountCode,
                "price": totalPrice
            })
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            const newPrice = responseData["new price"];
            if (newPrice === undefined) {
                discountError.style.display = "block";
                console.error("خطا در دریافت تخفیف");
            } else {
                document.getElementById('original-price').classList.add("text-danger", "font-weight-bold");
                document.getElementById('discounted-price').textContent = `قیمت جدید: ${newPrice} تومان`;
                discountError.style.display = "none";
            }
        }
    } catch (error) {
        discountError.style.display = "block";
        console.error("خطا در برقراری ارتباط با سرور:", error);
    }
}

async function fetchTravelers(userId, travelerIndex) {
    try {
        const response = await fetch(`${BASE_URL}/passengers/index?user_id=${userId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${ruleToken}`
            }
        });

        if (!response.ok) {
            throw new Error("خطا در دریافت داده‌ها");
        }

        const data = await response.json();
        let travelers = Array.isArray(data) ? data : [data];
        renderTravelerTable(data.data, travelerIndex);
    } catch (error) {
        console.error("خطا در دریافت اطلاعات گردشگران:", error);
    }
}

function renderTravelerTable(travelers, travelerIndex) {
    const tableBody = document.getElementById("travelerTable");
    tableBody.innerHTML = "";

    travelers.forEach(traveler => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${traveler.name}</td>
            <td>${traveler.gender === "mail" ? "مرد" : "زن"}</td>
            <td>${traveler.birth_day.split("T")[0]}</td>
            <td>${traveler.national_code}</td>
            <td>
                <button class="btn btn-primary select-traveler-btn" data-index="${travelerIndex}"
                    data-name="${traveler.name}" data-gender="${traveler.gender}"
                    data-birthdate="${traveler.birth_day.split("T")[0]}"
                    data-nationalcode="${traveler.national_code}">
                    انتخاب
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    document.querySelectorAll(".select-traveler-btn").forEach(button => {
        button.addEventListener("click", function () {
            selectTraveler(this);
            
        });
    });
}

function selectTraveler(button) {
    // دریافت ایندکس فرم مربوطه
    const travelerIndex = button.getAttribute("data-index");
    const name = button.getAttribute("data-name");
    const gender = button.getAttribute("data-gender");
    const birthdate = button.getAttribute("data-birthdate");
    const nationalCode = button.getAttribute("data-nationalcode");

    // پیدا کردن فرم مربوطه
    const travelerForms = document.querySelectorAll(".traveler-box");
    const selectedForm = travelerForms[travelerIndex]; // استفاده از ایندکس مستقیم

    if (selectedForm) {
        // پر کردن فرم با اطلاعات گردشگر
        selectedForm.querySelector(".traveler-name").value = name;
        selectedForm.querySelector(".traveler-id").value = nationalCode;
        selectedForm.querySelector(".traveler-birthdate").value = birthdate;
        selectedForm.querySelector(".traveler-gender").value = gender;
    }

    // بستن مدال
    const modalElement = document.getElementById('selectTravelerModal');
    const modal = new bootstrap.Modal(modalElement); // ایجاد یک نمونه جدید از مدال
    modal.hide(); // بستن مدال
}

function validateTravelerForms() {
    const travelerForms = document.querySelectorAll(".traveler-box");
    let isValid = true;

    travelerForms.forEach(form => {
        const name = form.querySelector(".traveler-name").value;
        const id = form.querySelector(".traveler-id").value;
        const birthdate = form.querySelector(".traveler-birthdate").value;
        const gender = form.querySelector(".traveler-gender").value;

        if (!name || !id || !birthdate || !gender) {
            isValid = false;
        }

        const birthDate = new Date(birthdate);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const ageLimit = document.getElementById("order-ageLimit").textContent;

        if (age < ageLimit) {
            const ageWarning = form.querySelector(".age-warning");
            ageWarning.style.display = "block";
            isValid = false;
        } else {
            const ageWarning = form.querySelector(".age-warning");
            ageWarning.style.display = "none";
        }

        if (!isValid) {
            const passengersError = document.querySelector(".errorFormPassengers");
            passengersError.style.display = "block";
        }
    });

    const errorMessage = document.querySelector(".payment-container .text-danger");
    if (!isValid) {
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
    }

    return isValid;
}

function renderTravelerForms(travelerCount, ageLimit) {
    const ticketContainer = document.querySelector(".payment-container");
    ticketContainer.innerHTML = "";

    for (let i = 0; i < travelerCount; i++) { // تغییر ایندکس به ۰
        const travelerDiv = document.createElement("div");
        travelerDiv.className = "traveler-box mb-3 p-3 border rounded";
        travelerDiv.setAttribute("data-age-limit", ageLimit);

        travelerDiv.innerHTML = `
            <button type="button" class="btn btn-secondary select-old-traveler mb-2" data-index="${i}" data-toggle="modal" data-target="#selectTravelerModal">انتخاب گردشگران سابق</button>
            <button type="button" class="btn btn-danger remove-traveler mb-2">حذف</button>
            <input type="text" class="form-control mb-2 traveler-name" placeholder="نام و نام خانوادگی">
            <input type="text" class="form-control mb-2 traveler-id" placeholder="کد ملی">
            <input type="date" class="form-control mb-2 traveler-birthdate" placeholder="تاریخ تولد">
            <select class="form-control mb-2 traveler-gender">
                <option value="mail">مرد</option>
                <option value="female">زن</option>
            </select>
        `;

        travelerDiv.querySelector(".remove-traveler").addEventListener("click", function () {
            travelerDiv.remove();

            let countElement = document.getElementById("order-count");
            let count = Math.max(1, parseInt(countElement.textContent) - 1);
            countElement.textContent = count;

            let originalPriceElement = document.getElementById("original-price");
            let discountedPriceElement = document.getElementById("discounted-price");

            let currentTotalPrice = parseFloat(originalPriceElement.textContent.replace(/\D/g, ''));
            let perTravelerPrice = currentTotalPrice / (count + 1);

            let newTotalPrice = perTravelerPrice * count;
            originalPriceElement.textContent = `${newTotalPrice} تومان`;

            if (discountedPriceElement.textContent.trim()) {
                let discountedTotalPrice = parseFloat(discountedPriceElement.textContent.replace(/\D/g, ''));
                let perTravelerDiscountedPrice = discountedTotalPrice / (count + 1);
                let newDiscountedTotalPrice = perTravelerDiscountedPrice * count;
                discountedPriceElement.textContent = `قیمت جدید: ${newDiscountedTotalPrice} تومان`;
            }
        });

        ticketContainer.appendChild(travelerDiv);
    }
}
async function handleData() {
    if (!validateTravelerForms()) {
        return;
    }

    let discountedPriceElement = document.getElementById("discounted-price");
    let originalPriceElement = document.getElementById("original-price");

    let price = discountedPriceElement.textContent.trim() ? discountedPriceElement.textContent : originalPriceElement.textContent;
    console.log(document.getElementById("date").textContent);
    let newOrder = {
        "user_id": user_Id,
        "product_id": product_Id,
        "number": document.getElementById("order-count").textContent,
        "day_reserved": document.getElementById("date").textContent,
        "sans_id": document.getElementById("sans").textContent,
        "off_code": document.getElementById("discount-code").value,
        "price": parseFloat(price.replace(/\D/g, ''))
    };

    try {
        const response = await fetch(`${BASE_URL}/orders/store`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('Token')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newOrder)
        });

        if (!response.ok) {
            throw new Error("خطا در ثبت سفارش");
        }

        const responseData = await response.json();
        console.log("سفارش با موفقیت ثبت شد:", responseData);
    } catch (error) {
        console.error("خطا در ارسال درخواست:", error);
    }
}
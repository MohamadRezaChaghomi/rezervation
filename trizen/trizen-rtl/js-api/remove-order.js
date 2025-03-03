let removeOrderBtn = document.getElementById('removeOrderBtn');


document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'removePurchasedTicketBtn') {
        removeOrderBtn.addEventListener('click', ()=> {

            let purchasedTicket_id = event.target.getAttribute('purchasedTicket_id');
            const token = localStorage.getItem('Token');
            
            if (!token) {
                console.error("توکن یافت نشد، لطفاً وارد شوید.");
                return;
            }

            fetch(`http://avatoop.com/marina_kish/api/orders/cancel/${purchasedTicket_id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.message === "سفارش با موفقیت لغو شد"){
                    getAllOrder()
                }
            })
            .catch(error => {
                console.error("خطا در خروج از حساب:", error);
            });
        })
    }
})

function getAllOrder() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('Token');
    const firstName_lastName = localStorage.getItem('firstName_lastName');

    let navNameOfUser = document.getElementById('navNameOfUser');
    if (firstName_lastName) {
        navNameOfUser.innerText = firstName_lastName;
    } else {
        navNameOfUser.innerText = "کاربر";
    }

    let sidebarNameOfUser = document.getElementById('sidebarNameOfUser');
    if (firstName_lastName) {
        sidebarNameOfUser.innerText = firstName_lastName;
    } else {
        sidebarNameOfUser.innerText = "کاربر";
    }

    if (!id) {
        console.error("ID کاربر در localStorage موجود نیست.");
    }

    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }

    dashboardAreaHasPurchasedTicketSection.classList.add('d-none');
    dashboardAreaNoPurchasedTicket.classList.add('d-none');

    fetch(`http://avatoop.com/marina_kish/api/orders/index`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data.order) && data.order.length > 0) {
            pTagLoading.parentElement.classList.add("mt-0");
            pTagLoading.classList.add('d-none');
            dashboardAreaNoPurchasedTicket.classList.remove('d-none');
            let counter = 1;
            dashboardAreaHasPurchasedTicket.innerHTML = ''; // پاک‌سازی محتوای قبلی جدول

            let hasOrder = false; // متغیر کمکی برای بررسی وجود سفارش برای کاربر فعلی

            data.order.forEach(user => {
                if (user.user_id !== +(id)) { // بررسی اینکه سفارش متعلق به کاربر فعلی است
                    hasOrder = true; // کاربر سفارش دارد
                    let product_id = user.product_id;

                    fetch(`http://avatoop.com/marina_kish/api/products/index/${product_id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => response.json())
                    .then(productData => {
                        console.log("Product Data:", productData);
                        let createdDate = formatDate(user.created_at);
                        let reservedDate = formatDate(user.day_reserved);

                        dashboardAreaHasPurchasedTicket.insertAdjacentHTML('beforeend', `
                            <tr>
                                <th scope="row"><i class="mr-1 font-size-18"></i>${counter}</th>
                                <td>
                                    <div class="table-content">
                                        <h3 class="title">${productData.name}</h3>
                                    </div>
                                </td>
                                <td>${createdDate}</td>
                                <td>${reservedDate}</td>
                                <td>${user.number}</td>
                                <td>${user.number}</td>
                                <td>${user.number}</td>
                                <td>
                                    <div class="table-content">
                                       <button class="theme-btn theme-btn-small" type="button" data-toggle="modal" data-target="#removePurchasedTicketModal" id="removePurchasedTicketBtn" purchasedTicket_id="${user.id}">لغو</button>
                                    </div>
                                </td>
                            </tr>
                        `);
                        counter++;
                    })
                    .catch(error => {
                        console.error('خطا در دریافت اطلاعات محصول:', error);
                    });
                }
            });

            // بررسی نهایی: اگر کاربر سفارشی نداشت
            if (!hasOrder) {
                dashboardAreaHasPurchasedTicketSection.classList.add('d-none');
                dashboardAreaNoPurchasedTicket.classList.remove('d-none');
            } else {
                dashboardAreaNoPurchasedTicket.classList.add('d-none');
                dashboardAreaHasPurchasedTicketSection.classList.remove('d-none');
            }
        } else {
            // اگر هیچ سفارشی وجود نداشت
            dashboardAreaHasPurchasedTicketSection.classList.add('d-none');
            dashboardAreaNoPurchasedTicket.classList.remove('d-none');
            pTagLoading.parentElement.classList.add("mt-0");
            pTagLoading.classList.add("d-none");
        }
    })
    .catch(error => {
        console.error('خطا در دریافت اطلاعات سفارشات:', error);
    });
}



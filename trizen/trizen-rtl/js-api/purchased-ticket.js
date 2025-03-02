var $ = document;
let dashboardAreaNoPurchasedTicket = $.getElementById("dashboardAreaNoPurchasedTicket");
let dashboardAreaHasPurchasedTicketSection = $.getElementById("dashboardAreaHasPurchasedTicketSection");
let dashboardAreaHasPurchasedTicket = $.getElementById("dashboardAreaHasPurchasedTicket");
let pTagLoading = $.getElementById("pTagLoading");
let removePurchasedTicketBtn = $.getElementById("removePurchasedTicketBtn");

window.addEventListener('DOMContentLoaded', getAllOrder);

function getAllOrder() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('Token');
    const firstName_lastName = localStorage.getItem('firstName_lastName');

    let navNameOfUser = document.getElementById('navNameOfUser');
    let sidebarNameOfUser = document.getElementById('sidebarNameOfUser');
    
    navNameOfUser.innerHTML = ' <i class="la la-user font-size-24"></i>' + firstName_lastName;
    sidebarNameOfUser.innerHTML = `
    <span class="d-flex flex-column align-items-center">
        <i class="la la-user font-size-70 d-flex justify-content-center" style="margin-bottom:-20px;"></i><br>
        ${firstName_lastName}
    </span>
`;

    if (!id) {
        console.error("ID کاربر در localStorage موجود نیست.");
    }

    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }

    dashboardAreaHasPurchasedTicketSection.classList.add('d-none')
    dashboardAreaNoPurchasedTicket.classList.add('d-none')

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
        console.log(data.order)
        if (data && Array.isArray(data.order) && data.order.length > 0) {
            pTagLoading.parentElement.classList.add("mt-0");
            pTagLoading.classList.add('d-none')
            dashboardAreaNoPurchasedTicket.classList.remove('d-none')
            let counter = 1
            data.order.forEach(user => {
                if (user.user_id === +(id)) {

                    let product_id = user.product_id

                    fetch(`http://avatoop.com/marina_kish/api/products/index/${product_id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        let createdDate = formatDate(user.created_at);
                        let reservedDate = formatDate(user.day_reserved);

                        dashboardAreaHasPurchasedTicket.insertAdjacentHTML('beforeend', `
                            <tr>
                                <th scope="row"><i class="mr-1 font-size-18"></i>${counter}</th>
                                <td>
                                    <div class="table-content">
                                        <h3 class="title">${data.name}</h3>
                                    </div>
                                </td>
                                <td>${createdDate}</td>
                                <td>${reservedDate}</td>
                                <td>${user.number}</td>
                                <td>${user.number}</td>
                                <td>${user.number}</td>
                                <td>
                                    <div class="table-content">
                                       <button class="theme-btn theme-btn-small"  type="button" data-toggle="modal" data-target="#removePurchasedTicketModal" id="removePurchasedTicketBtn" purchasedTicket_id="${user.id}">لغو</button>
                                    </div>
                                </td>
                            </tr>
                            `)
                        counter++
                    })
                } else {
                    console.log("wxetrchfrehjygtrhujhygtrfegtfr")
                    dashboardAreaHasPurchasedTicketSection.classList.add('d-none')
                    dashboardAreaNoPurchasedTicket.classList.remove('d-none')
                    pTagLoading.parentElement.classList.add("mt-0");
                    pTagLoading.classList.add("d-none")
                }
            })
            dashboardAreaNoPurchasedTicket.classList.add('d-none')
            dashboardAreaHasPurchasedTicketSection.classList.remove('d-none')
        }
    })
    .catch(error => {
        console.error('خطا در دریافت اطلاعات کاربر:', error);
    });
}

function formatDate(dateString) {
    if (!dateString) return "نامشخص";

    let date = new Date(dateString);
    if (isNaN(date.getTime())) return "نامعتبر";

    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

var $ = document;
let dashboardAreaNoPurchasedTicket = $.getElementById("dashboardAreaNoPurchasedTicket");
let dashboardAreaHasPurchasedTicketSection = $.getElementById("dashboardAreaHasPurchasedTicketSection");
let dashboardAreaHasPurchasedTicket = $.getElementById("dashboardAreaHasPurchasedTicket");
let pTagLoading = $.getElementById("pTagLoading");
let removePurchasedTicketBtn = $.getElementById("removePurchasedTicketBtn");


window.addEventListener('DOMContentLoaded', () => {

    const id = localStorage.getItem('id');
    const token = localStorage.getItem('Token');
    
    const firstName_lastName = localStorage.getItem('firstName_lastName');

    let navNameOfUser = $.getElementById('navNameOfUser');
    if (firstName_lastName) {
        navNameOfUser.innerText = firstName_lastName;
    }else{
        navNameOfUser.innerText = "کاربر";
    }
    
    let sidebarNameOfUser = $.getElementById('sidebarNameOfUser');
    if (firstName_lastName) {
        sidebarNameOfUser.innerText = firstName_lastName;
    }else{
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
        console.log(token,id)
        if (data && Array.isArray(data.order) && data.order.length > 0) {
            pTagLoading.parentElement.classList.add("mt-0");
            pTagLoading.classList.add('d-none')
            dashboardAreaNoPurchasedTicket.classList.remove('d-none')
            let counter = 1
            console.log(data)
            data.order.forEach(user => {
                console.log(id)
                console.log(user.user_id)
                if(user.user_id === +(id)){
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
                        localStorage.setItem("productName", data.name)
                        console.log(productName)
                    })
    
                    let productName = localStorage.getItem("productName")
    
                    let createdDate = formatDate(user.created_at);
                    let reservedDate = formatDate(user.day_reserved);
    
                    dashboardAreaHasPurchasedTicket.insertAdjacentHTML('beforeend', `
                        <tr>
                            <th scope="row"><i class="mr-1 font-size-18"></i>${counter}</th>
                            <td>
                                <div class="table-content">
                                    <h3 class="title">${productName}</h3>
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
                }

                
            })
                dashboardAreaNoPurchasedTicket.classList.add('d-none')
                dashboardAreaHasPurchasedTicketSection.classList.remove('d-none')
        } else {
            dashboardAreaHasPurchasedTicketSection.classList.add('d-none')
            dashboardAreaNoPurchasedTicket.classList.remove('d-none')
            pTagLoading.parentElement.classList.add("mt-0");
            pTagLoading.classList.add("d-none")
        }
    })
    .catch(error => {
        console.error('خطا در دریافت اطلاعات کاربر:', error);
    });
})


function formatDate(dateString) {
    if (!dateString) return "نامشخص";

    let date = new Date(dateString);
    if (isNaN(date.getTime())) return "نامعتبر";

    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();

    return `${year}-${month}-${day}`;
}


document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'removePurchasedTicketBtn') {

        let bodyCommentDetail = $.getElementById("bodyCommentDetail");
        let answerCommentDetail = $.getElementById("answerCommentDetail");
    
        const token = localStorage.getItem('Token');

        let purchasedTicket_id = event.target.getAttribute('purchasedTicket_id');

        bodyCommentDetail.value = "در حال بارگذاری..."
        answerCommentDetail.textContent = "در حال بارگذاری..."


        fetch(`http://avatoop.com/marina_kish/api/comments/index?id=${purchasedTicket_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.order && data.order.length > 0) {
                let user = data.order.find(u => u.id == purchasedTicket_id);

                if (user) {
                    bodyCommentDetail.value = user.body
                    answerCommentDetail.value = user.answer

                } else {
                    console.warn("کاربری با این ID یافت نشد!");
                }
            } else {
                console.warn("هیچ اطلاعاتی برای این کاربر یافت نشد!");
            }
        })
        .catch(error => {
            console.error('خطا در دریافت اطلاعات کاربر:', error);
        });
    }
})
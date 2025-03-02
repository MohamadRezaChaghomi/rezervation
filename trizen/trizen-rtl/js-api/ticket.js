var $ = document;
let dashboardAreaHasTicket = $.getElementById("dashboardAreaHasTicket");
let dashboardAreaNoTicket = $.getElementById("dashboardAreaNoTicket");
let dashboardAreaSendTicket = $.getElementById("dashboardAreaSendTicket");
let dashboardAreaHasTicketSection = $.getElementById("dashboardAreaHasTicketSection");
let pTagLoading = $.getElementById("pTagLoading");
let sendNewTicket = $.getElementById("sendNewTicket");
let detailTicketBtn = $.getElementById("detailTicketBtn");

if (!id) {
    console.error("ID کاربر در localStorage موجود نیست.");
}

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
    
    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }

    dashboardAreaNoTicket.classList.add('d-none')
    dashboardAreaSendTicket.classList.add('d-none')
    dashboardAreaHasTicketSection.classList.add('d-none')


    fetch(`http://avatoop.com/marina_kish/api/tickets/index?user_id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data.tickets) && data.tickets.length > 0) {
            pTagLoading.parentElement.classList.add("mt-0");
            pTagLoading.classList.add('d-none')
            dashboardAreaHasTicketSection.classList.remove('d-none')
            let counter = 1
            data.tickets.forEach(user => {
                let priority = user.priority;

                let priorityText = "";

                switch (priority) {
                    case "low":
                        priorityText = "کم";
                        break;
                    case "medium":
                        priorityText = "متوسط";
                        break;
                    case "Important":
                        priorityText = "زیاد";
                        break;
                    default:
                        priorityText = "نامشخص";
                        break;
                }

                let status = user.status;

                let statusText = "";

                switch (status) {
                    case "wating":
                        statusText = "پاسخ داده نشده";
                        break;
                    case "answered":
                        statusText = "پاسخ داده شده";
                        break;
                    default:
                        statusText = "نامشخص";
                        break;
                }

                let dateString = user.created_at;
                let date = new Date(dateString);
                let day = String(date.getDate()).padStart(2, '0');
                let month = String(date.getMonth() + 1).padStart(2, '0');
                let year = date.getFullYear();

                dashboardAreaHasTicket.insertAdjacentHTML('beforeend', `
                    <tr>
                        <th scope="row"><i class="mr-1 font-size-18"></i>${counter}</th>
                        <td>
                            <div class="table-content">
                                <h3 class="title">${user.title}</h3>
                            </div>
                        </td>
                        <td>${priorityText}</td>
                        <td>${year}-${month}-${day}</td>
                        <td>${statusText}</td>
                        <td>
                            <div class="table-content">
                               <button class="theme-btn theme-btn-small"  type="button" data-toggle="modal" data-target="#detailTicketModal" id="detailTicketBtn" ticket_id="${user.id}">جزئیات</button>
                            </div>
                        </td>
                    </tr>
                    `)
                    counter++
                })
                
        } else {
            dashboardAreaNoTicket.classList.remove('d-none')
            pTagLoading.parentElement.classList.add("mt-0");
            pTagLoading.classList.add("d-none")
        }
    })
    .catch(error => {
        console.error('خطا در دریافت اطلاعات کاربر:', error);
    });
})


sendNewTicket.addEventListener('click', () => {
    dashboardAreaHasTicketSection.classList.add('d-none')
    dashboardAreaSendTicket.classList.remove('d-none')
})


document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'detailTicketBtn') {

        let titleTicketDetail = $.getElementById("titleTicketDetail");
        let priorityTicketDetail = $.getElementById("priorityTicketDetail");
        let bodyTicketDetail = $.getElementById("bodyTicketDetail");
        let answerTicketDetail = $.getElementById("answerTicketDetail");
    
        let ticket_id = event.target.getAttribute('ticket_id');
    
        titleTicketDetail.value = "در حال بارگذاری..."
        priorityTicketDetail.textContent = "در حال بارگذاری..."
        bodyTicketDetail.value = "در حال بارگذاری..."
        answerTicketDetail.value = "در حال بارگذاری..."


        fetch(`http://avatoop.com/marina_kish/api/tickets/index?id=${ticket_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.tickets && data.tickets.length > 0) {
                console.log(data.tickets)
                let user = data.tickets.find(u => u.id == ticket_id);
                
                let priority = user.priority;

                switch (priority) {
                    case "low":
                        priority = "کم";
                        break;
                    case "medium":
                        priority = "متوسط";
                        break;
                    case "Important":
                        priority = "زیاد";
                        break;
                    default:
                        priority = "نامشخص";
                        break;
                }

                let answer = user.answer;
                switch (answer) {
                    case null:
                        answer = "پاسخ داده نشده";
                        break
                }

                if (user) {
                    titleTicketDetail.value = user.title
                    priorityTicketDetail.textContent = priority
                    bodyTicketDetail.value = user.body
                    answerTicketDetail.value = answer

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

var $ = document;
let dashboardAreaNoComment = $.getElementById("dashboardAreaNoComment");
let dashboardAreaHasCommentSection = $.getElementById("dashboardAreaHasCommentSection");
let dashboardAreaHasComment = $.getElementById("dashboardAreaHasComment");
let pTagLoading = $.getElementById("pTagLoading");
let detailCommentBtn = $.getElementById("detailCommentBtn");


window.addEventListener('DOMContentLoaded', () => {
console.log(localStorage)
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

    dashboardAreaHasCommentSection.classList.add('d-none')
    dashboardAreaNoComment.classList.add('d-none')


    fetch(`http://avatoop.com/marina_kish/api/main_comment`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
            pTagLoading.parentElement.classList.add("mt-0");
            pTagLoading.classList.add('d-none')
            dashboardAreaNoComment.classList.remove('d-none')
            let counter = 1
            data.data.forEach(Comment => {
                if(Comment.user_id === +(id)){
                    console.log(Comment)
                    let product_id = Comment.product_id

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
                    })
                    let productName = localStorage.getItem("productName")
                    let dateString = Comment.created_at;
                    let date = new Date(dateString);
                    let day = String(date.getDate()).padStart(2, '0');
                    let month = String(date.getMonth() + 1).padStart(2, '0');
                    let year = date.getFullYear();
    
                    let rating = ''
    
                    switch(Number(Comment.star)){
                        case 1:
                            rating = 
                            `   <i class="la la-star"></i>
                                <i class="lar la-star"></i>
                                <i class="lar la-star"></i>
                                <i class="lar la-star"></i>
                                <i class="lar la-star"></i>
                            `
                            break;
                        case 2:
                            rating =
                            `   <i class="la la-star"></i>
                                <i class="la la-star"></i>
                                <i class="lar la-star"></i>
                                <i class="lar la-star"></i>
                                <i class="lar la-star"></i>
                            `
                            break;
                        case 3:
                            rating =
                            `   <i class="la la-star"></i>
                                <i class="la la-star"></i>
                                <i class="la la-star"></i>
                                <i class="lar la-star"></i>
                                <i class="lar la-star"></i>
                            `
                            break;
                        case 4:
                            rating =
                            `   <i class="la la-star"></i>
                                <i class="la la-star"></i>
                                <i class="la la-star"></i>
                                <i class="la la-star"></i>
                                <i class="lar la-star"></i>
                            `
                            break;
                        case 5:
                            rating =
                            `   <i class="la la-star"></i>
                                <i class="la la-star"></i>
                                <i class="la la-star"></i>
                                <i class="la la-star"></i>
                                <i class="la la-star"></i>
                            `
                            break;
                    }
                    
                    let statusText = ''
                    switch(Comment.status){
                        case "pending":
                            statusText = "در انتظار تایید"
                            break;
                        case "approved":
                            statusText = "تایید شده"
                            break;
                        case "rejected":
                            statusText = "رد شده"
                            break;
                    }
                    dashboardAreaHasComment.insertAdjacentHTML('beforeend', `
                        <tr>
                            <th scope="row"><i class="mr-1 font-size-18"></i>${counter}</th>
                            <td>
                                <div class="table-content">
                                    <h3 class="title">${productName}${Comment.id}</h3>
                                </div>
                            </td>
                            <td>
                                <span class="ratings d-flex align-items-center mr-1">
                                    <span class="m-0 mr-2 font-size-16 font-weight-medium">${Comment.star}</span>
                                    ${rating}
                                </span>
                            </td>
                            <td>${year}-${month}-${day}</td>
                            <td>${statusText}</td>
                            <td>
                                <div class="table-content">
                                   <button class="theme-btn theme-btn-small"  type="button" data-toggle="modal" data-target="#detailCommentModal" id="detailCommentBtn" comment_id="${Comment.id}">جزئیات</button>
                                </div>
                            </td>
                        </tr>
                        `)
                        counter++
                }

            })
                dashboardAreaNoComment.classList.add('d-none')
                dashboardAreaHasCommentSection.classList.remove('d-none')
        } else {
            dashboardAreaHasCommentSection.classList.remove('d-none')
            pTagLoading.parentElement.classList.add("mt-0");
            pTagLoading.classList.add("d-none")
        }
    })
    .catch(error => {
        console.error('خطا در دریافت اطلاعات کاربر:', error);
    });
})

document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'detailCommentBtn') {

        let bodyCommentDetail = $.getElementById("bodyCommentDetail");
        let answerCommentDetail = $.getElementById("answerCommentDetail");
    
        const token = localStorage.getItem('Token');

        let comment_id = event.target.getAttribute('comment_id');

        bodyCommentDetail.value = "در حال بارگذاری..."
        answerCommentDetail.textContent = "در حال بارگذاری..."


        fetch(`http://avatoop.com/marina_kish/api/main_comment`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                let user = data.data.find(u => u.id == comment_id);

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
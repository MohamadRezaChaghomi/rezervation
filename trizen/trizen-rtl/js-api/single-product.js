let nameOfUserHeader = $.getElementById('nameOfUserHeader');
let loginAndSignUpDiv = $.getElementById('loginAndSignUpDiv');
let qtyInput = $.getElementById('qtyInput');
let qtyMines = $.getElementById('qtyMines');
let qtyPlus = $.getElementById('qtyPlus');
let sansContainer = $.getElementById('sans')
let pTagLoadingDetail = $.getElementById("pTagLoadingDetail");
let pTagLoadingImg = $.getElementById("pTagLoadingImg");
let pTagLoadingDescription = $.getElementById("pTagLoadingDescription");
let pTagLoadingTip = $.getElementById("pTagLoadingTip");
let pTagLoadingImgNotFound = $.getElementById("pTagLoadingImgNotFound");
let productImg = $.getElementById('productImg');
let productName = $.getElementById('productName');
let productDetail = $.getElementById('productDetail');
let productDescription = $.getElementById('productDescription');
let productTip = $.getElementById('productTip');
let productComments = $.getElementById('productComments');
let sendComment = $.getElementById('sendComment');
let lst1 = $.getElementById('lst1');
let lst2 = $.getElementById('lst2');
let lst3 = $.getElementById('lst3');
let lst4 = $.getElementById('lst4');
let lst5 = $.getElementById('lst5');
let starInput = $.getElementById('starInput');
let bodyInput = $.getElementById('bodyInput');
let ratingStar = ''


window.addEventListener('DOMContentLoaded', () => {

    const checkboxes = document.querySelectorAll('#starInput input[type="checkbox"]');
                            
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function(event) {
            const selectedValue = parseInt(event.target.value);
            checkboxes.forEach(cb => {
                const cbValue = parseInt(cb.value);
                if (cbValue <= selectedValue) {
                    cb.checked = true;
                } else {
                    cb.checked = false;
                }
            });
        });
    });

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
        nameOfUserHeader.parentNode.classList.add('d-none');
    }

    let product_id = localStorage.getItem('product_id');
    let id = localStorage.getItem("id")
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
        console.log(token)

        if (data && typeof data === "object" && data.id && Array.isArray(data.sans)) {
            fetch(`http://avatoop.com/marina_kish/api/media/get_image/product/${product_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (!data || !data.data || data.data.length === 0) {
                    pTagLoadingImgNotFound.parentElement.classList.add("mt-0");
                    pTagLoadingImgNotFound.classList.remove("d-none")
                    return;
                }
            
                const imageUrl = data.data[0];
                productImg.insertAdjacentHTML('beforeend', 
                    `<img src="${imageUrl}" alt="productImage">`
                );
            })
            .catch(error => console.error("Error fetching images:", error));

            pTagLoadingImg.parentElement.classList.add("mt-0");
            pTagLoadingImg.classList.add("d-none")
            
            productName.insertAdjacentHTML('beforeend', 
                `<h3 class="card-title pb-4 pt-4 font-size-24 font-weight-bold">${data.name}</h3>`
            );

            productDetail.insertAdjacentHTML('beforeend', 
                `<ul class="list-items list-items-2 list--items-2 py-2">
                    <li class="font-size-18 d-flex align-items-center justify-content-between mt-4">
                        <span class="w-auto d-block d-flex align-items-center">
                            <i class="la la-clock-o text-black font-size-24"></i>مدت زمان: 
                        </span>${data.time} دقیقه
                    </li>
                    <li class="font-size-18 d-flex align-items-center justify-content-between mt-4">
                        <span class="w-auto d-block d-flex align-items-center">
                            <i class="la la-user font-size-24"></i>محدودیت سنی: 
                        </span>${data.age_limited}+
                    </li>
                    <li class="font-size-18 d-flex align-items-center justify-content-between mt-4">
                        <span class="w-auto d-block d-flex align-items-center">
                            <i class="la la-comment font-size-24"></i>دیدگاه:
                        </span>${data.comments.length}
                    </li>
                    <li class="font-size-18 d-flex align-items-center justify-content-between mt-4 mb-4">
                        <span class="w-auto d-block d-flex align-items-center">
                            <i class="la la-ticket font-size-24"></i>قیمت بلیت: 
                        </span>${data.price.toLocaleString()} تومان
                    </li>
                </ul>`
            );

            pTagLoadingDetail.parentElement.classList.add("mt-0");
            pTagLoadingDetail.classList.add("d-none")

            productDescription.insertAdjacentHTML('beforeend', 
                `<p class="pb-3">${data.description}</p>`
            );
    
            productTip.insertAdjacentHTML('beforeend', 
                `<p>${data.tip}</p>`
            );

            pTagLoadingDescription.parentElement.classList.add("mt-0");
            pTagLoadingDescription.classList.add("d-none")
            pTagLoadingTip.parentElement.classList.add("mt-0");
            pTagLoadingTip.classList.add("d-none")
            console.log(product_id)
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
                let fullName;

                if (data.sans && data.sans.length > 0) {
                    let selectedSansId = ''
                    let orderData = {}
                    let dayReserved = ''
                    data.sans.forEach(sansItem => {
                        const timeWithoutSeconds = sansItem.start_time.slice(0, -3);
                
                        sansContainer.insertAdjacentHTML('beforeend',
                            `<div class="col-6 col-md-5 col-lg-4 mb-3">
                                <div class="card sans-card" sans_id=${sansItem.id}>
                                    <div class="card-body">
                                        <h5 class="card-title">${timeWithoutSeconds}</h5>
                                        <p class="card-text">سانس</p>
                                    </div>
                                </div>
                            </div>`
                        );
                        const lastCard = sansContainer.lastElementChild.querySelector('.sans-card');
                        lastCard.addEventListener('click', function () {
                            document.querySelectorAll('.sans-card').forEach(card => {
                                card.classList.remove('selected');
                            });
                            this.classList.add('selected');
                            selectedSansId = this.getAttribute('sans_id');
                        });
                    });
                
                    document.getElementById('sansAndDateBtn').addEventListener('click', function (event) {
                        
                        dayReserved = localStorage.getItem("dayReserved")

                        orderData = {
                            "user_id": id,
                            "product_id": product_id,
                            "number": qtyInput.value,
                            "day_reserved": dayReserved,
                            "sans_id": selectedSansId,
                            "off_code": "",
                            "price": data.price
                        };

                        function createErrorSpan(element, message) {
                            if (!element) return; 
                            let existingSpan = element.querySelector(".text-danger");
                            if (existingSpan) {
                                existingSpan.innerText = message;
                                return existingSpan;
                            }
                            
                            let span = document.createElement("span");
                            span.className = "font-size-14 text-danger d-none";
                            span.innerText = message;
                            element.appendChild(span);
                            return span;
                        }
                        
                        let calendarContainer = document.getElementById('calendarDiv');
                        let underReservedDay = createErrorSpan(calendarContainer, "لطفا ابتدا روز را انتخاب کنید");
                        let underSans = createErrorSpan(sansContainer, "لطفا ابتدا سانس را انتخاب کنید");
                        
                        if (!dayReserved) {
                            underReservedDay.classList.remove('d-none');
                            underReservedDay.classList.add('mt-3');

                            return; // توقف اجرای کد
                        } else {
                            underReservedDay.classList.add('d-none');
                        }
                        
                        if (!selectedSansId) {
                            underSans.classList.remove('d-none');
                            return; // توقف اجرای کد
                        } else {
                            underSans.classList.add('d-none'); // رفع مشکل باقی ماندن پیام خطا
                        }
                        
                        localStorage.removeItem("dayReserved"); 
                        
                    
                        console.log(orderData)
                        localStorage.setItem("orderData", JSON.stringify(orderData))
                        console.log(localStorage)
                    });
                } else {
                    sansContainer.insertAdjacentHTML('beforeend',
                        `<div class="col-lg-12 mb-3">
                            <span class="text-center">متاسفانه سانسی وجود ندارد</span>
                        </div>`
                    );
                }

                if (data.comments && Array.isArray(data.comments) && data.comments.length > 0) {
                    let averageStar = 0;
                    let starPercent = 0;
                    let ratingRanking = '';
                    data.comments.forEach(comment => {
                        averageStar = +(comment.star) + averageStar;
                    });
                    averageStar /= data.comments.length;
                    averageStar = parseFloat(averageStar.toFixed(1));
                    starPercent = averageStar * 100 / 5;
                
                    switch (true) {
                        case (averageStar >= 1 && averageStar < 2):
                            ratingRanking = 'ضعیف';
                            break;
                        case (averageStar >= 2 && averageStar < 3):
                            ratingRanking = 'متوسط';
                            break;
                        case (averageStar >= 3 && averageStar < 4):
                            ratingRanking = 'خوب';
                            break;
                        case (averageStar >= 4 && averageStar <= 5):
                            ratingRanking = 'عالی';
                            break;
                        default:
                            ratingRanking = 'نامشخص'; // در صورتی که مقدار غیرمنتظره‌ای باشد
                    }
                
                    productComments.insertAdjacentHTML('beforeend',
                        `<div id="reviews" class="page-scroll">
                            <div class="single-content-item padding-top-10px padding-bottom-40px">
                                <div class="review-container">
                                    <div class="row align-items-center justify-content-center">
                                        <div class="col-lg-4">
                                            <h3 class="title font-size-24 mb-2 text-center">نظرات</h3>
                                            <div class="review-summary p-4">
                                                <h2>${averageStar}<span>/5</span></h2>
                                                <p>${ratingRanking}</p>
                                                <span>بر اساس ${data.comments.length}نظر</span>
                                                <div class="review-bars mt-2">
                                                    <div class="row">
                                                        <div class="col-lg-12">
                                                            <div class="progress-item">
                                                                <div class="progressbar-content line-height-20 d-flex align-items-center justify-content-center">
                                                                    <div class="progressbar-box flex-shrink-0">
                                                                        <div class="progressbar-line" data-percent="${starPercent}%">
                                                                            <div class="progressbar-line-item bar-bg-1"></div>
                                                                        </div> <!-- End Skill Bar -->
                                                                    </div>
                                                                </div>
                                                            </div><!-- end progress-item -->
                                                        </div><!-- end col-lg-6 -->
                                                    </div><!-- end row -->
                                                </div>
                                            </div>
                                        </div><!-- end col-lg-4 -->
                                    </div>
                                </div>
                            </div><!-- end single-content-item -->
                        </div><!-- end reviews -->`
                    );
                
                    setTimeout(() => {
                        document.querySelectorAll('.progressbar-line').forEach(progress => {
                            let percent = progress.getAttribute('data-percent');
                            progress.querySelector('.progressbar-line-item').style.width = percent;
                        });
                    }, 100);
                
                    // نمایش کامنت‌ها
                    const showComments = (startIndex, endIndex) => {
                        fetch(`http://avatoop.com/marina_kish/api/main_comment`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            const comments = data.data; // استفاده از داده‌های دریافتی از سرور
                
                            comments.slice(startIndex, endIndex).forEach(mainComment => {
                                let fullName = "کاربر";
                                if (mainComment.user && mainComment.user.first_name && mainComment.user.last_name) {
                                    fullName = mainComment.user.first_name + " " + mainComment.user.last_name;
                                }
                
                                let starCount = parseInt(mainComment.star) || 0;
                                let starRating = "";
                
                                switch (starCount) {
                                    case 5:
                                        starRating = `<i class="la la-star"></i>`.repeat(5);
                                        break;
                                    case 4:
                                        starRating = `<i class="la la-star"></i>`.repeat(4) + `<i class="la la-star-o"></i>`;
                                        break;
                                    case 3:
                                        starRating = `<i class="la la-star"></i>`.repeat(3) + `<i class="la la-star-o"></i>`.repeat(2);
                                        break;
                                    case 2:
                                        starRating = `<i class="la la-star"></i>`.repeat(2) + `<i class="la la-star-o"></i>`.repeat(3);
                                        break;
                                    case 1:
                                        starRating = `<i class="la la-star"></i>` + `<i class="la la-star-o"></i>`.repeat(4);
                                        break;
                                    default:
                                        starRating = `<i class="la la-star-o"></i>`.repeat(5);
                                        break;
                                }
                
                                let dateString = mainComment.created_at;
                                let date = new Date(dateString);
                                let day = String(date.getDate()).padStart(2, '0');
                                let month = String(date.getMonth() + 1).padStart(2, '0');
                                let year = date.getFullYear();
                
                                productComments.insertAdjacentHTML('beforeend',
                                    `<div class="comment pb-0 pb-3"style="
                                    border-bottom: 0;
                                    margin-bottom: 20px; 
                                    padding: 30px;
                                    box-shadow: 0 0 15px 0px #e1e1e1a1;
                                    border-radius: 10px;">
                                        <div class="comment-body">
                                            <div class="meta-data">
                                                <h3 class="comment__author">${fullName}</h3>
                                                <div class="meta-data-inner d-flex">
                                                    <span class="ratings d-flex align-items-center mr-1">
                                                    ${starRating}
                                                    </span>
                                                    <p class="comment__date">${year}/${month}/${day}</p>
                                                </div>
                                            </div>
                                            <p class="comment-content">${mainComment.body}</p>
                                        </div>
                                    </div>`
                                );
                
                                if (mainComment.answer) {
                                    let dateString = mainComment.updated_at;
                                    let date = new Date(dateString);
                                    let day = String(date.getDate()).padStart(2, '0');
                                    let month = String(date.getMonth() + 1).padStart(2, '0');
                                    let year = date.getFullYear();
                
                                    productComments.insertAdjacentHTML('beforeend',
                                        `<div class="comment pb-0 pb-3" style="margin-right: 50px; border-bottom: 0; margin-bottom: 20px;">
                                            <div class="comment-body">
                                                <div class="meta-data">
                                                    <h3 class="comment__author"> پاسخ ادمین به <span class="font-size-12">(${fullName})</span></h3>
                                                    <div class="meta-data-inner d-flex">
                                                        <p class="comment__date">${year}/${month}/${day}</p>
                                                    </div>
                                                </div>
                                                <p class="comment-content">
                                                    ${mainComment.answer}
                                                </p>
                                            </div>
                                        </div><!-- end comments -->`
                                    );
                                }
                            });
                
                            // اگر تعداد کامنت‌ها بیشتر از ۳ باشد و هنوز کامنت‌های بیشتری برای نمایش وجود داشته باشد
                            if (comments.length > 3 && endIndex < comments.length) {
                                const loadMoreButton = document.createElement('button');
                                loadMoreButton.textContent = 'نمایش بیشتر';
                                
                                // اضافه کردن آیکون لودینگ
                                const loadingIcon = document.createElement('i');
                                loadingIcon.classList.add('la', 'la-sync', 'ml-2'); // ml-2 برای فاصله بین متن و آیکون
                                loadMoreButton.appendChild(loadingIcon);
                                
                                // اضافه کردن کلاس‌ها و استایل‌ها
                                loadMoreButton.classList.add('btn', 'btn-primary', 'mt-3', 'mb-3');
                                loadMoreButton.style.marginLeft = 'auto';
                                loadMoreButton.style.marginRight = 'auto';
                                loadMoreButton.style.display = 'block';
                                
                                // اضافه کردن دکمه به المنت والد
                                productComments.appendChild(loadMoreButton);
                
                                loadMoreButton.addEventListener('click', () => {
                                    // نمایش تمام کامنت‌ها
                                    showComments(endIndex, comments.length);
                                    // مخفی کردن دکمه
                                    loadMoreButton.style.display = 'none';
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching comments:', error);
                        });
                    };
                
                    // نمایش ۳ کامنت اول
                    showComments(0, 3);
                } else {
                    productComments.insertAdjacentHTML('beforeend', `<p class="d-flex justify-content-center font-size-22 font-weight-medium mt-5 mb-5">هنوز نظری ثبت نشده است.</p>`);
                }            });
    
        } else {
            console.error("داده‌های دریافتی نامعتبر هستند");
            $.getElementById('comment-forum').classList.add('d-none') 
            $.getElementById('detailAndSansBtnSection').classList.add('d-none')
            $.getElementById('descriptionAndTipSection').classList.add('d-none')
            $.getElementById('newsSection').classList.add('d-none')
            pTagLoadingDescription.textContent = ''
            pTagLoadingDetail.textContent = ''
            pTagLoadingImg.textContent = ''
            pTagLoadingTip.textContent = ''
            $.getElementById('errorMessage').classList.remove('d-none')
        }
    })
    .catch(error => console.error("خطا در دریافت اطلاعات:", error));   

})


document.querySelectorAll('.rate-stars-option input[type="checkbox"]').forEach(star => {
    star.addEventListener('click', function () {
        ratingStar = parseInt(this.value) || null;
    });
});


sendComment.addEventListener('click', () => {
    function createErrorSpan(element, message) {
        let existingSpan = element.parentNode.querySelector(".text-danger");
        if (existingSpan) {
            existingSpan.innerText = message;
            return existingSpan;
        }

        let span = document.createElement("span");
        span.className = "font-size-12 text-danger d-none";
        span.innerText = message;
        element.parentNode.appendChild(span);
        return span;
    }

    let userToken = localStorage.getItem('Token');
    let product_id = localStorage.getItem('product_id');
    const id = localStorage.getItem('id');

    let underRatingStarError = createErrorSpan(starInput, "لطفا امتیاز را وارد کنید");
    let underBodyInputError = createErrorSpan(bodyInput, "متن دیدگاه نمی تواند خالی باشد");

    let isValid = true;

    if (ratingStar === "") {
        underRatingStarError.classList.remove('d-none');
        underRatingStarError.classList.add('mr-3');
        isValid = false;

    } else {
        underRatingStarError.classList.add('d-none');
    }

    if (bodyInput.value.trim() === "") {
        underBodyInputError.classList.remove('d-none');
        isValid = false;
    } else {
        underBodyInputError.classList.add('d-none');
    }

    if (!isValid) return;

    let commentData = {
        "user_id": id,
        "product_id": product_id,
        "body": bodyInput.value,
        "answer": '',
        "star": ratingStar
    };
    
    if (!userToken) {
        let modalElement = document.getElementById('alertComment');
        let modal = new bootstrap.Modal(modalElement);
    
        document.getElementById("responseCommentModalBody").innerText = "برای ارسال کامنت ابتدا باید وارد حساب کاربری خود شوید.";
        modal.show();
    
        modalElement.querySelector(".btn.btn-secondary").addEventListener("click", function () {
            modal.hide()
        });
    
        modalElement.addEventListener("click", function (event) {
            if (event.target === modalElement) {
                modal.hide()
            }
        });
    
        return; // توقف اجرای کد بعدی
    }
    
    
    fetch('http://avatoop.com/marina_kish/api/comments/store', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify(commentData)
    })
    .then(response => {
        if (!response.ok) {
            // اگر پاسخ سرور موفقیت‌آمیز نبود، خطا پرتاب شود
            throw new Error('خطا در ارسال کامنت');
        }
        return response.json();
    })
    .then(data => {
        console.log(commentData);
        let modalElement = document.getElementById('alertComment');
        let modal = new bootstrap.Modal(modalElement);
    
        if (data.message === 'نظر با موفقیت ایجاد شد') {
            document.getElementById("pTagLoadingComment").classList.add('d-none');
            document.getElementById("responseCommentModalBody").innerText = "کامنت شما با موفقیت ارسال شد و پس از تایید ادمین قابل مشاهده خواهد بود برای ادامه کلیک کنید";
            document.getElementById("responseCommentModalBody").classList.add("text-success");
            bodyInput.value = ''
            ratingStar = ''
            starInput.innerHTML = `
                <input type="checkbox" id="lst1" value="5">
                <label for="lst1"></label>
                <input type="checkbox" id="lst2" value="4">
                <label for="lst2"></label>
                <input type="checkbox" id="lst3" value="3">
                <label for="lst3"></label>
                <input type="checkbox" id="lst4" value="2">
                <label for="lst4"></label>
                <input type="checkbox" id="lst5" value="1">
                <label for="lst5"></label>
            `;
    
            modal.show();
    
            modalElement.querySelector(".btn.btn-secondary").addEventListener("click", function () {
                modal.hide()
            });
    
            modalElement.addEventListener("click", function (event) {
                if (event.target === modalElement) {
                    modal.hide()
                }
            });
    
        } else {
            // اگر پیام سرور موفقیت‌آمیز نبود
            document.getElementById("responseCommentModalBody").innerText = "ارسال کامنت ناموفق بود";
            document.getElementById("responseCommentModalBody").classList.add("text-danger");
    
            modal.show();
    
            // کلیک روی دکمه "بستن"
            modalElement.querySelector(".btn.btn-secondary").addEventListener("click", function () {
                modal.hide()
            });
    
            // کلیک روی پس‌زمینه مدال
            modalElement.addEventListener("click", function (event) {
                if (event.target === modalElement) {
                    modal.hide()
                }
            });
        }
    })
    .catch(error => {
        console.error("خطا در ارسال کامنت:", error);
    
        // نمایش پیام خطا به کاربر
        let modalElement = document.getElementById('alertComment'); // اطمینان حاصل کنید که این مدال در HTML وجود دارد
        let modal = new bootstrap.Modal(modalElement);
    
        document.getElementById("responseCommentModalBody").innerText = "خطا در ارسال کامنت. لطفاً دوباره تلاش کنید.";
        document.getElementById("responseCommentModalBody").classList.add("text-danger");
    
        modal.show();
    
        // کلیک روی دکمه "بستن"
        modalElement.querySelector(".btn.btn-secondary").addEventListener("click", function () {
            modal.hide()
        });
    
        // کلیک روی پس‌زمینه مدال
        modalElement.addEventListener("click", function (event) {
            if (event.target === modalElement) {
                modal.hide()
            }
        });
    });
});


qtyMines.addEventListener('click', () => {
    if(qtyInput.value > 0){
        qtyInput.value--
    }
})
qtyPlus.addEventListener('click', () => {
    qtyInput.value++
})


document.getElementById('sansBtn').addEventListener('click', function () {
    let userToken = localStorage.getItem("Token")
    if(qtyInput.value === "0"){
        let modalElement = document.getElementById('numberOfTicket');
        let modal = new bootstrap.Modal(modalElement);

        modal.show();

        modalElement.querySelector(".btn.btn-secondary").addEventListener("click", function () {
            modal.hide(); // فقط مدال بسته شود
        });

        modalElement.addEventListener("click", function (event) {
            if (event.target === modalElement) {
                modal.hide(); // فقط مدال بسته شود
            }
        });
    }else{
        if (!userToken) {
            let modalElement = document.getElementById('alertLoginSelectSans');
            let modal = new bootstrap.Modal(modalElement);
    
            modal.show();
    
            modalElement.querySelector(".btn.btn-secondary").addEventListener("click", function () {
                modal.hide(); // فقط مدال بسته شود
            });
    
            modalElement.addEventListener("click", function (event) {
                if (event.target === modalElement) {
                    modal.hide(); // فقط مدال بسته شود
                }
            });
        } else {
            let modalElement = document.getElementById('datePickerModal');
            let modal = new bootstrap.Modal(modalElement);

            modal.show();
    
            modalElement.querySelector(".close").addEventListener("click", function () {
                modal.hide(); // فقط مدال بسته شود
            });
    
            modalElement.addEventListener("click", function (event) {
                if (event.target === modalElement) {
                    modal.hide(); // فقط مدال بسته شود
                }
            });
        }
    }
});

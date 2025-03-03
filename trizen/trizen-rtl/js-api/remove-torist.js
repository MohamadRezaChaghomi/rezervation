let removeTouristBtn = document.getElementById('removeTouristBtn');


document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'removeTouristBtn') {

        let userId = event.target.getAttribute('tourist-userid');

        const token = localStorage.getItem('Token');
    
        if (!token) {
            console.error("توکن یافت نشد، لطفاً وارد شوید.");
            return;
        }
        
        fetch(`http://avatoop.com/marina_kish/api/passengers/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "گردشگر با موفقیت حذف شد"){
                getAllTourist()
            }
        })
        .catch(error => {
            console.error("خطا در خروج از حساب:", error);
        });
    }
})

function getAllTourist(){

    dashboardAreaHasTouristSection.classList.add('d-none')
    dashboardAreaNoTouristSection.classList.add('d-none')

<<<<<<< HEAD
=======

>>>>>>> 0e212a1d3f23be4a15b559431705a304661e8455
    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
        return;
    }

    pTagAboutTourist.textContent = "در حال بارگذاری..."

    fetch(`http://avatoop.com/marina_kish/api/passengers/index?user_id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && Array.isArray(data.data) && data.data.length > 0) {
<<<<<<< HEAD

=======
>>>>>>> 0e212a1d3f23be4a15b559431705a304661e8455
            pTagLoading.classList.add('d-none')
            dashboardAreaHasTouristSection.classList.add('d-block')

            let counter = 1
            dashboardAreaHasTourist.innerHTML = ''
<<<<<<< HEAD
            data.data.forEach(user => {

=======

            data.data.forEach(user => {
>>>>>>> 0e212a1d3f23be4a15b559431705a304661e8455

                let gender = "";

                switch (user.gender) {
                    case "mail":
                        gender = "مرد";
                        break;
                    case "female":
                        gender = "زن";
                        break;
                    default:
                        gender = "نامشخص";
                        break;
                }

                let dateString = user.birth_day;
                let date = new Date(dateString);
                let day = String(date.getDate()).padStart(2, '0');
                let month = String(date.getMonth() + 1).padStart(2, '0');
                let year = date.getFullYear();

                dashboardAreaHasTourist.insertAdjacentHTML('beforeend', `
                    <tr>
                        <th scope="row"><i class="mr-1 font-size-18"></i>${counter}</th>
                        <td>
                            <div class="table-content">
                                <h3 class="title">${user.name}</h3>
                            </div>
                        </td>
                        <td>${user.national_code}</td>
                        <td>${user.phone}</td>
                        <td>${year}-${month}-${day}</td>
                        <td>${gender}</td>
                        <td>
                            <div class="table-content" style="width:35px">
                               <button class="theme-btn theme-btn-small" type="button" data-toggle="modal" data-target="#changeTouristModal" id="changeTouristBtn" tourist-userid="${user.id}">ویرایش</button>
                            </div>
                        </td>
                        <td>
                            <div class="table-content" style="width:35px">
                               <button class="theme-btn theme-btn-danger-rgb theme-btn-small" type="button" data-toggle="modal" data-target="#removeTouristModal" id="removeTouristBtn" tourist-userid="${user.id}">حذف</button>
                            </div>
                        </td>
                    </tr>
                    `)
                    counter++
                })
        } else {
<<<<<<< HEAD
            pTagLoading.parentElement.classList.add("mt-0");
            pTagLoading.classList.add('d-none')
            dashboardAreaHasTouristSection.classList.remove('d-block')
=======
            pTagLoading.classList.add('d-none')
            dashboardAreaHasTouristSection.classList.remove("d-block")
>>>>>>> 0e212a1d3f23be4a15b559431705a304661e8455
            dashboardAreaNoTouristSection.classList.add('d-block')
            pTagAboutTourist.textContent = "لیست گردشگران خالی است"

        }
    })
    .catch(error => {
        console.error('خطا در دریافت اطلاعات کاربر:', error);
    });
}



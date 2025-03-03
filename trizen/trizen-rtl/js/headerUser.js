let nameOfUserHeader = document.getElementById('nameOfUserHeader');
let loginAndSignUpDiv = document.getElementById('loginAndSignUpDiv');

window.addEventListener('DOMContentLoaded', () => {

    alertLogin.classList.add('d-none')
    let userToken = localStorage.getItem('Token');

    if(userToken){

        fetch('http://avatoop.com/marina_kish/api/users/ME', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken}`
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
    }
})

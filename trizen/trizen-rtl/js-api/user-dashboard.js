window.addEventListener('load', () => {
    const token = localStorage.getItem('Token')


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
        localStorage.setItem("id", data.id)
        localStorage.setItem("national_code", data.national_code)
        localStorage.setItem("phone", data.phone)
<<<<<<< HEAD
        if(data.first_name && data.last_name){
            localStorage.setItem("firstName_lastName", data.first_name + " " + data.last_name)
        }else{
            localStorage.setItem("firstName_lastName", 'کاربر')
        }
=======
        localStorage.setItem("firstName_lastName", data.first_name + " " + data.last_name)
>>>>>>> 0e212a1d3f23be4a15b559431705a304661e8455
    })
    
    .catch(error => {
        console.error('خطا در دریافت اطلاعات کاربر:', error);
    });
<<<<<<< HEAD
});
=======
});
>>>>>>> 0e212a1d3f23be4a15b559431705a304661e8455

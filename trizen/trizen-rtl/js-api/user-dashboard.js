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
        localStorage.setItem("firstName_lastName", data.first_name + " " + data.last_name)
    })
    
    .catch(error => {
        console.error('خطا در دریافت اطلاعات کاربر:', error);
    });
});

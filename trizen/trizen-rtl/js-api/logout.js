let logout = document.getElementById('logout');

logout.addEventListener('click', (event) => {
    event.preventDefault()

    const token = localStorage.getItem('Token');

    fetch('http://avatoop.com/marina_kish/api/users/logout', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        console.log("پاسخ از سرور:", response);
        localStorage.clear();
        console.log(localStorage);
        window.location.href = "index.html";  // حالا کاربر را به صفحه اصلی منتقل کن
    })
    .catch(error => {
        console.error("خطا در خروج از حساب:", error);
    });
});

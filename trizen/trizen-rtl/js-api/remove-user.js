let removeUserBtn = document.getElementById('removeUserBtn');

removeUserBtn.addEventListener('click', () => {
    const token = localStorage.getItem('Token');

    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        return;
    }

    fetch('http://avatoop.com/marina_kish/api/users/delete', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
            localStorage.clear();
            window.location.href = "index.html";
    })
    .catch(error => {
        console.error("خطا در خروج از حساب:", error);
    });
});

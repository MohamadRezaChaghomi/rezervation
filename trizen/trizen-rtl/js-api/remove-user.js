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
<<<<<<< HEAD
        if(data.message === "کاربر با موفقیت حذف شد."){
            localStorage.clear();
            jQuery('#removeUser').modal('hide');  // مخفی کردن مدال تغییر رمز
            jQuery('#successRemoveUser').modal('show');  // نمایش مدال موفقیت
            jQuery('#successRemoveUser').on('hidden.bs.modal', function () {
            window.location.href = "index.html";
            })
        }
=======
            localStorage.clear();
            window.location.href = "index.html";
>>>>>>> 0e212a1d3f23be4a15b559431705a304661e8455
    })
    .catch(error => {
        console.error("خطا در خروج از حساب:", error);
    });
});

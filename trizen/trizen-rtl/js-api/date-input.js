document.querySelectorAll('#updateBirthDate, #updateBirthDateChange').forEach(input => {
    input.addEventListener('input', function (event) {
        let value = event.target.value.replace(/\D/g, ''); // حذف حروف و نگه داشتن اعداد
        let formattedDate = '';
        
        // جدا کردن سال، ماه و روز
        let year = value.substring(0, 4);
        let month = value.substring(4, 6);
        let day = value.substring(6, 8);

        if (year.length === 4) {
            formattedDate = year;
            if (month.length > 0) {
                formattedDate += '/' + month;
            }
            if (day.length > 0) {
                formattedDate += '/' + day;
            }
        } else {
            formattedDate = value;
        }

        event.target.value = formattedDate;

        // یافتن پیام خطای مربوط به همان input
        let dateError = event.target.closest('.form-group').querySelector('.dateError');
        let dateRegex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/;
        let match = formattedDate.match(dateRegex);

        if (!match) {
            dateError.style.display = 'block';
            return;
        }

        let yearValue = parseInt(match[1]);
        let monthValue = parseInt(match[2]);
        let dayValue = parseInt(match[3]);

        // بررسی اعتبار ماه و روز
        if (monthValue < 1 || monthValue > 12 || dayValue < 1 || dayValue > 31) {
            dateError.style.display = 'block';
        } else {
            dateError.style.display = 'none';
        }
    });
});

const calendarDaysElement = document.getElementById('calendar-days');
const monthYearElement = document.getElementById('month-year');
const nextMonthButton = document.getElementById('next-month');
const prevMonthButton = document.getElementById('prev-month');

let currentJalaaliDate = jalaali.toJalaali(new Date()); // تاریخ شمسی جاری
let selectedYear = currentJalaaliDate.jy;
let selectedMonth = currentJalaaliDate.jm;
let selectedDay = null; // روز انتخاب‌شده

function renderCalendar(year, month) {
    calendarDaysElement.innerHTML = ""; // پاک کردن محتوای قبلی تقویم
    const today = jalaali.toJalaali(new Date()); // تاریخ امروز
    const daysInMonth = jalaali.jalaaliMonthLength(year, month); // تعداد روزهای ماه

    // پیدا کردن اولین روز ماه شمسی
    const firstDayOfMonthGregorian = jalaali.toGregorian(year, month, 1);
    let firstDayOfMonthWeekday = new Date(
        firstDayOfMonthGregorian.gy,
        firstDayOfMonthGregorian.gm - 1,
        firstDayOfMonthGregorian.gd
    ).getDay();

    // تنظیم دقیق برای شروع هفته شمسی
    firstDayOfMonthWeekday = (firstDayOfMonthWeekday + 1) % 7;

    // تنظیم ماه و سال در هدر
    const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    monthYearElement.textContent = `${months[month - 1]} ${year}`;

    // اضافه کردن روزهای هفته
    const weekdays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
    weekdays.forEach(day => {
        const weekdayElement = document.createElement('div');
        weekdayElement.textContent = day;
        weekdayElement.style.fontWeight = 'bold';
        calendarDaysElement.appendChild(weekdayElement);
    });

    // اضافه کردن فضاهای خالی برای روزهای قبل از شروع ماه
    for (let i = 0; i < firstDayOfMonthWeekday; i++) {
        const emptyElement = document.createElement('div');
        calendarDaysElement.appendChild(emptyElement);
    }

    // اضافه کردن روزهای ماه
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.classList.add('day');

        let isDisabled = false; // متغیر برای بررسی اینکه روز غیرفعال است یا نه

        // اگر روز قبل از امروز باشد، غیرفعال شود
        if (
            year < today.jy ||
            (year === today.jy && month < today.jm) ||
            (year === today.jy && month === today.jm && day < today.jd)
        ) {
            dayElement.classList.add('disabled');
            isDisabled = true;
        }

        // اگر روز امروز باشد
        if (year === today.jy && month === today.jm && day === today.jd) {
            dayElement.classList.add('today');
        }

        // اگر روز انتخاب‌شده باشد
        if (selectedDay && year === selectedYear && month === selectedMonth && day === selectedDay) {
            dayElement.classList.add('active');
        }

        // رویداد کلیک برای انتخاب روز
// رویداد کلیک برای انتخاب روز
dayElement.addEventListener('click', () => {
  if (!isDisabled) {
      // حذف کلاس active از روز قبلی
      const prevSelectedDay = document.querySelector('.day.active');
      if (prevSelectedDay) {
          prevSelectedDay.classList.remove('active');
      }

      // اضافه کردن کلاس active به روز انتخاب‌شده
      dayElement.classList.add('active');
      selectedDay = day;

      // فرمت‌دهی تاریخ و ذخیره در localStorage
      if (selectedDay) {
          const formattedDate = formatDate(year, month, day);
          console.log(formattedDate);
          localStorage.setItem("dayReserved", formattedDate);
      }
  }
});


        calendarDaysElement.appendChild(dayElement);
    }
}

// تابع کمکی برای فرمت‌دهی تاریخ
function formatDate(year, month, day) {
    const paddedMonth = String(month).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
}

// افزودن رویداد به دکمه ماه بعدی
nextMonthButton.addEventListener('click', () => {
    if (selectedMonth === 12) {
        selectedMonth = 1;
        selectedYear++;
    } else {
        selectedMonth++;
    }
    selectedDay = null; // ریست کردن روز انتخاب‌شده
    localStorage.removeItem("dayReserved"); // پاک کردن تاریخ انتخاب‌شده از localStorage
    renderCalendar(selectedYear, selectedMonth);
});

// افزودن رویداد به دکمه ماه قبلی
prevMonthButton.addEventListener('click', () => {
    if (selectedMonth === 1) {
        selectedMonth = 12;
        selectedYear--;
    } else {
        selectedMonth--;
    }
    selectedDay = null; // ریست کردن روز انتخاب‌شده
    localStorage.removeItem("dayReserved"); // پاک کردن تاریخ انتخاب‌شده از localStorage
    renderCalendar(selectedYear, selectedMonth);
});

// رندر تقویم در ابتدا
renderCalendar(selectedYear, selectedMonth);
let ulFAQ = document.getElementById('ulFAQ');
let pTagLoading = document.getElementById('pTagLoading');

window.addEventListener("DOMContentLoaded", () => {

    fetch('http://avatoop.com/marina_kish/api/faqs/index/1', {
        method: 'GET',
        headers: {
            "content-type": "application/json",
            'Accept': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.faqs.data && Array.isArray(data.faqs.data) && data.faqs.data.length > 0) {
            pTagLoading.classList.add('d-none');
            data.faqs.data.forEach(user => {
                ulFAQ.insertAdjacentHTML('beforeend', `
                    <li class="mb-2">
                        <a href="#" class="toggle-menu-icon d-flex justify-content-between align-items-center section-bg p-3">
                            ${user.question}
                            <i class="la la-angle-down"></i>
                        </a>
                        <ul class="toggle-drop-menu pt-2">
                            <li class="line-height-26">${user.answer}</li>
                        </ul>
                    </li>
                `);
            });
        } else {
            pTagLoading.innerHTML = 'موردی یافت نشد!';
        }
    })
    .catch(error => {
        console.error('خطا در دریافت داده‌ها:', error);
    });
});
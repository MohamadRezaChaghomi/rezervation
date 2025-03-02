const apiUrl = 'http://avatoop.com/marina_kish/api/settings/index';
const updateApiUrl = 'http://avatoop.com/marina_kish/api/settings/update';
const logoApiUrl = 'http://avatoop.com/marina_kish/api/settings/logo';
const token = localStorage.getItem('Token');

if (!token) {
    window.location.href = "index.html";
} else {
    document.addEventListener('DOMContentLoaded', function () {
        fetchSettings();

        const settingsForm = document.querySelector('.settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', handleSubmit);
        }
    });
}

function fetchSettings() {
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("خطا در دریافت تنظیمات");
        return response.json();
    })
    .then(data => {
        const settings = data.setting || [];

        settings.forEach(setting => {
            if (setting.key === 'footer') {
                document.querySelector('.footer-TextArea').value = Array.isArray(setting.value) ? setting.value.join(', ') : setting.value || "";
            } else if (setting.key === 'contact_us') {
                const contacts = setting.value || ["", "", ""];
                document.querySelector('.contactUs1').value = contacts[0] || "";
                document.querySelector('.contactUs2').value = contacts[1] || "";
                document.querySelector('.contactUs3').value = contacts[2] || "";
            } else if (setting.key === 'category') {
                const categories = setting.value || ["", "", ""];
                document.querySelector('.category1').value = categories[0] || "";
                document.querySelector('.category2').value = categories[1] || "";
                document.querySelector('.category3').value = categories[2] || "";
            } else if (setting.key === 'about_us') {
                document.querySelector('.aboutUs').value = setting.value || "";
            } else if (setting.key === 'image' && setting.value) {
                const logoPreview = document.getElementById('currentLogo');
                logoPreview.src = setting.value;
                logoPreview.style.display = 'block';
            }
        });
    })
    .catch(error => showResponseModal(`خطا در دریافت تنظیمات: ${error.message}`, 'error'));
}

function handleSubmit(event) {
    event.preventDefault();

    const settings = [
        { id: 1, key: 'footer', value: document.querySelector('.footer-TextArea').value.split(', ') },
        { id: 2, key: 'contact_us', value: [
            document.querySelector('.contactUs1').value,
            document.querySelector('.contactUs2').value,
            document.querySelector('.contactUs3').value
        ]},
        { id: 3, key: 'category', value: [
            document.querySelector('.category1').value,
            document.querySelector('.category2').value,
            document.querySelector('.category3').value
        ]},
        { id: 4, key: 'about_us', value: [document.querySelector('.aboutUs').value] }
    ];

    settings.forEach(setting => {
        fetch(`${updateApiUrl}/${setting.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value: setting.value })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || "خطا در ذخیره تنظیمات");
                });
            }
            return response.json();
        })
        .then(data => {
            showResponseModal("تنظیمات با موفقیت ذخیره شد.", 'success');
        })
        .catch(error => showResponseModal(`خطا در ذخیره تنظیمات: ${error.message}`, 'error'));
    });

    const logoInput = document.querySelector('.logo__part');
    if (logoInput && logoInput.files && logoInput.files.length > 0) {
        const formData = new FormData();
        formData.append('logo', logoInput.files[0]);

        fetch(logoApiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error("خطا در آپلود لوگو");
            return response.json();
        })
        .then(data => {
            showResponseModal("لوگو با موفقیت آپلود شد.", 'success');
            location.reload();
        })
        .catch(error => showResponseModal(`خطا در آپلود لوگو: ${error.message}`, 'error'));
    }
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
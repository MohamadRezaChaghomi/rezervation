document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://avatoop.com/marina_kish/api/settings/index";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.setting) {
                updateFooter(data.setting);
            }
        })
        .catch(error => console.error("❌ خطا در دریافت اطلاعات:", error));

    function updateFooter(settings) {
        settings.forEach(item => {
            switch (item.key) {
                case "footer":
                    let footerDesc = document.querySelector(".footer__desc");
                    if (footerDesc && Array.isArray(item.value)) {
                        // پاک کردن محتوای قبلی
                        footerDesc.innerHTML = "";  
                        
                        // برای هر عنصر در آرایه یک تگ <p> جدید اضافه می‌کنیم
                        item.value.forEach(value => {
                            let pElement = document.createElement("p");  // ایجاد یک تگ <p>
                            pElement.textContent = value;  // تنظیم متن تگ <p>
                            footerDesc.appendChild(pElement);  // اضافه کردن به HTML
                        });
                    } else {
                        console.error("❌ مقدار `footer` در API معتبر نیست:", item.value);
                    }
                    break;
                
                case "contact_us":
                    let contactList = document.getElementById("contact-info");
                    if (contactList) {
                        if (item.value && Array.isArray(item.value) && item.value.length >= 3) {
                            contactList.innerHTML = `
                                <li>${item.value[1] || "آدرس نامشخص"}</li>
                                <li dir="ltr">${item.value[0] || "شماره تماس نامشخص"}</li>
                                <li><a href="mailto:${item.value[2]}">${item.value[2] || "ایمیل نامشخص"}</a></li>
                            `;
                        } else {
                            console.error("❌ مقدار `contact_us` در API معتبر نیست:", item.value);
                            contactList.innerHTML = `<li>اطلاعات تماس موجود نیست</li>`;
                        }
                    }
                    break;

                case "category":
                    let categoryList = document.getElementById("category-list");
                    if (categoryList) {
                        if (Array.isArray(item.value) && item.value.length > 0) {
                            categoryList.innerHTML = item.value.map(cat => `<li><a href="#">${cat}</a></li>`).join("");
                        } else {
                            categoryList.innerHTML = "<li>دسته‌بندی در دسترس نیست</li>";
                            console.error("❌ مقدار `category` در API معتبر نیست:", item.value);
                        }
                    }
                    break;

                case "about_us":
                    let aboutUsTitle = document.querySelector(".title[data-text='curvs']");
                    if (aboutUsTitle && typeof item.value === "string") {
                        aboutUsTitle.textContent = item.value;
                    } else {
                        console.error("❌ مقدار `about_us` در API معتبر نیست:", item.value);
                    }
                    break;

                case "image":
                    case "image":
                        let logoContainer = document.getElementById("footer-logo"); // گرفتن `div`
                        if (logoContainer && typeof item.value === "string" && item.value.trim() !== "") {
                            let logoLink = logoContainer.querySelector("a.foot__logo"); // پیدا کردن `a`
                            if (logoLink) {
                                logoLink.innerHTML = `<img src="${item.value}" alt="Footer Logo" class="img-fluid">`; 
                            }
                        } else {
                            console.error("❌ مقدار `image` در API معتبر نیست:", item.value);
                        }
                        break;
                    

                default:
                    console.warn("⚠️ کلید ناشناخته:", item.key);
            }
        });
    }
});
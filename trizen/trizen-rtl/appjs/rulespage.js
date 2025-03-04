document.addEventListener("DOMContentLoaded", function () {
    fetch("http://avatoop.com/marina_kish/api/rules/index") // آدرس API بک‌اند
        .then(response => response.json()) 
        .then(data => {
            const rulesContainer = document.getElementById("rules-container");
            rulesContainer.innerHTML = ""; // پاک کردن متن اولیه

            if (data.rules && data.rules.length > 0) {
                data.rules.forEach((rule, index) => {
                    const ruleElement = document.createElement("h3");
                    // اضافه کردن شمارش کنار متن قانون
                    ruleElement.textContent = `${index + 1}_ ${rule.body}`;
                    rulesContainer.appendChild(ruleElement);
                });
            } else {
                rulesContainer.innerHTML = "<p>هیچ قانونی ثبت نشده است.</p>";
            }
        })
        .catch(error => {
            console.error("خطا در دریافت قوانین:", error);
            document.getElementById("rules-container").innerHTML = "<p>خطایی رخ داده است.</p>";
        });
});

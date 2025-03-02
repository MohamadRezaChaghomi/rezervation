document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://avatoop.com/marina_kish/api/settings/index";
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.setting) {
          updateLogo(data.setting);
        }
      })
      .catch((error) => console.error("❌ خطا در دریافت اطلاعات:", error));
  
    function updateLogo(settings) {
      settings.forEach((item) => {
        switch (item.key) {
          case "image":
            let logoImg = document.getElementById("headerLogo"); // انتخاب بر اساس ID
            if (
              logoImg &&
              typeof item.value === "string" &&
              item.value.trim() !== ""
            ) {
              logoImg.src = item.value;
            } else {
              console.error("❌ مقدار image در API معتبر نیست:", item.value);
            }
            break;
        }
      });
    }
  });

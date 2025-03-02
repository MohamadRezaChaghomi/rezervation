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
            let logoImg = document.getElementById("header-logo"); // انتخاب بر اساس ID
            if (
              logoImg &&
              typeof item.value === "string" &&
              item.value.trim() !== ""
            ) {
              let logoUrl = item.value.trim(); // حذف فضاهای اضافی
              // بررسی اینکه آیا URL به درستی فرمت شده است
              if (isValidUrl(logoUrl)) {
                logoImg.src = logoUrl;
              } else {
                console.error("❌ آدرس لوگو نامعتبر است:", logoUrl);
              }
            } else {
              console.error("❌ مقدار image در API معتبر نیست:", item.value);
            }
            break;
        }
      });
    }
  
    // تابع برای بررسی اعتبار URL
    function isValidUrl(url) {
      const pattern = new RegExp("^(https?:\\/\\/)?([\\w\\d-]+\\.)+[a-z]{2,6}(:[0-9]{1,5})?(\\/[-\\w\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(#[\\w\\d-]*)?$", "i");
      return pattern.test(url);
    }
  });
  
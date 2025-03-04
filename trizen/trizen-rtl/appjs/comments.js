document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://avatoop.com/marina_kish/api/main_comment";
    const testimonialCard = document.getElementById("comment");

    if (!testimonialCard) {
        console.error("🚨 خطا: عنصر `.testimonial-carousel` در HTML یافت نشد!");
        return;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // استخراج آرایه‌ی نظرات از `data.data`
            const comments = data.data || [];

            if (!Array.isArray(comments)) {
                console.error("⚠️ داده‌های نظرات معتبر نیستند. انتظار می‌رود یک آرایه باشد.");
                return;
            }

            if (comments.length === 0) {
                console.warn("🚫 هنوز هیچ نظری ثبت نشده است.");
                testimonialCard.innerHTML = `<p class="no-comments">🚫 هنوز هیچ نظری ثبت نشده است.</p>`;
                return;
            }

            // دریافت 5 کامنت آخر
            const latestComments = comments.slice(-5); // انتخاب 5 کامنت آخر

            testimonialCard.innerHTML = ""; // حذف محتوای پیش‌فرض

            latestComments.forEach(comment => {
                console.log("✅ کامنت دریافت شد:", comment);


                let rating = ''
    
                switch(+(comment.star)){
                    case 1:
                        rating = 
                        `   <i class="la la-star"></i>
                            <i class="lar la-star"></i>
                            <i class="lar la-star"></i>
                            <i class="lar la-star"></i>
                            <i class="lar la-star"></i>
                        `
                        break;
                    case 2:
                        rating =
                        `   <i class="la la-star"></i>
                            <i class="la la-star"></i>
                            <i class="lar la-star"></i>
                            <i class="lar la-star"></i>
                            <i class="lar la-star"></i>
                        `
                        break;
                    case 3:
                        rating =
                        `   <i class="la la-star"></i>
                            <i class="la la-star"></i>
                            <i class="la la-star"></i>
                            <i class="lar la-star"></i>
                            <i class="lar la-star"></i>
                        `
                        break;
                    case 4:
                        rating =
                        `   <i class="la la-star"></i>
                            <i class="la la-star"></i>
                            <i class="la la-star"></i>
                            <i class="la la-star"></i>
                            <i class="lar la-star"></i>
                        `
                        break;
                    case 5:
                        rating =
                        `   <i class="la la-star"></i>
                            <i class="la la-star"></i>
                            <i class="la la-star"></i>
                            <i class="la la-star"></i>
                            <i class="la la-star"></i>
                        `
                        break;
                }
                testimonialCard.insertAdjacentHTML('beforeend', 
                        `<div class="testimonial-card">
                            <div class="author-content d-flex align-items-center">
                                <div class="author-bio">
                                    <h4 class="author__title">${comment.user?.first_name || "نام"} ${comment.user?.last_name || "نام خانوادگی"}</h4>
                                    <span class="ratings d-flex align-items-center">
                                        ${rating}
                                    </span>
                                </div>
                            </div>
                            <div class="testi-desc-box">
                                <p class="testi__desc">
                                ${comment.body || "متن نظر موجود نیست"}
                                </p>
                                ${comment.answer ? `<div class="testi-answer-box"><p class="testi__answer">   پاسخ ادمین: ${comment.answer}</p></div>` : ''}
                            </div>
                        </div><!-- end testimonial-card -->
                `) 
            });
        })
        .catch(error => console.error("⚠️ خطا در دریافت داده‌ها:", error));
});

document.addEventListener("DOMContentLoaded", function () {
    fetchBlogs(); // بارگذاری بلاگ‌ها پس از بارگذاری صفحه
});

// تابع برای دریافت بلاگ‌ها و اطلاعات مربوط به آن‌ها
async function fetchBlogs() {
    try {
        console.log("Fetching blogs...");

        // پاک کردن محتوای قبلی داخل blogContainer
        const blogContainer = document.getElementById("blogContainer");
        if (blogContainer) {
            blogContainer.innerHTML = ""; // حذف همه محتوای قبلی
        }

        // درخواست برای دریافت بلاگ‌ها
        const response = await fetch("http://avatoop.com/marina_kish/api/blogs/index");

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        // دریافت تصاویر وبلاگ‌ها پس از دریافت بلاگ‌ها و نمایش بلاگ‌ها
        fetchBlogImages(data.blogs); // ارسال اطلاعات بلاگ به تابع دریافت تصاویر
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}

// تابع برای دریافت تصاویر وبلاگ‌ها
async function fetchBlogImages(blogs) {
    try {
        for (const blog of blogs) {
            // تنظیم URL برای دریافت تصویر بر اساس آی‌دی بلاگ
            const apiUrl = `http://avatoop.com/marina_kish/api/media/get_image/blog/${blog.id}`;

            // درخواست برای دریافت تصویر
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json(); // تبدیل داده‌ها به فرمت JSON

            // استخراج URL تصویر بلاگ
            const imageUrl = responseData.data && responseData.data.length > 0
                ? responseData.data[0].replace(/\\\//g, '/')
                : "images/blog-img.jpg"; // اگر تصویر موجود نبود، تصویر پیش‌فرض

            // نمایش بلاگ با تصویر دریافت‌شده
            displayBlog(blog, imageUrl);
        }
    } catch (error) {
        console.error("خطا در دریافت تصاویر:", error);
    }
}


// نمایش بلاگ با تصویر و خلاصه مربوط به آن
function displayBlog(blog, imageUrl, index) {
    const blogContainer = document.getElementById("blogContainer");

    if (!blogContainer) {
        console.error("Blog container not found!");
        return;
    }

    // اضافه کردن خلاصه (summary) به نمایش بلاگ
    const blogHTML = `
        <div class="col-lg-4 responsive-column">
            <div class="card-item blog-card">
                <div class="card-img" id="blog-img-${index}">
                    <img src="${imageUrl}" alt="blog-img">
                    <div class="post-format icon-element">
                        <i class="la la-photo"></i>
                    </div>
                </div>
                <div class="card-body">
                    <div class="post-categories">
                    </div>
                   <h3 class="card-title line-height-26">
                   <a href="blog-single.html?id=${blog.id}">${blog.title}</a>
</h3>
                    <p class="card-meta">
                        <span class="post__date">${new Date(blog.created_at).toLocaleDateString('fa-IR')}</span>
                        <span class="post-dot"></span>
                        <span class="post__time">${blog.duration_of_study} دقیقه برای خوندن</span>
                    </p>
                    <p style="color:white;" class="card-summary">${blog.summary}</p> <!-- اضافه کردن خلاصه بلاگ -->
                </div>
            </div>
        </div>
    `;

    blogContainer.innerHTML += blogHTML; // اضافه کردن HTML به container
}

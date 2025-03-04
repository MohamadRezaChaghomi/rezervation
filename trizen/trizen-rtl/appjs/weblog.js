document.addEventListener("DOMContentLoaded", function () {
    fetchBlogs(); // بارگذاری بلاگ‌ها پس از بارگذاری صفحه
});

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

        // نمایش بلاگ‌ها به همراه تصاویر
        data.blogs.forEach(async (blog, index) => {
            const imageUrl = await fetchBlogImage(blog.id); // دریافت تصویر بر اساس `id`
            displayBlog(blog, imageUrl, index); // نمایش بلاگ همراه با تصویر
        });
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}

async function fetchBlogImage(blogId) {
    try {
        const apiUrl = `http://avatoop.com/marina_kish/api/media/get_image/blog/${blogId}`; // آدرس API با id

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json(); // تبدیل داده‌ها به فرمت JSON

        if (responseData.data && responseData.data.length > 0) {
            // استخراج URL اولین تصویر بلاگ
            return responseData.data[0].replace(/\\\//g, '/'); // حذف کاراکترهای اضافی در URL
        }

        return "images/blog-img.jpg"; // تصویر پیش‌فرض
    } catch (error) {
        console.error(`خطا در دریافت تصویر بلاگ ${blogId}:`, error);
        return "images/blog-img.jpg"; // در صورت بروز خطا، تصویر پیش‌فرض
    }
}

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
                    <img src="${imageUrl}" alt="blog-img" style="width: 100%; height: 210px; object-fit: cover;">
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
                    <p style="color:white" class="card-summary">${blog.summary}</p> <!-- اضافه کردن خلاصه بلاگ -->
                </div>
            </div>
        </div>
    `;

    blogContainer.innerHTML += blogHTML; // اضافه کردن HTML به container
}

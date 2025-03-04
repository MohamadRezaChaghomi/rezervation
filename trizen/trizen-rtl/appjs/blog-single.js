document.addEventListener("DOMContentLoaded", function () {
    // دریافت ID از URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get("id");

    console.log("Blog ID from URL:", blogId); // بررسی مقدار ID

    if (blogId) {
        fetchBlogDetails(blogId);
    } else {
        document.getElementById("blogContainer").innerHTML = "<p>مقاله‌ای یافت نشد!</p>";
    }
});

async function fetchBlogDetails(id) {
    try {
        const response = await fetch(`http://avatoop.com/marina_kish/api/blogs/index/${id}`);

        if (!response.ok) {
            throw new Error(`خطا در دریافت مقاله: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received Blog Data:", data); // بررسی داده‌ها

        const blog = Array.isArray(data.blogs) ? data.blogs[0] : data.blogs || data; 

        if (!blog) {
            throw new Error("مقاله‌ای با این ID یافت نشد.");
        }

        // دریافت تصویر مقاله
        const imageResponse = await fetch(`http://avatoop.com/marina_kish/api/media/get_image/blog/${id}`);
        const imageData = await imageResponse.json();

        console.log("Received Image Data:", imageData); // بررسی داده‌های تصویر

        const imageUrl = imageData.data 
            ? (Array.isArray(imageData.data) && imageData.data.length > 0 ? imageData.data[0] : imageData.data)
            : "images/blog-img.jpg";

        // نمایش اطلاعات
        document.getElementById("blogTitle").textContent = blog.title;
        document.getElementById("blogMeta").innerHTML = `مدت مطالعه: ${blog.duration_of_study} دقیقه | تاریخ: ${new Date(blog.created_at).toLocaleDateString('fa-IR')}`;
        document.getElementById("blogContent").textContent = blog.content;
        document.getElementById("blogImage").src = imageUrl;

    } catch (error) {
        console.error("خطا در دریافت مقاله:", error);
        document.getElementById("blogContainer").innerHTML = "<p>خطایی رخ داده است!</p>";
    }
}

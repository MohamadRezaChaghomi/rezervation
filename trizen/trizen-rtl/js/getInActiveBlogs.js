const blogApiUrl = 'http://avatoop.com/marina_kish/api/blogs';
const blogToken = localStorage.getItem('Token');
if (!blogToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchBlogs();
    document.getElementById('confirmRestoreButton').addEventListener('click', handleRestoreBlog);
});

let restoreBlogId = null;

function fetchBlogs() {
    fetch(`${blogApiUrl}/admin/trash`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${blogToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json().catch(() => { throw new Error('Invalid JSON response') });
    })
    .then(data => {
        renderBlogCards(data.blog);
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function renderBlogCards(blogs) {
    const blogContainer = document.querySelector('.blog-container');
    blogContainer.innerHTML = ''; // Clear existing content

    blogs.forEach(blog => {
        const blogCard = document.createElement('div');
        blogCard.classList.add('card', 'mb-3', 'shadow-sm');

        // Fetch the blog image
        fetch(`http://avatoop.com/marina_kish/api/media/get_image/blog/${blog.id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${blogToken}`
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('خطا در دریافت عکس بلاگ');
            return response.json();
        })
        .then(data => {
            const imageData = data.data[Object.keys(data.data)[0]];
            let imageUrl = imageData;
            if(imageUrl === undefined) {
                imageUrl = '../images/default__img.jpg';
            }
            blogCard.innerHTML = `
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${imageUrl}" class="card-img" alt="${blog.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${blog.title}</h5>
                            <p class="card-text"><strong>خلاصه:</strong> ${blog.summary}</p>
                            <p class="card-text"><strong>تاریخ ایجاد:</strong> ${new Date(blog.created_at).toLocaleDateString('fa-IR')}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-success btn-sm" onclick="openRestoreBlogModal(${blog.id})">بازگردانی</button>
                        </div>
                    </div>
                </div>
            `;
            blogContainer.appendChild(blogCard);
        })
        .catch(error => {
            const imageUrl = '../images/default__img.jpg';
            blogCard.innerHTML = `
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${imageUrl}" class="card-img" alt="${blog.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${blog.title}</h5>
                            <p class="card-text"><strong>خلاصه:</strong> ${blog.summary}</p>
                            <p class="card-text"><strong>تاریخ ایجاد:</strong> ${new Date(blog.created_at).toLocaleDateString('fa-IR')}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-center">
                            <button class="btn btn-success btn-sm" onclick="openRestoreBlogModal(${blog.id})">بازگردانی</button>
                        </div>
                    </div>
                </div>
            `;
            blogContainer.appendChild(blogCard);
        });
    });
}

function handleRestoreBlog() {
    fetch(`http://avatoop.com/marina_kish/api/blogs/restore/${restoreBlogId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${blogToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در فعال کردن مجدد بلاگ');
        return response.json();
    })
    .then(data => {
        fetchBlogs();
        $('#restoreBlogModal').modal('hide');
        showResponseModal('بلاگ با موفقیت فعال شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function openRestoreBlogModal(blogId) {
    restoreBlogId = blogId;
    $('#restoreBlogModal').modal('show');
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
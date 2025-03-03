const blogApiUrl = 'http://avatoop.com/marina_kish/api/blogs';
const blogToken = localStorage.getItem('Token');
if (!blogToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchBlogs();
    document.getElementById('addBlogForm').addEventListener('submit', handleAddBlog);
    document.getElementById('editBlogForm').addEventListener('submit', handleEditBlog);
    const editBlogImageForm = document.getElementById('editBlogImageForm');
    if (editBlogImageForm) {
        editBlogImageForm.addEventListener('submit', handleEditBlogImage);
    }
    document.getElementById('confirmDeleteButton').addEventListener('click', handleDeleteBlog);
});

let deleteBlogId = null;
let editBlogId = null;
let editBlogImageId = null;

function fetchBlogs() {
    fetch(`${blogApiUrl}/index`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${blogToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در دریافت بلاگ‌ها');
        return response.json();
    })
    .then(data => {
        renderBlogCards(data.blogs);
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
                            <button class="btn btn-warning btn-sm" onclick="openEditBlogModal(${blog.id}, '${blog.title}', '${blog.summary}', '${blog.content}', ${blog.duration_of_study})">ویرایش اطلاعات</button>
                            <button class="btn btn-info btn-sm" onclick="openEditBlogImageModal(${blog.id})">ویرایش عکس</button>
                            <button class="btn btn-danger btn-sm" onclick="openDeleteBlogModal(${blog.id})">حذف</button>
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
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-warning btn-sm" onclick="openEditBlogModal(${blog.id}, '${blog.title}', '${blog.summary}', '${blog.content}', ${blog.duration_of_study})">ویرایش اطلاعات</button>
                            <button class="btn btn-info btn-sm" onclick="openEditBlogImageModal(${blog.id})">ویرایش عکس</button>
                            <button class="btn btn-danger btn-sm" onclick="openDeleteBlogModal(${blog.id})">حذف</button>
                        </div>
                    </div>
                </div>
            `;
            blogContainer.appendChild(blogCard);
            showResponseModal(`خطا: ${error.message}`, 'error');
        });
    });
}

function openEditBlogImageModal(blogId) {
    editBlogImageId = blogId;
    $('#editBlogImageModal').modal('show');
}

function handleEditBlogImage(event) {
    event.preventDefault();
    const formData = new FormData();
    const imageInput = document.getElementById('blogImageInput');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);

        fetch(`http://avatoop.com/marina_kish/api/media/save_image/blog/${editBlogImageId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/atom+xml',
                'Authorization': `Bearer ${blogToken}`
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('خطا در آپلود عکس بلاگ');
            return response.json();
        })
        .then(data => {
            $('#editBlogImageModal').modal('hide');
            showResponseModal('عکس بلاگ با موفقیت آپلود شد', 'success');
            fetchBlogs(); // Refresh the blog list to show the new image
        })
        .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
    } else {
        showResponseModal('لطفاً یک عکس انتخاب کنید', 'error');
    }
}

function openAddBlogModal() {
    document.getElementById('addBlogForm').reset();
    $('#addBlogModal').modal('show');
}

function openEditBlogModal(blogId, title, summary, content, duration_of_study) {
    editBlogId = blogId;
    document.getElementById('editBlogId').value = blogId;
    document.getElementById('editTitle').value = title;
    document.getElementById('editSummary').value = summary;
    document.getElementById('editContent').value = content;
    document.getElementById('editDurationOfStudy').value = duration_of_study;
    $('#editBlogModal').modal('show');
}

function handleEditBlog(event) {
    event.preventDefault();
    const updatedBlog = {
        title: document.getElementById('editTitle').value,
        summary: document.getElementById('editSummary').value,
        content: document.getElementById('editContent').value,
        duration_of_study: document.getElementById('editDurationOfStudy').value
    };

    fetch(`${blogApiUrl}/update/${editBlogId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${blogToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBlog)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در ویرایش بلاگ');
        return response.json();
    })
    .then(data => {
        fetchBlogs(); 
        $('#editBlogModal').modal('hide');
        showResponseModal('بلاگ با موفقیت ویرایش شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function handleAddBlog(event) {
    event.preventDefault();
    const newBlog = {
        title: document.getElementById('blogTitle').value,
        summary: document.getElementById('blogSummary').value,
        content: document.getElementById('blogContent').value,
        duration_of_study: document.getElementById('blogDurationOfStudy').value
    };

    fetch(`${blogApiUrl}/store`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${blogToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBlog)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در افزودن بلاگ');
        return response.json();
    })
    .then(data => {
        fetchBlogs(); 
        $('#addBlogModal').modal('hide');
        showResponseModal('بلاگ با موفقیت اضافه شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function openDeleteBlogModal(blogId) {
    deleteBlogId = blogId;
    $('#confirmDeleteModal').modal('show');
}

function handleDeleteBlog() {
    fetch(`${blogApiUrl}/delete/${deleteBlogId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${blogToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در حذف بلاگ');
        return response.json();
    })
    .then(data => {
        fetchBlogs(); 
        $('#confirmDeleteModal').modal('hide');
        showResponseModal('بلاگ با موفقیت حذف شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function restoreBlog(blogId) {
    fetch(`${blogApiUrl}/restore/${blogId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${blogToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ deleted_at: null })
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در فعال کردن مجدد بلاگ');
        return response.json();
    })
    .then(data => {
        fetchBlogs(); 
        showResponseModal('بلاگ با موفقیت فعال شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
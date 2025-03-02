document.addEventListener('DOMContentLoaded', () => {
    const url = 'http://avatoop.com/marina_kish/api/reports/index';
    const token = localStorage.getItem('Token');
    if (!token) {
        console.error("توکن یافت نشد، لطفاً وارد شوید.");
        window.location.href = "index.html";
    }
    
    fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        renderReportTable(data);
    })
    .catch(error => {
        console.error('Error fetching reports:', error);
    });
});

function renderReportTable(report) {
    const reportContainer = document.querySelector('.form-content');
    reportContainer.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');

    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>            
            <th>تفریح</th>
            <th>تعداد بلیط های فروش رفته</th>
            <th>مجموع فروش ها</th>
            <th>میانگین امتیازات ثبت شده</th>
            <th>تعداد نظرات</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    report.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.product}</td>
            <td>${ticket.soldTicketsCount}</td>
            <td>${ticket.totalSales}</td>
            <td>${ticket.averageRating}</td>
            <td>${ticket.reviewsCount}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    reportContainer.appendChild(table);
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
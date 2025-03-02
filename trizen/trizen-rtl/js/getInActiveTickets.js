const ticketApiUrl = 'http://avatoop.com/marina_kish/api/tickets';
const userToken = localStorage.getItem('Token');
if (!userToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchTickets();
});


async function fetchTickets() {
    try {
        const response = await fetch(`${ticketApiUrl}/admin/trash`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${userToken}`, 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('خطا در دریافت تیکت‌ها');
        const data = await response.json();
        console.log(data);
        renderTicketTable(data.ticket);
    } catch (error) {
        showResponseModal(`خطا: ${error.message}`, 'error');
    }
}

function renderTicketTable(tickets) {
    const ticketContainer = document.querySelector('.ticket-container');
    ticketContainer.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped');

    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>شماره</th>
            <th>عنوان</th>
            <th>متن</th>
            <th>جواب</th>
            <th>اولویت</th>
            <th>وضعیت</th>
            <th>تاریخ ایجاد</th>
            <th>تاریخ بروزرسانی</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    tickets.forEach(ticket => {
        if(ticket.status == 'answered'){
            ticket.status = 'جواب داده شده';
        }else if(ticket.status == 'closed'){
            ticket.status = 'بسته شده';
        }
        else{
            ticket.status = 'در انتظار';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.id}</td>
            <td>${ticket.title}</td>
            <td>${ticket.body}</td>
            <td>${ticket.answer}</td>
            <td>${ticket.priority}</td>
            <td>${ticket.status}</td>
            <td>${new Date(ticket.created_at).toLocaleDateString('fa-IR')}</td>
            <td>${new Date(ticket.updated_at).toLocaleDateString('fa-IR')}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    ticketContainer.appendChild(table);
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
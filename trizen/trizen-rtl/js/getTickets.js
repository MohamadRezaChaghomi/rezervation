const ticketApiUrl = 'http://avatoop.com/marina_kish/api/tickets';
const ticketToken = localStorage.getItem('Token');
if (!ticketToken) {
    console.error("توکن یافت نشد، لطفاً وارد شوید.");
    window.location.href = "index.html";
}

document.addEventListener('DOMContentLoaded', function () {
    fetchTickets();
    document.getElementById('editTicketForm').addEventListener('submit', handleEditTicket);
});

let deleteTicketId = null;
let editTicketId = null;
let userId = null;  

function fetchTickets() {
    fetch(`${ticketApiUrl}/ticket_admin`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ticketToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در دریافت تیکت‌ها');
        return response.json();
    })
    .then(data => {
        renderTicketTable(data);
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
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
            <th>عملیات</th>
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
            <td class="">
                <button class="m-1 btn btn-warning" onclick="openEditTicketModal(${ticket.id}, '${ticket.user_id}', '${ticket.title}', '${ticket.body}', '${ticket.answer}' , '${ticket.status}' ,'${ticket.priority}')">ویرایش</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    ticketContainer.appendChild(table);
}

function openEditTicketModal(ticketId, user_Id, title, body, answer, status, priority) {
    editTicketId = ticketId;
    userId = user_Id;
    document.getElementById('editTicketId').value = ticketId;
    document.getElementById('editTicketTitle').value = title;
    document.getElementById('editTicketBody').value = body;
    document.getElementById('editTicketAnswer').value = answer;
    document.getElementById('editTicketStatus').value = status;
    document.getElementById('editTicketPriority').value = priority;
    $('#editTicketModal').modal('show');
}

function handleEditTicket(event) {
    event.preventDefault();
    const updatedTicket = {
        id: editTicketId,
        user_id: userId,
        title: document.getElementById('editTicketTitle').value,
        body: document.getElementById('editTicketBody').value,
        answer: document.getElementById('editTicketAnswer').value,
        status: document.getElementById('editTicketStatus').value,
        priority: document.getElementById('editTicketPriority').value,
    };
    console.log(updatedTicket);
    fetch(`http://avatoop.com/marina_kish/api/tickets/update/${editTicketId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${ticketToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTicket)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در ویرایش تیکت');
        return response.json();
    })
    .then(data => {
        fetchTickets(); 
        $('#editTicketModal').modal('hide');
        showResponseModal('تیکت با موفقیت ویرایش شد', 'success');
    })
    .catch(error => showResponseModal(`خطا: ${error.message}`, 'error'));
}

function showResponseModal(message, type) {
    const modalBody = document.getElementById('responseModalBody');
    modalBody.innerHTML = `<p class="${type === 'success' ? 'text-success' : 'text-danger'}">${message}</p>`;
    $('#responseModal').modal('show');
}
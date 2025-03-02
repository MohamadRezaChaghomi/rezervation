var $ = document;
let sendTicket = $.getElementById('sendTicket');

sendTicket.addEventListener('click', () => {
    dashboardAreaNoTicket.classList.add('d-none')
    dashboardAreaSendTicket.classList.remove('d-none')
});
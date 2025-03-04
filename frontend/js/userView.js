export class UserView {

    constructor() {
        this.loginSection = document.getElementById("login-section");
        this.loginForm = document.getElementById("loginForm");
        this.calendarSection = document.getElementById("calendar-section");
        this.logoutSection = document.getElementById("logout-section");
        this.logoutButton = document.getElementById("logout-btn");
    }

    showLogin() {
        this.loginSection.style.display = "block";
        this.calendarSection.style.display = "none";
        this.logoutSection.style.display = "none";
    }

    showCalendar() {
        this.loginSection.style.display = "none";
        this.calendarSection.style.display = "block";
        this.logoutSection.style.display = "block";
        this.initializeCalendar();
    }

    initializeCalendar() {
        const calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            height: window.outerWidth < 768 ? 'auto' : '90vh',
            stickyHeaderDates: true,
            themeSystem: 'default',
            selectable: true,
            selectMirror: true,
            unselectAuto: true,
            select: function (selectionInfo) {
                alert(selectionInfo.startStr + ' to ' + selectionInfo.endStr);
            },
            initialView: 'dayGridMonth',
            firstDay: 1,
            locale: 'it',
            eventTimeFormat: { // like '14:30:00'
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
            },
            headerToolbar: {
                right: 'prev,next today',
                center: '',
                left: 'title'
            },
            footerToolbar: {
                //right: 'prev,next today',
                left: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
            },
            events: [
                {
                    title: 'Ingegneria del Software',
                    start: '2025-03-04T09:00',
                    end: '2025-03-04T10:30',
                    color: 'red'
                },
                {
                    title: 'Reti di Calcolatori',
                    start: '2025-03-05T09:00',
                    end: '2025-03-05T10:30',
                    color: 'green'
                },
                {
                    title: 'Cultura e strumenti della comunicazione digitale',
                    start: '2025-03-07T09:00',
                    end: '2025-03-07T10:30',
                    color: 'blue'
                }
            ],
            editable: true,
            eventDrop: function(eventDropInfo) {

            },
            dayCellDidMount: function (info) {
                let cellDate = FullCalendar.formatDate(info.date, { month: 'numeric', day: '2-digit', year: 'numeric' });
                let today = FullCalendar.formatDate(new Date(), { month: 'numeric', day: '2-digit', year: 'numeric' });
                if(cellDate === today) {
                    var cell = info.el;
                    cell.style.background = 'none';
                }
            }  
        });
        calendar.render();
    }

    initializeEvents(presenter) {
        $('#loginForm').submit(function (event) {
            event.preventDefault()
            const email = $("#email").val();
            const password = $("#password").val();
            if(!this.checkValidity()) {
                event.stopPropagation()
            } else {
                presenter.login(email, password)
            }
            this.classList.add('was-validated')
        })

        $("#logout-btn").click(function (event) {
            presenter.logout();
        });
    }
}
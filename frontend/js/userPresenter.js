
var events = []

export class UserPresenter {

    constructor(view) {
        this.view = view;
    }

    // Funzione per convertire la data da 'dd/MM/yyyy' a 'yyyy-MM-ddTHH:mm:ss'
    convertDateFormat(dateStr) {
        const parts = dateStr.split('/');  // Split '03/02/2025' in ['03', '02', '2025']
        const formattedDate = `${parts[2]}-${parts[0]}-${parts[1]}T09:00:00`;  // '2025-02-03T00:00:00'
        return formattedDate;
    }

    mapEvents(ev) {
        const mappedEvents = ev.map(event => {
            const formattedDate = this.convertDateFormat(event.date_opt)
            return {
                title: event.course_name,
                start: formattedDate,
                course_year: event.course_year,
                color: 'none'
            }
        })
        return mappedEvents
    }

    getAppelli() {
        $.ajax({
            url: 'http://localhost:8080/db/queryAppelli',
            method: 'POST',
            async: false,
            success: function (response) {
                console.log(response);  // Verifica cosa ricevi dal server
                if (response.success === true) {
                    console.log(events)
                    console.log(response.events)

                    events = this.mapEvents(response.events)
                    console.log(events)
                } else {
                    console.error("La risposta non è nel formato corretto");
                }
            }.bind(this),
            error: function (xhr, status, error) {
                console.error("Errore durante il recupero degli eventi:", error);
            }
        });
    }

    initializeCalendar() {
        this.getAppelli()

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
            events: events
            // [
            //     {
            //         title: 'Ingegneria del Software',
            //         start: '2025-03-04T09:00',
            //         end: '2025-03-04T10:30',
            //         color: 'red'
            //     },
            //     {
            //         title: 'Reti di Calcolatori',
            //         start: '2025-03-05T09:00',
            //         end: '2025-03-05T10:30',
            //         color: 'green'
            //     },
            //     {
            //         title: 'Cultura e strumenti della comunicazione digitale',
            //         start: '2025-03-07T09:00',
            //         end: '2025-03-07T10:30',
            //         color: 'blue'
            //     }
            // ]
            ,
            editable: true,
            eventDrop: function (eventDropInfo) {

            },
            dayCellDidMount: function (info) {
                let cellDate = FullCalendar.formatDate(info.date, { month: 'numeric', day: '2-digit', year: 'numeric' });
                let today = FullCalendar.formatDate(new Date(), { month: 'numeric', day: '2-digit', year: 'numeric' });
                if (cellDate === today) {
                    var cell = info.el;
                    cell.style.background = 'none';
                }
            },
            eventDidMount: function (info) {
                let eventDate = info.event.start;
                let dot = info.el.querySelector('.fc-event-dot');
                // Controlla se l'evento cade di lunedì (0 = domenica, 1 = lunedì, ..., 6 = sabato)
                if (eventDate.getDay() === 1) { // Lunedì
                    info.el.style.backgroundColor = 'blue';
                } else if (eventDate.getDay() === 5) { // Venerdì
                    info.el.style.backgroundColor = 'green';
                    dot.style.display= 'none';
                } else {
                    info.el.style.backgroundColor = 'red';
                }
            }
        });
        calendar.render();
    }

    checkSession() {
        $.ajax({
            url: "http://localhost:8080/session",
            method: "GET",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                console.log(response);
                if (response.logged_in) {
                    this.view.showCalendar()
                    //this.getAppelli()
                    this.initializeCalendar()

                } else {
                    this.view.showLogin()
                }
            }.bind(this),
            error: function (response) {
                console.log(response);
            }
        });
    }

    login(email, password) {

        $.ajax({
            url: "http://localhost:8080/session/login",
            method: "POST",
            data: {
                email: email,
                password: password
            },
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                console.log(response);
                if (response.success === true) {
                    $('#not-found-section').hide()
                    this.checkSession() // Aggiorna l'interfaccia
                    //$("#not-found-section").hide(); 
                } else {
                    $('#not-found-section').show()
                }
            }.bind(this),
            error: function (response) {
                console.log(response);
            }
        });

    }

    logout() {
        $.ajax({
            url: "http://localhost:8080/session/logout",
            method: "GET",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            success: function (response) {
                console.log(response);
                if (response.success === true) {
                    this.checkSession(); // Aggiorna l'interfaccia
                    console.log(response)
                }
            }.bind(this),
            error: function (response) {
                console.log("err:" + response);
            }
        });
    }
}
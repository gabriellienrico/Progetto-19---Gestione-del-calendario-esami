
var events = []

export class UserPresenter {

    constructor(view) {
        this.view = view;
    }

    // Funzione per convertire la data da 'dd/MM/yyyy' a 'yyyy-MM-ddTHH:mm:ss'
    convertDateFormat(opz) {
        const json = JSON.parse(opz)
        //console.log(json.data)
        //const parts = dateStr.split('/');  // Split '03/02/2025' in ['03', '02', '2025']
        const formattedDate = `${json.data}T${json.orario_inizio}`;  // '2025-02-03T00:00:00'
        //console.log(formattedDate)
        return formattedDate;
    }

    mapEvents(ev) {
        const mappedEvents = ev.map(event => {
            const response = $.ajax({
                url: 'http://localhost:8080/db/queryCorso',
                method: 'POST',
                data: {id: event.corso},
                async: false,
                success: function (response) {
                    console.log(response);
                    return response;
                      // Verifica cosa ricevi dal server
                    // if (response.success === true) {
                    //     console.log(response.corso)
                    //     const formattedDate = this.convertDateFormat(event.opz_1)
                    //     return {
                    //         title: response.corso.nome_corso,
                    //         start: formattedDate,
                    //         course_year: response.corso.anno_corso,
                    //         borderColor: 'black'
                    //     }
                        
                    // } else {
                    //     console.error("La risposta non è nel formato corretto");
                    // }
                }.bind(this),
                error: function (xhr, status, error) {
                    console.error("Errore durante il recupero degli eventi:", error);
                }
            });
            console.log(response);
            if (response.responseJSON.success === true) {
                console.log(response.responseJSON)
                console.log(response.responseJSON.corso)
                const formattedDate = this.convertDateFormat(event.opz_1)
                return {
                    title: response.responseJSON.corso[0].nome_corso,
                    start: formattedDate,
                    course_year: response.responseJSON.corso[0].anno_corso,
                    borderColor: 'black',
                }
            } else {
                console.error("La risposta non è nel formato corretto")
            }
            //return app;
            //console.log(event)
        })
        console.log(mappedEvents)
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
                    //console.log(events)
                    console.log(response.events)
                    events = this.mapEvents(response.events)
                    //console.log(events)
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
                left: 'dayGridMonth,timeGridWeek,listMonth'
            },
            events: events,
            editable: true,
            eventDrop: function (eventDropInfo) {

            },
            dayCellDidMount: function (info) {
                let cellDate = FullCalendar.formatDate(info.date, { month: 'numeric', day: '2-digit', year: 'numeric' });
                let today = FullCalendar.formatDate(new Date(), { month: 'numeric', day: '2-digit', year: 'numeric' });
                let cell = info.el;
                if(info.view.type === "dayGridMonth") {
                    if (cellDate === today) {
                        cell.style.background = 'none'
                        let back = cell.querySelector('.fc-daygrid-day-number')
                        //console.log(back)
                        back.style.backgroundColor = 'blue'
                        back.style.color = 'white'
                    }
                    
                }
            },
            eventDidMount: function (info) {
                let eventDate = info.event.start
                if(info.view.type === "dayGridMonth" || info.view.type === "timeGridWeek") {
                    info.el.style.backgroundColor = 'lightgreen'
                    info.event.setProp('borderColor', 'lightgreen')
                } else {
                    info.event.setProp('borderColor', 'lightgreen')
                }
                
                if(info.view.type === "dayGridMonth") {
                    if(window.outerWidth < 768) {
                        let time = info.el.querySelector('.fc-event-time')
                        time.style.display = 'none'
                    }
                    if (eventDate.getDay() === 1) { // Lunedì
                        //info.el.style.backgroundColor = 'blue';
                    } else if (eventDate.getDay() === 3) { // Venerdì
                        //info.el.style.backgroundColor = 'red';
                        //dot.style.display= 'none';>
                    } else {
                        //info.el.style.backgroundColor = 'green';
                    }
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
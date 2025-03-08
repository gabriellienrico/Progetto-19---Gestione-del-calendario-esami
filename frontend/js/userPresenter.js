var events = []

export class UserPresenter {

    constructor(view) {
        this.view = view;
    }

    // Funzione per convertire la data da 'dd/MM/yyyy' a 'yyyy-MM-ddTHH:mm:ss'
    convertDateFormat(data, orario_inizio) {
        const formattedDate = `${data}T${orario_inizio}`;  // '2025-02-03T00:00:00'
        return formattedDate;
    }

    getCorso(idCorso) {
        const response = $.ajax({
            url: 'http://localhost:8080/db/queryCorso',
            method: 'POST',
            data: { id: idCorso },
            async: false,
            success: function (response) {
                //console.log(response);
                return response;
            }.bind(this),
            error: function (xhr, status, error) {
                console.error("Errore durante il recupero degli eventi:", error);
            }
        });
        if (response.responseJSON.success === true)
            return response.responseJSON.corso[0];
        else
            return;
    }

    getProf(idProf) {
        const response = $.ajax({
            url: 'http://localhost:8080/db/queryProf',
            method: 'POST',
            data: { id: idProf },
            async: false,
            success: function (response) {
                //console.log(response);
                return response;
            }.bind(this),
            error: function (xhr, status, error) {
                console.error("Errore durante il recupero degli eventi:", error);
            }
        });
        if (response.responseJSON.success === true)
            return response.responseJSON.prof[0];
        else
            return;
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
                    //console.log(response.events)
                    events = this.mapEvents(response.events)
                    //console.log(events.length)

                    //this.optimizeCalendar()

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

    mapEvents(ev) {
        const mappedEvents = ev.map(event => {
            const corso = this.getCorso(event.corso)
            const prof = this.getProf(event.professore)
            //console.log(response);
            if (corso !== null && prof !== null) {
                const opz_1 = JSON.parse(event.opz_1)
                const orario_inizio1 = this.convertDateFormat(opz_1.data, opz_1.orario_inizio)
                const orario_fine1 = this.convertDateFormat(opz_1.data, opz_1.orario_fine)
                const opz_2 = JSON.parse(event.opz_2)
                const orario_inizio2 = this.convertDateFormat(opz_2.data, opz_2.orario_inizio)
                const orario_fine2 = this.convertDateFormat(opz_2.data, opz_2.orario_fine)
                const opz_agg = JSON.parse(event.opz_agg)
                //const formattedDate2 = this.convertDateFormat(event.opz_2)
                return {
                    title: corso.nome_corso,
                    start: orario_inizio1,
                    end: orario_fine1,
                    course_year: corso.anno_corso,
                    prof: prof.nome + " " + prof.cognome,
                    email: prof.email,
                    appello_id: event.id,
                    start_2: orario_inizio2,
                    end_2: orario_fine2,
                    opz_agg: opz_agg,
                    borderColor: 'black'
                }
            } else {
                console.error("La risposta non è nel formato corretto")
            }
            //console.log(event)
        })
        //console.log(mappedEvents)
        return mappedEvents
    }

    setColor(info) {
        let events = info.view.calendar.getEvents()

        //Estrazione della data
        let eventDate = info.event.startStr.split('T')[0]

        //Ricerca eventi nello stesso giorno
        let sameDayEvents = events.filter(event => event.startStr.split('T')[0] === eventDate)

        //Ricerca eventi nello stesso giorno con anni di corso diversi
        let diffCourseEvents = events.filter(event => event.extendedProps.course_year !== info.event.extendedProps.course_year)

        //Ricerca eventi nello stesso giorno con stesso anno di corso
        let sameCourseEvents = sameDayEvents.filter(event => event.extendedProps.course_year === info.event.extendedProps.course_year);
        //console.log(info.event.startStr)

        if (info.view.type === "dayGridMonth" || info.view.type === "timeGridWeek") {
            if (sameCourseEvents.length > 1) {
                info.el.style.backgroundColor = 'red'
                //info.event.setProp('color', 'red')
                info.event.setProp('borderColor', 'firebrick')
            } else if (diffCourseEvents.length > 1) {
                let hasConflict = false;

                //Confronta ogni evento di corso diverso con l'evento attuale
                diffCourseEvents.forEach(event => {
                    let infoStart = new Date(info.event.startStr);
                    let infoEnd = new Date(info.event.endStr);
                    let eventStart = new Date(event.startStr);
                    let eventEnd = new Date(event.endStr);

                    //Conflitto orario
                    if ((infoEnd > eventStart && infoStart < eventEnd) ||
                        (eventEnd > infoStart && eventStart < infoEnd)) {
                        hasConflict = true;
                    }
                })

                if (hasConflict) {
                    info.el.style.backgroundColor = 'rgb(255, 255, 153)'
                    info.event.setProp('borderColor', 'khaki')
                } else {
                    info.el.style.backgroundColor = 'lightgreen'
                    info.event.setProp('borderColor', 'limegreen')
                }

            } else {
                info.el.style.backgroundColor = 'lightgreen'
                info.event.setProp('borderColor', 'limegreen')
            }
        } else {
            if (sameCourseEvents.length > 1) {
                //info.el.style.backgroundColor = 'red'
                info.event.setProp('borderColor', 'red')
            } else if (sameDayEvents.length > 1) {
                //info.el.style.backgroundColor = 'yellow'
                info.event.setProp('borderColor', 'yellow')
            } else {
                //info.el.style.backgroundColor = 'lightgreen'
                info.event.setProp('borderColor', 'lightgreen')
            }
        }

        if (info.view.type === "dayGridMonth") {
            if (window.outerWidth < 768) {
                let time = info.el.querySelector('.fc-event-time')
                time.style.display = 'none'
                //info.event.setProp('displayEventTime', false)
            }
        }
    }

    optimizeCalendar(option) {

        document.getElementById("loading-indicator").style.display = "block";

        // Funzione che verifica se due eventi sono nello stesso giorno
        function areOnSameDay(event1, event2) {
            // Converte start in una data senza orario (solo giorno)
            let date1 = new Date(event1.start);
            let date2 = new Date(event2.start);

            // Imposta l'orario a mezzanotte per entrambi gli eventi per comparare solo la data
            date1.setHours(0, 0, 0, 0);
            date2.setHours(0, 0, 0, 0);

            return date1.getTime() === date2.getTime();
        }

        // Funzione che verifica se due eventi si sovrappongono orariamente
        function areOverlapping(event1, event2) {
            let start1 = new Date(event1.start);
            let end1 = new Date(event1.end);
            let start2 = new Date(event2.start);
            let end2 = new Date(event2.end);

            return start1 < end2 && end1 > start2;
        }

        // Funzione che calcola il peso della sovrapposizione tra due eventi
        function getConflictWeight(event1, event2) {
            // Caso 1: Sono dello stesso anno e nello stesso giorno
            if (event1.course_year === event2.course_year && areOnSameDay(event1, event2)) {
                return 5; // Peso maggiore per eventi dello stesso anno nello stesso giorno
            }

            // Caso 2: Non sono dello stesso anno, ma si sovrappongono orariamente
            if (event1.course_year !== event2.course_year && areOverlapping(event1, event2)) {
                return 3; // Peso medio per eventi di anni diversi che si sovrappongono orariamente
            }

            // Caso 3: Non sono dello stesso anno e non si sovrappongono orariamente, ma sono nello stesso giorno
            if (event1.course_year !== event2.course_year && areOnSameDay(event1, event2)) {
                return 1; // Peso minore per eventi di anni diversi ma nello stesso giorno
            }

            // Caso 4: Non ci sono conflitti
            return 0; // Nessun conflitto
        }

        // Funzione che calcola il peso totale (cioè la somma dei conflitti) per una data configurazione
        function calculateTotalWeight(events) {
            let totalWeight = 0;
            for (let i = 0; i < events.length; i++) {
                for (let j = i + 1; j < events.length; j++) {
                    if (areOverlapping(events[i], events[j]) || areOnSameDay(events[i], events[j])) {
                        totalWeight += getConflictWeight(events[i], events[j]);
                    }
                }
            }
            return totalWeight;
        }

        // Funzione che genera i vicini per l'attuale stato
        function generateNeighbors(currentState) {
            let neighbors = [];

            // Per ogni evento, vediamo quale configurazione (start, end) è migliore
            for (let event of currentState) {
                let newState = JSON.parse(JSON.stringify(currentState)); // Clona lo stato
                let eventCopy = newState.find(e => e.title === event.title);

                // Calcola il peso se usiamo l'orario principale
                let mainConfigWeight = 0;
                let alternativeConfigWeight = 0;

                // Prima config: start, end
                eventCopy.start = event.start;
                eventCopy.end = event.end;
                mainConfigWeight = calculateTotalWeight(newState);

                // Seconda config: start_2, end_2
                eventCopy.start = event.start_2;
                eventCopy.end = event.end_2;
                alternativeConfigWeight = calculateTotalWeight(newState);

                // Sostituire con la configurazione migliore (quella con il peso minore)
                if (alternativeConfigWeight < mainConfigWeight) {
                    // Se l'alternativa è migliore, usa start_2, end_2
                    eventCopy.start = event.start_2;
                    eventCopy.end = event.end_2;
                } else {
                    // Altrimenti mantieni la configurazione originale
                    eventCopy.start = event.start;
                    eventCopy.end = event.end;
                }

                neighbors.push(newState);
            }

            return neighbors;
        }

        // Algoritmo di ottimizzazione basato su Dijkstra
        function dijkstraOptimization(initialState) {
            let queue = [{ state: initialState, weight: calculateTotalWeight(initialState) }];
            let visited = new Set();
            //let bestState = initialState;
            //let bestWeight = calculateTotalWeight(initialState);
            let bestStates = []
            let bestWeights = []
            //console.log(bestWeight)

            let iteration = 0

            while (queue.length > 0) {
                // Ordina la coda per peso (stato con il peso più basso prima)
                if (queue.length > 1) {
                    queue.sort((a, b) => a.weight - b.weight);
                }

                let { state, weight } = queue.shift(); // Estrai il primo stato dalla coda

                let stateKey = `${state.map(e => e.title).join('-')}-${state.map(e => e.start).join('-')}`
                if (visited.has(stateKey))
                    continue; // Salta se già visitato
                visited.add(stateKey);

                // if (weight < bestWeight) {
                //     bestWeight = weight;
                //     bestState = state;
                // }

                //Tiene traccia dei migliori stati
                if (bestStates.length < 2) {
                    bestStates.push(state)
                    bestWeights.push(weight)
                } else {
                    //Se si trova un miglior stato (minor peso), si sostituisce la seconda migliore ottimizzazione
                    if (weight < bestWeights[1]) {
                        if (weight < bestWeights[0]) {
                            bestStates[1] = bestStates[0]
                            bestWeights[1] = bestWeights[0]
                            bestStates[0] = state
                            bestWeights[0] = weight
                        } else {
                            bestStates[1] = state
                            bestWeights[1] = weight
                        }

                    }
                }

                // Genera i vicini dello stato corrente
                let neighbors = generateNeighbors(state);
                for (let neighbor of neighbors) {
                    let neighborWeight = calculateTotalWeight(neighbor);
                    let neighborKey = `${neighbor.map(e => e.title).join('-')}-${neighbor.map(e => e.start).join('-')}`

                    // Aggiungi il vicino alla coda se non è già stato visitato
                    if (!visited.has(neighborKey)) {
                        queue.push({ state: neighbor, weight: neighborWeight });
                    }
                }
                iteration++;
                console.log("dijkstra optimization: "+iteration)
            }
            console.log(bestWeights[option - 1])
            if (option === 1)
                return bestStates[0]
            return bestStates[1]
        }

        return dijkstraOptimization(events);
    }

    updateEvents(date) {
        let events = window.calendar.getEvents().filter(event => {
            return event.start.toISOString().split('T')[0] === date.toISOString().split('T')[0]
        })

        events.forEach(event => {
            let newProps = {
                title: event.title,
                start: event.start,
                end: event.end,
                extendedProps: { ...event.extendedProps },
                borderColor: 'black'
            }
            event.remove()
            window.calendar.addEvent(newProps, true)
        })
    }

    applyOptimizedEvents(option) {
        document.getElementById("loading-indicator").style.display = "block";

        //Permette all'interfaccia grafica di visualizzare il loading indicator
        setTimeout(() => {

            //Rimuove gli eventi precedenti
            let removeEvents = window.calendar.getEventSources()
            removeEvents.forEach(event => {
                event.remove()
            })

            //Ottimizza gli eventi quando il bottone viene clickato
            window.calendar.addEventSource(this.optimizeCalendar(option))

            document.getElementById("loading-indicator").style.display = "none"
        }, 200)
    }

    initializeCalendar() {

        this.getAppelli()

        const calendarEl = document.getElementById('calendar');
        window.calendar = new window.FullCalendar.Calendar(calendarEl, {
            height: window.outerWidth < 768 ? 'auto' : '90vh',
            stickyHeaderDates: true,
            themeSystem: 'bootstrap5',
            selectable: true,
            selectMirror: true,
            unselectAuto: true,
            weekends: false,
            select: function (selectionInfo) {
                alert(selectionInfo.startStr + ' to ' + selectionInfo.endStr);
            },
            initialView: 'dayGridMonth',
            firstDay: 1,
            locale: 'it',
            customButtons: {
                optimize: {
                    text: 'Opzione 1',
                    click: function () {

                        this.applyOptimizedEvents(1)

                    }.bind(this)
                },
                optimize_2: {
                    text: 'Opzione 2',
                    click: function () {

                        this.applyOptimizedEvents(2)

                    }.bind(this)
                },
                optimize_3: {
                    text: 'Opzione 3'
                },
                applica: {
                    text: 'Applica modifiche'
                }
            },
            eventTimeFormat: { // like '14:30:00'
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
            },
            headerToolbar: {
                right: 'prev today next',
                center: '',
                left: 'title'
            },
            footerToolbar: {
                //right: 'prev,next today',
                left: 'dayGridMonth,timeGridWeek,listMonth',
                center: 'applica',
                right: 'optimize,optimize_2'
            },
            events: events,
            editable: true,
            eventClick: function (info) {
                this.view.showInfo(info.event)
            }.bind(this),
            eventDrop: function (info) {
                let oldDate = info.oldEvent.start;
                let newDate = info.event.start

                this.updateEvents(oldDate)
                this.updateEvents(newDate)

            }.bind(this),
            dayCellDidMount: function (info) {
                let cellDate = FullCalendar.formatDate(info.date, { month: 'numeric', day: '2-digit', year: 'numeric' });
                let today = FullCalendar.formatDate(new Date(), { month: 'numeric', day: '2-digit', year: 'numeric' });
                let cell = info.el;
                if (info.view.type === "dayGridMonth") {
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
                this.setColor(info)
            }.bind(this)
        });
        window.calendar.render();
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
                    console.log(events)
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

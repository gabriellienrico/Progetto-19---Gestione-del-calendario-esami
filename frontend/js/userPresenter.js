var events = []

export class UserPresenter {

    constructor(view) {
        this.view = view;
    }

    // Funzione per convertire la data da 'dd/MM/yyyy' a 'yyyy-MM-ddTHH:mm:ss'
    convertDateFormat(data, orario_inizio) {
        //const json = JSON.parse(opz)
        //console.log(json.data)
        //const parts = dateStr.split('/');  // Split '03/02/2025' in ['03', '02', '2025']
        const formattedDate = `${data}T${orario_inizio}`;  // '2025-02-03T00:00:00'
        //console.log(formattedDate)
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

    mapEvents(ev) {
        const mappedEvents = ev.map(event => {
            const corso = this.getCorso(event.corso)
            //console.log(response);
            if (corso !== null) {
                const opz_1 = JSON.parse(event.opz_1)
                const orario_inizio1 = this.convertDateFormat(opz_1.data, opz_1.orario_inizio)
                const orario_fine1 = this.convertDateFormat(opz_1.data, opz_1.orario_fine)
                const opz_2 = JSON.parse(event.opz_2)
                const orario_inizio2 = this.convertDateFormat(opz_2.data, opz_2.orario_inizio)
                const orario_fine2 = this.convertDateFormat(opz_2.data, opz_2.orario_fine)
                //const formattedDate2 = this.convertDateFormat(event.opz_2)
                return {
                    title: corso.nome_corso,
                    start: orario_inizio1,
                    end: orario_fine1,
                    course_year: corso.anno_corso,
                    start_2: orario_inizio2,
                    end_2: orario_fine2,
                    borderColor: 'black',
                }
            } else {
                console.error("La risposta non è nel formato corretto")
            }
            //console.log(event)
        })
        //console.log(mappedEvents)
        return mappedEvents
    }

    // optimizeCalendar() {
    //     function areOverlapping(event1, event2) {
    //         return event1.start < event2.end && event1.end > event2.start;
    //     }

    //     function getConflictWeight(event1, event2) {
    //         return event1.course_year === event2.course_year ? 2 : 1;
    //     }

    //     function countConflicts(event, events) {
    //         return events.reduce((count, other) => {
    //             return count + (event !== other && areOverlapping(event, other) ? getConflictWeight(event, other) : 0);
    //         }, 0);
    //     }

    //     function chooseBestDate(event, events) {
    //         let currentConflicts = countConflicts(event, events);

    //         // Prova la data alternativa
    //         [event.start, event.start_2] = [event.start_2, event.start];
    //         [event.end, event.end_2] = [event.end_2, event.end];

    //         let alternativeConflicts = countConflicts(event, events);

    //         // Se l'alternativa è peggiore, torna alla data originale
    //         if (alternativeConflicts >= currentConflicts) {
    //             [event.start, event.start_2] = [event.start_2, event.start];
    //             [event.end, event.end_2] = [event.end_2, event.end];
    //         }
    //     }

    //     let previousComparisons = new Set();
    //     let conflicts;
    //     let iteration = 0;

    //     function getComparisonKey(event1, event2) {
    //         return [event1.title, event1.start, event1.end, event2.title, event2.start, event2.end].join('|');
    //     }


    //     do {
    //         conflicts = [];
    //         iteration++;
    //         console.log(iteration)
    //         //previousComparisons.clear();

    //         for (let i = 0; i < events.length; i++) {
    //             for (let j = i + 1; j < events.length; j++) {
    //                 if (areOverlapping(events[i], events[j])) {
    //                     let key = getComparisonKey(events[i], events[j]);
    //                     console.log(key)
    //                     if (previousComparisons.has(key)) {
    //                         console.log("stallo rilevato: " + key)
    //                         break; // Stallo rilevato, esco dal loop
    //                     }
    //                     previousComparisons.add(key);


    //                     conflicts.push({
    //                         event1: events[i],
    //                         event2: events[j],
    //                         weight: getConflictWeight(events[i], events[j])
    //                     });
    //                 }
    //             }
    //         }
    //         console.log("fuori dal for")

    //         while (conflicts.length > 0) {
    //             conflicts.sort((a, b) => a.weight - b.weight);
    //             chooseBestDate(conflicts[conflicts.length-1].event2, events);
    //             console.log(conflicts[conflicts.length-1].event1, conflicts[conflicts.length-1].event2)
    //             conflicts.pop()
    //         }

    //     } while (iteration < 100);

    //     console.loge(countConflicts())

    //     return events;
    // }

    optimizeCalendar() {

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
            let bestState = initialState;
            let bestWeight = calculateTotalWeight(initialState);
            console.log(bestWeight)

            let iteration = 0

            while (queue.length > 0) {
                // Ordina la coda per peso (stato con il peso più basso prima)
                if (queue.length > 1) {
                    queue.sort((a, b) => a.weight - b.weight);
                }

                let { state, weight } = queue.shift(); // Estrai il primo stato dalla coda

                let stateKey = JSON.stringify(state.map(e => ({ title: e.title, start: e.start, end: e.end })));
                if (visited.has(stateKey)) continue; // Salta se già visitato
                visited.add(stateKey);

                if (weight < bestWeight) {
                    bestWeight = weight;
                    bestState = state;
                }

                // Genera i vicini dello stato corrente
                let neighbors = generateNeighbors(state);
                for (let neighbor of neighbors) {
                    let neighborWeight = calculateTotalWeight(neighbor);
                    let neighborKey = JSON.stringify(neighbor.map(e => ({ title: e.title, start: e.start, end: e.end })));

                    // Aggiungi il vicino alla coda se non è già stato visitato
                    if (!visited.has(neighborKey)) {
                        queue.push({ state: neighbor, weight: neighborWeight });
                    }
                }
                iteration++;
                //console.log("dijkstra optimization: "+iteration)
            }
            console.log(bestWeight)
            return bestState;
        }

        return dijkstraOptimization(events);
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

    initializeCalendar() {

        this.getAppelli()

        const calendarEl = document.getElementById('calendar');
        var calendar = new window.FullCalendar.Calendar(calendarEl, {
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
                    text: 'Ottimizza!',
                    click: function () {
                        //console.log(document.getElementById("loading-indicator").style.display)
                        document.getElementById("loading-indicator").style.display = "block";
                        //console.log(document.getElementById("loading-indicator").style.display);

                        setTimeout(() => {
                            //console.log(document.getElementById("loading-indicator").style.display)

                            //Rimuove gli eventi precedenti
                            let removeEvents = calendar.getEventSources()
                            removeEvents.forEach(event => {
                                event.remove()
                            })

                            //Ottimizza gli eventi quando il bottone viene clickato
                            calendar.addEventSource(this.optimizeCalendar())

                            document.getElementById("loading-indicator").style.display = "none"
                        }, 0)

                    }.bind(this)
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
                right: 'optimize'
            },
            events: events,
            editable: true,
            // loading: function(isLoading, view) {
            //     if(isLoading) {
            //         $('#loading-indicator').show()
            //     } else {
            //         $('#loading-indicator').hide()
            //     }
            // },
            eventDrop: function (eventDropInfo) {

            },
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

                let events = info.view.calendar.getEvents()

                //Estrazione della data
                let eventDate = info.event.startStr.split('T')[0]

                //Ricerca eventi nello stesso giorno
                let sameDayEvents = events.filter(event => event.startStr.split('T')[0] === eventDate)

                //Ricerca eventi con stesso anno di corso nello stesso giorno
                let sameCourseEvents = sameDayEvents.filter(event => event.extendedProps.course_year === info.event.extendedProps.course_year);
                //console.log(info.event.startStr)

                if (info.view.type === "dayGridMonth" || info.view.type === "timeGridWeek") {
                    if(sameCourseEvents.length > 1) {
                        info.el.style.backgroundColor = 'red'
                        info.event.setProp('borderColor', 'firebrick')
                    } else if (sameDayEvents.length > 1) {
                        info.el.style.backgroundColor = 'rgb(255, 255, 153)'
                        info.event.setProp('borderColor', 'khaki')
                    } else {
                        info.el.style.backgroundColor = 'lightgreen'
                        info.event.setProp('borderColor', 'limegreen')
                    }
                } else {
                    if(sameCourseEvents.length > 1) {
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

                    

                    // if (eventDate.getDay() === 1) { // Lunedì
                    //     //info.el.style.backgroundColor = 'blue';
                    // } else if (eventDate.getDay() === 3) { // Venerdì
                    //     //info.el.style.backgroundColor = 'red';
                    //     //dot.style.display= 'none';>
                    // } else {
                    //     //info.el.style.backgroundColor = 'green';
                    // }
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

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

    updateDropdown(optimizedStates) {
        let select = $("#optimization-options")
        select.empty()

        optimizedStates.forEach((opt, index) => {
            select.append(`<option value="${index}">Opzione ${index + 1}</option>`)
        })

        //Quando cambia la selezione, aggiorna il calendario
        select.off("change").on("change", function(event) {

            let selectedIndex = $(event.target).val()
            selectedIndex = parseInt(selectedIndex, 10)
            this.updateCalendar(optimizedStates[selectedIndex])
        }.bind(this))
    }

    updateCalendar(events) {
        window.calendar.getEventSources().forEach(event => {
            event.remove()
        })
        window.calendar.addEventSource(events)
        window.calendar.render()
    }

    optimizeCalendar(option) {
        //document.getElementById("loading-indicator").style.display = "block";

        // Funzione che verifica se due eventi sono nello stesso giorno
        function areOnSameDay(event1, event2) {
            let date1 = new Date(event1.start);
            let date2 = new Date(event2.start);
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
            if (event1.course_year === event2.course_year && areOnSameDay(event1, event2)) {
                return 8;
            }

            if(event1.title === event2.title) {
                let date1 = new Date(event1.start)
                let date2 = new Date(event2.start)
                let diff = (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)
                if(Math.abs(diff) < 14) {
                    return 4;
                }
            }

            if (event1.course_year !== event2.course_year && areOverlapping(event1, event2)) {
                return 3;
            }

            if (event1.course_year !== event2.course_year && areOnSameDay(event1, event2)) {
                return 1;
            }
            return 0;
        }

        // Funzione che calcola il peso totale per una configurazione
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

            //console.log(currentState)
        
            for (let event of currentState) {
                // Creiamo una copia profonda dello stato attuale
                let newState1 = JSON.parse(JSON.stringify(currentState));
                let newState2 = JSON.parse(JSON.stringify(currentState));
        
                // Troviamo l'evento corrispondente nella nuova copia
                let eventCopy1 = newState1.find(e => e.appello_id === event.appello_id); // Usa un identificativo unico
                //console.log(eventCopy1)
                let eventCopy2 = newState2.find(e => e.appello_id === event.appello_id);
        
                // Prima configurazione: mantiene la data originale
                eventCopy1.start = event.start;
                eventCopy1.end = event.end;
        
                // Seconda configurazione: cambia alla seconda data disponibile
                eventCopy2.start = event.start_2;
                eventCopy2.end = event.end_2;
        
                // Aggiungiamo entrambe le nuove configurazioni agli stati vicini
                neighbors.push(newState1);
                neighbors.push(newState2);
            }
        
            return neighbors;
        }
        
        

        // Algoritmo di ottimizzazione con controllo di stallo
        function dijkstraOptimization(initialState) {
            let queue = [{ state: initialState, weight: calculateTotalWeight(initialState) }];
            let visited = new Set();
            let bestStates = [];
            //let bestWeights = [];
            let minWeight = Infinity;

            let noImprovementCount = 0; // Numero di tentativi senza miglioramento
            let maxNoImprovementCount = 50; // Numero massimo di tentativi senza miglioramenti
            let previousWeight = Infinity; // Variabile per il miglior peso globale

            let iteration = 0;

            while (queue.length > 0) {
                //console.log(queue.length)
                // Ordina la coda per peso (stato con il peso più basso prima)
                if (queue.length > 1) {
                    queue.sort((a, b) => a.weight - b.weight);
                }

                let { state, weight } = queue.shift();

                if(weight < minWeight) {
                    minWeight = weight;
                    bestStates = [state];  //Resetta la lista con il nuovo minimo
                } else if(weight === minWeight) {
                    bestStates.push(state)  //Aggiunge un'altra ottimizzazione con lo stesso peso
                }

                console.log(weight + " e "+ previousWeight)
                // Controlla se il peso è migliorato rispetto al miglior peso globale
                if (weight != previousWeight) {
                    previousWeight = weight;
                    noImprovementCount = 0; // Reset del contatore
                } else {
                    noImprovementCount++;
                }

                // Se il numero massimo di tentativi senza miglioramenti è stato raggiunto, fermiamo
                if (noImprovementCount >= maxNoImprovementCount) {
                    console.log("Interrotto: nessun cambiamento dopo " + maxNoImprovementCount + " tentativi");
                    break;
                }

                // Crea una chiave unica per ogni configurazione
                let stateKey = `${state.map(e => e.title).join('-')}-${state.map(e => e.start).join('-')}`;

                iteration++;

                // Verifica se lo stato è già stato visitato
                if (visited.has(stateKey)) {
                    console.log("continue")
                    continue;
                }
                visited.add(stateKey);

                // // Salva i migliori stati
                // if (bestStates.length < 2) {
                //     bestStates.push(state);
                //     bestWeights.push(weight);
                // } else {
                //     if (weight < bestWeights[1]) {
                //         if (weight < bestWeights[0]) {
                //             bestStates[1] = bestStates[0];
                //             bestWeights[1] = bestWeights[0];
                //             bestStates[0] = state;
                //             bestWeights[0] = weight;
                //         } else {
                //             bestStates[1] = state;
                //             bestWeights[1] = weight;
                //         }
                //     }
                // }

                

                // Genera i vicini dello stato corrente
                let neighbors = generateNeighbors(state);

                for (let neighbor of neighbors) {
                    let neighborWeight = calculateTotalWeight(neighbor);
                    let neighborKey = `${neighbor.map(e => e.title).join('-')}-${neighbor.map(e => e.start).join('-')}`;

                    if (!visited.has(neighborKey)) {
                        queue.push({ state: neighbor, weight: neighborWeight });
                    }
                }
                //iteration++;
                console.log("iteration: "+iteration)
            }

            // Restituisce tutte le ottimizzazioni con il peso minimo
            return bestStates;
        }


        // Ottimizza gli eventi
        let optimizedStates = dijkstraOptimization(events);
        //console.log(optimizedStates[0])

        // Salva le ottimizzazioni nei bottoni
        // if (option === 1) {
        //     return optimizedStates[0]; // Restituisce la miglior ottimizzazione
        // } else {
        //     return optimizedStates[1]; // Restituisce la seconda miglior ottimizzazione
        // }

        this.updateDropdown(optimizedStates)
        this.updateCalendar(optimizedStates[0])
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
            height: window.outerWidth < 768 ? 'auto' : '85vh',
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
                //center: 'applica',
                //right: 'optimize,optimize_2'
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
                if(document.getElementById("info-section").style.display === "block")
                    this.view.showInfo(info.event)

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

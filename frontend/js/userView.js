export class UserView {

    constructor() {
        this.navbar = document.getElementById("navbar")

        this.loginSection = document.getElementById("login-section")
        this.loginForm = document.getElementById("loginForm")
        this.logoutSection = document.getElementById("logout-section")
        this.logoutButton = document.getElementById("logout-btn")
        this.calendarSection = document.getElementById("calendar-section")
        
        this.infoSection = document.getElementById("info-section")
        this.nomeCorso = document.getElementById("corso")
        this.annoCorso = document.getElementById("anno")
        this.prof = document.getElementById("prof")
        this.email = document.getElementById("email_prof")
        this.inizio = document.getElementById("inizio")
        this.fine = document.getElementById("fine")
        this.note_section = document.getElementById("note-section")
        this.note = document.getElementById("note")
        this.applicaModifiche = document.getElementById("applica-modifiche-btn")

        this.optimizeSection = document.getElementById("optimize-section")
    }

    showLogin() {
        this.loginSection.style.display = "block"
        this.navbar.style.display = "none"
        this.calendarSection.style.display = "none"
        //this.logoutSection.style.display = "none"
        //this.hideInfo()
        this.calendarSection.classList.remove("col-lg-8")
        this.calendarSection.classList.add("col-lg-12")
        this.infoSection.style.display = "none"
        this.optimizeSection.style.display ="none"
    }

    showCalendar() {
        this.loginSection.style.display = "none"
        this.navbar.style.display = "block"
        this.calendarSection.style.display = "block"
        this.optimizeSection.style.display = "block"     
        //this.logoutSection.style.display = "block"
        //calendarColumn.classList.remove("col-lg-8");
        //calendarColumn.classList.add("col-lg-12");
        //this.initializeCalendar();
    }

    showInfo(appello, presenter) {
        this.nomeCorso.innerText = appello.title
        this.annoCorso.innerText = appello.extendedProps.course_year+"°"
        this.prof.innerText = appello.extendedProps.prof
        this.email.innerText = appello.extendedProps.email
        this.inizio.value = appello.startStr.slice(0, -9) //rimuovo gli ultimi 9 caratteri: 2025-01-09T8:30:00+01:00 --> 2025-01-09T8:30
        this.fine.value = appello.endStr.slice(0, -9)

        let note = appello.extendedProps.opz_agg
        if(note.agg == "true") {
            this.note_section.style.display = "block"
            this.note.innerHTML = note.info
        } else {
            this.note_section.style.display = "none"
        }

        $("#inizio").flatpickr({
            time_24hr: true,
            minuteIncrement: 30,
            dateFormat: "Y-m-dTH:i",
            enableTime: true,
            disableMobile: true,
            defaultDate: this.inizio.value
        })

        $("#inizio").change((event) => {
            this.applicaModifiche.disabled = false
        })

        $("#fine").flatpickr({
            time_24hr: true,
            minuteIncrement: 30,
            dateFormat: "Y-m-dTH:i",
            enableTime: true,
            disableMobile: true,
            defaultDate: this.fine.value
        })

        $("#fine").change((event) => {
            this.applicaModifiche.disabled = false
        })

        $("#applica-modifiche-btn").click((event) => {   
            if(this.inizio.value < this.fine.value) {
                presenter.setDates(appello, this.inizio.value, this.fine.value)
                //appello.setDates(this.inizio.value, this.fine.value)
                this.applicaModifiche.disabled = true
            } else {
                console.log("errore")
            }     
        })

        this.calendarSection.classList.remove("col-lg-12")
        this.calendarSection.classList.add("col-lg-8")
        this.infoSection.style.display = "block"
        window.calendar.render()
    }

    hideInfo() {
        this.calendarSection.classList.remove("col-lg-8");
        this.calendarSection.classList.add("col-lg-12");
        this.infoSection.style.display = "none";
        this.applicaModifiche.disabled = true
        console.log(window.calendar)
        if(window.calendar !== null) 
            window.calendar.render()
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

        $("#hide-info-btn").click(function (event) {
            presenter.view.hideInfo()
        })

        $("#ottimizza").click(function (event) {
            presenter.applyOptimizedEvents(1)
            document.getElementById("conferma").removeAttribute("disabled")
        }) 

        $("#conferma").click(function (event) {
            presenter.updateDatabase()
        })

        

        flatpickr.localize(flatpickr.l10ns.it)

    }
}
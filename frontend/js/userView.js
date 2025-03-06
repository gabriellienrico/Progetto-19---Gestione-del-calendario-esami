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
        //this.initializeCalendar();
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
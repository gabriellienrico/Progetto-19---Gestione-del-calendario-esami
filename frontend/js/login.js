//let loginBtn = "#login"

const apiBaseUrl = "http://localhost:8080"

function appendContent(tag, filename) {
    var content = $.ajax({
        url: filename,
        async: false,
    }).responseText
    $(tag).append(content)
}

// Poi usa appendContent nel resto del codice


function checkLogin() {
    $.ajax({
        url: `${apiBaseUrl}/login`,
        type: "POST",
        dataType: "json",
        data: {
            email: $("#email").val(),
            password: $("#password").val(),
        },
        success: function (res) {
            console.log(res)
            if(res.logged_in) {
                $("main").empty()
                appendContent("main", "html/products-table-view.html")
                appendContent("main", "html/reduce-product-view.html")
                //removeContent("main", "html/login.html")
                
                
            } else
                $('#prova').text("Nome utente o password errati").show()
        },
        error: function (err, status) {
            console.error(err + ":" + err.message)
            $("#prova").text('Errore di connessione al server').show()
            alert(status + ": " + err.responseText)
        },
    })
}


$(document).ready(function () {
    $('#loginForm').submit(function (event) {
        event.preventDefault()
        if(!this.checkValidity()) {
            event.stopPropagation()
        } else {
            checkLogin()
        }
        this.classList.add('was-validated')
    })
})

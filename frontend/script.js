

$(document).ready(function () {
    function appendContent(tag, filename) {
        var content = $.ajax({
            url: filename,
            async: false,
        }).responseText
        $(tag).append(content)
    }

    // Eseguiamo una richiesta AJAX per verificare se la sessione è attiva
    $.ajax({
        url: 'http://localhost:8080/session',  // Il file PHP che verifica la sessione
        type: 'GET',
        dataType: 'json',  // Risposta in formato JSON
        xhrFields: {
            withCredentials: true  // Assicura che i cookie di sessione vengano inviati
        },
        success: function (res) {
            if (res.logged_in) {
                // Se la risposta indica che l'utente è loggato
                console.log('Utente loggato');
                appendContent("main", "html/products-table-view.html")
                appendContent("main", "html/reduce-product-view.html")
                
                // Puoi fare qualsiasi altra operazione, ad esempio mostrare contenuti protetti
            } else {
                console.log('Utente non loggato');
                // Se la risposta indica che l'utente non è loggato
                appendContent("main", "html/login.html")
                // Redirigi alla pagina di login, ad esempio:
                //window.location.href = 'login.php';
            }
        },
        error: function () {
            console.log('Errore nella comunicazione con il server.');
        }
    });
});




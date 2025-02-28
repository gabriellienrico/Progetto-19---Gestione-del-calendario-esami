<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");  // Permette i cookie cross-origin

class SessionGateway extends Gateway
{
    public function handle_request($parts)
    {
        // echo $parts;
        if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
            http_response_code(204);
            exit();
            // /users/login
        } else if ($_SERVER["REQUEST_METHOD"] === "GET") {

            // Verifica se la variabile di sessione 'user' è settata
            if (isset($_SESSION['user'])) { 
                // Se la sessione è attiva, restituisci un messaggio di successo
                echo json_encode([
                    'logged_in' => true, 
                    'user' => $_SESSION['user']
                ]);
            } else {
                // Se la sessione non è attiva, restituisci un messaggio di errore
                echo json_encode([
                    'logged_in' => false
                ]);
            }
        }
    }
}

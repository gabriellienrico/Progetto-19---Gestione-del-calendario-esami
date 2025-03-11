<?php
ob_start();
if(session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");  // Permette i cookie cross-origin
header("Cache-Control: no-cache, must-revalidate");  // HTTP/1.1
header("Pragma: no-cache");  // HTTP/1.0
header("Expires: 0");

require_once "database/DBConnectionFactory.php";


class SessionGateway extends Gateway
{
    public function handle_request($parts){
        // echo $parts;
        switch(count($parts)) {
            
        case 1: 
            if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
                http_response_code(204);
                exit();
                // /users/login
            } else if ($_SERVER["REQUEST_METHOD"] === "GET") {
                // Verifica se la variabile di sessione 'user' è settata
                if (!isset($_SESSION['user'])) { 
                    echo json_encode([
                        'logged_in' => false,
                        'user' => "Not set"
                    ]);
                } else {
                    // Se la sessione è attiva, restituisci un messaggio di successo
                    echo json_encode([
                        'logged_in' => true, 
                        'user' => $_SESSION['user']['id'],
                        'role' => $_SESSION['user']['ruolo']
                    ]);
                } 
                // else {
                //     // Se la sessione non è attiva, restituisci un messaggio di errore
                //     echo json_encode([
                //         'logged_in' => false,
                //         'user' => "Guest"
                //     ]);
                // }
            }
            break;

        case 2: 
            if($parts[1] == "login") {
                if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
                    http_response_code(204);
                    exit();
                    // /users/login
                } else if ($_SERVER["REQUEST_METHOD"] === "POST") {
                    

                    if (!isset($_POST['email'], $_POST['password'])) { 
                        echo json_encode([
                            'success' => false,
                            'logged_in' => false,
                            'error' => 'Dati mancanti'
                        ]);
                        exit();
                    }

                    $email = $_POST['email'];
                    $password = $_POST['password'];

                    $db = DBConnectionFactory::getFactory();
                    $sql = "SELECT * FROM utenti WHERE email = ?";

                    $data = $db->fetchAll($sql, [$email]);


                    if(!empty($data)) { 
                        $user = $data[0];
                        if(password_verify($password, $user["password"])) { 
                            //Password corretta, salvo l'utente nella sessione
                            unset($user['password']);
                            $_SESSION['user'] = $user;

                            echo json_encode([
                                'success' => true,
                                'logged_in' => true,
                                'user' => $_SESSION['user']
                            ]);
                            exit();
                        }
                    }
        
                    // foreach($data as $user) {
                    //     if ($user["email"] === $email) {
                    //         //utente trovato
                    //         if(password_verify($password, $user["password"])) {
                    //             //password corretta
                    //             unset($user["password"]);
                    //             $_SESSION["user"] = $user["id"];
                    //             //header("Location: ../frontend/index.html");  //reindirizzamento flusso
                    //             header("Content-Type: application/json");
                    //             echo json_encode([
                    //                 'success' => true,
                    //                 'logged_in' => true,
                    //                 'user' => $_SESSION['user']
                    //             ]);
                        
                    //             exit();
                    //         } 
                    //         // else {
                    //         //     //password errata
                    //         //     echo json_encode([
                    //         //         'success'=> false,
                    //         //         'logged_in' => false,
                    //         //         'error' => 'Password errata'
                    //         //     ]);
                    //         //     exit();
                    //         // }
                    //     } 
                    //     // else {
                    //     //     //utente non trovato
                    //     //     echo json_encode([
                    //     //         'success'=> false,
                    //     //         'logged_in' => false,
                    //     //         'error' => 'Utente non trovato'
                    //     //     ]);
                    //     //     exit();
                    //     // }
                    // }
                    echo json_encode([
                        'success'=> false,
                        'logged_in' => false,
                        'error' => 'Utente non trovato'
                    ]);
                    exit();
                }
            } else if($parts[1] == "logout") {
                if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
                    http_response_code(204);
                    exit();
                    // /users/login
                } else if ($_SERVER["REQUEST_METHOD"] === "GET") {
                    //$_SESSION['user'] = null;
                    //session_start();
                    session_destroy();
                    echo json_encode([
                        'success' => true,
                        'logged_in' => false
                    ]);
                }
                
            }
            break;

        }
    }
}

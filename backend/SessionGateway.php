<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");  // Permette i cookie cross-origin
header("Cache-Control: no-cache, must-revalidate");  // HTTP/1.1
header("Pragma: no-cache");  // HTTP/1.0
header("Expires: 0");

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
                if ($_SESSION['user'] == null) { 
                    echo json_encode([
                        'logged_in' => false,
                        'user' => "Not set"
                    ]);
                } else if ($_SESSION["user"] != "Guest") {
                    // Se la sessione è attiva, restituisci un messaggio di successo
                    echo json_encode([
                        'logged_in' => true, 
                        'user' => $_SESSION['user']
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
        
                    $email = $_POST['email'];
                    $password = $_POST['password'];
        
                    $file_path = "json/users.json";
        
                    if (!file_exists($file_path)) {
                        http_response_code(500);
                        echo json_encode(array(
                            "success" => false,
                            "error" => array(
                                "code" => 500,
                                "message" => "File not found"
                            )
                        ));
                        exit();
                    } 
        
                    $data = json_decode(file_get_contents($file_path), true);
        
                    foreach($data as $user) {
                        if ($user["email"] === $email) {
                            //utente trovato
                            if(password_verify($password, $user["password"])) {
                                //password corretta
                                unset($user["password"]);
                                $_SESSION["user"] = $user["id"];
                                //header("Location: ../frontend/index.html");  //reindirizzamento flusso
                                header("Content-Type: application/json");
                                echo json_encode([
                                    'success' => true,
                                    'logged_in' => true,
                                    'user' => $_SESSION['user']
                                ]);
                                exit();
                            } else {
                                //password errata
                                echo json_encode([
                                    'success'=> false,
                                    'logged_in' => false,
                                    'error' => 'Password errata'
                                ]);
                                exit();
                            }
                        } else {
                            //utente non trovato
                            echo json_encode([
                                'success'=> false,
                                'logged_in' => false,
                                'error' => 'Utente non trovato'
                            ]);
                            exit();
                        }
                    }
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

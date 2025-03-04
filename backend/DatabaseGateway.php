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

class DatabaseGateway extends Gateway
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
            if($parts[1] == "queryAppelli") {
                if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
                    http_response_code(204);
                    exit();
                    // /users/login
                } else if ($_SERVER["REQUEST_METHOD"] === "POST") {

                    $db = DBConnectionFactory::getFactory();
                    $sql = "SELECT * FROM appelli";

                    $appelli = $db->fetchAll($sql);
                    
                    // $app_json = $appelli->fetch_assoc();
                    // $app_json = $appelli->fetch_assoc();
                    //$app_json[] = $appelli->toArray();
                    // foreach($appelli as $appello) {
                    //     $app_json[] = $appello->toArray();
                    //     //$app_json .= json_encode($appello);
                    //     //$app_json .= ",";
                    // }  
                    
                    // foreach($appelli as $appello) {
                    //     $app_json[] = $appello->toArray();
                    //     //$app_json .= json_encode($appello);
                    // }  
                    
                    // $content = json_encode( array(
                    //     'success' => true,
                    //     'appelli' => $app_json
                    // ));
                    //$content .= ",";
                    
                    // $events = array_map(function($appello) {
                    //     $date = DateTime::createFromFormat('m/d/Y', $appello['date_opt']);
                    //     $date->format('Y-m-d\TH:i:s');
                    //     return [
                    //         'id' => $appello['id'],
                    //         'title' => $appello['course_name'],
                    //         'start' => $date,
                    //         'course_year' => $appello['course_year']
                    //     ];
                    // }, $appelli);

                    header("Content-Type: application/json");
                    //echo json_encode($appelli);
                    echo json_encode(array(
                        'success' => true,
                        'events' => $appelli
                    ));
                }
            } 
            break;
                
        default: 
            http_response_code(400);
            echo json_encode(array(
                "success" => false,
                "error" => array(
                    "code" => 400,
                    "message" => "Bad request"
                )
            ));
        }
    }
}

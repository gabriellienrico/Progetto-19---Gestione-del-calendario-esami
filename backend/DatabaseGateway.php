<?php
ob_start();
if (session_status() === PHP_SESSION_NONE) {
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


    public function handle_request($parts)
    {
        // echo $parts;
        switch (count($parts)) {

            case 1:
                http_response_code(400);
                echo json_encode(array(
                    "success" => false,
                    "error" => array(
                        "code" => 400,
                        "message" => "Bad request"
                    )
                ));
                break;

            case 2:
                if ($parts[1] == "queryAppelli") {
                    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
                        http_response_code(204);
                        exit();
                        // /users/login
                    } else if ($_SERVER["REQUEST_METHOD"] === "POST") {

                        $db = DBConnectionFactory::getFactory();
                        $sql = "SELECT * FROM appelli";

                        $appelli = $db->fetchAll($sql);

                        header("Content-Type: application/json");
                        //echo json_encode($appelli);
                        echo json_encode(array(
                            'success' => true,
                            'events' => $appelli
                        ));
                    }
                } else if ($parts[1] == "queryCorso") {
                    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
                        http_response_code(204);
                        exit();
                        // /users/login
                    } else if ($_SERVER["REQUEST_METHOD"] === "POST") {

                        $id = $_POST['id'];

                        $db = DBConnectionFactory::getFactory();
                        $sql = "SELECT * FROM corsi WHERE id = $id";

                        $corso = $db->fetchAll($sql);

                        header("Content-Type: application/json");
                        //echo json_encode($appelli);
                        echo json_encode(array(
                            'success' => true,
                            'corso' => $corso
                        ));
                    }
                } else if ($parts[1] == "queryProf") {
                    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
                        http_response_code(204);
                        exit();
                        // /users/login
                    } else if ($_SERVER["REQUEST_METHOD"] === "POST") {

                        $id = $_POST['id'];

                        $db = DBConnectionFactory::getFactory();
                        $sql = "SELECT * FROM utenti WHERE id = $id";

                        $user = $db->fetchAll($sql);

                        header("Content-Type: application/json");
                        //echo json_encode($appelli);
                        echo json_encode(array(
                            'success' => true,
                            'user' => $user
                        ));
                    }
                } else if ($parts[1] == "putAppelli") {
                    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
                        http_response_code(204);
                        exit();
                        // /users/login
                    } else if ($_SERVER["REQUEST_METHOD"] === "POST") {

                        //$data = json_decode($_POST['events']);
                        $events = json_decode($_POST['events'], true);
                        file_put_contents("debug.log", print_r($_POST, true));

                        file_put_contents("debug.log", print_r($events, true));

                        if (isset($events) && is_array($events)) {
                            $db = DBConnectionFactory::getFactory();
                            foreach ($events as $event) {
                                
                                // Estrapola la data e l'orario di start e end
                                $startDate = substr($event['start'], 0, 10);  // "2025-03-12"
                                $startTime = substr($event['start'], 11);     // "08:00"

                                $endTime = substr($event['end'], 11);         // "10:00"

                                // Query per aggiornare i dati
                                $sql = "UPDATE appelli
                                        SET opz_1 = JSON_SET(opz_1, '$.data', ?, '$.orario_inizio', ?, '$.orario_fine', ?)
                                        WHERE id = ?";

                                // Parametri da passare alla query
                                $params = [
                                    $startDate, // start data
                                    $startTime, // orario_inizio
                                    $endTime,   // orario_fine
                                    $event['id']     // id dell'evento
                                ];

                                $affectedRows = $db->update($sql, $params);
                            }
                            $db->close();

                            header("Content-Type: application/json");
                            //echo json_encode($appelli);
                            echo json_encode(array(
                                'success' => true,
                                'aff' => $affectedRows
                            ));
                        } else {
                            header("Content-Type: application/json");
                            //echo json_encode($appelli);
                            echo json_encode(array(
                                'success' => false,
                                'message' => 'Dati non validi'
                            ));
                        }
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
                break;
        }
    }
}

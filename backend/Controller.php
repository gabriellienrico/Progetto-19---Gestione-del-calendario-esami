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

class Controller
{
    private $api = "";
    public function set_api($api)
    {
        $this->api = $api;
    }
    public function handle_request()
    {

        $uri = preg_replace("/^" . preg_quote($this->api, "/") . "/", "", $_SERVER['REQUEST_URI']);

        $uri = preg_replace('/\\/$/', "", $uri);

        $parts = explode("/", $uri);

        switch ($parts[0]) {
            case "session":
                $gateway = new SessionGateway();
                break;
            case "db":
                $gateway = new DatabaseGateway();
                break;
            default:
            http_response_code(404);
            echo json_encode(array(
                "success" => false,
                "error" => array(
                    "code" => 404,
                    "message" => "Not found"
                )
            ));
            exit();
        }
        try {
            $gateway->handle_request($parts);
        } catch (Exception $e) {
            var_dump($e);
            // ErrorHandler::missingGateway();
            return;
        }
    }
}

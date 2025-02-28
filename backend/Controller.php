<?php
session_start();

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
        # [user, login]
        $uri = preg_replace('/\\/$/', "", $uri);

        $parts = explode("/", $uri);

        # api/users/login
        # api/ordini/
        switch ($parts[0]) {
            case "storage":
                $gateway = new StorageGateway();
                break;
            case "session":
                $gateway = new SessionGateway();
                break;
            case "login":
                $gateway = new UserGateway();
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

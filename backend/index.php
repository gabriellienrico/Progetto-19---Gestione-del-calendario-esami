<?php
# http://my-server.com:8080/users/login

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

spl_autoload_register(
    function ($class) {
        require __DIR__ . DIRECTORY_SEPARATOR . "$class.php";
    }
);

$api = str_replace("index.php", "", $_SERVER['SCRIPT_NAME']);

$controller = new Controller;
$controller->set_api($api);
$controller->handle_request();
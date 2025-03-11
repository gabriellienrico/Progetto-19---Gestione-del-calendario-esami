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
abstract class Gateway {
    abstract public function handle_request($parts);
}

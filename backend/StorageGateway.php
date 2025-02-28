<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS, PUT");

session_start();

class StorageGateway extends Gateway 
{
    public function handle_request($parts)
    {
        // echo $parts;
        if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
            http_response_code(204);
            exit();
        } else if ($_SERVER["REQUEST_METHOD"] === "GET") {
            if (count($parts) == 2) {
                // storage/products
                if ($parts[1] == "products") {
                    $file_path = "products.json";
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

                    // Aggiunta di nuovi campi al JSON
                    foreach ($data as &$product) {
                        $product["stock_status"] = $product["quantity"] > 0 ? "In Stock" : "Out of Stock";
                        $product["total_value"] = $product["price-piece"] * $product["quantity"];
                    }

                    echo json_encode(array(
                        "success" => true,
                        "products" => $data
                    ));


                    exit();
                } else {
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
            } elseif (count($parts) == 3) {
                // storage/products/categories
                if ($parts[1] == "products" && $parts[2] == "categories") {
                    $file_path = "products.json";
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
                    $categories = array();

                    // Estrae le categorie uniche
                    foreach ($data as $product) {
                        if (!in_array($product["category"], $categories)) {
                            $categories[] = $product["category"];
                        }
                    }

                    echo json_encode(array(
                        "success" => true,
                        "categories" => $categories
                    ));
                    exit();
                } else {
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
            } else {
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
        } else if ($_SERVER["REQUEST_METHOD"] === "PUT") {
            // update count of product by given id, uri: storage/products/decrease
            // read from request body
            if ($parts[1] == "products" && $parts[2] == "decrease") {

                $data = json_decode(file_get_contents("php://input"), true);
                $id = $data["product_id"];
                $file_path = "products.json";
                if (!file_exists($file_path)) {
                    http_response_code(500);
                }
                $data = json_decode(file_get_contents($file_path), true);
                $found = false;
                foreach ($data as &$product) {
                    if ($product["id"] == $id) {
                        $product["quantity"]--;
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    http_response_code(404);
                    echo json_encode(array(
                        "success" => false,
                        "error" => array(
                            "code" => 404,
                            "message" => "Product not found"
                        )
                    ));
                    exit();
                }
                if (file_put_contents($file_path, json_encode($data))) {
                    echo json_encode(array(
                        "success" => true,
                        "message" => "Product updated"
                    ));
                } else {
                    http_response_code(500);
                    echo json_encode(array(
                        "success" => false,
                        "error" => array(
                            "code" => 500,
                            "message" => "Internal server error"
                        )
                    ));
                }
                exit();
            } else {
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
        }
    }
}

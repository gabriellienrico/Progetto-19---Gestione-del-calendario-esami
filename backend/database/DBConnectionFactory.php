<?php

class DBConnectionFactory {

    private static $factory;
    public static function getFactory() {
        if(!self::$factory) {
            self::$factory = new DBConnectionFactory();
            self::$factory->host = getenv("MYSQL_HOST");
            self::$factory->username = getenv("MYSQL_USER");
            self::$factory->password = getenv("MYSQL_PASSWORD");
            self::$factory->dbname = getenv("MYSQL_DATABASE");
            self::$factory->connection = null;
        }
        return self::$factory;
    }

    private $host;
    private $username;
    private $password;
    private $dbname;
    private $connection;

    // public function __construct() {
    //     $this->host = getenv('MYSQL_HOST');
    //     $this->username = getenv('MYSQL_USER');
    //     $this->password = getenv('MYSQL_PASSWORD');
    //     $this->dbname = getenv('MYSQL_DATABASE');

    //     $this->connect();
    // }

    private function connect() {
        if($this->connection === null) 
            $this->connection = new mysqli($this->host, $this->username, $this->password, $this->dbname);

        if($this->connection->connect_error) {
            die("Connection failed: " . $this->connection->connect_error);
        }

        return $this->connection;
    }

    public function close() {
        if($this->connection !== null) {
            $this->connection->close();
            $this->connection = null;
        }
    }

    public function query($sql, $params = []) {
        $this->connect();
        $stmt = $this->connection->prepare($sql);

        if($params) {
            $types = str_repeat('s', count($params));
            $stmt->bind_param($types, ...$params);
        }

        $stmt->execute();
    
        return $stmt;
    }

    // Funzione per eseguire query di tipo UPDATE
    public function update($sql, $params = []) {
        $stmt = $this->query($sql, $params);
        $affectedRows = $stmt->affected_rows;
        $stmt->close();
        return $affectedRows;
    }

    public function fetchAll($sql) {
        $stmt = $this->query($sql);
        $result = $stmt->get_result();
        $rows = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $rows;
    }

    
}
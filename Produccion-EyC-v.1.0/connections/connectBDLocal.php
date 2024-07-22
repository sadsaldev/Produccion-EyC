<?php

function connectBDLocal(){

    $dbase2 = 'bd_eje_cafetero';
    $user2 = 'rooteje';
    $pass2 = '12345';
    $dsn2 = 'mysql:dbname=' . $dbase2 . ';host=localhost';

    try {
        $link = new PDO($dsn2, $user2, $pass2);
        $link->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $link;
    } catch (PDOException $e) {
        echo "Error de conexión a DB." . $e->getMessage();
    }
}

?>
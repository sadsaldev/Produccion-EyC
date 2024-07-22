<?php

function connectGDW(){
    $host1 = '35.224.245.236';
    $dbase1 = 'almacen_ggt_705';
    $user1 = 'almacen_ggt_705';
    $pass1 = '1f7128122fa6a78dbc5d14d133853c7e';
    $dsn1 = 'mysql:host=' . $host1 . ';dbname=' . $dbase1;

    try {
        $link = new PDO($dsn1, $user1, $pass1);
        return $link;
        
    } catch (PDOException $e) {
            echo "Error de conexión a DB." . $e->getMessage();
    }
}
        
?>
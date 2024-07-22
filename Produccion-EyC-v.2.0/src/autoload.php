<?php

spl_autoload_register(function ($class_name) {

    $prefix = 'App\\';
    $base_dir = __DIR__ . '/classes/';
    $len = strlen($prefix);
    if(strncmp($prefix, $class_name, $len) !== 0){
        return;
    }

    $relative_class = substr($class_name, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if($class_name === 'App\\updateuser'){
        echo "Intentando cargar la clase: $class_name\n";
        echo "Esperando encontrar el archivo en: $file\n";
    }

    if (file_exists($file)) {
        require_once $file;
        if ($class_name === 'App\\updateuser') {
            echo "Clase cargada correctamente desde $file\n";
        }
    } else {
        if ($class_name === 'App\\updateuser') {
            echo "Archivo no encontrado: $file\n";
        }
    }
});

?>
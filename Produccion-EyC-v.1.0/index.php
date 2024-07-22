<?php

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Producción | E&C</title>
    <link rel="stylesheet" href="./styles/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="./scripts/main-requests.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body class="structure_m">
    <div class="container-lg">
        <div class="row justify-content-center">
            <div class="col-3">
                <div class="form-container">
                    <form id="formu" method="POST" action="">
                        <div class="form-title">
                            <h1>CONSULTAR <br> INSPECCIONES</h1>
                            <hr>
                        </div>
                        <div class="form-content">
                            <label for="fecha_inicio">Fecha Inicial:</label><br>
                            <input type="date" id="fecha_inicio" name="fecha_inicio" value=""><br>
                            <label for="fecha_final">Fecha Final:</label><br>
                            <input type="date" id="fecha_final" name="fecha_final" value=""><br>
                            <label for="opc">Grupo:</label><br>
                            <select id="opc" name="opc">
                                <option value="" disabled selected>[SELECCIONE]</option>
                                <option value="risaralda">RISARALDA</option>
                                <option value="caldas">CALDAS</option>         
                                <option value="both">TODOS</option>        
                            </select>
                        </div>
                        <div class="submit-buttons">
                            <button class="download" name="excel"><img src="">Descargar Excel</button>
                            <button class="update" name="enviof"><img src="">Ver Inspecciones</button>
                        </div>
                    </form>
                </div>
                
            </div>
            <div class="col-9">
                <div class="table-container">
                    <div class="main-table-container">
                        <div class="index-placeholder">
                            <p class="placeholder-info">
                            Completa la información del formulario para visualizar o exportar las inspecciones realizadas según el rango de fecha y departamento(s) establecidos.
                            </P>
                        </div>
                        <div class="loader-container" style="display:none">
                            <div class="loader"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<script src="./scripts/current-date.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src ="./scripts/toggle-animation.js"></script>
</body>
</html>

<?php 

?>
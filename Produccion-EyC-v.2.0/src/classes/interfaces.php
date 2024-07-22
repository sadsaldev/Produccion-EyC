<?php

namespace App;

session_start();

class interfaces {

    public function queriesPopUp(){
        ?>

        <div class="queries-pop-up-container">
            <div class='queries-pop-up'>
                <div class='queries-pop-up-options'>
                <?php if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token'])){ ?>
                    <div class="queries-options-menu">
                        <div class="search-inspec-father">
                            <img class="search-inspections-img" src="assets/img/search-inspections.svg">
                            <p id='search-inspections'>Consultar Inspecciones</p>
                        </div>
                        <div class="search-inspec-child-1" style="display:none;">
                            <img class="search-efective-img" src="assets/img/white-check.svg">   
                            <p id='search-efective'>Efectivas</p>
                        </div>
                        <div class="new-networks-father">
                            <img class="generate-rn-img" src="assets/img/new-networks.svg">
                            <p id='generate-rn'>Generar Comité Redes Nuevas</p>
                        </div>
                    </div>
                    <?php } else { ?>
                        <p id='queries-placeholder'>Inicia sesión o regístrate para poder acceder a la sección de Consultas.</p>
                        <div class="placeholder-popup-img"><img src="assets/img/info-icon-blue.png" alt="Info Icon"/></div>
                    <?php } ?>
                </div>
            </div>
        </div>

        <?php
    }

    public function queriesIndex(){
        ?>
        <div class="queries-section"> 
            <section class="row align-items-center">
                <div class="col-md-3">
                    <div class="queries-viewer-container">
                        <div class="viewer-header">
                            <h2>Consultar Inspecciones</h2>
                        </div>
                        <div class="queries-form-father"> 
                            <div class="queries-form-container-grid">
                                <div class="queries-form-container">
                                    <form id="formu" method="POST" action="" class="queries-form">
                                        <label for="fecha_inicio"><p class="first-element-queries-form">Fecha Inicial:</p></label>
                                        <input type="date" id="fecha_inicio" name="fecha_inicio" value="" class="form-control initialdate current-date">
                                        <label for="fecha_final"><p>Fecha Final:</p></label>
                                        <input type="date" id="fecha_final" name="fecha_final" value="" class="form-control finaldate current-date">
                                        <label for="opc"><p>Grupo:</p></label>
                                        <select id="opc" name="opc" class="form-select">
                                            <option value="INSP-RIS" selected>Risaralda</option>
                                            <option value="INSP-CALDAS">Caldas</option>         
                                            <option value="both">Todos</option>        
                                        </select>
                                    </form>
                                </div>
                                <div class="submit-queries-form-buttons">
                                    <?php if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token'])){
                                            echo '<button id="download" name="excel" class="downloadexcel">Descargar Excel</button>';
                                            echo '<button id="update" name="enviof" class="viewinspections">Visualizar Tabla</button>';
                                        } else {
                                            echo '<button class="downloadexcel" disabled>Descargar Excel</button>';
                                            echo '<button class="viewinspections" disabled>Visualizar Tabla</button>';
                                        }
                                    ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="table-container">
                        <div class="index-placeholder">
                            <div class="placeholder-img"><img src="assets/img/info-icon-blue.png" alt="Info Icon"/></div>
                            <div class="placeholder-info">
                                <?php
                                    if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){
                                        echo '<p>Completa la información solicitada en el formulario para visualizar o exportar en formato de Excel las inspecciones realizadas según el rango de fecha y departamento(s) establecidos.</p>';
                                    } else {
                                        echo '<p>Inicia Sesión o Regístrate para visualizar o exportar en formato de Excel las inspecciones realizadas según el rango de fecha y departamento(s) establecidos.</p>';
                                    }                                  
                                ?>
                            </div>   
                        </div>
                        <div class="loader-container" style="display:none">
                            <div class="loader"></div>
                        </div>
                        <div class="main-table-container"></div>
                        <div class="grouped-container" style="display:none"></div>
                    </div>
                </div>
            </section>
        </div>

        <?php
    }

    public function networksIndex(){
        ?>
        <div class="networks-section"> 
            <section class="row align-items-center">
                <div class="col-md-3">
                    <div class="input-networks-container">
                        <div class="input-networks-header">
                            <h2>Comité Redes Nuevas</h2>
                        </div>
                        <div class="networks-form-father"> 
                            <div class="networks-form-container-grid">  
                                <div class="networks-table-options">
                                    <div class="options-left">
                                        <img id="add-row" src="assets/img/add.svg" alt="add-row" title="Añadir fila"/>
                                        <img id="delete-row" src="assets/img/minus.svg" alt="delete-row" title="Eliminar fila"/>
                                    </div>
                                    <div class="options-right">
                                        <img id="clear-rows-content" src="assets/img/reload.svg" alt="clear-table" title="Limpiar registros"/>
                                    </div>
                                </div>
                                <div class="networks-form-container">
                                    <form id="form-net" method="POST" action="" class="queries-form">
                                        <div class="networks-input-table-container">
                                            <table class="networks-input-table">
                                                <thead>
                                                    <tr>
                                                        <th><label for="contrato">Contrato</label></th>
                                                        <th><label for="solicitud">Solicitud</label></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><input type="number" id="contrato" name="contrato" value="" class="form-control contract"></td> 
                                                        <td><input type="number" id="solicitud" name="solicitud" value="" class="form-control request"></td>
                                                    </tr>
                                                    <tr>
                                                        <td><input type="number" id="contrato" name="contrato" value="" class="form-control contract"></td> 
                                                        <td><input type="number" id="solicitud" name="solicitud" value="" class="form-control request"></td>
                                                    </tr>
                                                    <tr>
                                                        <td><input type="number" id="contrato" name="contrato" value="" class="form-control contract"></td> 
                                                        <td><input type="number" id="solicitud" name="solicitud" value="" class="form-control request"></td>
                                                    </tr>
                                                    <tr>
                                                        <td><input type="number" id="contrato" name="contrato" value="" class="form-control contract"></td> 
                                                        <td><input type="number" id="solicitud" name="solicitud" value="" class="form-control request"></td>
                                                    </tr>
                                                </tbody>
                                            </table> 
                                        </div>      
                                    </form>
                                </div>
                                <div class="container-fecha-recibido">
                                    <div class="fecha-recibido-label"><label for="fecha_recibido"><p>Fecha de Recibido:</p></label></div>
                                    <div class="fecha-recibido-input"><input type="date" id="fecha_recibido" name="fecha_recibido" value="" class="form-control finaldate current-date"></div>
                                </div> 
                                <div class="submit-networks-form-buttons">
                                    
                                <?php if(isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){ ?>

                                    <button class="export-excel-networks"><img src="assets/img/excel-white.svg" alt="Descargar Excel">Descargar Excel</button>
                                    <button class="view-networks-content">Ver Contenido<img src="assets/img/show-content-white.svg" alt="Ver Contenido"></button>

                                <?php } else { ?>

                                    <button class="export-excel-networks" disabled><img src="assets/img/excel-white.svg" alt="Descargar Excel">Descargar Excel</button>
                                    <button class="view-networks-content" disabled>Ver Contenido<img src="assets/img/show-content-white.svg" alt="Ver Contenido"></button> <?php

                                    } ?>

                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="networks-output-container">
                        <div class="networks-placeholder">
                            <div class="networks-placeholder-img"><img src="assets/img/info-icon-blue.png" alt="Info Icon"/></div>
                            <div class="networks-placeholder-info"> 
                                <?php if(isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){
                                    ?> <p>Completa la información solicitada en el formulario para visualizar o exportar en formato de Excel el Comité para Redes Nuevas.</p> <?php
                                } else {
                                    ?> <p>Inicia sesión o regístrate para visualizar o exportar en formato de Excel el Comité para Redes Nuevas.</p> <?php
                                }
                                    ?>
                            </div>   
                        </div>
                        <div class="loader-container" style="display:none">
                            <div class="loader"></div>
                        </div>
                        <div class="main-networks-output-container"></div>
                    </div>
                </div>
            </section>
        </div>
        <?php
    }

    public function BIboardIndex(){
        ?>
        <div class="bi-section"> 
            <div class="col-md-12">
                <?php
                    if (isset($_SESSION['user_id']) && isset($_SESSION['username']) && isset($_SESSION['session_token']) && isset($_SESSION['role'])){
                        ?><div class="biboard-container"><iframe title="Tablero de Producción" width="80%" height="100%" src="https://app.powerbi.com/view?r=eyJrIjoiM2Y4YjhlYzEtYWQ5ZC00OGIxLWE5MzYtM2YxODBkOGMxZDdiIiwidCI6ImU5YTMxM2RlLTkxMTYtNDFmZS1iYTJjLTk4M2I5NmZlN2M0MyJ9" frameborder="0" allowFullScreen="true"></iframe></div><?php
                    } else {
                        ?> 
                        <div class="bi-temp-placeholder">
                            <div class="bi-temp-img">
                                <img src="assets/img/flask-chemistry-blue.svg" alt="in construction...">
                            </div>
                            <div class="bi-temp-info">
                                <p>Inicia sesión o regístrate para poder ver e interactuar con el tablero de PowerBi que contiene toda la información relacionada a la Producción de la empresa para la sede del Eje Cafetero.</p> 
                            </div>
                        </div>
                    <?php
                    }
                ?>
            </div> 
        </div>

        <?php
    }
}

?>
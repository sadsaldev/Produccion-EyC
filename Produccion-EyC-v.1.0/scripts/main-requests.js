
//Llamada de .ready para que el script se ejecute cuando el DOM esté cargado
$(document).ready(function(){
    
    //Evento de click en back button
    $('.main-table-container').on('click', '#back-to-general', function(e) {
        e.preventDefault();
        //Se llama al loader después de presionar el botón de volver mientras carga el contenido
        $('.loader-container').show();
        //Al hacer click en el botón, se llama a esta función encargada de cargar la tabla principal
        loadMainTable(); 
    });

    //Evento de click en update button
    $('.update').click(function(e){
        e.preventDefault();

        //Mostrar laoder mientras se carga el contenido de la tabla principal
        $('.loader-container').show(); 

        console.log("formulario enviado");
        var fecha_inicio = $('#fecha_inicio').val();
        var fecha_final  = $('#fecha_final').val();
        var opcion       = $('#opc').val();
        console.log("Fecha Inicio:", fecha_inicio);
        console.log("Fecha Final:", fecha_final);
        console.log("Opción:", opcion);

        //Al clickear, se extraen los valores del formulario 
        //Se envían estos valores a main-table.php a través de AJAX
        //El resultado de success se muestra en .main-table-container

        if (fecha_inicio && fecha_final && opcion){
              // Validar que la fecha de inicio no sea mayor que la fecha final
              if (fecha_inicio > fecha_final) {
                console.log('La fecha de inicio es mayor que la fecha final.');
                window.alert('La fecha inicial no puede ser mayor a la fecha final. Por favor seleccione un rango válido.');
                $('.loader-container').hide();
                //Ocultar loader para interrumpir la carga
            } else {
                $.ajax({
                    type: 'POST',
                    url: 'classes/main-table.php',
                    data: {
                        fecha_inicio: fecha_inicio, 
                        fecha_final: fecha_final, 
                        opcion:opcion,
                        ajax: true
                    },
                    dataType: 'html',
                    success: function(response){
                        $('.main-table-container').html(response);
                        $('.loader-container').hide();
                        //Ocultar loader una vez cargado el contenido
                    },
                    error: function(xhr, status, error){
                        console.error(xhr.responseText);
                        $('.loader-container').hide();
                        //Si ocurre un error en la solicitud de AJAX, se interrumpe la carga del contenido
                    }
                });
            }

        } else {
            window.alert("Por favor complete todos los campos del formulario.");
            $('.loader-container').hide();
        }
    });

    //Evento de click en show.grouped-table button
    $('.table-container').on('click', '.show-grouped-table', function(e) {
        e.preventDefault();
        $('.loader-container').show();
        //Mostrar loader mientras se carga la tabla agrupada

        console.log("Mostrar tabla agrupada");
        var fecha_inicio = $('#fecha_inicio').val();
        var fecha_final  = $('#fecha_final').val();
        var opcion       = $('#opc').val();
        console.log("Fecha Inicio:", fecha_inicio);
        console.log("Fecha Final:", fecha_final);
        console.log("Opción:", opcion);

        //Al clickear, se extraen los valores del formulario 
        //Se envían estos valores a grouped-table.php a través de AJAX
        //El resultado de success se muestra en .main-table-container

        $.ajax({
            type: 'POST',
            url: 'classes/grouped-table.php',
            data: {
                fecha_inicio: fecha_inicio, 
                fecha_final: fecha_final, 
                opcion: opcion,
                ajax: true
            },
            dataType: 'html',
            success: function(response){
                $('.main-table-container').html(response);
                $('.loader-container').hide();
                //Ocultar loader una vez cargado el contenido
            },
            error: function(xhr, status, error){
                console.error(xhr.responseText);
                $('.loader-container').hide();
                //Si ocurre un error en la solicitud de AJAX, se interrumpe la carga del contenido
            }
        });
    });

    //Evento de click en show.grouped-table button
    $('.table-container').on('click', '.show-grouped-table2', function(e) {
        e.preventDefault();
        $('.loader-container').show();
        //Mostrar loader mientras se carga la tabla agrupada

        console.log("Mostrar tabla agrupada");
        var fecha_inicio = $('#fecha_inicio').val();
        var fecha_final  = $('#fecha_final').val();
        var opcion       = $('#opc').val();
        console.log("Fecha Inicio:", fecha_inicio);
        console.log("Fecha Final:", fecha_final);
        console.log("Opción:", opcion);

        //Al clickear, se extraen los valores del formulario 
        //Se envían estos valores a grouped-table.php a través de AJAX
        //El resultado de success se muestra en .main-table-container

        $.ajax({
            type: 'POST',
            url: 'classes/grouped-table.php',
            data: {
                fecha_inicio: fecha_inicio, 
                fecha_final: fecha_final, 
                opcion: opcion,
                ajax: true
            },
            dataType: 'html',
            success: function(response){
                $('.main-table-container').html(response);
                $('.loader-container').hide();
                //Ocultar loader una vez cargado el contenido
            },
            error: function(xhr, status, error){
                console.error(xhr.responseText);
                $('.loader-container').hide();
                //Si ocurre un error en la solicitud de AJAX, se interrumpe la carga del contenido
            }
        });
    });

    //Evento de click en download button
    $('.download').click(function(e) {
        e.preventDefault();
        console.log("Descargando Excel");
        var fecha_inicio = $('#fecha_inicio').val();
        var fecha_final  = $('#fecha_final').val();
        var opcion       = $('#opc').val();
        console.log("Fecha Inicio:", fecha_inicio);
        console.log("Fecha Final:", fecha_final);
        console.log("Opción:", opcion);

        //Al clickear se extraen los valores del formulario
        //Se envían estos valores a export-excel.php a través de AJAX
        //La respuesta de success se procesa como un archivo blob 
        //Y se descarga como un archivo excel "inspecciones.xlsx"

        if (fecha_inicio && fecha_final && opcion){
            // Validar que la fecha de inicio no sea mayor que la fecha final
            if (fecha_inicio > fecha_final) {
                console.log('La fecha de inicio es mayor que la fecha final.');
                window.alert('La fecha inicial no puede ser mayor a la fecha final. Por favor seleccione un rango válido.');
            } else {
                $.ajax({
                    type: 'POST',
                    url: 'classes/export-excel.php',
                    data: {
                        fecha_inicio: fecha_inicio, 
                        fecha_final: fecha_final, 
                        opcion: opcion,
                    },
                    xhrFields: {
                        responseType: 'blob'
                    },
                    success: function(response) {
                    
                        if (response instanceof Blob) {
                            var blob = response;
                            var url = window.URL.createObjectURL(blob);
                            var a = document.createElement('a');
                    
                            a.href = url;
                            a.download = 'inspecciones_' + opcion + ' - ' + fecha_inicio + ' - ' + fecha_final + '.xlsx';
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            console.log('Excel descargado exitosamente.');
                        } else {
                            window.alert('No existen inspecciones para exportar dentro del rango de fecha y departamento(s) seleccionados.');
                        }
                    },
                    error: function(xhr, status, error){
                        console.error('Error al descargar Excel. ', xhr.responseText);
                    }
                });
            }
            
        } else {
            window.alert("Por favor complete todos los campos del formulario.");
        }
    });
});


 function loadMainTable(){
    $.ajax({
        type: 'POST',
        url: 'classes/main-table.php',
        data: {
            fecha_inicio: $('#fecha_inicio').val(), 
            fecha_final: $('#fecha_final').val(), 
            opcion: $('#opc').val(),
            ajax: true
        },
        dataType: 'html',
        success: function(response){
            $('.main-table-container').html(response);
        },
        error: function(xhr, status, error){
            console.error(xhr.responseText);
        }
    });
 }

 

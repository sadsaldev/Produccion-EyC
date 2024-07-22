function mainInspectionsAutoloader(){
    var fecha_inicio = $('#fecha_inicio').val();
    var fecha_final  = $('#fecha_final').val();
    var opcion       = $('#opc').val();
    $.ajax({
        url: '../classes/main-table.php',
        type: 'POST',
        data: {
            fecha_inicio: fecha_inicio, 
            fecha_final: fecha_final, 
            opcion: opcion,
            ajax: true
        },
        dataType: 'html',
        success: function(response){
            $('#main-inspections tbody').prepend(response);
            var newCount = $('#main-inspections tbody tr').length;
            $('.query-count').text('El número total de inspecciones es: ' + newCount);
        },
        error: function(xhr, status, error){
            console.error('Error al cargar nuevas inspecciones:', error);
        }
    });
}
setInterval(mainInspectionsAutoloader, 60000);
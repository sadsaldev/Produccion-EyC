document.addEventListener("DOMContentLoaded", function(){
    var currentDate = new Date().toISOString().split('T')[0];
    //var Dateparts = currentDate.split('-');
    //var DateFormat = Dateparts[0] + '/' + Dateparts[1] + '/' + Dateparts[2];

    document.getElementById('fecha_inicio').value = currentDate;
    document.getElementById('fecha_final').value = currentDate;

});


import { globalState } from "../../helpers/global";

export function exportExcel() {
    $(document).off('click', '.queries-section #download').on('click', '.queries-section #download', function (e) {
        if(!globalState.user){
            window.alert("No hay una sesión activa");
            return;
        }

        e.preventDefault();

        let fecha_inicio = $('#fecha_inicio').val();
        let fecha_final = $('#fecha_final').val();
        let opcion = $('#opc').val();

        if (fecha_inicio && fecha_final && opcion) {
            if (fecha_inicio > fecha_final) {
                window.alert('La fecha inicial no puede ser mayor a la fecha final. Por favor selecciona un rango válido.');
                return;
            } else {
                let excelData = {
                    fecha_inicio: fecha_inicio,
                    fecha_final: fecha_final,
                    opcion: opcion,
                    action: 'exportExcel'
                };

                const urlEncodedData = new URLSearchParams(excelData).toString();

                console.log (urlEncodedData);

                fetch('http://localhost:4000/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: urlEncodedData,
                    credentials: 'include'
                })
                .then(response => {
                    if (response.ok) {
                        return response.blob();
                    } else {
                        return response.json().then(error => { throw error; });
                    }
                })
                .then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'inspecciones_' + opcion + '-' + fecha_inicio + '.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('Error: ', error);
                    window.alert('Error al generar el archivo Excel.');
                });
            }
        } else {
            window.alert("Por favor completa todos los campos del formulario.");
            return;
        }
    });
}
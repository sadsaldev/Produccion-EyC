export async function exportEfectiveExcel(fecha_inicio, fecha_final, opcion){
    try {
        const response = await fetch('/produccion-EyC-deploy/public/router/frontController.php', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
             body : JSON.stringify({
                action: 'exportEfectiveExcel',
                fecha_inicio: fecha_inicio,
                fecha_final: fecha_final,
                opcion: opcion
            }),
            credentials: 'include',
        });

        if (!response.ok){
            throw new Error("Error en la petición de exporte a Excel.");
        }

        //Manejar JSON response
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1){
            const json = await response.json();
            console.log('Respuesta JSON del server: ', json);
        } else {
            //Manejar Blob response
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Efectivas_' + fecha_inicio + '_' + fecha_final  + '_' + opcion + '.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }

    } catch (error){
        console.log("Error al exportar el Excel:", error);
    }
}
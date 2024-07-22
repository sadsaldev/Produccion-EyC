export async function exportEfectiveExcel(fecha_inicio, fecha_final, opcion){
    try {
        const excelData = {
            fecha_inicio: fecha_inicio,
            fecha_final: fecha_final,
            opcion: opcion,
            action: 'exportEfectiveExcel'
        }

        console.log("excelData: ", excelData);

        const urlEncodedData = new URLSearchParams(excelData).toString();
        const response = await fetch('http://localhost:5000/api/exportExcel/efective', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlEncodedData,
            credentials: 'include'
        });

        if (!response.ok){
            throw new Error("Error en la petición de exporte a Excel.");
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1){
            const json = await response.json();
            console.log('Respuesta JSON del server: ', json);
        } else if (contentType && contentType.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') !== -1){
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Efectivas_' + fecha_inicio + '_' + fecha_final  + '_' + opcion + '.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } else {
            const text = await response.text();
            console.log('Respuesta de texto plano del server: ', text);
        }


    } catch (error){
        console.log("Error al exportar el Excel:", error);
    }
}
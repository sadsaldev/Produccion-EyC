export async function exportNetExcel(responseData, counts){
    try {
        console.log("responseData:", responseData);
        console.log("counts (antes):", counts);

        const response = await fetch('/produccion-EyC-deploy/public/router/frontController.php', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'exportNetExcel',
                data: responseData,
                counts: counts
            }),
            credentials: 'include',
        });

        if (!response.ok){
            throw new Error("Error en la petición de exporte a Excel.");
        }

        // Manejar diferentes tipos de respuesta
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1){
            const json = await response.json();
            console.log('Respuesta JSON del server: ', json);
        } else if (contentType && contentType.indexOf('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') !== -1){
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Comité_Redes_Nuevas_' + new Date().toISOString().slice(0, 10) + '.xlsx');
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

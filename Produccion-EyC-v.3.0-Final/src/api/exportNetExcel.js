export async function exportNetExcel(responseData, counts){
    try {
        const excelData = {
            data: JSON.stringify(responseData),
            counts: JSON.stringify(counts),
            action: 'exportNetExcel'
        }

        console.log("excelData: ", excelData);

        const urlEncodedData = new URLSearchParams(excelData).toString();
        const response = await fetch('http://localhost:5000/api/exportExcel/networks', {
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

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Comité_Redes_Nuevas_' + new Date().toISOString().slice(0, 10) + '.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error){
        console.log("Error al exportar el Excel:", error);
    }
}
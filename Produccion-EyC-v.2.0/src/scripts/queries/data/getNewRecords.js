export async function getNewRecords(opcion, lastQueryTime) {
    try {
        let response = await $.ajax({
            type: 'POST',
            url: 'http://localhost:4000/api',
            data: {
                lastQueryTime: lastQueryTime,
                opcion: opcion,
                action: 'getNewRecords',
                ajax: true
            },
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
        });

        return response;

    } catch (error) {
        console.error("Error al obtener los nuevos registros: ", error);
    }
}

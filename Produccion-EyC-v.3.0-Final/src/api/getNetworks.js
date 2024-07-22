export async function getNetworks(contracts, fecha_inicio, opcion){
    try {
        const response = await fetch('http://localhost:5000/api/getInspections/networks', { 
            method : "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                contracts: contracts,
                fecha_inicio: fecha_inicio,
                opcion: opcion,
                action: 'getNetworks'
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Error al enviar los contratos al servidor');
        }

        const responseData = await response.json();
        console.log(responseData); 
        return responseData;
        
    } catch (error){
        console.error("Error al obtener la data para redes nuevas: ", error);
    }
}
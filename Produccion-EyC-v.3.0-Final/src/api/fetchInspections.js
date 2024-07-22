export const fetchInspections = async (userID, formData) => {
    try {
        const response = await fetch('http://localhost:5000/api/getInspections/efective', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
             body : JSON.stringify({
                action: 'getInspections',
                userID: userID,
                fecha_inicio: formData.fecha_inicio,
                fecha_final: formData.fecha_final,
                opcion: formData.opcion
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error("Error en la petición de cargue de tabla principal.");
        }
        
        const responseData = await response.json();
        console.log(responseData); 
        return responseData;

    } catch (error) {
        console.error("Error al realizar la consulta:", error.message);
        throw error;
    }
};
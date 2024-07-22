let currentIntervalID = null;

/**
 * Iniciar un nuevo intervalo y asegurarse de detener el intervalo anterior
 * 
 * @param { function } callback -La función que se ejecutará en cada intervalo
 * @param { number } interval -Tiempo en milisegundos para cada intervalo
 * 
 */

export function startInterval(callback, interval) {
    if (currentIntervalID !== null){
        console.log(`Deteniendo el intervalo anterior con ID: ${currentIntervalID}`);
        clearInterval(currentIntervalID);
    }

    currentIntervalID = setInterval(callback, interval);
}

/**
 * Detiene el intervalo actual.
 */

export function stopInterval() {
    if (currentIntervalID !== null) {
        console.log(`Deteniendo el intervalo actual con ID: ${currentIntervalID}`);
        clearInterval(currentIntervalID);
        currentIntervalID = null;
    } else {
        console.log("No hay ningún intervalo activo para detener.");
    }
}


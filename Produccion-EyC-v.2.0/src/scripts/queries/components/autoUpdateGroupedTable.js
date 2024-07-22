import { getNewRecords } from "../data/getNewRecords";
import { updateUI } from "./updateUIGrouped";

export async function updateRecords(opcion, lastQueryTime) {
    try {
        let newRecords = await getNewRecords(opcion, lastQueryTime);
        if (newRecords.length > 0) {
            updateUI(newRecords);
            console.log("Se procesaron correctamente los registros para Grouped Table.");
        } else {
            console.log("No hubo nuevos registros para Grouped Table.");
        }
        return lastQueryTime;
    } catch (error) {
        console.error("Error al actualizar los registros: ", error);
    }
}
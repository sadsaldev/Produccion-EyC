import { getNewRecords } from "../data/getNewRecords";
import { updateUISingleOpc, updateUIBothOpc } from "./updateUIMain";

export async function updateRecords(opcion, lastQueryTime) {
    try {
        let newRecords = await getNewRecords(opcion, lastQueryTime);
        if (newRecords.length > 0) {
            let tableBody, existingIDs, initialCount, counter, newRecordCount = 0;
            if (opcion === 'INSP-RIS' || opcion === 'INSP-CALDAS'){
                updateUISingleOpc(newRecords, tableBody, existingIDs, initialCount, counter, newRecordCount);
            } else if (opcion === 'both') {
                updateUIBothOpc(newRecords, tableBody, existingIDs, initialCount, counter, newRecordCount);
            } 
            console.log("Se procesaron correctamente los registros para Main Table.");
        } else {
            console.log("No hubo nuevos registros para Main Table.");
        }
        return lastQueryTime;
    } catch (error) {
        console.error("Error al actualizar los registros: ", error);
    }
}
import { startInterval, stopInterval } from "./intervalManager";
import { globalState } from "../../helpers/global";
/**
 * Cambia la sección actual y detiene el intervalo si es necesario.
 * 
 * @param {string} newSection - El nombre de la nueva sección.
 */
export function changeSection(newSection) {
    if (globalState.currentSection !== newSection) {
        stopInterval(); // Detiene el intervalo actual al cambiar de sección
        globalState.currentSection = newSection; // Actualiza la sección en globalState
    }
}
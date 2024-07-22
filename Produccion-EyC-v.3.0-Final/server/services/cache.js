const NodeCache = require('node-cache');
const cache = new NodeCache();

function isToday(dateStr) {
    const today = new Date();
    const date = new Date(dateStr);
    return date.toDateString() === today.toDateString();
}

function isYesterday(dateStr) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = new Date(dateStr);
    return date.toDateString() === yesterday.toDateString();
}

function cacheDuration(formData){
    if (isToday(formData.fecha_final) || isYesterday(formData.fecha_final)){
        return 300; // cachear 5 minutos
    } else {
        return 0; // cacheo indefinido
    }
}

//Guardar en caché los datos de una consulta
function cacheQueryData(userID, formData, data){
    const cacheKey = `${userID}-${formData.fecha_inicio}-${formData.fecha_final}-${formData.opcion}`;
    const duration = cacheDuration(formData);

    if (duration > 0){
        cache.set(cacheKey, data, duration);
    } else {
        cache.set(cacheKey, data);
    }
}

//Obtener los datos de caché de una consulta
function getCachedQueryData(userID, formData) {
    const cacheKey = `${userID}-${formData.fecha_inicio}-${formData.fecha_final}-${formData.opcion}`;
    return cache.get(cacheKey);
    
    
}

module.exports = {
    cacheQueryData,
    getCachedQueryData
}
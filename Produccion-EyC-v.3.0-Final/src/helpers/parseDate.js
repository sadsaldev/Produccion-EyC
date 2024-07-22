export function parseDate(dateString) {
    if (!dateString) {
        return new Date(0);
    }
    
    let [datePart, timePart] = dateString.split(', ');
    let [day, month, year] = datePart.split('/').map(Number);
    let [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
}
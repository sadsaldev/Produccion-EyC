export function generateUniqueId() {
    return 'tab-' + Math.random().toString(36).substring(2, 16);
}
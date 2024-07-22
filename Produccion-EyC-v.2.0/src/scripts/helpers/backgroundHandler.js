export function hideBackground(element) {
    return new Promise((resolve) => {
        $(element).fadeOut(300, resolve);
    });
}

export function showBackground(element) {
    return new Promise((resolve) => {
        $(element).fadeIn(300, resolve);
    });
}
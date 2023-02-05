export function getLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
}
export function setLocalStorage(key: string, value: string | null): void {
    !value ? localStorage.setItem(key, '') : localStorage.setItem(key, value);
}
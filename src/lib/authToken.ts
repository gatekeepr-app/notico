const key = "notico-token";

export function getStoredToken() {
  return localStorage.getItem(key) ?? sessionStorage.getItem(key);
}

export function setStoredToken(token: string) {
  sessionStorage.removeItem(key);
  localStorage.setItem(key, token);
}

export function clearStoredToken() {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

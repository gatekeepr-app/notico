const key = "notico-token";

export function getStoredToken() {
  const legacy = localStorage.getItem(key);
  if (legacy) localStorage.removeItem(key);
  return sessionStorage.getItem(key) ?? legacy;
}

export function setStoredToken(token: string) {
  localStorage.removeItem(key);
  sessionStorage.setItem(key, token);
}

export function clearStoredToken() {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

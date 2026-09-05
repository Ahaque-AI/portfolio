export const visitorNameKey = 'abdul-haque:visitor-name';

export function readVisitorName() {
  try {
    const name = localStorage.getItem(visitorNameKey)?.trim() || '';
    return name && name.length <= 120 ? name : null;
  } catch {
    return null;
  }
}

export function saveVisitorName(name) {
  if (typeof name !== 'string') return false;
  const value = name.trim();
  if (!value || value.length > 120) return false;
  try {
    localStorage.setItem(visitorNameKey, value);
    return true;
  } catch {
    return false;
  }
}

export function clearVisitorName() {
  try {
    localStorage.removeItem(visitorNameKey);
    return true;
  } catch {
    return false;
  }
}

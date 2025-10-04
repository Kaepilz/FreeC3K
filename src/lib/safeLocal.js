export function safeParse(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return JSON.parse(v);
  } catch (e) {
    console.warn('safeParse: failed to parse', key, e);
    return fallback;
  }
}

export function safeGetArray(key) {
  return safeParse(key, []);
}

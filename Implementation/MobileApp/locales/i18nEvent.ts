// locales/i18nEvent.ts
const listeners = new Set<() => void>();

export function emitLangChanged() {
  listeners.forEach(cb => cb());
}

export function onLangChanged(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

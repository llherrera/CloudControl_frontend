/**
 * Controlador de logs de depuración en frontend (Vite).
 * 
 * Configuración:
 * 1. Desde .env: VITE_ENABLE_DEBUG_LOGS=true / false
 * 2. Desde la consola del navegador en caliente (sin reiniciar):
 *    toggleDebugLogs()  -> alterna entre activado y desactivado
 *    toggleDebugLogs(true) / toggleDebugLogs(false)
 */

export function initDebugLogs() {
  if (typeof window === 'undefined') return;

  const envSetting = import.meta.env.VITE_ENABLE_DEBUG_LOGS;
  const localSetting = localStorage.getItem('DEBUG_LOGS');

  // Si hay preferencia explícita en localStorage se respeta; sino se usa la variable de entorno
  const isEnabled = localSetting !== null
    ? localSetting === 'true'
    : envSetting === 'true';

  const originalLog = console.log.bind(console);
  const originalDebug = console.debug.bind(console);
  const originalInfo = console.info.bind(console);

  const noop = () => {};

  const applyState = (enabled: boolean) => {
    if (enabled) {
      console.log = originalLog;
      console.debug = originalDebug;
      console.info = originalInfo;
      originalLog('%c[Controland] Logs de depuración ACTIVADOS', 'color: #10b981; font-weight: bold;');
    } else {
      console.log = noop;
      console.debug = noop;
      console.info = noop;
    }
  };

  applyState(isEnabled);

  // Expone función global para alternar logs desde la consola del navegador
  (window as any).toggleDebugLogs = (enable?: boolean) => {
    const current = localStorage.getItem('DEBUG_LOGS') === 'true';
    const next = enable !== undefined ? enable : !current;
    localStorage.setItem('DEBUG_LOGS', String(next));
    applyState(next);
    console.warn(`[Controland] Logs de depuración: ${next ? 'ACTIVADOS' : 'DESACTIVADOS'}`);
    return next;
  };
}

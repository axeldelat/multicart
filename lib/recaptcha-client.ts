// Nombre de la acción v3 del formulario de contacto. Va firmado dentro del token
// y el servidor lo compara al verificar.
export const CONTACT_RECAPTCHA_ACTION = "contact_form";

// Carga perezosa del script de reCAPTCHA v3: solo se descarga cuando el usuario
// toca el formulario, no en cada visita (el script pesa y bloquea métricas).
type Grecaptcha = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
};

let loader: Promise<Grecaptcha> | null = null;

export function loadRecaptcha(siteKey: string): Promise<Grecaptcha> {
  if (loader) return loader;
  loader = new Promise<Grecaptcha>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onload = () => {
      const grecaptcha = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
      if (!grecaptcha) {
        reject(new Error("grecaptcha no disponible"));
        return;
      }
      grecaptcha.ready(() => resolve(grecaptcha));
    };
    script.onerror = () => {
      loader = null; // permite reintentar si falló la red
      reject(new Error("no se pudo cargar reCAPTCHA"));
    };
    document.head.appendChild(script);
  });
  return loader;
}

// Devuelve el token para la acción dada, o null si reCAPTCHA no está disponible
// (el servidor decide qué hacer con un token vacío).
export async function getRecaptchaToken(
  siteKey: string,
  action: string,
): Promise<string | null> {
  try {
    const grecaptcha = await loadRecaptcha(siteKey);
    return await grecaptcha.execute(siteKey, { action });
  } catch {
    return null;
  }
}

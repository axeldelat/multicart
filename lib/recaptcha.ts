import "server-only";

// Verificación server-side de reCAPTCHA v3. La llave secreta nunca sale del servidor.
const VERIFY_ENDPOINT = "https://www.google.com/recaptcha/api/siteverify";

// Score de Google: 1.0 = casi seguro humano, 0.0 = casi seguro bot. 0.5 es el
// umbral que recomienda Google como punto de partida.
const MIN_SCORE = 0.5;

export type RecaptchaVerdict = { ok: true } | { ok: false; reason: string };

type SiteVerifyResponse = {
  success?: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

export async function verifyRecaptcha(
  token: string,
  expectedAction: string,
): Promise<RecaptchaVerdict> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // Sin llave configurada: en Vercel (producción y preview la tienen) es un error
  // de configuración y se bloquea; en local se omite para poder desarrollar.
  if (!secret) {
    return process.env.VERCEL ? { ok: false, reason: "missing_secret" } : { ok: true };
  }

  if (!token) return { ok: false, reason: "missing_token" };

  let data: SiteVerifyResponse;
  try {
    const res = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`siteverify ${res.status}`);
    data = (await res.json()) as SiteVerifyResponse;
  } catch {
    // Si Google no responde (caída o timeout) se deja pasar: perder leads reales
    // es peor que colar spam, y el honeypot del formulario sigue activo.
    console.error("[recaptcha] siteverify no disponible, se omite la verificación");
    return { ok: true };
  }

  if (!data.success) {
    return { ok: false, reason: data["error-codes"]?.join(",") || "verification_failed" };
  }
  // La acción va firmada en el token: evita reusar en este form un token
  // conseguido en otra parte del sitio.
  if (data.action !== expectedAction) {
    return { ok: false, reason: `unexpected_action:${data.action ?? "none"}` };
  }
  if (typeof data.score === "number" && data.score < MIN_SCORE) {
    return { ok: false, reason: `low_score:${data.score}` };
  }
  return { ok: true };
}

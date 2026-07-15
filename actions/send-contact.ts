"use server";
import { sendTransactional } from "@/lib/plunk";

export type ContactState = { ok: boolean; error?: string };

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (formData.get("company")) return { ok: true }; // honeypot
  if (!name || !email || !message) return { ok: false, error: "Faltan campos obligatorios." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Correo inválido." };

  // Destino según entorno: producción -> reportes@multicart.mx;
  // pruebas (local / preview de Vercel) -> correo del dueño para no llenar reportes.
  const to =
    process.env.VERCEL_ENV === "production"
      ? "reportes@multicart.mx"
      : "axeldelat@gmail.com";

  try {
    await sendTransactional({
      to,
      from: "no-reply@multicart.mx",
      subject: `Nuevo contacto web: ${name}`,
      body: `<p><b>Nombre:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><p><b>Teléfono:</b> ${escapeHtml(phone)}</p><p><b>Mensaje:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo enviar. Intenta por WhatsApp." };
  }
}

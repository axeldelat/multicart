"use server";
import { sendTransactional } from "@/lib/plunk";

export type ContactState = { ok: boolean; error?: string };

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (formData.get("company")) return { ok: true }; // honeypot
  if (!name || !email || !message) return { ok: false, error: "Faltan campos obligatorios." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Correo inválido." };
  try {
    await sendTransactional({
      to: "contacto@multicart.mx",
      subject: `Nuevo contacto web: ${name}`,
      body: `<p><b>Nombre:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Teléfono:</b> ${phone}</p><p><b>Mensaje:</b><br/>${message.replace(/\n/g, "<br/>")}</p>`,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo enviar. Intenta por WhatsApp." };
  }
}

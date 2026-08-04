"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { sendContact, type ContactState } from "@/actions/send-contact";
import { trackEvent } from "@/lib/analytics";
import {
  CONTACT_RECAPTCHA_ACTION,
  getRecaptchaToken,
  loadRecaptcha,
} from "@/lib/recaptcha-client";

const initialState: ContactState = { ok: false };

const INPUT_CLASSES =
  "mt-1 w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy placeholder:text-navy/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60";

export default function ContactForm({ recaptchaSiteKey }: { recaptchaSiteKey?: string }) {
  const [state, formAction, pending] = useActionState(sendContact, initialState);
  // El token tarda un momento en llegar: sin esto el botón no se bloquearía
  // hasta que arrancara la server action.
  const [verifying, setVerifying] = useState(false);
  const busy = pending || verifying;

  // Envío exitoso -> evento GA4 recomendado para lead.
  useEffect(() => {
    if (state.ok) trackEvent("generate_lead", { method: "contact_form" });
  }, [state.ok]);

  // Sin llave (dev local sin variables) el form envía como antes y el servidor
  // decide; con llave se intercepta el submit para adjuntar el token.
  const handleSubmit = recaptchaSiteKey
    ? async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setVerifying(true);
        try {
          const token = await getRecaptchaToken(recaptchaSiteKey, CONTACT_RECAPTCHA_ACTION);
          if (token) formData.set("recaptchaToken", token);
        } finally {
          setVerifying(false);
        }
        startTransition(() => formAction(formData));
      }
    : undefined;

  // Se precarga el script al primer contacto con el formulario para que al
  // enviar el token ya esté listo.
  const warmUpRecaptcha = recaptchaSiteKey
    ? () => void loadRecaptcha(recaptchaSiteKey).catch(() => {})
    : undefined;

  if (state.ok) {
    return (
      <p
        role="status"
        className="rounded-xl border border-navy/10 bg-surface p-6 text-sm font-medium text-navy"
      >
        ¡Gracias! Te contactaremos pronto.
      </p>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      onFocusCapture={warmUpRecaptcha}
      className="flex flex-col gap-4 rounded-xl border border-navy/10 bg-surface p-6"
      aria-label="Formulario de contacto"
    >
      {/* Honeypot: hidden from real users, left for bots to fill in. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Empresa</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="contact-name" className="text-sm font-medium text-navy">
          Nombre
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          disabled={busy}
          className={INPUT_CLASSES}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="text-sm font-medium text-navy">
          Correo
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={busy}
          className={INPUT_CLASSES}
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className="text-sm font-medium text-navy">
          Teléfono
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          disabled={busy}
          className={INPUT_CLASSES}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-navy">
          Mensaje
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          disabled={busy}
          className={INPUT_CLASSES}
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Enviando…" : "Enviar"}
      </button>

      {/* Aviso obligatorio de Google cuando se oculta el badge flotante
          (choca con el botón de WhatsApp). El CSS está en globals.css. */}
      {recaptchaSiteKey ? (
        <p className="text-xs text-navy-soft">
          Protegido por reCAPTCHA. Aplican la{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-accent"
          >
            Política de privacidad
          </a>{" "}
          y los{" "}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-accent"
          >
            Términos de servicio
          </a>{" "}
          de Google.
        </p>
      ) : null}
    </form>
  );
}

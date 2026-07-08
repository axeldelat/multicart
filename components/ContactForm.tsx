"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/actions/send-contact";

const initialState: ContactState = { ok: false };

const INPUT_CLASSES =
  "mt-1 w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy placeholder:text-navy/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState);

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
          disabled={pending}
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
          disabled={pending}
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
          disabled={pending}
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
          disabled={pending}
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
        disabled={pending}
        className="mt-2 rounded-full bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}

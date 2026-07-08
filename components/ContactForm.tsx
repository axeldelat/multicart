// TODO(D2): This is a placeholder. Task D2 owns the real contact form —
// client-side validation, submit handler wired to the Plunk-backed API route
// (PLUNK_API_KEY, emails to contacto@multicart.mx). It exists now only so
// `ContactBlock` has something to render and the build passes ahead of D2.
// The submit button is intentionally disabled to avoid implying it works.
export default function ContactForm() {
  return (
    <form
      className="flex flex-col gap-4 rounded-xl border border-navy/10 bg-surface p-6"
      aria-label="Formulario de contacto"
    >
      <div>
        <label htmlFor="contact-name" className="text-sm font-medium text-navy">
          Nombre
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          className="mt-1 w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
          className="mt-1 w-full rounded-lg border border-navy/15 bg-white px-3 py-2 text-sm text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>
      <button
        type="submit"
        disabled
        aria-disabled="true"
        className="mt-2 cursor-not-allowed rounded-full bg-accent/50 px-6 py-3 font-semibold text-white"
      >
        Enviar (próximamente)
      </button>
    </form>
  );
}

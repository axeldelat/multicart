import type { ContactBlock as ContactBlockData, SiteData } from "@/lib/types";
import ContactForm from "@/components/ContactForm";

const CONTACT_LINK_CLASSES =
  "transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export default function ContactBlock({
  heading,
  intro,
  showForm,
  hours,
  mapEmbedUrl,
  site,
}: ContactBlockData & { site: SiteData }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <div>
          {heading ? (
            <h2 className="font-display text-2xl font-bold text-navy sm:text-3xl">{heading}</h2>
          ) : null}
          {intro ? <p className="mt-4 text-navy-soft">{intro}</p> : null}
          <dl className="mt-8 space-y-4 text-sm text-navy">
            <div>
              <dt className="font-semibold text-navy-soft">Dirección</dt>
              <dd className="mt-1">{site.address}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-soft">Teléfono</dt>
              <dd className="mt-1">
                <a href={site.phoneHref} className={CONTACT_LINK_CLASSES}>
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-soft">Correo</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className={CONTACT_LINK_CLASSES}>
                  {site.email}
                </a>
              </dd>
            </div>
            {hours ? (
              <div>
                <dt className="font-semibold text-navy-soft">Horario de atención</dt>
                <dd className="mt-1">{hours}</dd>
              </div>
            ) : null}
          </dl>
          {mapEmbedUrl ? (
            <div className="mt-8 aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                src={mapEmbedUrl}
                title="Ubicación de Multicart"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
                allowFullScreen
              />
            </div>
          ) : null}
        </div>
        {showForm ? (
          <div>
            <ContactForm />
          </div>
        ) : null}
      </div>
    </section>
  );
}

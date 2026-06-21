import { SectionHeading } from "@/components/SectionHeading";

type Testimonial = {
  id: string;
  quote: string;
  clientName: string;
  clientRole: string | null;
};

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (!testimonials.length) return null;

  return (
    <section
      id="testimonials"
      className="site-section-slice scroll-mt-36 border-t border-[color:var(--site-section-border)] py-20 md:py-24"
    >
      <SectionHeading kicker="Social proof" title="Kind words" />
      <p className="section-lead">
        Client feedback and collaboration highlights.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <blockquote key={t.id} className="testimonial-card surface-card p-6 sm:p-7">
            <div className="testimonial-card-quote-icon" aria-hidden>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.45l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.45l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
              </svg>
            </div>
            <p className="testimonial-card-quote">&ldquo;{t.quote}&rdquo;</p>
            <footer className="testimonial-card-author">
              <cite className="not-italic">
                <span className="testimonial-card-name">{t.clientName}</span>
                {t.clientRole ? (
                  <span className="testimonial-card-role">{t.clientRole}</span>
                ) : null}
              </cite>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

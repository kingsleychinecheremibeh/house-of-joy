// app/components/Testimonials.tsx
"use client";

import { useState } from "react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Adaeze Okonkwo",
    location: "Lagos",
    occasion: "Traditional Wedding",
    quote:
      "I ordered my Aso Ebi from Joy and she delivered beyond my expectations. The fabric was exactly what I saw, and my whole bridal team looked stunning. I'll never go anywhere else!",
    stars: 5,
  },
  {
    id: 2,
    name: "Funmi Adeleke",
    location: "Ibadan",
    occasion: "Owambe Party",
    quote:
      "Joy responded within minutes on WhatsApp and helped me pick the right sequin fabric for my party. Quality was top tier and the delivery was fast. My oga kept asking where I bought it 😂",
    stars: 5,
  },
  {
    id: 3,
    name: "Chisom Eze",
    location: "Abuja",
    occasion: "Church Anniversary",
    quote:
      "I was nervous ordering fabric online but Joy sent me videos of the actual material before I paid. That trust made all the difference. The stoned fabric I got was absolutely beautiful.",
    stars: 5,
  },
  {
    id: 4,
    name: "Blessing Uche",
    location: "Port Harcourt",
    occasion: "Birthday Shoot",
    quote:
      "The French lace I got from House of Joy got me so many compliments at my birthday shoot. Even the photographer asked where I bought it. I've already recommended Joy to five of my friends!",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-accent">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive((i) => (i === 0 ? TESTIMONIALS.length - 1 : i - 1));
  const next = () => setActive((i) => (i === TESTIMONIALS.length - 1 ? 0 : i + 1));

  const t = TESTIMONIALS[active];

  return (
    <section className="py-20 md:py-28 px-4 md:px-16 lg:px-24 bg-cream text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent-dark font-semibold mb-4">
            What They Say
          </p>
          <div className="gold-divider mb-6" />
          <h3 className="font-serif text-4xl md:text-5xl text-foreground">
            Happy Customers
          </h3>
        </div>

        {/* Testimonial card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white px-8 md:px-16 py-12 md:py-16 text-center shadow-sm">
            {/* Big quote mark */}
            <span className="absolute top-6 left-8 font-serif text-8xl text-accent/20 leading-none select-none">
              "
            </span>

            {/* Stars */}
            <div className="flex justify-center mb-6">
              <Stars count={t.stars} />
            </div>

            {/* Quote */}
            <p className="font-serif text-xl md:text-2xl text-foreground/80 leading-relaxed italic mb-8 relative z-10">
              "{t.quote}"
            </p>

            {/* Divider */}
            <div className="w-10 h-[1px] bg-accent mx-auto mb-6" />

            {/* Attribution */}
            <div>
              <p className="font-serif text-lg text-foreground font-medium">{t.name}</p>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/40 mt-1">
                {t.occasion} · {t.location}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 border border-foreground/20 flex items-center justify-center text-foreground/50 hover:border-primary hover:text-primary transition-all text-lg"
            >
              ‹
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1.5 transition-all rounded-full ${
                    i === active ? "w-6 bg-primary" : "w-1.5 bg-foreground/20"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 border border-foreground/20 flex items-center justify-center text-foreground/50 hover:border-primary hover:text-primary transition-all text-lg"
            >
              ›
            </button>
          </div>

          {/* Nudge to leave a review */}
          <p className="text-center font-sans text-xs text-foreground/30 mt-8 uppercase tracking-[0.2em]">
            Ordered from us? Tell Joy on{" "}
            <a
              href="https://wa.me/2348037892623"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              WhatsApp
            </a>{" "}
            and we'll feature your review here.
          </p>
        </div>
      </div>
    </section>
  );
}

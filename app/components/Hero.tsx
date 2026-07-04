import Image from "next/image";
import Link from "next/link";

const WHATSAPP_NUMBER = "2348037892623";
const whatsappMessage = encodeURIComponent(
  "Hi Joy! 👋 I came across your website and I'd love to order a fabric."
);

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/hero-fabric.png"
          alt="Luxury sequin and lace fabric closeup"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6 pt-20">
        {/* Tagline */}
        <p className="animate-fade-in-up-delay-1 font-sans text-xs md:text-sm tracking-[0.4em] uppercase text-accent">
          Lace · Sequins · Stones · Aso Ebi
        </p>

        {/* Decorative line */}
        <div className="animate-fade-in-up-delay-1 gold-divider" />

        {/* Main Heading */}
        <h2 className="animate-fade-in-up-delay-2 font-serif text-5xl sm:text-6xl md:text-8xl text-white leading-[1.1] font-normal">
          Your Style,
          <br />
          <span className="shimmer-text">Your Fabric</span>
        </h2>

        {/* Description */}
        <p className="animate-fade-in-up-delay-3 font-sans text-base md:text-lg text-white/70 max-w-xl leading-relaxed font-light">
          We sell quality lace, sequins, stoned materials and Aso Ebi packages
          for weddings, parties, and every special occasion.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-sm sm:max-w-none mx-auto">
          <Link
            href="/#fabrics"
            className="bg-accent text-charcoal px-6 md:px-10 py-4 uppercase tracking-[0.2em] md:tracking-[0.25em] font-sans text-[10px] md:text-xs font-semibold hover:bg-accent-light transition-all duration-300 text-center whitespace-nowrap"
          >
            See Our Fabrics
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-charcoal px-6 md:px-10 py-4 uppercase tracking-[0.2em] md:tracking-[0.25em] font-sans text-[10px] md:text-xs font-semibold hover:bg-accent hover:text-charcoal transition-all duration-300 text-center whitespace-nowrap"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-fade-in flex flex-col items-center gap-2">
        <span className="text-white/40 font-sans text-[10px] tracking-[0.3em] uppercase">
          Scroll
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-accent/80 to-transparent" />
      </div>
    </section>
  );
}

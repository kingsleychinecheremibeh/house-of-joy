import Image from "next/image";

export default function About() {
  return (
    <section
      id="about"
      className="py-28 px-6 md:px-16 lg:px-24 bg-cream text-foreground"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-20">
        {/* Portrait */}
        <div className="md:w-5/12 relative w-full">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src="/joy.png"
              alt="Joy — Founder of House of Joy"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          {/* Decorative corner frame */}
          <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-accent pointer-events-none" />
          <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-accent pointer-events-none" />
        </div>

        {/* Text */}
        <div className="md:w-7/12 space-y-6">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent-dark font-semibold">
            About Us
          </p>
          <div className="gold-divider-left" />
          <h3 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
            Meet Joy
          </h3>
          <p className="font-sans text-base md:text-lg text-foreground/70 leading-relaxed font-light max-w-lg">
            I have always had an eye for beautiful fabrics. What started as
            helping friends find the perfect Aso Ebi for their weddings grew
            into House of Joy — a place where you can find quality lace,
            sequins, and stoned materials all in one spot.
          </p>
          <p className="font-sans text-base md:text-lg text-foreground/70 leading-relaxed font-light max-w-lg">
            Whether you are shopping for yourself, a bride looking for
            something special, or coordinating Aso Ebi for your wedding
            guests — I am here to help you find exactly what you need.
          </p>
          <div className="pt-4">
            <p className="font-serif text-xl italic text-primary">
              — Joy, Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

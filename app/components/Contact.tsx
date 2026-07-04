const WHATSAPP_NUMBER = "2348037892623";

export default function Contact() {
  const generalMessage = encodeURIComponent(
    `Hi Joy! 👋\n\nI came across your website and I'd like to ask about your fabrics.`
  );

  return (
    <section
      id="contact"
      className="py-28 px-6 md:px-16 lg:px-24 bg-primary text-white"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent font-semibold mb-4">
          We Are Just a Message Away
        </p>
        <div className="gold-divider mb-8" />
        <h3 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-tight">
          Found Something You Like?
        </h3>
        <p className="font-sans text-base md:text-lg text-white/60 max-w-xl mx-auto mb-10 font-light leading-relaxed">
          Send us a message on WhatsApp and Joy will get back to you quickly.
          Whether it is a single piece or a full Aso Ebi package for your
          wedding — we are here to help.
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${generalMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-accent text-charcoal px-12 py-5 uppercase tracking-[0.25em] font-sans text-xs font-bold hover:bg-accent-light transition-all duration-300"
        >
          Chat with Joy on WhatsApp →
        </a>

        {/* Quick Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left md:text-center border-t border-white/10 pt-16">
          <div>
            <p className="text-accent font-serif text-lg mb-2">Location</p>
            <p className="text-white/50 font-sans text-sm font-light">
              Lagos, Nigeria
            </p>
          </div>
          <div>
            <p className="text-accent font-serif text-lg mb-2">Delivery</p>
            <p className="text-white/50 font-sans text-sm font-light">
              Nationwide across Nigeria
              <br />
              International shipping available
            </p>
          </div>
          <div>
            <p className="text-accent font-serif text-lg mb-2">Response Time</p>
            <p className="text-white/50 font-sans text-sm font-light">
              We reply fast on WhatsApp.
              <br />
              Usually within the hour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

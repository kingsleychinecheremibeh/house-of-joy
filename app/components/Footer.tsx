import Link from "next/link";

const WHATSAPP_NUMBER = "2340000000000";
const quickMessage = encodeURIComponent(`Hi Joy! 👋 I'd like to ask about your fabrics.`);

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/40 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top — Brand + Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
          <div>
            <h2 className="font-serif text-2xl tracking-[0.2em] font-bold text-white mb-2">
              HOUSE OF <span className="text-accent">JOY</span>
            </h2>
            <p className="font-sans text-xs tracking-widest uppercase">
              Quality Fabrics for Every Occasion
            </p>
          </div>

          <nav className="flex flex-wrap gap-8">
            {[
              { href: "#fabrics", label: "Our Fabrics" },
              { href: "#about", label: "About Us" },
              { href: "#gallery", label: "Happy Customers" },
              { href: "#faq", label: "FAQs" },
              { href: "#contact", label: "Contact Us" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-xs uppercase tracking-[0.2em] hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* WhatsApp shortcut */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${quickMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 border border-accent/40 text-accent px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-charcoal transition-all duration-300"
          >
            WhatsApp Us
          </a>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/10 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] tracking-[0.15em] uppercase">
          <p>
            &copy; {new Date().getFullYear()} House of Joy Fabrics. All rights reserved.
          </p>
          <p className="text-white/20">Lagos, Nigeria</p>
        </div>
      </div>
    </footer>
  );
}

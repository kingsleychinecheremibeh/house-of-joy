// app/components/HowToOrder.tsx
export default function HowToOrder() {
  const steps = [
    {
      number: "01",
      title: "Browse the Collection",
      description:
        "Scroll through our fabrics and find something you love. You can filter by Lace, Sequins, Stones, or Aso Ebi.",
    },
    {
      number: "02",
      title: "Tap Order on WhatsApp",
      description:
        "Hit the WhatsApp button on any fabric. A message is already typed for you — just press send.",
    },
    {
      number: "03",
      title: "We Sort the Rest",
      description:
        "Joy replies fast. She'll confirm availability, share price options, and arrange delivery anywhere in Nigeria.",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-16 lg:px-24 bg-charcoal text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent font-semibold mb-4">
            Simple Process
          </p>
          <div className="gold-divider mb-6" />
          <h3 className="font-serif text-4xl md:text-5xl text-white">
            How to Order
          </h3>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col gap-5">
              {/* Number + line */}
              <div className="flex items-center gap-4">
                <span className="font-serif text-5xl text-accent/30 leading-none font-bold">
                  {step.number}
                </span>
                {/* Connecting line (not on last item) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block flex-1 h-[1px] bg-white/10" />
                )}
              </div>

              <div>
                <h4 className="font-serif text-2xl text-white mb-3">
                  {step.title}
                </h4>
                <p className="font-sans text-base text-white/50 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

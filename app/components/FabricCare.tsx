"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "How do I wash sequin or stoned fabric?",
    answer:
      "Dry clean only. Sequins and stones are delicate — hand washing or machine washing can loosen the embellishments.",
  },
  {
    question: "How should I store my fabric?",
    answer:
      "Keep it in a cool, dry place away from direct sunlight. Wrap it in a cotton bag, not plastic, to prevent discolouration.",
  },
  {
    question: "Can I order Aso Ebi in bulk for my wedding?",
    answer:
      "Yes! We do bulk Aso Ebi for weddings. Just send us a WhatsApp message with the number of guests and your preferred colour, and we will give you a package price.",
  },
  {
    question: "Do you deliver outside Lagos?",
    answer:
      "Yes, we deliver nationwide across Nigeria. We also ship internationally. Contact us on WhatsApp for delivery costs to your area.",
  },
  {
    question: "Can I see the fabric before buying?",
    answer:
      "We can send you close-up videos of any fabric on WhatsApp so you can see the quality, texture, and how it catches the light before you buy.",
  },
];

export default function FabricCare() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 px-6 md:px-16 lg:px-24 bg-cream text-foreground">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent-dark font-semibold mb-4">
            Common Questions
          </p>
          <div className="gold-divider mb-6" />
          <h3 className="font-serif text-4xl md:text-5xl text-foreground">
            FAQs & Fabric Care
          </h3>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="border-b border-foreground/10 pb-4 cursor-pointer"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex justify-between items-center py-3 group">
                <h4 className="font-sans text-base font-medium text-foreground/90 group-hover:text-primary transition-colors pr-4">
                  {item.question}
                </h4>
                <span
                  className={`text-accent text-xl font-light transition-transform duration-300 shrink-0 ${
                    openIndex === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </div>
              <div
                className={`faq-answer text-foreground/60 font-sans text-sm leading-relaxed font-light ${
                  openIndex === i ? "open" : ""
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

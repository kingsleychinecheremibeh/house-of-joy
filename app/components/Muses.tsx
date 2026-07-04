import Image from "next/image";

const GALLERY = [
  {
    id: 1,
    image: "/customer_1.png",
    caption: "Wedding Guest — Lagos",
  },
  {
    id: 2,
    image: "/customer_2.png",
    caption: "Bride's Entourage — Abuja",
  },
  {
    id: 3,
    image: "/customer_3.png",
    caption: "Anniversary Celebration",
  },
  {
    id: 4,
    image: "/customer_4.png",
    caption: "Owambe Saturday — Ibadan",
  },
];

export default function CustomerGallery() {
  return (
    <section id="gallery" className="py-28 px-6 md:px-16 lg:px-24 bg-charcoal text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-accent font-semibold mb-4">
            Real People, Real Fabric
          </p>
          <div className="gold-divider mb-6" />
          <h3 className="font-serif text-4xl md:text-5xl text-white mb-4">
            Happy Customers
          </h3>
          <p className="font-sans text-base text-white/50 max-w-lg mx-auto font-light leading-relaxed">
            See how our customers styled their fabrics at weddings and events.
            You could be next!
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GALLERY.map((item, i) => (
            <div
              key={item.id}
              className={`relative overflow-hidden group ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <div
                className={`relative w-full overflow-hidden ${
                  i === 0 ? "aspect-square" : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={
                    i === 0
                      ? "(max-width: 768px) 100vw, 50vw"
                      : "(max-width: 768px) 50vw, 25vw"
                  }
                />
                {/* Hover overlay with caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-white/90">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

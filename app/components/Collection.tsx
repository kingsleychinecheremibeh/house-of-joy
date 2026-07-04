"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface MediaItem {
  id: number;
  url: string;
  public_id: string;
  type: "image" | "video";
  sort_order: number;
}

interface Fabric {
  id: number;
  name: string;
  category: string;
  description?: string;
  in_stock?: boolean;
  media: MediaItem[];
  placeholder?: boolean;
  placeholderImage?: string;
}

const PLACEHOLDER_FABRICS: Fabric[] = [
  {
    id: 1,
    name: "Emerald Sequin Lace",
    category: "Lace",
    description: "Quality emerald green lace with sequin details.",
    placeholder: true,
    placeholderImage: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=800&q=80",
    media: [],
  },
  {
    id: 2,
    name: "Champagne Gold Stones",
    category: "Stones",
    description: "Champagne-toned fabric with rhinestones.",
    placeholder: true,
    placeholderImage: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80",
    media: [],
  },
  {
    id: 3,
    name: "Burgundy Aso Ebi",
    category: "Aso Ebi",
    description: "Complete Aso Ebi package in rich burgundy.",
    placeholder: true,
    placeholderImage: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=800&q=80",
    media: [],
  },
  {
    id: 4,
    name: "Royal Blue Lace",
    category: "Lace",
    description: "Imported French lace in royal blue.",
    placeholder: true,
    placeholderImage: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80",
    media: [],
  },
  {
    id: 5,
    name: "Silver Sequin Net",
    category: "Sequins",
    description: "Dazzling silver sequin on soft net.",
    placeholder: true,
    placeholderImage: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=800&q=80",
    media: [],
  },
  {
    id: 6,
    name: "Coral Aso Ebi",
    category: "Aso Ebi",
    description: "Vibrant coral Aso Ebi with headtie.",
    placeholder: true,
    placeholderImage: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80",
    media: [],
  },
];

const WHATSAPP_NUMBER = "2348037892623";

// ── Single Fabric Card (Optimised for 2-column mobile grid) ───────────────
function FabricCard({ fabric }: { fabric: Fabric }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const hasMedia = !fabric.placeholder && fabric.media.length > 0;
  const activeMedia = hasMedia ? fabric.media[activeIndex] : null;
  const isVideo = activeMedia?.type === "video";
  const imgSrc = fabric.placeholder
    ? fabric.placeholderImage!
    : hasMedia
    ? fabric.media[0].url
    : "/hero-fabric.png";

  const inStock = fabric.in_stock !== false;
  const whatsappMessage = encodeURIComponent(
    inStock
      ? `Hi! I saw the "${fabric.name}" on your website.\n\nIs it available? How much is it?`
      : `Hi! I'm interested in the "${fabric.name}". Can you let me know when it's back in stock?`
  );

  return (
    <div
      className="fabric-card bg-white flex flex-col h-full border border-neutral-100 relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Media area */}
      <Link href={`/fabrics/${fabric.id}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 shrink-0">
        {isVideo && isHovering ? (
          <video
            src={activeMedia!.url}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={hasMedia ? fabric.media[activeIndex]?.url || imgSrc : imgSrc}
            alt={fabric.name}
            fill
            className="fabric-image object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center">
            <span className="bg-white text-foreground font-sans text-[9px] md:text-xs uppercase tracking-[0.2em] px-2 py-1 md:px-4 md:py-2 font-semibold shadow-md">
              Sold Out
            </span>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm text-foreground px-2 py-0.5 md:px-3 md:py-1 font-sans text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-semibold z-10 shadow-sm">
          {fabric.category}
        </span>

        {/* Video indicator */}
        {isVideo && !isHovering && (
          <span className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/60 text-white text-[8px] md:text-[10px] px-1.5 py-0.5 md:px-2 md:py-1 z-10 flex items-center gap-1 backdrop-blur-sm">
            ▶
          </span>
        )}

        {/* Image navigation (hidden on mobile, hover on desktop) */}
        {hasMedia && fabric.media.length > 1 && (
          <>
            <div
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveIndex((i) => (i === 0 ? fabric.media.length - 1 : i - 1));
              }}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-foreground w-7 h-7 items-center justify-center z-10 hover:bg-white transition-colors text-sm rounded-sm opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              ‹
            </div>
            <div
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveIndex((i) => (i === fabric.media.length - 1 ? 0 : i + 1));
              }}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-foreground w-7 h-7 items-center justify-center z-10 hover:bg-white transition-colors text-sm rounded-sm opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              ›
            </div>
            {/* Dots */}
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {fabric.media.map((_, i) => (
                <div
                  role="button"
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setActiveIndex(i);
                  }}
                  className={`h-1 transition-all rounded-full cursor-pointer ${
                    i === activeIndex ? "bg-white w-2 md:w-3" : "bg-white/50 w-1 md:w-1.5"
                  }`}
                />
              ))}
            </div>
          </>
        )}
          {/* Share button */}
          {!fabric.placeholder && <ShareBtn fabricId={fabric.id} fabricName={fabric.name} />}
        </div>
      </Link>

      {/* Info area */}
      <div className="p-3 md:p-5 flex flex-col grow justify-between bg-white">
        <div>
          <h4 className="font-serif text-sm md:text-lg mb-1 md:mb-2 line-clamp-1 leading-tight">
            {fabric.name}
          </h4>
          <p className="text-foreground/50 font-sans text-[10px] md:text-xs font-light leading-snug line-clamp-2">
            {fabric.description || "Quality fabric from House of Joy."}
          </p>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-3 md:mt-4 flex items-center justify-center gap-1.5 py-3 md:py-3.5 uppercase tracking-[0.1em] font-sans text-[10px] md:text-[11px] font-semibold w-full transition-colors ${
            inStock
              ? "bg-primary text-white hover:bg-primary-light"
              : "bg-neutral-100 text-foreground/40 pointer-events-none"
          }`}
        >
          {/* WhatsApp icon */}
          {inStock && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.528 5.845L.057 23.882a.75.75 0 00.921.921l6.037-1.471A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.98-1.371l-.356-.214-3.693.9.916-3.594-.233-.371A9.713 9.713 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
            </svg>
          )}
          <span>{inStock ? "Order" : "Sold Out"}</span>
        </a>
      </div>
    </div>
  );
}

// ── Share Button (on card) ───────────────────────────────────────────────
function ShareBtn({ fabricId, fabricName }: { fabricId: number; fabricName: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/fabrics/${fabricId}`;
    const text = `Check out this fabric from House of Joy! 🛍️\n\n${fabricName}\n\n${url}`;

    if (navigator.share) {
      try { await navigator.share({ title: fabricName, text, url }); return; } catch { return; }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleShare}
      title="Share this fabric"
      className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-sm w-8 h-8 flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer"
    >
      {copied ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-green-500">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-foreground/70">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      )}
    </div>
  );
}
export default function Collection({ fabrics }: { fabrics: Fabric[] }) {
  const displayFabrics = fabrics.length > 0 ? fabrics : PLACEHOLDER_FABRICS;

  const categories = [
    "All",
    ...Array.from(new Set(displayFabrics.map((f) => f.category))),
  ];

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = displayFabrics
    .filter((f) =>
      activeCategory === "All" ? true : f.category === activeCategory
    )
    .filter((f) => {
      const q = search.toLowerCase();
      return (
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        (f.description || "").toLowerCase().includes(q)
      );
    });

  return (
    <section
      id="fabrics"
      className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-background text-foreground"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <p className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent-dark font-semibold mb-3">
            What We Sell
          </p>
          <div className="gold-divider mb-4 md:mb-6" />
          <h3 className="font-serif text-3xl md:text-5xl text-foreground mb-3">
            Our Fabrics
          </h3>
          <p className="font-sans text-sm md:text-base text-foreground/60 max-w-lg mx-auto font-light leading-relaxed">
            Tap any fabric to order directly on WhatsApp.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mx-auto mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fabrics e.g. blue lace…"
            className="w-full border border-foreground/15 bg-white px-4 py-2.5 pr-10 font-sans text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary transition-colors"
          />
          {search ? (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors text-lg leading-none"
            >
              ×
            </button>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          )}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 md:mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`border px-4 py-1.5 md:px-6 md:py-2 font-sans text-[9px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "border-foreground/20 text-foreground/60 hover:border-primary hover:text-primary bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
        {filtered.length === 0 ? (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-serif text-2xl text-foreground/40 mb-2">No fabrics found</p>
            <p className="font-sans text-sm text-foreground/30">
              Try a different search or category
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-6 border border-foreground/20 text-foreground/50 px-6 py-2 font-sans text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {filtered.map((fabric) => (
              <FabricCard key={fabric.id} fabric={fabric} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

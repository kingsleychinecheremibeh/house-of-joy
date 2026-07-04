"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Fabric, FabricMedia } from "@/lib/db";

const WHATSAPP_NUMBER = "2348037892623";

// ── Share Button ──────────────────────────────────────────────────────────
function ShareButton({ fabricName }: { fabricName: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out this fabric from House of Joy! 🛍️\n\n${fabricName}\n\n${url}`;

    // Use native share sheet on mobile (WhatsApp, etc.)
    if (navigator.share) {
      try {
        await navigator.share({ title: fabricName, text, url });
        return;
      } catch {
        // User cancelled — do nothing
        return;
      }
    }

    // Fallback: copy link to clipboard on desktop
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 border border-foreground/20 text-foreground/60 px-5 py-3 font-sans text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Link Copied!
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}

// Maps color names Joy types (e.g. "Wine Red") to a CSS color for the dot
function colorNameToHex(name: string): string {
  const map: Record<string, string> = {
    "red": "#e63946", "wine": "#722f37", "wine red": "#722f37", "burgundy": "#800020",
    "maroon": "#800000", "rose": "#ff007f", "pink": "#ff69b4", "blush": "#f4a7b9",
    "coral": "#ff6b6b", "fuchsia": "#ff00ff", "magenta": "#c9184a",
    "blue": "#1d3557", "royal blue": "#4169e1", "navy": "#001f5b", "navy blue": "#001f5b",
    "sky blue": "#87ceeb", "cobalt": "#0047ab", "teal": "#008080", "turquoise": "#40e0d0",
    "ice blue": "#b0e0e6", "powder blue": "#b0d4e3",
    "green": "#2d6a4f", "emerald": "#50c878", "olive": "#808000", "sage": "#87ae73",
    "mint": "#98ff98", "forest": "#228b22",
    "white": "#f5f5f0", "cream": "#fffdd0", "ivory": "#fffff0", "off white": "#f8f8f0",
    "black": "#1a1a1a", "charcoal": "#36454f", "grey": "#808080", "gray": "#808080",
    "silver": "#c0c0c0", "nude": "#e3bc9a", "beige": "#f5f0e1", "camel": "#c19a6b",
    "khaki": "#c3b091",
    "brown": "#795548", "chocolate": "#3d1c02", "coffee": "#6f4e37", "mocha": "#967969",
    "gold": "#d4af37", "yellow": "#ffd700", "champagne": "#f7e7ce", "mustard": "#ffdb58",
    "amber": "#ffbf00",
    "purple": "#6a0572", "lilac": "#c8a2c8", "lavender": "#e6e6fa", "plum": "#8e4585",
    "violet": "#7f00ff", "mauve": "#e0b0ff",
    "orange": "#ff7518", "peach": "#ffcba4", "tangerine": "#f28500",
  };
  const key = name.toLowerCase().trim();
  return map[key] ?? "#d4af37";
}

// ── Media Gallery ─────────────────────────────────────────────────────────
function MediaGallery({ media, name }: { media: FabricMedia[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = media[active];
  const isVideo = current?.type === "video";

  if (media.length === 0) {
    return (
      <div className="relative aspect-4/5 bg-neutral-100 w-full flex items-center justify-center">
        <span className="text-foreground/30 font-sans text-sm">No photos yet</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main media */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-neutral-100">
        {isVideo ? (
          <video
            src={current.url}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={current.url}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}
      </div>

      {/* Color dots (if any media has color_tag) */}
      {media.some(m => m.color_tag) && (
        <div className="flex flex-wrap gap-2 items-center py-1">
          {media.map((item, i) =>
            item.color_tag ? (
              <button
                key={`color-${item.id}`}
                title={item.color_tag}
                onClick={() => setActive(i)}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  i === active ? "border-accent scale-110" : "border-transparent"
                }`}
                style={{
                  background: colorNameToHex(item.color_tag),
                  boxShadow: i === active ? '0 0 0 2px #d4af37' : 'inset 0 0 0 1px rgba(0,0,0,0.15)'
                }}
              />
            ) : null
          )}
        </div>
      )}

      {/* Thumbnail strip */}
      {media.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {media.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 overflow-hidden border-2 transition-all ${
                i === active ? "border-primary" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                  <span className="text-foreground/50 text-lg">▶</span>
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={`${name} view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Related Fabric Card ────────────────────────────────────────────────────
function RelatedCard({ fabric }: { fabric: Fabric }) {
  const thumb = fabric.media[0]?.url;
  return (
    <Link href={`/fabrics/${fabric.id}`} className="group block">
      <div className="relative aspect-4/5 overflow-hidden bg-neutral-100 mb-3">
        {thumb ? (
          <Image
            src={thumb}
            alt={fabric.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100" />
        )}
      </div>
      <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent-dark mb-1">{fabric.category}</p>
      <p className="font-serif text-base">{fabric.name}</p>
    </Link>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────
export default function FabricDetailClient({
  fabric,
  related,
}: {
  fabric: Fabric;
  related: Fabric[];
}) {
  const inStock = fabric.in_stock !== false;

  const handleWhatsApp = (e: React.MouseEvent, isWaitlist: boolean = false) => {
    e.preventDefault();
    const pageUrl = window.location.href;
    const msg = isWaitlist
      ? `Hi Joy! 👋\n\nI'm interested in the "${fabric.name}". Can you let me know when it's back in stock?\n\nLink: ${pageUrl}`
      : `Hi Joy! 👋\n\nI saw the "${fabric.name}" on your website.\n\nIs it available? How much is it?\n\nLink: ${pageUrl}`;
      
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };
  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg tracking-widest text-foreground">
            HOUSE OF <span className="text-accent">JOY</span>
          </Link>
          <Link
            href="/#fabrics"
            className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50 hover:text-primary transition-colors flex items-center gap-2"
          >
            ← All Fabrics
          </Link>
        </div>
      </header>

      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-10 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Left — Gallery */}
            <div>
              <MediaGallery media={fabric.media} name={fabric.name} />
            </div>

            {/* Right — Details */}
            <div className="flex flex-col justify-between gap-8">
              <div className="space-y-6">
                {/* Category + name */}
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent-dark font-semibold">
                    {fabric.category}
                  </span>
                  <h1 className="font-serif text-4xl md:text-5xl mt-2 leading-tight">
                    {fabric.name}
                  </h1>
                </div>

                <div className="gold-divider-left" />

                {/* Description */}
                <p className="font-sans text-base text-foreground/65 leading-relaxed font-light">
                  {fabric.description || "Quality fabric from House of Joy."}
                </p>

                {/* Availability */}
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${inStock ? "bg-green-500" : "bg-red-400"}`}
                  />
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/50">
                    {inStock ? "Available" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {/* WhatsApp CTA */}
                <button
                  onClick={(e) => handleWhatsApp(e, false)}
                  disabled={!inStock}
                  className={`flex items-center justify-center gap-2 w-full py-4 font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all ${
                    inStock
                      ? "bg-primary text-white hover:bg-primary-light cursor-pointer"
                      : "bg-neutral-100 text-foreground/40 pointer-events-none"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.528 5.845L.057 23.882a.75.75 0 00.921.921l6.037-1.471A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.98-1.371l-.356-.214-3.693.9.916-3.594-.233-.371A9.713 9.713 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                  </svg>
                  {inStock ? "Order on WhatsApp" : "Out of Stock"}
                </button>

                {/* Join waitlist if out of stock */}
                {!inStock && (
                  <button
                    onClick={(e) => handleWhatsApp(e, true)}
                    className="flex items-center justify-center gap-2 w-full py-4 font-sans text-xs uppercase tracking-[0.25em] font-semibold border border-foreground/20 text-foreground/60 hover:border-primary hover:text-primary transition-all cursor-pointer"
                  >
                    Join Waitlist
                  </button>
                )}

                {/* Share button */}
                <div className="flex gap-3">
                  <ShareButton fabricName={fabric.name} />
                  <Link
                    href="/#fabrics"
                    className="flex-1 text-center border border-foreground/20 text-foreground/60 px-5 py-3 font-sans text-xs uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all"
                  >
                    View All Fabrics
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related fabrics */}
          {related.length > 0 && (
            <div className="mt-20 md:mt-28">
              <div className="mb-10">
                <p className="font-sans text-xs uppercase tracking-[0.3em] text-accent-dark font-semibold mb-3">
                  More {fabric.category}
                </p>
                <div className="gold-divider-left" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {related.map((f) => (
                  <RelatedCard key={f.id} fabric={f} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20ba58] rounded-xl flex items-center justify-center shadow-xl transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.528 5.845L.057 23.882a.75.75 0 00.921.921l6.037-1.471A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.98-1.371l-.356-.214-3.693.9.916-3.594-.233-.371A9.713 9.713 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
        </svg>
      </a>
    </>
  );
}

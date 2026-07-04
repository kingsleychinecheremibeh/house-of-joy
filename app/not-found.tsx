"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Decorative line */}
      <div className="w-12 h-[1px] bg-accent mx-auto mb-8" />

      <p className="font-sans text-xs tracking-[0.3em] uppercase text-foreground/40 mb-4">
        404 — Page Not Found
      </p>

      <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6 leading-tight">
        Oops, this page<br />
        <span className="text-accent">doesn&apos;t exist.</span>
      </h1>

      <p className="font-sans text-sm text-foreground/50 max-w-sm mb-10 leading-relaxed">
        The fabric you&apos;re looking for may have sold out or been moved. Head back to the shop to see what&apos;s available.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="bg-primary text-white font-sans text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-primary-light transition-colors duration-300"
        >
          Back to Shop
        </Link>
        <a
          href="https://wa.me/2340000000000?text=Hi%20Joy!%20%F0%9F%91%8B%20I%20need%20help%20finding%20a%20fabric."
          target="_blank"
          rel="noopener noreferrer"
          className="border border-foreground/20 text-foreground font-sans text-xs uppercase tracking-[0.2em] px-8 py-4 hover:border-accent hover:text-accent transition-colors duration-300"
        >
          Ask on WhatsApp
        </a>
      </div>

      <div className="w-12 h-[1px] bg-accent mx-auto mt-12" />
    </div>
  );
}

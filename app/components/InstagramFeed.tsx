import React from 'react';

export default function InstagramFeed() {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden border-t border-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl md:text-5xl text-charcoal mb-4">
          Join the <span className="text-primary italic">#HouseOfJoy</span> Family
        </h2>
        <p className="font-sans text-sm md:text-base text-foreground/60 max-w-2xl mx-auto mb-12">
          Follow us on Instagram for the latest arrivals, styling inspiration, and behind-the-scenes looks.
        </p>

        {/* 
          INSTRUCTIONS:
          1. Go to elfsight.com and create a free Instagram Feed widget.
          2. Connect Joy's Instagram account to the widget.
          3. They will give you a script tag and a div (like <div class="elfsight-app-XYZ"></div>).
          4. Replace the placeholder div below with the code Elfsight gives you! 
          (Note: Make sure to change `class=` to `className=` if it's plain HTML).
        */}
        
        <div className="min-h-[300px] flex items-center justify-center bg-neutral-50 border border-neutral-200 p-8">
          <div className="text-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 mx-auto text-primary mb-4">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <p className="font-sans text-sm text-foreground/60 mb-2">Instagram feed will appear here</p>
            <p className="font-sans text-xs text-foreground/40 max-w-sm mx-auto">
              Create a free Elfsight widget and paste the code here. Instructions are hidden in the code for developers.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

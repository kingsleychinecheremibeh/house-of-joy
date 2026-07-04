import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://houseofjoy.vercel.app"),
  title: {
    default: "House of Joy | Premium Lace, Sequins & Asoebi Fabrics",
    template: "%s | House of Joy",
  },
  description:
    "Quality lace, sequins, stoned materials and Aso Ebi packages for weddings, parties, and every special occasion. Order directly on WhatsApp. Delivered anywhere in Nigeria.",
  keywords: [
    "asoebi fabrics",
    "luxury lace",
    "sequin fabric",
    "nigerian fabrics",
    "aso ebi materials",
    "house of joy",
    "wedding fabrics",
    "stoned fabrics",
    "lace fabric lagos",
    "fabric whatsapp nigeria",
  ],
  openGraph: {
    type: "website",
    siteName: "House of Joy",
    title: "House of Joy | Premium Lace, Sequins & Asoebi Fabrics",
    description:
      "Quality lace, sequins, stoned materials and Aso Ebi packages. Order on WhatsApp — delivered anywhere in Nigeria.",
    images: [
      {
        url: "/hero-fabric.png",
        width: 1200,
        height: 630,
        alt: "House of Joy — Premium Nigerian Fabrics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Joy | Premium Lace, Sequins & Asoebi Fabrics",
    description: "Quality lace, sequins, stoned materials and Aso Ebi packages. Order on WhatsApp.",
    images: ["/hero-fabric.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen font-sans text-foreground bg-background">
        {children}
      </body>
    </html>
  );
}

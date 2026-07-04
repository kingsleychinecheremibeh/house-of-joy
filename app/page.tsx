import { Suspense } from "react";
import { getFabrics } from "@/lib/db";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowToOrder from "./components/HowToOrder";
import About from "./components/About";
import Collection from "./components/Collection";
import FabricSkeleton from "./components/FabricSkeleton";
import CustomerGallery from "./components/Muses";
import Testimonials from "./components/Testimonials";
import FabricCare from "./components/FabricCare";
// import InstagramFeed from "./components/InstagramFeed";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import BackToTop from "./components/BackToTop";

export const revalidate = 60;

export default async function Home() {
  let fabrics: any[] = [];
  try {
    fabrics = (await getFabrics()) as any[];
  } catch {
    fabrics = [];
  }

  return (
    <>
      <Navbar />
      <Hero />
      <HowToOrder />
      <About />
      <Suspense fallback={<div className="py-24 px-6"><FabricSkeleton /></div>}>
        <Collection fabrics={fabrics} />
      </Suspense>
      <Testimonials />
      <CustomerGallery />
      <FabricCare />
      {/* <InstagramFeed /> */}
      <Contact />
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  );
}

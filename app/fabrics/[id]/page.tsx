// app/fabrics/[id]/page.tsx
import { notFound } from "next/navigation";
import { getFabricById, getFabrics } from "@/lib/db";
import type { Metadata } from "next";
import FabricDetailClient from "./FabricDetailClient";

type Props = { params: Promise<{ id: string }> };

// Pre-generate all fabric pages at build time
export async function generateStaticParams() {
  try {
    const fabrics = await getFabrics();
    return fabrics.map((f) => ({ id: String(f.id) }));
  } catch {
    return [];
  }
}

// Dynamic SEO meta per fabric
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const fabric = await getFabricById(Number(id));
  if (!fabric) return { title: "Fabric Not Found | House of Joy" };

  const image = fabric.media.find((m) => m.type === "image")?.url;

  return {
    title: `${fabric.name} | House of Joy`,
    description:
      fabric.description ||
      `Shop ${fabric.name} — quality ${fabric.category.toLowerCase()} fabric from House of Joy, Lagos.`,
    openGraph: {
      title: `${fabric.name} | House of Joy`,
      description: fabric.description,
      images: image ? [image] : [],
    },
  };
}

export const revalidate = 60;

export default async function FabricPage({ params }: Props) {
  const { id } = await params;
  const fabric = await getFabricById(Number(id));

  if (!fabric) notFound();

  // Get related fabrics (same category, exclude current)
  let related: Awaited<ReturnType<typeof getFabrics>> = [];
  try {
    const all = await getFabrics();
    related = all
      .filter((f) => f.category === fabric.category && f.id !== fabric.id)
      .slice(0, 3);
  } catch {
    related = [];
  }

  return <FabricDetailClient fabric={fabric} related={related} />;
}

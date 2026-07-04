export default function FabricSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col animate-pulse">
          {/* Image placeholder */}
          <div className="aspect-[3/4] bg-neutral-200" />
          {/* Info area */}
          <div className="p-3 md:p-5 bg-white flex flex-col gap-2">
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
            <div className="h-3 bg-neutral-100 rounded w-full" />
            <div className="h-3 bg-neutral-100 rounded w-2/3" />
            <div className="h-10 bg-neutral-200 rounded w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

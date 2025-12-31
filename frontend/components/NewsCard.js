import Image from "next/image";
import resolveImageSrc from "../lib/resolveImageSrc";

export default function NewsCard({ item }) {
  const dateLabel = item?.updated_at
    ? new Date(item.updated_at).toLocaleDateString()
    : "Recent update";

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)]">
      <div className="relative h-40 w-full bg-slate-100">
        {item?.image ? (
          <Image
            src={resolveImageSrc(item.image)}
            alt={item.title || "News update"}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            No Image
          </div>
        )}
      </div>

      <div className="space-y-4 p-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-600">
          Market Update
        </span>
        <h3 className="text-xl font-semibold text-slate-900">
          {item?.title || "Sunset Plaza Update"}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-3">
          {item?.description || "Latest insights from the Sunset Plaza team."}
        </p>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
          <span>{dateLabel}</span>
          <span className="text-amber-600">Read more</span>
        </div>
      </div>
    </article>
  );
}

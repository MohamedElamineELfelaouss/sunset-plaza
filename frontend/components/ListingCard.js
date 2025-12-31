import Image from "next/image";
import resolveImageSrc from "../lib/resolveImageSrc";

export default function ListingCard({ item, onViewDetails }) {
  const priceLabel = item?.price
    ? `$${Number(item.price).toLocaleString()}`
    : "Contact us";
  const dealLabels = {
    RENT: "For Rent",
    BUY: "For Sale",
    INVEST: "Invest",
  };
  const dealTones = {
    RENT: "border-amber-200 bg-amber-50 text-amber-700",
    BUY: "border-emerald-200 bg-emerald-50 text-emerald-700",
    INVEST: "border-indigo-200 bg-indigo-50 text-indigo-700",
  };
  const dealLabel = dealLabels[item?.deal_type];
  const topLabel = dealLabel || "Office";

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_80px_rgba(15,23,42,0.18)]">
      <div className="relative h-60 w-full bg-slate-100">
        {item?.image ? (
          <Image
            src={resolveImageSrc(item.image)}
            alt={item.title || "Listing image"}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-700">
          {topLabel}
        </span>
      </div>

      <div className="flex flex-col gap-5 p-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">
            {item?.title || "Untitled listing"}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">
            {item?.description || "No description available."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {item?.location || "Location TBD"}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {item?.surface_area ? `${item.surface_area} m2` : "Flexible area"}
          </span>
          {dealLabel ? (
            <span
              className={`rounded-full border px-3 py-1 ${dealTones[item.deal_type]}`}
            >
              {dealLabel}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
              Starting at
            </p>
            <p className="text-2xl font-semibold text-slate-900">
              {priceLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onViewDetails?.(item)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-amber-400 hover:text-slate-900"
          >
            View Details
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

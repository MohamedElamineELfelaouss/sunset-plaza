import { useEffect } from "react";
import Image from "next/image";
import resolveImageSrc from "../lib/resolveImageSrc";

export default function ListingModal({ open, item, onClose, loading, error }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const updatedLabel = item?.updated_at
    ? new Date(item.updated_at).toLocaleDateString()
    : "Recently";

  const priceLabel = item?.price
    ? `$${Number(item.price).toLocaleString()}`
    : "On Request";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4"
      onClick={(event) => event.target === event.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Listing details"
    >
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_40px_120px_rgba(15,23,42,0.4)]">
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="relative min-h-[240px] bg-slate-100 md:col-span-2">
            {item?.image ? (
              <Image
                src={resolveImageSrc(item.image)}
                alt={item.title || "Listing"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                No Preview
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent" />
            <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-700">
              {item?.content_type || "Listing"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm md:hidden"
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="relative space-y-6 p-8 md:col-span-3">
            <button
              type="button"
              onClick={onClose}
              className="hidden md:inline-flex absolute right-6 top-6 h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-500">
                Sunset Plaza Listing
              </p>
              <h2 className="mt-3 text-3xl font-serif text-slate-900">
                {item?.title || "Listing Details"}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge text={item?.location || "Casablanca, MA"} />
              <Badge
                text={
                  item?.surface_area
                    ? `${item.surface_area} m2`
                    : "Flexible Area"
                }
              />
              <Badge text={item?.status || "Available"} active />
            </div>

            <p className="text-base leading-relaxed text-slate-600">
              {item?.description || "Experience premium office standards..."}
            </p>

            {loading ? (
              <p className="text-sm text-amber-600">Syncing latest data...</p>
            ) : null}
            {error ? <p className="text-sm text-red-500">{error}</p> : null}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Monthly Rate
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {priceLabel}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Updated {updatedLabel}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-full border border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 transition hover:border-slate-300">
                  Schedule Visit
                </button>
                <button className="rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-amber-400 hover:text-slate-900">
                  Talk to Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ text, active }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {text}
    </span>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

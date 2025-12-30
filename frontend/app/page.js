"use client";

import { useState, useRef } from "react";
import ListingCard from "../components/ListingCard";
import ListingModal from "../components/ListingModal";
import Hero from "../components/Hero";
import useContent from "../hooks/useContent";

export default function Home() {
  // 1. Grab the 'error' from the hook now
  const { contents, loading, error } = useContent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const listingsRef = useRef(null);

  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const openDetails = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#f7f3ef]">
      <Hero onExplore={scrollToListings} />

      <section ref={listingsRef} className="relative py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-[-120px] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.22),transparent_60%)] blur-3xl" />
          <div className="absolute bottom-[-160px] left-[-120px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,116,144,0.18),transparent_60%)] blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-amber-600 font-semibold tracking-[0.35em] uppercase text-xs block mb-3">
                Our Portfolio
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-slate-900 font-medium mb-4">
                Available Spaces
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl font-light leading-relaxed">
                Browse our curated collection of executive plateaux built for
                focus, prestige, and long-term growth.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-slate-400">
              <span className="h-px w-10 bg-amber-400" />
              Casablanca, Morocco
            </div>
          </div>

          {/* --- DEBUGGING / STATES --- */}

          {/* State 1: Loading */}
          {loading && (
            <div className="rounded-3xl border border-amber-100 bg-white/80 py-20 text-center shadow-sm backdrop-blur">
              <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-400 text-sm uppercase tracking-[0.35em]">
                Loading Portfolio...
              </p>
            </div>
          )}

          {/* State 2: Error (The likely culprit) */}
          {!loading && error && (
            <div className="rounded-3xl border border-red-100 bg-red-50/80 py-10 text-center shadow-sm">
              <p className="text-red-600 font-semibold mb-2">
                Unable to load listings
              </p>
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <p className="text-xs text-gray-500">
                Make sure your Django Backend is running on port 8000.
              </p>
            </div>
          )}

          {/* State 3: Empty (No listings in DB) */}
          {!loading && !error && contents.length === 0 && (
            <div className="rounded-3xl border border-slate-100 bg-white/80 py-20 text-center shadow-sm">
              <p className="text-slate-500 font-serif text-xl">
                No spaces available at the moment.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Please check back later.
              </p>
            </div>
          )}

          {/* State 4: Success (Show Grid) */}
          {!loading && !error && contents.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {contents.map((item, index) => (
                <div
                  key={item.id}
                  className="motion-safe:animate-[fadeUp_0.8s_ease-out]"
                  style={{
                    animationDelay: `${index * 90}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <ListingCard item={item} onViewDetails={openDetails} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ListingModal
        open={isModalOpen}
        item={selectedItem}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

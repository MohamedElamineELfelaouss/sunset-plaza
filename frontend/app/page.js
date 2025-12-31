"use client";

import { useState, useRef } from "react";
import ListingCard from "../components/ListingCard";
import ListingModal from "../components/ListingModal";
import Hero from "../components/Hero";
import NewsCard from "../components/NewsCard";
import ChatbotWidget from "../components/ChatbotWidget";
import ContactSection from "../components/ContactSection";
import useContent from "../hooks/useContent";

export default function Home() {
  // 1. Grab the 'error' from the hook now
  const { contents, loading, error } = useContent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contactPrefill, setContactPrefill] = useState(null);
  const listingsRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const openDetails = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  const openContact = (intent, item, overrideMessage) => {
    const dealLabels = {
      RENT: "rent",
      BUY: "purchase",
      INVEST: "investment",
    };
    const messageBase = item?.title
      ? `I am interested in ${item.title}${
          item.location ? ` at ${item.location}` : ""
        }.`
      : "I would like to learn more about Sunset Plaza.";
    const dealNote = item?.deal_type
      ? ` I am exploring ${dealLabels[item.deal_type]} options.`
      : "";
    const requestType =
      intent === "MEETING"
        ? "MEETING"
        : item?.deal_type === "INVEST"
          ? "INVESTMENT"
          : "INFO";

    setContactPrefill({
      request_type: requestType,
      message: overrideMessage || `${messageBase}${dealNote}`,
    });
    setIsModalOpen(false);
    setTimeout(() => {
      contactRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const dealFilters = [
    { key: "ALL", label: "All spaces" },
    { key: "RENT", label: "For rent" },
    { key: "BUY", label: "For sale" },
    { key: "INVEST", label: "Invest" },
  ];
  const offices = contents.filter((item) => item.content_type !== "NEWS");
  const newsItems = contents.filter((item) => item.content_type === "NEWS");
  const filteredOffices =
    activeFilter === "ALL"
      ? offices
      : offices.filter((item) => item.deal_type === activeFilter);

  return (
    <main className="min-h-screen bg-[#f7f3ef] overflow-x-hidden">
      <Hero onExplore={scrollToListings} onChatOpen={openChat} />

      <section ref={listingsRef} className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-[-120px] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.22),transparent_60%)] blur-3xl" />
          <div className="absolute bottom-[-160px] left-[-120px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,116,144,0.18),transparent_60%)] blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
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

          <div className="rounded-3xl border border-white/70 bg-white/80 px-6 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                Filter by
              </span>
              <div className="flex flex-wrap gap-2">
                {dealFilters.map((filter) => {
                  const isActive = filter.key === activeFilter;
                  return (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => setActiveFilter(filter.key)}
                      className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] transition ${
                        isActive
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-transparent bg-transparent text-slate-500 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
              <span className="ml-auto text-[11px] uppercase tracking-[0.35em] text-slate-400">
                {filteredOffices.length} spaces
              </span>
            </div>
          </div>

          {/* State 1: Loading */}
          {loading && (
            <div className="mt-10 rounded-3xl border border-amber-100 bg-white/80 py-20 text-center shadow-sm backdrop-blur">
              <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-400 text-sm uppercase tracking-[0.35em]">
                Loading Portfolio...
              </p>
            </div>
          )}

          {/* State 2: Error (The likely culprit) */}
          {!loading && error && (
            <div className="mt-10 rounded-3xl border border-red-100 bg-red-50/80 py-10 text-center shadow-sm">
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
          {!loading && !error && offices.length === 0 && (
            <div className="mt-10 rounded-3xl border border-slate-100 bg-white/80 py-20 text-center shadow-sm">
              <p className="text-slate-500 font-serif text-xl">
                No spaces available at the moment.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Please check back later.
              </p>
            </div>
          )}

          {/* State 4: Success (Show Grid) */}
          {!loading &&
            !error &&
            offices.length > 0 &&
            filteredOffices.length === 0 && (
              <div className="mt-10 rounded-3xl border border-slate-100 bg-white/80 py-16 text-center shadow-sm">
                <p className="text-slate-600 font-serif text-lg">
                  No spaces match this filter.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try another category or clear the filter.
                </p>
              </div>
            )}

          {!loading && !error && filteredOffices.length > 0 && (
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredOffices.map((item, index) => (
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

      <ContactSection ref={contactRef} prefill={contactPrefill} />

      <section className="bg-white/70 py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-amber-600 font-semibold tracking-[0.35em] uppercase text-xs block mb-3">
                Latest Insights
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-slate-900 font-medium mb-4">
                Market Updates
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl font-light leading-relaxed">
                News, investment signals, and community updates from Sunset
                Plaza.
              </p>
            </div>
            <div className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Research Desk
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-100 bg-white/80 py-16 text-center shadow-sm">
              <p className="text-slate-400 text-sm uppercase tracking-[0.35em]">
                Loading updates...
              </p>
            </div>
          ) : newsItems.length === 0 ? (
            <div className="rounded-3xl border border-slate-100 bg-white/80 py-16 text-center shadow-sm">
              <p className="text-slate-500 font-serif text-lg">
                No news updates yet.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Check back soon for market insights.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {newsItems.slice(0, 6).map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ListingModal
        open={isModalOpen}
        item={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSchedule={(item) => openContact("MEETING", item)}
        onContact={(item) => openContact("INFO", item)}
      />

      <ChatbotWidget
        open={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
        onBookingForm={(message) => openContact("MEETING", null, message)}
      />
    </main>
  );
}

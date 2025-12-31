"use client";

import { forwardRef, useEffect, useState } from "react";
import api from "../lib/api";

const requestOptions = [
  { value: "INFO", label: "General information" },
  { value: "INVESTMENT", label: "Investment inquiry" },
  { value: "MEETING", label: "Book a private tour" },
];

const ContactSection = forwardRef(function ContactSection(
  { prefill },
  ref,
) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    request_type: "INFO",
    message: "",
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    if (!prefill) return;
    setForm((prev) => ({
      ...prev,
      ...prefill,
    }));
  }, [prefill]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "" });
    try {
      await api.post("/api/contacts/submit/", form);
      setStatus({
        type: "success",
        message: "Request received. Our concierge will reach out shortly.",
      });
      setForm((prev) => ({
        ...prev,
        message: "",
      }));
    } catch (error) {
      setStatus({
        type: "error",
        message:
          "We could not submit your request. Please try again or call us directly.",
      });
    }
  };

  return (
    <section ref={ref} className="relative overflow-hidden bg-slate-950 py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-[#0b1b36]" />
        <div className="absolute -top-24 left-1/3 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.2),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-120px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2),transparent_60%)] blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="text-white">
            <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-200">
              Private Concierge
            </span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl leading-tight">
              Reserve a private tour or request an investment brief.
            </h2>
            <p className="mt-6 text-lg text-slate-200 font-light leading-relaxed">
              Our advisory team curates bespoke workspace and investment options.
              Share your requirements and we will tailor a proposal within 24
              hours.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Concierge Line
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  +212 6 00 00 00 00
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Email
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  concierge@sunsetplaza.ma
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Address
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Casablanca Finance City
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Hours
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  Mon - Sat, 9:00 - 19:00
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white/95 p-8 shadow-[0_30px_70px_rgba(15,23,42,0.35)] backdrop-blur">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-amber-300 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-amber-300 focus:outline-none"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-amber-300 focus:outline-none"
                    placeholder="+212..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="request_type"
                    className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
                  >
                    Request type
                  </label>
                  <select
                    id="request_type"
                    name="request_type"
                    value={form.request_type}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-amber-300 focus:outline-none"
                  >
                    {requestOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-amber-300 focus:outline-none"
                  placeholder="Tell us about your preferred floor, budget, or schedule."
                />
              </div>

              <button
                type="submit"
                disabled={status.type === "loading"}
                className="w-full rounded-full bg-slate-900 px-6 py-4 text-xs font-semibold uppercase tracking-[0.35em] text-white transition hover:bg-amber-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Submit request
              </button>

              {status.type !== "idle" ? (
                <p
                  className={`text-sm ${
                    status.type === "success"
                      ? "text-emerald-600"
                      : status.type === "error"
                        ? "text-red-500"
                        : "text-slate-500"
                  }`}
                >
                  {status.message || "Submitting..."}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ContactSection;

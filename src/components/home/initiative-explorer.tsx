"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { upcomingInitiatives } from "@/data/programmes";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const categories = [
  "All",
  ...Array.from(new Set(upcomingInitiatives.map((item) => item.category))),
];

type Initiative = (typeof upcomingInitiatives)[number];

type InterestForm = {
  fullName: string;
  email: string;
  phone: string;
  consent: boolean;
};

const initialForm: InterestForm = {
  fullName: "",
  email: "",
  phone: "",
  consent: false,
};

export function InitiativeExplorer() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedInitiative, setSelectedInitiative] =
    useState<Initiative | null>(null);
  const [form, setForm] = useState<InterestForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const filteredInitiatives = useMemo(() => {
    if (activeCategory === "All") return upcomingInitiatives;

    return upcomingInitiatives.filter(
      (item) => item.category === activeCategory,
    );
  }, [activeCategory]);

  useEffect(() => {
    if (!selectedInitiative) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedInitiative(null);
        setForm(initialForm);
        setSuccess(false);
        setError("");
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedInitiative]);

  function openModal(initiative: Initiative) {
    setForm(initialForm);
    setSelectedInitiative(initiative);
    setSuccess(false);
    setError("");
  }

  function closeModal() {
    if (submitting) return;

    setSelectedInitiative(null);
    setForm(initialForm);
    setSuccess(false);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!selectedInitiative) return;

    if (!form.email.trim() && !form.phone.trim()) {
      setError("Please provide an email address or phone number.");
      return;
    }

    if (!form.consent) {
      setError("Please provide your consent before submitting.");
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError(
        "The interest form is not configured yet. Please try again later.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const { error: insertError } = await supabase
        .from("initiative_interests")
        .insert({
          full_name: form.fullName.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          initiative_title: selectedInitiative.title,
          consent: true,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setForm(initialForm);
    } catch {
      setError(
        "We could not submit your interest right now. Please try again later.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="programmes-title"
      className="home-initiatives section-pad"
    >
      <div className="initiative-explorer-heading">
        <div>
          <p className="eyebrow">Programme highlights</p>
          <h2 id="programmes-title">Ideas taking shape.</h2>
          <p className="initiative-explorer-intro">
            Explore initiatives being planned to encourage learning,
            confidence, well-being and participation.
          </p>
        </div>

        <span className="initiative-explorer-count">
          {upcomingInitiatives.length.toString().padStart(2, "0")} initiatives
        </span>
      </div>

      <div
        aria-label="Filter initiatives by category"
        className="initiative-explorer-filters"
      >
        {categories.map((category) => (
          <button
            aria-pressed={activeCategory === category}
            className={`initiative-explorer-filter ${
              activeCategory === category ? "active" : ""
            }`}
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="initiative-explorer-grid">
        {filteredInitiatives.map((initiative, index) => (
          <article className="initiative-explorer-card" key={initiative.title}>
            <div className="initiative-explorer-card-top">
              <span className="initiative-explorer-number">
                {String(upcomingInitiatives.indexOf(initiative) + 1).padStart(
                  2,
                  "0",
                )}
              </span>
              <span className="initiative-explorer-symbol" aria-hidden="true">
                {["✦", "❋", "◇", "◈"][
                  upcomingInitiatives.indexOf(initiative) % 4
                ]}
              </span>
            </div>

            <div className="initiative-explorer-tags">
              <span className="initiative-explorer-category">
                {initiative.category}
              </span>
              <span className="initiative-explorer-badge">
                {initiative.badge}
              </span>
            </div>

            <div className="initiative-explorer-content">
              <h3>{initiative.title}</h3>
              <p>{initiative.description}</p>
            </div>

            <div className="initiative-explorer-footer">
              <span>Planned initiative</span>
              <button
                className="initiative-explorer-interest"
                onClick={() => openModal(initiative)}
                type="button"
              >
                Express interest <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="initiative-explorer-disclaimer">
        These initiatives are planned activities. Dates and final arrangements
        will be communicated when confirmed.
      </p>

      {selectedInitiative && (
        <div
          className="initiative-explorer-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            aria-labelledby="initiative-interest-title"
            aria-modal="true"
            className="initiative-explorer-modal"
            role="dialog"
          >
            <button
              aria-label="Close interest form"
              className="initiative-explorer-close"
              onClick={closeModal}
              type="button"
            >
              ×
            </button>

            {!success ? (
              <>
                <p className="eyebrow">Get involved</p>
                <h2 id="initiative-interest-title">
                  Express your interest.
                </h2>
                <p className="initiative-explorer-modal-description">
                  Leave your details so the organisation can contact you when
                  further information is available.
                </p>

                <div className="initiative-explorer-selected">
                  <span>Selected initiative</span>
                  <strong>{selectedInitiative.title}</strong>
                </div>

                <form
                  className="initiative-explorer-form"
                  onSubmit={handleSubmit}
                >
                  <label htmlFor="initiative-full-name">Full name *</label>
                  <input
                    autoComplete="name"
                    id="initiative-full-name"
                    maxLength={100}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        fullName: event.target.value,
                      }))
                    }
                    placeholder="Enter your full name"
                    required
                    value={form.fullName}
                  />

                  <label htmlFor="initiative-email">Email address</label>
                  <input
                    autoComplete="email"
                    id="initiative-email"
                    maxLength={254}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="you@example.com"
                    type="email"
                    value={form.email}
                  />

                  <label htmlFor="initiative-phone">Phone number</label>
                  <input
                    autoComplete="tel"
                    id="initiative-phone"
                    maxLength={20}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="Enter your phone number"
                    type="tel"
                    value={form.phone}
                  />

                  <p className="initiative-explorer-hint">
                    Please provide at least one contact method: email or phone.
                  </p>

                  <label className="initiative-explorer-consent">
                    <input
                      checked={form.consent}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          consent: event.target.checked,
                        }))
                      }
                      required
                      type="checkbox"
                    />
                    <span>
                      I agree that Poornakanya Pratishthan may use these details
                      to contact me about this initiative.
                    </span>
                  </label>

                  {error && (
                    <p className="initiative-explorer-error" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    className="initiative-explorer-submit"
                    disabled={submitting}
                    type="submit"
                  >
                    {submitting ? "Submitting..." : "Submit interest"}
                  </button>
                </form>
              </>
            ) : (
              <div
                aria-live="polite"
                className="initiative-explorer-success"
              >
                <span
                  aria-hidden="true"
                  className="initiative-explorer-success-icon"
                >
                  ✓
                </span>
                <p className="eyebrow">Thank you</p>
                <h2 id="initiative-interest-title">
                  Your interest has been recorded.
                </h2>
                <p>
                  Thank you for expressing interest in{" "}
                  {selectedInitiative.title}. The organisation can contact you
                  when more information is available.
                </p>
                <button
                  className="initiative-explorer-submit"
                  onClick={closeModal}
                  type="button"
                >
                  Close
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

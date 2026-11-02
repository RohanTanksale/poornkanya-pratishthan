"use client";

import { useState, type FormEvent } from "react";

type Initiative = {
  title: string;
  description: string;
};

const categories = ["Culture", "Skill Development", "Education", "Wellness"];

export default function InitiativeInterestCards({
  initiatives,
}: {
  initiatives: readonly Initiative[];
}) {
  const [selected, setSelected] = useState<Initiative | null>(null);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");

  function closeModal() {
    setSelected(null);
    setEmail("");
    setNotice("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(
      "Preview only. This form is not connected to a submission service. Your details have not been sent or saved."
    );
  }

  return (
    <>
      <div className="initiative-interest-grid">
        {initiatives.map((item, index) => (
          <article className="initiative-interest-card" key={item.title}>
            <div className="initiative-interest-card-top">
              <span className="initiative-interest-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="initiative-category">
                {categories[index] ?? "Community"}
              </span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button
              className="initiative-interest-button"
              onClick={() => {
                setSelected(item);
                setNotice("");
              }}
              type="button"
            >
              Express Interest <span aria-hidden="true">↗</span>
            </button>
          </article>
        ))}
      </div>

      {selected && (
        <div
          className="initiative-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            aria-labelledby="initiative-modal-title"
            aria-modal="true"
            className="initiative-modal"
            role="dialog"
          >
            <button
              aria-label="Close dialog"
              className="initiative-modal-close"
              onClick={closeModal}
              type="button"
            >
              ×
            </button>

            <p className="initiative-modal-eyebrow">GET INVOLVED</p>
            <h2 id="initiative-modal-title">Express your interest</h2>
            <p className="initiative-modal-selected">
              Initiative: <strong>{selected.title}</strong>
            </p>
            <p className="initiative-modal-description">
              Share your email when the official interest registration service
              becomes available.
            </p>

            <form onSubmit={handleSubmit}>
              <label htmlFor="initiative-email">Email address</label>
              <input
                autoComplete="email"
                id="initiative-email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
              <p className="initiative-form-notice">
                Preview only. Do not enter personal information.
              </p>
              <button className="initiative-modal-submit" type="submit">
                Preview submission
              </button>
            </form>

            {notice && (
              <p className="initiative-modal-status" role="status">
                {notice}
              </p>
            )}

            <button
              className="initiative-modal-cancel"
              onClick={closeModal}
              type="button"
            >
              Close
            </button>
          </section>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type SubmissionState =
  | { status: "idle"; message: "" }
  | { status: "sending"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const initialState: SubmissionState = { status: "idle", message: "" };

const topics = [
  "General enquiry",
  "Programme information",
  "Volunteering",
  "Partnership",
  "Other",
];

export function ContactForm({ serviceReady }: { serviceReady: boolean }) {
  const [state, setState] = useState<SubmissionState>(initialState);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({ status: "sending", message: "Sending your message securely..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setState({
          status: "error",
          message: result.message ?? "Your message could not be sent. Please try again.",
        });
        return;
      }

      form.reset();
      setState({
        status: "success",
        message: result.message ?? "Thank you! Your message has been received.",
      });
    } catch {
      setState({
        status: "error",
        message: "We could not connect to the contact service. Please try again later.",
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="contact-name">Full name *</label>
        <input
          autoComplete="name"
          id="contact-name"
          maxLength={100}
          name="name"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="contact-email">Email address *</label>
        <input
          autoComplete="email"
          id="contact-email"
          maxLength={254}
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>

      <div className="form-field">
        <label htmlFor="contact-phone">Mobile number *</label>
        <input
          autoComplete="tel-national"
          id="contact-phone"
          inputMode="numeric"
          maxLength={10}
          minLength={10}
          name="phone"
          pattern="[6-9][0-9]{9}"
          placeholder="Enter 10-digit mobile number"
          required
          title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9."
          type="tel"
        />
        <small>Enter 10 digits without the +91 country code.</small>
      </div>

      <div className="form-field">
        <label htmlFor="contact-subject">What would you like to discuss? *</label>
        <select defaultValue="" id="contact-subject" name="subject" required>
          <option disabled value="">Select a topic</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="contact-message">Your message *</label>
        <textarea
          id="contact-message"
          maxLength={5000}
          name="message"
          placeholder="Tell us how we can help..."
          required
          rows={6}
        />
        <small>Maximum 5,000 characters.</small>
      </div>

      <div aria-hidden="true" className="honeypot">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          autoComplete="off"
          id="contact-website"
          name="website"
          tabIndex={-1}
        />
      </div>

      <button
        className="button"
        disabled={!serviceReady || state.status === "sending"}
        type="submit"
      >
        {state.status === "sending" ? "Sending..." : "Send message"}
        <span aria-hidden="true">→</span>
      </button>

      {!serviceReady && (
        <p className="form-feedback">
          Online message delivery is temporarily unavailable. Please try again later.
        </p>
      )}

      <p
        aria-live="polite"
        className={`form-feedback${state.status === "error" ? " is-error" : ""}${state.status === "success" ? " is-success" : ""}`}
        role={state.status === "error" ? "alert" : "status"}
      >
        {state.message}
      </p>
    </form>
  );
}
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

type SubmissionState = {
  status: "idle" | "sending" | "success" | "error";
  message: string;
};

const initialState: SubmissionState = { status: "idle", message: "" };

const copy = {
  name: "Full name",
  email: "Email address",
  phone: "Phone number",
  city: "City",
  age: "Age",
  ageHint: "The current eligibility age listed by the organisation is 15–25.",
  education: "Education or occupation",
  interests: "Interests, skills, or areas you would like to explore",
  experience: "Relevant experience",
  optional: "(optional)",
  availability: "Availability to participate",
  motivation: "Why would you like to join?",
  consent: "I agree that the organisation may use these details to review and respond to my application.",
  privacy: "Your details will be used to review your application. Read our ",
  submitting: "Submitting your application…",
  submit: "Submit application",
  sending: "Submitting…",
  failure: "Your application could not be submitted. Please try again later.",
  success: "Thank you. Your application has been submitted for review.",
} as const;

export function ApplicationForm() {
  const [state, setState] = useState(initialState);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setState({ status: "sending", message: copy.submitting });

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(values.entries()),
          consent: values.get("consent") === "on",
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setState({
          status: "error",
          message: result.message ?? copy.failure,
        });
        return;
      }

      form.reset();
      setState({
        status: "success",
        message: result.message ?? copy.success,
      });
    } catch {
      setState({
        status: "error",
        message: copy.failure,
      });
    }
  }

  return (
    <form className="contact-form application-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="application-name">{copy.name}</label>
        <input
          autoComplete="name"
          id="application-name"
          maxLength={100}
          name="name"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="application-email">{copy.email}</label>
        <input
          autoComplete="email"
          id="application-email"
          maxLength={254}
          name="email"
          required
          type="email"
        />
      </div>
      <div className="form-field">
        <label htmlFor="application-phone">{copy.phone}</label>
        <input
          autoComplete="tel"
          id="application-phone"
          maxLength={25}
          name="phone"
          required
          type="tel"
        />
      </div>
      <div className="form-field">
        <label htmlFor="application-city">{copy.city}</label>
        <input
          autoComplete="address-level2"
          id="application-city"
          maxLength={100}
          name="city"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="application-age">{copy.age}</label>
        <input
          id="application-age"
          max={25}
          min={15}
          name="age"
          required
          type="number"
        />
        <span className="admin-field-hint">
          {copy.ageHint}
        </span>
      </div>
      <div className="form-field">
        <label htmlFor="application-education">{copy.education}</label>
        <input
          id="application-education"
          maxLength={150}
          name="education"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="application-interests">
          {copy.interests}
        </label>
        <textarea
          id="application-interests"
          maxLength={1000}
          name="interests"
          required
          rows={3}
        />
      </div>
      <div className="form-field">
        <label htmlFor="application-experience">
          {copy.experience} <span className="admin-field-optional">{copy.optional}</span>
        </label>
        <textarea
          id="application-experience"
          maxLength={1000}
          name="experience"
          rows={3}
        />
      </div>
      <div className="form-field">
        <label htmlFor="application-availability">
          {copy.availability}
        </label>
        <textarea
          id="application-availability"
          maxLength={500}
          name="availability"
          required
          rows={3}
        />
      </div>
      <div className="form-field">
        <label htmlFor="application-message">{copy.motivation}</label>
        <textarea
          id="application-message"
          maxLength={2000}
          name="message"
          required
          rows={5}
        />
      </div>
      <div aria-hidden="true" className="honeypot">
        <label htmlFor="application-website">Leave this field empty</label>
        <input
          autoComplete="off"
          id="application-website"
          name="website"
          tabIndex={-1}
        />
      </div>
      <label className="application-consent">
        <input name="consent" required type="checkbox" />
        <span>
          {copy.consent}
        </span>
      </label>
      <p className="application-privacy-note">
        {copy.privacy}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <button
        className="button"
        disabled={state.status === "sending"}
        type="submit"
      >
        {state.status === "sending" ? copy.sending : copy.submit}
        <span aria-hidden="true">↗</span>
      </button>
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

"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type SubmissionState =
  | { status: "idle"; message: "" }
  | { status: "sending"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const initialState: SubmissionState = { status: "idle", message: "" };

export function ContactForm({
  serviceReady,
}: {
  serviceReady: boolean;
}) {
  const [state, setState] = useState<SubmissionState>(initialState);
  const copy = {
    name: "Your name",
    email: "Email address",
    subject: "What would you like to discuss?",
    choose: "Select a topic",
    message: "Your message",
    send: "Send message",
    sending: "Sending…",
    sendingMessage: "Sending your message…",
    failed: "Your message could not be sent. Please try again later.",
    serviceError: "We could not reach the contact service. Please try again later.",
    sent: "Thank you. Your message has been sent.",
    topics: ["General enquiry", "Programme information", "Volunteering", "Partnership", "Other"],
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState({ status: "sending", message: copy.sendingMessage });

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
          message: result.message ?? copy.failed,
        });
        return;
      }

      form.reset();
      setState({
        status: "success",
        message: result.message ?? copy.sent,
      });
    } catch {
      setState({
        status: "error",
        message: copy.serviceError,
      });
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="contact-name">{copy.name}</label>
        <input autoComplete="name" id="contact-name" maxLength={100} name="name" required />
      </div>
      <div className="form-field">
        <label htmlFor="contact-email">{copy.email}</label>
        <input
          autoComplete="email"
          id="contact-email"
          maxLength={254}
          name="email"
          required
          type="email"
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-subject">{copy.subject}</label>
        <select defaultValue="" id="contact-subject" name="subject" required>
          <option disabled value="">
            {copy.choose}
          </option>
          <option value="General enquiry">{copy.topics[0]}</option>
          <option value="Programme information">{copy.topics[1]}</option>
          <option value="Volunteering">{copy.topics[2]}</option>
          <option value="Partnership">{copy.topics[3]}</option>
          <option value="Other">{copy.topics[4]}</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">{copy.message}</label>
        <textarea
          id="contact-message"
          maxLength={5000}
          name="message"
          required
          rows={5}
        />
      </div>
      <div aria-hidden="true" className="honeypot">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input autoComplete="off" id="contact-website" name="website" tabIndex={-1} />
      </div>
      <button
        className="button"
        disabled={!serviceReady || state.status === "sending"}
        type="submit"
      >
        {state.status === "sending" ? copy.sending : copy.send}
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

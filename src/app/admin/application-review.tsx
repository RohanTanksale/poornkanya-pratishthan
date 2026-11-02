"use client";

import { useActionState } from "react";
import {
  updateMembershipApplicationStatus,
  type AdminActionState,
} from "@/app/admin/actions";

type MembershipApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  age: number | null;
  education: string | null;
  interests: string | null;
  experience: string | null;
  availability: string | null;
  message: string;
  status: "pending" | "reviewed" | "accepted" | "declined";
  created_at: string;
};

const initialState: AdminActionState = {};

function ApplicationStatusForm({
  application,
}: {
  application: MembershipApplication;
}) {
  const [state, formAction, pending] = useActionState(
    updateMembershipApplicationStatus,
    initialState,
  );

  return (
    <form action={formAction} className="admin-application-status">
      <input name="id" type="hidden" value={application.id} />
      <label htmlFor={`application-status-${application.id}`}>Status</label>
      <select
        defaultValue={application.status}
        id={`application-status-${application.id}`}
        key={application.status}
        name="status"
      >
        <option value="pending">Pending</option>
        <option value="reviewed">Reviewed</option>
        <option value="accepted">Accepted</option>
        <option value="declined">Declined</option>
      </select>
      <button className="button button-secondary" disabled={pending} type="submit">
        {pending ? "Saving..." : "Update"}
      </button>
      {state.error ? (
        <p className="admin-form-message is-error" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="admin-form-message is-success" role="status">
          {state.success}
        </p>
      ) : null}
    </form>
  );
}

export function ApplicationReview({
  applications,
}: {
  applications: MembershipApplication[];
}) {
  if (applications.length === 0) {
    return (
      <p className="admin-application-empty">
        No membership applications have been submitted yet.
      </p>
    );
  }

  return (
    <ul className="admin-application-list">
      {applications.map((application) => (
        <li className="admin-application-card" key={application.id}>
          <div className="admin-application-heading">
            <h3>{application.name}</h3>
            <p className="admin-application-date">
              Submitted{" "}
              {new Date(application.created_at).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <p className="admin-application-meta">
            Age {application.age ?? "—"} · {application.city} ·{" "}
            <a href={`mailto:${application.email}`}>{application.email}</a> ·{" "}
            <a href={`tel:${application.phone}`}>{application.phone}</a>
          </p>
          <p className="admin-application-message">
            Education/occupation: {application.education ?? "—"}
          </p>
          <p className="admin-application-message">
            Interests and skills: {application.interests ?? "—"}
          </p>
          <p className="admin-application-message">
            Relevant experience: {application.experience || "Not provided"}
          </p>
          <p className="admin-application-message">
            Availability: {application.availability ?? "—"}
          </p>
          <p className="admin-application-message">
            Motivation: {application.message}
          </p>
          <ApplicationStatusForm application={application} />
        </li>
      ))}
    </ul>
  );
}

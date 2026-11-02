"use client";

import { useActionState } from "react";
import { leadershipRoles } from "@/data/leadership";
import {
  addLeadershipMember,
  type AdminActionState,
} from "@/app/admin/actions";

const initialState: AdminActionState = {};

export function MemberForm() {
  const [state, formAction, pending] = useActionState(
    addLeadershipMember,
    initialState,
  );

  return (
    <form action={formAction} className="admin-form">
      <label>
        Full name
        <input name="name" required maxLength={100} />
      </label>
      <label>
        Official designation
        <select name="role" required defaultValue="">
          <option disabled value="">
            Select a designation
          </option>
          {leadershipRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </label>
      <label>
        Portrait image path <span className="admin-field-optional">(optional)</span>
        <input
          autoComplete="off"
          name="photoSrc"
          placeholder="/images/leadership/member-name.jpg"
          type="text"
          maxLength={300}
        />
        <span className="admin-field-hint">
          Add the approved image under public/images/ first.
        </span>
      </label>
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
      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? "Adding member..." : "Add member"}
      </button>
    </form>
  );
}

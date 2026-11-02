"use client";

import { useActionState } from "react";
import {
  grantAdminAccess,
  revokeAdminAccess,
  type AdminActionState,
} from "@/app/admin/actions";

type AdminAccessRecord = {
  email: string;
  granted_by: string;
  created_at: string;
};

const initialState: AdminActionState = {};

function RevokeAdminButton({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(
    revokeAdminAccess,
    initialState,
  );

  return (
    <div className="admin-access-action">
      <form action={formAction}>
        <input name="email" type="hidden" value={email} />
        <button className="button button-secondary" disabled={pending} type="submit">
          {pending ? "Removing..." : "Revoke access"}
        </button>
      </form>
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
    </div>
  );
}

export function AdminAccessManager({
  admins,
  superAdminEmail,
}: {
  admins: AdminAccessRecord[];
  superAdminEmail: string;
}) {
  const [state, formAction, pending] = useActionState(
    grantAdminAccess,
    initialState,
  );

  return (
    <div className="admin-access-manager">
      <form action={formAction} className="admin-form admin-grant-form">
        <label>
          Existing Supabase Auth account email
          <input
            autoComplete="off"
            name="email"
            required
            type="email"
            maxLength={254}
          />
        </label>
        <p className="admin-field-hint">
          Create the account in Supabase Authentication before granting access.
        </p>
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
          {pending ? "Granting access..." : "Grant admin access"}
        </button>
      </form>

      <ul className="admin-access-list">
        <li className="admin-access-row">
          <div>
            <strong>{superAdminEmail}</strong>
            <span>Protected super admin</span>
          </div>
        </li>
        {admins.map((admin) => (
          <li className="admin-access-row" key={admin.email}>
            <div>
              <strong>{admin.email}</strong>
              <span>Access granted by {admin.granted_by}</span>
            </div>
            <RevokeAdminButton email={admin.email} />
          </li>
        ))}
        {admins.length === 0 ? (
          <li className="admin-access-empty">No additional administrators yet.</li>
        ) : null}
      </ul>
    </div>
  );
}

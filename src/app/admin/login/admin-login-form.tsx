"use client";

import { useActionState } from "react";
import { signInAdmin, type AdminActionState } from "@/app/admin/actions";

const initialState: AdminActionState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(signInAdmin, initialState);

  return (
    <form action={formAction} className="admin-form">
      <label>
        Email
        <input
          autoComplete="username"
          name="email"
          required
          type="email"
          maxLength={254}
        />
      </label>
      <label>
        Password
        <input
          autoComplete="current-password"
          name="password"
          required
          type="password"
          maxLength={1024}
        />
      </label>
      {state.error ? (
        <p className="admin-form-message is-error" role="alert">
          {state.error}
        </p>
      ) : null}
      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

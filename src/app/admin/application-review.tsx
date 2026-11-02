"use client";

import { useActionState, useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  searchMembershipApplications,
  updateMembershipApplicationStatus,
  type AdminActionState,
} from "@/app/admin/actions";
import type { MembershipApplication } from "@/lib/admin-applications";

const initialState: AdminActionState = {};

function ApplicationStatusForm({
  application,
  onUpdated,
}: {
  application: MembershipApplication;
  onUpdated: (id: string, status: MembershipApplication["status"]) => void;
}) {
  const [state, formAction, pending] = useActionState(
    updateMembershipApplicationStatus,
    initialState,
  );
  const [status, setStatus] = useState(application.status);
  const lastSuccess = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state.success && state.success !== lastSuccess.current) {
      lastSuccess.current = state.success;
      onUpdated(application.id, status);
    }
  }, [application.id, onUpdated, state.success, status]);

  return (
    <form action={formAction} className="admin-application-status">
      <input name="id" type="hidden" value={application.id} />
      <label htmlFor={`application-status-${application.id}`}>Status</label>
      <select
        onChange={(event) =>
          setStatus(event.currentTarget.value as MembershipApplication["status"])
        }
        value={status}
        id={`application-status-${application.id}`}
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
  page: initialPage,
  pageCount: initialPageCount,
  pageSize,
  total: initialTotal,
}: {
  applications: MembershipApplication[];
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}) {
  const [visibleApplications, setVisibleApplications] = useState(applications);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [pageCount, setPageCount] = useState(initialPageCount);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | MembershipApplication["status"]>("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [appliedStatus, setAppliedStatus] = useState<
    "" | MembershipApplication["status"]
  >("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const loadApplications = useCallback(
    (nextPage: number, nextStatus: typeof status, nextQuery: string) => {
      setError("");
      startTransition(async () => {
        const result = await searchMembershipApplications({
          page: nextPage,
          query: nextQuery,
          status: nextStatus,
        });

        if ("error" in result) {
          setError(result.error ?? "Unable to search applications.");
          return;
        }

        setVisibleApplications(result.applications);
        setTotal(result.total);
        setPage(result.page);
        setPageCount(result.pageCount);
        setAppliedQuery(nextQuery);
        setAppliedStatus(nextStatus);
      });
    },
    [],
  );

  const refreshApplications = useCallback(
    (id: string, nextStatus: MembershipApplication["status"]) => {
      setVisibleApplications((current) =>
        current.map((application) =>
          application.id === id
            ? { ...application, status: nextStatus }
            : application,
        ),
      );
      loadApplications(page, appliedStatus, appliedQuery);
    },
    [appliedQuery, appliedStatus, loadApplications, page],
  );

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loadApplications(1, status, query.trim());
  }

  function clearFilters() {
    setQuery("");
    setStatus("");
    loadApplications(1, "", "");
  }

  if (
    visibleApplications.length === 0 &&
    total === 0 &&
    !appliedQuery &&
    !appliedStatus
  ) {
    return (
      <p className="admin-application-empty">
        No membership applications have been submitted yet.
      </p>
    );
  }

  return (
    <>
      <form className="admin-application-filters" onSubmit={handleSearch}>
        <label>
          Search applicant names
          <input
            autoComplete="off"
            maxLength={80}
            onChange={(event) => setQuery(event.currentTarget.value)}
            value={query}
          />
        </label>
        <label>
          Filter by status
          <select
            onChange={(event) =>
              setStatus(event.currentTarget.value as typeof status)
            }
            value={status}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </label>
        <button className="button button-secondary" disabled={isPending} type="submit">
          {isPending ? "Searching..." : "Search"}
        </button>
        <button
          className="button button-outline"
          disabled={isPending || (!query && !status)}
          onClick={clearFilters}
          type="button"
        >
          Clear
        </button>
      </form>
      {error ? <p className="admin-form-message is-error" role="alert">{error}</p> : null}
      <p aria-live="polite" className="admin-application-count">
        Showing {visibleApplications.length ? (page - 1) * pageSize + 1 : 0}
        {"–"}
        {(page - 1) * pageSize + visibleApplications.length} of {total} applications
      </p>
      {visibleApplications.length === 0 ? (
        <p className="admin-application-empty">
          No applications match these filters.
        </p>
      ) : (
        <ul className="admin-application-list" aria-busy={isPending}>
          {visibleApplications.map((application) => (
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
              <ApplicationStatusForm
                application={application}
                onUpdated={refreshApplications}
              />
            </li>
          ))}
        </ul>
      )}
      <nav aria-label="Membership application pages" className="admin-application-pagination">
        <button
          disabled={isPending || page <= 1}
          onClick={() => loadApplications(page - 1, appliedStatus, appliedQuery)}
          type="button"
        >
          Previous
        </button>
        <span>Page {page} of {pageCount}</span>
        <button
          disabled={isPending || page >= pageCount}
          onClick={() => loadApplications(page + 1, appliedStatus, appliedQuery)}
          type="button"
        >
          Next
        </button>
      </nav>
    </>
  );
}

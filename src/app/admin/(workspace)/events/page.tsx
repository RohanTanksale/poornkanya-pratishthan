import { PageHeader } from "@/components/admin/page-header";

const publicationStatuses = ["Draft", "Published", "Archived"] as const;
const eventStatuses = ["Scheduled", "Postponed", "Cancelled", "Completed"] as const;

function EventFormDesign({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const isEdit = mode === "edit";

  return (
    <section
      aria-labelledby={`event-${mode}-form-title`}
      className="admin-panel event-prototype-form-panel"
    >
      <p className="eyebrow">{isEdit ? "Edit form design" : "Create form design"}</p>
      <h2 id={`event-${mode}-form-title`}>
        {isEdit ? "Edit event" : "Create event"}
      </h2>
      {isEdit ? (
        <p className="admin-module-note">
          No event is selected. This form shows the planned fields only; no
          event data is loaded or modified.
        </p>
      ) : null}
      <p className="event-prototype-notice" role="note">
        Prototype only. Database persistence is not connected; all fields and
        the submit control are disabled.
      </p>
      <form className="admin-form">
        <fieldset aria-label={`${isEdit ? "Edit" : "Create"} event form preview`} disabled>
          <div className="event-prototype-form-grid">
            <label>
              Event title
              <input maxLength={180} name={`${mode}-title`} />
            </label>
            <label>
              URL slug
              <input maxLength={180} name={`${mode}-slug`} />
            </label>
            <label className="event-prototype-wide">
              Description
              <textarea maxLength={10000} name={`${mode}-description`} rows={5} />
            </label>
            <label>
              Start date and time
              <input name={`${mode}-starts-at`} type="datetime-local" />
            </label>
            <label>
              End date and time
              <input name={`${mode}-ends-at`} type="datetime-local" />
            </label>
            <label>
              Venue
              <input maxLength={180} name={`${mode}-venue`} />
            </label>
            <label>
              Location
              <input maxLength={300} name={`${mode}-location`} />
            </label>
            <label>
              Featured image
              <input accept="image/*" name={`${mode}-cover`} type="file" />
            </label>
            <label>
              Registration URL
              <input maxLength={2048} name={`${mode}-registration-url`} type="url" />
            </label>
            <label>
              Publication status
              <select defaultValue="draft" name={`${mode}-publication-status`}>
                {publicationStatuses.map((status) => (
                  <option key={status} value={status.toLowerCase()}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Event status
              <select defaultValue="scheduled" name={`${mode}-event-status`}>
                {eventStatuses.map((status) => (
                  <option key={status} value={status.toLowerCase()}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              SEO title
              <input maxLength={70} name={`${mode}-seo-title`} />
            </label>
            <label className="event-prototype-wide">
              SEO description
              <textarea maxLength={180} name={`${mode}-seo-description`} rows={3} />
            </label>
          </div>
          <button className="button button-primary" type="submit">
            {isEdit ? "Save changes" : "Save event"}
          </button>
        </fieldset>
      </form>
    </section>
  );
}

export default function EventsAdminPage() {
  return (
    <div className="admin-events-prototype">
      <PageHeader
        description="Review the planned editorial workflow. No event records are connected to the database."
        eyebrow="Content · prototype"
        title="Events"
      />
      <p className="event-prototype-notice" role="status">
        Prototype — pending database integration. This screen does not save,
        publish, or modify event information.
      </p>

      <section aria-labelledby="event-list-title" className="admin-panel">
        <div className="event-list-heading">
          <div>
            <p className="eyebrow">Event records</p>
            <h2 id="event-list-title">All events</h2>
          </div>
          <a className="button button-primary" href="#create-event-design">
            Create-event form design
          </a>
        </div>
        <p className="admin-access-note">
          Existing public event information remains source-managed on the public
          Events page. It has not been copied into this unconfigured CMS.
        </p>
        <div className="event-prototype-filters" aria-label="Planned event filters">
          <label>
            Search events
            <input disabled name="event-search" placeholder="Search title" />
          </label>
          <label>
            Publication status
            <select disabled defaultValue="all" name="event-publication-filter">
              <option value="all">All statuses</option>
              {publicationStatuses.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date range
            <select disabled defaultValue="all" name="event-date-filter">
              <option value="all">Upcoming and past</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </label>
        </div>
        <p className="admin-application-empty" role="status">
          No CMS event records are available. No sample or unverified events are
          shown.
        </p>
      </section>

      <section aria-labelledby="event-status-design-title" className="admin-panel">
        <p className="eyebrow">Status design</p>
        <h2 id="event-status-design-title">Planned status indicators</h2>
        <p className="admin-access-note">
          These are workflow labels, not statuses assigned to existing events.
        </p>
        <div className="event-status-design-list">
          {publicationStatuses.map((status) => (
            <span
              className={`event-status-chip is-${status.toLowerCase()}`}
              key={status}
            >
              {status}
            </span>
          ))}
        </div>
      </section>

      <div className="event-prototype-form-grid-sections">
        <div id="create-event-design">
          <EventFormDesign mode="create" />
        </div>
        <EventFormDesign mode="edit" />
      </div>
    </div>
  );
}

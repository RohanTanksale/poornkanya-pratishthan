"use client";

import { useState, type FormEvent } from "react";

const stages = [
  { name: "Individual", description: "Personal growth begins with self-awareness, values, education and confidence." },
  { name: "Family", description: "Strong individuals contribute to supportive, value-driven families." },
  { name: "Society", description: "Families and individuals work together to create a thoughtful and compassionate society." },
  { name: "Nation", description: "Responsible citizens contribute to the progress and well-being of the nation." },
  { name: "World", description: "Personal and collective development ultimately supports a harmonious world." }
];

const leaders = [
  { name: "Dr. R. P. Parnerkar", role: "Poornawad inspiration", initials: "RP", featured: true },
  { name: "Dr. V. R. Parnerkar", role: "Poornawad guidance", initials: "VR", featured: true },
  { name: "Bhavana Ramnath Iyer", role: "President", initials: "BI" },
  { name: "Rasika Hemant Joshi", role: "Vice President", initials: "RJ" },
  { name: "Sadhana Dnyanesh Sudame", role: "Working President", initials: "SS" },
  { name: "Avani Shinde", role: "Secretary", initials: "AS" },
  { name: "Kimaya Paithankar", role: "Joint Secretary", initials: "KP" },
  { name: "Kasturi Joshi", role: "Treasurer", initials: "KJ" },
  { name: "Ishani Kulkarni", role: "Joint Treasurer", initials: "IK" },
  { name: "Nishigandha Thadave", role: "Outreach Coordinator", initials: "NT" },
  { name: "Sampada Parnerkar", role: "Outreach Coordinator", initials: "SP" }
];

const initiatives = [
  { title: "Deepotsav", category: "Cultural", description: "Celebrate culture, togetherness and shared values through a community initiative." },
  { title: "International Women's Day", category: "Education", description: "Recognise women's contributions, potential and opportunities for growth." },
  { title: "Children's Day", category: "Cultural", description: "Encourage creativity, learning and positive values among children." },
  { title: "Mental Health Awareness", category: "Wellness", description: "Promote awareness, meaningful conversations and emotional well-being." },
  { title: "Monthly Branch Meetings", category: "Community", description: "Create opportunities for learning, discussion and connection." },
  { title: "Expert Guidance Sessions", category: "Education", description: "Learn from experienced speakers and subject matter experts." },
  { title: "NGO Collaborations", category: "Community", description: "Explore opportunities to work together on constructive social initiatives." },
  { title: "Educational Visits", category: "Education", description: "Learn through observation, interaction and shared experiences." }
];

export function FeatureSuite() {
  const [stage, setStage] = useState(0);
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const categories = ["All", ...Array.from(new Set(initiatives.map(item => item.category)))];
  const filtered = category === "All" ? initiatives : initiatives.filter(item => item.category === category);

  function closeModal() {
    setSelected("");
    setStatus("");
    setName("");
    setContact("");
    setConsent(false);
  }

  async function submitInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!name.trim() || !contact.trim() || !selected || !consent) {
      setStatus("Please complete all required fields and provide consent.");
      return;
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      setStatus("Interest registration is not configured yet. Please contact the organisation directly.");
      return;
    }

    setSubmitting(true);

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(url, key);

      const { error } = await supabase.from("initiative_interests").insert({
        name: name.trim(),
        contact: contact.trim(),
        initiative: selected,
        consent
      });

      if (error) throw error;

      setStatus("Your interest has been submitted successfully.");
      setName("");
      setContact("");
      setConsent(false);
    } catch {
      setStatus("We could not submit your interest. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="feature-suite">
      <section className="feature-section" aria-labelledby="philosophy-flow-title">
        <div className="feature-heading">
          <p className="eyebrow">Our philosophy</p>
          <h2 id="philosophy-flow-title">Growth that reaches <em>the world.</em></h2>
          <p>Poornawadi development moves from individual transformation towards collective progress.</p>
        </div>

        <div className="philosophy-steps" role="group" aria-label="Poornawadi progression">
          {stages.map((item, index) => (
            <button
              key={item.name}
              type="button"
              className={`philosophy-step ${stage === index ? "is-active" : ""}`}
              aria-pressed={stage === index}
              onClick={() => setStage(index)}
            >
              <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <div className="philosophy-description" aria-live="polite">
          <span className="eyebrow">Stage {stage + 1} of 5</span>
          <h3>{stages[stage].name}</h3>
          <p>{stages[stage].description}</p>
        </div>
      </section>

      <section className="feature-section" aria-labelledby="leadership-title">
        <div className="feature-heading">
          <p className="eyebrow">Our people</p>
          <h2 id="leadership-title">Guidance, leadership <em>and service.</em></h2>
          <p>Meet the people associated with the organisation and its work.</p>
        </div>

        <div className="leadership-grid">
          {leaders.map(person => (
            <article className={`leader-card ${person.featured ? "leader-featured" : ""}`} key={person.name}>
              <div className="leader-monogram" aria-hidden="true">{person.initials}</div>
              <div>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-section" aria-labelledby="initiatives-title">
        <div className="feature-heading">
          <p className="eyebrow">Get involved</p>
          <h2 id="initiatives-title">Initiatives that create <em>impact.</em></h2>
          <p>Explore activities and opportunities to participate in the organisation's work.</p>
        </div>

        <div className="initiative-filters" aria-label="Filter initiatives">
          {categories.map(item => (
            <button
              key={item}
              type="button"
              className={category === item ? "filter-active" : ""}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="initiative-grid">
          {filtered.map(item => (
            <article className="initiative-card" key={item.title}>
              <span className="initiative-category">{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <button type="button" className="initiative-action" onClick={() => { setSelected(item.title); setStatus(""); }}>
                I'm interested <span aria-hidden="true">↗</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {selected && (
        <div className="initiative-modal-backdrop" onMouseDown={event => {
          if (event.target === event.currentTarget) closeModal();
        }}>
          <section className="initiative-modal" role="dialog" aria-modal="true" aria-labelledby="interest-title">
            <button type="button" className="modal-close" onClick={closeModal} aria-label="Close dialog">×</button>
            <p className="eyebrow">Participation enquiry</p>
            <h2 id="interest-title">Interested in {selected}?</h2>
            <form onSubmit={submitInterest}>
              <label htmlFor="interest-name">Your name</label>
              <input id="interest-name" value={name} onChange={event => setName(event.target.value)} required maxLength={100} />

              <label htmlFor="interest-contact">Contact number or email</label>
              <input id="interest-contact" value={contact} onChange={event => setContact(event.target.value)} required maxLength={150} />

              <label htmlFor="interest-initiative">Initiative</label>
              <select id="interest-initiative" value={selected} onChange={event => setSelected(event.target.value)} required>
                {initiatives.map(item => <option key={item.title} value={item.title}>{item.title}</option>)}
              </select>

              <label className="consent-label">
                <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required />
                I consent to the organisation using these details to respond to my enquiry.
              </label>

              <button className="interest-submit" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit interest"}
              </button>
              {status && <p className="interest-status" role="status">{status}</p>}
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import type { Branch } from "@/data/branches";

type BranchDirectoryProps = {
  branches: Branch[];
};

export function BranchDirectory({ branches }: BranchDirectoryProps) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");

  const filteredBranches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return branches.filter((branch) => {
      const matchesSearch =
        !query ||
        branch.name.toLowerCase().includes(query) ||
        branch.location.toLowerCase().includes(query);

      const isInternational = !branch.location
        .toLowerCase()
        .includes("maharashtra");

      const matchesRegion =
        region === "All" ||
        (region === "Maharashtra" &&
          branch.location.toLowerCase().includes("maharashtra")) ||
        (region === "International" && isInternational);

      return matchesSearch && matchesRegion;
    });
  }, [branches, search, region]);

  function handleTilt(event: MouseEvent<HTMLElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const rotateY = (x - 0.5) * 10;
    const rotateX = (0.5 - y) * 10;

    card.style.setProperty(
      "--card-tilt",
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px)`,
    );
  }

  function resetTilt(event: MouseEvent<HTMLElement>) {
    event.currentTarget.style.setProperty(
      "--card-tilt",
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)",
    );
  }

  return (
    <section className="branch-directory section-pad" aria-label="Branch directory">
      <div className="branch-directory-heading">
        <div>
          <span className="eyebrow">Our network</span>
          <h2>Discover our branches.</h2>
          <p>
            One shared purpose, connecting communities across India and beyond.
          </p>
        </div>
        <span className="branch-count">
          {filteredBranches.length}{" "}
          {filteredBranches.length === 1 ? "branch" : "branches"}
        </span>
      </div>

      <div className="branch-directory-controls">
        <label className="branch-search">
          <span className="sr-only">Search branches</span>
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Search by branch or location..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="branch-filters" aria-label="Filter branches by region">
          {["All", "Maharashtra", "International"].map((item) => (
            <button
              type="button"
              key={item}
              className={region === item ? "active" : ""}
              aria-pressed={region === item}
              onClick={() => setRegion(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filteredBranches.length > 0 ? (
        <div className="branch-directory-grid">
          {filteredBranches.map((branch, index) => (
            <article
              className="branch-directory-card"
              key={branch.location}
              style={{ "--card-index": index } as CSSProperties}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
            >
              <div className="branch-card-topline">
                <span className="branch-card-symbol" aria-hidden="true">
                  ✦
                </span>
                <span className="branch-card-label">OUR BRANCH</span>
              </div>

              <div className="branch-card-content">
                <h3>{branch.name}</h3>
                <p className="branch-location">
                  <span aria-hidden="true">⌖</span>
                  {branch.location}
                </p>
              </div>

              <div className="branch-card-bottom">
                <span>Connected by shared values</span>
                <span aria-hidden="true">↗</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="branch-empty-state">
          <span aria-hidden="true">⌕</span>
          <h3>No branches found</h3>
          <p>Try another search term or change the selected region.</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setRegion("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

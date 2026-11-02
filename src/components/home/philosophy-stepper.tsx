"use client";

import { useState } from "react";

const philosophyStages = [
  {
    number: "01",
    title: "Individual",
    description:
      "Personal development begins with self-awareness, learning, values and the cultivation of one's potential.",
  },
  {
    number: "02",
    title: "Family",
    description:
      "A developed individual contributes to a supportive family through understanding, responsibility and mutual respect.",
  },
  {
    number: "03",
    title: "Society",
    description:
      "Strong families contribute to a society built on cooperation, compassion and shared responsibility.",
  },
  {
    number: "04",
    title: "Nation",
    description:
      "Responsible citizens strengthen the nation through constructive participation and service.",
  },
  {
    number: "05",
    title: "World",
    description:
      "The journey extends towards a world shaped by harmony, understanding and collective wellbeing.",
  },
];

export function PhilosophyStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const activeStage = philosophyStages[activeStep];

  return (
    <div className="philosophy-stepper">
      <div
        className="philosophy-track"
        role="group"
        aria-label="Poornawad philosophy progression"
      >
        {philosophyStages.map((stage, index) => (
          <button
            key={stage.title}
            type="button"
            className={`philosophy-step ${
              activeStep === index ? "active" : ""
            }`}
            onClick={() => setActiveStep(index)}
            onMouseEnter={() => setActiveStep(index)}
            onFocus={() => setActiveStep(index)}
            aria-pressed={activeStep === index}
          >
            <span className="step-number">{stage.number}</span>
            <span className="step-title">{stage.title}</span>
          </button>
        ))}
      </div>

      <div className="philosophy-detail" aria-live="polite">
        <span className="detail-label">
          STEP {activeStage.number} · THE JOURNEY
        </span>
        <h4>{activeStage.title}</h4>
        <p>{activeStage.description}</p>
      </div>
    </div>
  );
}

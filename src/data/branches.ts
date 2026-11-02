export type Branch = {
  name: string;
  location: string;
  address: string;
  email?: string;
  phone?: string;
  mapUrl?: string;
};

export const branches: Branch[] = [];

export const historicalRegions = [
  "Maharashtra",
  "Madhya Pradesh",
  "Uttar Pradesh",
  "Goa",
  "Mauritius",
] as const;

export const initialPhaseFigures = {
  branches: 30,
  members: 500,
  label: "Historical figures from the organisation's initial phase",
} as const;

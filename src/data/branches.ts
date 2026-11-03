export type Branch = {
  name: string;
  location: string;
  address?: string;
  email?: string;
  phone?: string;
  mapUrl?: string;
};

export const branches: Branch[] = [
  { name: "Parner Branch", location: "Parner, Maharashtra" },
  { name: "Pune Branch", location: "Pune, Maharashtra" },
  { name: "Chhatrapati Sambhajinagar Branch", location: "Chhatrapati Sambhajinagar, Maharashtra" },
  { name: "Mauritius Branch", location: "Mauritius" },
  { name: "Nashik Branch", location: "Nashik, Maharashtra" },
];

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

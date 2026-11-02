export type Leader = {
  id?: string;
  name: string;
  role: string;
  photoSrc?: string;
};

export const leadershipRoles = [
  "President",
  "Vice President",
  "Working President",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Joint Treasurer",
  "Outreach Coordinator",
] as const;

export const leadership: Leader[] = [
  { name: "Bhavana Ramnath Iyer", role: "President" },
  { name: "Rasika Hemant Joshi", role: "Vice President" },
  { name: "Sadhana Dnyanesh Sudame", role: "Working President" },
  { name: "Avani Shinde", role: "Secretary" },
  { name: "Kimaya Paithankar", role: "Joint Secretary" },
  { name: "Kasturi Joshi", role: "Treasurer" },
  { name: "Ishani Kulkarni", role: "Joint Treasurer" },
  { name: "Nishigandha Thadave", role: "Outreach Coordinator" },
  { name: "Sampada Parnerkar", role: "Outreach Coordinator" },
];

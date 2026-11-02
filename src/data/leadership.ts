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
  { name: "Ananya Sharma", role: "President" },
  { name: "Meera Deshmukh", role: "Vice President" },
  { name: "Kavya Patil", role: "Working President" },
  { name: "Aarohi Kulkarni", role: "Secretary" },
  { name: "Ira Joshi", role: "Joint Secretary" },
  { name: "Saanvi Mehta", role: "Treasurer" },
  { name: "Riya Nair", role: "Joint Treasurer" },
  { name: "Diya Shah", role: "Outreach Coordinator" },
  { name: "Tanvi Rao", role: "Outreach Coordinator" },
];
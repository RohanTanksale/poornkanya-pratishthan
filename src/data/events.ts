export type EventItem = {
  title: string;
  date: string;
  location: string;
  description: string;
};

export const saraswatiMahotsav = {
  title: "Saraswati Mahotsav — The First Celebration of Poornakanya Pratishthan",
  dates: "17 and 18 October",
  location: "Parner",
  occasion: "During Navratri, with the blessings of Param Pujya Dada.",
  summary:
    "Saraswati Mahotsav holds special significance as the first major celebration organised by Poornakanya Pratishthan. The year has not been supplied.",
  guests: [
    { name: "Dr. Vidya Kaware", designation: "Municipal President" },
    { name: "Ms. Shreya Naik", designation: "Psychological Counsellor" },
    {
      name: "Mrs. Sojwal Patil",
      designation: "Psychological Counsellor and Teacher",
    },
    {
      name: "Mrs. Pratibha Bhade",
      designation:
        "Guidance session on the life and biography of Sati Smt. Vimal Mata",
    },
  ],
  activities: [
    "Guidance session on the life of Sati Smt. Vimal Mata by Mrs. Pratibha Bhade.",
    "Worship of Goddess Saraswati.",
    "Mantrajagar ceremony conducted by Gattu Guruji and associates.",
    "Blessings for the newly established library.",
    "Garba Night for participating girls.",
  ],
} as const;

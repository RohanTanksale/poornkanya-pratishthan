import Link from "next/link";

type EventCardProps = {
  date: string;
  description: string;
  href: string;
  location: string;
  title: string;
};

export function EventCard({
  date,
  description,
  href,
  location,
  title,
}: EventCardProps) {
  return (
    <article className="event-card">
      <p className="eyebrow">{date}</p>
      <h3>{title}</h3>
      <p className="event-card-location">{location}</p>
      <p className="event-card-description">{description}</p>
      <Link className="text-link" href={href}>
        Read the event story <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}

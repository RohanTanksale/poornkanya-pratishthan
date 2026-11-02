import type { Leader } from "@/data/leadership";

type CommitteeMemberCardProps = {
  member: Leader;
  index: number;
  role?: string;
};

export function CommitteeMemberCard({
  member,
  index,
  role = member.role,
}: CommitteeMemberCardProps) {
  return (
    <article className="committee-member">
      <span aria-hidden="true" className="committee-number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2>{member.name}</h2>
      <p>{role}</p>
    </article>
  );
}

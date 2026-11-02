
import Image from "next/image";
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
  const nameParts = member.name.trim().split(/\s+/).filter(Boolean);

  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0]?.slice(0, 2) ?? "PP").toUpperCase();

  const photoSrc =
    member.photoSrc &&
    member.photoSrc.startsWith("/images/") &&
    !member.photoSrc.split("/").includes("..") &&
    /\.(avif|gif|jpe?g|png|webp)$/i.test(member.photoSrc)
      ? member.photoSrc
      : undefined;

  return (
    <article className="committee-member">
      <div className="committee-member-visual">
        {photoSrc ? (
          <div className="committee-member-photo">
            <Image
              alt={`Portrait of ${member.name}`}
              fill
              sizes="(max-width: 760px) 50vw, 30vw"
              src={photoSrc}
            />
          </div>
        ) : (
          <div className="committee-member-monogram" aria-hidden="true">
            <span>{initials}</span>
            <span className="monogram-decoration">✦</span>
          </div>
        )}
      </div>

      <span aria-hidden="true" className="committee-number">
        {String(index + 1).padStart(2, "0")}
      </span>

      <h2>{member.name}</h2>
      <p>{role}</p>
    </article>
  );
}

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
  const photoSrc =
    member.photoSrc &&
    /^\/images\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.(?:avif|gif|jpe?g|png|webp)$/i.test(
      member.photoSrc,
    ) &&
    !member.photoSrc.split("/").includes("..")
      ? member.photoSrc
      : undefined;

  return (
    <article className="committee-member">
      {photoSrc ? (
        <div className="committee-member-photo">
          <Image
            alt={`Portrait of ${member.name}`}
            fill
            sizes="(max-width: 760px) 50vw, 30vw"
            src={photoSrc}
          />
        </div>
      ) : null}
      <span aria-hidden="true" className="committee-number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2>{member.name}</h2>
      <p>{role}</p>
    </article>
  );
}

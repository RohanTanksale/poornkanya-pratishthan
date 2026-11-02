import Image from "next/image";

type PhilosophyProfileCardProps = {
  name: string;
  photoSrc?: string;
  information?: string;
};

export function PhilosophyProfileCard({
  name,
  photoSrc,
  information,
}: PhilosophyProfileCardProps) {
  return (
    <article className="philosophy-profile-card">
      <div className="philosophy-profile-photo">
        {photoSrc ? (
          <Image alt={name} fill sizes="(max-width: 760px) 100vw, 40vw" src={photoSrc} />
        ) : (
          <div className="philosophy-profile-photo-placeholder">
            <span aria-hidden="true" className="philosophy-profile-symbol">P</span>
            <span>Portrait to be added</span>
          </div>
        )}
      </div>
      <div className="philosophy-profile-copy">
        <h3>{name}</h3>
        <p>{information || "Profile information can be added here."}</p>
      </div>
    </article>
  );
}

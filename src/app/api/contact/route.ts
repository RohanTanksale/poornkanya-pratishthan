import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedSubjects = new Set([
  "General enquiry",
  "Programme information",
  "Volunteering",
  "Partnership",
  "Other",
]);

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

function isRecord(value: unknown): value is ContactPayload {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string";
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 12_000) {
    return NextResponse.json(
      { message: "The submitted form is too large." },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Please submit a valid form." }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return NextResponse.json({ message: "Please submit a valid form." }, { status: 400 });
  }

  const name = isText(payload.name) ? payload.name.trim() : "";
  const email = isText(payload.email) ? payload.email.trim() : "";
  const subject = isText(payload.subject) ? payload.subject.trim() : "";
  const message = isText(payload.message) ? payload.message.trim() : "";
  const website = isText(payload.website) ? payload.website.trim() : "";

  if (website) {
    return NextResponse.json(
      { message: "This submission could not be accepted." },
      { status: 400 },
    );
  }

  if (
    !name ||
    name.length > 100 ||
    !emailPattern.test(email) ||
    email.length > 254 ||
    !allowedSubjects.has(subject) ||
    !message ||
    message.length > 5000
  ) {
    return NextResponse.json(
      { message: "Please check your details and try again." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;
  const sender = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !recipient || !sender) {
    return NextResponse.json(
      { message: "Online message delivery is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10_000),
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `Website enquiry: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });
  } catch {
    return NextResponse.json(
      { message: "The email service could not be reached. Please try again later." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { message: "The message could not be delivered. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "Thank you. Your message has been sent." });
}

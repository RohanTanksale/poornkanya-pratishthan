import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d.\-\s]+$/;

type ApplicationPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  city?: unknown;
  age?: unknown;
  education?: unknown;
  interests?: unknown;
  experience?: unknown;
  availability?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
};

function isRecord(value: unknown): value is ApplicationPayload {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 8_000) {
    return NextResponse.json(
      { message: "The submitted form is too large." },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Please submit a valid application." },
      { status: 400 },
    );
  }

  if (!isRecord(payload)) {
    return NextResponse.json(
      { message: "Please submit a valid application." },
      { status: 400 },
    );
  }

  const name = text(payload.name);
  const email = text(payload.email).toLowerCase();
  const phone = text(payload.phone);
  const city = text(payload.city);
  const ageValue = Number(payload.age);
  const education = text(payload.education);
  const interests = text(payload.interests);
  const experience = text(payload.experience);
  const availability = text(payload.availability);
  const message = text(payload.message);
  const website = text(payload.website);

  if (website) {
    return NextResponse.json({ message: "Application received." });
  }

  if (
    !name ||
    name.length > 100 ||
    !emailPattern.test(email) ||
    email.length > 254 ||
    !phonePattern.test(phone) ||
    phone.replace(/\D/g, "").length < 7 ||
    phone.length > 25 ||
    !city ||
    city.length > 100 ||
    !Number.isInteger(ageValue) ||
    ageValue < 15 ||
    ageValue > 25 ||
    !education ||
    education.length > 150 ||
    !interests ||
    interests.length > 1000 ||
    experience.length > 1000 ||
    !availability ||
    availability.length > 500 ||
    !message ||
    message.length > 2000 ||
    payload.consent !== true
  ) {
    return NextResponse.json(
      { message: "Please check your details and consent, then try again." },
      { status: 400 },
    );
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    return NextResponse.json(
      { message: "Online applications are not available right now." },
      { status: 503 },
    );
  }

  const { error } = await createSupabaseServiceClient()
    .from("membership_applications")
    .insert({
      name,
      email,
      phone,
      city,
      age: ageValue,
      education,
      interests,
      experience: experience || null,
      availability,
      message,
    });

  if (error) {
    console.error("Unable to save membership application:", error.message);
    return NextResponse.json(
      { message: "We could not submit your application. Please try again later." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    message: "Thank you. Your application has been submitted for review.",
  });
}

import { auth } from "../../../auth";
import { NextResponse } from "next/server";

function createUsername(name: string | null | undefined) {
  return (
    (name || "user")
      .normalize("NFC")
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "") || "user"
  );
}

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  const username = createUsername(session.user.name);

  return NextResponse.redirect(
    new URL(`/user/${encodeURIComponent(username)}`, request.url)
  );
}
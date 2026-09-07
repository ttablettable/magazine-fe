import { NextResponse } from "next/server";
import { AuthenticationError } from "@/lib/auth/privy";
import { resolveAuthenticatedActor } from "@/lib/identity/actor";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await resolveAuthenticatedActor(request);
    return NextResponse.json({ actor });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("Failed to resolve authenticated actor");
    return NextResponse.json(
      { error: "Unable to resolve authenticated actor" },
      { status: 500 },
    );
  }
}

import { auth } from "@/auth";
import { setSettings } from "@/lib/settings";
import { settingsSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { getSettings } = await import("@/lib/settings");
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await setSettings(parsed.data as Record<string, string>);
  return NextResponse.json({ success: true });
}

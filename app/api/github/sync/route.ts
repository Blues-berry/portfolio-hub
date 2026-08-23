import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const expectedSecret = process.env.SYNC_SECRET;
  const authorization = request.headers.get("authorization");
  if (!expectedSecret || authorization !== `Bearer ${expectedSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return Response.json({ ok: true, refreshedAt: new Date().toISOString() });
}

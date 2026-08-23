import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";

export const runtime = "nodejs";

function isValidSignature(body: string, signature: string | null) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret || !signature?.startsWith("sha256=")) return false;

  const expected = Buffer.from(
    `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`,
  );
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  const body = await request.text();
  if (!isValidSignature(body, request.headers.get("x-hub-signature-256"))) {
    return Response.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  if (event === "push" || event === "repository") {
    revalidateTag("github-projects", "max");
    revalidatePath("/", "layout");
  }

  return Response.json({ ok: true, event });
}

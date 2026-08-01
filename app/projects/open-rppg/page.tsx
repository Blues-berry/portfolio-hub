import { redirect } from "next/navigation";
import { site } from "@/lib/site";

export default function OpenRppgPage() {
  redirect(`${site.openRppgDemoUrl}/#experience`);
}

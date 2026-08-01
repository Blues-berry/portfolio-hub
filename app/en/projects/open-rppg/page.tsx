import { redirect } from "next/navigation";
import { site } from "@/lib/site";

export default function EnglishOpenRppgPage() {
  redirect(`${site.openRppgDemoUrl}/#experience`);
}

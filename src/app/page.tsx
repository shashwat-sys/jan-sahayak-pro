import { redirect } from "next/navigation";

import JanSahayakPublicApp from "@/components/public/jan-sahayak-public-app";
import { getAdminSession } from "@/lib/server/auth";
import { isClerkConfigured } from "@/lib/server/env";

export default async function HomePage() {
  if (isClerkConfigured()) {
    const state = await getAdminSession();
    if (state.type === "admin") {
      redirect("/dashboard");
    }
  }

  return <JanSahayakPublicApp />;
}

import { SignIn } from "@clerk/nextjs";

import { Card } from "@/components/ui/card";
import { isClerkConfigured } from "@/lib/server/env";

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <div className="app-frame">
        <Card>
          <span className="section-kicker">Setup Required</span>
          <h1 className="page-title">Clerk is not configured yet.</h1>
          <p className="page-copy">
            Add your Clerk publishable and secret keys in <code>.env.local</code>, then restart the
            app.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="app-frame">
      <SignIn />
    </div>
  );
}

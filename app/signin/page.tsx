export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import SignInClient from "./SignInClient";

export default function Page() {
  return <SignInClient />;
}

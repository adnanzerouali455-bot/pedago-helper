"use client";

import dynamic from "next/dynamic";
import type { Profile } from "../utils/supabase/types";

const PedagoWorkspace = dynamic(() => import("../components/PedagoWorkspace"), {
  ssr: false,
  loading: () => <main role="status" className="flex min-h-screen items-center justify-center bg-parchment p-6 text-cypress">Pedago Helper</main>,
});

export default function WorkspaceClient({ initialProfile, account }: { initialProfile?: "teacher" | "student"; account?: Profile }) {
  return <PedagoWorkspace initialProfile={initialProfile} account={account} logoSrc="/pedago-helper-logo.jpeg" />;
}

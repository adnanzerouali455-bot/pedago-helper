"use client";

import dynamic from "next/dynamic";

const PedagoWorkspace = dynamic(() => import("../components/PedagoWorkspace"), {
  ssr: false,
  loading: () => <main role="status" className="flex min-h-screen items-center justify-center bg-parchment p-6 text-cypress">Pedago Helper</main>,
});

export default function WorkspaceClient() {
  return <PedagoWorkspace />;
}

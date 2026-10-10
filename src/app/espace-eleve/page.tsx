import WorkspaceClient from "../workspace-client";
import { requireRole } from "../../utils/supabase/guard";

export const dynamic = "force-dynamic";

export default async function StudentSpacePage() {
  const profile = await requireRole("student");
  return <WorkspaceClient initialProfile="student" account={profile} />;
}

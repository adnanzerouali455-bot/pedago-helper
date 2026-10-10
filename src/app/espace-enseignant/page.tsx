import WorkspaceClient from "../workspace-client";
import { requireRole } from "../../utils/supabase/guard";

export const dynamic = "force-dynamic";

export default async function TeacherSpacePage() {
  const profile = await requireRole("teacher");
  return <WorkspaceClient initialProfile="teacher" account={profile} />;
}

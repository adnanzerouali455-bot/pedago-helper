import SchoolDashboard from "../../components/auth/SchoolDashboard";
import { requireRole } from "../../utils/supabase/guard";

export const dynamic = "force-dynamic";

export default async function SchoolSpacePage() {
  const profile = await requireRole("school");
  return <SchoolDashboard profile={profile} />;
}

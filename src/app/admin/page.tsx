import { isAuthenticated } from "@/lib/admin/auth";
import { storageMode } from "@/lib/chat/store";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) return <AdminLogin />;
  return <AdminDashboard storageMode={storageMode} />;
}

import { redirect } from "next/navigation";

import AdminUsersTable from "@/components/AdminUsersTable";
import {
  getAllUsersForAdmin,
  getCurrentUser,
} from "@/lib/actions/auth.action";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");
  if (user.role !== "admin") redirect("/");

  const users = await getAllUsersForAdmin();
  const admins = users.filter((item) => item.role === "admin").length;
  const customers = users.filter((item) => item.role === "customer").length;

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-200">
          Admin Console
        </p>
        <h1>User roles and access</h1>
        <p>
          You can view all users and change roles. Customers cannot see this
          page or the admin navigation.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="dashboard-panel metric-card">
          <p>Total Users</p>
          <h2>{users.length}</h2>
        </div>
        <div className="dashboard-panel metric-card">
          <p>Admins</p>
          <h2>{admins}</h2>
        </div>
        <div className="dashboard-panel metric-card">
          <p>Customers</p>
          <h2>{customers}</h2>
        </div>
      </section>

      <AdminUsersTable users={users} />
    </div>
  );
}

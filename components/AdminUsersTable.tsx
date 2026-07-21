"use client";

import { useTransition } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { updateUserRole } from "@/lib/actions/auth.action";

export default function AdminUsersTable({ users }: { users: AdminUserRow[] }) {
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (userId: string, role: UserRole) => {
    startTransition(async () => {
      const result = await updateUserRole({
        userId,
        role,
      });

      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  };

  const roleSelectClass =
    "min-h-10 rounded-full border border-light-800 bg-dark-300 px-4 text-primary-200 max-sm:w-full";

  return (
    <div className="dashboard-panel admin-users-panel">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-5 text-primary-200" />
        <h2>Users</h2>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[680px] border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-sm text-light-100">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">User ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-dark-200/70">
                <td className="rounded-l-xl px-3 py-3 text-primary-100">
                  {user.name || "Unnamed"}
                </td>
                <td className="px-3 py-3 text-light-100">{user.email}</td>
                <td className="px-3 py-3">
                  <select
                    className={roleSelectClass}
                    defaultValue={user.role}
                    disabled={isPending}
                    onChange={(event) =>
                      handleRoleChange(user.id, event.target.value as UserRole)
                    }
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="rounded-r-xl px-3 py-3 text-xs text-light-100">
                  {user.id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {users.map((user) => (
          <article key={user.id} className="admin-user-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-primary-100">
                  {user.name || "Unnamed"}
                </h3>
                <p className="break-words text-sm">{user.email}</p>
              </div>
              <span className="admin-role-badge">{user.role}</span>
            </div>

            <div className="grid gap-2">
              <p className="text-xs uppercase tracking-wider text-light-100/70">
                User ID
              </p>
              <p className="break-all rounded-xl bg-dark-300 px-3 py-2 text-xs text-light-100">
                {user.id}
              </p>
            </div>

            <label className="grid gap-2">
              <span className="text-sm text-light-100">Change role</span>
              <select
                className={roleSelectClass}
                defaultValue={user.role}
                disabled={isPending}
                onChange={(event) =>
                  handleRoleChange(user.id, event.target.value as UserRole)
                }
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </article>
        ))}
      </div>
    </div>
  );
}

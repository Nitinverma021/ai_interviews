"use client";

import { useTransition } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { updateUserRole } from "@/lib/actions/auth.action";

export default function AdminUsersTable({ users }: { users: AdminUserRow[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="dashboard-panel overflow-x-auto">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-5 text-primary-200" />
        <h2>Users</h2>
      </div>

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
                  className="min-h-10 rounded-full border border-light-800 bg-dark-300 px-4 text-primary-200"
                  defaultValue={user.role}
                  disabled={isPending}
                  onChange={(event) => {
                    const role = event.target.value as UserRole;

                    startTransition(async () => {
                      const result = await updateUserRole({
                        userId: user.id,
                        role,
                      });

                      if (result.success) toast.success(result.message);
                      else toast.error(result.message);
                    });
                  }}
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
  );
}

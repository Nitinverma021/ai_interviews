"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function FilterButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="btn-primary min-w-28"
      disabled={pending}
      aria-busy={pending}
    >
      <Search />
      {pending ? "Filtering..." : "Filter"}
    </Button>
  );
}

export default function DashboardFilters({
  filters,
}: {
  filters: DashboardSearchParams;
}) {
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <form className="dashboard-panel" action="/">
      <div className="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
        <div>
          <h3>Find Practice</h3>
          <p>Search by role, interview type, stack, date, or score.</p>
        </div>
        {hasFilters && (
          <Button asChild className="btn-secondary">
            <Link href="/">Clear</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_180px_1fr_auto]">
        <Input
          name="role"
          defaultValue={filters.role}
          placeholder="Role"
          className="input"
        />
        <select
          name="type"
          defaultValue={filters.type || ""}
          className="input min-h-12 rounded-full bg-dark-200 px-5 text-light-100"
        >
          <option value="">All types</option>
          <option value="behavioral">Behavioral</option>
          <option value="technical">Technical</option>
          <option value="mixed">Mixed</option>
        </select>
        <Input
          name="tech"
          defaultValue={filters.tech}
          placeholder="Tech stack"
          className="input"
        />
        <FilterButton />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Input
          name="from"
          type="date"
          defaultValue={filters.from}
          className="input"
        />
        <Input
          name="to"
          type="date"
          defaultValue={filters.to}
          className="input"
        />
        <Input
          name="minScore"
          type="number"
          min="0"
          max="100"
          defaultValue={filters.minScore}
          placeholder="Minimum score"
          className="input"
        />
      </div>
    </form>
  );
}

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardFilters({
  filters,
}: {
  filters: DashboardSearchParams;
}) {
  return (
    <form className="dashboard-panel" action="/">
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
        <Button type="submit" className="btn-primary">
          <Search />
          Filter
        </Button>
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

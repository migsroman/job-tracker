"use client"

import { useJobs } from "@/contexts/job-context"
import { Button } from "@/components/ui/button"
import { JobForm } from "./job-form"
import { JobList } from "./job-list"
import { JobCards } from "./job-cards"
import { SearchFilter } from "./search-filter"
import { List, Grid } from "lucide-react"

export function JobsPage() {
  const { viewMode, setViewMode, filteredJobs } = useJobs()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <p className="text-muted-foreground">
            {filteredJobs.length} application{filteredJobs.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "cards" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("cards")}>
              <Grid className="w-4 h-4" />
            </Button>
          </div>
          <JobForm />
        </div>
      </div>

      <SearchFilter />

      {viewMode === "list" ? <JobList /> : <JobCards />}
    </div>
  )
}

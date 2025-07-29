"use client"

import { useState } from "react"
import { useJobs } from "@/contexts/job-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { JobForm } from "./job-form"
import { getStatusInfo, getPriorityInfo, formatDate, STATUS_OPTIONS } from "@/lib/job-utils"
import type { JobApplication, ApplicationStatus } from "@/types/job"
import { ExternalLink, Edit, Trash2 } from "lucide-react"

export function JobList() {
  const { filteredJobs, updateJob, deleteJob } = useJobs()
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null)
  const [sortField, setSortField] = useState<keyof JobApplication>("applicationDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field: keyof JobApplication) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleStatusChange = (jobId: string, newStatus: ApplicationStatus) => {
    updateJob(jobId, { status: newStatus })
  }

  const handleDelete = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job application?")) {
      deleteJob(jobId)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("companyName")}>
                Company {sortField === "companyName" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("jobTitle")}>
                Role {sortField === "jobTitle" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("applicationDate")}>
                Applied {sortField === "applicationDate" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("priority")}>
                Priority {sortField === "priority" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.companyName}</TableCell>
                <TableCell>{job.jobTitle}</TableCell>
                <TableCell>
                  <Select
                    value={job.status}
                    onValueChange={(value: ApplicationStatus) => handleStatusChange(job.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <Badge className={getStatusInfo(job.status).color}>{getStatusInfo(job.status).label}</Badge>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{formatDate(job.applicationDate)}</TableCell>
                <TableCell>
                  <Badge className={getPriorityInfo(job.priority).color}>{getPriorityInfo(job.priority).label}</Badge>
                </TableCell>
                <TableCell>{job.location || "Not specified"}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {job.jobUrl && (
                      <Button variant="ghost" size="sm" onClick={() => window.open(job.jobUrl, "_blank")}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setEditingJob(job)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {sortedJobs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No job applications found. Add your first job application to get started!
          </div>
        )}
      </div>

      <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job Application</DialogTitle>
          </DialogHeader>
          {editingJob && <JobForm job={editingJob} onClose={() => setEditingJob(null)} />}
        </DialogContent>
      </Dialog>
    </>
  )
}

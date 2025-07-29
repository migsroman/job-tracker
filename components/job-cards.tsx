"use client"

import { useState } from "react"
import { useJobs } from "@/contexts/job-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { JobForm } from "./job-form"
import { getPriorityInfo, formatDate, STATUS_OPTIONS } from "@/lib/job-utils"
import type { JobApplication, ApplicationStatus } from "@/types/job"
import { ExternalLink, Edit, Trash2, Building2 } from "lucide-react"

export function JobCards() {
  const { filteredJobs, updateJob, deleteJob } = useJobs()
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null)

  const handleDelete = (jobId: string) => {
    if (confirm("Are you sure you want to delete this job application?")) {
      deleteJob(jobId)
    }
  }

  const handleStatusChange = (job: JobApplication, newStatus: ApplicationStatus) => {
    updateJob(job.id, { status: newStatus })
  }

  // Group jobs by status for Kanban-style layout
  const jobsByStatus = STATUS_OPTIONS.reduce(
    (acc, statusOption) => {
      acc[statusOption.value] = filteredJobs.filter((job) => job.status === statusOption.value)
      return acc
    },
    {} as Record<ApplicationStatus, JobApplication[]>,
  )

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {STATUS_OPTIONS.map((statusOption) => {
          const jobs = jobsByStatus[statusOption.value] || []
          if (jobs.length === 0) return null

          return (
            <div key={statusOption.value} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{statusOption.label}</h3>
                <Badge variant="secondary">{jobs.length}</Badge>
              </div>

              <div className="space-y-3">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base line-clamp-2">{job.jobTitle}</CardTitle>
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <Building2 className="w-4 h-4 mr-1" />
                            {job.companyName}
                          </div>
                        </div>
                        <Badge className={getPriorityInfo(job.priority).color}>
                          {getPriorityInfo(job.priority).label}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Applied:</span>
                          <span>{formatDate(job.applicationDate)}</span>
                        </div>

                        {job.location && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="truncate ml-2">{job.location}</span>
                          </div>
                        )}

                        {job.salaryRange && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Salary:</span>
                            <span className="truncate ml-2">{job.salaryRange}</span>
                          </div>
                        )}

                        <Badge className={`${statusOption.color} w-full justify-center`}>{statusOption.label}</Badge>

                        {job.notes && <p className="text-sm text-muted-foreground line-clamp-2">{job.notes}</p>}

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-1">
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

                          <select
                            value={job.status}
                            onChange={(e) => handleStatusChange(job, e.target.value as ApplicationStatus)}
                            className="text-xs border rounded px-2 py-1"
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No job applications found</h3>
          <p className="text-muted-foreground">
            Add your first job application to get started tracking your job search!
          </p>
        </div>
      )}

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

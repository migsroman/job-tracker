"use client"

import type React from "react"

import { useState } from "react"
import { useJobs } from "@/contexts/job-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/lib/job-utils"
import type { JobApplication, ApplicationStatus, Priority } from "@/types/job"
import { Plus } from "lucide-react"

interface JobFormProps {
  job?: JobApplication
  onClose?: () => void
}

export function JobForm({ job, onClose }: JobFormProps) {
  const { addJob, updateJob } = useJobs()
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    jobTitle: job?.jobTitle || "",
    companyName: job?.companyName || "",
    location: job?.location || "",
    status: job?.status || ("interested" as ApplicationStatus),
    applicationDate: job?.applicationDate || new Date().toISOString().split("T")[0],
    jobUrl: job?.jobUrl || "",
    notes: job?.notes || "",
    salaryRange: job?.salaryRange || "",
    priority: job?.priority || ("medium" as Priority),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (job) {
      updateJob(job.id, formData)
    } else {
      addJob(formData)
    }

    if (!job) {
      setFormData({
        jobTitle: "",
        companyName: "",
        location: "",
        status: "interested",
        applicationDate: new Date().toISOString().split("T")[0],
        jobUrl: "",
        notes: "",
        salaryRange: "",
        priority: "medium",
      })
    }

    setOpen(false)
    onClose?.()
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title *</Label>
          <Input
            id="jobTitle"
            value={formData.jobTitle}
            onChange={(e) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., San Francisco, CA or Remote"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicationDate">Application Date</Label>
          <Input
            id="applicationDate"
            type="date"
            value={formData.applicationDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, applicationDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: ApplicationStatus) => setFormData((prev) => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: Priority) => setFormData((prev) => ({ ...prev, priority: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jobUrl">Job Posting URL</Label>
          <Input
            id="jobUrl"
            type="url"
            value={formData.jobUrl}
            onChange={(e) => setFormData((prev) => ({ ...prev, jobUrl: e.target.value }))}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryRange">Salary Range</Label>
          <Input
            id="salaryRange"
            value={formData.salaryRange}
            onChange={(e) => setFormData((prev) => ({ ...prev, salaryRange: e.target.value }))}
            placeholder="e.g., $80k - $120k"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes about this application..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setOpen(false)
            onClose?.()
          }}
        >
          Cancel
        </Button>
        <Button type="submit">{job ? "Update Job" : "Add Job"}</Button>
      </div>
    </form>
  )

  if (job) {
    return form
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Job Application</DialogTitle>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  )
}

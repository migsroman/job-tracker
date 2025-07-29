"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { JobApplication, FilterOptions, ViewMode } from "@/types/job"

interface JobContextType {
  jobs: JobApplication[]
  filteredJobs: JobApplication[]
  viewMode: ViewMode
  filters: FilterOptions
  addJob: (job: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) => void
  updateJob: (id: string, updates: Partial<JobApplication>) => void
  deleteJob: (id: string) => void
  setViewMode: (mode: ViewMode) => void
  setFilters: (filters: FilterOptions) => void
  getJobStats: () => {
    total: number
    byStatus: Record<string, number>
    recentActivity: JobApplication[]
  }
}

const JobContext = createContext<JobContextType | undefined>(undefined)

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    statuses: [],
    priorities: [],
    dateRange: null,
  })

  // Load jobs from localStorage on mount
  useEffect(() => {
    const savedJobs = localStorage.getItem("job-tracker-jobs")
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs))
    }
  }, [])

  // Save jobs to localStorage whenever jobs change
  useEffect(() => {
    localStorage.setItem("job-tracker-jobs", JSON.stringify(jobs))
  }, [jobs])

  const addJob = (jobData: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) => {
    const newJob: JobApplication = {
      ...jobData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setJobs((prev) => [newJob, ...prev])
  }

  const updateJob = (id: string, updates: Partial<JobApplication>) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, ...updates, updatedAt: new Date().toISOString() } : job)),
    )
  }

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id))
  }

  const filteredJobs = jobs.filter((job) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (
        !job.jobTitle.toLowerCase().includes(searchLower) &&
        !job.companyName.toLowerCase().includes(searchLower) &&
        !job.notes?.toLowerCase().includes(searchLower)
      ) {
        return false
      }
    }

    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(job.status)) {
      return false
    }

    // Priority filter
    if (filters.priorities.length > 0 && !filters.priorities.includes(job.priority)) {
      return false
    }

    // Date range filter
    if (filters.dateRange) {
      const jobDate = new Date(job.applicationDate)
      const startDate = new Date(filters.dateRange.start)
      const endDate = new Date(filters.dateRange.end)
      if (jobDate < startDate || jobDate > endDate) {
        return false
      }
    }

    return true
  })

  const getJobStats = () => {
    const byStatus = jobs.reduce(
      (acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const recentActivity = jobs
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)

    return {
      total: jobs.length,
      byStatus,
      recentActivity,
    }
  }

  return (
    <JobContext.Provider
      value={{
        jobs,
        filteredJobs,
        viewMode,
        filters,
        addJob,
        updateJob,
        deleteJob,
        setViewMode,
        setFilters,
        getJobStats,
      }}
    >
      {children}
    </JobContext.Provider>
  )
}

export function useJobs() {
  const context = useContext(JobContext)
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider")
  }
  return context
}

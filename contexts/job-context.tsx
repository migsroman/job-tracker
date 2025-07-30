"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { JobApplication, FilterOptions, ViewMode } from "@/types/job"
import { useJobsApi } from "@/hooks/use-jobs-api"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "@/hooks/use-toast"

interface JobContextType {
  jobs: JobApplication[]
  filteredJobs: JobApplication[]
  viewMode: ViewMode
  filters: FilterOptions
  isLoading: boolean
  addJob: (job: Omit<JobApplication, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>
  updateJob: (id: string, updates: Partial<JobApplication>) => Promise<void>
  deleteJob: (id: string) => Promise<void>
  setViewMode: (mode: ViewMode) => void
  setFilters: (filters: FilterOptions) => void
  refreshJobs: () => Promise<void>
  getJobStats: () => {
    total: number
    byStatus: Record<string, number>
    recentActivity: JobApplication[]
  }
}

const JobContext = createContext<JobContextType | undefined>(undefined)

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("LIST")
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    statuses: [],
    priorities: [],
    dateRange: null,
  })

  const { user } = useAuth()
  const { fetchJobs, createJob, updateJob: updateJobApi, deleteJob: deleteJobApi, isLoading } = useJobsApi()

  // Load jobs from database when user is authenticated
  useEffect(() => {
    if (user) {
      loadJobs()
    } else {
      setJobs([]) // Clear jobs when user logs out
    }
  }, [user])

  const loadJobs = async () => {
    try {
      const jobsData = await fetchJobs()
      // Transform database field names to match our interface
      const transformedJobs = jobsData.map(job => ({
        id: job.id,
        userId: job.user_id,
        jobTitle: job.job_title,
        companyName: job.company_name,
        location: job.location,
        status: job.status,
        applicationDate: job.application_date,
        jobUrl: job.job_url,
        notes: job.notes,
        salaryRange: job.salary_range,
        priority: job.priority,
        createdAt: job.created_at,
        updatedAt: job.updated_at,
      }))
      setJobs(transformedJobs)
    } catch (error) {
      console.error('Failed to load jobs:', error)
      toast({
        title: "Error",
        description: "Failed to load job applications. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addJob = async (jobData: Omit<JobApplication, "id" | "userId" | "createdAt" | "updatedAt">) => {
    try {
      await createJob({
        jobTitle: jobData.jobTitle,
        companyName: jobData.companyName,
        location: jobData.location,
        status: jobData.status,
        priority: jobData.priority,
        applicationDate: jobData.applicationDate,
        jobUrl: jobData.jobUrl,
        notes: jobData.notes,
        salaryRange: jobData.salaryRange,
      })
      await loadJobs() // Refresh the jobs list
      toast({
        title: "Success",
        description: "Job application added successfully!",
      })
    } catch (error) {
      console.error('Failed to add job:', error)
      toast({
        title: "Error",
        description: "Failed to add job application. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateJob = async (id: string, updates: Partial<JobApplication>) => {
    try {
      // Transform field names back to database format
      const dbUpdates: any = {}
      if (updates.jobTitle !== undefined) dbUpdates.jobTitle = updates.jobTitle
      if (updates.companyName !== undefined) dbUpdates.companyName = updates.companyName
      if (updates.location !== undefined) dbUpdates.location = updates.location
      if (updates.status !== undefined) dbUpdates.status = updates.status
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority
      if (updates.applicationDate !== undefined) dbUpdates.applicationDate = updates.applicationDate
      if (updates.jobUrl !== undefined) dbUpdates.jobUrl = updates.jobUrl
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes
      if (updates.salaryRange !== undefined) dbUpdates.salaryRange = updates.salaryRange

      await updateJobApi(id, dbUpdates)
      await loadJobs() // Refresh the jobs list
      toast({
        title: "Success",
        description: "Job application updated successfully!",
      })
    } catch (error) {
      console.error('Failed to update job:', error)
      toast({
        title: "Error",
        description: "Failed to update job application. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteJob = async (id: string) => {
    try {
      await deleteJobApi(id)
      await loadJobs() // Refresh the jobs list
      toast({
        title: "Success",
        description: "Job application deleted successfully!",
      })
    } catch (error) {
      console.error('Failed to delete job:', error)
      toast({
        title: "Error",
        description: "Failed to delete job application. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const refreshJobs = async () => {
    await loadJobs()
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
        isLoading,
        addJob,
        updateJob,
        deleteJob,
        setViewMode,
        setFilters,
        refreshJobs,
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

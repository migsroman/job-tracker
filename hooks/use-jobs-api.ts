import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { JobApplication } from '@/types/job'

interface CreateJobData {
  jobTitle: string
  companyName: string
  location: string
  status?: string
  priority?: string
  applicationDate?: string
  jobUrl?: string
  notes?: string
  salaryRange?: string
}

interface UpdateJobData {
  jobTitle?: string
  companyName?: string
  location?: string
  status?: string
  priority?: string
  applicationDate?: string
  jobUrl?: string
  notes?: string
  salaryRange?: string
}

export function useJobsApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAuthHeaders = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    }
  }, [])

  const fetchJobs = useCallback(async (): Promise<JobApplication[]> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/jobs', { headers })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch jobs')
      }
      
      const jobs = await response.json()
      return jobs
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders])

  const createJob = useCallback(async (jobData: CreateJobData): Promise<JobApplication> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const headers = await getAuthHeaders()
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers,
        body: JSON.stringify(jobData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create job')
      }
      
      const job = await response.json()
      return job
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders])

  const updateJob = useCallback(async (id: string, updates: UpdateJobData): Promise<JobApplication> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update job')
      }
      
      const job = await response.json()
      return job
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders])

  const deleteJob = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const headers = await getAuthHeaders()
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete job')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getAuthHeaders])

  return {
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
    isLoading,
    error
  }
}
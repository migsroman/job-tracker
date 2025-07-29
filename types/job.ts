export type ApplicationStatus =
  | "interested"
  | "applied"
  | "under-review"
  | "phone-screen"
  | "interview-round-1"
  | "interview-round-2"
  | "interview-final"
  | "reference-check"
  | "offer-received"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "no-response"

export type Priority = "high" | "medium" | "low"

export type ViewMode = "list" | "cards"

export interface JobApplication {
  id: string
  jobTitle: string
  companyName: string
  location: string
  status: ApplicationStatus
  applicationDate: string
  jobUrl?: string
  notes?: string
  salaryRange?: string
  priority: Priority
  createdAt: string
  updatedAt: string
}

export interface FilterOptions {
  search: string
  statuses: ApplicationStatus[]
  priorities: Priority[]
  dateRange: {
    start: string
    end: string
  } | null
}

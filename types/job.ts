// Database enum mappings
export type ApplicationStatus =
  | "INTERESTED"
  | "APPLIED"
  | "UNDER_REVIEW"
  | "PHONE_SCREEN"
  | "INTERVIEW_ROUND_1"
  | "INTERVIEW_ROUND_2"
  | "INTERVIEW_FINAL"
  | "REFERENCE_CHECK"
  | "OFFER_RECEIVED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN"
  | "NO_RESPONSE"

export type Priority = "HIGH" | "MEDIUM" | "LOW"

export type ViewMode = "LIST" | "CARDS"

export type Theme = "LIGHT" | "DARK" | "SYSTEM"

export interface JobApplication {
  id: string
  userId: string
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

export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface UserSettings {
  id: string
  userId: string
  preferredView: ViewMode
  emailNotifications: boolean
  theme: Theme
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

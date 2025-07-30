import type { ApplicationStatus, Priority } from "@/types/job"

export const STATUS_OPTIONS: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: "INTERESTED", label: "Interested", color: "bg-gray-100 text-gray-800" },
  { value: "APPLIED", label: "Applied", color: "bg-blue-100 text-blue-800" },
  { value: "UNDER_REVIEW", label: "Under Review", color: "bg-yellow-100 text-yellow-800" },
  { value: "PHONE_SCREEN", label: "Phone Screen", color: "bg-purple-100 text-purple-800" },
  { value: "INTERVIEW_ROUND_1", label: "Interview - Round 1", color: "bg-indigo-100 text-indigo-800" },
  { value: "INTERVIEW_ROUND_2", label: "Interview - Round 2", color: "bg-indigo-100 text-indigo-800" },
  { value: "INTERVIEW_FINAL", label: "Interview - Final", color: "bg-indigo-100 text-indigo-800" },
  { value: "REFERENCE_CHECK", label: "Reference Check", color: "bg-orange-100 text-orange-800" },
  { value: "OFFER_RECEIVED", label: "Offer Received", color: "bg-green-100 text-green-800" },
  { value: "ACCEPTED", label: "Accepted", color: "bg-green-200 text-green-900" },
  { value: "REJECTED", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "WITHDRAWN", label: "Withdrawn", color: "bg-gray-100 text-gray-800" },
  { value: "NO_RESPONSE", label: "No Response", color: "bg-red-100 text-red-800" },
]

export const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: "HIGH", label: "High", color: "bg-red-100 text-red-800" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "LOW", label: "Low", color: "bg-green-100 text-green-800" },
]

export function getStatusInfo(status: ApplicationStatus) {
  return STATUS_OPTIONS.find((option) => option.value === status) || STATUS_OPTIONS[0]
}

export function getPriorityInfo(priority: Priority) {
  return PRIORITY_OPTIONS.find((option) => option.value === priority) || PRIORITY_OPTIONS[1]
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

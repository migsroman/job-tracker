import type { ApplicationStatus, Priority } from "@/types/job"

export const STATUS_OPTIONS: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: "interested", label: "Interested", color: "bg-gray-100 text-gray-800" },
  { value: "applied", label: "Applied", color: "bg-blue-100 text-blue-800" },
  { value: "under-review", label: "Under Review", color: "bg-yellow-100 text-yellow-800" },
  { value: "phone-screen", label: "Phone Screen", color: "bg-purple-100 text-purple-800" },
  { value: "interview-round-1", label: "Interview - Round 1", color: "bg-indigo-100 text-indigo-800" },
  { value: "interview-round-2", label: "Interview - Round 2", color: "bg-indigo-100 text-indigo-800" },
  { value: "interview-final", label: "Interview - Final", color: "bg-indigo-100 text-indigo-800" },
  { value: "reference-check", label: "Reference Check", color: "bg-orange-100 text-orange-800" },
  { value: "offer-received", label: "Offer Received", color: "bg-green-100 text-green-800" },
  { value: "accepted", label: "Accepted", color: "bg-green-200 text-green-900" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "withdrawn", label: "Withdrawn", color: "bg-gray-100 text-gray-800" },
  { value: "no-response", label: "No Response", color: "bg-red-100 text-red-800" },
]

export const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
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

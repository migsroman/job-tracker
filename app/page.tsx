"use client"

import { useState } from "react"
import { JobProvider } from "@/contexts/job-context"
import { Dashboard } from "@/components/dashboard"
import { JobsPage } from "@/components/jobs-page"
import { Button } from "@/components/ui/button"
import { BarChart3, Briefcase, Target } from "lucide-react"

type Page = "dashboard" | "jobs"

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-bold">Job Tracker</h1>
            </div>

            <nav className="flex items-center space-x-1">
              <Button
                variant={currentPage === "dashboard" ? "default" : "ghost"}
                onClick={() => setCurrentPage("dashboard")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant={currentPage === "jobs" ? "default" : "ghost"} onClick={() => setCurrentPage("jobs")}>
                <Briefcase className="w-4 h-4 mr-2" />
                Jobs
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "jobs" && <JobsPage />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <JobProvider>
      <AppContent />
    </JobProvider>
  )
}

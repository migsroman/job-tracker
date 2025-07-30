"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { AuthForm } from "@/components/auth/auth-form"
import { JobProvider } from "@/contexts/job-context"
import { Dashboard } from "@/components/dashboard"
import { JobsPage } from "@/components/jobs-page"
import { Button } from "@/components/ui/button"
import { BarChart3, Briefcase, Target, LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Page = "dashboard" | "jobs"

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-perplexity-blue">JobTracker Pro</h1>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="flex items-center space-x-1">
                <Button
                  variant={currentPage === "dashboard" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("dashboard")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant={currentPage === "jobs" ? "default" : "ghost"} 
                  onClick={() => setCurrentPage("jobs")}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Jobs
                </Button>
              </nav>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.user_metadata?.name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <JobProvider>
      <AppContent />
    </JobProvider>
  )
}

"use client"

import { useJobs } from "@/contexts/job-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getStatusInfo, formatDate } from "@/lib/job-utils"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function Dashboard() {
  const { getJobStats } = useJobs()
  const stats = getJobStats()

  const statusChartData = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: getStatusInfo(status as any).label,
    value: count,
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.byStatus["applied"] || 0) +
                (stats.byStatus["under-review"] || 0) +
                (stats.byStatus["phone-screen"] || 0) +
                (stats.byStatus["interview-round-1"] || 0) +
                (stats.byStatus["interview-round-2"] || 0) +
                (stats.byStatus["interview-final"] || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.byStatus["phone-screen"] || 0) +
                (stats.byStatus["interview-round-1"] || 0) +
                (stats.byStatus["interview-round-2"] || 0) +
                (stats.byStatus["interview-final"] || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round(((stats.byStatus["accepted"] || 0) / stats.total) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Applications by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((job) => (
                <div key={job.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{job.jobTitle}</p>
                    <p className="text-sm text-muted-foreground">{job.companyName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusInfo(job.status).color}>{getStatusInfo(job.status).label}</Badge>
                    <span className="text-sm text-muted-foreground">{formatDate(job.updatedAt)}</span>
                  </div>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

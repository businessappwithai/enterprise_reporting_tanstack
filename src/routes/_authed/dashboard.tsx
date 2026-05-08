import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getDb } from '@/lib/db/config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart3,
  Clock,
  Database,
  FileText,
  LayoutDashboard,
  Play,
} from 'lucide-react'

const getDashboardStatsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const db = getDb()

  const safeCount = async (tableName: string, column = '*') => {
    try {
      const result = await db(tableName).count(`${column} as count`).first()
      return Number((result as Record<string, unknown>)?.count || 0)
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes('no such table')) {
        return 0
      }
      console.error(`Error counting ${tableName}:`, error)
      return 0
    }
  }

  const getJobsCount = async () => {
    try {
      const result = await db('job_definitions')
        .whereNotNull('schedule_cron')
        .count('* as count')
        .first()
      return Number((result as Record<string, unknown>)?.count || 0)
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes('no such table')) {
        return 0
      }
      console.error('Error counting jobs:', error)
      return 0
    }
  }

  const [reportsCount, chartsCount, dashboardsCount, jobsCount] = await Promise.all([
    safeCount('report_definitions'),
    safeCount('chart_definitions'),
    safeCount('dashboard_layouts'),
    getJobsCount(),
  ])

  return {
    reports: reportsCount,
    charts: chartsCount,
    dashboards: dashboardsCount,
    jobs: jobsCount,
  }
})

const quickLinks = [
  {
    title: 'SQL Editor',
    description: 'Write and execute SQL queries',
    href: '/sql-editor',
    icon: Database,
  },
  {
    title: 'Reports',
    description: 'View and manage reports',
    href: '/reports',
    icon: FileText,
  },
  {
    title: 'Charts',
    description: 'Create data visualizations',
    href: '/charts',
    icon: BarChart3,
  },
  {
    title: 'Dashboards',
    description: 'Build interactive dashboards',
    href: '/dashboards',
    icon: LayoutDashboard,
  },
]

export const Route = createFileRoute('/_authed/dashboard')({
  loader: () => getDashboardStatsFn(),
  component: DashboardPage,
})

function DashboardPage() {
  const stats = Route.useLoaderData()
  const { session } = Route.useRouteContext()

  const statItems = [
    {
      title: 'Total Reports',
      value: stats.reports.toString(),
      icon: FileText,
      href: '/reports',
    },
    {
      title: 'Active Charts',
      value: stats.charts.toString(),
      icon: BarChart3,
      href: '/charts',
    },
    {
      title: 'Dashboards',
      value: stats.dashboards.toString(),
      icon: LayoutDashboard,
      href: '/dashboards',
    },
    {
      title: 'Scheduled Jobs',
      value: stats.jobs.toString(),
      icon: Clock,
      href: '/jobs',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Welcome to the Enterprise Reporting System
          {session?.user?.email && ` - ${session.user.email}`}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => (
          <Link key={stat.title} to={stat.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <link.icon className="h-4 w-4 text-primary" />
                    <CardTitle className="text-sm">{link.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Play className="h-4 w-4" />
              Recent Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent job executions</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

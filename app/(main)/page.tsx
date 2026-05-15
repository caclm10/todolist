import { db } from "@/db"
import { Project, Task } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, count, and } from "drizzle-orm"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LayoutDashboard, CheckSquare, Folder, Clock } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Overview of your projects and tasks.",
}

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userId = session!.user.id

    // Fetch stats
    const [projectCount] = await db.select({ value: count() }).from(Project).where(eq(Project.userId, userId))
    const [taskCount] = await db.select({ value: count() }).from(Task).where(eq(Task.userId, userId))
    const [completedTaskCount] = await db.select({ value: count() }).from(Task).where(
        and(
            eq(Task.userId, userId),
            eq(Task.status, "done")
        )
    )

    return (
        <div className="container mx-auto p-4 md:p-10">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {session!.user.name}! Here&apos;s an overview of your projects.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                            <Folder className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{projectCount.value}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
                            <CheckSquare className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{taskCount.value}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tasks</CardTitle>
                            <Clock className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{completedTaskCount.value}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

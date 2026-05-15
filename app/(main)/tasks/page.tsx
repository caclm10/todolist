import { db } from "@/db"
import { Task, Project } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, desc } from "drizzle-orm"
import { TaskList } from "@/components/task-list"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "All Tasks",
    description: "View all your tasks.",
}

export default async function AllTasksPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userId = session!.user.id

    const tasks = await db.query.Task.findMany({
        where: eq(Task.userId, userId),
        orderBy: [desc(Task.createdAt)],
        with: {
            project: true
        }
    })

    return (
        <div className="container mx-auto p-4 md:p-10">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Tasks</h1>
                    <p className="text-muted-foreground">
                        A list of all your tasks across all projects.
                    </p>
                </div>

                <div className="grid gap-6">
                    <TaskList tasks={tasks} projectId="" />
                </div>
            </div>
        </div>
    )
}

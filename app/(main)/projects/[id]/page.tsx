import { db } from "@/db"
import { Project, Task } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq, and } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { TaskList } from "@/components/task-list"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function ProjectPage({ params }: { params: { id: string } }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const { id } = await params

    const project = await db.query.Project.findFirst({
        where: and(
            eq(Project.id, id),
            eq(Project.userId, session!.user.id)
        )
    })

    if (!project) {
        notFound()
    }

    const tasks = await db.query.Task.findMany({
        where: and(
            eq(Task.projectId, id),
            eq(Task.userId, session!.user.id)
        ),
        orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
    })

    return (
        <div className="container mx-auto p-4 md:p-10">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <Link href="/projects">
                        <Button variant="ghost" size="sm" className="-ml-2 h-8 gap-1 text-muted-foreground">
                            <ChevronLeft className="size-4" />
                            Back to Projects
                        </Button>
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                            {project.description && (
                                <p className="text-muted-foreground">{project.description}</p>
                            )}
                        </div>
                        <CreateTaskDialog projectId={project.id} />
                    </div>
                </div>

                <div className="grid gap-6">
                    <div>
                        <h2 className="mb-4 text-xl font-semibold">Tasks</h2>
                        <TaskList tasks={tasks} projectId={project.id} />
                    </div>
                </div>
            </div>
        </div>
    )
}

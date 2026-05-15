import Link from "next/link"
import { db } from "@/db"
import { Project } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { eq } from "drizzle-orm"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { ProjectActions } from "@/components/project-actions"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Folder } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Projects",
    description: "Manage your projects.",
}

export default async function ProjectsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const projects = await db.query.Project.findMany({
        where: eq(Project.userId, session!.user.id),
        orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    })

    return (
        <div className="container mx-auto p-4 md:p-10">
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                        <p className="text-muted-foreground">
                            Manage your projects and tasks.
                        </p>
                    </div>
                    <CreateProjectDialog />
                </div>

                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-20 text-center">
                        <Folder className="mb-4 size-12 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">No projects yet</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Create your first project to start organizing tasks.
                        </p>
                        <CreateProjectDialog />
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <Link key={project.id} href={`/projects/${project.id}`}>
                                <Card className="h-full transition-colors hover:bg-muted/50">
                                    <CardHeader className="relative">
                                        <div className="absolute right-4 top-4">
                                            <ProjectActions project={project} />
                                        </div>
                                        <CardTitle className="pr-8">{project.name}</CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {project.description || "No description"}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

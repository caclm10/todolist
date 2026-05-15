"use server"

import { db } from "@/db"
import { Project } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { eq, and } from "drizzle-orm"

export async function createProjectAction(data: { name: string, description?: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error("Unauthorized")
    }

    const newProject = await db.insert(Project).values({
        id: uuidv4(),
        name: data.name,
        description: data.description,
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning()

    revalidatePath("/projects")
    return newProject[0]
}

export async function getProjectsAction() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error("Unauthorized")
    }

    return await db.query.Project.findMany({
        where: eq(Project.userId, session.user.id),
        orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    })
}

export async function deleteProjectAction(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error("Unauthorized")
    }

    await db.delete(Project).where(
        and(
            eq(Project.id, id),
            eq(Project.userId, session.user.id)
        )
    )

    revalidatePath("/projects")
}

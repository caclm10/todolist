"use server"

import { db } from "@/db"
import { Task } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"
import { eq, and } from "drizzle-orm"

export async function createTaskAction(data: { 
    name: string, 
    description?: string, 
    projectId: string,
    priority?: "low" | "medium" | "high"
    dueDate?: Date
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error("Unauthorized")
    }

    const newTask = await db.insert(Task).values({
        id: uuidv4(),
        name: data.name,
        description: data.description,
        projectId: data.projectId,
        userId: session.user.id,
        priority: data.priority || "medium",
        dueDate: data.dueDate,
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning()

    revalidatePath(`/projects/${data.projectId}`)
    return newTask[0]
}

export async function updateTaskStatusAction(id: string, projectId: string, status: "todo" | "in-progress" | "done") {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error("Unauthorized")
    }

    await db.update(Task).set({
        status,
        updatedAt: new Date(),
    }).where(
        and(
            eq(Task.id, id),
            eq(Task.userId, session.user.id)
        )
    )

    revalidatePath(`/projects/${projectId}`)
}

export async function deleteTaskAction(id: string, projectId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error("Unauthorized")
    }

    await db.delete(Task).where(
        and(
            eq(Task.id, id),
            eq(Task.userId, session.user.id)
        )
    )

    revalidatePath(`/projects/${projectId}`)
}

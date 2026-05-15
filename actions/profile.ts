"use server"

import { writeFile, mkdir, unlink } from "fs/promises"
import { join } from "path"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

async function deleteLocalFile(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/avatars/")) return

  try {
    const fileName = url.split("/").pop()
    if (fileName) {
      const filePath = join(process.cwd(), "public", "uploads", "avatars", fileName)
      await unlink(filePath)
    }
  } catch (error) {
    console.error("Failed to delete local file:", error)
  }
}

export async function uploadAvatarAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const file = formData.get("file") as File
  if (!file) {
    throw new Error("No file uploaded")
  }

  // Delete old avatar if it exists
  if (session.user.image) {
    await deleteLocalFile(session.user.image)
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = join(process.cwd(), "public", "uploads", "avatars")
  
  // Ensure directory exists
  await mkdir(uploadDir, { recursive: true })

  // Create unique filename
  const fileExtension = file.name.split(".").pop()
  const fileName = `${session.user.id}-${Date.now()}.${fileExtension}`
  const filePath = join(uploadDir, fileName)

  await writeFile(filePath, buffer)

  const publicUrl = `/uploads/avatars/${fileName}`
  
  return { url: publicUrl }
}

export async function deleteAvatarAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  if (session.user.image) {
    await deleteLocalFile(session.user.image)
  }

  return { success: true }
}

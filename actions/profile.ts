"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

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

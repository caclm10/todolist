"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Camera, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { uploadAvatarAction } from "@/actions/profile"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileForm() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name,
      })
    }
  }, [session, form])

  async function handleAvatarClick() {
    fileInputRef.current?.click()
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadAvatarAction(formData)
      
      const { error } = await authClient.updateUser({
        image: result.url,
      })

      if (error) {
        throw new Error(error.message)
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await authClient.updateUser({
      name: data.name,
    })

    if (error) {
      setError(error.message || "Something went wrong")
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Change your public profile information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div 
            className="group relative cursor-pointer"
            onClick={handleAvatarClick}
          >
            <Avatar className="size-32 border-4 border-background shadow-sm transition-opacity group-hover:opacity-80">
              <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
              <AvatarFallback className="text-3xl">
                {session?.user?.name?.slice(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              {uploading ? (
                <Loader2 className="size-8 animate-spin text-white" />
              ) : (
                <Camera className="size-8 text-white" />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={onFileChange}
              disabled={uploading}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Click to change profile picture
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-500/15 p-3 text-sm font-medium text-green-600">
              Profile updated successfully!
            </div>
          )}

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Display Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Your name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <div className="flex items-center gap-4">
            <Field className="flex-1">
              <FieldLabel>Email Address</FieldLabel>
              <Input
                value={session?.user?.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Email cannot be changed.
              </p>
            </Field>
          </div>

          <Button type="submit" disabled={loading || uploading} className="w-full sm:w-auto">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

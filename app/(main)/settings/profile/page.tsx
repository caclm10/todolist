import { ProfileForm } from "@/components/profile-form"

export default function ProfileSettingsPage() {
  return (
    <div className="container mx-auto p-4 md:p-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <ProfileForm />
      </div>
    </div>
  )
}

import { LoginForm } from "@/features/auth/components/LoginForm"
import ThemeModeToggle from "@/shared/components/ThemeModeToggle"

export function Login() {
  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <div className="absolute top-4 right-4 z-10">
        <ThemeModeToggle />
      </div>
      <div className="w-full max-w-xs space-y-4 text-center">
        <LoginForm />
      </div>
    </div>
  )
}

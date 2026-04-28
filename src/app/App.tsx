import { ThemeProvider } from "./providers/ThemeProvider"
import { AppRoutes } from "./routes/router"
import { Toaster } from "@/shared/components/ui/toaster"

export function App() {
  return (
    <ThemeProvider defaultTheme={{ mode: 'light' }} storageKey="theme">
      <AppRoutes />
      <Toaster />
    </ThemeProvider>
  )
}
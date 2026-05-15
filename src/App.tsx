import { ThemeProvider } from "@/components/theme-provider"
import { AppRouter } from "@/routes"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nextools-theme">
      <AppRouter />
      <Toaster position="top-right" />
    </ThemeProvider>
  )
}

export default App

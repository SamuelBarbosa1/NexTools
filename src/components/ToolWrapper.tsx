import type { ReactNode } from "react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Star } from "lucide-react"
import { useToolsStore } from "@/hooks/use-tools-store"
import { cn } from "@/lib/utils"

interface ToolWrapperProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  children: ReactNode
  actions?: ReactNode
}

export function ToolWrapper({
  id,
  title,
  description,
  icon: Icon,
  children,
  actions,
}: ToolWrapperProps) {
  const { favorites, toggleFavorite } = useToolsStore()
  const isFavorite = favorites.includes(id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 text-muted-foreground hover:text-amber-500",
                  isFavorite && "text-amber-500"
                )}
                onClick={() => toggleFavorite(id)}
              >
                <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
              </Button>
            </div>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>

      <div className="pt-2">
        {children}
      </div>
    </motion.div>
  )
}

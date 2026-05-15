import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { categories, tools } from "@/utils/tools"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Star } from "lucide-react"
import { useToolsStore } from "@/hooks/use-tools-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Home() {
  const { favorites, history, toggleFavorite, addToHistory } = useToolsStore()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const favoriteTools = tools.filter((t) => favorites.includes(t.id))
  const recentTools = tools.filter((t) => history.includes(t.id))

  const ToolCard = ({ tool }: { tool: typeof tools[0] }) => {
    const isFavorite = favorites.includes(tool.id)

    return (
      <motion.div variants={item}>
        <Card className="group relative h-full transition-all hover:border-primary/50 hover:shadow-md hover:bg-muted/50 cursor-pointer overflow-hidden">
          <Link 
            to={tool.path} 
            className="block h-full"
            onClick={() => addToHistory(tool.id)}
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2 pr-10">
              <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                <tool.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base">{tool.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2">
                {tool.description}
              </CardDescription>
            </CardContent>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 top-2 h-8 w-8 text-muted-foreground transition-opacity hover:text-amber-500",
              isFavorite ? "text-amber-500 opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite(tool.id)
            }}
          >
            <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </Button>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao NexTools. Selecione uma ferramenta abaixo para começar.
        </p>
      </div>

      <div className="space-y-12">
        {favoriteTools.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Star className="h-5 w-5 text-amber-500 fill-current" />
              <h2 className="text-xl font-semibold tracking-tight">Favoritos</h2>
            </div>
            <motion.div 
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {favoriteTools.map((tool) => (
                <ToolCard key={`fav-${tool.id}`} tool={tool} />
              ))}
            </motion.div>
          </div>
        )}

        {recentTools.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight border-b pb-2">Recentes</h2>
            <motion.div 
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {recentTools.map((tool) => (
                <ToolCard key={`recent-${tool.id}`} tool={tool} />
              ))}
            </motion.div>
          </div>
        )}

        {categories.map((category) => {
          const categoryTools = tools.filter((t) => t.category === category)
          
          if (categoryTools.length === 0) return null

          return (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-semibold tracking-tight border-b pb-2">
                {category}
              </h2>
              
              <motion.div 
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {categoryTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

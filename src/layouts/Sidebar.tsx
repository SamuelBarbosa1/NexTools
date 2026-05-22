import { NavLink } from "react-router-dom"
import { LayoutDashboard, Settings, Compass, Star } from "lucide-react"
import { tools, categories } from "@/utils/tools"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useToolsStore } from "@/hooks/use-tools-store"

interface SidebarProps {
  isOpen: boolean
}

export function Sidebar({ isOpen }: SidebarProps) {
  const { favorites } = useToolsStore()
  const favoriteTools = tools.filter((t) => favorites.includes(t.id))

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "w-64 translate-x-0" : "-translate-x-full w-64 lg:w-64"
      )}
    >
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-lg">NexTools</span>
        </NavLink>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          <div className="px-2 pb-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Geral
          </div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              )
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Explorar
          </NavLink>

          {favoriteTools.length > 0 && (
            <div className="mt-4">
              <div className="px-2 pb-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                Favoritos
              </div>
              {favoriteTools.map((tool) => (
                <NavLink
                  key={`side-fav-${tool.id}`}
                  to={tool.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )
                  }
                >
                  <tool.icon className="h-4 w-4" />
                  {tool.name}
                </NavLink>
              ))}
            </div>
          )}

          {categories.map((category) => (
            <div key={category} className="mt-4">
              <div className="px-2 pb-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                {category}
              </div>
              {tools
                .filter((t) => t.category === category)
                .map((tool) => (
                  <NavLink
                    key={tool.id}
                    to={tool.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                      )
                    }
                  >
                    <tool.icon className="h-4 w-4" />
                    {tool.name}
                  </NavLink>
                ))}
            </div>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="p-4">
        <Separator className="mb-4" />
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )
          }
        >
          <Settings className="h-4 w-4" />
          Configurações
        </NavLink>
      </div>
    </aside>
  )
}

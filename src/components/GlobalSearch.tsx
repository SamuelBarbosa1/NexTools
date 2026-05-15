import * as React from "react"
import { useNavigate } from "react-router-dom"
import { tools } from "@/utils/tools"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { useToolsStore } from "@/hooks/use-tools-store"

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()
  const { history, favorites, addToHistory } = useToolsStore()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const favoriteTools = tools.filter((tool) => favorites.includes(tool.id))
  const historyTools = tools.filter((tool) => history.includes(tool.id))

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Buscar ferramentas...</span>
        <span className="inline-flex lg:hidden">Buscar...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite para buscar..." />
        <CommandList>
          <CommandEmpty>Nenhuma ferramenta encontrada.</CommandEmpty>
          {favoriteTools.length > 0 && (
            <CommandGroup heading="Favoritos">
              {favoriteTools.map((tool) => (
                <CommandItem
                  key={tool.id}
                  onSelect={() => {
                    runCommand(() => {
                      addToHistory(tool.id)
                      navigate(tool.path)
                    })
                  }}
                >
                  <tool.icon className="mr-2 h-4 w-4" />
                  <span>{tool.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {historyTools.length > 0 && (
            <CommandGroup heading="Recentes">
              {historyTools.map((tool) => (
                <CommandItem
                  key={tool.id}
                  onSelect={() => {
                    runCommand(() => {
                      addToHistory(tool.id)
                      navigate(tool.path)
                    })
                  }}
                >
                  <tool.icon className="mr-2 h-4 w-4" />
                  <span>{tool.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandGroup heading="Todas as Ferramentas">
            {tools.map((tool) => (
              <CommandItem
                key={tool.id}
                onSelect={() => {
                  runCommand(() => {
                    addToHistory(tool.id)
                    navigate(tool.path)
                  })
                }}
              >
                <tool.icon className="mr-2 h-4 w-4" />
                <span>{tool.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

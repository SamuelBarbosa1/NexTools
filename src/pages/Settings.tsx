import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToolsStore } from "@/hooks/use-tools-store"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

export function Settings() {
  const { clearHistory } = useToolsStore()

  const handleClearHistory = () => {
    clearHistory()
    toast.success("Histórico limpo com sucesso!")
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas preferências e dados locais.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Privacidade e Dados</CardTitle>
            <CardDescription>
              Todos os seus dados são salvos localmente no seu navegador.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Limpar Histórico</p>
                <p className="text-sm text-muted-foreground">
                  Remove todas as ferramentas da lista de "Recentes".
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleClearHistory}>
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

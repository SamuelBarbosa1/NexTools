import { useState } from "react"
import { Link as LinkIcon, Copy, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UrlShortener() {
  const [url, setUrl] = useState("")
  const [alias, setAlias] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shortenedUrl, setShortenedUrl] = useState("")

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      toast.error("Por favor, insira uma URL válida.")
      return
    }

    try {
      new URL(url)
    } catch {
      toast.error("URL inválida. Certifique-se de incluir http:// ou https://")
      return
    }

    setIsLoading(true)

    // TODO: Integrate with Supabase
    // Simulating API call
    setTimeout(() => {
      const hash = alias || Math.random().toString(36).substring(2, 8)
      setShortenedUrl(`https://nex-tools-snowy.vercel.app/${hash}`)
      setIsLoading(false)
      toast.success("URL encurtada com sucesso!")
    }, 800)
  }

  const copyToClipboard = () => {
    if (!shortenedUrl) return
    navigator.clipboard.writeText(shortenedUrl)
    toast.success("URL copiada para a área de transferência!")
  }

  return (
    <ToolWrapper
      id="encurtador-url"
      title="Encurtador de URL"
      description="Encurte links longos para compartilhar mais facilmente."
      icon={LinkIcon}
    >
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Link</CardTitle>
              <CardDescription>
                Insira a URL de destino e opcionalmente um alias personalizado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleShorten} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL de Destino</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://exemplo.com/pagina-muito-longa"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="alias">Alias Personalizado (Opcional)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground select-none">nex-tools-snowy.vercel.app/</span>
                    <Input
                      id="alias"
                      type="text"
                      placeholder="meu-link"
                      value={alias}
                      onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''))}
                      maxLength={20}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !url}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Encurtando...
                    </>
                  ) : (
                    <>
                      Encurtar URL
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {shortenedUrl && (
            <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-4">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label>Sua URL encurtada</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={shortenedUrl}
                      className="font-mono text-primary font-medium"
                    />
                    <Button size="icon" onClick={copyToClipboard} shrink-0>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>
                Funcionalidade em breve com Supabase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Cliques Totais</span>
                  <span className="font-medium text-foreground">--</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Links Ativos</span>
                  <span className="font-medium text-foreground">--</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolWrapper>
  )
}

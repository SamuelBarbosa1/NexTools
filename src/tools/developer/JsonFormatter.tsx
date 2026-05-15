import { useState } from "react"
import { Code, Copy, Trash2, Wand2 } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const formatJson = () => {
    if (!input.trim()) {
      setError(null)
      setOutput("")
      return
    }

    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError(null)
      toast.success("JSON formatado com sucesso!")
    } catch (err: any) {
      setError(`JSON Inválido: ${err.message}`)
      setOutput("")
      toast.error("JSON inválido. Verifique a sintaxe.")
    }
  }

  const minifyJson = () => {
    if (!input.trim()) return

    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError(null)
      toast.success("JSON minificado com sucesso!")
    } catch (err: any) {
      setError(`JSON Inválido: ${err.message}`)
      setOutput("")
    }
  }

  const clearAll = () => {
    setInput("")
    setOutput("")
    setError(null)
  }

  const copyToClipboard = (text: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success("Copiado para a área de transferência!")
  }

  return (
    <ToolWrapper
      id="formatador-json"
      title="Formatador JSON"
      description="Formate, valide e embeleze seus arquivos JSON."
      icon={Code}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={clearAll} title="Limpar">
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button size="sm" onClick={formatJson} title="Formatar">
            <Wand2 className="h-4 w-4 mr-2" />
            Formatar
          </Button>
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:h-[600px]">
        <Card className="flex flex-col h-full border-primary/20">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold">Entrada (JSON Sujo)</span>
            {error && <span className="text-sm text-destructive">{error}</span>}
          </div>
          <CardContent className="flex-1 p-0">
            <Textarea
              className="w-full h-full min-h-[300px] lg:min-h-0 resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm p-4 bg-muted/10"
              placeholder='{"cole": "aqui", "seu": "json"}'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full border-primary/20">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold">Saída (JSON Formatado)</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={minifyJson} disabled={!input}>
                Minificar
              </Button>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(output)} disabled={!output}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="flex-1 p-0 relative">
            <Textarea
              className="w-full h-full min-h-[300px] lg:min-h-0 resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm p-4 bg-muted/30 text-primary"
              value={output}
              readOnly
              placeholder="Resultado aparecerá aqui..."
            />
          </CardContent>
        </Card>
      </div>
    </ToolWrapper>
  )
}

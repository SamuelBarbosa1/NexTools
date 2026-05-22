import { useState } from "react"
import { Database, Copy, Trash2, Wand2 } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "sql-formatter"

export function SqlFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [dialect, setDialect] = useState<string>("sql")
  const [indentSize, setIndentSize] = useState<string>("2")
  const [keywordCase, setKeywordCase] = useState<string>("preserve")
  const [error, setError] = useState<string | null>(null)

  const handleFormat = () => {
    if (!input.trim()) {
      setOutput("")
      setError(null)
      return
    }

    try {
      const formatted = format(input, {
        language: dialect as any,
        tabWidth: indentSize === "tab" ? undefined : parseInt(indentSize, 10),
        useTabs: indentSize === "tab",
        keywordCase: keywordCase as any,
      })
      setOutput(formatted)
      setError(null)
      toast.success("SQL formatado com sucesso!")
    } catch (err: any) {
      setError(`Erro na formatação: ${err.message}`)
      toast.error("Ocorreu um erro ao formatar o SQL. Verifique a sintaxe.")
    }
  }

  const handleMinify = () => {
    if (!input.trim()) return

    try {
      const minified = input
        .replace(/\/\*[\s\S]*?\*\//g, "") // remove block comments
        .replace(/--.*$/gm, "") // remove line comments
        .replace(/\s+/g, " ") // collapse whitespace
        .trim()
      
      setOutput(minified)
      setError(null)
      toast.success("SQL minificado com sucesso!")
    } catch (err: any) {
      setError(`Erro na minificação: ${err.message}`)
      toast.error("Erro ao minificar.")
    }
  }

  const handleClear = () => {
    setInput("")
    setOutput("")
    setError(null)
  }

  const copyToClipboard = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    toast.success("SQL copiado para a área de transferência!")
  }

  return (
    <ToolWrapper
      id="formatador-sql"
      title="Formatador SQL"
      description="Formate, embeleze e idente suas consultas SQL de diferentes bancos."
      icon={Database}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={handleClear} title="Limpar">
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button size="sm" onClick={handleFormat} title="Formatar">
            <Wand2 className="h-4 w-4 mr-2" />
            Formatar
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Painel de Opções */}
        <Card className="border-primary/20">
          <CardContent className="p-4 grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dialect-select">Dialeto SQL</Label>
              <Select value={dialect} onValueChange={(val) => setDialect(val)}>
                <SelectTrigger id="dialect-select">
                  <SelectValue placeholder="Selecione o dialeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sql">Standard SQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="tsql">Transact-SQL (SQL Server)</SelectItem>
                  <SelectItem value="plsql">PL/SQL (Oracle)</SelectItem>
                  <SelectItem value="mariadb">MariaDB</SelectItem>
                  <SelectItem value="spark">Spark SQL</SelectItem>
                  <SelectItem value="db2">DB2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="indent-select">Identação</Label>
              <Select value={indentSize} onValueChange={(val) => setIndentSize(val)}>
                <SelectTrigger id="indent-select">
                  <SelectValue placeholder="Tamanho do recuo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Espaços</SelectItem>
                  <SelectItem value="4">4 Espaços</SelectItem>
                  <SelectItem value="8">8 Espaços</SelectItem>
                  <SelectItem value="tab">Tabulação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="case-select">Palavras-chave</Label>
              <Select value={keywordCase} onValueChange={(val) => setKeywordCase(val)}>
                <SelectTrigger id="case-select">
                  <SelectValue placeholder="Capitalização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preserve">Preservar Original</SelectItem>
                  <SelectItem value="upper">MAIÚSCULO</SelectItem>
                  <SelectItem value="lower">minúsculo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Input & Output */}
        <div className="grid gap-6 md:grid-cols-2 lg:h-[500px]">
          <Card className="flex flex-col h-full border-primary/20">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Entrada (SQL Sujo)</span>
              {error && <span className="text-xs text-destructive max-w-[200px] truncate" title={error}>{error}</span>}
            </div>
            <CardContent className="flex-1 p-0">
              <Textarea
                className="w-full h-full min-h-[300px] lg:min-h-0 resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm p-4 bg-muted/10"
                placeholder="SELECT id, name, email FROM users WHERE active = 1 ORDER BY created_at DESC;"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full border-primary/20">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Saída (SQL Formatado)</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleMinify} disabled={!input}>
                  Minificar
                </Button>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!output}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="flex-1 p-0">
              <Textarea
                className="w-full h-full min-h-[300px] lg:min-h-0 resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm p-4 bg-muted/30 text-primary"
                value={output}
                readOnly
                placeholder="Resultado aparecerá aqui..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolWrapper>
  )
}

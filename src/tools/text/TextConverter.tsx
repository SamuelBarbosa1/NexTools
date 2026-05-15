import { useState } from "react"
import { Type, Copy, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ConversionType = "uppercase" | "lowercase" | "camelCase" | "snake_case" | "kebab-case" | "pascalCase" | "base64Encode" | "base64Decode"

export function TextConverter() {
  const [input, setInput] = useState("")
  const [conversionType, setConversionType] = useState<ConversionType>("uppercase")

  const convertText = (text: string, type: ConversionType) => {
    if (!text) return ""

    try {
      switch (type) {
        case "uppercase":
          return text.toUpperCase()
        case "lowercase":
          return text.toLowerCase()
        case "camelCase":
          return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
          }).replace(/\s+/g, '')
        case "snake_case":
          return text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            ?.map(x => x.toLowerCase())
            .join('_') || text
        case "kebab-case":
          return text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            ?.map(x => x.toLowerCase())
            .join('-') || text
        case "pascalCase":
          return text.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).replace(/\s+/g, '')
        case "base64Encode":
          return btoa(text)
        case "base64Decode":
          return atob(text)
        default:
          return text
      }
    } catch (e) {
      return "Erro na conversão. (Possivelmente string Base64 inválida)"
    }
  }

  const output = convertText(input, conversionType)

  const copyToClipboard = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    toast.success("Texto convertido copiado!")
  }

  return (
    <ToolWrapper
      id="conversor-texto"
      title="Conversor de Texto"
      description="Converta textos entre diferentes formatos, caixas e codificações."
      icon={Type}
      actions={
        <Button variant="outline" size="sm" onClick={() => setInput("")} title="Limpar Tudo">
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:h-[500px]">
        <Card className="flex flex-col h-full border-primary/20">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold">Entrada</span>
          </div>
          <CardContent className="flex-1 p-0">
            <Textarea
              className="w-full h-full min-h-[250px] lg:min-h-0 resize-none border-0 rounded-none focus-visible:ring-0 text-base p-4 bg-muted/10"
              placeholder="Digite o texto aqui..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full border-primary/20">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Saída</span>
              <Select value={conversionType} onValueChange={(v) => setConversionType(v as ConversionType)}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uppercase">MAIÚSCULAS</SelectItem>
                  <SelectItem value="lowercase">minúsculas</SelectItem>
                  <SelectItem value="camelCase">camelCase</SelectItem>
                  <SelectItem value="snake_case">snake_case</SelectItem>
                  <SelectItem value="kebab-case">kebab-case</SelectItem>
                  <SelectItem value="pascalCase">PascalCase</SelectItem>
                  <SelectItem value="base64Encode">Base64 Encode</SelectItem>
                  <SelectItem value="base64Decode">Base64 Decode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!output}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <CardContent className="flex-1 p-0">
            <Textarea
              className="w-full h-full min-h-[250px] lg:min-h-0 resize-none border-0 rounded-none focus-visible:ring-0 text-base p-4 bg-muted/30 text-primary"
              value={output}
              readOnly
              placeholder="Resultado..."
            />
          </CardContent>
        </Card>
      </div>
    </ToolWrapper>
  )
}

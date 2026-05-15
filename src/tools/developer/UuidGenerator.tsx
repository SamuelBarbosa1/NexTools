import { useState, useEffect, useCallback } from "react"
import { Hash, Copy, RefreshCw, Download } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState([5])
  const [uppercase, setUppercase] = useState(false)
  const [stripHyphens, setStripHyphens] = useState(false)

  // RFC4122 version 4 UUID generator
  const generateV4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  const generateUuids = useCallback(() => {
    let newUuids = []
    for (let i = 0; i < count[0]; i++) {
      let uuid = generateV4()
      if (uppercase) uuid = uuid.toUpperCase()
      if (stripHyphens) uuid = uuid.replace(/-/g, '')
      newUuids.push(uuid)
    }
    setUuids(newUuids)
  }, [count, uppercase, stripHyphens])

  useEffect(() => {
    generateUuids()
  }, [generateUuids])

  const copyAllToClipboard = () => {
    if (uuids.length === 0) return
    navigator.clipboard.writeText(uuids.join('\n'))
    toast.success(`${uuids.length} UUID(s) copiados!`)
  }

  const downloadUuids = () => {
    if (uuids.length === 0) return
    const element = document.createElement("a")
    const file = new Blob([uuids.join('\n')], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = "uuids.txt"
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
    document.body.removeChild(element)
    toast.success("Download iniciado!")
  }

  return (
    <ToolWrapper
      id="gerador-uuid"
      title="Gerador de UUID"
      description="Gere Identificadores Únicos Universais (UUIDs) versão 4."
      icon={Hash}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={downloadUuids} title="Baixar TXT">
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>
          <Button size="sm" onClick={generateUuids} title="Gerar Novos">
            <RefreshCw className="h-4 w-4 mr-2" />
            Gerar
          </Button>
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Quantidade</Label>
                  <span className="font-mono text-lg font-medium">{count[0]}</span>
                </div>
                <Slider
                  value={count}
                  onValueChange={setCount}
                  max={100}
                  min={1}
                  step={1}
                  className="py-4"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="uppercase" className="text-base cursor-pointer">
                    Maiúsculas
                  </Label>
                  <Switch
                    id="uppercase"
                    checked={uppercase}
                    onCheckedChange={setUppercase}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="hyphens" className="text-base cursor-pointer">
                    Remover hifens
                  </Label>
                  <Switch
                    id="hyphens"
                    checked={stripHyphens}
                    onCheckedChange={setStripHyphens}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col h-[500px]">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold">Resultado</span>
            <Button variant="ghost" size="sm" onClick={copyAllToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar Todos
            </Button>
          </div>
          <CardContent className="flex-1 p-0">
            <Textarea
              className="w-full h-full resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-base p-4 bg-muted/10 leading-relaxed"
              value={uuids.join('\n')}
              readOnly
            />
          </CardContent>
        </Card>
      </div>
    </ToolWrapper>
  )
}

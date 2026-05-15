import { useState } from "react"
import { FileText, Copy, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CpfCnpjGenerator() {
  const [docType, setDocType] = useState<"CPF" | "CNPJ">("CPF")
  const [mask, setMask] = useState(true)
  const [generatedDoc, setGeneratedDoc] = useState("")

  const generateRandomDigits = (n: number) => {
    let result = ''
    for (let i = 0; i < n; i++) {
      result += Math.floor(Math.random() * 9).toString()
    }
    return result
  }

  const calculateDigitCpf = (base: string) => {
    let sum = 0
    let weight = base.length + 1
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i]) * weight--
    }
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const generateCpf = () => {
    let base = generateRandomDigits(9)
    const d1 = calculateDigitCpf(base)
    base += d1
    const d2 = calculateDigitCpf(base)
    base += d2
    
    if (mask) {
      return base.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return base
  }

  const calculateDigitCnpj = (base: string) => {
    let sum = 0
    let weight = base.length === 12 ? 5 : 6
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i]) * weight--
      if (weight < 2) weight = 9
    }
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }

  const generateCnpj = () => {
    let base = generateRandomDigits(8) + "0001"
    const d1 = calculateDigitCnpj(base)
    base += d1
    const d2 = calculateDigitCnpj(base)
    base += d2

    if (mask) {
      return base.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
    return base
  }

  const handleGenerate = () => {
    const doc = docType === "CPF" ? generateCpf() : generateCnpj()
    setGeneratedDoc(doc)
  }

  const copyToClipboard = () => {
    if (!generatedDoc) return
    navigator.clipboard.writeText(generatedDoc)
    toast.success(`${docType} copiado para a área de transferência!`)
  }

  return (
    <ToolWrapper
      id="gerador-cpf-cnpj"
      title="Gerador CPF/CNPJ"
      description="Gere CPFs e CNPJs válidos para testes de software."
      icon={FileText}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Tipo de Documento</Label>
                <Select value={docType} onValueChange={(v) => setDocType(v as "CPF" | "CNPJ")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPF">CPF</SelectItem>
                    <SelectItem value="CNPJ">CNPJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="mask" className="text-base cursor-pointer">
                  Com Pontuação (Máscara)
                </Label>
                <Switch
                  id="mask"
                  checked={mask}
                  onCheckedChange={setMask}
                />
              </div>

              <Button className="w-full" onClick={handleGenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar {docType}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex flex-col justify-center h-full space-y-4">
              <Label className="text-center text-muted-foreground text-lg">Documento Gerado</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={generatedDoc}
                  className="font-mono text-center text-2xl h-14 tracking-widest bg-background"
                  placeholder={docType === "CPF" ? "000.000.000-00" : "00.000.000/0001-00"}
                />
              </div>
              <Button variant="secondary" className="w-full" onClick={copyToClipboard} disabled={!generatedDoc}>
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolWrapper>
  )
}

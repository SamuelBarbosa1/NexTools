import { useState } from "react"
import { FileText, Copy, RefreshCw, CheckCircle2, XCircle, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function PisPasepGenerator() {
  const [mode, setMode] = useState<"gerar" | "validar">("gerar")
  const [mask, setMask] = useState(true)
  const [generatedDoc, setGeneratedDoc] = useState("")
  const [inputDoc, setInputDoc] = useState("")
  const [validationResult, setValidationResult] = useState<boolean | null>(null)

  const generatePis = (useMask: boolean) => {
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let base = ''
    let sum = 0
    for (let i = 0; i < 10; i++) {
      const r = Math.floor(Math.random() * 10)
      base += r.toString()
      sum += r * weights[i]
    }
    const rest = sum % 11
    const digit = rest < 2 ? 0 : 11 - rest
    base += digit.toString()

    if (useMask) {
      return base.replace(/^(\d{3})(\d{5})(\d{2})(\d{1})$/, "$1.$2.$3-$4")
    }
    return base
  }

  const handleGenerate = () => {
    const doc = generatePis(mask)
    setGeneratedDoc(doc)
  }

  const validatePis = (pis: string) => {
    const clean = pis.replace(/\D/g, '')
    if (clean.length !== 11) return false
    if (/^(\d)\1{10}$/.test(clean)) return false

    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(clean.charAt(i)) * weights[i]
    }
    const rest = sum % 11
    const expectedDigit = rest < 2 ? 0 : 11 - rest
    return expectedDigit === parseInt(clean.charAt(10))
  }

  const handleValidate = () => {
    if (!inputDoc) {
      setValidationResult(null)
      return
    }
    const isValid = validatePis(inputDoc)
    setValidationResult(isValid)
  }

  const copyToClipboard = () => {
    if (!generatedDoc) return
    navigator.clipboard.writeText(generatedDoc)
    toast.success("PIS/PASEP copiado para a área de transferência!")
  }

  return (
    <ToolWrapper
      id="gerador-pis-pasep"
      title="Gerador e Validador de PIS/PASEP"
      description="Gere e valide números de PIS/PASEP para testes de software e sistemas."
      icon={FileText}
    >
      <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={mode === "gerar" ? "default" : "ghost"}
          onClick={() => setMode("gerar")}
          className="w-32"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Gerar
        </Button>
        <Button
          variant={mode === "validar" ? "default" : "ghost"}
          onClick={() => {
            setMode("validar")
            setValidationResult(null)
          }}
          className="w-32"
        >
          <ShieldCheck className="h-4 w-4 mr-2" />
          Validar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mode === "gerar" ? (
          <>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Geração</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between space-x-2 pt-2">
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
                    Gerar PIS/PASEP
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="h-full border-primary/20 bg-primary/5">
                <CardContent className="p-6 flex flex-col justify-center h-full space-y-4">
                  <Label className="text-center text-muted-foreground text-lg">PIS/PASEP Gerado</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={generatedDoc}
                      className="font-mono text-center text-2xl h-14 tracking-widest bg-background font-bold"
                      placeholder={mask ? "000.00000.00-0" : "00000000000"}
                    />
                  </div>
                  <Button variant="secondary" className="w-full" onClick={copyToClipboard} disabled={!generatedDoc}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Validação de PIS/PASEP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="input-doc">Número do PIS/PASEP</Label>
                    <Input
                      id="input-doc"
                      value={inputDoc}
                      onChange={(e) => {
                        setInputDoc(e.target.value)
                        setValidationResult(null)
                      }}
                      placeholder="000.00000.00-0 ou 00000000000"
                      className="font-mono text-lg"
                    />
                  </div>

                  <Button className="w-full" onClick={handleValidate} disabled={!inputDoc}>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Validar PIS/PASEP
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className={cn(
                "h-full transition-colors duration-300",
                validationResult === true && "border-green-500/50 bg-green-500/5",
                validationResult === false && "border-red-500/50 bg-red-500/5",
                validationResult === null && "border-primary/20 bg-primary/5"
              )}>
                <CardContent className="p-6 flex flex-col items-center justify-center h-full space-y-4 min-h-[200px]">
                  {validationResult === null ? (
                    <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                      <ShieldCheck className="h-12 w-12 text-primary/30" />
                      <span>Digite um PIS/PASEP e clique em validar</span>
                    </div>
                  ) : validationResult === true ? (
                    <div className="text-center space-y-3 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">PIS/PASEP Válido!</div>
                      <p className="text-sm text-muted-foreground">O número informado possui um dígito verificador correto.</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-3 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                      <XCircle className="h-16 w-16 text-red-500" />
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">PIS/PASEP Inválido</div>
                      <p className="text-sm text-muted-foreground">O número informado não é um PIS/PASEP válido.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </ToolWrapper>
  )
}

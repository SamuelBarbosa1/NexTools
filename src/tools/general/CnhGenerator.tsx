import { useState } from "react"
import { Copy, RefreshCw, CheckCircle2, XCircle, ShieldCheck, Car } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function CnhGenerator() {
  const [mode, setMode] = useState<"gerar" | "validar">("gerar")
  const [generatedDoc, setGeneratedDoc] = useState("")
  const [inputDoc, setInputDoc] = useState("")
  const [validationResult, setValidationResult] = useState<boolean | null>(null)

  const generateCnh = () => {
    let base = ''
    for (let i = 0; i < 9; i++) { base += Math.floor(Math.random() * 10).toString() }
    
    let sum1 = 0, sum2 = 0
    for (let i = 0; i < 9; i++) {
      sum1 += parseInt(base.charAt(i)) * (9 - i)
      sum2 += parseInt(base.charAt(i)) * (1 + i)
    }
    
    let d1 = sum1 % 11
    let incr = 0
    if (d1 >= 10) { 
      d1 = 0
      incr = 2 
    }
    
    let d2 = sum2 % 11
    if (d2 >= 10) { 
      d2 = 0 
    } else if (incr > 0) {
      d2 = d2 - incr
      if (d2 < 0) d2 += 11
      if (d2 >= 10) d2 = 0
    }
    
    return base + d1.toString() + d2.toString()
  }

  const handleGenerate = () => {
    const doc = generateCnh()
    setGeneratedDoc(doc)
  }

  const validateCnh = (cnh: string) => {
    const clean = cnh.replace(/\D/g, '')
    if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) return false
    
    let sum1 = 0, sum2 = 0
    for (let i = 0; i < 9; i++) {
      sum1 += parseInt(clean.charAt(i)) * (9 - i)
      sum2 += parseInt(clean.charAt(i)) * (1 + i)
    }
    
    let d1 = sum1 % 11
    let incr = 0
    if (d1 >= 10) { 
      d1 = 0
      incr = 2 
    }
    
    let d2 = sum2 % 11
    if (d2 >= 10) { 
      d2 = 0 
    } else if (incr > 0) {
      d2 = d2 - incr
      if (d2 < 0) d2 += 11
      if (d2 >= 10) d2 = 0
    }
    
    return clean.charAt(9) === d1.toString() && clean.charAt(10) === d2.toString()
  }

  const handleValidate = () => {
    if (!inputDoc) {
      setValidationResult(null)
      return
    }
    const isValid = validateCnh(inputDoc)
    setValidationResult(isValid)
  }

  const copyToClipboard = () => {
    if (!generatedDoc) return
    navigator.clipboard.writeText(generatedDoc)
    toast.success("CNH copiada para a área de transferência!")
  }

  return (
    <ToolWrapper
      id="gerador-cnh"
      title="Gerador e Validador de CNH"
      description="Gere e valide números de Carteira Nacional de Habilitação (CNH) para testes de software."
      icon={Car}
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
                  <p className="text-sm text-muted-foreground">
                    O gerador de CNH cria números de 11 dígitos respeitando o algoritmo oficial de Módulo 11 com regra de incremento para os dois dígitos verificadores.
                  </p>
                  <Button className="w-full" onClick={handleGenerate}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Gerar CNH
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="h-full border-primary/20 bg-primary/5">
                <CardContent className="p-6 flex flex-col justify-center h-full space-y-4">
                  <Label className="text-center text-muted-foreground text-lg">CNH Gerada</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      readOnly
                      value={generatedDoc}
                      className="font-mono text-center text-2xl h-14 tracking-widest bg-background font-bold"
                      placeholder="00000000000"
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
                  <CardTitle>Validação de CNH</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="input-doc">Número da CNH</Label>
                    <Input
                      id="input-doc"
                      value={inputDoc}
                      onChange={(e) => {
                        setInputDoc(e.target.value)
                        setValidationResult(null)
                      }}
                      placeholder="Digite os 11 dígitos da CNH"
                      className="font-mono text-lg"
                    />
                  </div>

                  <Button className="w-full" onClick={handleValidate} disabled={!inputDoc}>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Validar CNH
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
                      <span>Digite uma CNH e clique em validar</span>
                    </div>
                  ) : validationResult === true ? (
                    <div className="text-center space-y-3 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">CNH Válida!</div>
                      <p className="text-sm text-muted-foreground">O número informado possui os dígitos verificadores corretos.</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-3 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                      <XCircle className="h-16 w-16 text-red-500" />
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">CNH Inválida</div>
                      <p className="text-sm text-muted-foreground">O número informado não é uma CNH válida.</p>
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

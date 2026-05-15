import { useState } from "react"
import { Scroll, Copy, RefreshCw, CheckCircle2, XCircle, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export function CertificateGenerator() {
  const [mode, setMode] = useState<"gerar" | "validar">("gerar")
  const [certType, setCertType] = useState<string>("1") // 1-Nascimento, 2-Casamento, 3-Religioso, 4-Óbito
  const [mask, setMask] = useState(true)
  const [generatedDoc, setGeneratedDoc] = useState({ formatted: "", clean: "", typeName: "" })
  const [inputDoc, setInputDoc] = useState("")
  const [validationResult, setValidationResult] = useState<{ valid: boolean; typeName: string } | null>(null)

  const CERT_TYPES: Record<string, string> = {
    "1": "Certidão de Nascimento",
    "2": "Certidão de Casamento",
    "3": "Casamento Religioso com Efeito Civil",
    "4": "Certidão de Óbito"
  }

  const calcDv = (b: string) => {
    let sum = 0
    let weight = 2
    for (let i = b.length - 1; i >= 0; i--) {
      sum += parseInt(b.charAt(i)) * weight
      weight = weight === 10 ? 2 : weight + 1
    }
    const rem = sum % 11
    let dv = rem < 2 ? 0 : 11 - rem
    if (dv >= 10) dv = 1
    return dv.toString()
  }

  const generateCertificate = (typeVal: string) => {
    // CNS (6)
    let cns = ""
    for (let i = 0; i < 6; i++) { cns += Math.floor(Math.random() * 10).toString() }
    
    // Acervo (2) - 01 Registro Civil
    const acervo = "01"
    
    // 55 (2) - RCPN
    const rcpn = "55"
    
    // Ano (4)
    const currentYear = new Date().getFullYear()
    const ano = (currentYear - Math.floor(Math.random() * 15)).toString()
    
    // Tipo (1)
    const tipo = typeVal
    
    // Livro (5)
    let livro = ""
    for (let i = 0; i < 5; i++) { livro += Math.floor(Math.random() * 10).toString() }
    
    // Folha (3)
    let folha = ""
    for (let i = 0; i < 3; i++) { folha += Math.floor(Math.random() * 10).toString() }
    
    // Termo (4)
    let termo = ""
    for (let i = 0; i < 4; i++) { termo += Math.floor(Math.random() * 10).toString() }

    const base = cns + acervo + rcpn + ano + tipo + livro + folha + termo
    const dv1 = calcDv(base)
    const dv2 = calcDv(base + dv1)
    const full = base + dv1 + dv2

    const formatted = full.replace(
      /(\d{6})(\d{2})(\d{2})(\d{4})(\d{1})(\d{5})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3.$4.$5.$6.$7.$8-$9"
    )

    return {
      formatted,
      clean: full,
      typeName: CERT_TYPES[typeVal]
    }
  }

  const handleGenerate = () => {
    const res = generateCertificate(certType)
    setGeneratedDoc(res)
  }

  const validateCertificate = (cert: string) => {
    const clean = cert.replace(/\D/g, '')
    if (clean.length !== 32 || /^(\d)\1{31}$/.test(clean)) return { valid: false, typeName: "" }
    
    const base = clean.substring(0, 30)
    const dv1Input = clean.charAt(30)
    const dv2Input = clean.charAt(31)

    const dv1 = calcDv(base)
    const dv2 = calcDv(base + dv1)

    const isValid = dv1 === dv1Input && dv2 === dv2Input
    const tipo = clean.charAt(14)
    const typeName = CERT_TYPES[tipo] || "Certidão / Documento Desconhecido"

    return { valid: isValid, typeName }
  }

  const handleValidate = () => {
    if (!inputDoc) {
      setValidationResult(null)
      return
    }
    const res = validateCertificate(inputDoc)
    setValidationResult(res)
  }

  const copyToClipboard = () => {
    if (!generatedDoc.clean) return
    const textToCopy = mask ? generatedDoc.formatted : generatedDoc.clean
    navigator.clipboard.writeText(textToCopy)
    toast.success("Certidão copiada para a área de transferência!")
  }

  return (
    <ToolWrapper
      id="gerador-certidao"
      title="Gerador e Validador de Certidão Unificada"
      description="Gere e valide certidões de Nascimento, Casamento e Óbito no padrão CNJ (32 dígitos)."
      icon={Scroll}
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
                  <div className="space-y-4">
                    <Label>Tipo de Certidão</Label>
                    <Select value={certType} onValueChange={setCertType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CERT_TYPES).map(([code, name]) => (
                          <SelectItem key={code} value={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
                    Gerar Certidão
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="h-full border-primary/20 bg-primary/5">
                <CardContent className="p-6 flex flex-col justify-center h-full space-y-4">
                  {!generatedDoc.clean ? (
                    <div className="text-center text-muted-foreground flex flex-col items-center gap-3">
                      <Scroll className="h-12 w-12 text-primary/30" />
                      <span>Clique em "Gerar Certidão" para começar</span>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <Label className="text-center text-muted-foreground text-lg block">Certidão Gerada</Label>
                      <Input
                        readOnly
                        value={mask ? generatedDoc.formatted : generatedDoc.clean}
                        className="font-mono text-center text-lg h-14 tracking-wider bg-background font-bold"
                      />
                      <div className="text-center text-sm font-semibold text-primary">
                        {generatedDoc.typeName}
                      </div>
                      <Button variant="secondary" className="w-full" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Documento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Validação de Certidão Unificada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="input-doc">Matrícula da Certidão</Label>
                    <Input
                      id="input-doc"
                      value={inputDoc}
                      onChange={(e) => {
                        setInputDoc(e.target.value)
                        setValidationResult(null)
                      }}
                      placeholder="Digite os 32 dígitos (com ou sem pontuação)"
                      className="font-mono text-base"
                    />
                  </div>

                  <Button className="w-full" onClick={handleValidate} disabled={!inputDoc}>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Validar Certidão
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className={cn(
                "h-full transition-colors duration-300",
                validationResult?.valid === true && "border-green-500/50 bg-green-500/5",
                validationResult?.valid === false && "border-red-500/50 bg-red-500/5",
                !validationResult && "border-primary/20 bg-primary/5"
              )}>
                <CardContent className="p-6 flex flex-col items-center justify-center h-full space-y-4 min-h-[200px]">
                  {!validationResult ? (
                    <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                      <ShieldCheck className="h-12 w-12 text-primary/30" />
                      <span>Digite uma Certidão e clique em validar</span>
                    </div>
                  ) : validationResult.valid ? (
                    <div className="text-center space-y-3 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">Certidão Válida!</div>
                      <div className="text-lg font-semibold text-primary">{validationResult.typeName}</div>
                      <p className="text-sm text-muted-foreground">O número informado possui os dígitos verificadores corretos no padrão CNJ.</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-3 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                      <XCircle className="h-16 w-16 text-red-500" />
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">Certidão Inválida</div>
                      <p className="text-sm text-muted-foreground">O número informado não é uma Certidão Unificada válida.</p>
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

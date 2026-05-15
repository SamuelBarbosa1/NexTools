import { useState } from "react"
import { Vote, Copy, RefreshCw, CheckCircle2, XCircle, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const UF_CODES: Record<string, string> = {
  "01": "SP - São Paulo",
  "02": "MG - Minas Gerais",
  "03": "RJ - Rio de Janeiro",
  "04": "RS - Rio Grande do Sul",
  "05": "BA - Bahia",
  "06": "PR - Paraná",
  "07": "CE - Ceará",
  "08": "PE - Pernambuco",
  "09": "SC - Santa Catarina",
  "10": "GO - Goiás",
  "11": "MA - Maranhão",
  "12": "PB - Paraíba",
  "13": "PA - Pará",
  "14": "ES - Espírito Santo",
  "15": "PI - Piauí",
  "16": "RN - Rio Grande do Norte",
  "17": "AL - Alagoas",
  "18": "MT - Mato Grosso",
  "19": "MS - Mato Grosso do Sul",
  "20": "DF - Distrito Federal",
  "21": "SE - Sergipe",
  "22": "AM - Amazonas",
  "23": "RO - Rondônia",
  "24": "AC - Acre",
  "25": "AP - Amapá",
  "26": "RR - Roraima",
  "27": "TO - Tocantins",
  "28": "ZZ - Exterior"
}

export function VoterTitleGenerator() {
  const [mode, setMode] = useState<"gerar" | "validar">("gerar")
  const [selectedUf, setSelectedUf] = useState<string>("indiferente")
  const [generatedDoc, setGeneratedDoc] = useState({ number: "", ufName: "" })
  const [inputDoc, setInputDoc] = useState("")
  const [validationResult, setValidationResult] = useState<{ valid: boolean; uf: string } | null>(null)

  const generateVoterTitle = (ufOpt: string) => {
    let base = ''
    for (let i = 0; i < 8; i++) { base += Math.floor(Math.random() * 10).toString() }
    
    let uf = ufOpt
    if (uf === "indiferente") {
      const ufs = Object.keys(UF_CODES)
      uf = ufs[Math.floor(Math.random() * ufs.length)]
    }

    // DV1
    let sum1 = 0
    for (let i = 0; i < 8; i++) { sum1 += parseInt(base.charAt(i)) * (i + 2) }
    let rem1 = sum1 % 11
    let dv1 = 0
    if (rem1 === 0) {
      dv1 = (uf === "01" || uf === "02") ? 1 : 0
    } else {
      dv1 = rem1 === 10 ? 0 : rem1
    }

    // DV2
    const base2 = uf + dv1.toString()
    let sum2 = 0
    for (let i = 0; i < 3; i++) { sum2 += parseInt(base2.charAt(i)) * (i + 7) }
    let rem2 = sum2 % 11
    let dv2 = 0
    if (rem2 === 0) {
      dv2 = (uf === "01" || uf === "02") ? 1 : 0
    } else {
      dv2 = rem2 === 10 ? 0 : rem2
    }

    return {
      num: base + uf + dv1.toString() + dv2.toString(),
      ufCode: uf
    }
  }

  const handleGenerate = () => {
    const res = generateVoterTitle(selectedUf)
    setGeneratedDoc({
      number: res.num.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3"),
      ufName: UF_CODES[res.ufCode]
    })
  }

  const validateVoterTitle = (title: string) => {
    const clean = title.replace(/\D/g, '')
    if (clean.length !== 12 || /^(\d)\1{11}$/.test(clean)) return { valid: false, uf: "" }
    
    const uf = clean.substring(8, 10)
    if (!UF_CODES[uf]) return { valid: false, uf: "" }

    // DV1
    let sum1 = 0
    for (let i = 0; i < 8; i++) { sum1 += parseInt(clean.charAt(i)) * (i + 2) }
    let rem1 = sum1 % 11
    let dv1 = 0
    if (rem1 === 0) {
      dv1 = (uf === "01" || uf === "02") ? 1 : 0
    } else {
      dv1 = rem1 === 10 ? 0 : rem1
    }

    // DV2
    const base2 = uf + dv1.toString()
    let sum2 = 0
    for (let i = 0; i < 3; i++) { sum2 += parseInt(base2.charAt(i)) * (i + 7) }
    let rem2 = sum2 % 11
    let dv2 = 0
    if (rem2 === 0) {
      dv2 = (uf === "01" || uf === "02") ? 1 : 0
    } else {
      dv2 = rem2 === 10 ? 0 : rem2
    }

    const isValid = clean.charAt(10) === dv1.toString() && clean.charAt(11) === dv2.toString()
    return { valid: isValid, uf: UF_CODES[uf] }
  }

  const handleValidate = () => {
    if (!inputDoc) {
      setValidationResult(null)
      return
    }
    const res = validateVoterTitle(inputDoc)
    setValidationResult(res)
  }

  const copyToClipboard = () => {
    if (!generatedDoc.number) return
    navigator.clipboard.writeText(generatedDoc.number.replace(/\D/g, ''))
    toast.success("Título de Eleitor copiado para a área de transferência!")
  }

  return (
    <ToolWrapper
      id="gerador-titulo-eleitor"
      title="Gerador e Validador de Título de Eleitor"
      description="Gere e valide números de Título de Eleitor por estado (UF) para testes de software."
      icon={Vote}
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
                    <Label>Estado (UF) de Origem</Label>
                    <Select value={selectedUf} onValueChange={setSelectedUf}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indiferente">Indiferente</SelectItem>
                        {Object.entries(UF_CODES).map(([code, name]) => (
                          <SelectItem key={code} value={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" onClick={handleGenerate}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Gerar Título de Eleitor
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="h-full border-primary/20 bg-primary/5">
                <CardContent className="p-6 flex flex-col justify-center h-full space-y-4">
                  {!generatedDoc.number ? (
                    <div className="text-center text-muted-foreground flex flex-col items-center gap-3">
                      <Vote className="h-12 w-12 text-primary/30" />
                      <span>Clique em "Gerar Título" para começar</span>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <Label className="text-center text-muted-foreground text-lg block">Título de Eleitor Gerado</Label>
                      <Input
                        readOnly
                        value={generatedDoc.number}
                        className="font-mono text-center text-2xl h-14 tracking-widest bg-background font-bold"
                      />
                      <div className="text-center text-sm font-semibold text-primary">
                        {generatedDoc.ufName}
                      </div>
                      <Button variant="secondary" className="w-full" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar (Apenas Números)
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
                  <CardTitle>Validação de Título de Eleitor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="input-doc">Número do Título</Label>
                    <Input
                      id="input-doc"
                      value={inputDoc}
                      onChange={(e) => {
                        setInputDoc(e.target.value)
                        setValidationResult(null)
                      }}
                      placeholder="Digite os 12 dígitos"
                      className="font-mono text-lg"
                    />
                  </div>

                  <Button className="w-full" onClick={handleValidate} disabled={!inputDoc}>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Validar Título
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
                      <span>Digite um Título de Eleitor e clique em validar</span>
                    </div>
                  ) : validationResult.valid ? (
                    <div className="text-center space-y-3 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">Título Válido!</div>
                      <div className="text-lg font-semibold text-primary">{validationResult.uf}</div>
                      <p className="text-sm text-muted-foreground">O número informado possui os dígitos verificadores corretos para este estado.</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-3 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                      <XCircle className="h-16 w-16 text-red-500" />
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">Título Inválido</div>
                      <p className="text-sm text-muted-foreground">O número informado não é um Título de Eleitor válido.</p>
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

import { useState } from "react"
import { CreditCard, Copy, RefreshCw, CheckCircle2, XCircle, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

type BrandConfig = {
  id: string
  name: string
  prefixes: string[]
  length: number
  cvvLen: number
}

const BRANDS: BrandConfig[] = [
  { id: "mastercard", name: "MasterCard", prefixes: ["51", "52", "53", "54", "55"], length: 16, cvvLen: 3 },
  { id: "visa", name: "Visa 16 Dígitos", prefixes: ["4"], length: 16, cvvLen: 3 },
  { id: "amex", name: "American Express", prefixes: ["34", "37"], length: 15, cvvLen: 4 },
  { id: "diners", name: "Diners Club", prefixes: ["300", "301", "302", "303", "304", "305", "36", "38"], length: 14, cvvLen: 3 },
  { id: "discover", name: "Discover", prefixes: ["6011", "622", "64", "65"], length: 16, cvvLen: 3 },
  { id: "enroute", name: "EnRoute", prefixes: ["2014", "2149"], length: 15, cvvLen: 3 },
  { id: "jcb", name: "JCB", prefixes: ["35"], length: 16, cvvLen: 3 },
  { id: "voyager", name: "Voyager", prefixes: ["8699"], length: 15, cvvLen: 3 },
  { id: "hipercard", name: "HiperCard", prefixes: ["606282"], length: 16, cvvLen: 3 },
  { id: "aura", name: "Aura", prefixes: ["50"], length: 16, cvvLen: 3 },
]

export function CreditCardGenerator() {
  const [mode, setMode] = useState<"gerar" | "validar">("gerar")
  const [selectedBrand, setSelectedBrand] = useState<string>("mastercard")
  
  const [generatedCard, setGeneratedCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
    brandName: ""
  })

  const [inputCard, setInputCard] = useState("")
  const [validationResult, setValidationResult] = useState<{ valid: boolean; brand: string } | null>(null)

  const generateLuhn = (prefix: string, totalLen: number) => {
    let num = prefix
    while (num.length < totalLen - 1) { num += Math.floor(Math.random() * 10).toString() }
    
    let sum = 0
    let shouldDouble = true
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i))
      if (shouldDouble) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      shouldDouble = !shouldDouble
    }
    const checkDigit = (10 - (sum % 10)) % 10
    return num + checkDigit.toString()
  }

  const formatCardNumber = (num: string, brandId: string) => {
    if (brandId === "amex") {
      // 4-6-5
      return num.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3")
    } else if (brandId === "diners") {
      // 4-6-4
      return num.replace(/(\d{4})(\d{6})(\d{4})/, "$1 $2 $3")
    } else if (num.length === 16) {
      // 4-4-4-4
      return num.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4")
    }
    return num
  }

  const handleGenerate = () => {
    const brandObj = BRANDS.find(b => b.id === selectedBrand)!
    const prefix = brandObj.prefixes[Math.floor(Math.random() * brandObj.prefixes.length)]
    
    const rawNumber = generateLuhn(prefix, brandObj.length)
    const formattedNumber = formatCardNumber(rawNumber, brandObj.id)

    // Expiry Date (MM/YYYY)
    const currentYear = new Date().getFullYear()
    const month = (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0')
    const year = (currentYear + Math.floor(Math.random() * 6) + 1).toString()
    const expiry = `${month}/${year}`

    // CVV
    let cvv = ""
    for (let i = 0; i < brandObj.cvvLen; i++) {
      cvv += Math.floor(Math.random() * 10).toString()
    }

    setGeneratedCard({
      number: formattedNumber,
      expiry,
      cvv,
      brandName: brandObj.name
    })
  }

  const detectBrand = (cleanNumber: string): string => {
    for (const b of BRANDS) {
      if (b.prefixes.some(p => cleanNumber.startsWith(p))) {
        return b.name
      }
    }
    return "Desconhecida / Outra"
  }

  const validateLuhn = (cardNumber: string) => {
    const clean = cardNumber.replace(/\D/g, '')
    if (clean.length < 13 || clean.length > 19) return false
    let sum = 0
    let shouldDouble = false
    for (let i = clean.length - 1; i >= 0; i--) {
      let digit = parseInt(clean.charAt(i))
      if (shouldDouble) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      shouldDouble = !shouldDouble
    }
    return sum % 10 === 0
  }

  const handleValidate = () => {
    if (!inputCard) {
      setValidationResult(null)
      return
    }
    const clean = inputCard.replace(/\D/g, '')
    const isValid = validateLuhn(clean)
    const brand = detectBrand(clean)
    setValidationResult({ valid: isValid, brand })
  }

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado para a área de transferência!`)
  }

  return (
    <ToolWrapper
      id="gerador-cartao-credito"
      title="Gerador e Validador de Cartão de Crédito"
      description="Gere e valide números de cartão de crédito de diversas bandeiras para testes de software."
      icon={CreditCard}
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
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>1. Qual Bandeira de Cartão de Crédito?</Label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a bandeira" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANDS.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" onClick={handleGenerate}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Gerar Cartão de Crédito
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="h-full border-primary/20 bg-primary/5">
                <CardContent className="p-6 flex flex-col justify-center h-full space-y-6">
                  {!generatedCard.number ? (
                    <div className="text-center text-muted-foreground flex flex-col items-center gap-3">
                      <CreditCard className="h-12 w-12 text-primary/30" />
                      <span>Clique em "Gerar Cartão" para começar</span>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground flex justify-between">
                          <span>Número do Cartão</span>
                          <span className="font-bold text-primary">{generatedCard.brandName}</span>
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            value={generatedCard.number}
                            className="font-mono text-xl tracking-wider font-bold bg-background"
                          />
                          <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedCard.number, "Número do Cartão")}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Data de Validade</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              readOnly
                              value={generatedCard.expiry}
                              className="font-mono text-center text-lg bg-background tracking-wider"
                            />
                            <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedCard.expiry, "Data de Validade")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-muted-foreground">Código Segurança (CVV)</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              readOnly
                              value={generatedCard.cvv}
                              className="font-mono text-center text-lg bg-background tracking-wider"
                            />
                            <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedCard.cvv, "CVV")}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
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
                  <CardTitle>Validação de Cartão de Crédito</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="input-card">Número do Cartão</Label>
                    <Input
                      id="input-card"
                      value={inputCard}
                      onChange={(e) => {
                        setInputCard(e.target.value)
                        setValidationResult(null)
                      }}
                      placeholder="5582 2203 9030 8681"
                      className="font-mono text-lg"
                    />
                  </div>

                  <Button className="w-full" onClick={handleValidate} disabled={!inputCard}>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Validar Cartão
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
                      <span>Digite o número do cartão e clique em validar</span>
                    </div>
                  ) : validationResult.valid ? (
                    <div className="text-center space-y-3 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">Cartão Válido!</div>
                      <div className="text-lg font-semibold text-primary">Bandeira: {validationResult.brand}</div>
                      <p className="text-sm text-muted-foreground">O número informado passou na verificação do algoritmo de Luhn.</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-3 animate-in zoom-in-95 duration-300 flex flex-col items-center">
                      <XCircle className="h-16 w-16 text-red-500" />
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">Cartão Inválido</div>
                      <p className="text-sm text-muted-foreground">O número informado não é um cartão de crédito válido.</p>
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

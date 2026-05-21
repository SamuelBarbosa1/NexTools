import { useState, useEffect } from "react"
import { Binary, Copy, Check, ArrowRightLeft } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TextMode = "base64-encode" | "base64-decode" | "url-encode" | "url-decode" | "hex-encode" | "hex-decode" | "bin-encode" | "bin-decode"

export function BaseConverter() {
  // Tabs State (text or numeric)
  const [activeTab, setActiveTab] = useState("text")

  // Text Mode State
  const [textMode, setTextMode] = useState<TextMode>("base64-encode")
  const [textInput, setTextInput] = useState("")
  const [textOutput, setTextOutput] = useState("")
  const [copiedText, setCopiedText] = useState(false)

  // Numeric Mode State
  const [numDec, setNumDec] = useState("")
  const [numHex, setNumHex] = useState("")
  const [numOct, setNumOct] = useState("")
  const [numBin, setNumBin] = useState("")
  const [numError, setNumError] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  // Helper: Text encoding/decoding functions
  const safeBase64Encode = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str)
      const binString = Array.from(bytes, byte => String.fromCharCode(byte)).join("")
      return btoa(binString)
    } catch {
      return "Erro ao codificar para Base64"
    }
  }

  const safeBase64Decode = (str: string) => {
    try {
      const cleaned = str.replace(/\s+/g, "")
      const binString = atob(cleaned)
      const bytes = Uint8Array.from(binString, m => m.charCodeAt(0))
      return new TextDecoder().decode(bytes)
    } catch {
      return "Erro: Base64 inválido"
    }
  }

  const safeHexEncode = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str)
      return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join(" ")
    } catch {
      return "Erro ao codificar para Hexadecimal"
    }
  }

  const safeHexDecode = (str: string) => {
    try {
      const cleaned = str.replace(/[^0-9a-fA-F]/g, "")
      if (cleaned.length === 0) return ""
      if (cleaned.length % 2 !== 0) return "Erro: Tamanho hexadecimal ímpar"
      const bytes = new Uint8Array(cleaned.length / 2)
      for (let i = 0; i < cleaned.length; i += 2) {
        bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16)
      }
      return new TextDecoder().decode(bytes)
    } catch {
      return "Erro: Hexadecimal inválido"
    }
  }

  const safeBinEncode = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str)
      return Array.from(bytes, byte => byte.toString(2).padStart(8, "0")).join(" ")
    } catch {
      return "Erro ao codificar para Binário"
    }
  }

  const safeBinDecode = (str: string) => {
    try {
      const cleaned = str.replace(/[^01]/g, "")
      if (cleaned.length === 0) return ""
      if (cleaned.length % 8 !== 0) return `Erro: O comprimento binário deve ser múltiplo de 8 (atual: ${cleaned.length})`
      const bytes = new Uint8Array(cleaned.length / 8)
      for (let i = 0; i < cleaned.length; i += 8) {
        const byteVal = parseInt(cleaned.substring(i, i + 8), 2)
        bytes[i / 8] = byteVal
      }
      return new TextDecoder().decode(bytes)
    } catch {
      return "Erro: Binário inválido"
    }
  }

  // Handle Text Conversion
  useEffect(() => {
    if (!textInput) {
      setTextOutput("")
      return
    }

    switch (textMode) {
      case "base64-encode":
        setTextOutput(safeBase64Encode(textInput))
        break
      case "base64-decode":
        setTextOutput(safeBase64Decode(textInput))
        break
      case "url-encode":
        setTextOutput(encodeURIComponent(textInput))
        break
      case "url-decode":
        try {
          setTextOutput(decodeURIComponent(textInput))
        } catch {
          setTextOutput("Erro: URL inválida ou mal formatada")
        }
        break
      case "hex-encode":
        setTextOutput(safeHexEncode(textInput))
        break
      case "hex-decode":
        setTextOutput(safeHexDecode(textInput))
        break
      case "bin-encode":
        setTextOutput(safeBinEncode(textInput))
        break
      case "bin-decode":
        setTextOutput(safeBinDecode(textInput))
        break
    }
  }, [textInput, textMode])

  // Numeric Conversion Handlers
  const handleNumericChange = (value: string, source: "dec" | "hex" | "oct" | "bin") => {
    setNumError(null)

    if (!value.trim()) {
      setNumDec("")
      setNumHex("")
      setNumOct("")
      setNumBin("")
      return
    }

    try {
      let num = BigInt(0)
      const cleanValue = value.replace(/\s+/g, "")

      switch (source) {
        case "dec":
          if (!/^\d+$/.test(cleanValue)) throw new Error("Caractere inválido para base Decimal")
          num = BigInt(cleanValue)
          setNumDec(value)
          setNumHex(num.toString(16).toUpperCase())
          setNumOct(num.toString(8))
          setNumBin(num.toString(2))
          break
        case "hex":
          if (!/^[0-9a-fA-F]+$/.test(cleanValue)) throw new Error("Caractere inválido para base Hexadecimal")
          num = BigInt(`0x${cleanValue}`)
          setNumDec(num.toString(10))
          setNumHex(value.toUpperCase())
          setNumOct(num.toString(8))
          setNumBin(num.toString(2))
          break
        case "oct":
          if (!/^[0-7]+$/.test(cleanValue)) throw new Error("Caractere inválido para base Octal")
          num = BigInt(`0o${cleanValue}`)
          setNumDec(num.toString(10))
          setNumHex(num.toString(16).toUpperCase())
          setNumOct(value)
          setNumBin(num.toString(2))
          break
        case "bin":
          if (!/^[01]+$/.test(cleanValue)) throw new Error("Caractere inválido para base Binária")
          num = BigInt(`0b${cleanValue}`)
          setNumDec(num.toString(10))
          setNumHex(num.toString(16).toUpperCase())
          setNumOct(num.toString(8))
          setNumBin(value)
          break
      }
    } catch (err: any) {
      setNumError(err.message || "Valor inválido para a base correspondente.")
      // Keep input, but don't convert others
      if (source === "dec") setNumDec(value)
      if (source === "hex") setNumHex(value)
      if (source === "oct") setNumOct(value)
      if (source === "bin") setNumBin(value)
    }
  }

  const copyTextOutput = () => {
    if (!textOutput) return
    navigator.clipboard.writeText(textOutput)
    setCopiedText(true)
    setTimeout(() => setCopiedText(false), 2000)
    toast.success("Resultado copiado!")
  }

  const copyField = (text: string, fieldName: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
    toast.success(`${fieldName} copiado!`)
  }

  const pasteTextInput = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setTextInput(text)
        toast.success("Texto colado!")
      }
    } catch {
      toast.error("Erro ao ler da área de transferência.")
    }
  }

  const swapTextMode = () => {
    const swapMap: Record<TextMode, TextMode> = {
      "base64-encode": "base64-decode",
      "base64-decode": "base64-encode",
      "url-encode": "url-decode",
      "url-decode": "url-encode",
      "hex-encode": "hex-decode",
      "hex-decode": "hex-encode",
      "bin-encode": "bin-decode",
      "bin-decode": "bin-encode",
    }
    setTextMode(swapMap[textMode])
    setTextInput(textOutput) // Swap inputs as well
    toast.success("Direção de conversão invertida!")
  }

  return (
    <ToolWrapper
      id="conversor-base"
      title="Conversor de Base"
      description="Converta textos e valores numéricos entre diferentes bases e codificações em tempo real."
      icon={Binary}
    >
      <div className="w-full space-y-6">
        {/* Custom Tab List */}
        <div className="flex bg-muted p-1 rounded-lg max-w-md mx-auto border">
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "text"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Texto e Codificação
          </button>
          <button
            onClick={() => setActiveTab("numeric")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "numeric"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Bases Numéricas
          </button>
        </div>

        {/* Tab 1: Texto */}
        {activeTab === "text" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20 p-4 rounded-lg border">
              <div className="flex items-center gap-3 flex-1">
                <Label className="whitespace-nowrap font-medium">Conversão:</Label>
                <Select value={textMode} onValueChange={val => setTextMode(val as TextMode)}>
                  <SelectTrigger className="w-full md:w-[280px] bg-background">
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base64-encode">Texto ➔ Base64</SelectItem>
                    <SelectItem value="base64-decode">Base64 ➔ Texto</SelectItem>
                    <SelectItem value="url-encode">Texto ➔ URL Encode</SelectItem>
                    <SelectItem value="url-decode">URL Decode ➔ Texto</SelectItem>
                    <SelectItem value="hex-encode">Texto ➔ Hexadecimal</SelectItem>
                    <SelectItem value="hex-decode">Hexadecimal ➔ Texto</SelectItem>
                    <SelectItem value="bin-encode">Texto ➔ Binário</SelectItem>
                    <SelectItem value="bin-decode">Binário ➔ Texto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="sm" onClick={swapTextMode} disabled={!textInput && !textOutput}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Inverter Sentido
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="py-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Entrada</CardTitle>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={pasteTextInput}>
                      Colar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <Textarea
                    placeholder="Digite ou cole seu texto aqui..."
                    className="min-h-[220px] font-mono text-sm leading-relaxed"
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                  />
                </CardContent>
              </Card>

              <Card className="relative">
                <CardHeader className="py-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Saída</CardTitle>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={copyTextOutput} disabled={!textOutput}>
                      {copiedText ? <Check className="h-4 w-4 text-emerald-500 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      Copiar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <Textarea
                    className="min-h-[220px] font-mono text-sm leading-relaxed bg-muted/10"
                    value={textOutput}
                    readOnly
                    placeholder="O resultado convertido aparecerá aqui..."
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab 2: Numérico */}
        {activeTab === "numeric" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <Card>
              <CardHeader>
                <CardTitle>Bases Numéricas Comuns</CardTitle>
                <CardDescription>
                  Digite em qualquer um dos campos abaixo para converter instantaneamente para as outras bases. Suporta números muito grandes (BigInt).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {numError && (
                  <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 font-medium">
                    {numError}
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Decimal */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="base-dec" className="font-semibold text-sm">
                        Decimal (Base 10)
                      </Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => copyField(numDec, "Decimal")}
                        disabled={!numDec}
                      >
                        {copiedField === "Decimal" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                    <Input
                      id="base-dec"
                      type="text"
                      placeholder="Ex: 255"
                      className="font-mono text-base"
                      value={numDec}
                      onChange={e => handleNumericChange(e.target.value, "dec")}
                    />
                  </div>

                  {/* Hexadecimal */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="base-hex" className="font-semibold text-sm">
                        Hexadecimal (Base 16)
                      </Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => copyField(numHex, "Hexadecimal")}
                        disabled={!numHex}
                      >
                        {copiedField === "Hexadecimal" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                    <Input
                      id="base-hex"
                      type="text"
                      placeholder="Ex: FF"
                      className="font-mono text-base uppercase"
                      value={numHex}
                      onChange={e => handleNumericChange(e.target.value, "hex")}
                    />
                  </div>

                  {/* Octal */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="base-oct" className="font-semibold text-sm">
                        Octal (Base 8)
                      </Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => copyField(numOct, "Octal")}
                        disabled={!numOct}
                      >
                        {copiedField === "Octal" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                    <Input
                      id="base-oct"
                      type="text"
                      placeholder="Ex: 377"
                      className="font-mono text-base"
                      value={numOct}
                      onChange={e => handleNumericChange(e.target.value, "oct")}
                    />
                  </div>

                  {/* Binário */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="base-bin" className="font-semibold text-sm">
                        Binário (Base 2)
                      </Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => copyField(numBin, "Binário")}
                        disabled={!numBin}
                      >
                        {copiedField === "Binário" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                    <Input
                      id="base-bin"
                      type="text"
                      placeholder="Ex: 11111111"
                      className="font-mono text-base"
                      value={numBin}
                      onChange={e => handleNumericChange(e.target.value, "bin")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}

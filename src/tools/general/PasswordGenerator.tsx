import { useState, useEffect, useCallback } from "react"
import { Key, Copy, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function PasswordGenerator() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState([16])
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })

  const generatePassword = useCallback(() => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
    const numberChars = "0123456789"
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-="

    let chars = ""
    if (options.uppercase) chars += uppercaseChars
    if (options.lowercase) chars += lowercaseChars
    if (options.numbers) chars += numberChars
    if (options.symbols) chars += symbolChars

    if (chars === "") {
      setPassword("")
      return
    }

    let newPassword = ""
    for (let i = 0; i < length[0]; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      newPassword += chars[randomIndex]
    }

    // Ensure at least one character of each selected type
    let finalPassword = newPassword.split('')
    let currentIdx = 0
    
    if (options.uppercase && length[0] > currentIdx) finalPassword[currentIdx++] = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
    if (options.lowercase && length[0] > currentIdx) finalPassword[currentIdx++] = lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
    if (options.numbers && length[0] > currentIdx) finalPassword[currentIdx++] = numberChars[Math.floor(Math.random() * numberChars.length)]
    if (options.symbols && length[0] > currentIdx) finalPassword[currentIdx++] = symbolChars[Math.floor(Math.random() * symbolChars.length)]

    // Shuffle the final password to hide the guaranteed characters at the beginning
    finalPassword = finalPassword.sort(() => Math.random() - 0.5)

    setPassword(finalPassword.join(''))
  }, [length, options])

  useEffect(() => {
    generatePassword()
  }, [generatePassword])

  const copyToClipboard = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    toast.success("Senha copiada para a área de transferência!")
  }

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      // Prevent unchecking all options
      if (!next.uppercase && !next.lowercase && !next.numbers && !next.symbols) {
        toast.error("Selecione pelo menos um tipo de caractere.")
        return prev
      }
      return next
    })
  }

  return (
    <ToolWrapper
      id="gerador-senha"
      title="Gerador de Senha"
      description="Crie senhas fortes e seguras com opções personalizáveis."
      icon={Key}
    >
      <div className="grid gap-6">
        <Card className="border-primary/20 shadow-md">
          <CardContent className="p-6">
            <div className="relative flex items-center justify-between bg-muted/50 rounded-xl p-4 border border-input">
              <div className="overflow-x-auto whitespace-nowrap font-mono text-2xl tracking-wider select-all scrollbar-hide py-2">
                {password || "Selecione uma opção..."}
              </div>
              <div className="flex gap-2 ml-4 shrink-0">
                <Button variant="outline" size="icon" onClick={generatePassword} title="Gerar nova senha">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button size="icon" onClick={copyToClipboard} title="Copiar senha">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Tamanho da senha</Label>
                <span className="font-mono text-lg font-medium">{length[0]}</span>
              </div>
              <Slider
                value={length}
                onValueChange={setLength}
                max={64}
                min={4}
                step={1}
                className="py-4"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="uppercase" className="text-base cursor-pointer">
                  Letras Maiúsculas (A-Z)
                </Label>
                <Switch
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={() => handleOptionChange("uppercase")}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="lowercase" className="text-base cursor-pointer">
                  Letras Minúsculas (a-z)
                </Label>
                <Switch
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={() => handleOptionChange("lowercase")}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="numbers" className="text-base cursor-pointer">
                  Números (0-9)
                </Label>
                <Switch
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={() => handleOptionChange("numbers")}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="symbols" className="text-base cursor-pointer">
                  Símbolos (!@#$%)
                </Label>
                <Switch
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={() => handleOptionChange("symbols")}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolWrapper>
  )
}

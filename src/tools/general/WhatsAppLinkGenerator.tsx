import { useState, useEffect } from "react"
import { MessageSquare, Copy, Check, ExternalLink, Download, Share2 } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { QRCodeCanvas } from "qrcode.react"

export function WhatsAppLinkGenerator() {
  const [ddi, setDdi] = useState("55")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [copied, setCopied] = useState(false)

  // Clean phone input (only numbers)
  const cleanPhone = (val: string) => {
    return val.replace(/\D/g, "")
  }

  // Format phone number visual masking for Brazil phone numbers
  const formatPhone = (val: string) => {
    const numbers = cleanPhone(val)
    if (ddi !== "55") return numbers // Skip formatting for other countries

    if (numbers.length <= 2) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const cleaned = cleanPhone(rawValue)
    // Limit to standard phone length (11 digits max for Brazil)
    if (ddi === "55" && cleaned.length > 11) return
    setPhone(cleaned)
  }

  useEffect(() => {
    if (!phone) {
      setGeneratedUrl("")
      return
    }

    const fullNumber = ddi + phone
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${fullNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}`
    setGeneratedUrl(url)
  }, [ddi, phone, message])

  const copyLink = () => {
    if (!generatedUrl) return
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Link copiado para a área de transferência!")
  }

  const openWhatsApp = () => {
    if (!generatedUrl) return
    window.open(generatedUrl, "_blank", "noopener,noreferrer")
  }

  const downloadQrCode = () => {
    const canvas = document.getElementById("whatsapp-qr-canvas") as HTMLCanvasElement
    if (!canvas) return

    try {
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `qrcode-whatsapp-${phone || "link"}.png`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("QR Code baixado com sucesso!")
    } catch {
      toast.error("Erro ao baixar o QR Code.")
    }
  }

  const loadSample = () => {
    setDdi("55")
    setPhone("61999999999")
    setMessage("Olá! Gostaria de saber mais sobre os serviços de desenvolvimento da NexTools. Obrigado!")
    toast.success("Dados de exemplo carregados!")
  }

  return (
    <ToolWrapper
      id="gerador-link-whatsapp"
      title="Gerador de Link do WhatsApp"
      description="Crie links diretos e QR Codes para iniciar conversas no WhatsApp com mensagens personalizadas."
      icon={MessageSquare}
      actions={
        <Button variant="outline" size="sm" onClick={loadSample}>
          Carregar Exemplo
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Formulario */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Link</CardTitle>
              <CardDescription>
                Insira o número de telefone e a mensagem que iniciará a conversa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <div className="space-y-2">
                  <Label htmlFor="ddi-select">DDI</Label>
                  <Input
                    id="ddi-select"
                    type="text"
                    placeholder="55"
                    value={ddi}
                    onChange={e => setDdi(cleanPhone(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-input">Telefone (com DDD)</Label>
                  <Input
                    id="phone-input"
                    type="text"
                    placeholder="Ex: (11) 99999-9999"
                    value={formatPhone(phone)}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="msg-input">Mensagem Personalizada (Opcional)</Label>
                  <span className="text-xs text-muted-foreground">{message.length} caracteres</span>
                </div>
                <Textarea
                  id="msg-input"
                  placeholder="Ex: Olá, gostaria de solicitar um orçamento!"
                  className="h-28 resize-none"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resultado */}
          {generatedUrl && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  Link Gerado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  className="font-mono text-sm bg-muted/30"
                  value={generatedUrl}
                  readOnly
                  onClick={e => (e.target as HTMLInputElement).select()}
                />
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button onClick={copyLink} className="flex-1 min-w-[120px]">
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copiado!" : "Copiar Link"}
                  </Button>
                  <Button onClick={openWhatsApp} variant="secondary" className="flex-1 min-w-[140px]">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Abrir Conversa
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Live Preview e QR Code */}
        <div className="lg:col-span-6 space-y-6">
          {/* Mock Preview WhatsApp */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-[#075e54] text-white py-3 px-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-800 font-bold text-sm shrink-0">
                  WA
                </div>
                <div>
                  <h4 className="text-sm font-semibold leading-tight">Preview do Chat</h4>
                  <p className="text-[10px] text-emerald-100 leading-none">Online</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 bg-[#ece5dd] min-h-[180px] flex flex-col justify-end">
              {message ? (
                <div className="max-w-[85%] self-end bg-[#dcf8c6] text-slate-800 text-sm p-3 rounded-lg shadow-sm border border-emerald-100 relative after:content-[''] after:absolute after:top-0 after:right-[-8px] after:w-0 after:h-0 after:border-[8px] after:border-transparent after:border-t-[#dcf8c6] after:border-l-[#dcf8c6]">
                  <p className="whitespace-pre-wrap leading-relaxed pb-3">{message}</p>
                  <span className="absolute bottom-1 right-2 text-[9px] text-slate-500">
                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ) : (
                <div className="text-center text-xs text-slate-500 py-10 w-full italic">
                  Escreva uma mensagem para ver a prévia do balão de conversa do WhatsApp aqui...
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code */}
          {generatedUrl && (
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-base">QR Code Compartilhável</CardTitle>
                <CardDescription>Escaneie com a câmera do celular para iniciar a conversa.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center pb-6 space-y-4">
                <div className="p-4 bg-white rounded-xl shadow-inner border">
                  <QRCodeCanvas
                    id="whatsapp-qr-canvas"
                    value={generatedUrl}
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={downloadQrCode} className="w-full max-w-[200px]">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar QR Code (PNG)
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolWrapper>
  )
}

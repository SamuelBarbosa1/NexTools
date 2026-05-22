import { useState, useRef } from "react"
import { QrCode, Download } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"

export function QrGenerator() {
  const [value, setValue] = useState("https://nex-tools-snowy.vercel.app/")
  const [size, setSize] = useState([256])
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  
  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQR = () => {
    if (!qrRef.current) return
    const canvas = qrRef.current.querySelector('canvas')
    if (!canvas) return

    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl
    downloadLink.download = "qrcode.png"
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    toast.success("QR Code baixado com sucesso!")
  }

  return (
    <ToolWrapper
      id="gerador-qrcode"
      title="Gerador de QR Code"
      description="Crie códigos QR personalizados para links, textos ou contatos."
      icon={QrCode}
    >
      <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Conteúdo do QR Code</Label>
                <Textarea
                  placeholder="Insira uma URL ou texto..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="resize-none h-[100px]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Tamanho (px)</Label>
                  <span className="font-mono text-sm">{size[0]}</span>
                </div>
                <Slider
                  value={size}
                  onValueChange={setSize}
                  max={512}
                  min={128}
                  step={8}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cor (Frente)</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input 
                      value={fgColor} 
                      onChange={(e) => setFgColor(e.target.value)} 
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cor (Fundo)</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)} 
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={downloadQR} disabled={!value}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Imagem PNG
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col border-primary/20 bg-muted/10 h-full min-h-[400px]">
          <div className="flex items-center justify-between p-4 border-b bg-background/50">
            <span className="font-semibold">Pré-visualização</span>
          </div>
          <CardContent className="flex-1 flex items-center justify-center p-8">
            {value ? (
              <div 
                ref={qrRef} 
                className="p-4 bg-white rounded-lg shadow-lg"
                style={{ backgroundColor: bgColor }}
              >
                <QRCodeCanvas
                  value={value}
                  size={size[0]}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level="H"
                  includeMargin={false}
                />
              </div>
            ) : (
              <div className="text-muted-foreground opacity-50 flex flex-col items-center">
                <QrCode className="h-16 w-16 mb-4" />
                Insira algum conteúdo para gerar o código
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolWrapper>
  )
}

import { useState, useRef } from "react"
import { Image as ImageIcon, Download, Upload } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ImageConverter() {
  const [image, setImage] = useState<string | null>(null)
  const [format, setFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png")
  const [fileName, setFileName] = useState("image")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name.split('.')[0])
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleConvert = () => {
    if (!image) return

    const img = new Image()
    img.src = image
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      
      // If converting to jpeg, fill background with white first (since png might have transparency)
      if (format === "image/jpeg") {
        ctx!.fillStyle = "#ffffff"
        ctx!.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      ctx!.drawImage(img, 0, 0)

      const convertedUrl = canvas.toDataURL(format, 0.9) // 0.9 quality
      
      const link = document.createElement("a")
      link.download = `${fileName}-converted.${format.split('/')[1]}`
      link.href = convertedUrl
      link.click()

      toast.success("Imagem convertida e baixada com sucesso!")
    }
  }

  return (
    <ToolWrapper
      id="conversor-imagem"
      title="Conversor de Imagem"
      description="Converta imagens entre formatos PNG, JPEG e WebP no navegador."
      icon={ImageIcon}
    >
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-center">Clique para selecionar ou arraste uma imagem</span>
                  </div>
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              <div className="space-y-3">
                <Label>Formato de Saída</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/png">PNG</SelectItem>
                    <SelectItem value="image/jpeg">JPEG</SelectItem>
                    <SelectItem value="image/webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleConvert} disabled={!image}>
                <Download className="h-4 w-4 mr-2" />
                Converter e Baixar
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col h-[500px]">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold">Pré-visualização</span>
          </div>
          <CardContent className="flex-1 p-0 flex items-center justify-center bg-muted/10 overflow-hidden relative">
            {image ? (
              <div className="relative w-full h-full p-4 flex items-center justify-center">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="max-w-full max-h-full object-contain rounded shadow-sm"
                />
              </div>
            ) : (
              <div className="text-muted-foreground opacity-50 text-center p-6">
                <ImageIcon className="h-16 w-16 mx-auto mb-4" />
                Nenhuma imagem selecionada
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>
      </div>
    </ToolWrapper>
  )
}

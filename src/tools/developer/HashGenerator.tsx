import { useState, useEffect } from "react"
import { Hash, Copy } from "lucide-react"
import CryptoJS from "crypto-js"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function HashGenerator() {
  const [input, setInput] = useState("")
  const [hashes, setHashes] = useState({
    md5: "",
    sha1: "",
    sha256: "",
    sha512: "",
    sha3: "",
  })

  useEffect(() => {
    if (!input) {
      setHashes({
        md5: "",
        sha1: "",
        sha256: "",
        sha512: "",
        sha3: "",
      })
      return
    }

    try {
      setHashes({
        md5: CryptoJS.MD5(input).toString(),
        sha1: CryptoJS.SHA1(input).toString(),
        sha256: CryptoJS.SHA256(input).toString(),
        sha512: CryptoJS.SHA512(input).toString(),
        sha3: CryptoJS.SHA3(input).toString(),
      })
    } catch (error) {
      toast.error("Erro ao gerar hash.")
    }
  }, [input])

  const copyToClipboard = (text: string, name: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success(`${name} copiado com sucesso!`)
  }

  return (
    <ToolWrapper
      id="gerador-hash"
      title="Gerador de Hash"
      description="Calcule hashes MD5, SHA-1, SHA-256 e mais a partir de um texto."
      icon={Hash}
    >
      <div className="grid gap-6">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <Label className="mb-2 block font-semibold text-lg">Texto de Entrada</Label>
            <Textarea
              className="w-full min-h-[120px] resize-none font-mono text-base p-4 bg-muted/10"
              placeholder="Digite ou cole seu texto aqui..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <HashOutput label="MD5" value={hashes.md5} onCopy={() => copyToClipboard(hashes.md5, "MD5")} />
          <HashOutput label="SHA-1" value={hashes.sha1} onCopy={() => copyToClipboard(hashes.sha1, "SHA-1")} />
          <HashOutput label="SHA-256" value={hashes.sha256} onCopy={() => copyToClipboard(hashes.sha256, "SHA-256")} />
          <HashOutput label="SHA-512" value={hashes.sha512} onCopy={() => copyToClipboard(hashes.sha512, "SHA-512")} />
          <HashOutput label="SHA-3" value={hashes.sha3} onCopy={() => copyToClipboard(hashes.sha3, "SHA-3")} />
        </div>
      </div>  
    </ToolWrapper>
  )
}

function HashOutput({ label, value, onCopy }: { label: string, value: string, onCopy: () => void }) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-24 shrink-0 font-semibold">{label}</div>
        <div className="w-full relative flex items-center">
          <Input 
            readOnly 
            value={value} 
            className="font-mono text-sm bg-muted/30 text-primary pr-12"
            placeholder="..."
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute right-1 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onCopy}
            disabled={!value}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

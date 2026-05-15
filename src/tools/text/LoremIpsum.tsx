import { useState, useEffect, useCallback } from "react"
import { FileText, Copy, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
  "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis",
  "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum",
  "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non",
  "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
]

export function LoremIpsum() {
  const [output, setOutput] = useState("")
  const [count, setCount] = useState([3])
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs")

  const generateLorem = useCallback(() => {
    let result = []
    const amount = count[0]

    const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
    
    const generateSentence = (wordCount = Math.floor(Math.random() * 8) + 5) => {
      let sentence = []
      for (let i = 0; i < wordCount; i++) {
        sentence.push(getRandomWord())
      }
      sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1)
      return sentence.join(" ") + "."
    }

    const generateParagraph = (sentenceCount = Math.floor(Math.random() * 4) + 3) => {
      let paragraph = []
      for (let i = 0; i < sentenceCount; i++) {
        paragraph.push(generateSentence())
      }
      return paragraph.join(" ")
    }

    if (type === "words") {
      let words = []
      for (let i = 0; i < amount; i++) {
        words.push(getRandomWord())
      }
      result.push(words.join(" "))
    } else if (type === "sentences") {
      for (let i = 0; i < amount; i++) {
        result.push(generateSentence())
      }
    } else {
      for (let i = 0; i < amount; i++) {
        result.push(generateParagraph())
      }
    }

    setOutput(result.join(type === "paragraphs" ? "\n\n" : " "))
  }, [count, type])

  useEffect(() => {
    generateLorem()
  }, [generateLorem])

  const copyToClipboard = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    toast.success("Texto copiado para a área de transferência!")
  }

  return (
    <ToolWrapper
      id="lorem-ipsum"
      title="Lorem Ipsum Generator"
      description="Gere textos de preenchimento para layouts e protótipos."
      icon={FileText}
      actions={
        <Button size="sm" onClick={generateLorem} title="Gerar Novo">
          <RefreshCw className="h-4 w-4 mr-2" />
          Gerar
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label className="text-base">Gerar</Label>
                <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paragraphs">Parágrafos</SelectItem>
                    <SelectItem value="sentences">Frases</SelectItem>
                    <SelectItem value="words">Palavras</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Quantidade</Label>
                  <span className="font-mono text-lg font-medium">{count[0]}</span>
                </div>
                <Slider
                  value={count}
                  onValueChange={setCount}
                  max={type === "words" ? 100 : 20}
                  min={1}
                  step={1}
                  className="py-4"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col h-[500px]">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold">Resultado</span>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
          <CardContent className="flex-1 p-0">
            <Textarea
              className="w-full h-full resize-none border-0 rounded-none focus-visible:ring-0 text-base p-6 bg-muted/10 leading-relaxed"
              value={output}
              readOnly
            />
          </CardContent>
        </Card>
      </div>
    </ToolWrapper>
  )
}

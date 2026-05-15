import { useState, useEffect } from "react"
import { Clock, Copy } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TimestampConverter() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000))
  
  const [timestampInput, setTimestampInput] = useState("")
  const [timestampType, setTimestampType] = useState<"seconds" | "milliseconds">("seconds")
  const [dateOutput, setDateOutput] = useState("")

  const [dateInput, setDateInput] = useState("")
  const [tsOutput, setTsOutput] = useState("")

  // Update current timestamp every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const copyToClipboard = (text: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success("Copiado para a área de transferência!")
  }

  // Convert Timestamp to Date
  useEffect(() => {
    if (!timestampInput) {
      setDateOutput("")
      return
    }
    const val = parseInt(timestampInput)
    if (isNaN(val)) {
      setDateOutput("Timestamp inválido")
      return
    }
    try {
      const date = new Date(timestampType === "seconds" ? val * 1000 : val)
      setDateOutput(date.toLocaleString())
    } catch {
      setDateOutput("Data inválida")
    }
  }, [timestampInput, timestampType])

  // Convert Date to Timestamp
  useEffect(() => {
    if (!dateInput) {
      setTsOutput("")
      return
    }
    try {
      const date = new Date(dateInput)
      if (isNaN(date.getTime())) {
        setTsOutput("Data inválida")
        return
      }
      const ts = timestampType === "seconds" ? Math.floor(date.getTime() / 1000) : date.getTime()
      setTsOutput(ts.toString())
    } catch {
      setTsOutput("Data inválida")
    }
  }, [dateInput, timestampType])

  return (
    <ToolWrapper
      id="timestamp-converter"
      title="Timestamp Converter"
      description="Converta timestamps Unix para datas legíveis e vice-versa."
      icon={Clock}
    >
      <div className="grid gap-6">
        <Card className="border-primary/20 shadow-md bg-muted/30">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground font-medium mb-1">Timestamp Unix Atual (segundos)</p>
              <p className="font-mono text-3xl font-bold text-primary tracking-wider">{currentTimestamp}</p>
            </div>
            <Button variant="secondary" onClick={() => copyToClipboard(currentTimestamp.toString())}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar Atual
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Timestamp to Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Timestamp <ArrowRight className="h-4 w-4 text-muted-foreground" /> Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Timestamp</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="Ex: 1700000000" 
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value)}
                    className="font-mono"
                  />
                  <Select value={timestampType} onValueChange={(v) => setTimestampType(v as "seconds" | "milliseconds")}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seconds">Segundos</SelectItem>
                      <SelectItem value="milliseconds">Miliseg.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Data Local</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={dateOutput} className="bg-muted/50" />
                  <Button size="icon" variant="ghost" onClick={() => copyToClipboard(dateOutput)} disabled={!dateOutput}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date to Timestamp */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Data <ArrowRight className="h-4 w-4 text-muted-foreground" /> Timestamp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Local</Label>
                <Input 
                  type="datetime-local" 
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Timestamp ({timestampType === "seconds" ? "Segundos" : "Milissegundos"})</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={tsOutput} className="font-mono bg-muted/50" />
                  <Button size="icon" variant="ghost" onClick={() => copyToClipboard(tsOutput)} disabled={!tsOutput}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolWrapper>
  )
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

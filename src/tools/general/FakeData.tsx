import { useState } from "react"
import { Database, RefreshCw, Download, Copy } from "lucide-react"
import { fakerPT_BR as faker } from "@faker-js/faker"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

type DataType = "users" | "companies" | "products"

export function FakeData() {
  const [dataType, setDataType] = useState<DataType>("users")
  const [count, setCount] = useState([5])
  const [format, setFormat] = useState<"json" | "csv">("json")
  const [output, setOutput] = useState("")

  const generateData = () => {
    let result: any[] = []
    
    for (let i = 0; i < count[0]; i++) {
      if (dataType === "users") {
        result.push({
          id: faker.string.uuid(),
          nome: faker.person.fullName(),
          email: faker.internet.email(),
          telefone: faker.phone.number(),
          cpf: faker.string.numeric(11),
          dataNascimento: faker.date.birthdate().toISOString().split('T')[0],
          cargo: faker.person.jobTitle()
        })
      } else if (dataType === "companies") {
        result.push({
          id: faker.string.uuid(),
          razaoSocial: faker.company.name(),
          cnpj: faker.string.numeric(14),
          email: faker.internet.email(),
          telefone: faker.phone.number(),
          segmento: faker.company.buzzPhrase(),
          endereco: `${faker.location.street()}, ${faker.location.buildingNumber()} - ${faker.location.city()}/${faker.location.state({ abbreviated: true })}`
        })
      } else if (dataType === "products") {
        result.push({
          id: faker.string.uuid(),
          nome: faker.commerce.productName(),
          descricao: faker.commerce.productDescription(),
          preco: faker.commerce.price({ symbol: 'R$ ' }),
          departamento: faker.commerce.department(),
          material: faker.commerce.productMaterial(),
          ean: faker.commerce.isbn()
        })
      }
    }

    if (format === "json") {
      setOutput(JSON.stringify(result, null, 2))
    } else {
      // Basic CSV conversion
      if (result.length > 0) {
        const headers = Object.keys(result[0]).join(",")
        const rows = result.map(obj => Object.values(obj).map(val => `"${val}"`).join(","))
        setOutput([headers, ...rows].join("\n"))
      }
    }
    
    toast.success(`${count[0]} registros gerados com sucesso!`)
  }

  const copyToClipboard = () => {
    if (!output) return
    navigator.clipboard.writeText(output)
    toast.success("Copiado para a área de transferência!")
  }

  const downloadData = () => {
    if (!output) return
    const element = document.createElement("a")
    const file = new Blob([output], {type: format === 'json' ? 'application/json' : 'text/csv'})
    element.href = URL.createObjectURL(file)
    element.download = `fake-data-${dataType}.${format}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success("Download iniciado!")
  }

  return (
    <ToolWrapper
      id="dados-fake"
      title="Dados Fake (BR)"
      description="Gere dados fictícios brasileiros estruturados (JSON/CSV)."
      icon={Database}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={downloadData} disabled={!output} title="Baixar">
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>
          <Button size="sm" onClick={generateData} title="Gerar">
            <RefreshCw className="h-4 w-4 mr-2" />
            Gerar
          </Button>
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Tipo de Dados</Label>
                <Select value={dataType} onValueChange={(v) => setDataType(v as DataType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">Usuários / Clientes</SelectItem>
                    <SelectItem value="companies">Empresas</SelectItem>
                    <SelectItem value="products">Produtos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Formato de Saída</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as "json" | "csv")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Quantidade</Label>
                  <span className="font-mono text-lg font-medium">{count[0]}</span>
                </div>
                <Slider
                  value={count}
                  onValueChange={setCount}
                  max={50}
                  min={1}
                  step={1}
                  className="py-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col h-[500px]">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold">Resultado ({format.toUpperCase()})</span>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
          <CardContent className="flex-1 p-0">
            <Textarea
              className="w-full h-full resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm p-4 bg-muted/10 leading-relaxed"
              value={output}
              readOnly
              placeholder="Clique em 'Gerar' para criar os dados..."
            />
          </CardContent>
        </Card>
      </div>
    </ToolWrapper>
  )
}

import { useState } from "react"
import { MapPin, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CepData {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

export function BrazilData() {
  const [cep, setCep] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<CepData | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) {
      toast.error("CEP inválido. Digite 8 números.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const result = await response.json()

      if (result.erro) {
        toast.error("CEP não encontrado.")
        setData(null)
      } else {
        setData(result)
        toast.success("Dados encontrados com sucesso!")
      }
    } catch (error) {
      toast.error("Erro ao buscar dados. Tente novamente mais tarde.")
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const formatCep = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9)
  }

  return (
    <ToolWrapper
      id="dados-brasil"
      title="Dados Brasil (CEP)"
      description="Consulte informações de endereços brasileiros usando o CEP."
      icon={MapPin}
    >
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buscar CEP</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">Digite o CEP</Label>
                  <Input
                    id="cep"
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => setCep(formatCep(e.target.value))}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading || cep.length < 8}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Buscar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
            </CardHeader>
            <CardContent>
              {data ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DataField label="Logradouro" value={data.logradouro} />
                  <DataField label="Bairro" value={data.bairro} />
                  <DataField label="Cidade" value={data.localidade} />
                  <DataField label="Estado (UF)" value={data.uf} />
                  <DataField label="CEP" value={data.cep} />
                  <DataField label="DDD" value={data.ddd} />
                  <DataField label="IBGE" value={data.ibge} />
                  {data.complemento && (
                    <DataField label="Complemento" value={data.complemento} className="sm:col-span-2" />
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-12">
                  <MapPin className="h-12 w-12 mb-4 opacity-20" />
                  <p>Faça uma busca para ver os resultados aqui.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolWrapper>
  )
}

function DataField({ label, value, className = "" }: { label: string, value: string, className?: string }) {
  if (!value) return null
  return (
    <div className={`space-y-1 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <p className="font-medium bg-muted/50 p-2 rounded-md border border-border/50">{value}</p>
    </div>
  )
}

import { useState } from "react"
import { Car, Copy, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const VEHICLE_BRANDS: Record<string, string[]> = {
  Fiat: ["Argo", "Mobi", "Strada", "Toro", "Pulse", "Cronos", "Fiorino", "Fastback"],
  Chevrolet: ["Onix", "Tracker", "Montana", "S10", "Spin", "Cruze", "Equinox"],
  Volkswagen: ["Polo", "T-Cross", "Nivus", "Saveiro", "Virtus", "Taos", "Amarok"],
  Toyota: ["Corolla", "Hilux", "Corolla Cross", "Yaris", "SW4"],
  Hyundai: ["HB20", "Creta", "HB20S", "Tucson"],
  Jeep: ["Compass", "Renegade", "Commander"],
  Renault: ["Kwid", "Duster", "Sandero", "Logan", "Oroch"],
  Honda: ["HR-V", "Civic", "City", "Fit", "CR-V"],
  Nissan: ["Kicks", "Versa", "Frontier", "Sentra"],
  Ford: ["Ranger", "Territory", "Bronco", "Maverick", "Mustang"]
}

const STATES_CITIES: Record<string, string[]> = {
  AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá"],
  AL: ["Maceió", "Arapiraca", "Palmeira dos Índios", "Rio Largo"],
  AM: ["Manaus", "Parintins", "Itacoatiara", "Manacapuru"],
  AP: ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Juazeiro"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"],
  DF: ["Brasília", "Taguatinga", "Ceilândia", "Gama"],
  ES: ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia"],
  MA: ["São Luís", "Imperatriz", "São José de Ribamar", "Caxias", "Timon"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
  MS: ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã"],
  MT: ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"],
  PA: ["Belém", "Ananindeua", "Santarém", "Marabá", "Parauapebas"],
  PB: ["João Pessoa", "Campina Grande", "Santa Rita", "Patos", "Bayeux"],
  PE: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina"],
  PI: ["Teresina", "Parnaíba", "Picos", "Piripiri", "Floriano"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
  RJ: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói"],
  RN: ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba"],
  RO: ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal"],
  RR: ["Boa Vista", "Rorainópolis", "Caracaraí", "Pacaraima", "Cantá"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó"],
  SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "São Cristóvão"],
  SP: ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Ribeirão Preto"],
  TO: ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins"]
}

const COLORS = ["Branco", "Prata", "Preto", "Cinza", "Vermelho", "Azul", "Branco Perolizado"]
const FUELS = ["Flex", "Gasolina", "Diesel", "Híbrido", "Elétrico"]

export function VehicleGenerator() {
  const [selectedBrand, setSelectedBrand] = useState<string>("indiferente")
  const [selectedState, setSelectedState] = useState<string>("indiferente")
  const [plateStandard, setPlateStandard] = useState<"mercosul" | "antigo">("mercosul")

  const [generatedVehicle, setGeneratedVehicle] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    fuel: "",
    plate: "",
    renavam: "",
    chassi: "",
    city: "",
    state: ""
  })

  const generatePlaca = (standard: "mercosul" | "antigo") => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    let pLetters = ""
    for (let i = 0; i < 3; i++) {
      pLetters += letters.charAt(Math.floor(Math.random() * letters.length))
    }
    
    const n1 = numbers.charAt(Math.floor(Math.random() * numbers.length))
    const n2 = numbers.charAt(Math.floor(Math.random() * numbers.length))
    const n3 = numbers.charAt(Math.floor(Math.random() * numbers.length))
    const n4 = numbers.charAt(Math.floor(Math.random() * numbers.length))
    const l1 = letters.charAt(Math.floor(Math.random() * letters.length))

    if (standard === "mercosul") {
      return `${pLetters}${n1}${l1}${n2}${n3}`
    } else {
      return `${pLetters}-${n1}${n2}${n3}${n4}`
    }
  }

  const generateRenavam = () => {
    let base = ''
    for (let i = 0; i < 10; i++) {
      base += Math.floor(Math.random() * 10).toString()
    }
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(base[i]) * weights[i]
    }
    const rest = sum % 11
    let digit = rest <= 1 ? 0 : 11 - rest
    if (digit >= 10) digit = 0
    return base + digit.toString()
  }

  const generateChassi = () => {
    const chars = "0123456789ABCDEFGHJKLMNPRSTUVWXYZ"
    let chassi = "9B" // Prefixo Brasil
    for (let i = 0; i < 15; i++) {
      chassi += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return chassi
  }

  const handleGenerate = () => {
    // Marca e Modelo
    let brandKey = selectedBrand
    if (selectedBrand === "indiferente") {
      const brandKeys = Object.keys(VEHICLE_BRANDS)
      brandKey = brandKeys[Math.floor(Math.random() * brandKeys.length)]
    }
    const models = VEHICLE_BRANDS[brandKey]
    const chosenModel = models[Math.floor(Math.random() * models.length)]

    // Estado e Cidade
    let stateKey = selectedState
    if (selectedState === "indiferente") {
      const stateKeys = Object.keys(STATES_CITIES)
      stateKey = stateKeys[Math.floor(Math.random() * stateKeys.length)]
    }
    const cities = STATES_CITIES[stateKey]
    const chosenCity = cities[Math.floor(Math.random() * cities.length)]

    // Ano, Cor, Combustível
    const currentYear = new Date().getFullYear()
    const chosenYear = Math.floor(Math.random() * (currentYear - 2010 + 1)) + 2010
    const chosenColor = COLORS[Math.floor(Math.random() * COLORS.length)]
    const chosenFuel = FUELS[Math.floor(Math.random() * FUELS.length)]

    setGeneratedVehicle({
      brand: brandKey,
      model: chosenModel,
      year: chosenYear.toString(),
      color: chosenColor,
      fuel: chosenFuel,
      plate: generatePlaca(plateStandard),
      renavam: generateRenavam(),
      chassi: generateChassi(),
      city: chosenCity,
      state: stateKey
    })
  }

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado para a área de transferência!`)
  }

  return (
    <ToolWrapper
      id="gerador-veiculos"
      title="Gerador de Veículos e Placas"
      description="Gere dados completos de veículos fictícios com placa, Renavam e chassi válidos."
      icon={Car}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>1. Marca do Veículo (opcional)</Label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indiferente">Indiferente</SelectItem>
                    {Object.keys(VEHICLE_BRANDS).map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>2. Estado (opcional)</Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indiferente">Indiferente</SelectItem>
                    {Object.keys(STATES_CITIES).map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>3. Padrão da Placa</Label>
                <Select value={plateStandard} onValueChange={(v) => setPlateStandard(v as "mercosul" | "antigo")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o padrão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mercosul">Mercosul (ABC1D23)</SelectItem>
                    <SelectItem value="antigo">Antigo (ABC-1234)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleGenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar Veículo
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex flex-col justify-center h-full space-y-6">
              {!generatedVehicle.brand ? (
                <div className="text-center text-muted-foreground flex flex-col items-center gap-3">
                  <Car className="h-12 w-12 text-primary/30" />
                  <span>Clique em "Gerar Veículo" para começar</span>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Placa</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={generatedVehicle.plate}
                          className="font-mono text-center text-lg bg-background tracking-wider font-bold"
                        />
                        <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedVehicle.plate, "Placa")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Ano</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={generatedVehicle.year}
                          className="text-center bg-background font-medium"
                        />
                        <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedVehicle.year, "Ano")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Marca</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={generatedVehicle.brand}
                          className="bg-background font-medium"
                        />
                        <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedVehicle.brand, "Marca")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Modelo</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={generatedVehicle.model}
                          className="bg-background font-medium"
                        />
                        <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedVehicle.model, "Modelo")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Cor</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={generatedVehicle.color}
                          className="bg-background font-medium"
                        />
                        <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedVehicle.color, "Cor")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Combustível</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={generatedVehicle.fuel}
                          className="bg-background font-medium"
                        />
                        <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedVehicle.fuel, "Combustível")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Renavam</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={generatedVehicle.renavam}
                        className="font-mono bg-background tracking-wider"
                      />
                      <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedVehicle.renavam, "Renavam")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Chassi</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={generatedVehicle.chassi}
                        className="font-mono bg-background tracking-wider"
                      />
                      <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedVehicle.chassi, "Chassi")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Cidade</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={generatedVehicle.city}
                          className="bg-background font-medium"
                        />
                        <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedVehicle.city, "Cidade")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Estado</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={generatedVehicle.state}
                          className="bg-background font-medium text-center"
                        />
                        <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedVehicle.state, "Estado")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolWrapper>
  )
}

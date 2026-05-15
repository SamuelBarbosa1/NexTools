import { useState } from "react"
import { Landmark, Copy, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const BANKS = [
  { id: "001", name: "Banco do Brasil", agencyLen: 4, accountLen: 8 },
  { id: "237", name: "Bradesco", agencyLen: 4, accountLen: 7 },
  { id: "104", name: "Caixa Econômica", agencyLen: 4, accountLen: 8 },
  { id: "341", name: "Itaú", agencyLen: 4, accountLen: 5 },
  { id: "033", name: "Santander", agencyLen: 4, accountLen: 8 },
  { id: "260", name: "Nubank", agencyLen: 4, accountLen: 7 },
  { id: "077", name: "Banco Inter", agencyLen: 4, accountLen: 7 },
  { id: "336", name: "C6 Bank", agencyLen: 4, accountLen: 8 },
  { id: "748", name: "Sicredi", agencyLen: 4, accountLen: 5 },
  { id: "756", name: "Sicoob", agencyLen: 4, accountLen: 7 },
  { id: "422", name: "Banco Safra", agencyLen: 4, accountLen: 8 },
  { id: "655", name: "Banco Votorantim (BV)", agencyLen: 4, accountLen: 8 },
  { id: "208", name: "BTG Pactual", agencyLen: 4, accountLen: 7 },
  { id: "318", name: "Banco BMG", agencyLen: 4, accountLen: 7 },
]

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

export function BankAccountGenerator() {
  const [selectedBank, setSelectedBank] = useState<string>("indiferente")
  const [selectedState, setSelectedState] = useState<string>("indiferente")
  const [generatedAccount, setGeneratedAccount] = useState({ 
    account: "", 
    agency: "", 
    bank: "", 
    city: "", 
    state: "" 
  })

  const generateRandomDigits = (n: number) => {
    let result = ''
    for (let i = 0; i < n; i++) {
      result += Math.floor(Math.random() * 10).toString()
    }
    return result
  }

  const calcMod10 = (base: string) => {
    let sum = 0
    let weight = 2
    for (let i = base.length - 1; i >= 0; i--) {
      let prod = parseInt(base[i]) * weight
      if (prod > 9) prod -= 9
      sum += prod
      weight = weight === 2 ? 1 : 2
    }
    const rem = sum % 10
    return rem === 0 ? '0' : (10 - rem).toString()
  }

  const calcMod11 = (base: string) => {
    let sum = 0
    let weight = 2
    for (let i = base.length - 1; i >= 0; i--) {
      sum += parseInt(base[i]) * weight
      weight = weight === 9 ? 2 : weight + 1
    }
    const rem = sum % 11
    if (rem === 0 || rem === 1) return '0'
    if (rem === 10) return 'X'
    return (11 - rem).toString()
  }

  const handleGenerate = () => {
    // Escolhe o banco
    let bankObj = BANKS.find(b => b.id === selectedBank)
    if (!bankObj || selectedBank === "indiferente") {
      const randomIndex = Math.floor(Math.random() * BANKS.length)
      bankObj = BANKS[randomIndex]
    }

    // Escolhe o estado e cidade
    let stateKey = selectedState
    if (selectedState === "indiferente") {
      const stateKeys = Object.keys(STATES_CITIES)
      stateKey = stateKeys[Math.floor(Math.random() * stateKeys.length)]
    }
    const cities = STATES_CITIES[stateKey]
    const chosenCity = cities[Math.floor(Math.random() * cities.length)]

    // Gera agência e conta
    let agency = generateRandomDigits(bankObj.agencyLen)
    let account = generateRandomDigits(bankObj.accountLen)
    let digit = '0'

    if (bankObj.id === "341" || bankObj.id === "748") {
      // Itaú e Sicredi: Mod 10
      digit = calcMod10(agency + account)
    } else {
      // Mod 11 para os demais
      digit = calcMod11(account)
    }

    setGeneratedAccount({
      account: `${account}-${digit}`,
      agency: agency,
      bank: `${bankObj.id} - ${bankObj.name}`,
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
      id="gerador-conta-bancaria"
      title="Gerador de Conta Bancária"
      description="Gere números de agência e conta bancária com cidade e estado válidos para testes."
      icon={Landmark}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>1. Banco (opcional)</Label>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indiferente">Indiferente</SelectItem>
                    {BANKS.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.id} - {bank.name}
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

              <Button className="w-full" onClick={handleGenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar Conta
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex flex-col justify-center h-full space-y-6">
              {!generatedAccount.bank ? (
                <div className="text-center text-muted-foreground flex flex-col items-center gap-3">
                  <Landmark className="h-12 w-12 text-primary/30" />
                  <span>Clique em "Gerar Conta" para começar</span>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Conta Corrente</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={generatedAccount.account}
                        className="font-mono text-lg bg-background tracking-wider font-bold"
                      />
                      <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedAccount.account, "Conta Corrente")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Agência</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={generatedAccount.agency}
                        className="font-mono text-lg bg-background tracking-wider font-bold"
                      />
                      <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedAccount.agency, "Agência")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Banco</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={generatedAccount.bank}
                        className="bg-background font-medium"
                      />
                      <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedAccount.bank, "Banco")}>
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
                          value={generatedAccount.city}
                          className="bg-background font-medium"
                        />
                        <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedAccount.city, "Cidade")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Estado</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={generatedAccount.state}
                          className="bg-background font-medium text-center"
                        />
                        <Button variant="secondary" size="icon" onClick={() => copyToClipboard(generatedAccount.state, "Estado")}>
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

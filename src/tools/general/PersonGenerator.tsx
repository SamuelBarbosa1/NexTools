import { useState } from "react"
import { Users, Copy, RefreshCw, User, MapPin, Mail, Heart, FileText, Activity } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const MALE_NAMES = ["Miguel", "Arthur", "Gael", "Heitor", "Theo", "Davi", "Gabriel", "Bernardo", "Samuel", "João Miguel", "Enzo", "Lucas", "Benício", "Pedro", "Mateus", "Guilherme", "Gustavo", "Rafael", "Felipe", "Carlos", "Bruno", "Rodrigo", "Marcelo", "Eduardo", "André", "Fernando", "Ricardo", "Daniel"]
const FEMALE_NAMES = ["Helena", "Alice", "Laura", "Maria Alice", "Sophia", "Manuela", "Maitê", "Liz", "Cecília", "Isabella", "Luísa", "Eloá", "Heloísa", "Júlia", "Letícia", "Mariana", "Beatriz", "Larissa", "Camila", "Carolina", "Amanda", "Fernanda", "Patrícia", "Aline", "Juliana", "Priscila", "Renata", "Bruna"]
const LAST_NAMES = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa", "Rocha", "Dias", "Nascimento", "Andrade", "Moreira", "Nunes"]
const STREET_NAMES = ["Rua das Flores", "Avenida Brasil", "Rua São José", "Avenida Paulista", "Rua Sete de Setembro", "Rua Quinze de Novembro", "Avenida Presidente Vargas", "Rua Bela Vista", "Rua Santo Antônio", "Avenida Independência", "Rua Tiradentes", "Avenida Central", "Rua Dom Pedro II", "Rua Amazonas"]
const NEIGHBORHOODS = ["Centro", "Bela Vista", "Jardim Botânico", "Copacabana", "Vila Nova", "Jardim América", "Boa Vista", "Santa Terezinha", "Alvorada", "Pinheiros", "Botafogo", "Savassi", "Itapuã", "Meireles"]

const STATES_CITIES: Record<string, { ddd: string; cities: string[] }> = {
  AC: { ddd: "68", cities: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira"] },
  AL: { ddd: "82", cities: ["Maceió", "Arapiraca", "Palmeira dos Índios"] },
  AM: { ddd: "92", cities: ["Manaus", "Parintins", "Itacoatiara"] },
  AP: { ddd: "96", cities: ["Macapá", "Santana", "Laranjal do Jari"] },
  BA: { ddd: "71", cities: ["Salvador", "Feira de Santana", "Vitória da Conquista"] },
  CE: { ddd: "85", cities: ["Fortaleza", "Caucaia", "Juazeiro do Norte"] },
  DF: { ddd: "61", cities: ["Brasília", "Taguatinga", "Ceilândia"] },
  ES: { ddd: "27", cities: ["Vitória", "Vila Velha", "Serra"] },
  GO: { ddd: "62", cities: ["Goiânia", "Aparecida de Goiânia", "Anápolis"] },
  MA: { ddd: "98", cities: ["São Luís", "Imperatriz", "São José de Ribamar"] },
  MG: { ddd: "31", cities: ["Belo Horizonte", "Uberlândia", "Contagem"] },
  MS: { ddd: "67", cities: ["Campo Grande", "Dourados", "Três Lagoas"] },
  MT: { ddd: "65", cities: ["Cuiabá", "Várzea Grande", "Rondonópolis"] },
  PA: { ddd: "91", cities: ["Belém", "Ananindeua", "Santarém"] },
  PB: { ddd: "83", cities: ["João Pessoa", "Campina Grande", "Santa Rita"] },
  PE: { ddd: "81", cities: ["Recife", "Jaboatão dos Guararapes", "Olinda"] },
  PI: { ddd: "86", cities: ["Teresina", "Parnaíba", "Picos"] },
  PR: { ddd: "41", cities: ["Curitiba", "Londrina", "Maringá"] },
  RJ: { ddd: "21", cities: ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias"] },
  RN: { ddd: "84", cities: ["Natal", "Mossoró", "Parnamirim"] },
  RO: { ddd: "69", cities: ["Porto Velho", "Ji-Paraná", "Ariquemes"] },
  RR: { ddd: "95", cities: ["Boa Vista", "Rorainópolis", "Caracaraí"] },
  RS: { ddd: "51", cities: ["Porto Alegre", "Caxias do Sul", "Pelotas"] },
  SC: { ddd: "48", cities: ["Florianópolis", "Joinville", "Blumenau"] },
  SE: { ddd: "79", cities: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto"] },
  SP: { ddd: "11", cities: ["São Paulo", "Guarulhos", "Campinas", "Ribeirão Preto"] },
  TO: { ddd: "63", cities: ["Palmas", "Araguaína", "Gurupi"] }
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
const COLORS = ["Azul", "Vermelho", "Verde", "Amarelo", "Roxo", "Preto", "Branco", "Laranja", "Rosa", "Cinza"]

export type Person = {
  id: string
  name: string
  rg: string
  cpf: string
  birthDate: string
  age: number
  gender: string
  sign: string
  mother: string
  father: string
  email: string
  pass: string
  cep: string
  address: string
  number: string
  neighborhood: string
  city: string
  state: string
  landline: string
  mobile: string
  height: string
  weight: string
  bloodType: string
  favoriteColor: string
}

export function PersonGenerator() {
  const [gender, setGender] = useState<string>("aleatorio")
  const [ageOpt, setAgeOpt] = useState<string>("indiferente")
  const [stateOpt, setStateOpt] = useState<string>("indiferente")
  const [cityOpt, setCityOpt] = useState<string>("indiferente")
  const [mask, setMask] = useState<boolean>(true)
  const [count, setCount] = useState<number>(1)
  
  const [generatedPeople, setGeneratedPeople] = useState<Person[]>([])

  const getZodiacSign = (day: number, month: number) => {
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Áries"
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Touro"
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gêmeos"
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Câncer"
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leão"
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgem"
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra"
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Escorpião"
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagitário"
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricórnio"
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquário"
    return "Peixes"
  }

  const generateCpf = (useMask: boolean) => {
    let base = ''
    for (let i = 0; i < 9; i++) { base += Math.floor(Math.random() * 10).toString() }
    
    const calcDigit = (b: string) => {
      let sum = 0
      let weight = b.length + 1
      for (let i = 0; i < b.length; i++) { sum += parseInt(b[i]) * weight-- }
      const rest = sum % 11
      return rest < 2 ? 0 : 11 - rest
    }

    const d1 = calcDigit(base)
    base += d1
    const d2 = calcDigit(base)
    base += d2

    if (useMask) {
      return base.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return base
  }

  const generateRg = (useMask: boolean) => {
    let base = ''
    for (let i = 0; i < 8; i++) { base += Math.floor(Math.random() * 10).toString() }
    const digit = Math.floor(Math.random() * 10).toString()
    if (useMask) {
      return base.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2.$3-") + digit
    }
    return base + digit
  }

  const generateCep = (useMask: boolean) => {
    let base = ''
    for (let i = 0; i < 8; i++) { base += Math.floor(Math.random() * 10).toString() }
    if (useMask) {
      return base.replace(/(\d{5})(\d{3})/, "$1-$2")
    }
    return base
  }

  const generatePhone = (useMask: boolean, isMobile: boolean, ddd: string) => {
    let num = isMobile ? '9' : (Math.floor(Math.random() * 4) + 2).toString()
    const len = isMobile ? 8 : 7
    for (let i = 0; i < len; i++) { num += Math.floor(Math.random() * 10).toString() }
    
    if (useMask) {
      if (isMobile) {
        return `(${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`
      } else {
        return `(${ddd}) ${num.slice(0, 4)}-${num.slice(4)}`
      }
    }
    return ddd + num
  }

  const generateSinglePerson = (useMask: boolean): Person => {
    // Sexo
    let chosenGender = gender
    if (chosenGender === "aleatorio") {
      chosenGender = Math.random() > 0.5 ? "masculino" : "feminino"
    }

    // Nome
    const firstNames = chosenGender === "masculino" ? MALE_NAMES : FEMALE_NAMES
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName1 = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
    const lastName2 = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
    const fullName = `${firstName} ${lastName1} ${lastName2}`

    // Pais
    const motherFirst = FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)]
    const fatherFirst = MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]
    const motherName = `${motherFirst} ${lastName1} ${lastName2}`
    const fatherName = `${fatherFirst} ${lastName2} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`

    // Idade e Data de Nascimento
    let age = Math.floor(Math.random() * (80 - 18 + 1)) + 18
    if (ageOpt !== "indiferente") {
      age = parseInt(ageOpt)
    }
    const currentYear = new Date().getFullYear()
    const birthYear = currentYear - age
    const month = Math.floor(Math.random() * 12) + 1
    const day = Math.floor(Math.random() * 28) + 1
    const birthDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${birthYear}`
    const sign = getZodiacSign(day, month)

    // Estado e Cidade
    let stateKey = stateOpt
    if (stateOpt === "indiferente") {
      const stateKeys = Object.keys(STATES_CITIES)
      stateKey = stateKeys[Math.floor(Math.random() * stateKeys.length)]
    }
    const stateObj = STATES_CITIES[stateKey]
    let chosenCity = cityOpt
    if (cityOpt === "indiferente" || stateOpt === "indiferente") {
      chosenCity = stateObj.cities[Math.floor(Math.random() * stateObj.cities.length)]
    }

    // Email e Senha
    const emailStr = `${firstName.toLowerCase()}.${lastName1.toLowerCase()}@email.com`.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$"
    let pass = ""
    for (let i = 0; i < 8; i++) { pass += chars.charAt(Math.floor(Math.random() * chars.length)) }

    // Endereço
    const addressStr = STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)]
    const numberStr = (Math.floor(Math.random() * 900) + 10).toString()
    const neighborhoodStr = NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)]

    // Altura, Peso, Sangue, Cor
    const height = (Math.random() * (1.90 - 1.55) + 1.55).toFixed(2).replace('.', ',') + " m"
    const weight = (Math.random() * (95 - 50) + 50).toFixed(1) + " kg"
    const bloodType = BLOOD_TYPES[Math.floor(Math.random() * BLOOD_TYPES.length)]
    const favoriteColor = COLORS[Math.floor(Math.random() * COLORS.length)]

    return {
      id: Math.random().toString(),
      name: fullName,
      rg: generateRg(useMask),
      cpf: generateCpf(useMask),
      birthDate,
      age,
      gender: chosenGender === "masculino" ? "Masculino" : "Feminino",
      sign,
      mother: motherName,
      father: fatherName,
      email: emailStr,
      pass,
      cep: generateCep(useMask),
      address: addressStr,
      number: numberStr,
      neighborhood: neighborhoodStr,
      city: chosenCity,
      state: stateKey,
      landline: generatePhone(useMask, false, stateObj.ddd),
      mobile: generatePhone(useMask, true, stateObj.ddd),
      height,
      weight,
      bloodType,
      favoriteColor
    }
  }

  const handleGenerate = () => {
    const numToGenerate = Math.min(Math.max(count, 1), 30)
    const list: Person[] = []
    for (let i = 0; i < numToGenerate; i++) {
      list.push(generateSinglePerson(mask))
    }
    setGeneratedPeople(list)
  }

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success(`${label} copiado para a área de transferência!`)
  }

  return (
    <ToolWrapper
      id="gerador-pessoas"
      title="Gerador de Documentos de Pessoas"
      description="Gere dados completos e válidos de pessoas (Nome, RG, CPF, CEP, Endereço, Telefone, etc)."
      icon={Users}
    >
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Opções de Geração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>1. Qual sexo?</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="aleatorio">Aleatório</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>2. Qual idade da pessoa? (opcional)</Label>
                <Select value={ageOpt} onValueChange={setAgeOpt}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a idade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indiferente">Indiferente</SelectItem>
                    {Array.from({ length: 63 }, (_, i) => i + 18).map((a) => (
                      <SelectItem key={a} value={a.toString()}>{a} anos</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>3. Qual Estado? (opcional)</Label>
                <Select value={stateOpt} onValueChange={(val) => {
                  setStateOpt(val)
                  setCityOpt("indiferente")
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indiferente">Indiferente</SelectItem>
                    {Object.keys(STATES_CITIES).map((st) => (
                      <SelectItem key={st} value={st}>{st}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>4. Qual Cidade? (opcional)</Label>
                <Select value={cityOpt} onValueChange={setCityOpt} disabled={stateOpt === "indiferente"}>
                  <SelectTrigger>
                    <SelectValue placeholder={stateOpt === "indiferente" ? "Selecione o estado primeiro!" : "Selecione a cidade"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indiferente">Indiferente</SelectItem>
                    {stateOpt !== "indiferente" && STATES_CITIES[stateOpt].cities.map((ct) => (
                      <SelectItem key={ct} value={ct}>{ct}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="flex items-center justify-between space-x-2 pt-6">
                  <Label htmlFor="m-mask" className="text-sm cursor-pointer">
                    Gerar com Pontuação?
                  </Label>
                  <Switch
                    id="m-mask"
                    checked={mask}
                    onCheckedChange={setMask}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="q-count">6. Quantas pessoas? (Máx.: 30)</Label>
                  <Input
                    id="q-count"
                    type="number"
                    min={1}
                    max={30}
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleGenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar Pessoa{count > 1 ? "s" : ""}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-7 space-y-6">
          {generatedPeople.length === 0 ? (
            <Card className="h-full border-primary/20 bg-primary/5 min-h-[400px]">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full space-y-3 text-center text-muted-foreground">
                <Users className="h-12 w-12 text-primary/30" />
                <span>Clique em "Gerar Pessoa" para começar</span>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {generatedPeople.map((person) => (
                <Card key={person.id} className="border-primary/20 bg-primary/5 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <CardHeader className="bg-primary/10 pb-4 border-b border-primary/10 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl text-primary flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {person.name}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground pt-1">
                        {person.gender} • {person.age} anos • Signo de {person.sign}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(person, null, 2), "Dados da Pessoa")}>
                      <Copy className="h-4 w-4 mr-1" /> Copiar Tudo
                    </Button>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {/* Documentos */}
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1 border-b pb-1">
                        <FileText className="h-4 w-4" /> Documentos
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">CPF</Label>
                          <div className="flex items-center gap-1">
                            <Input readOnly value={person.cpf} className="font-mono bg-background font-bold" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.cpf, "CPF")}><Copy className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">RG</Label>
                          <div className="flex items-center gap-1">
                            <Input readOnly value={person.rg} className="font-mono bg-background font-bold" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.rg, "RG")}><Copy className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Data de Nascimento</Label>
                          <div className="flex items-center gap-1">
                            <Input readOnly value={person.birthDate} className="bg-background" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.birthDate, "Data de Nascimento")}><Copy className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Idade</Label>
                          <div className="flex items-center gap-1">
                            <Input readOnly value={`${person.age} anos`} className="bg-background" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.age.toString(), "Idade")}><Copy className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filiação */}
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1 border-b pb-1">
                        <Heart className="h-4 w-4" /> Filiação
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Mãe</Label>
                          <div className="flex items-center gap-1">
                            <Input readOnly value={person.mother} className="bg-background" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.mother, "Nome da Mãe")}><Copy className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Pai</Label>
                          <div className="flex items-center gap-1">
                            <Input readOnly value={person.father} className="bg-background" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.father, "Nome do Pai")}><Copy className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contato e Login */}
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1 border-b pb-1">
                        <Mail className="h-4 w-4" /> Contato e Acesso
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">E-mail</Label>
                          <div className="flex items-center gap-1">
                            <Input readOnly value={person.email} className="bg-background" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.email, "E-mail")}><Copy className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Senha</Label>
                          <div className="flex items-center gap-1">
                            <Input readOnly value={person.pass} className="font-mono bg-background" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.pass, "Senha")}><Copy className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Telefone Fixo</Label>
                          <div className="flex items-center gap-1">
                            <Input readOnly value={person.landline} className="bg-background" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.landline, "Telefone Fixo")}><Copy className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Celular</Label>
                          <div className="flex items-center gap-1">
                            <Input readOnly value={person.mobile} className="bg-background font-bold" />
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.mobile, "Celular")}><Copy className="h-3.5 w-3.5" /></Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Endereço */}
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1 border-b pb-1">
                        <MapPin className="h-4 w-4" /> Endereço
                      </Label>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-8 space-y-1">
                          <Label className="text-xs text-muted-foreground">Logradouro</Label>
                          <Input readOnly value={person.address} className="bg-background" />
                        </div>
                        <div className="col-span-4 space-y-1">
                          <Label className="text-xs text-muted-foreground">Número</Label>
                          <Input readOnly value={person.number} className="bg-background" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Bairro</Label>
                          <Input readOnly value={person.neighborhood} className="bg-background" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Cidade</Label>
                          <Input readOnly value={person.city} className="bg-background" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">UF</Label>
                          <Input readOnly value={person.state} className="bg-background text-center" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">CEP</Label>
                        <div className="flex items-center gap-1">
                          <Input readOnly value={person.cep} className="font-mono bg-background" />
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(person.cep, "CEP")}><Copy className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    </div>

                    {/* Características Físicas */}
                    <div className="space-y-3">
                      <Label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1 border-b pb-1">
                        <Activity className="h-4 w-4" /> Características
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Altura</Label>
                          <Input readOnly value={person.height} className="bg-background text-center" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Peso</Label>
                          <Input readOnly value={person.weight} className="bg-background text-center" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Tipo Sanguíneo</Label>
                          <Input readOnly value={person.bloodType} className="bg-background text-center font-bold text-red-500" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Cor Favorita</Label>
                          <Input readOnly value={person.favoriteColor} className="bg-background text-center" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  )
}

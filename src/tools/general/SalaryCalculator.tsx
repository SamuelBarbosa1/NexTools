import { useState } from "react"
import { Calculator, DollarSign, TrendingDown, TrendingUp, Percent, Receipt, Coins, HelpCircle } from "lucide-react"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function SalaryCalculator() {
  const [brutoInput, setBrutoInput] = useState<string>("5000")
  const [dependentesInput, setDependentesInput] = useState<string>("0")
  const [outrosDescontosInput, setOutrosDescontosInput] = useState<string>("0")
  const [outrosProventosInput, setOutrosProventosInput] = useState<string>("0")

  const calculateINSS = (bruto: number) => {
    let inss = 0
    const remaining = bruto

    // Faixa 1: até 1412.00
    const f1 = Math.min(remaining, 1412.00)
    inss += f1 * 0.075
    if (remaining <= 1412.00) return inss

    // Faixa 2: de 1412.01 a 2666.68 (dif: 1254.68)
    const f2 = Math.min(remaining - 1412.00, 1254.68)
    inss += f2 * 0.09
    if (remaining <= 2666.68) return inss

    // Faixa 3: de 2666.69 a 4000.03 (dif: 1333.35)
    const f3 = Math.min(remaining - 2666.68, 1333.35)
    inss += f3 * 0.12
    if (remaining <= 4000.03) return inss

    // Faixa 4: de 4000.04 a 7786.02 (dif: 3785.99)
    const f4 = Math.min(remaining - 4000.03, 3785.99)
    inss += f4 * 0.14

    return Math.min(inss, 908.85) // Teto do INSS 2024
  }

  const calculateIRRF = (bruto: number, inss: number, dependentes: number) => {
    // Dedução legal por dependente
    const deducaoDependentes = dependentes * 189.59
    const baseLegal = bruto - inss - deducaoDependentes

    // Desconto simplificado opcional (R$ 564,80)
    const baseSimplificada = bruto - 564.80

    // O sistema escolhe a base mais vantajosa (menor base de cálculo)
    const base = Math.min(baseLegal, baseSimplificada)

    if (base <= 2259.20) return { irrf: 0, alicota: "Isento", baseUsada: base }
    if (base <= 2826.65) return { irrf: base * 0.075 - 169.44, alicota: "7,5%", baseUsada: base }
    if (base <= 3751.05) return { irrf: base * 0.15 - 381.44, alicota: "15%", baseUsada: base }
    if (base <= 4664.68) return { irrf: base * 0.225 - 662.77, alicota: "22,5%", baseUsada: base }
    return { irrf: base * 0.275 - 896.00, alicota: "27,5%", baseUsada: base }
  }

  const bruto = parseFloat(brutoInput) || 0
  const dependentes = parseInt(dependentesInput) || 0
  const outrosDescontos = parseFloat(outrosDescontosInput) || 0
  const outrosProventos = parseFloat(outrosProventosInput) || 0

  const inss = calculateINSS(bruto)
  const { irrf, alicota } = calculateIRRF(bruto, inss, dependentes)
  const totalDescontos = inss + irrf + outrosDescontos
  const totalGanhos = bruto + outrosProventos
  const liquido = totalGanhos - totalDescontos

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
  }

  const percentLiquido = totalGanhos > 0 ? Math.max(Math.round((liquido / totalGanhos) * 100), 0) : 0
  const percentDescontos = totalGanhos > 0 ? Math.min(Math.round((totalDescontos / totalGanhos) * 100), 100) : 0

  return (
    <ToolWrapper
      id="calculadora-salario-liquido"
      title="Calculadora de Salário Líquido (CLT)"
      description="Calcule o salário líquido a partir do salário bruto com os descontos oficiais de INSS e IRRF."
      icon={Calculator}
    >
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                Dados do Salário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sal-bruto">Salário Bruto (R$)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="sal-bruto"
                    type="number"
                    value={brutoInput}
                    onChange={(e) => setBrutoInput(e.target.value)}
                    className="pl-9 font-mono text-base font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="num-dep">Número de Dependentes</Label>
                <Input
                  id="num-dep"
                  type="number"
                  min={0}
                  value={dependentesInput}
                  onChange={(e) => setDependentesInput(e.target.value)}
                  className="font-mono text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="out-prov">Outros Proventos / Bônus (R$)</Label>
                <Input
                  id="out-prov"
                  type="number"
                  value={outrosProventosInput}
                  onChange={(e) => setOutrosProventosInput(e.target.value)}
                  className="font-mono text-base"
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="out-desc">Outros Descontos (R$)</Label>
                <Input
                  id="out-desc"
                  type="number"
                  value={outrosDescontosInput}
                  onChange={(e) => setOutrosDescontosInput(e.target.value)}
                  className="font-mono text-base"
                  placeholder="0,00"
                />
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setBrutoInput("5000")
                  setDependentesInput("0")
                  setOutrosDescontosInput("0")
                  setOutrosProventosInput("0")
                }}
              >
                Restaurar Valores Padrão
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-7 space-y-6">
          <Card className="border-primary/20 bg-primary/5 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="bg-primary/10 pb-6 border-b border-primary/10 flex flex-col items-center justify-center text-center">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Salário Líquido Estimado
              </CardTitle>
              <div className="text-4xl font-extrabold text-primary font-mono tracking-tight">
                {formatCurrency(liquido)}
              </div>
              <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                Cálculos atualizados com a tabela progressiva do INSS e IRRF 2024.
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Barra de Proporção */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3.5 w-3.5" /> Líquido ({percentLiquido}%)
                  </span>
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <TrendingDown className="h-3.5 w-3.5" /> Descontos ({percentDescontos}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-red-500/20 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${percentLiquido}%` }}
                  />
                  <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${percentDescontos}%` }}
                  />
                </div>
              </div>

              {/* Detalhamento */}
              <div className="space-y-3 pt-2">
                <Label className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1 border-b pb-1">
                  <Receipt className="h-4 w-4" /> Detalhamento do Cálculo
                </Label>

                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between items-center py-1 border-b border-muted">
                    <span className="text-muted-foreground">Salário Bruto</span>
                    <span className="font-semibold text-foreground">{formatCurrency(bruto)}</span>
                  </div>

                  {outrosProventos > 0 && (
                    <div className="flex justify-between items-center py-1 border-b border-muted text-green-600 dark:text-green-400">
                      <span>(+) Outros Proventos</span>
                      <span className="font-semibold">{formatCurrency(outrosProventos)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-1 border-b border-muted text-red-600 dark:text-red-400">
                    <span>(-) Contribuição INSS</span>
                    <span className="font-semibold">{formatCurrency(inss)}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-muted text-red-600 dark:text-red-400">
                    <span className="flex items-center gap-1">
                      (-) Imposto de Renda (IRRF)
                      <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded font-sans font-bold">
                        {alicota}
                      </span>
                    </span>
                    <span className="font-semibold">{formatCurrency(irrf)}</span>
                  </div>

                  {outrosDescontos > 0 && (
                    <div className="flex justify-between items-center py-1 border-b border-muted text-red-600 dark:text-red-400">
                      <span>(-) Outros Descontos</span>
                      <span className="font-semibold">{formatCurrency(outrosDescontos)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 text-base font-bold text-primary">
                    <span>(=) Salário Líquido</span>
                    <span className="text-lg">{formatCurrency(liquido)}</span>
                  </div>
                </div>
              </div>

              {/* Resumo Informativo */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-xs text-muted-foreground">
                <div className="font-bold text-foreground flex items-center gap-1">
                  <Percent className="h-3.5 w-3.5 text-primary" /> Informações do Cálculo
                </div>
                <ul className="list-disc list-inside space-y-1">
                  <li>O INSS é calculado de forma progressiva (faixas de 7,5% a 14%).</li>
                  <li>O IRRF utiliza a dedução simplificada (R$ 564,80) ou as deduções legais (INSS + R$ 189,59 por dependente), aplicando automaticamente a mais vantajosa para o trabalhador.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolWrapper>
  )
}

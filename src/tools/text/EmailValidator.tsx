import { useState } from "react"
import { Mail, CheckCircle2, XCircle, Search } from "lucide-react"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EmailValidator() {
  const [email, setEmail] = useState("")
  const [result, setResult] = useState<{
    isValidFormat: boolean;
    isDisposable?: boolean;
    isRoleAccount?: boolean;
    domain?: string;
  } | null>(null)

  // List of common disposable email domains
  const DISPOSABLE_DOMAINS = [
    "mailinator.com", "guerrillamail.com", "10minutemail.com", 
    "tempmail.com", "yopmail.com", "throwawaymail.com", "temp-mail.org"
  ]

  // List of common role accounts
  const ROLE_ACCOUNTS = [
    "admin", "info", "support", "sales", "contact", 
    "billing", "marketing", "webmaster", "postmaster"
  ]

  const validateEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Simple regex for email format
    const formatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValidFormat = formatRegex.test(email)

    if (!isValidFormat) {
      setResult({ isValidFormat: false })
      return
    }

    const [localPart, domain] = email.split('@').map(s => s.toLowerCase())

    setResult({
      isValidFormat: true,
      domain,
      isDisposable: DISPOSABLE_DOMAINS.includes(domain),
      isRoleAccount: ROLE_ACCOUNTS.includes(localPart)
    })
  }

  return (
    <ToolWrapper
      id="validador-email"
      title="Validador de E-mail"
      description="Verifique a validade, a sintaxe e o tipo de endereços de e-mail."
      icon={Mail}
    >
      <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verificar E-mail</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={validateEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Endereço de E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!email}>
                  <Search className="mr-2 h-4 w-4" />
                  Validar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full border-primary/20 bg-muted/5">
            <CardHeader>
              <CardTitle>Resultado da Validação</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {result.isValidFormat ? (
                    <>
                      <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                        <CheckCircle2 className="h-8 w-8 shrink-0" />
                        <div>
                          <p className="font-semibold text-lg">Formato Válido</p>
                          <p className="text-sm opacity-80">O e-mail possui uma sintaxe correta.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b">
                          <span className="text-muted-foreground">Domínio</span>
                          <span className="font-medium">{result.domain}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b">
                          <span className="text-muted-foreground">Conta de Papel (Role)</span>
                          <span className={`font-medium ${result.isRoleAccount ? "text-amber-500" : ""}`}>
                            {result.isRoleAccount ? "Sim (ex: admin, suporte)" : "Não"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b">
                          <span className="text-muted-foreground">E-mail Descartável</span>
                          <span className={`font-medium ${result.isDisposable ? "text-rose-500" : ""}`}>
                            {result.isDisposable ? "Sim (Possível spam/fake)" : "Não"}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 p-4 bg-rose-50 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-900">
                      <XCircle className="h-8 w-8 shrink-0" />
                      <div>
                        <p className="font-semibold text-lg">Formato Inválido</p>
                        <p className="text-sm opacity-80">O endereço de e-mail não possui uma sintaxe válida.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground">
                  <Mail className="h-12 w-12 mb-4 opacity-20" />
                  <p>Insira um e-mail para ver os detalhes da validação.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolWrapper>
  )
}

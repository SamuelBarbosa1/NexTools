import { useState, useEffect } from "react"
import { Shield, Copy, Check, AlertTriangle, ShieldCheck, ShieldAlert, Key } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import CryptoJS from "crypto-js"

export function JwtValidator() {
  const [token, setToken] = useState("")
  const [secret, setSecret] = useState("")
  const [decoded, setDecoded] = useState<{
    header: any
    payload: any
    signature: string
    isValid: boolean
    error: string | null
    alg: string | null
    isExpired: boolean | null
    expDate: string | null
    isSignatureValid: boolean | null
  }>({
    header: null,
    payload: null,
    signature: "",
    isValid: false,
    error: null,
    alg: null,
    isExpired: null,
    expDate: null,
    isSignatureValid: null,
  })

  const [copiedHeader, setCopiedHeader] = useState(false)
  const [copiedPayload, setCopiedPayload] = useState(false)

  // Safe base64url decode with UTF-8 support
  const base64UrlDecode = (str: string) => {
    try {
      let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
      while (base64.length % 4) {
        base64 += "="
      }
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      return new TextDecoder().decode(bytes)
    } catch {
      throw new Error("Base64Url inválido")
    }
  }

  useEffect(() => {
    if (!token.trim()) {
      setDecoded({
        header: null,
        payload: null,
        signature: "",
        isValid: false,
        error: null,
        alg: null,
        isExpired: null,
        expDate: null,
        isSignatureValid: null,
      })
      return
    }

    const parts = token.trim().split(".")
    if (parts.length !== 3) {
      setDecoded(prev => ({
        ...prev,
        isValid: false,
        error: "O token JWT deve possuir exatamente 3 partes separadas por pontos (.)",
      }))
      return
    }

    try {
      const headerStr = base64UrlDecode(parts[0])
      const payloadStr = base64UrlDecode(parts[1])
      const signature = parts[2]

      let headerObj: any = null
      let payloadObj: any = null

      try {
        headerObj = JSON.parse(headerStr)
      } catch {
        throw new Error("O cabeçalho (Header) não é um JSON válido.")
      }

      try {
        payloadObj = JSON.parse(payloadStr)
      } catch {
        throw new Error("O corpo (Payload) não é um JSON válido.")
      }

      const alg = headerObj.alg || null

      // Check expiration
      let isExpired = null
      let expDate = null
      if (payloadObj.exp) {
        expDate = new Date(payloadObj.exp * 1000).toLocaleString()
        isExpired = Date.now() / 1000 > payloadObj.exp
      }

      // Verify signature (if HS256 and secret is provided)
      let isSignatureValid = null
      if (secret && alg === "HS256") {
        try {
          const content = parts[0] + "." + parts[1]
          const calculatedHash = CryptoJS.HmacSHA256(content, secret)
          const calculatedSig = calculatedHash
            .toString(CryptoJS.enc.Base64)
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
          isSignatureValid = calculatedSig === signature
        } catch {
          isSignatureValid = false
        }
      }

      setDecoded({
        header: headerObj,
        payload: payloadObj,
        signature,
        isValid: true,
        error: null,
        alg,
        isExpired,
        expDate,
        isSignatureValid,
      })
    } catch (err: any) {
      setDecoded(prev => ({
        ...prev,
        isValid: false,
        error: err.message || "Erro desconhecido ao decodificar o token.",
      }))
    }
  }, [token, secret])

  const copyToClipboard = (text: string, type: "header" | "payload") => {
    if (!text) return
    navigator.clipboard.writeText(text)
    if (type === "header") {
      setCopiedHeader(true)
      setTimeout(() => setCopiedHeader(false), 2000)
    } else {
      setCopiedPayload(true)
      setTimeout(() => setCopiedPayload(false), 2000)
    }
    toast.success(`${type === "header" ? "Header" : "Payload"} copiado com sucesso!`)
  }

  const pasteToken = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setToken(text)
        toast.success("Token colado com sucesso!")
      }
    } catch {
      toast.error("Não foi possível ler da área de transferência.")
    }
  }

  const loadSample = () => {
    // Standard HS256 sample token
    const sampleHeader = { alg: "HS256", typ: "JWT" }
    const samplePayload = {
      sub: "1234567890",
      name: "Samuel Oliveira",
      role: "Senior Developer",
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      iat: Math.floor(Date.now() / 1000),
    }

    const encode = (obj: any) => {
      const str = JSON.stringify(obj)
      const encoded = btoa(unescape(encodeURIComponent(str)))
      return encoded.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }

    const encodedHeader = encode(sampleHeader)
    const encodedPayload = encode(samplePayload)
    const secretKey = "nextools-secret-key"

    const signatureHash = CryptoJS.HmacSHA256(encodedHeader + "." + encodedPayload, secretKey)
    const signature = signatureHash
      .toString(CryptoJS.enc.Base64)
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")

    setToken(`${encodedHeader}.${encodedPayload}.${signature}`)
    setSecret(secretKey)
    toast.success("Token de exemplo carregado!")
  }

  return (
    <ToolWrapper
      id="validador-jwt"
      title="Decodificador e Validador de JWT"
      description="Decodifique e valide seus JSON Web Tokens (JWT) localmente de forma segura."
      icon={Shield}
      actions={
        <Button variant="outline" size="sm" onClick={loadSample}>
          Carregar Exemplo (HS256)
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Entrada */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Entrada do Token</CardTitle>
              <CardDescription>
                Cole seu token JWT codificado abaixo para começar a decodificação imediata.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="jwt-input">Token JWT (Codificado)</Label>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={pasteToken}>
                    Colar
                  </Button>
                </div>
                <Textarea
                  id="jwt-input"
                  placeholder="Cole seu token aqui (ex: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
                  className="h-[250px] font-mono text-sm leading-relaxed"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jwt-secret" className="flex items-center gap-1.5">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  Chave Secreta / Secret (opcional para HS256)
                </Label>
                <Input
                  id="jwt-secret"
                  type="password"
                  placeholder="Insira a chave secreta para verificar a assinatura..."
                  value={secret}
                  onChange={e => setSecret(e.target.value)}
                  disabled={!decoded.isValid || decoded.alg !== "HS256"}
                />
                {decoded.isValid && decoded.alg !== "HS256" && (
                  <p className="text-xs text-muted-foreground">
                    A verificação de assinatura está disponível apenas para o algoritmo HS256.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Validação de Segurança */}
          {decoded.isValid && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  Status do Token
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-1 border-b">
                  <span className="text-muted-foreground">Algoritmo:</span>
                  <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">
                    {decoded.alg || "Nenhum"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b">
                  <span className="text-muted-foreground">Expiração:</span>
                  <span className="font-mono text-xs">
                    {decoded.expDate ? decoded.expDate : "Sem expiração (exp)"}
                  </span>
                </div>

                {decoded.isExpired !== null && (
                  <div className="flex justify-between items-center py-1 border-b">
                    <span className="text-muted-foreground">Status de Tempo:</span>
                    {decoded.isExpired ? (
                      <span className="text-red-500 font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" /> Expirado
                      </span>
                    ) : (
                      <span className="text-emerald-500 font-semibold flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4" /> Dentro da Validade
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Assinatura:</span>
                  {secret ? (
                    decoded.isSignatureValid ? (
                      <span className="text-emerald-500 font-semibold flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4" /> Assinatura Válida
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold flex items-center gap-1">
                        <ShieldAlert className="h-4 w-4" /> Assinatura Inválida
                      </span>
                    )
                  ) : (
                    <span className="text-amber-500 font-medium text-xs">
                      Chave não fornecida
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Saída */}
        <div className="lg:col-span-7 space-y-6">
          {!decoded.isValid ? (
            <Card className="h-full flex items-center justify-center min-h-[300px]">
              <CardContent className="text-center p-8 space-y-3">
                {decoded.error ? (
                  <>
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                    <h3 className="font-bold text-lg text-red-500">Erro de Decodificação</h3>
                    <p className="text-muted-foreground max-w-md text-sm">{decoded.error}</p>
                  </>
                ) : (
                  <>
                    <Shield className="h-12 w-12 text-muted-foreground/50 mx-auto animate-pulse" />
                    <h3 className="font-bold text-lg">Aguardando Token</h3>
                    <p className="text-muted-foreground text-sm">
                      Insira um token válido ao lado para visualizar os dados decodificados.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div className="space-y-1">
                    <CardTitle className="text-base">Cabeçalho (Header)</CardTitle>
                    <CardDescription className="text-xs">
                      Define o algoritmo de assinatura e o tipo do token.
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), "header")}
                  >
                    {copiedHeader ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="p-0 border-t">
                  <pre className="p-4 overflow-x-auto text-sm font-mono bg-muted/20 text-slate-800 dark:text-slate-200 rounded-b-lg">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Payload */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div className="space-y-1">
                    <CardTitle className="text-base">Corpo do Token (Payload / Claims)</CardTitle>
                    <CardDescription className="text-xs">
                      Contém as declarações (claims) do usuário e dados adicionais.
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), "payload")}
                  >
                    {copiedPayload ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="p-0 border-t">
                  <pre className="p-4 overflow-x-auto text-sm font-mono bg-muted/20 text-slate-800 dark:text-slate-200 rounded-b-lg max-h-[350px]">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  )
}

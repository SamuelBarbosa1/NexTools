import { useState, useEffect } from "react"
import { FileCode, Copy, Check, ArrowRightLeft, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ConversionType = "json-yaml" | "yaml-json" | "json-xml" | "xml-json" | "json-csv" | "csv-json"

export function FormatConverter() {
  const [conversion, setConversion] = useState<ConversionType>("json-yaml")
  const [inputVal, setInputVal] = useState("")
  const [outputVal, setOutputVal] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // ----------------------------------------------------
  // CONVERTER LOGIC FUNCTIONS
  // ----------------------------------------------------

  // 1. JSON to YAML
  const jsonToYaml = (obj: any, indent = 0): string => {
    const spaces = " ".repeat(indent)
    if (obj === null) return "null"
    if (typeof obj === "undefined") return ""
    
    if (typeof obj !== "object") {
      if (typeof obj === "string") {
        if (obj.includes("\n") || obj.includes(":") || obj.includes("-") || obj.includes("#") || !obj.trim()) {
          return JSON.stringify(obj)
        }
        return obj
      }
      return String(obj)
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]"
      return obj
        .map(item => {
          const val = jsonToYaml(item, indent + 2)
          if (typeof item === "object" && item !== null && !Array.isArray(item)) {
            const lines = val.split("\n")
            const firstLine = lines[0].trim()
            const restLines = lines.slice(1).map(l => " ".repeat(indent + 2) + l).join("\n")
            return `${spaces}- ${firstLine}${restLines ? "\n" + restLines : ""}`
          }
          return `${spaces}- ${val}`
        })
        .join("\n")
    }

    const keys = Object.keys(obj)
    if (keys.length === 0) return "{}"
    return keys
      .map(key => {
        const val = obj[key]
        if (typeof val === "object" && val !== null) {
          // If it is an array and next is not object
          return `${spaces}${key}:\n${jsonToYaml(val, indent + 2)}`
        }
        return `${spaces}${key}: ${jsonToYaml(val, indent)}`
      })
      .join("\n")
  }

  // 2. YAML to JSON
  const parseYamlValue = (val: string): any => {
    val = val.trim()
    if (!val) return null
    if (val === "null") return null
    if (val === "true") return true
    if (val === "false") return false
    if (!isNaN(Number(val))) return Number(val)
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      return val.slice(1, -1)
    }
    return val
  }

  const yamlToJsonObj = (yamlStr: string): any => {
    const lines = yamlStr.split(/\r?\n/)
    const root: any = {}
    
    // Auxiliary stack for track current nesting levels
    // indent: padding spaces
    // obj: current pointer object or array
    // key: current key in parent object where to save
    const stack: { indent: number; obj: any; key?: string }[] = [{ indent: -1, obj: root }]

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim() || line.trim().startsWith("#")) continue

      const indent = line.length - line.trimStart().length
      const content = line.trim()

      // Pop stack elements that have greater or equal indentation
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop()
      }

      const parent = stack[stack.length - 1]

      if (content.startsWith("-")) {
        // Array Item
        const itemValStr = content.slice(1).trim()
        let itemVal: any = null

        if (itemValStr.includes(":")) {
          // Object item inside array e.g. "- name: John"
          const colonIdx = itemValStr.indexOf(":")
          const k = itemValStr.substring(0, colonIdx).trim()
          const vStr = itemValStr.substring(colonIdx + 1).trim()
          itemVal = { [k]: parseYamlValue(vStr) }

          if (parent.key) {
            if (!Array.isArray(parent.obj[parent.key])) parent.obj[parent.key] = []
            parent.obj[parent.key].push(itemVal)
          } else if (Array.isArray(parent.obj)) {
            parent.obj.push(itemVal)
          } else {
            // Root is array
            // If parent is root object, we convert root object to array
            // But let's assume valid object formats
          }

          stack.push({ indent: indent + 2, obj: itemVal })
        } else {
          // Simple scalar value in array
          itemVal = parseYamlValue(itemValStr)
          if (parent.key) {
            if (!Array.isArray(parent.obj[parent.key])) parent.obj[parent.key] = []
            parent.obj[parent.key].push(itemVal)
          } else if (Array.isArray(parent.obj)) {
            parent.obj.push(itemVal)
          }
        }
      } else if (content.includes(":")) {
        // Key-value pair
        const colonIdx = content.indexOf(":")
        const key = content.substring(0, colonIdx).trim()
        const valStr = content.substring(colonIdx + 1).trim()

        // Peek next lines to see if we have nested objects/lists
        let isNested = false
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim() && !lines[j].trim().startsWith("#")) {
            const nextIndent = lines[j].length - lines[j].trimStart().length
            if (nextIndent > indent) {
              isNested = true
            }
            break
          }
        }

        if (isNested) {
          // Search first nested line
          let nextLine = ""
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].trim() && !lines[j].trim().startsWith("#")) {
              nextLine = lines[j].trim()
              break
            }
          }
          
          const isNextArray = nextLine.startsWith("-")
          const newObj = isNextArray ? [] : {}

          if (Array.isArray(parent.obj)) {
            // Inside array of objects
            let lastObj = parent.obj[parent.obj.length - 1]
            if (typeof lastObj !== "object" || lastObj === null) {
              lastObj = {}
              parent.obj[parent.obj.length - 1] = lastObj
            }
            lastObj[key] = newObj
            stack.push({ indent: indent + 2, obj: newObj, key })
          } else {
            parent.obj[key] = newObj
            stack.push({ indent: indent + 2, obj: newObj, key })
          }
        } else {
          // Flat key-value
          const val = parseYamlValue(valStr)
          if (Array.isArray(parent.obj)) {
            let lastObj = parent.obj[parent.obj.length - 1]
            if (typeof lastObj !== "object" || lastObj === null) {
              lastObj = {}
              parent.obj[parent.obj.length - 1] = lastObj
            }
            lastObj[key] = val
          } else {
            parent.obj[key] = val
          }
        }
      }
    }

    // Handle case where root contains an array or was empty
    const rootKeys = Object.keys(root)
    if (rootKeys.length === 1 && rootKeys[0] === "" && Array.isArray(root[""])) {
      return root[""]
    }
    return root
  }

  // 3. JSON to XML
  const escapeXml = (unsafe: string): string => {
    return unsafe.replace(/[<>&'"]/g, c => {
      switch (c) {
        case "<": return "&lt;"
        case ">": return "&gt;"
        case "&": return "&amp;"
        case "'": return "&apos;"
        case "\"": return "&quot;"
        default: return c
      }
    })
  }

  const jsonToXmlStr = (obj: any, rootName = "root"): string => {
    const toXml = (val: any, name: string): string => {
      if (val === null) return `<${name} nil="true" />`
      if (typeof val === "object") {
        if (Array.isArray(val)) {
          return val.map(item => toXml(item, name)).join("\n")
        } else {
          const children = Object.keys(val)
            .map(key => toXml(val[key], key))
            .join("\n")
          return `<${name}>\n${children}\n</${name}>`
        }
      }
      return `<${name}>${escapeXml(String(val))}</${name}>`
    }
    return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(obj, rootName)}`
  }

  // 4. XML to JSON
  const xmlToJsonObj = (xmlStr: string): any => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlStr, "application/xml")
    
    const parserError = xmlDoc.querySelector("parsererror")
    if (parserError) {
      throw new Error("Erro de parser XML: " + parserError.textContent)
    }

    const nodeToJson = (node: Node): any => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.nodeValue?.trim() || ""
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return null

      const element = node as Element
      const children = Array.from(element.childNodes).filter(
        c => c.nodeType === Node.ELEMENT_NODE || (c.nodeType === Node.TEXT_NODE && c.nodeValue?.trim())
      )

      if (children.length === 0) return ""
      
      if (children.length === 1 && children[0].nodeType === Node.TEXT_NODE) {
        const textVal = children[0].nodeValue?.trim() || ""
        if (textVal === "true") return true
        if (textVal === "false") return false
        if (textVal === "null") return null
        if (!isNaN(Number(textVal)) && textVal !== "") return Number(textVal)
        return textVal
      }

      const obj: any = {}
      for (const child of children) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const childEl = child as Element
          const childName = childEl.tagName
          const childVal = nodeToJson(childEl)

          if (obj[childName] !== undefined) {
            if (!Array.isArray(obj[childName])) {
              obj[childName] = [obj[childName]]
            }
            obj[childName].push(childVal)
          } else {
            obj[childName] = childVal
          }
        }
      }
      return obj
    }

    const rootElement = xmlDoc.documentElement
    return {
      [rootElement.tagName]: nodeToJson(rootElement)
    }
  }

  // 5. JSON to CSV
  const escapeCsvField = (val: any): string => {
    if (val === null || val === undefined) return '""'
    let str = typeof val === "object" ? JSON.stringify(val) : String(val)
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      str = '"' + str.replace(/"/g, '""') + '"'
    }
    return str
  }

  const jsonToCsvStr = (json: any): string => {
    const arr = Array.isArray(json) ? json : [json]
    if (arr.length === 0) return ""

    // Collect all headers
    const headers = Array.from(new Set(arr.flatMap(obj => Object.keys(obj || {}))))
    const rows = []
    
    // Header
    rows.push(headers.map(h => escapeCsvField(h)).join(","))

    // Rows
    for (const obj of arr) {
      const row = headers.map(header => {
        const val = obj ? obj[header] : ""
        return escapeCsvField(val)
      })
      rows.push(row.join(","))
    }

    return rows.join("\n")
  }

  // 6. CSV to JSON
  const parseCsvLine = (line: string): string[] => {
    const result = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const csvToJsonObj = (csvStr: string): any[] => {
    const lines = csvStr.split(/\r?\n/)
    if (lines.length === 0 || !lines[0].trim()) return []

    const headers = parseCsvLine(lines[0])
    const result = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue

      const values = parseCsvLine(line)
      const obj: any = {}
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j]
        const rawVal = values[j] !== undefined ? values[j] : ""

        if (rawVal === "true") obj[header] = true
        else if (rawVal === "false") obj[header] = false
        else if (rawVal === "null") obj[header] = null
        else if (!isNaN(Number(rawVal)) && rawVal !== "") obj[header] = Number(rawVal)
        else obj[header] = rawVal
      }
      result.push(obj)
    }

    return result
  }

  // ----------------------------------------------------
  // CONVERSION HANDLER
  // ----------------------------------------------------
  useEffect(() => {
    setError(null)
    if (!inputVal.trim()) {
      setOutputVal("")
      return
    }

    try {
      let parsedJson: any = null

      switch (conversion) {
        case "json-yaml":
          parsedJson = JSON.parse(inputVal)
          setOutputVal(jsonToYaml(parsedJson))
          break

        case "yaml-json":
          parsedJson = yamlToJsonObj(inputVal)
          setOutputVal(JSON.stringify(parsedJson, null, 2))
          break

        case "json-xml":
          parsedJson = JSON.parse(inputVal)
          setOutputVal(jsonToXmlStr(parsedJson))
          break

        case "xml-json":
          parsedJson = xmlToJsonObj(inputVal)
          setOutputVal(JSON.stringify(parsedJson, null, 2))
          break

        case "json-csv":
          parsedJson = JSON.parse(inputVal)
          if (typeof parsedJson !== "object" || parsedJson === null) {
            throw new Error("A entrada JSON deve ser um objeto ou um array de objetos para conversão em CSV.")
          }
          setOutputVal(jsonToCsvStr(parsedJson))
          break

        case "csv-json":
          parsedJson = csvToJsonObj(inputVal)
          setOutputVal(JSON.stringify(parsedJson, null, 2))
          break
      }
    } catch (err: any) {
      setError(err.message || "Erro na conversão. Verifique a sintaxe da entrada.")
      setOutputVal("")
    }
  }, [inputVal, conversion])

  const copyOutput = () => {
    if (!outputVal) return
    navigator.clipboard.writeText(outputVal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Copiado com sucesso!")
  }

  const pasteInput = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setInputVal(text)
        toast.success("Texto colado!")
      }
    } catch {
      toast.error("Erro ao colar da área de transferência.")
    }
  }

  const swapConversion = () => {
    const swapMap: Record<ConversionType, ConversionType> = {
      "json-yaml": "yaml-json",
      "yaml-json": "json-yaml",
      "json-xml": "xml-json",
      "xml-json": "json-xml",
      "json-csv": "csv-json",
      "csv-json": "json-csv",
    }
    setConversion(swapMap[conversion])
    setInputVal(outputVal)
    toast.success("Direção da conversão invertida!")
  }

  const loadSample = () => {
    const sampleObj = {
      empresa: "NexTools",
      status: "Ativo",
      estatisticas: {
        usuarios: 1540,
        ferramentas: 28,
        online: true
      },
      tags: ["desenvolvimento", "utilitarios", "produtividade"],
      colaboradores: [
        { nome: "Samuel Oliveira", cargo: "Desenvolvedor" },
        { nome: "Carlos Santos", cargo: "Designer" }
      ]
    }

    const sampleCsv = `nome,cargo,departamento,salario
Samuel Oliveira,Desenvolvedor,Tecnologia,8500
Carlos Santos,Designer,Produto,7000
Ana Souza,Gerente,Vendas,9500`

    const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<projeto>
  <nome>NexTools</nome>
  <versao>1.0.0</versao>
  <modulo>
    <nome>FormatConverter</nome>
    <tipo>Utilitario</tipo>
  </modulo>
</projeto>`

    const sampleYaml = `empresa: NexTools
status: Ativo
estatisticas:
  usuarios: 1540
  ferramentas: 28
  online: true
tags:
  - desenvolvimento
  - utilitarios
  - produtividade`

    switch (conversion) {
      case "json-yaml":
      case "json-xml":
      case "json-csv":
        setInputVal(JSON.stringify(sampleObj, null, 2))
        break
      case "yaml-json":
        setInputVal(sampleYaml)
        break
      case "xml-json":
        setInputVal(sampleXml)
        break
      case "csv-json":
        setInputVal(sampleCsv)
        break
    }
    toast.success("Exemplo correspondente carregado!")
  }

  return (
    <ToolWrapper
      id="conversor-formatos"
      title="Conversor de Formatos"
      description="Converta dados facilmente entre JSON, YAML, XML e CSV bidirecionalmente com validação instantânea."
      icon={FileCode}
      actions={
        <Button variant="outline" size="sm" onClick={loadSample}>
          Carregar Exemplo
        </Button>
      }
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20 p-4 rounded-lg border mb-6">
        <div className="flex items-center gap-3 flex-1">
          <Label className="whitespace-nowrap font-medium">Conversão:</Label>
          <Select value={conversion} onValueChange={val => setConversion(val as ConversionType)}>
            <SelectTrigger className="w-full md:w-[280px] bg-background">
              <SelectValue placeholder="Selecione o formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json-yaml">JSON ➔ YAML</SelectItem>
              <SelectItem value="yaml-json">YAML ➔ JSON</SelectItem>
              <SelectItem value="json-xml">JSON ➔ XML</SelectItem>
              <SelectItem value="xml-json">XML ➔ JSON</SelectItem>
              <SelectItem value="json-csv">JSON ➔ CSV</SelectItem>
              <SelectItem value="csv-json">CSV ➔ JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" size="sm" onClick={swapConversion} disabled={!inputVal && !outputVal}>
          <ArrowRightLeft className="h-4 w-4 mr-2" />
          Inverter Sentido
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 font-medium mb-6">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">Erro de Sintaxe: </span>
            <span className="font-mono text-xs">{error}</span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Entrada */}
        <Card>
          <CardHeader className="py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Entrada</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={pasteInput}>
                Colar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Textarea
              placeholder={`Insira os dados em formato ${conversion.split("-")[0].toUpperCase()} aqui...`}
              className="min-h-[350px] font-mono text-sm leading-relaxed"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Saída */}
        <Card>
          <CardHeader className="py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Saída</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={copyOutput} disabled={!outputVal}>
                {copied ? <Check className="h-4 w-4 text-emerald-500 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                Copiar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <Textarea
              className="min-h-[350px] font-mono text-sm leading-relaxed bg-muted/10"
              value={outputVal}
              readOnly
              placeholder={`O resultado em formato ${conversion.split("-")[1].toUpperCase()} aparecerá aqui...`}
            />
          </CardContent>
        </Card>
      </div>
    </ToolWrapper>
  )
}

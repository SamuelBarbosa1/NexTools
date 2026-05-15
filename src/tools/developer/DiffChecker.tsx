import { useState } from "react"
import { FileDiff } from "lucide-react"
import * as Diff from "diff"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export function DiffChecker() {
  const [original, setOriginal] = useState("")
  const [modified, setModified] = useState("")

  const diffResult = Diff.diffLines(original, modified)

  return (
    <ToolWrapper
      id="diff-checker"
      title="Diff Checker"
      description="Compare dois textos e encontre as diferenças entre eles."
      icon={FileDiff}
    >
      <div className="grid gap-6 h-[800px] grid-rows-[1fr_1fr]">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="flex flex-col h-full border-primary/20">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Texto Original</span>
            </div>
            <CardContent className="flex-1 p-0">
              <Textarea
                className="w-full h-full min-h-[250px] resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm p-4 bg-muted/10"
                placeholder="Insira o texto original aqui..."
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full border-primary/20">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Texto Modificado</span>
            </div>
            <CardContent className="flex-1 p-0">
              <Textarea
                className="w-full h-full min-h-[250px] resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm p-4 bg-muted/10"
                placeholder="Insira o texto modificado aqui..."
                value={modified}
                onChange={(e) => setModified(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col h-full border-primary/20">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold">Resultado das Diferenças</span>
          </div>
          <CardContent className="flex-1 p-0 overflow-auto bg-muted/5 font-mono text-sm leading-relaxed">
            {diffResult.map((part, index) => {
              const colorClass = part.added
                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                : part.removed
                ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                : "text-muted-foreground"
              
              if (!part.value) return null

              return (
                <span key={index} className={`${colorClass} px-1 whitespace-pre-wrap block`}>
                  {part.value}
                </span>
              )
            })}
            {!original && !modified && (
              <div className="h-full flex items-center justify-center text-muted-foreground opacity-50 p-6 text-center">
                Preencha os campos acima para ver a comparação.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolWrapper>
  )
}

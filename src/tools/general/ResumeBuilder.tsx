import { useState } from "react"
import { FileText, Printer, Plus, Trash2, User, Briefcase, GraduationCap, Wrench, RotateCcw, Sparkles } from "lucide-react"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Experience = {
  id: string
  company: string
  role: string
  period: string
  description: string
}

type Education = {
  id: string
  institution: string
  course: string
  period: string
}

const INITIAL_DATA = {
  fullName: "Samuel Barbosa de Oliveira",
  title: "Desenvolvedor Full Stack Senior",
  email: "samuel.oliveira@email.com",
  phone: "(61) 9999-9999",
  location: "Brasília, DF - Brasil",
  linkedin: "https://www.linkedin.com/in/samuel-oliveira-4007602b9",
  summary: "Desenvolvedor Full Stack com mais de 7 anos de experiência na criação de aplicações web escaláveis e de alta performance. Especialista em ecossistema React, Node.js e arquitetura de microsserviços. Apaixonado por código limpo, boas práticas e mentoria de desenvolvedores juniores.",
  experiences: [
    {
      id: "1",
      company: "Ensti Soluções Eficientes em Tecnologia",
      role: "Trainee TI",
      period: "2026 - Presente",
      description: "Atuação em projetos de desenvolvimento de software, com foco em tecnologias web e suporte técnico. Participação em treinamentos e capacitações para aprimoramento das habilidades técnicas e profissionais."
    },
    {
      id: "2",
      company: "Sonda Make IT Easy",
      role: "Agente de Service Desk",
      period: "2025 - 2026",
      description: "Atendimento ao cliente e resolução de problemas técnicos relacionados a equipamentos e softwares."
    }
  ] as Experience[],
  educations: [
    {
      id: "1",
      institution: "Universidade Cruzeiro do Sul (UDF)",
      course: "Tecnologo em Análise e Desenvolvimento de Sistemas",
      period: "2024"
    }
  ] as Education[],
  skills: ["React", "TypeScript", "Golang", "Node.js", "Next.js", "Tailwind CSS", "MySQL", "Docker", "Git", "CI/CD", "Scrum"]
}

export function ResumeBuilder() {
  const [data, setData] = useState(INITIAL_DATA)
  const [newSkill, setNewSkill] = useState("")

  const handlePersonalChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  // Experiências
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      role: "",
      period: "",
      description: ""
    }
    setData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }))
  }

  const removeExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }))
  }

  // Educação
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      course: "",
      period: ""
    }
    setData(prev => ({ ...prev, educations: [...prev.educations, newEdu] }))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData(prev => ({
      ...prev,
      educations: prev.educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }))
  }

  const removeEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      educations: prev.educations.filter(edu => edu.id !== id)
    }))
  }

  // Habilidades
  const addSkill = () => {
    if (!newSkill.trim()) return
    setData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }))
    setNewSkill("")
  }

  const removeSkill = (indexToRemove: number) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== indexToRemove)
    }))
  }

  const handlePrint = () => {
    window.print()
  }

  const handleReset = () => {
    setData({
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      summary: "",
      experiences: [],
      educations: [],
      skills: []
    })
  }

  const handleLoadSample = () => {
    setData(INITIAL_DATA)
  }

  return (
    <ToolWrapper
      id="gerador-curriculo"
      title="Gerador de Currículo"
      description="Crie e formate seu currículo profissional rapidamente e exporte para PDF."
      icon={FileText}
    >
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 0mm; /* Removes default browser headers & footers */
          }

          /* Ocultar elementos de UI globais e do editor */
          aside,
          header,
          nav,
          button,
          .no-print,
          .flex.flex-wrap.gap-2.mb-6,
          .mx-auto.max-w-4xl > div:first-child,
          .lg\\:col-span-6:first-child,
          .lg\\:col-span-6 > div > label {
            display: none !important;
          }

          /* Resetar containers pais para fluxo normal de bloco na página inteira */
          html,
          body,
          #root,
          .min-h-screen,
          main,
          .mx-auto.max-w-4xl,
          .pt-2,
          .grid,
          .lg\\:col-span-6 {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            overflow: visible !important;
            position: static !important;
          }

          /* Garantir que o container do currículo ocupe toda a largura e tenha fundo branco */
          #printable-resume {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            border: none !important;
            padding: 15mm 20mm !important; /* Compensa a margem 0 da página */
            margin: 0 !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }

          /* Forçar cores pretas e cinzas escuras para todos os textos impressos */
          #printable-resume * {
            color: #0f172a !important; /* Slate 900 */
            background: transparent !important;
            visibility: visible !important;
          }

          /* Forçar cores específicas para seções em destaque */
          #printable-resume h1 {
            color: #0f172a !important; /* Slate 900 */
            font-size: 24pt !important;
          }

          #printable-resume .text-primary {
            color: #1e3a8a !important; /* Azul escuro profissional */
          }

          #printable-resume .text-slate-600,
          #printable-resume .text-slate-700,
          #printable-resume .text-slate-500 {
            color: #475569 !important; /* Slate 600 */
          }

          #printable-resume .bg-slate-100 {
            background-color: #f1f5f9 !important;
            border-color: #cbd5e1 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          #printable-resume .border-slate-200 {
            border-color: #cbd5e1 !important;
          }
        }
      `}</style>

      <div className="flex flex-wrap gap-2 mb-6 justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button variant="outline" onClick={handleLoadSample}>
            <Sparkles className="h-4 w-4 mr-2" />
            Carregar Exemplo
          </Button>
        </div>
        <Button onClick={handlePrint} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir / Salvar PDF
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Formulário de Edição */}
        <div className="lg:col-span-6 space-y-6">
          {/* Dados Pessoais */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input value={data.fullName} onChange={e => handlePersonalChange("fullName", e.target.value)} placeholder="Ex: Carlos Eduardo Santos" />
              </div>

              <div className="space-y-2">
                <Label>Cargo / Título Profissional</Label>
                <Input value={data.title} onChange={e => handlePersonalChange("title", e.target.value)} placeholder="Ex: Desenvolvedor Full Stack" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input value={data.email} onChange={e => handlePersonalChange("email", e.target.value)} placeholder="exemplo@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={data.phone} onChange={e => handlePersonalChange("phone", e.target.value)} placeholder="(11) 99999-9999" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Localização</Label>
                  <Input value={data.location} onChange={e => handlePersonalChange("location", e.target.value)} placeholder="Ex: São Paulo, SP" />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn / Portfólio</Label>
                  <Input value={data.linkedin} onChange={e => handlePersonalChange("linkedin", e.target.value)} placeholder="linkedin.com/in/usuario" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Resumo Profissional</Label>
                <Textarea 
                  value={data.summary} 
                  onChange={e => handlePersonalChange("summary", e.target.value)} 
                  placeholder="Faça um breve resumo das suas qualificações e objetivos..."
                  className="h-24" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Experiência Profissional */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <CardTitle>Experiência Profissional</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.experiences.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">Nenhuma experiência adicionada.</p>
              ) : (
                data.experiences.map((exp, index) => (
                  <div key={exp.id} className="space-y-4 border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold text-base text-primary">Experiência {index + 1}</Label>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-500/10" onClick={() => removeExperience(exp.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Empresa</Label>
                        <Input value={exp.company} onChange={e => updateExperience(exp.id, "company", e.target.value)} placeholder="Nome da empresa" />
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo</Label>
                        <Input value={exp.role} onChange={e => updateExperience(exp.id, "role", e.target.value)} placeholder="Seu cargo" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Período</Label>
                      <Input value={exp.period} onChange={e => updateExperience(exp.id, "period", e.target.value)} placeholder="Ex: Jan 2020 - Presente" />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição das Atividades</Label>
                      <Textarea value={exp.description} onChange={e => updateExperience(exp.id, "description", e.target.value)} placeholder="Descreva suas principais conquistas e responsabilidades..." className="h-20" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Formação Acadêmica */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <CardTitle>Formação Acadêmica</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.educations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">Nenhuma formação adicionada.</p>
              ) : (
                data.educations.map((edu, index) => (
                  <div key={edu.id} className="space-y-4 border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold text-base text-primary">Formação {index + 1}</Label>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-500/10" onClick={() => removeEducation(edu.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Instituição</Label>
                        <Input value={edu.institution} onChange={e => updateEducation(edu.id, "institution", e.target.value)} placeholder="Nome da faculdade/escola" />
                      </div>
                      <div className="space-y-2">
                        <Label>Curso</Label>
                        <Input value={edu.course} onChange={e => updateEducation(edu.id, "course", e.target.value)} placeholder="Nome do curso" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Período</Label>
                      <Input value={edu.period} onChange={e => updateEducation(edu.id, "period", e.target.value)} placeholder="Ex: 2015 - 2019" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Habilidades */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              <CardTitle>Habilidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  value={newSkill} 
                  onChange={e => setNewSkill(e.target.value)} 
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                  placeholder="Adicionar habilidade (Ex: React, Scrum...)" 
                />
                <Button onClick={addSkill} variant="secondary">Adicionar</Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {data.skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                    <button onClick={() => removeSkill(index)} className="hover:text-red-500 ml-1 font-bold">×</button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pré-visualização do Currículo (Live Preview) */}
        <div className="lg:col-span-6">
          <div className="sticky top-6">
            <Label className="block text-lg font-semibold mb-4 text-muted-foreground">Pré-visualização (A4)</Label>
            <Card id="printable-resume" className="bg-white text-slate-900 shadow-lg border-0 overflow-hidden min-h-[842px] p-8 space-y-6 font-sans">
              {/* Cabeçalho */}
              <div className="border-b border-slate-200 pb-6 space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{data.fullName || "Seu Nome Completo"}</h1>
                <p className="text-lg font-medium text-primary">{data.title || "Seu Cargo / Título"}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 pt-2">
                  {data.email && <span>{data.email}</span>}
                  {data.phone && <span>• {data.phone}</span>}
                  {data.location && <span>• {data.location}</span>}
                  {data.linkedin && <span>• {data.linkedin}</span>}
                </div>
              </div>

              {/* Resumo */}
              {data.summary && (
                <div className="space-y-2">
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">Resumo Profissional</h2>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{data.summary}</p>
                </div>
              )}

              {/* Experiências */}
              {data.experiences.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">Experiência Profissional</h2>
                  <div className="space-y-4">
                    {data.experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                          <span className="text-xs font-semibold text-slate-500">{exp.period}</span>
                        </div>
                        <div className="text-sm font-medium text-primary">{exp.company}</div>
                        {exp.description && <p className="text-xs text-slate-700 leading-relaxed pt-1 whitespace-pre-line">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Educação */}
              {data.educations.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">Formação Acadêmica</h2>
                  <div className="space-y-3">
                    {data.educations.map((edu) => (
                      <div key={edu.id} className="space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-sm font-bold text-slate-900">{edu.course}</h3>
                          <span className="text-xs font-semibold text-slate-500">{edu.period}</span>
                        </div>
                        <div className="text-xs text-slate-600">{edu.institution}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Habilidades */}
              {data.skills.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">Habilidades e Competências</h2>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {data.skills.map((skill, index) => (
                      <span key={index} className="bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </ToolWrapper>
  )
}

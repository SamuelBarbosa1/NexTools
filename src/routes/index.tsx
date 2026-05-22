import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { RootLayout } from "@/layouts/RootLayout"
import { Home } from "@/pages/Home"
import { PasswordGenerator } from "@/tools/general/PasswordGenerator"
import { UrlShortener } from "@/tools/general/UrlShortener"
import { JsonFormatter } from "@/tools/developer/JsonFormatter"
import { UuidGenerator } from "@/tools/developer/UuidGenerator"
import { TextConverter } from "@/tools/text/TextConverter"
import { LoremIpsum } from "@/tools/text/LoremIpsum"
import { CpfCnpjGenerator } from "@/tools/general/CpfCnpjGenerator"
import { TimestampConverter } from "@/tools/developer/TimestampConverter"
import { BrazilData } from "@/tools/general/BrazilData"
import { FakeData } from "@/tools/general/FakeData"
import { HashGenerator } from "@/tools/developer/HashGenerator"
import { DiffChecker } from "@/tools/developer/DiffChecker"
import { ImageConverter } from "@/tools/media/ImageConverter"
import { QrGenerator } from "@/tools/media/QrGenerator"
import { EmailValidator } from "@/tools/text/EmailValidator"
import { Settings } from "@/pages/Settings"
import { BankAccountGenerator } from "@/tools/general/BankAccountGenerator"
import { PisPasepGenerator } from "@/tools/general/PisPasepGenerator"
import { VehicleGenerator } from "@/tools/general/VehicleGenerator"
import { ResumeBuilder } from "@/tools/general/ResumeBuilder"
import { CreditCardGenerator } from "@/tools/general/CreditCardGenerator"
import { PersonGenerator } from "@/tools/general/PersonGenerator"
import { CnhGenerator } from "@/tools/general/CnhGenerator"
import { VoterTitleGenerator } from "@/tools/general/VoterTitleGenerator"
import { CertificateGenerator } from "@/tools/general/CertificateGenerator"
import { InscricaoEstadualGenerator } from "@/tools/general/InscricaoEstadualGenerator"
import { SalaryCalculator } from "@/tools/general/SalaryCalculator"
import { JwtValidator } from "@/tools/developer/JwtValidator"
import { BaseConverter } from "@/tools/developer/BaseConverter"
import { WhatsAppLinkGenerator } from "@/tools/general/WhatsAppLinkGenerator"
import { FormatConverter } from "@/tools/developer/FormatConverter"
import { SqlFormatter } from "@/tools/developer/SqlFormatter"
import { HelloWorldGenerator } from "@/tools/developer/HelloWorldGenerator"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "tools/password-generator",
        element: <PasswordGenerator />,
      },
      {
        path: "tools/url-shortener",
        element: <UrlShortener />,
      },
      {
        path: "tools/cpf-cnpj-generator",
        element: <CpfCnpjGenerator />,
      },
      {
        path: "tools/bank-account-generator",
        element: <BankAccountGenerator />,
      },
      {
        path: "tools/pis-pasep-generator",
        element: <PisPasepGenerator />,
      },
      {
        path: "tools/vehicle-generator",
        element: <VehicleGenerator />,
      },
      {
        path: "tools/resume-builder",
        element: <ResumeBuilder />,
      },
      {
        path: "tools/whatsapp-link-generator",
        element: <WhatsAppLinkGenerator />,
      },
      {
        path: "tools/credit-card-generator",
        element: <CreditCardGenerator />,
      },
      {
        path: "tools/person-generator",
        element: <PersonGenerator />,
      },
      {
        path: "tools/cnh-generator",
        element: <CnhGenerator />,
      },
      {
        path: "tools/voter-title-generator",
        element: <VoterTitleGenerator />,
      },
      {
        path: "tools/certificate-generator",
        element: <CertificateGenerator />,
      },
      {
        path: "tools/inscricao-estadual-generator",
        element: <InscricaoEstadualGenerator />,
      },
      {
        path: "tools/salary-calculator",
        element: <SalaryCalculator />,
      },
      {
        path: "tools/json-formatter",
        element: <JsonFormatter />,
      },
      {
        path: "tools/uuid-generator",
        element: <UuidGenerator />,
      },
      {
        path: "tools/timestamp-converter",
        element: <TimestampConverter />,
      },
      {
        path: "tools/text-converter",
        element: <TextConverter />,
      },
      {
        path: "tools/lorem-ipsum",
        element: <LoremIpsum />,
      },
      {
        path: "tools/brazil-data",
        element: <BrazilData />,
      },
      {
        path: "tools/fake-data",
        element: <FakeData />,
      },
      {
        path: "tools/hash-generator",
        element: <HashGenerator />,
      },
      {
        path: "tools/diff-checker",
        element: <DiffChecker />,
      },
      {
        path: "tools/jwt-validator",
        element: <JwtValidator />,
      },
      {
        path: "tools/base-converter",
        element: <BaseConverter />,
      },
      {
        path: "tools/format-converter",
        element: <FormatConverter />,
      },
      {
        path: "tools/sql-formatter",
        element: <SqlFormatter />,
      },
      {
        path: "tools/hello-world",
        element: <HelloWorldGenerator />,
      },
      {
        path: "tools/image-converter",
        element: <ImageConverter />,
      },
      {
        path: "tools/qr-generator",
        element: <QrGenerator />,
      },
      {
        path: "tools/email-validator",
        element: <EmailValidator />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

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

import { useState } from "react"
import { FileCode, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { ToolWrapper } from "@/components/ToolWrapper"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Snippet {
  title: string
  code: string
}

interface LanguageData {
  name: string
  category: "Frontend/Scripting" | "Backend/Sistemas" | "Dados/Outros"
  snippets: {
    [key: string]: Snippet
  }
}

const LANGUAGES: { [key: string]: LanguageData } = {
  javascript: {
    name: "JavaScript",
    category: "Frontend/Scripting",
    snippets: {
      hello: {
        title: "Hello World",
        code: `// Programa Hello World em JavaScript
console.log("Hello, World!");`,
      },
      loops: {
        title: "Variáveis & Loops",
        code: `// Declaração de variáveis
const appName = "NexTools";
let counter = 0;

// Loop tradicional de 0 a 4
for (let i = 0; i < 5; i++) {
  console.log(\`\${appName} - Contagem: \${i}\`);
}`,
      },
      datastructures: {
        title: "Estruturas de Dados",
        code: `// Declaração de Objeto (Dicionário)
const user = {
  id: 101,
  name: "Samuel Barbosa",
  active: true
};

// Declaração de Array (Lista)
const technologies = ["React", "TypeScript", "Vite", "Tailwind"];

// Iteração e desestruturação
technologies.forEach((tech, index) => {
  console.log(\`[\${index}] Tech: \${tech}\`);
});`,
      },
      functions: {
        title: "Funções / Métodos",
        code: `// Função clássica
function greet(name) {
  return "Olá, " + name + "! Bem-vindo.";
}

// Arrow function (Função seta)
const calculateTotal = (price, tax) => price * (1 + tax);

console.log(greet("Samuel"));
console.log("Preço Final:", calculateTotal(100, 0.15));`,
      },
      http: {
        title: "Requisição HTTP",
        code: `// Requisição GET utilizando a Fetch API (nativo)
fetch("https://api.github.com/users/github")
  .then((response) => {
    if (!response.ok) throw new Error("Erro na requisição");
    return response.json();
  })
  .then((data) => {
    console.log("Nome da Organização:", data.name);
    console.log("Blog:", data.blog);
  })
  .catch((err) => console.error("Erro capturado:", err));`,
      },
    },
  },
  typescript: {
    name: "TypeScript",
    category: "Frontend/Scripting",
    snippets: {
      hello: {
        title: "Hello World",
        code: `// Programa Hello World em TypeScript
const greeting: string = "Hello, World!";
console.log(greeting);`,
      },
      loops: {
        title: "Variáveis & Loops",
        code: `// Variáveis fortemente tipadas
const prefix: string = "Item #";
let count: number = 0;

// Loop com tipo explícito
for (let i: number = 0; i < 5; i++) {
  console.log(\`\${prefix}\${i}\`);
}`,
      },
      datastructures: {
        title: "Estruturas de Dados",
        code: `// Definição de Interface (Tipagem de Objeto)
interface Product {
  id: number;
  name: string;
  price: number;
  tags?: string[];
}

const item: Product = {
  id: 1,
  name: "Notebook Pro",
  price: 4999.90,
  tags: ["tecnologia", "hardware"]
};

// Arrays genéricos
const scores: Array<number> = [95, 88, 100];`,
      },
      functions: {
        title: "Funções / Métodos",
        code: `// Parâmetros e retorno tipados
function formatCurrency(value: number, symbol: string = "R$"): string {
  return \`\${symbol} \${value.toFixed(2)}\`;
}

const addTax = (amount: number, taxRate: number): number => {
  return amount + (amount * taxRate);
};

console.log(formatCurrency(addTax(100, 0.1)));`,
      },
      http: {
        title: "Requisição HTTP",
        code: `// Definição do formato da resposta da API
interface GithubOrg {
  name: string;
  blog: string;
  public_repos: number;
}

async function fetchOrgDetails(orgName: string): Promise<void> {
  try {
    const response = await fetch(\`https://api.github.com/orgs/\${orgName}\`);
    const data: GithubOrg = await response.json();
    console.log(\`Nome: \${data.name} | Repos: \${data.public_repos}\`);
  } catch (error) {
    console.error("Erro na busca:", error);
  }
}

fetchOrgDetails("microsoft");`,
      },
    },
  },
  python: {
    name: "Python",
    category: "Frontend/Scripting",
    snippets: {
      hello: {
        title: "Hello World",
        code: `# Programa Hello World em Python
print("Hello, World!")`,
      },
      loops: {
        title: "Variáveis & Loops",
        code: `# Variáveis dinâmicas
app_name = "NexTools"
is_running = True

# Loop de 0 a 4 usando range()
for i in range(5):
    print(f"{app_name} - Ciclo: {i}")`,
      },
      datastructures: {
        title: "Estruturas de Dados",
        code: `# Dicionário (Chave-Valor)
user = {
    "id": 102,
    "name": "Ana Maria",
    "roles": ["admin", "editor"]
}

# Lista (Array)
languages = ["Python", "Golang", "Rust"]

# Iterando lista com enumerate (obtém índice)
for index, lang in enumerate(languages):
    print(f"Linguagem {index + 1}: {lang}")`,
      },
      functions: {
        title: "Funções / Métodos",
        code: `# Declaração de função com tipagem opcional (Type Hints)
def calculate_discount(price: float, discount: float) -> float:
    """Calcula o valor final de um produto com desconto."""
    return price * (1 - discount)

def greet(name: str) -> str:
    return f"Olá, {name}!"

print(greet("Samuel"))
print("Valor com Desconto: R$", calculate_discount(250.0, 0.15))`,
      },
      http: {
        title: "Requisição HTTP",
        code: `# Requer a biblioteca 'requests' (pip install requests)
import requests

try:
    response = requests.get("https://api.github.com/users/github")
    response.raise_for_status() # Lança erro se status for 4xx/5xx
    
    data = response.json()
    print("Organização:", data.get("name"))
    print("URL Pública:", data.get("html_url"))
except requests.exceptions.RequestException as e:
    print(f"Erro na conexão: {e}")`,
      },
    },
  },
  golang: {
    name: "Go (Golang)",
    category: "Backend/Sistemas",
    snippets: {
      hello: {
        title: "Hello World",
        code: `package main

import "fmt"

func main() {
    // Escreve no console padrão
    fmt.Println("Hello, World!")
}`,
      },
      loops: {
        title: "Variáveis & Loops",
        code: `package main

import "fmt"

func main() {
    // Declaração de variáveis
    var host string = "localhost"
    port := 8080 // Declaração curta implícita

    fmt.Printf("Servidor rodando em %s:%d\\n", host, port)

    // Único construto de loop em Go é o 'for'
    for i := 0; i < 5; i++ {
        fmt.Println("Número:", i)
    }
}`,
      },
      datastructures: {
        title: "Estruturas de Dados",
        code: `package main

import "fmt"

// Estrutura personalizada (Struct)
type User struct {
    ID     int
    Name   string
    Active bool
}

func main() {
    // Instanciando struct
    dev := User{ID: 1, Name: "Samuel", Active: true}

    // Slice (Array de tamanho dinâmico)
    colors := []string{"Vermelho", "Verde", "Azul"}

    fmt.Println("Usuário:", dev.Name)
    
    // Iterando com range
    for index, color := range colors {
        fmt.Printf("[%d] Cor: %s\\n", index, color)
    }
}`,
      },
      functions: {
        title: "Funções / Métodos",
        code: `package main

import "fmt"

// Função que retorna dois valores (comum em Go para erros)
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("divisão por zero")
    }
    return a / b, nil
}

func main() {
    res, err := divide(10, 2)
    if err != nil {
        fmt.Println("Erro:", err)
        return
    }
    fmt.Println("Resultado:", res)
}`,
      },
      http: {
        title: "Requisição HTTP",
        code: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
)

type GitHubUser struct {
    Name string \`json:"name"\`
    Bio  string \`json:"bio"\`
}

func main() {
    client := &http.Client{Timeout: 10 * time.Second}
    
    resp, err := client.Get("https://api.github.com/users/github")
    if err != nil {
        fmt.Println("Erro:", err)
        return
    }
    defer resp.Body.Close()

    var user GitHubUser
    if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
        fmt.Println("Erro ao decodificar JSON:", err)
        return
    }

    fmt.Printf("Nome: %s\\nBio: %s\\n", user.Name, user.Bio)
}`,
      },
    },
  },
  rust: {
    name: "Rust",
    category: "Backend/Sistemas",
    snippets: {
      hello: {
        title: "Hello World",
        code: `// Ponto de entrada do programa
fn main() {
    // Macro de impressão formatada no console
    println!("Hello, World!");
}`,
      },
      loops: {
        title: "Variáveis & Loops",
        code: `fn main() {
    // Variáveis são imutáveis por padrão
    let title = "Contador";
    // Usamos 'mut' para permitir alteração do valor
    let mut steps = 0;

    println!("Ferramenta: {}", title);

    // Loop de 0 a 4 (exclusivo no extremo superior)
    for i in 0..5 {
        println!("Passo: {}", i);
        steps += 1;
    }
}`,
      },
      datastructures: {
        title: "Estruturas de Dados",
        code: `// Estrutura customizada
struct Account {
    username: String,
    level: u32,
}

fn main() {
    let acc = Account {
        username: String::from("samuel_dev"),
        level: 99,
    };

    // Vector (Array dinâmico na Heap)
    let frameworks = vec!["React", "Rust", "Actix"];

    println!("Conta: {} (Nível {})", acc.username, acc.level);
    for fw in &frameworks {
        println!("Framework: {}", fw);
    }
}`,
      },
      functions: {
        title: "Funções / Métodos",
        code: `// Assinatura com tipos estáticos de argumentos e de retorno
fn is_even(num: i32) -> bool {
    // Retorno implícito (sem ponto e vírgula na última linha)
    num % 2 == 0
}

fn main() {
    let value = 42;
    println!("O número {} é par? {}", value, is_even(value));
}`,
      },
      http: {
        title: "Requisição HTTP",
        code: `// Requer as crates 'reqwest' e 'tokio' no Cargo.toml
// [dependencies]
// reqwest = { version = "0.11", features = ["json"] }
// serde = { version = "1.0", features = ["derive"] }
// tokio = { version = "1", features = ["full"] }

use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct User {
    name: String,
    company: Option<String>,
}

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let url = "https://api.github.com/users/github";
    
    // Configura o client e faz a requisição
    let client = reqwest::Client::new();
    let response = client
        .get(url)
        .header("User-Agent", "reqwest-rust-app")
        .send()
        .await?;

    let user: User = response.json().await?;
    println!("Organização: {}", user.name);
    Ok(())
}`,
      },
    },
  },
  java: {
    name: "Java",
    category: "Backend/Sistemas",
    snippets: {
      hello: {
        title: "Hello World",
        code: `public class HelloWorld {
    public static void main(String[] args) {
        // Exibe a mensagem no console padrão
        System.out.println("Hello, World!");
    }
}`,
      },
      loops: {
        title: "Variáveis & Loops",
        code: `public class Main {
    public static void main(String[] args) {
        String serviceName = "NexTools API";
        int maxRetries = 3;

        System.out.println("Iniciando serviço: " + serviceName);

        // Loop for padrão
        for (int i = 1; i <= maxRetries; i++) {
            System.out.println("Tentativa de conexão #" + i);
        }
    }
}`,
      },
      datastructures: {
        title: "Estruturas de Dados",
        code: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DataStructureSample {
    public static void main(String[] args) {
        // Dicionário (Map)
        Map<String, String> config = new HashMap<>();
        config.put("db_host", "localhost");
        config.put("db_port", "5432");

        // Lista dinâmica
        List<String> logs = new ArrayList<>();
        logs.add("Conexão estabelecida");
        logs.add("Query executada");

        for (String log : logs) {
            System.out.println("Log: " + log);
        }
    }
}`,
      },
      functions: {
        title: "Funções / Métodos",
        code: `public class Calculator {
    // Método com modificador estático
    public static int sum(int a, int b) {
        return a + b;
    }

    public double calculateInterest(double principal, double rate) {
        return principal * rate;
    }

    public static void main(String[] args) {
        System.out.println("Soma: " + sum(40, 2));
    }
}`,
      },
      http: {
        title: "Requisição HTTP",
        code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HttpGetRequest {
    public static void main(String[] args) {
        // Utilizando HttpClient moderno (Java 11+)
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.github.com/users/github"))
                .header("Accept", "application/json")
                .GET()
                .build();

        client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .thenAccept(System.out::println)
                .join(); // Bloqueia a Main até concluir para demonstração
    }
}`,
      },
    },
  },
  csharp: {
    name: "C# (.NET)",
    category: "Backend/Sistemas",
    snippets: {
      hello: {
        title: "Hello World",
        code: `// C# modernos usando Top-level Statements (.NET 6+)
using System;

Console.WriteLine("Hello, World!");`,
      },
      loops: {
        title: "Variáveis & Loops",
        code: `using System;

string serverName = "AWS Production";
int checkIntervalSeconds = 5;

Console.WriteLine($"Monitorando {serverName}");

for (int i = 0; i < 5; i++)
{
    Console.WriteLine($"Verificação #{i} efetuada");
}`,
      },
      datastructures: {
        title: "Estruturas de Dados",
        code: `using System;
using System.Collections.Generic;

// Classe simples
public class Dev
{
    public string Name { get; set; }
    public string Role { get; set; }
}

var developer = new Dev { Name = "Samuel", Role = "Senior" };

// Listas e Dicionários
var skills = new List<string> { "C#", "SQL", "Docker" };
var cache = new Dictionary<string, string>();
cache.Add("token_active", "true");

foreach (var skill in skills)
{
    Console.WriteLine($"Habilidade: {skill}");
}`,
      },
      functions: {
        title: "Funções / Métodos",
        code: `using System;

class MathHelper
{
    // Método estático
    public static int Multiply(int x, int y) => x * y;

    // Método clássico
    public bool CheckAge(int age)
    {
        return age >= 18;
    }
}

Console.WriteLine("Multiplicação: " + MathHelper.Multiply(7, 6));`,
      },
      http: {
        title: "Requisição HTTP",
        code: `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    // Uso de HttpClient persistente em aplicações produtivas
    private static readonly HttpClient client = new HttpClient();

    static async Task Main(string[] args)
    {
        client.DefaultRequestHeaders.Add("User-Agent", "CSharp-App");
        
        try
        {
            string responseBody = await client.GetStringAsync("https://api.github.com/users/github");
            Console.WriteLine(responseBody);
        }
        catch(HttpRequestException e)
        {
            Console.WriteLine($"Erro na requisição: {e.Message}");
        }
    }
}`,
      },
    },
  },
  cpp: {
    name: "C++",
    category: "Backend/Sistemas",
    snippets: {
      hello: {
        title: "Hello World",
        code: `#include <iostream>

int main() {
    // Envia o texto para a saída de stream padrão
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
      },
      loops: {
        title: "Variáveis & Loops",
        code: `#include <iostream>
#include <string>

int main() {
    std::string appName = "NexTools Native";
    int runs = 5;

    std::cout << "Iniciando: " << appName << std::endl;

    for (int i = 0; i < runs; ++i) {
        std::cout << "Iteração número: " << i << std::endl;
    }

    return 0;
}`,
      },
      datastructures: {
        title: "Estruturas de Dados",
        code: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>

struct User {
    int id;
    std::string name;
};

int main() {
    User root = {1, "Administrador"};

    // Vetores dinâmicos (Semelhante a Arrays)
    std::vector<std::string> options = {"Salvar", "Carregar", "Excluir"};

    // Mapas hash
    std::unordered_map<std::string, std::string> env;
    env["PORT"] = "80";

    for (const auto& opt : options) {
        std::cout << "Opção disponível: " << opt << std::endl;
    }
    return 0;
}`,
      },
      functions: {
        title: "Funções / Métodos",
        code: `#include <iostream>

// Protótipo/Declaração da função
int add(int a, int b);

// Implementação da função
int add(int a, int b) {
    return a + b;
}

int main() {
    int sum = add(30, 12);
    std::cout << "Soma: " << sum << std::endl;
    return 0;
}`,
      },
      http: {
        title: "Requisição HTTP",
        code: `// Nota: Requer bibliotecas externas (libcurl, Boost.Asio ou cpp-httplib)
// Exemplo com libcurl instalado
#include <iostream>
#include <curl/curl.h>

int main() {
    CURL* curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://api.github.com/users/github");
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
        // Desativar verificação SSL para simplificação (não recomendado em produção)
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);

        // Executar requisição
        CURLcode res = curl_easy_perform(curl);
        if(res != CURLE_OK) {
            std::cerr << "Erro: " << curl_easy_strerror(res) << std::endl;
        }

        // Limpar recursos
        curl_easy_cleanup(curl);
    }
    return 0;
}`,
      },
    },
  },
  php: {
    name: "PHP",
    category: "Frontend/Scripting",
    snippets: {
      hello: {
        title: "Hello World",
        code: `<?php
// Programa Hello World em PHP
echo "Hello, World!\\n";
?>`,
      },
      loops: {
        title: "Variáveis & Loops",
        code: `<?php
$service = "Scheduler";
$loops = 5;

echo "Serviço ativo: " . $service . "\\n";

for ($i = 0; $i < $loops; $i++) {
    echo "Ciclo cron ativo: " . $i . "\\n";
}
?>`,
      },
      datastructures: {
        title: "Estruturas de Dados",
        code: `<?php
// Array associativo (Map/Dicionário)
$user = [
    "id" => 404,
    "username" => "suporte_dev",
    "verified" => false
];

// Array de lista indexada
$frameworks = ["Laravel", "Symfony", "Yii"];

foreach ($frameworks as $index => $fw) {
    echo "Fw #{$index}: {$fw}\\n";
}
?>`,
      },
      functions: {
        title: "Funções / Métodos",
        code: `<?php
// Função tradicional com tipagem de argumentos opcional
function formatUserName(string $first, string $last): string {
    return ucwords(strtolower($first . " " . $last));
}

echo formatUserName("SAMUEL", "barbosa");
?>`,
      },
      http: {
        title: "Requisição HTTP",
        code: `<?php
// Requisição simples de API usando file_get_contents e Stream Context (User-Agent)
$url = "https://api.github.com/users/github";

$options = [
    "http" => [
        "header" => "User-Agent: PHP-Script\\r\\n"
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === false) {
    echo "Erro ao obter os dados.";
} else {
    $data = json_decode($response, true);
    echo "Organização: " . $data["name"];
}
?>`,
      },
    },
  },
  bash: {
    name: "Bash / Shell",
    category: "Frontend/Scripting",
    snippets: {
      hello: {
        title: "Hello World",
        code: `#!/bin/bash
# Imprime string com quebra de linha
echo "Hello, World!"`,
      },
      loops: {
        title: "Variáveis & Loops",
        code: `#!/bin/bash
# Sem espaços ao redor do sinal '='
SERVICE_NAME="Backup Engine"
RUN_COUNT=5

echo "Iniciando $SERVICE_NAME..."

for ((i=1; i<=RUN_COUNT; i++))
do
    echo "Processando etapa $i de $RUN_COUNT..."
done`,
      },
      datastructures: {
        title: "Estruturas de Dados",
        code: `#!/bin/bash
# Declarando um Array simples
servers=("192.168.1.1" "192.168.1.2" "192.168.1.3")

# Adicionando elemento
servers+=("10.0.0.1")

# Iterando sobre o array
for ip in "\${servers[@]}"
do
    echo "Pingando servidor em: $ip"
done`,
      },
      functions: {
        title: "Funções / Métodos",
        code: `#!/bin/bash

# Definição da função
check_status() {
    local endpoint=$1
    echo "Verificando saúde de: $endpoint"
    # Simula status code
    return 0
}

# Invocação passando argumento posicional
check_status "https://nextools.com.br"
if [ $? -eq 0 ]; then
    echo "Sistema operacional e saudável!"
fi`,
      },
      http: {
        title: "Requisição HTTP",
        code: `#!/bin/bash
# Utilizando o comando curl
URL="https://api.github.com/users/github"

# Faz requisição silenciosa (-s) e extrai o nome com jq (se instalado)
response=$(curl -s -H "User-Agent: Bash-Script" "$URL")
name=$(echo "$response" | grep -o '"name": "[^"]*' | grep -o '[^"]*$')

echo "Nome do perfil GitHub: $name"`,
      },
    },
  },
  sql: {
    name: "SQL",
    category: "Dados/Outros",
    snippets: {
      hello: {
        title: "Hello World",
        code: `-- Simples retorno de string literal em SQL
SELECT 'Hello, World!' AS greeting;`,
      },
      loops: {
        title: "Variáveis & Loops",
        code: `-- Declaração de variável e controle de fluxo no SQL Server (T-SQL)
DECLARE @Counter INT = 1;

WHILE @Counter <= 5
BEGIN
    PRINT 'Processando iteração: ' + CAST(@Counter AS VARCHAR);
    SET @Counter = @Counter + 1;
END;`,
      },
      datastructures: {
        title: "Estruturas de Dados",
        code: `-- Criação de tabela relacional básica (DDL)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserção de dados de testes
INSERT INTO users (name, email)
VALUES ('Samuel', 'samuel@nextools.dev');`,
      },
      functions: {
        title: "Funções / Métodos",
        code: `-- Função escalar simples no PostgreSQL (PL/pgSQL)
CREATE OR REPLACE FUNCTION get_user_role(user_id INT)
RETURNS VARCHAR AS $$
DECLARE
    role_name VARCHAR;
BEGIN
    SELECT role INTO role_name FROM user_permissions WHERE id = user_id;
    RETURN COALESCE(role_name, 'Guest');
END;
$$ LANGUAGE plpgsql;`,
      },
      http: {
        title: "Requisição HTTP",
        code: `-- Consultando registros organizados e agregados
SELECT 
    category,
    COUNT(*) as total_items,
    AVG(price) as average_price
FROM products
WHERE active = true
GROUP BY category
HAVING COUNT(*) > 2
ORDER BY average_price DESC;`,
      },
    },
  },
}

export function HelloWorldGenerator() {
  const [selectedLang, setSelectedLang] = useState<string>("javascript")
  const [selectedSnippet, setSelectedSnippet] = useState<string>("hello")
  const [copied, setCopied] = useState<boolean>(false)

  const langData = LANGUAGES[selectedLang] || LANGUAGES.javascript
  const currentSnippet = langData.snippets[selectedSnippet] || langData.snippets.hello

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentSnippet.code)
    setCopied(true)
    toast.success("Código copiado para a área de transferência!")
    setTimeout(() => setCopied(false), 2000)
  }

  // Safe tokenizer to prevent HTML class replacements breaking syntax highlighting
  const tokenizeLine = (line: string) => {
    let comment = ""
    let codePart = line

    // Identify single-line comments
    const doubleSlash = line.indexOf("//")
    const hashSign = line.indexOf("#")
    const doubleDash = line.indexOf("--")

    let commentIndex = -1
    if (doubleSlash !== -1) commentIndex = doubleSlash
    if (hashSign !== -1 && (commentIndex === -1 || hashSign < commentIndex)) commentIndex = hashSign
    if (doubleDash !== -1 && (commentIndex === -1 || doubleDash < commentIndex)) commentIndex = doubleDash

    if (commentIndex !== -1) {
      codePart = line.substring(0, commentIndex)
      comment = line.substring(commentIndex)
    }

    // Tokenize strings, numbers, words, spaces, symbols
    const tokenRegex = /("[^"]*"|'[^']*'|`[^`]*`|\b\d+(?:\.\d+)?\b|[a-zA-Z_]\w*|[^\s\w\d"'\`]+|\s+)/g
    const tokens: { text: string; type: string }[] = []

    const keywords = [
      "const", "let", "var", "function", "return", "import", "from", "export", "class", "extends",
      "def", "as", "if", "else", "for", "while", "in", "package", "public", "private", "static",
      "void", "fn", "mut", "use", "pub", "struct", "impl", "func", "nil", "err", "SELECT", "FROM",
      "WHERE", "ORDER", "BY", "LIMIT", "INSERT", "INTO", "VALUES", "type", "interface", "async", "await",
      "try", "catch", "throw", "new", "using", "namespace", "include"
    ]

    let match
    while ((match = tokenRegex.exec(codePart)) !== null) {
      const text = match[0]
      if (text.startsWith('"') || text.startsWith("'") || text.startsWith("`")) {
        tokens.push({ text, type: "string" })
      } else if (/^\d+(?:\.\d+)?$/.test(text)) {
        tokens.push({ text, type: "number" })
      } else if (/^[a-zA-Z_]\w*$/.test(text)) {
        if (keywords.includes(text)) {
          tokens.push({ text, type: "keyword" })
        } else {
          tokens.push({ text, type: "identifier" })
        }
      } else {
        tokens.push({ text, type: "default" })
      }
    }

    if (comment) {
      tokens.push({ text: comment, type: "comment" })
    }

    return tokens
  }

  const highlightCode = (code: string) => {
    const lines = code.split("\n")
    return lines.map((line, idx) => {
      const tokens = tokenizeLine(line)
      return (
        <div key={idx} className="table-row">
          <span className="table-cell text-right pr-4 select-none opacity-30 text-xs text-muted-foreground w-8">
            {idx + 1}
          </span>
          <span className="table-cell whitespace-pre font-mono text-sm leading-relaxed">
            {tokens.length === 0 ? " " : tokens.map((token, tIdx) => {
              let className = ""
              if (token.type === "keyword") className = "text-pink-500 font-semibold"
              else if (token.type === "string") className = "text-emerald-400 font-medium"
              else if (token.type === "number") className = "text-amber-400 font-medium"
              else if (token.type === "comment") className = "text-slate-500 font-normal italic"

              return (
                <span key={tIdx} className={className}>
                  {token.text}
                </span>
              )
            })}
          </span>
        </div>
      )
    })
  }

  return (
    <ToolWrapper
      id="exemplos-hello-world"
      title="Exemplos de Código (Hello World)"
      description="Veja e copie sintaxes básicas, loops, tipos de dados e requisições HTTP em diversas linguagens."
      icon={FileCode}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Painel Esquerdo: Seleção */}
        <div className="md:col-span-1 space-y-4">
          <Card className="border-primary/20">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lang-select">Linguagem</Label>
                <Select value={selectedLang} onValueChange={(val) => setSelectedLang(val)}>
                  <SelectTrigger id="lang-select">
                    <SelectValue placeholder="Selecione a linguagem" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Agrupamento por Categoria */}
                    <div className="text-xs font-semibold text-muted-foreground px-2 py-1 bg-muted/30 select-none">
                      Frontend / Scripting
                    </div>
                    {Object.keys(LANGUAGES)
                      .filter((key) => LANGUAGES[key].category === "Frontend/Scripting")
                      .map((key) => (
                        <SelectItem key={key} value={key}>
                          {LANGUAGES[key].name}
                        </SelectItem>
                      ))}

                    <div className="text-xs font-semibold text-muted-foreground px-2 py-1 bg-muted/30 mt-2 select-none">
                      Backend / Sistemas
                    </div>
                    {Object.keys(LANGUAGES)
                      .filter((key) => LANGUAGES[key].category === "Backend/Sistemas")
                      .map((key) => (
                        <SelectItem key={key} value={key}>
                          {LANGUAGES[key].name}
                        </SelectItem>
                      ))}

                    <div className="text-xs font-semibold text-muted-foreground px-2 py-1 bg-muted/30 mt-2 select-none">
                      Dados / Outros
                    </div>
                    {Object.keys(LANGUAGES)
                      .filter((key) => LANGUAGES[key].category === "Dados/Outros")
                      .map((key) => (
                        <SelectItem key={key} value={key}>
                          {LANGUAGES[key].name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Snippet</Label>
                <div className="flex flex-col gap-2">
                  {Object.keys(langData.snippets).map((key) => {
                    const isSelected = selectedSnippet === key
                    return (
                      <Button
                        key={key}
                        variant={isSelected ? "default" : "outline"}
                        className="justify-start text-left font-medium"
                        onClick={() => setSelectedSnippet(key)}
                      >
                        {langData.snippets[key].title}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Direito: Código */}
        <div className="md:col-span-2 flex flex-col">
          <Card className="border-primary/20 flex-1 flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary uppercase">
                  {langData.name}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  • {currentSnippet.title}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-3"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
            <CardContent className="p-4 flex-1 overflow-auto bg-muted/20 font-mono text-sm">
              <div className="table w-full">
                {highlightCode(currentSnippet.code)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolWrapper>
  )
}

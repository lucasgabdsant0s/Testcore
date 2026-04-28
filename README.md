<div align="center">
  <h1>🚀 Testcore</h1>
  <p><strong>Plataforma Avançada de Testes E2E e Monitoramento Contínuo</strong></p>
</div>

<br />

## 📖 Sobre o Projeto

O **Testcore** é uma plataforma full-stack que permite a criação, execução e monitoramento automatizado de cenários de teste End-to-End (E2E) de forma visual. Através de um construtor de testes inspirado em *scratch* (arrastar e soltar), usuários podem definir fluxos complexos de navegação sem a necessidade de escrever código extensivo. O sistema conta com um motor de automação impulsionado pelo **Playwright**, responsável por traduzir esses cenários visuais em ações reais de browser, permitindo tanto testes sob demanda quanto monitoramento em background de infraestruturas.

---

## 🛠️ Tecnologias e Stacks

A arquitetura do projeto foi desenhada visando alta reatividade, performance e extensibilidade.

### Frontend
- **Framework:** React 19 com Vite para compilação rápida HMR.
- **Estilização:** Tailwind CSS v4 + Radix UI (Componentes acessíveis e sem estilo base) utilizando a abstração do `shadcn/ui`.
- **Gerenciamento de Estado:** Zustand (para controle global de sessões e dados complexos) e Hooks customizados.
- **Construtor Visual (Drag & Drop):** `@dnd-kit/core` com modificadores e "sortable" para estruturação fluida de blocos de testes.
- **Data Visualization:** Recharts para gráficos em tempo real no dashboard de monitoramento.
- **Comunicação Real-Time:** `socket.io-client` para feedback instantâneo da execução de testes.

### Backend
- **Core:** Node.js com Express e TypeScript.
- **Banco de Dados (ORM):** Prisma ORM integrado ao MySQL (`@prisma/client` v6).
- **Engine de Automação:** Playwright (Chromium headless) acoplado a um `ScenarioExecutor` responsável pelo parse do JSON de blocos visuais.
- **Jobs & Monitoramento:** `setInterval` customizado para dispatch de jobs de monitoramento contínuo salvando logs de saúde (`IMonitorLogRepository`).
- **Autenticação e Segurança:** JWT, bcrypt, e validação de tokens via middlewares robustos.

---

## 🏗️ Como Funciona a Arquitetura (Fluxo de Execução)

O Testcore divide-se essencialmente em três camadas operacionais: **Definição de Cenário**, **Execução (Engine)** e **Monitoramento**.

1. **Definição de Cenário (Construtor Visual):** 
   O usuário interage com o painel utilizando `dnd-kit` para empilhar blocos lógicos como `goto`, `click`, `wait`, `screenshot`, etc. Isso gera uma AST (Abstract Syntax Tree) em formato JSON.
   
2. **Execução Engine (Playwright):** 
   O Backend recebe esse JSON e repassa para o `ScenarioExecutor`. Este módulo iterage sobre os blocos, traduzindo comandos visuais em chamadas da API do Playwright, manipulando contextos isolados (`browser.newContext`).
   
3. **Monitoramento e Logs:** 
   O `PlaywrightMonitoringService` engloba um gerenciador em memória de workers ativos. A cada intervalo configurado, o serviço executa o cenário E2E contra uma URL específica. Ele coleta métricas de latência (`responseTimeMs`), logs de status e eventuais capturas de dados (como números de telefone gerados), salvando via Prisma.

### 🌳 Decision Tree do Fluxo de Monitoramento

Abaixo está a modelagem do fluxo de decisão da Engine do Testcore.

```mermaid
graph TD
    A([Início do Job de Monitoramento]) --> B{Existe um Teste associado ao Site?}
    
    B -- Sim --> C[Buscar JSON AST do Teste no BD]
    B -- Não --> D[Modo Verificação Simples HTTP/Navegação]
    
    C --> E[Instanciar Headless Chromium via Playwright]
    D --> E
    
    E --> F[ScenarioExecutor recebe o Contexto]
    
    F --> G{Tem Blocos Visuais a processar?}
    
    G -- Sim --> H[Extrair próximo bloco]
    H --> I{Qual a ação?}
    
    I -- goto --> J[Navega para URL]
    I -- click --> K[Busca Seletor e Clica]
    I -- wait --> L[Aguardar Timeout ou Elemento]
    I -- input --> M[Preencher Seletor com Dados]
    
    J --> N[Sucesso?]
    K --> N
    L --> N
    M --> N
    
    N -- Sim --> G
    N -- Não --> O[Lança Erro / Timeout Exception]
    
    G -- Não --> P[Teste E2E Completo]
    
    P --> Q["Registrar Métricas (Latência, Status: UP)"]
    O --> R["Registrar Falha (Erro, Status: DOWN)"]
    
    Q --> S([Salvar MonitorLog no Banco e Atualizar Dashboard])
    R --> S
```

---

## ⚙️ Funcionalidades Principais

- **Visual Test Builder:** Criação intuitiva e granular de testes funcionais.
- **Execution Feedback:** Visualização em tempo real das etapas sendo executadas.
- **Monitoring Dashboard:** Painel centralizado mostrando sites online/offline, uptime em %, e gráficos baseados nos testes automatizados.
- **Security:** Cada teste opera em uma sandbox contextualizada do Playwright, garantindo isolamento de cache e cookies.
- **Gestão de Artefatos:** Coleta de screenshots e dados mockados/gerados dinamicamente durante a execução da árvore de decisões.

---

## 🚀 Como Iniciar (Setup Dev)

### 1. Clonar e Instalar
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Variáveis de Ambiente
Configure seu `.env` na raiz do `/backend`:
```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/testcore"
JWT_SECRET="sua-chave-segura"
```

### 3. Banco de Dados e Prisma
```bash
cd backend
npx prisma db push
npx prisma generate
```

### 4. Executar a Aplicação
Abra dois terminais:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

O dashboard estará disponível em `http://localhost:5173`.

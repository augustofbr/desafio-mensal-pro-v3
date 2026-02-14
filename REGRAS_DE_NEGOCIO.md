# Regras de Negócio - Profissional Destaque do Mês (Studio X)

> Documento de referência completo para LLMs e desenvolvedores. Contém TODAS as regras de negócio que fazem o sistema funcionar de ponta a ponta.

---

## 1. Visão Geral do Sistema

**Propósito:** Dashboard de performance para profissionais do salão Studio X. Rastreia e exibe métricas de desempenho mensais, gerando rankings automáticos por categoria de serviço.

**Fonte de dados:** Tabela `trinks_services` no Supabase (PostgreSQL), alimentada por dados do sistema Trinks (sistema de gestão do salão).

**Stack:** React 18 + TypeScript + Vite + Supabase + Tailwind CSS + shadcn/ui + Recharts

---

## 2. Categorias de Serviço

O sistema trabalha com **3 categorias** de serviço. Os valores abaixo são **exatamente** os armazenados na coluna `category` da tabela `trinks_services`:

| Valor no Banco de Dados | Nome de Exibição | Status |
|---|---|---|
| `"Tratamentos para Cabelo"` | `"Cabelo"` | **HABILITADA** |
| `"Manicure e Pedicure"` | `"Manicure e Pedicure"` | **HABILITADA** |
| `"Serviços de estética facial."` | `"Estética"` | **DESABILITADA** |

**Arquivo:** `src/lib/categoryDisplayNames.ts`

### Regras de habilitação
- Categorias habilitadas são renderizadas no dashboard (rankings + gráficos)
- Categorias desabilitadas NÃO são exibidas, mas o código de processamento permanece funcional
- Para reabilitar Estética: alterar `ENABLED_CATEGORIES["Serviços de estética facial."]` para `true`
- Categorias não mapeadas são habilitadas por padrão (`?? true`)

### Filtragem de categoria para Estética (caso especial)
A categoria Estética usa filtragem **flexível** (case-insensitive com `includes`), diferente das outras que usam correspondência exata:
```
service.category.toLowerCase().includes('depilação') ||
service.category.toLowerCase().includes('estética corporal') ||
service.category.toLowerCase().includes('estética facial') ||
service.category.toLowerCase().includes('sobrancelha')
```

As categorias Cabelo e Manicure usam correspondência **exata**:
```
service.category === "Tratamentos para Cabelo"
service.category === "Manicure e Pedicure"
```

### Mapeamento de tipos de serviço para display
- `"Outros serviços"` / `"Outros Serviços"` → exibido como `"Tratamentos"` (usado em gráficos de distribuição)

---

## 3. Sistema de Pontuação

### 3.1 Cabelo (Tratamentos para Cabelo)

**Arquivo:** `src/hooks/useHairTreatmentData.ts`

| Tipo de Serviço | Pontos | Regra de Detecção |
|---|---|---|
| Cronograma Capilar (pacote) | **5 pontos** | `service_name` contém `"Cronograma Capilar"` **E** contém `"pacote"` (case-sensitive) |
| Qualquer outro tratamento capilar | **1 ponto** | Todos os demais serviços da categoria |

**Exemplo de cálculo:**
- Profissional A fez 3 "Cronograma Capilar [pacote]" + 10 outros tratamentos = (3×5) + (10×1) = **25 pontos**

### 3.2 Manicure e Pedicure

**Arquivo:** `src/hooks/useManicurePedicureData.ts`

A pontuação é composta por **duas regras independentes** que se somam:

| Regra | Pontos | Detecção |
|---|---|---|
| **Regra 1:** SPA dos Pés | **1,5 pontos** por serviço | `service_name === "SPA dos Pés"` (correspondência exata, case-sensitive) |
| **Regra 2:** Cliente única por dia | **1 ponto** por combinação única | Combinação `clientName.trim() + "-" + serviceDate` nunca vista antes para aquele profissional |

**Detalhes da Regra 2 (clientes únicos por dia):**
- Usa `Set` para rastrear combinações `"NomeCliente-YYYY-MM-DD"` já contadas
- Mesma cliente no mesmo dia = contada **1 vez** apenas
- Mesma cliente em dias diferentes = contada **novamente** (1 ponto por dia)
- Clientes com `client_name` nulo, vazio ou apenas espaços = **NÃO contados**
- O `trim()` é aplicado no nome da cliente antes da comparação

**Exemplo de cálculo:**
- Profissional B: 3 SPA dos Pés + 8 clientes únicas em dias diferentes = (3×1,5) + (8×1) = **12,5 pontos**

### 3.3 Estética (Serviços de estética facial)

**Arquivo:** `src/hooks/useEsteticaData.ts`

Mesma estrutura de duas regras da Manicure:

| Regra | Pontos | Detecção |
|---|---|---|
| **Regra 1:** Sobrancelha (Design*) | **1,5 pontos** por serviço | `service_name.toLowerCase().startsWith("design")` (case-insensitive, prefixo) |
| **Regra 2:** Cliente única por dia | **1 ponto** por combinação única | Mesma lógica da Manicure (Set + clientName+date) |

**Nota:** A detecção de sobrancelha captura qualquer serviço cujo nome comece com "design" (case-insensitive), como "Design Sobrancelhas", "Design de Sobrancelhas", etc.

---

## 4. Profissionais Inativos (Exclusão)

**Arquivo:** `src/lib/constants.ts`

### Lista de profissionais inativos (hardcoded)
```
Andressa, Andrei, Paula, Karol, Lulu, Lucas, Luana, Najla, Claudia, Angi, Débora, Diane, Betina, Cardoso
```

### Critérios de exclusão (função `isInactiveProfessional`)
Um profissional é considerado inativo se **qualquer** condição for verdadeira:
1. Nome está na lista `INACTIVE_PROFESSIONALS` (correspondência exata)
2. Nome começa com `"Inativo:"` (prefixo)
3. Nome começa com `"ID:"` (prefixo)
4. Nome é vazio, `null` ou `undefined`

### Onde a exclusão é aplicada
- Em **todos** os hooks de processamento de dados (Hair, Manicure, Estética)
- Aplicada **durante** o processamento no lado do cliente (não no banco de dados)
- Profissionais inativos simplesmente não aparecem nos rankings

---

## 5. Sistema de Filtragem de Datas

**Arquivo:** `src/contexts/DateFilterContext.tsx`

### Tipos de filtro disponíveis
| Tipo | Comportamento | Padrão |
|---|---|---|
| `'current-month'` | 1º dia até último dia do mês atual | **SIM (default)** |
| `'previous-month'` | 1º dia até último dia do mês anterior | Não |
| `'custom'` | Intervalo personalizado definido pelo usuário | Não |

### Cálculo dos intervalos
```
current-month:  new Date(ano, mes, 1)       → new Date(ano, mes+1, 0)
previous-month: new Date(ano, mes-1, 1)     → new Date(ano, mes, 0)
custom:         startDate e endDate manuais
```

Formato de saída: sempre `YYYY-MM-DD` (via `toISOString().split('T')[0]`)

### Mecanismo de filtragem
**Arquivo:** `src/lib/dateUtils.ts`

```typescript
filterDataByDateRange(data, dateRange):
  - Para cada serviço: converte service_date para YYYY-MM-DD
  - Comparação por string: serviceDate >= startDate && serviceDate <= endDate
  - Intervalo INCLUSIVO em ambas as pontas
  - Serviços sem service_date ou com tipo não-string são excluídos
```

### Fluxo de aplicação
1. `DateFilterContext` fornece o intervalo global
2. Todos os hooks de dados chamam `getFilteredDateRange()` do contexto
3. Dados são filtrados via `filterDataByDateRange()` antes do processamento
4. Nenhum componente passa datas diretamente — sempre via contexto

---

## 6. Pipeline de Dados

### 6.1 Fluxo completo de dados (ponta a ponta)

```
[Supabase: trinks_services] → useServicesData (busca TODOS os registros)
       ↓
[DateFilterContext] → filtra por intervalo de datas
       ↓
  ├→ useHairTreatmentData
  │    ├→ Filtra: category === "Tratamentos para Cabelo"
  │    ├→ Remove profissionais inativos
  │    ├→ Calcula pontos (5pts pacote / 1pt outros)
  │    └→ Ordena por pontos (decrescente)
  │
  ├→ useManicurePedicureData
  │    ├→ Filtra: category === "Manicure e Pedicure"
  │    ├→ Remove profissionais inativos
  │    ├→ Calcula pontos (1.5pts SPA + 1pt cliente-dia único)
  │    └→ Ordena por pontos (decrescente)
  │
  └→ useEsteticaData
       ├→ Filtra: categorias flexíveis (depilação, estética, sobrancelha)
       ├→ Remove profissionais inativos
       ├→ Calcula pontos (1.5pts Design* + 1pt cliente-dia único)
       └→ Ordena por pontos (decrescente)

useDashboardData (orquestrador)
  ├→ Combina hairData + manicureData + esteticaData
  ├→ Gerencia loading combinado
  ├→ Fornece refreshData para atualização manual
  └→ Gerencia seleção de profissional para modal de detalhes

useProfessionalDetails (sob demanda, ao clicar em profissional)
  ├→ Busca TODOS os serviços do profissional selecionado
  ├→ Aplica filtro de datas e categoria
  ├→ Aplica as MESMAS regras de pontuação da categoria
  └→ Retorna breakdown detalhado
```

### 6.2 Busca de dados (useServicesData)

**Arquivo:** `src/hooks/useServicesData.ts`

- **Tabela:** `trinks_services`
- **Query 1:** Busca `created_at` mais recente (para exibir "última atualização")
- **Query 2:** Busca TODOS os registros (`select('*')`) sem filtro de data
- **Ordenação do lastUpdate:** `created_at` DESC, LIMIT 1
- **lastServiceDate:** Encontra a `service_date` mais recente entre todos os registros
- A filtragem por data é feita **no cliente**, não no banco

### 6.3 Detalhes do profissional (useProfessionalDetails)

**Arquivo:** `src/hooks/useProfessionalDetails.ts`

- Busca todos serviços onde `professional === selectedProfessional`
- Aplica filtro de datas do contexto
- Aplica filtro de categoria:
  - Cabelo: `category === "Tratamentos para Cabelo"` (exato)
  - Manicure: `category === "Manicure e Pedicure"` (exato)
  - Estética: filtragem flexível (mesma do hook principal)
- Aplica **exatamente** as mesmas regras de pontuação de cada categoria
- Retorna: lista de serviços agrupados, rawServices (para gráfico), totalPoints, summary

---

## 7. Ranking e Ordenação

### Regras de ranking
- Profissionais são ordenados por **pontos totais** em ordem **decrescente** (`b.points - a.points`)
- Em caso de **empate**, a ordem é determinada pela inserção (stable sort)
- Posições exibidas como ordinais: "1º", "2º", "3º"...

### Destaque visual
- **1º lugar** (índice 0): fundo verde (`bg-green-100`, `hover:bg-green-200`)
- **Demais posições**: hover cinza padrão (`hover:bg-gray-100`)
- Todos os itens têm cursor pointer (clicáveis)

### Estado vazio
- Quando não há profissionais com pontuação: `"Nenhum profissional com pontuação nesta categoria no mês de [Nome do Mês]."`
- Nome do mês em português (Janeiro, Fevereiro, etc.)

---

## 8. Progresso do Mês (Dias Úteis)

**Arquivo:** `src/hooks/useMonthProgress.ts` + `src/lib/workingDaysConfig.ts`

### Configuração de dias úteis
- **Todos os 7 dias da semana** são considerados úteis (Domingo a Sábado)
- **Feriados configurados** (excluídos da contagem):
  - `"2025-12-25"` — Natal
  - `"2026-01-01"` — Ano Novo

### Cálculos
| Métrica | Fórmula |
|---|---|
| **Dias trabalhados** | Do 1º dia do mês até **ontem** (hoje NÃO conta) |
| **Dias restantes** | De **amanhã** até o último dia do mês (hoje NÃO conta) |
| **Total de dias úteis** | Do 1º ao último dia do mês |

### Atualização automática
- Recalcula à meia-noite via `setTimeout` para o próximo dia
- Após primeira recalculação, configura `setInterval` de 24h
- Sempre calcula para o **mês atual**, independente do filtro de data selecionado

---

## 9. Gráficos e Visualizações

### 9.1 Gráfico de Evolução (Linha)

- **Dados:** Pontos acumulados ao longo dos dias do período
- **Eixo X:** Números dos dias (ex: 1, 2, 3...)
- **Eixo Y:** Pontos acumulados (running total)
- **Linhas:** Uma por profissional selecionado
- **Seleção:** Toggle individual por profissional + "Selecionar Todos" / "Limpar Todos"
- **Estado inicial:** Todos os profissionais selecionados
- **Não mostra datas futuras** — limitado até hoje ou fim do período filtrado
- **Paleta de 10 cores** em rotação baseada no índice do profissional

### 9.2 Gráfico de Comparação (Barras)

- **Dados:** Compara pontuação entre categorias Cabelo vs Manicure
- **Eixo X:** Nomes dos profissionais (de ambas as categorias)
- **Eixo Y:** Pontos
- **Barras azuis:** Pontos de Cabelo (`rgba(53, 162, 235, 0.7)`)
- **Barras rosas:** Pontos de Manicure (`rgba(255, 99, 132, 0.7)`)
- Profissionais sem serviço em uma categoria mostram 0 pontos

### 9.3 Gráfico de Distribuição (Pizza)

- **Dados:** Proporção de pontos de Cronograma Capilar vs outros tratamentos capilares
- **Fatia laranja:** Cronograma Capilar [pacote] (`rgba(255, 159, 64, 0.7)`)
- **Fatia teal:** Outros tratamentos (`rgba(75, 192, 192, 0.7)`)
- Exclusivo para categoria Cabelo

---

## 10. Venda de Cronograma Capilar (Seção Especial)

**Componente:** `CronogramaDataProcessor`

- Filtra serviços onde `service_name ILIKE '%Cronograma Capilar%pacote%'`
- Conta quantidade por profissional
- Ordena por quantidade vendida (decrescente)
- Exibe tabela: Profissional | Quantidade Vendida
- Estado vazio: `"Nenhuma venda de Cronograma Capilar (pacote) registrada neste período."`

---

## 11. Modal de Detalhes do Profissional

Ao clicar em um profissional no ranking, abre modal com:

### Cards de resumo (variam por categoria)

**Cabelo:**
- Card azul: Quantidade + pontos de Cronograma Capilar
- Card verde: Quantidade + pontos de outros tratamentos

**Manicure:**
- Card roxo: Quantidade + pontos de SPA dos Pés
- Card rosa: Quantidade + pontos de clientes únicas

**Estética:**
- Card laranja: Quantidade + pontos de Sobrancelha
- Card teal: Quantidade + pontos de clientes únicas

### Tabela de serviços
- Lista de serviços agrupados por nome
- Colunas: Nome do Serviço | Quantidade | Pontos Totais | Pontos por Serviço
- Ordenada por quantidade (decrescente)
- Apenas serviços que contribuem pontos são exibidos (`pointsPerService > 0`)

### Gráfico de evolução individual
- Mesmo formato do gráfico principal, mas apenas para o profissional selecionado
- Eixo X: dia do mês
- Eixo Y: pontos acumulados

---

## 12. Formatação de Datas

**Arquivo:** `src/lib/utils.ts`

### Formatos utilizados

| Contexto | Formato | Exemplo |
|---|---|---|
| Banco de dados / comparações | `YYYY-MM-DD` | `2026-02-14` |
| Exibição na UI | `DD/MM/YYYY` | `14/02/2026` |
| Timestamp de última atualização | `DD/MM/YYYY às HH:MM` | `14/02/2026 às 15:30` |
| Período de dados | `De DD/MM/YYYY até DD/MM/YYYY` | `De 01/02/2026 até 14/02/2026` |
| Nome do mês | Português completo | `Fevereiro` |
| Mês/Ano | `Mês/Ano` | `Fevereiro/2026` |

### Conversão de formatos (`convertDateFormat`)
- Se contém `-` e 1ª parte tem 4 chars → já é YYYY-MM-DD, retorna como está
- Se contém `/` → converte DD/MM/YYYY para YYYY-MM-DD
- Idempotente (pode ser chamada múltiplas vezes sem erro)

### Nomes de meses em português
```
Janeiro, Fevereiro, Março, Abril, Maio, Junho,
Julho, Agosto, Setembro, Outubro, Novembro, Dezembro
```

---

## 13. Funções Utilitárias de Processamento

### groupByDay(services)
- Agrupa serviços por data
- Soma pontos de cada dia
- Retorna: `{ "YYYY-MM-DD": totalPontos }`

### calculateDailyAccumulated(dailyPoints, allDates?)
- Converte pontos diários em **total acumulado** (running sum)
- Se `allDates` fornecido, inclui dias com 0 pontos (para gráfico contínuo)
- Retorna: `{ "YYYY-MM-DD": pontosCumulativos }`

---

## 14. Banco de Dados (Supabase)

### Tabela: `trinks_services`

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | BIGINT (auto) | PK | Identificador único |
| `service_date` | DATE | NOT NULL | Data do atendimento |
| `professional` | TEXT | NOT NULL | Nome do profissional |
| `service_name` | TEXT | NOT NULL | Nome do serviço/produto |
| `category` | TEXT | NOT NULL | Categoria do serviço |
| `client_name` | TEXT | nullable | Nome da cliente |
| `value` | NUMERIC(10,2) | nullable | Valor monetário do serviço |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp de criação |
| `produto_name` | TEXT | nullable | Nome do produto (se aplicável) |
| `produtoid` | TEXT | nullable | ID do produto no Trinks |
| `profissionalid` | TEXT | nullable | ID do profissional no Trinks |
| `servicoid` | TEXT | nullable | ID do serviço no Trinks |

**Índices:**
- `idx_trinks_services_service_date` em `service_date`
- `idx_trinks_services_professional` em `professional`
- `idx_trinks_services_category` em `category`

**Segurança:** RLS habilitado com políticas públicas para leitura via anon key.

### Tabela: `automation_logs`

| Coluna | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | BIGINT (auto) | PK | Identificador único |
| `message` | TEXT | NOT NULL | Mensagem do log |
| `is_error` | BOOLEAN | DEFAULT FALSE | Flag de erro |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |

**Índice:** `idx_automation_logs_created_at` em `created_at`

### Tabelas auxiliares

- `servicos`: Catálogo de serviços (servicoid, nome, categoria, preco, duracaoemminutos, tipo_preco, visivelparacliente)
- `prof_servicos`: Junção profissional-serviço (profissionalid, servicoid, nome_profissional, nome_servico, apelido)

---

## 15. Edge Function: daily-trinks-automation

**Diretório:** `supabase/functions/daily-trinks-automation/`

### Propósito
Processa e normaliza dados existentes na tabela `trinks_services`.

### Fluxo de execução
1. Recebe request HTTP POST com JWT válido
2. Busca todos registros de `trinks_services`
3. Para cada registro: verifica se `service_date` contém `/` (formato DD/MM/YYYY)
4. Converte para `YYYY-MM-DD` se necessário
5. Atualiza registros via UPDATE (por ID)
6. Loga resultados em `automation_logs`
7. Tenta habilitar realtime (apenas loga intenção, não executa DDL)

### Processamento de CSV
**Arquivo:** `supabase/functions/daily-trinks-automation/csv-processor.ts`

- Separador CSV: `;` (ponto-e-vírgula)
- Busca header com coluna `"Atendimento/Venda"`
- Mapeamento de colunas:
  - `Atendimento/Venda` → `service_date`
  - `Profissional` → `professional`
  - `Serviço/Produto/Pacote` → `service_name`
  - `Categoria` → `category`
  - `Cliente` → `client_name`
  - `Valor` → `value` (converte vírgula decimal para ponto: `"123,45"` → `123.45`)
- Conversão de data: `DD/MM/YYYY` → `YYYY-MM-DD`

### Configuração
- **JWT:** Verificação habilitada (`verify_jwt = true`)
- **CORS:** `Access-Control-Allow-Origin: *` (permite qualquer origem)
- **Runtime:** Deno

---

## 16. Última Atualização

- Exibida como badge verde: `"Última atualização em: DD/MM/YYYY às HH:MM"`
- Fonte: campo `created_at` mais recente da tabela `trinks_services`
- Fallback: `"Nenhuma informação sobre atualização disponível"`

---

## 17. Roteamento

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `Index` | Dashboard principal com rankings, gráficos e cronograma |
| `*` | `NotFound` | Página 404 |

Aplicação SPA (Single Page Application) sem deep linking para profissionais específicos.

---

## 18. Estados de Loading e Erro

### Loading
- Estado global combinado: `servicesLoading || detailsLoading`
- Exibe: `"Carregando dados..."` em todas as seções
- Placeholders de altura: `h-32`, `h-64`, `h-[250px]` conforme o contexto

### Erros
- Toast destrutivo para erros de fetch: `"Erro ao carregar dados"` / `"Não foi possível atualizar os rankings e gráficos."`
- Toast destrutivo para erros de detalhes: `"Erro ao carregar detalhes"` / `"Não foi possível recuperar informações do profissional."`
- Erros no edge function: logados em `automation_logs` com `is_error = true`

### Estados vazios
| Contexto | Mensagem |
|---|---|
| Rankings sem dados | `"Nenhum profissional com pontuação nesta categoria no mês de [Mês]."` |
| Cronograma sem vendas | `"Nenhuma venda de Cronograma Capilar (pacote) registrada neste período."` |
| Gráficos sem dados | `"Nenhum dado disponível para o mês atual"` |
| Sem profissional selecionado | `"Nenhum profissional selecionado"` |

---

## 19. Labels de Regras no Dashboard

Textos explicativos exibidos em cada card de ranking:

- **Cabelo:** `"Ranking baseado em pontuação: Cronograma Capilar (pacote) = 5 pontos, Tratamentos = 1 ponto"`
- **Manicure:** `"Pontuação: SPA dos Pés = 1,5 pontos + 1 ponto por cliente única atendida por dia"`
- **Estética:** `"Pontuação: Sobrancelhas (Design*) = 1,5 pontos + 1 ponto por cliente única atendida por dia"`

---

## 20. Configurações de Ambiente

### Variáveis obrigatórias (frontend)
```
VITE_SUPABASE_URL=https://kxgrprxyqeuffhczaznl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Project ID Supabase
```
kxgrprxyqeuffhczaznl
```

### Portas de desenvolvimento
- Dev server: **8080** (Vite, com IPv6 `host: "::"`)
- Supabase API (local): 54321
- Supabase DB (local): 54322

---

## 21. Estruturas de Dados (Interfaces)

### Dados de ranking por profissional (Hair)
```typescript
{
  professional: string;       // Nome do profissional
  points: number;             // Total de pontos
  services: Array<{
    date: string;             // YYYY-MM-DD
    name: string;             // Nome do serviço
    points: number;           // Pontos deste serviço (1 ou 5)
  }>;
}
```

### Dados de ranking por profissional (Manicure/Estética)
```typescript
{
  professional: string;
  points: number;              // Soma de SPA/Design + clientes
  services: Array<{
    date: string;              // YYYY-MM-DD
    name: string;              // Nome do serviço ou "Cliente: NomeCliente"
    points: number;            // 1 ou 1.5
    type: 'spa' | 'client';   // Manicure: 'spa'|'client'
    // ou type: 'sobrancelha' | 'client' para Estética
    clientName?: string;       // Nome da cliente (quando type='client')
  }>;
  spaServices: number;         // (Manicure) Contagem de SPA dos Pés
  uniqueClientDays: number;    // Contagem de combinações únicas cliente+dia
  // ou sobrancelhaServices para Estética
}
```

### Detalhes do profissional (modal)
```typescript
{
  professional: string;
  services: Array<{            // Serviços agrupados
    name: string;
    count: number;
    points: number;
    pointsPerService: number;
  }>;
  rawServices: Array<{...}>;   // Serviços individuais (para gráfico)
  totalServices: number;
  totalPoints: number;
  category: string;
  summary: {                   // Varia por categoria
    cronogramaCount?: number;
    cronogramaPoints?: number;
    otherHairCount?: number;
    otherHairPoints?: number;
    spaCount?: number;
    spaPoints?: number;
    manicureUniqueClients?: number;
    manicureClientPoints?: number;
    sobrancelhaCount?: number;
    sobrancelhaPoints?: number;
    esteticaUniqueClients?: number;
    esteticaClientPoints?: number;
  };
}
```

### Intervalo de datas
```typescript
{
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
}
```

---

## 22. Observações Importantes para Desenvolvimento

1. **Pontuação duplicada no modal:** O `useProfessionalDetails` reimplementa as mesmas regras de pontuação dos hooks de categoria. Qualquer alteração nas regras de pontuação deve ser feita em **ambos** os lugares.

2. **Filtragem no cliente:** Toda filtragem de data e categoria é feita no frontend. O `useServicesData` busca TODOS os registros do banco, sem filtro.

3. **Case-sensitivity:**
   - Cabelo: `"Cronograma Capilar"` e `"pacote"` são case-sensitive
   - Manicure: `"SPA dos Pés"` é correspondência exata
   - Estética: `"design"` é case-insensitive (`.toLowerCase().startsWith()`)

4. **Estética desabilitada:** O código está funcional mas a UI não renderiza a categoria. Para reativar, basta alterar o flag em `ENABLED_CATEGORIES`.

5. **Dias úteis = todos os dias:** A configuração atual marca todos os 7 dias como úteis (salão funciona todo dia), com exceção dos feriados listados.

6. **Arquivos auto-gerados (NÃO modificar):**
   - `src/components/ui/*` (shadcn/ui)
   - `src/integrations/supabase/*` (tipos e client do Supabase)

7. **Valor monetário:** A coluna `value` existe no banco mas **NÃO é usada** no cálculo de pontuação. A pontuação é baseada em contagem de serviços e clientes.

8. **Sem testes automatizados:** O projeto não possui framework de testes configurado.

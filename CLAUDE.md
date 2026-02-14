# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript dashboard application called "Profissional Destaque do Mês" (Professional of the Month) for Studio X salon. It tracks and displays performance metrics for hair professionals and manicure/pedicure professionals, including sales rankings, charts, and schedule data.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (configured with React SWC for faster compilation)
- **UI Components**: shadcn/ui (Radix UI primitives) - auto-generated, don't modify directly
- **Styling**: Tailwind CSS with custom HSL color system and animations
- **State Management**: React Query (TanStack Query) + Context API
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL with RLS enabled)
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Development Tools**: ESLint, lovable-tagger (component development)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Run linting (ESLint with TypeScript support)
npm run lint

# Preview production build
npm run preview
```

## Development Configuration

### Vite Configuration
- **Dev Server**: Runs on port 8080 with IPv6 support (`host: "::"`)
- **Path Alias**: `@` maps to `./src` directory
- **Plugins**: React SWC for compilation, lovable-tagger in development mode

### Tailwind Configuration
- **Dark Mode**: Class-based dark mode support
- **Custom Theme**: Extensive HSL-based color system with semantic naming
- **Container**: Centered with 2rem padding, max-width 1400px on 2xl screens
- **Animations**: Custom accordion animations for UI components

## Project Architecture

### Core Application Structure

- **Entry Point**: `src/main.tsx` → `src/App.tsx` → `src/pages/Index.tsx`
- **Main Dashboard**: The Index page contains the main dashboard with rankings, charts, and cronograma data
- **Data Flow**: 
  - Custom hooks in `/hooks` fetch data from Supabase using React Query
  - Components use React Query for data fetching and caching
  - Context API manages global date filtering state (DateFilterContext)
  - Real-time updates handled via Supabase subscriptions

### Key Directories

- `/src/components/` - React components organized by feature
  - `/charts/` - Chart components (Evolution, Distribution, Comparison)
  - `/dashboard/` - Dashboard-specific components including data processors
  - `/ui/` - shadcn/ui components (auto-generated, don't modify directly)
- `/src/hooks/` - Custom React hooks for data fetching
- `/src/contexts/` - React contexts (DateFilterContext for global date filtering)
- `/src/integrations/supabase/` - Supabase client and types (auto-generated)
- `/src/lib/` - Utility functions and constants
- `/supabase/` - Supabase configuration and edge functions
  - `/functions/` - Edge functions for automation
  - `/migrations/` - Database schema migrations

### Data Processing Components

The application uses background processor components for data handling:
- **CronogramaDataProcessor**: Processes schedule/timeline data
- **EdgeFunctionProcessor**: Handles edge function interactions
- **RealtimeSubscription**: Manages real-time data updates from Supabase

### Key Custom Hooks

- `useDashboardData`: Main orchestrator hook that combines all data sources
  - Aggregates data from service-specific hooks
  - Manages loading states across all data fetches
  - Handles professional selection and details
  
- `useServicesData`: Core data fetching hook
  - Fetches from `trinks_services` table
  - Applies date filtering from context
  - Returns service data, last update, and refresh function

- `useHairTreatmentData`: Processes hair treatment services
  - Filters services by hair-related categories
  - Calculates professional rankings and totals
  
- `useManicurePedicureData`: Processes manicure/pedicure services
  - Filters services by nail-related categories
  - Calculates professional rankings and totals
  
- `useProfessionalDetails`: Gets detailed professional information
  - Fetches individual professional's service details
  - Supports category-specific filtering

## Supabase Integration

### Database Configuration
- **Project ID**: kxgrprxyqeuffhczaznl
- **URL**: https://kxgrprxyqeuffhczaznl.supabase.co
- **Client**: Auto-generated TypeScript client in `/src/integrations/supabase/`

### Database Schema
- **Tables**: 
  - `trinks_services` - Stores service data from Trinks system
    - `id`: Primary key (BIGINT)
    - `service_date`: Date of service (DATE)
    - `professional`: Professional name (TEXT)
    - `service_name`: Name of service (TEXT)
    - `category`: Service category (TEXT)
    - `client_name`: Client name (TEXT, nullable)
    - `value`: Service value (NUMERIC)
    - `created_at`: Timestamp
    - Indexes on: service_date, professional, category
    
  - `automation_logs` - Logs for automation runs
    - `id`: Primary key (BIGINT)
    - `message`: Log message (TEXT)
    - `is_error`: Error flag (BOOLEAN)
    - `created_at`: Timestamp
    - Index on: created_at

### Edge Functions
- **daily-trinks-automation**: Processes and formats service data
  - Handles date format conversion (DD/MM/YYYY → YYYY-MM-DD)
  - Enables real-time subscriptions
  - Includes CORS headers for browser requests
  - Uses Deno runtime with Supabase client

### Security
- RLS (Row Level Security) enabled on all tables with public policies
- Uses anon key for client-side operations
- Service role key used in edge functions

## Date Filtering System

### DateFilterContext
The application uses a global date filtering context that supports:
- **Filter Types**:
  - `previous-month`: Default, shows last month's data
  - `current-month`: Shows current month's data
  - `custom`: Custom date range selection

### Implementation
- Context provider wraps the entire dashboard
- All data hooks automatically apply the current filter
- Date ranges calculated dynamically based on current date
- Format: YYYY-MM-DD for database queries

## Important Patterns & Conventions

### Component Organization
- **Presentation Components**: In `/components/ui/` (don't modify - auto-generated)
- **Feature Components**: In `/components/` organized by feature
- **Container Components**: Handle data fetching and state management
- **Chart Components**: Receive processed data as props

### Data Flow Pattern
1. `DateFilterContext` provides global date range
2. `useDashboardData` orchestrates all data fetching
3. Service-specific hooks apply filters and transformations
4. Components receive processed data via props
5. Real-time updates trigger automatic re-fetches

### Error Handling
- Basic error boundaries in context providers
- Supabase errors handled in individual hooks
- Loading states managed at hook level

### Performance Optimizations
- React Query caching for data fetching
- Memoized data processing in hooks
- Lazy loading with Vite's code splitting
- Minimal re-renders through proper hook dependencies

## Environment Variables

### Required for Development
```
VITE_SUPABASE_URL=https://kxgrprxyqeuffhczaznl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Edge Function Secrets (Set in Supabase Dashboard)
```
TRINKS_USERNAME=studioxbrasil.adm@gmail.com
TRINKS_PASSWORD=[configured in dashboard]
```

## Testing & Quality

### Code Quality Tools
- **ESLint**: Configured with TypeScript and React rules
- **TypeScript**: Strict mode enabled in tsconfig
- **No test framework**: Currently no unit/integration tests

### Linting Rules
- React hooks rules enforced
- TypeScript ESLint recommended rules
- Unused variables allowed (relaxed rule)

## Deployment

### Lovable Platform
- Automatic deployments from git commits
- Production builds: `npm run build`
- Development builds: `npm run build:dev`
- Preview locally: `npm run preview`

### Build Output
- Static files generated in `/dist`
- Vite handles chunking and optimization
- Assets automatically hashed for caching

## Common Development Tasks

### Adding a New Chart
1. Create component in `/src/components/charts/`
2. Use Recharts components for consistency
3. Accept data as props (no direct Supabase queries)
4. Apply date filtering through parent component

### Adding a New Data Hook
1. Create in `/src/hooks/`
2. Use `useDateFilter` to get current filter
3. Use React Query for fetching
4. Return loading state, data, and error

### Modifying Date Filters
1. Update `DateFilterContext` for new filter types
2. Ensure date format remains YYYY-MM-DD
3. Update UI components in `DateFilter.tsx`

### Working with Supabase
1. Don't modify files in `/src/integrations/supabase/` (auto-generated)
2. Use the typed client: `import { supabase } from "@/integrations/supabase/client"`
3. Check RLS policies if queries fail
4. Use edge functions for server-side operations

## Supabase MCP Server Integration

When working with Supabase operations in this project, **ALWAYS use the Supabase MCP Server** (mcp__supabase__*) tools instead of manual operations or direct client usage. The MCP Server provides authenticated, type-safe access to the Supabase project.

### Key Benefits
- **Authenticated Access**: Automatically handles authentication with project credentials
- **Type Safety**: Provides TypeScript-aware database operations
- **Project Management**: Direct access to project settings, logs, and monitoring
- **Database Operations**: Execute SQL, apply migrations, and manage schema changes
- **Real-time Monitoring**: Access logs, advisors, and project status

### When to Use MCP Server
- **Database Queries**: Use `mcp__supabase__execute_sql` for SELECT, INSERT, UPDATE, DELETE operations
- **Schema Changes**: Use `mcp__supabase__apply_migration` for DDL operations (CREATE, ALTER, DROP)
- **Project Management**: Use `mcp__supabase__get_project`, `mcp__supabase__list_projects` for project info
- **Monitoring**: Use `mcp__supabase__get_logs`, `mcp__supabase__get_advisors` for debugging
- **Development**: Use branch operations for testing schema changes safely

### Project Details
- **Project ID**: kxgrprxyqeuffhczaznl (use this for all MCP operations)
- **Main Tables**: `trinks_services`, `automation_logs`
- **Schema**: Uses `public` schema with RLS enabled

### Example Usage Patterns
```typescript
// Instead of direct supabase client usage:
// const { data } = await supabase.from('trinks_services').select('*')

// Use MCP Server:
// mcp__supabase__execute_sql with project_id and query
```

### Important Notes
- **Always use project_id**: kxgrprxyqeuffhczaznl for all MCP operations
- **DDL vs DML**: Use `apply_migration` for schema changes, `execute_sql` for data operations
- **Error Handling**: MCP tools provide better error messages and debugging info
- **Real-time Updates**: Check logs via MCP when debugging real-time subscription issues


### When to Use Which Agent

#### 🏗️ Planning & Architecture
- **backend-architect:** API design, database schemas, system architecture
- **frontend-developer:** UI/UX planning, component architecture
- **ui-ux-designer:** Interface design, wireframes, design systems, user research
- **cloud-architect:** Infrastructure design, scalability planning

#### 🔧 Implementation & Development
- **python-pro:** Python-specific development tasks
- **golang-pro:** Go-specific development tasks
- **rust-pro:** Rust-specific development, memory safety, systems programming
- **c-pro:** C programming, embedded systems, performance-critical code
- **javascript-pro:** Modern JavaScript, async patterns, Node.js/browser code
- **typescript-pro:** Advanced TypeScript, generics, type inference, enterprise patterns
- **java-pro:** Modern Java development, streams, concurrency, Spring Boot
- **elixir-pro:** Elixir development, OTP patterns, Phoenix frameworks, functional programming
- **csharp-pro:** Modern C# development, .NET frameworks, enterprise patterns
- **unity-developer:** Unity game development, C# scripting, performance optimization
- **ios-developer:** Native iOS development with Swift/SwiftUI
- **sql-pro:** Database queries, schema design, query optimization
- **mobile-developer:** React Native/Flutter development

#### 🛠️ Operations & Maintenance
- **devops-troubleshooter:** Production issues, deployment problems
- **incident-responder:** Critical outages requiring immediate response
- **database-optimizer:** Query performance, indexing strategies
- **database-admin:** Backup strategies, replication, user management, disaster recovery
- **terraform-specialist:** Infrastructure as Code, Terraform modules, state management
- **network-engineer:** Network connectivity, load balancers, SSL/TLS, DNS debugging

#### 📊 Analysis & Optimization
- **performance-engineer:** Application bottlenecks, optimization
- **security-auditor:** Vulnerability scanning, compliance checks
- **data-scientist:** Data analysis, insights, reporting
- **mlops-engineer:** ML infrastructure, experiment tracking, model registries, pipeline automation

#### 🧪 Quality Assurance
- **code-reviewer:** Code quality, configuration security, production reliability
- **test-automator:** Test strategy, test suite creation
- **debugger:** Bug investigation, error resolution
- **error-detective:** Log analysis, error pattern recognition, root cause analysis
- **search-specialist:** Deep web research, competitive analysis, fact-checking

#### 📚 Documentation
- **api-documenter:** OpenAPI/Swagger specs, API documentation
- **docs-architect:** Comprehensive technical documentation, architecture guides, system manuals
- **reference-builder:** Exhaustive API references, configuration guides, parameter documentation
- **tutorial-engineer:** Step-by-step tutorials, learning paths, educational content

#### 💼 Business & Strategy
- **business-analyst:** KPIs, revenue models, growth projections, investor metrics
- **risk-manager:** Portfolio risk, hedging strategies, R-multiples, position sizing
- **content-marketer:** SEO content, blog posts, social media, email campaigns
- **sales-automator:** Cold emails, follow-ups, proposals, lead nurturing
- **customer-support:** Support tickets, FAQs, help documentation, troubleshooting
- **legal-advisor:** Draft privacy policies, terms of service, disclaimers, and legal notices

# Hypesoft Product Management System

A comprehensive product management system built with **Clean Architecture**, **Domain-Driven Design (DDD)**, and modern technologies. This system demonstrates expertise in **full-stack development**, **microservices architecture**, and **enterprise-grade solutions**.

## 🚀 **Technology Stack**

### **Frontend**
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **TailwindCSS + Shadcn/UI** for modern styling
- **React Query/TanStack Query** for state management
- **React Hook Form + Zod** for form validation
- **Recharts** for data visualization
- **NextAuth.js** for authentication

### **Backend**
- **.NET 9** with C#
- **Clean Architecture + DDD** patterns
- **CQRS + MediatR** for command/query separation
- **Entity Framework Core** with MongoDB provider
- **FluentValidation** for input validation
- **AutoMapper** for object mapping
- **Serilog** for structured logging

### **Infrastructure**
- **MongoDB** as primary database
- **Redis** for caching
- **Keycloak** for authentication/authorization
- **Docker + Docker Compose** for containerization
- **Nginx** as reverse proxy

## 🎯 **Key Features**

### **Product Management**
- ✅ Complete CRUD operations for products
- ✅ Advanced search and filtering capabilities
- ✅ Real-time stock management
- ✅ Bulk operations support
- ✅ Low stock alerts and monitoring

### **Category Management**
- ✅ Category creation and management
- ✅ Product-category associations
- ✅ Category-based filtering and analytics

### **Dashboard & Analytics**
- ✅ Comprehensive dashboard with key metrics
- ✅ Interactive charts and data visualization
- ✅ Stock value calculations
- ✅ Category performance analytics

### **Authentication & Security**
- ✅ Keycloak integration (OAuth2/OpenID Connect)
- ✅ Role-based access control (Admin, Manager, User)
- ✅ JWT token validation
- ✅ Rate limiting and security headers
- ✅ CORS configuration

### **Performance & Scalability**
- ✅ Redis caching for improved performance
- ✅ Efficient pagination for large datasets
- ✅ Database indexing and query optimization
- ✅ Horizontal scaling support

## 🏗️ **Architecture Overview**

### **Backend Architecture (Clean Architecture + DDD)**

```
src/
├── Hypesoft.Domain/              # Domain Layer
│   ├── Entities/                 # Domain entities
│   ├── ValueObjects/             # Value objects
│   ├── DomainEvents/            # Domain events
│   ├── Repositories/            # Repository interfaces
│   └── Services/                # Domain services
├── Hypesoft.Application/         # Application Layer
│   ├── Commands/                # CQRS commands
│   ├── Queries/                 # CQRS queries
│   ├── Handlers/                # MediatR handlers
│   ├── DTOs/                    # Data transfer objects
│   ├── Validators/              # FluentValidation validators
│   └── Interfaces/              # Application interfaces
├── Hypesoft.Infrastructure/      # Infrastructure Layer
│   ├── Data/                    # EF Core context & configurations
│   ├── Repositories/            # Repository implementations
│   ├── Services/                # External services
│   └── Configurations/          # Dependency injection setup
└── Hypesoft.API/                # Presentation Layer
    ├── Controllers/             # API controllers
    ├── Middlewares/             # Custom middlewares
    ├── Filters/                 # Action filters
    └── Extensions/              # Configuration extensions
```

### **Frontend Architecture (Modular Design)**

```
src/
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components (Shadcn/UI)
│   ├── forms/                   # Form components
│   ├── charts/                  # Chart components
│   └── layout/                  # Layout components
├── app/                         # Next.js 14 App Router pages
├── hooks/                       # Custom React hooks
├── services/                    # API service layer
├── stores/                      # Global state stores
├── types/                       # TypeScript type definitions
├── utils/                       # Utility functions
└── lib/                         # Library configurations
```

## 🐳 **Quick Start with Docker**

### **Prerequisites**
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop 4.0+](https://www.docker.com/get-started)
- [Git](https://git-scm.com/)

### **Setup Options**

#### **Option 1: Using Development Scripts (Recommended)**
```bash
# Setup the project
./scripts/dev.sh setup

# Start all services
./scripts/dev.sh start
```

#### **Option 2: Using Makefile**
```bash
# Setup the project
make setup

# Start all services
make start
```

#### **Option 3: Manual Docker Compose**
```bash
# Create environment file
cp .env.example .env

# Start all services
docker-compose up -d
```

### **Development Scripts**

The project includes convenient development scripts for different platforms:

- **Linux/macOS**: `./scripts/dev.sh [command]`
- **Windows (Batch)**: `.\scripts\dev.bat [command]`
- **Windows (PowerShell)**: `.\scripts\dev.ps1 [command]`
- **Make**: `make [target]`

#### **Available Commands**

| Command | Description |
|---------|-------------|
| `setup` | Setup the project for development |
| `start` | Start all services with Docker Compose |
| `stop` | Stop all services |
| `restart` | Restart all services |
| `logs` | Show logs from all services |
| `logs-api` | Show logs from API service only |
| `logs-frontend` | Show logs from frontend service only |
| `status` | Show status of all services |
| `clean` | Clean up Docker containers and volumes |
| `build` | Build all Docker images |
| `test` | Run all tests |
| `test-backend` | Run backend tests |
| `test-frontend` | Run frontend tests |
| `seed` | Seed database with sample data |
| `dev-backend` | Start backend in development mode |
| `dev-frontend` | Start frontend in development mode |
| `install` | Install dependencies for both frontend and backend |

### **VS Code Integration**

Open the project in VS Code using the workspace file:
```bash
code hypesoft-workspace.code-workspace
```

The workspace includes:
- **Multi-root workspace** with separate folders for backend, frontend, infrastructure, and scripts
- **Debugging configurations** for both backend and frontend
- **Tasks** for building, testing, and running services
- **Recommended extensions** for optimal development experience
- **Settings** for consistent code formatting and linting

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/hypesoftlabs/desafio-1.git
cd desafio-1
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env file with your configurations if needed
```

3. **Start all services**
```bash
./scripts/dev.sh start
# or
make start
# or
docker-compose up -d
```

4. **Verify services are running**
```bash
./scripts/dev.sh status
# or
docker-compose ps
```

### **Service URLs**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger Documentation**: http://localhost:5000/swagger
- **MongoDB Express**: http://localhost:8081
- **Keycloak Admin**: http://localhost:8080

### **Default Credentials**

| Service | Username | Password | Role |
|---------|----------|----------|------|
| Keycloak Admin | admin | admin123 | System Admin |
| Application - Admin | admin | admin123 | Admin |
| Application - Manager | manager | manager123 | Manager |
| Application - User | user | user123 | User |
| MongoDB Express | admin | admin | Database Admin |

## 💻 **Local Development**

### **Backend Development**

```bash
cd backend
dotnet restore
dotnet run --project src/Hypesoft.API
```

### **Frontend Development**

```bash
cd frontend
npm install
npm run dev
```

### **Running Tests**

```bash
# Backend tests
cd backend
dotnet test

# Frontend tests
cd frontend
npm test
```

## 📋 **API Documentation**

The API follows RESTful principles and includes comprehensive Swagger documentation available at `/swagger` endpoint.

### **Key Endpoints**

#### **Products**
- `GET /api/products` - Get paginated products with filtering
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `PATCH /api/products/{id}/stock` - Update product stock
- `DELETE /api/products/{id}` - Delete product

#### **Categories**
- `GET /api/categories` - Get all categories
- `GET /api/categories/active` - Get active categories
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

#### **Dashboard**
- `GET /api/dashboard` - Get dashboard analytics data

## 🔒 **Security Features**

- **JWT Authentication** with Keycloak integration
- **Role-based Authorization** (Admin, Manager, User)
- **Rate Limiting** to prevent API abuse
- **CORS** configuration for cross-origin requests
- **Security Headers** (HSTS, CSP, X-Frame-Options, etc.)
- **Input Validation** on multiple layers
- **SQL Injection Prevention** through parameterized queries

## 📊 **Performance Optimizations**

- **Redis Caching** for frequently accessed data
- **Database Indexing** for optimal query performance
- **Efficient Pagination** for large datasets
- **Response Compression** (Gzip)
- **Static Asset Optimization**
- **API Response Time** < 500ms for simple queries

## 🧪 **Testing Strategy**

### **Backend Testing**
- **Unit Tests** for domain logic and business rules
- **Integration Tests** for API endpoints
- **Performance Tests** for critical paths
- **Test Coverage** > 85%

### **Frontend Testing**
- **Component Tests** with React Testing Library
- **E2E Tests** with Playwright/Cypress
- **Visual Regression Tests**

## 📈 **Monitoring & Observability**

- **Structured Logging** with Serilog and correlation IDs
- **Health Checks** for all services
- **Performance Monitoring** with custom metrics
- **Error Tracking** with detailed context
- **Request/Response Logging** for debugging

## 🚀 **Deployment**

The application is designed for containerized deployment with:

- **Multi-stage Docker builds** for optimized images
- **Docker Compose** for local development and testing
- **Kubernetes** ready configurations (optional)
- **CI/CD Pipeline** support
- **Blue-Green Deployment** capabilities

## 📝 **Development Practices**

### **Code Quality**
- **SOLID Principles** consistently applied
- **Clean Code** practices throughout
- **Design Patterns** appropriately implemented
- **Code Reviews** and automated quality checks

### **Git Workflow**
Following **Conventional Commits** specification:

```bash
feat(products): add bulk import functionality
fix(api): resolve pagination issue in products endpoint
docs(readme): update installation instructions
test(products): add unit tests for product service
refactor(auth): improve JWT token validation
perf(database): optimize product search queries
```

## 🎨 **UI/UX Design**

The application follows modern design principles inspired by the **ShopSense Dashboard** reference:
- **Responsive Design** for all screen sizes
- **Consistent Design System** with Shadcn/UI
- **Intuitive Navigation** and user flows
- **Real-time Feedback** for user actions
- **Accessibility** compliance (WCAG 2.1)

## 🌟 **Advanced Features**

### **Implemented**
- ✅ Real-time data updates
- ✅ Advanced filtering and search
- ✅ Bulk operations
- ✅ Export capabilities
- ✅ Audit trails
- ✅ Multi-tenancy support

### **Future Roadmap**
- 🔄 GraphQL API support
- 🔄 WebSocket real-time updates
- 🔄 PDF report generation
- 🔄 Internationalization (i18n)
- 🔄 PWA capabilities
- 🔄 Machine learning recommendations

## 📚 **Learning Resources**

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [CQRS Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Keycloak Documentation](https://www.keycloak.org/documentation)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 **Team**

- **Lead Developer**: [Your Name]
- **Architecture**: Clean Architecture + DDD
- **Frontend**: Next.js 14 + TypeScript
- **Backend**: .NET 9 + MongoDB
- **DevOps**: Docker + Nginx

---

**Built with ❤️ using modern technologies and best practices**
- Cache para consultas frequentes
- Otimização de queries no banco

#### Escalabilidade
- Arquitetura preparada para crescimento horizontal
- Separação clara entre camadas
- Padrões que facilitem manutenção e evolução
- Código limpo e bem estruturado

#### Segurança
- Rate limiting para prevenir abuso
- Validação e sanitização de entradas
- Headers de segurança adequados
- Tratamento seguro de dados sensíveis

#### Disponibilidade
- Health checks implementados
- Tratamento adequado de erros
- Mensagens de erro claras e úteis
- Logs estruturados para monitoramento

#### Usabilidade
- Interface responsiva (desktop e mobile)
- Validação em tempo real nos formulários
- Feedback visual para ações do usuário
- Experiência intuitiva e consistente

## Stack Tecnológica

### Frontend
- **React 18** com TypeScript
- **Vite** ou **Next.js 14** (App Router)
- **TailwindCSS** + **Shadcn/ui** para estilização
- **React Query/TanStack Query** para gerenciamento de estado
- **React Hook Form** + **Zod** para validação
- **Recharts** ou **Chart.js** para dashboards
- **React Testing Library** + **Vitest** para testes

### Backend
- **.NET 9** com C#
- **Clean Architecture** + **DDD** (Domain-Driven Design)
- **CQRS** + **MediatR** pattern
- **Entity Framework Core** com MongoDB provider
- **FluentValidation** para validação
- **AutoMapper** para mapeamento
- **Serilog** para logging estruturado
- **xUnit** + **FluentAssertions** para testes

### Infraestrutura
- **MongoDB** como banco principal
- **Keycloak** para autenticação e autorização
- **Docker** + **Docker Compose** para containerização
- **Nginx** como reverse proxy

## Arquitetura do Sistema

### Backend - Clean Architecture + DDD

```
src/
├── Hypesoft.Domain/              # Camada de Domínio
│   ├── Entities/                 # Entidades do domínio
│   ├── ValueObjects/             # Objetos de valor
│   ├── DomainEvents/            # Eventos de domínio
│   ├── Repositories/            # Interfaces dos repositórios
│   └── Services/                # Serviços de domínio
├── Hypesoft.Application/         # Camada de Aplicação
│   ├── Commands/                # Comandos CQRS
│   ├── Queries/                 # Consultas CQRS
│   ├── Handlers/                # Handlers MediatR
│   ├── DTOs/                    # Data Transfer Objects
│   ├── Validators/              # Validadores FluentValidation
│   └── Interfaces/              # Interfaces da aplicação
├── Hypesoft.Infrastructure/      # Camada de Infraestrutura
│   ├── Data/                    # Contexto e configurações EF
│   ├── Repositories/            # Implementação dos repositórios
│   ├── Services/                # Serviços externos
│   └── Configurations/          # Configurações de DI
└── Hypesoft.API/                # Camada de Apresentação
    ├── Controllers/             # Controllers da API
    ├── Middlewares/             # Middlewares customizados
    ├── Filters/                 # Filtros de ação
    └── Extensions/              # Extensões de configuração
```

### Frontend - Arquitetura Modular

```
src/
├── components/                   # Componentes reutilizáveis
│   ├── ui/                      # Componentes base (shadcn/ui)
│   ├── forms/                   # Componentes de formulário
│   ├── charts/                  # Componentes de gráficos
│   └── layout/                  # Componentes de layout
├── pages/                       # Páginas da aplicação
├── hooks/                       # Custom hooks
├── services/                    # Serviços de API
├── stores/                      # Stores de estado global
├── types/                       # Definições de tipos
├── utils/                       # Funções utilitárias
└── lib/                         # Configurações de bibliotecas
```

## Diferenciais

#### Testes Abrangentes
- Cobertura mínima de 85% no backend
- Testes E2E com Playwright ou Cypress
- Testes de integração para todos os endpoints
- Testes unitários para regras de negócio
- Testes de mutação para validar qualidade

#### Observabilidade Completa
- Logs estruturados com correlationId
- Métricas customizadas para monitoramento
- Health checks detalhados para todos os serviços
- Tratamento adequado de erros com contexto
- Monitoring de performance da aplicação

#### Performance e Otimização
- Server-side rendering (Next.js)
- Code splitting e lazy loading
- Estratégias de caching (Redis + HTTP cache)
- Indexação otimizada do banco de dados
- Otimização de imagens e assets
- Compressão de responses

#### Segurança Avançada
- Integração completa com Keycloak
- Proteção de rotas baseada em roles
- Token JWT validado adequadamente
- CORS configurado adequadamente
- Headers de segurança implementados
- Validação em múltiplas camadas

#### Qualidade de Código
- Princípios SOLID aplicados consistentemente
- Clean Code em todas as camadas
- Padrões de design bem implementados
- Documentação inline adequada
- Tratamento de exceções robusto

#### Documentação Excepcional
- OpenAPI/Swagger com exemplos detalhados
- Documentação de arquitetura (C4 Model)
- ADRs (Architecture Decision Records)
- Guias de instalação e execução completos
- Collection do Postman atualizada

### Pontos Extras (Opcionais)

- **Roles avançadas no Keycloak** (Admin, Manager, User)
- **GraphQL** como alternativa à REST API
- **Real-time updates** via SignalR/WebSockets
- **Exportação de relatórios** em PDF
- **Internacionalização** (i18n) básica
- **PWA** com capacidades offline
- **Docker multi-stage builds** otimizados

## Como Executar

### Pré-requisitos
- Docker Desktop 4.0+
- Node.js 18+
- .NET 9 SDK
- Git

### Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/hypesoft-challenge.git
cd hypesoft-challenge

# Copie as variáveis de ambiente
cp .env.example .env

# Execute toda a aplicação com Docker Compose
docker-compose up -d

# Aguarde alguns segundos para os serviços iniciarem
# Verifique se todos os containers estão rodando
docker-compose ps
```

### URLs de Acesso
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **MongoDB Express**: http://localhost:8081
- **Keycloak**: http://localhost:8080

### Desenvolvimento Local

```bash
# Para desenvolvimento do frontend
cd frontend
npm install
npm run dev

# Para desenvolvimento do backend
cd backend
dotnet restore
dotnet run

# Para executar testes
dotnet test
cd ../frontend
npm test
```

## 🔧 **Development Tools & CI/CD**

### **GitHub Actions Workflows**

The project includes comprehensive CI/CD pipelines:

#### **Main CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
- **Testing**: Automated testing for both backend and frontend
- **Security**: Vulnerability scanning with Trivy
- **Building**: Multi-platform Docker image builds
- **Deployment**: Automated deployment to staging and production
- **Notifications**: Status notifications for deployment results

#### **Security Audit** (`.github/workflows/security.yml`)
- **Dependency Scanning**: Weekly vulnerability checks
- **Code Analysis**: CodeQL security analysis
- **Package Auditing**: NPM and NuGet security audits

### **Development Environment**

#### **VS Code Workspace**
- **Multi-root workspace**: Organized folder structure
- **Debugging**: Configured launch profiles for backend and frontend
- **Tasks**: Pre-configured build and test tasks
- **Extensions**: Recommended extensions for optimal development

#### **Code Quality Tools**
- **EditorConfig**: Consistent code formatting across editors
- **ESLint**: JavaScript/TypeScript code quality
- **Prettier**: Code formatting for frontend
- **Roslyn Analyzers**: .NET code quality and style

#### **Docker Development**
- **Multi-stage builds**: Optimized production images
- **Development containers**: Consistent development environment
- **Health checks**: Monitoring service health
- **Volume mounting**: Live code reloading during development

### **Testing Strategy**

#### **Backend Testing**
- **Unit Tests**: xUnit with Moq for mocking
- **Integration Tests**: In-memory database testing
- **API Tests**: Full HTTP endpoint testing
- **Coverage**: Minimum 80% code coverage requirement

#### **Frontend Testing**
- **Unit Tests**: Jest and React Testing Library
- **Component Tests**: Isolated component testing
- **E2E Tests**: Cypress for end-to-end testing
- **Coverage**: Minimum 70% code coverage requirement

### **Monitoring & Observability**

#### **Logging**
- **Structured Logging**: Serilog with structured output
- **Log Aggregation**: Centralized logging with correlation IDs
- **Performance Metrics**: Request timing and performance monitoring

#### **Health Checks**
- **Service Health**: Health check endpoints for all services
- **Database Health**: MongoDB connection monitoring
- **External Dependencies**: Keycloak and Redis health monitoring

## 🚀 **Deployment**

### **Container Orchestration**
- **Docker Compose**: Local and staging deployment
- **Kubernetes**: Production deployment with Helm charts
- **Docker Swarm**: Alternative orchestration option

### **Environment Configuration**
- **Development**: Local Docker Compose setup
- **Staging**: Automated deployment from develop branch
- **Production**: Automated deployment from main branch

### **Infrastructure as Code**
- **Docker**: Containerized applications
- **Nginx**: Reverse proxy and load balancing
- **MongoDB**: Document database with replication
- **Redis**: Caching and session storage
- **Keycloak**: Identity and access management

## Padrões de Commit

Este projeto utiliza [Conventional Commits](https://conventionalcommits.org/):

```bash
# Exemplos de commits
feat(products): add bulk import functionality
fix(api): resolve pagination issue in products endpoint
docs(readme): update installation instructions
test(products): add unit tests for product service
refactor(auth): improve JWT token validation
perf(database): optimize product search queries
style(frontend): apply consistent spacing in components
chore(deps): update dependencies to latest versions
```

### Tipos de Commit
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção
- `perf`: Melhorias de performance
- `build`: Build e dependências

## Critérios de Avaliação

### Técnico (60%)
- **Arquitetura**: Clean Architecture, DDD, CQRS implementados corretamente
- **Qualidade de Código**: SOLID, Clean Code, padrões consistentes
- **Testes**: Cobertura, qualidade dos testes, cenários bem cobertos
- **Performance**: Otimizações, caching, queries eficientes
- **Segurança**: Implementação adequada de autenticação/autorização

### Funcional (25%)
- **Completude**: Todas as funcionalidades implementadas
- **UX/UI**: Interface intuitiva e responsiva
- **Validações**: Tratamento adequado de erros
- **Regras de Negócio**: Implementação correta dos requisitos

### Profissional (15%)
- **Documentação**: README completo, código bem documentado
- **Git Flow**: Commits organizados, branches bem estruturadas
- **Docker**: Compose funcionando perfeitamente
- **Extras**: Funcionalidades que demonstram expertise avançada

## Entregáveis

### Código Fonte
- Repositório GitHub público
- README detalhado (este arquivo)
- Docker Compose funcional
- Testes automatizados com boa cobertura

### Aplicação Funcionando
- Todos os serviços rodando via Docker Compose
- Banco de dados populado com dados de exemplo
- Interface funcional e responsiva

### Documentação
- API documentada com Swagger
- Guia de instalação e execução
- Documentação das decisões arquiteturais

### Apresentação
- Vídeo de 5-10 minutos demonstrando a aplicação
- Explicação das decisões técnicas tomadas
- Showcase das funcionalidades implementadas
- Demonstração dos diferenciais implementados


---

**Boa sorte e mostre do que você é capaz!**

---

*Este desafio foi criado para identificar desenvolvedores excepcionais que compartilham nossa paixão por tecnologia e excelência técnica. Estamos ansiosos para ver sua solução!*

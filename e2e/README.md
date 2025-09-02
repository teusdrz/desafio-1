# E2E Testing para HyperSense

Este diretório contém os testes end-to-end (E2E) para a aplicação HyperSense usando Playwright.

## 📋 Estrutura

```
e2e/
├── tests/
│   ├── hypersense.spec.ts     # Testes principais da aplicação
│   └── advanced.spec.ts       # Testes avançados (performance, segurança, acessibilidade)
├── playwright.config.ts       # Configuração do Playwright
├── package.json              # Dependências e scripts
└── README.md                 # Esta documentação
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Aplicação frontend rodando em http://localhost:3000
- Aplicação backend rodando em http://localhost:5000

### Instalação
```bash
cd e2e
npm install
npx playwright install
```

### Execução dos Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo headed (com interface gráfica)
npm run test:headed

# Executar testes em modo debug
npm run test:debug

# Executar testes com interface do Playwright
npm run test:ui

# Executar apenas um arquivo de teste
npx playwright test hypersense.spec.ts

# Executar um teste específico
npx playwright test --grep "should login with valid credentials"
```

## 📊 Cobertura de Testes

### Testes Principais (hypersense.spec.ts)

#### 🔐 Autenticação
- ✅ Exibição correta da página de login
- ✅ Login com credenciais válidas
- ✅ Tratamento de credenciais inválidas
- ✅ Seleção de usuário demo

#### 📦 Gerenciamento de Produtos
- ✅ Listagem de produtos
- ✅ Criação de novos produtos
- ✅ Edição de produtos existentes
- ✅ Exclusão de produtos
- ✅ Filtro por busca
- ✅ Alternância entre visualização em grid e lista

#### 🏷️ Gerenciamento de Categorias
- ✅ Listagem de categorias
- ✅ Criação de novas categorias

#### 🧭 Navegação
- ✅ Navegação entre páginas
- ✅ Alternância de tema (dark/light)

#### 📱 Design Responsivo
- ✅ Funcionamento em dispositivos móveis
- ✅ Funcionamento em tablets

### Testes Avançados (advanced.spec.ts)

#### 🔌 Integração com API
- ✅ Conectividade com endpoint de saúde
- ✅ Tratamento de erros da API
- ✅ Estados de carregamento

#### ⚡ Performance
- ✅ Tempo de carregamento aceitável
- ✅ Ausência de erros no console

#### ♿ Acessibilidade
- ✅ Estrutura adequada de cabeçalhos
- ✅ Texto alternativo para imagens
- ✅ Navegação por teclado

#### 🔒 Segurança
- ✅ Proteção contra XSS
- ✅ Autenticação obrigatória para rotas protegidas
- ✅ Verificação de cabeçalhos de segurança

## 🎯 Cenários de Teste

### Usuários Demo
- **Admin**: admin@hypesoft.com / admin123
- **Manager**: manager@hypesoft.com / manager123
- **User**: user@hypesoft.com / user123

### Fluxos Críticos Testados
1. **Login e Autenticação**
2. **CRUD Completo de Produtos**
3. **CRUD Completo de Categorias**
4. **Navegação entre Módulos**
5. **Responsividade**
6. **Performance e Acessibilidade**

## 🛠️ Configuração

### Browsers Suportados
- ✅ Chromium
- ✅ Firefox
- ✅ Safari (WebKit)
- ✅ Mobile Chrome
- ✅ Mobile Safari

### Configurações Especiais
- Screenshots automáticos em falhas
- Vídeos de testes que falharam
- Modo retrace para debugging
- Timeout configurável por teste
- Múltiplos workers para paralelização

## 📈 Relatórios

Os testes geram automaticamente:
- Relatórios HTML detalhados
- Screenshots de falhas
- Vídeos de execução (em falhas)
- Traces para debugging

```bash
# Visualizar relatório após execução
npx playwright show-report
```

## 🎭 Seletores de Teste

Para facilitar a manutenção, use data-testid:

```html
<!-- Bom -->
<button data-testid="add-product-button">Add Product</button>

<!-- Evite -->
<button className="btn btn-primary">Add Product</button>
```

### Convenção de data-testid
- `nav-*`: Elementos de navegação
- `*-button`: Botões de ação
- `*-input`: Campos de entrada
- `*-grid`: Layouts em grid
- `*-list`: Layouts em lista
- `toast-*`: Mensagens de notificação
- `demo-user-*`: Seletores de usuário demo

## 🔧 Debugging

### Modo Debug
```bash
npm run test:debug
```

### Inspector
```bash
npx playwright test --debug
```

### Pausar em Falhas
```bash
npx playwright test --pause-on-failure
```

## 📝 Contribuindo

1. Mantenha os testes independentes
2. Use data-testid para seletores estáveis
3. Inclua cenários positivos e negativos
4. Teste diferentes dispositivos/browsers
5. Mantenha timeouts adequados
6. Documente novos cenários

## 🎨 Diferencial Implementado

Esta suíte de testes E2E representa um dos **20 diferenciais técnicos** do projeto:

> **9. Testes End-to-End (E2E) com Playwright ou Cypress** ✅
> 
> Implementação completa com:
> - Cobertura de fluxos críticos de usuário
> - Testes multi-browser
> - Testes de responsividade
> - Validação de performance
> - Verificação de acessibilidade
> - Testes de segurança
> - Integração contínua
> - Relatórios detalhados

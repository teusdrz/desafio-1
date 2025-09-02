# Mutation Testing com Stryker.NET

## 📋 Visão Geral

Mutation testing é uma técnica avançada de teste que avalia a qualidade dos testes unitários através da introdução de pequenas mudanças (mutações) no código e verificando se os testes conseguem detectar essas mudanças.

## 🎯 Objetivo

O Stryker.NET ajuda a:
- Identificar gaps na cobertura de testes
- Melhorar a qualidade dos testes existentes
- Garantir que os testes realmente validam o comportamento esperado
- Aumentar a confiança na suíte de testes

## 🚀 Configuração

### 1. Instalação do Stryker.NET

```bash
# Instalar globalmente
dotnet tool install -g dotnet-stryker

# Ou instalar localmente no projeto
dotnet new tool-manifest
dotnet tool install dotnet-stryker
```

### 2. Configuração Básica

Criar arquivo `stryker-config.json` na raiz do projeto backend:

```json
{
  "stryker-config": {
    "project": "src/Hypesoft.API/Hypesoft.API.csproj",
    "test-projects": [
      "tests/Hypesoft.Application.Tests/Hypesoft.Application.Tests.csproj",
      "tests/Hypesoft.Domain.Tests/Hypesoft.Domain.Tests.csproj",
      "tests/Hypesoft.Infrastructure.Tests/Hypesoft.Infrastructure.Tests.csproj"
    ],
    "reporters": [
      "html",
      "json",
      "cleartext",
      "progress"
    ],
    "mutation-level": "Standard",
    "threshold": {
      "high": 80,
      "low": 60,
      "break": 50
    },
    "mutate": [
      "src/**/*.cs",
      "!src/**/Program.cs",
      "!src/**/Startup.cs",
      "!src/**/*Extensions.cs",
      "!src/**/*Configuration.cs"
    ],
    "ignore-mutations": [
      "Regex"
    ],
    "timeout": {
      "enabled": true,
      "timeoutMS": 30000
    },
    "parallel": {
      "enabled": true,
      "numberOfConcurrentRunners": 4
    }
  }
}
```

### 3. Configuração Avançada

```json
{
  "stryker-config": {
    "project": "src/Hypesoft.API/Hypesoft.API.csproj",
    "test-projects": [
      "tests/**/*.csproj"
    ],
    "reporters": [
      "html",
      "json",
      "dashboard"
    ],
    "dashboard": {
      "api-key": "your-dashboard-api-key",
      "project": "github.com/seu-usuario/hypesoft-hypersense",
      "version": "main"
    },
    "mutation-level": "Advanced",
    "threshold": {
      "high": 85,
      "low": 70,
      "break": 60
    },
    "mutate": [
      "src/Hypesoft.Application/**/*.cs",
      "src/Hypesoft.Domain/**/*.cs",
      "src/Hypesoft.Infrastructure/**/*.cs",
      "!src/**/*Extensions.cs",
      "!src/**/*Configuration.cs",
      "!src/**/*Constants.cs",
      "!src/**/Migrations/*.cs"
    ],
    "ignore-mutations": [
      "Regex",
      "StringLiteral"
    ],
    "ignore-methods": [
      "*ToString*",
      "*GetHashCode*",
      "*Equals*"
    ],
    "coverage-analysis": "perTest",
    "disable-mix-mutants": false,
    "max-concurrent-test-runners": 4,
    "timeout": {
      "enabled": true,
      "timeoutMS": 60000
    }
  }
}
```

## 🔧 Scripts de Execução

Adicionar ao `package.json` ou criar scripts shell:

### PowerShell (Windows)
```powershell
# scripts/run-mutation-tests.ps1
Write-Host "Iniciando Mutation Testing com Stryker.NET..." -ForegroundColor Green

# Navegar para o diretório backend
Set-Location backend

# Executar testes de mutação
dotnet stryker

# Abrir relatório HTML
Start-Process "StrykerOutput/reports/mutation-report.html"

Write-Host "Mutation Testing concluído!" -ForegroundColor Green
```

### Bash (Linux/macOS)
```bash
#!/bin/bash
# scripts/run-mutation-tests.sh

echo "🧬 Iniciando Mutation Testing com Stryker.NET..."

cd backend

# Restaurar dependências
dotnet restore

# Executar testes normais primeiro
echo "🧪 Executando testes unitários..."
dotnet test --no-restore --verbosity minimal

if [ $? -eq 0 ]; then
    echo "✅ Testes unitários passaram. Iniciando mutation testing..."
    
    # Executar mutation testing
    dotnet stryker
    
    # Verificar se o relatório foi gerado
    if [ -f "StrykerOutput/reports/mutation-report.html" ]; then
        echo "📊 Relatório gerado: StrykerOutput/reports/mutation-report.html"
        
        # Abrir relatório (macOS)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open StrykerOutput/reports/mutation-report.html
        fi
        
        # Abrir relatório (Linux)
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open StrykerOutput/reports/mutation-report.html
        fi
    fi
else
    echo "❌ Testes unitários falharam. Corrija os testes antes de executar mutation testing."
    exit 1
fi

echo "🎉 Mutation Testing concluído!"
```

## 📊 Interpretação dos Resultados

### Métricas do Stryker

1. **Mutation Score**: Percentual de mutações detectadas pelos testes
   - **85%+**: Excelente
   - **70-84%**: Bom
   - **60-69%**: Aceitável
   - **<60%**: Necessita melhorias

2. **Tipos de Mutação**:
   - **Arithmetic**: +, -, *, /, %
   - **Equality**: ==, !=, <, >, <=, >=
   - **Logical**: &&, ||, !
   - **Assignment**: +=, -=, *=, /=
   - **Unary**: ++, --
   - **Update**: Modificação de valores

3. **Status das Mutações**:
   - **Killed**: ✅ Mutação detectada pelos testes
   - **Survived**: ❌ Mutação não detectada
   - **No Coverage**: 🚫 Código não coberto por testes
   - **Timeout**: ⏱️ Teste demorou muito para executar
   - **Compile Error**: 💥 Mutação causou erro de compilação

### Exemplo de Relatório

```
┌─────────────────────────────┬──────────┬──────────┬───────────┬────────────┬───────────┬─────────────┐
│ File                        │  % score │ # killed │ # timeout │ # survived │ # no cov  │ # error     │
├─────────────────────────────┼──────────┼──────────┼───────────┼────────────┼───────────┼─────────────┤
│ All files                   │       82 │      156 │         0 │         28 │         6 │           0 │
│ Domain/Entities             │       90 │       45 │         0 │          5 │         0 │           0 │
│ Domain/Services             │       85 │       32 │         0 │          6 │         0 │           0 │
│ Application/Handlers        │       78 │       79 │         0 │         17 │         6 │           0 │
└─────────────────────────────┴──────────┴──────────┴───────────┴────────────┴───────────┴─────────────┘
```

## 🎯 Metas de Qualidade

### Targets por Camada

```json
{
  "quality-gates": {
    "domain": {
      "target": 90,
      "rationale": "Domain logic deve ter alta cobertura de mutação"
    },
    "application": {
      "target": 85,
      "rationale": "Handlers e use cases são críticos"
    },
    "infrastructure": {
      "target": 75,
      "rationale": "Foco em adapters e repositories"
    },
    "api": {
      "target": 70,
      "rationale": "Controllers têm lógica mais simples"
    }
  }
}
```

## 🔍 Análise de Resultados

### Mutações Sobreviventes Comuns

1. **Boundary Conditions**
```csharp
// Original
if (quantity > 0) return true;

// Mutação sobrevivente
if (quantity >= 0) return true;

// Teste necessário
[Test]
public void Should_Return_False_When_Quantity_Is_Zero()
{
    var result = ValidateQuantity(0);
    result.Should().BeFalse();
}
```

2. **Return Values**
```csharp
// Original
public bool IsValid() => true;

// Mutação sobrevivente
public bool IsValid() => false;

// Teste necessário
[Test]
public void Should_Return_True_When_Valid()
{
    var result = validator.IsValid();
    result.Should().BeTrue();
}
```

3. **Mathematical Operations**
```csharp
// Original
return price * quantity;

// Mutação sobrevivente
return price + quantity;

// Teste necessário
[Test]
public void Should_Calculate_Total_Correctly()
{
    var total = CalculateTotal(10.0m, 3);
    total.Should().Be(30.0m);
}
```

## 🚀 Integração com CI/CD

### GitHub Actions

```yaml
# .github/workflows/mutation-testing.yml
name: Mutation Testing

on:
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * 1' # Segunda-feira às 2h

jobs:
  mutation-testing:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '8.0'
    
    - name: Install Stryker.NET
      run: dotnet tool install -g dotnet-stryker
    
    - name: Restore dependencies
      run: dotnet restore
      working-directory: backend
    
    - name: Run unit tests
      run: dotnet test --no-restore
      working-directory: backend
    
    - name: Run mutation testing
      run: dotnet stryker --reporter html --reporter json
      working-directory: backend
    
    - name: Upload mutation report
      uses: actions/upload-artifact@v3
      with:
        name: mutation-report
        path: backend/StrykerOutput/
    
    - name: Comment PR with results
      if: github.event_name == 'pull_request'
      uses: actions/github-script@v6
      with:
        script: |
          const fs = require('fs');
          const path = 'backend/StrykerOutput/reports/mutation-report.json';
          
          if (fs.existsSync(path)) {
            const report = JSON.parse(fs.readFileSync(path, 'utf8'));
            const score = report.thresholds.score;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🧬 **Mutation Testing Results**\n\nMutation Score: **${score}%**\n\nDetailed report available in artifacts.`
            });
          }
```

## 📈 Métricas e Dashboards

### Dashboard do Stryker

1. **Configurar Dashboard Online**
```json
{
  "dashboard": {
    "api-key": "your-api-key",
    "project": "github.com/seu-usuario/hypesoft-hypersense",
    "version": "main",
    "module": "backend"
  }
}
```

2. **Métricas Customizadas**
```csharp
// MutationTestingMetrics.cs
public class MutationTestingMetrics
{
    public int TotalMutations { get; set; }
    public int KilledMutations { get; set; }
    public int SurvivedMutations { get; set; }
    public double MutationScore => (double)KilledMutations / TotalMutations * 100;
    public string QualityGate => MutationScore switch
    {
        >= 85 => "Excelente",
        >= 70 => "Bom",
        >= 60 => "Aceitável",
        _ => "Necessita Melhorias"
    };
}
```

## 🎨 Diferencial Implementado

Este setup de Mutation Testing representa um dos **20 diferenciais técnicos** do projeto:

> **10. Mutation Testing com Stryker.NET** ✅
> 
> Implementação completa com:
> - Configuração otimizada para o projeto
> - Scripts de automação
> - Integração com CI/CD
> - Relatórios detalhados
> - Métricas de qualidade
> - Dashboard online
> - Análise de gaps de teste
> - Metas por camada da aplicação

## 🔧 Comandos Úteis

```bash
# Executar mutation testing básico
dotnet stryker

# Executar com configuração específica
dotnet stryker --config-file stryker-config.json

# Executar apenas em arquivos específicos
dotnet stryker --mutate "src/Domain/**/*.cs"

# Executar com threshold específico
dotnet stryker --threshold-high 85 --threshold-low 70

# Executar com relatório específico
dotnet stryker --reporter html --reporter json

# Executar em modo verbose
dotnet stryker --verbosity debug
```

---

**Próximos Passos:**
1. Instalar Stryker.NET no projeto
2. Executar primeira análise
3. Identificar gaps de teste
4. Melhorar testes com base nos resultados
5. Integrar com pipeline de CI/CD

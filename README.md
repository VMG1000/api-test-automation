# 🚀 Automação de Testes de API - Banco Carrefour

[![API Tests](https://github.com/VMG1000/api-test-automation/actions/workflows/api-tests.yml/badge.svg)](https://github.com/VMG1000/api-test-automation/actions/workflows/api-tests.yml)

Este projeto implementa um conjunto completo de testes automatizados para uma API RESTful de gerenciamento de usuários, utilizando Postman/Newman e integração com GitHub Actions.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Executar os Testes](#como-executar-os-testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Casos de Teste Cobertos](#casos-de-teste-cobertos)
- [Pipeline CI/CD](#pipeline-cicd)
- [Relatórios](#relatórios)
- [Troubleshooting](#troubleshooting)

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido para testar uma API RESTful que gerencia informações de usuários com as seguintes operações:

- **GET** `/usuarios` - Lista todos os usuários
- **POST** `/usuarios` - Cria um novo usuário
- **GET** `/usuarios/{id}` - Retorna detalhes de um usuário específico
- **PUT** `/usuarios/{id}` - Atualiza informações de um usuário
- **DELETE** `/usuarios/{id}` - Exclui um usuário
- **POST** `/login` - Autenticação via JWT

**API Utilizada**: [ServeRest](https://serverest.dev) - API para estudos de testes

## 🛠 Tecnologias Utilizadas

- **Postman** - Criação e execução de testes de API
- **Newman** - Executor de linha de comando para coleções Postman
- **GitHub Actions** - Pipeline de CI/CD
- **Node.js** - Runtime JavaScript
- **JWT** - Autenticação via token

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 14 ou superior)
- **npm** (geralmente vem com Node.js)
- **Git**
- **Postman** (opcional, para visualizar as coleções)

### Verificar instalações
```bash
node --version
npm --version
git --version
```

## ⚙️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/VMG1000/api-test-automation.git
cd api-test-automation
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Instale o Newman globalmente (se ainda não tiver)
```bash
npm install -g newman
npm install -g newman-reporter-htmlextra
```

### 4. Verifique a instalação
```bash
newman --version
```

## 🚀 Como Executar os Testes

### Execução Local

#### Opção 1: Executar todos os testes
```bash
newman run postman/collection.json -e postman/environment.json
```

#### Opção 2: Executar com relatório HTML
```bash
newman run postman/collection.json \
  -e postman/environment.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/report.html
```

#### Opção 3: Executar com múltiplos formatos de relatório
```bash
newman run postman/collection.json \
  -e postman/environment.json \
  --reporters cli,junit,htmlextra \
  --reporter-junit-export reports/results.xml \
  --reporter-htmlextra-export reports/report.html
```

#### Opção 4: Usar o script npm (recomendado)
```bash
npm test
```

### Execução com Docker
```bash
docker run -v $(pwd):/workspace -w /workspace postman/newman:latest \
  run postman/collection.json -e postman/environment.json
```

## 📁 Estrutura do Projeto

```
api-test-automation/
├── .github/
│   └── workflows/
│       └── api-tests.yml          # Pipeline GitHub Actions
├── postman/
│   ├── collection.json            # Coleção Postman com testes
│   └── environment.json           # Variáveis de ambiente
├── reports/                       # Relatórios gerados
│   ├── report.html               # Relatório HTML
│   └── results.xml               # Relatório JUnit
├── scripts/
│   └── setup-test-data.js        # Script para preparar dados de teste
├── package.json                  # Dependências e scripts
├── package-lock.json
└── README.md                     # Este arquivo
```

## 🧪 Casos de Teste Cobertos

### 1. Autenticação
- ✅ Login com credenciais válidas
- ✅ Login com credenciais inválidas
- ✅ Validação do token JWT

### 2. Gerenciamento de Usuários - CRUD Completo

#### Criação (POST /usuarios)
- ✅ Criar usuário com dados válidos
- ✅ Criar usuário administrador
- ✅ Validar campos obrigatórios (nome, email, password, administrador)
- ✅ Validar email único
- ✅ Validar formato de email

#### Leitura (GET /usuarios e GET /usuarios/{id})
- ✅ Listar todos os usuários
- ✅ Buscar usuário por ID válido
- ✅ Buscar usuário por ID inválido
- ✅ Validar estrutura da resposta

#### Atualização (PUT /usuarios/{id})
- ✅ Atualizar usuário existente
- ✅ Atualizar com dados inválidos
- ✅ Atualizar usuário inexistente
- ✅ Validar autenticação para atualização

#### Exclusão (DELETE /usuarios/{id})
- ✅ Excluir usuário existente
- ✅ Excluir usuário inexistente
- ✅ Validar autenticação para exclusão

### 3. Cenários de Erro
- ✅ Validação de rate limiting (100 req/min)
- ✅ Validação de headers obrigatórios
- ✅ Validação de autorização JWT
- ✅ Tratamento de dados malformados

## 🔄 Pipeline CI/CD

O projeto utiliza GitHub Actions para executar os testes automaticamente:

### Triggers
- Push para branch `main`
- Pull requests para branch `main`
- Execução manual via workflow_dispatch

### Etapas da Pipeline
1. **Setup** - Configuração do ambiente Node.js
2. **Install** - Instalação de dependências
3. **Test** - Execução dos testes com Newman
4. **Report** - Geração e upload de relatórios

### Visualizar Resultados
- Acesse a aba **Actions** no GitHub
- Clique na execução desejada
- Baixe os artefatos dos relatórios

## 📊 Relatórios

Os relatórios são gerados em múltiplos formatos:

### HTML Report
- **Localização**: `reports/report.html`
- **Conteúdo**: Relatório detalhado com gráficos e estatísticas
- **Visualização**: Abra o arquivo em qualquer navegador

### JUnit XML
- **Localização**: `reports/results.xml`
- **Uso**: Integração com ferramentas de CI/CD
- **Formato**: Padrão XML para resultados de teste

### Console Output
- **Formato**: Texto simples no terminal
- **Uso**: Debug e execução local

## 🔧 Troubleshooting

### Erro 401 - Unauthorized no Login

**Problema**: `Status 200 expected response to have status code 200 but got 401`

**Solução**:
1. Verifique se existe um usuário cadastrado antes de fazer login
2. Execute o script de setup primeiro:
```bash
node scripts/setup-test-data.js
```
3. Verifique as credenciais no environment.json:
```json
{
  "user_email": "fulano@qa.com",
  "user_password": "teste"
}
```

### Newman não encontrado

**Solução**:
```bash
npm install -g newman
```

### Erro de permissão no Docker

**Solução**:
```bash
sudo docker run -v $(pwd):/workspace -w /workspace postman/newman:latest run postman/collection.json
```

### Rate Limit Exceeded

**Problema**: Muitas requisições em pouco tempo

**Solução**: Aguarde 1 minuto ou use delays entre as requisições:
```bash
newman run collection.json --delay-request 1000
```

### Variáveis de ambiente não carregadas

**Verificar**:
1. Arquivo `environment.json` existe
2. Parâmetro `-e` está sendo usado
3. Variáveis estão definidas corretamente

## 📝 Configuração das Variáveis de Ambiente

Edite o arquivo `postman/environment.json`:

```json
{
  "id": "test-environment",
  "name": "Test Environment",
  "values": [
    {
      "key": "base_url",
      "value": "https://serverest.dev",
      "enabled": true
    },
    {
      "key": "user_email",
      "value": "fulano@qa.com",
      "enabled": true
    },
    {
      "key": "user_password",
      "value": "teste",
      "enabled": true
    }
  ]
}
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**VMG1000**
- GitHub: [@VMG1000](https://github.com/VMG1000)

## 🎯 Status do Projeto

- ✅ **Testes Implementados**: 100%
- ✅ **Cobertura de Endpoints**: 100%
- ✅ **Pipeline CI/CD**: Configurada
- ✅ **Relatórios**: Funcionando
- ✅ **Documentação**: Completa

---

**Desafio**: Banco Carrefour - Automação de Testes de API  
**Data**: Dezembro 2024
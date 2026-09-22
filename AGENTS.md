# AGENTS.md

Este arquivo é a fonte de verdade para agentes de IA (e humanos) que trabalham neste
repositório. Ele descreve **convenções técnicas, arquitetura e regras de engenharia** —
não contém regras de negócio. Domínio, entidades e fluxos funcionais devem ser
documentados em outro lugar (ex.: `docs/` ou issues), nunca aqui.

---

## 1. Escopo

- Governa **todo** o monorepo: backend serverless, bibliotecas compartilhadas e frontend.
- Define como escrever, testar, revisar e implantar código neste projeto.
- **Não** define regras de negócio, nomes de entidades de domínio ou fluxos de produto.
- Em caso de conflito entre este arquivo e um comando explícito do usuário, siga o
  usuário — e proponha atualizar este arquivo para refletir a decisão.

---

## 2. Arquitetura

```
┌──────────────────────┐        ┌──────────────────────┐
│  AWS Amplify Hosting │        │   AWS Cognito        │
│  React + Vite (SPA)  │───────▶│   User Pool + JWT    │
└──────────┬───────────┘        └──────────┬───────────┘
           │ HTTPS (fetch)                 │ Bearer token
           ▼                               ▼
     ┌───────────────────────────────────────────┐
     │   API Gateway — HTTP API (payload v2)      │
     │   JWT Authorizer (Cognito) + CORS          │
     └───────────────────┬───────────────────────┘
                         │ Lambda proxy integration
                         ▼
     ┌───────────────────────────────────────────┐
     │   AWS Lambda — Node.js 20.x + TypeScript   │
     │   Powertools (Logger/Metrics/Tracer)       │
     └───────────────────┬───────────────────────┘
                         │ AWS SDK v3 (DocumentClient)
                         ▼
     ┌───────────────────────────────────────────┐
     │   Amazon DynamoDB — 1 tabela por entidade  │
     └───────────────────────────────────────────┘

Infraestrutura: Serverless Framework v4 → CloudFormation (stacks por stage).
Configuração/segredos: SSM Parameter Store + AWS Secrets Manager.
CI/CD: GitHub Actions com OIDC (sem chaves estáticas).
```

Princípios:

- **Stateless**: nenhuma Lambda guarda estado entre invocações.
- **Idempotência**: operações de escrita devem ser seguras para reprocessamento.
- **Baixo acoplamento**: cada função tem uma responsabilidade; lógica reutilizável vive
  em `lib/` ou `packages/shared`.
- **Infra como código**: nada é criado manualmente no console AWS.

---

## 3. Stack e versões

| Camada            | Tecnologia                                   |
| ----------------- | -------------------------------------------- |
| Runtime Lambda    | Node.js 20.x                                 |
| Linguagem         | TypeScript (strict)                          |
| IaC               | Serverless Framework v4 → CloudFormation     |
| API               | API Gateway HTTP API (payload format v2)     |
| Banco             | DynamoDB (AWS SDK v3, DocumentClient)        |
| Observabilidade   | AWS Lambda Powertools (Logger/Metrics/Tracer)|
| Validação         | Zod                                          |
| Testes            | Vitest                                       |
| Lint/Format       | ESLint + Prettier                            |
| Frontend          | React + Vite + AWS Amplify (Hosting/Auth)    |
| Auth              | AWS Cognito User Pools (JWT)                 |
| Package manager   | yarn (workspaces)                            |
| CI/CD             | GitHub Actions + OIDC                        |

Regras de versão:

- Versões devem ser **fixadas** (`package.json` com versões exatas ou lockfile commitado).
- A lista canônica de dependências e versões está na seção 23.2. Não use versões diferentes
  sem atualizar a seção 23.2 e o `yarn.lock`.
- Não introduza dependência nova sem justificar e verificar se já existe equivalente no repo.
- `yarn.lock` deve ser commitado e mantido consistente.

---

## 4. Estrutura do monorepo

```
projeto-serverless/
├── AGENTS.md
├── package.json              # raiz: workspaces + scripts agregados
├── yarn.lock
├── .yarnrc.yml               # nodeLinker: node-modules
├── tsconfig.base.json        # config TS compartilhada
├── eslint.config.js
├── .prettierrc
├── .editorconfig
├── .nvmrc                    # 20
├── vitest.config.ts          # projetos + cobertura
├── docker-compose.yml        # dynamodb-local
├── .gitignore
├── apps/
│   └── web/                  # React + Vite + Amplify
│       ├── src/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/          # api client, auth, env
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── shared/               # tipos + schemas Zod compartilhados
│   │   ├── src/
│   │   │   ├── schemas/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── config/               # eslint base reutilizável
│       ├── eslint.config.js
│       └── package.json
└── services/
    └── api/
        ├── serverless.yml
        ├── package.json
        ├── tsconfig.json
        ├── vitest.config.ts
        ├── vitest.setup.ts
        ├── scripts/
        │   └── create-tables.mjs
        └── src/
            ├── functions/
            │   └── <nome>/
            │       ├── handler.ts       # entrypoint fino
            │       ├── schema.ts        # Zod input/output
            │       └── handler.test.ts
            ├── lib/                     # clients, errors, response, powertools
            └── types/
```

Regras de localização:

- Código de uma única Lambda vive em `services/api/src/functions/<nome>/`.
- Código reutilizável por várias funções vive em `services/api/src/lib/`.
- Contratos/tipos/schemas usados por **backend e frontend** vivem em `packages/shared/`.
- Nunca importe código de `services/` dentro de `apps/` (e vice-versa); use `packages/shared`.
- Cada workspace tem seu próprio `package.json`; dependências não ficam na raiz sem necessidade.

---

## 5. Comandos

Todos os comandos rodam com `yarn`. Na raiz:

```bash
yarn install            # instala todos os workspaces
yarn lint               # ESLint em todo o monorepo
yarn format             # Prettier --write
yarn typecheck          # tsc --noEmit em todos os workspaces
yarn test               # Vitest (unit)
yarn test:watch         # Vitest em watch
yarn test:coverage      # Vitest com cobertura
yarn build              # build de todos os workspaces
```

Backend (`services/api`):

```bash
yarn workspace @app/api dev            # serverless-offline + dynamodb-local
yarn workspace @app/api deploy --stage dev
yarn workspace @app/api deploy --stage prod
yarn workspace @app/api remove --stage dev
yarn workspace @app/api logs -f <fn> --stage dev
```

Frontend (`apps/web`):

```bash
yarn workspace @app/web dev
yarn workspace @app/web build
yarn workspace @app/web preview
```

Regras:

- Antes de concluir qualquer tarefa, rode `yarn lint && yarn typecheck && yarn test`.
- Deploy **somente** via CI ou com pedido explícito do usuário. Nunca faça deploy automático.

---

## 6. Convenções de código TypeScript

- `strict: true` sempre. Proibido `any` — use `unknown` + validação com Zod.
- Prefira `type` para dados e `interface` para contratos extensíveis.
- Exports **nomeados**; evite `export default` (exceto componentes/config quando idiomático).
- Imports absolutos via aliases (`@/`, `@app/shared`) — sem `../../..` profundos.
- Nomes:
  - Variáveis/funções: `camelCase`
  - Tipos/classes/componentes React: `PascalCase`
  - Constantes: `UPPER_SNAKE_CASE`
  - Arquivos: `kebab-case.ts` (componentes React: `PascalCase.tsx`)
  - Tabelas/recursos AWS: `kebab-case` prefixado por stage
- **Não adicione comentários** salvo quando o "porquê" não for óbvio. Código deve se explicar.
- Funções puras e pequenas; efeitos colaterais isolados em `lib/`.
- Sem `console.log` em produção — use o Logger do Powertools.
- Trate erros, não os silencie. Nunca use `catch` vazio.

---

## 7. Padrão de Lambda

- `handler.ts` é **fino**: faz parsing/validação, chama a lógica e retorna a resposta.
- Lógica de domínio reutilizável fica em `lib/` ou no serviço; handler não contém regra extensa.
- Use `middy` (ou middleware equivalente) para: injeção de dependências, validação,
  serialização de erro e logging.
- Inicialize clientes AWS **fora** do handler (reuso entre invocações / cold start).
- Config sempre via variáveis de ambiente injetadas pelo `serverless.yml`.
- Toda entrada é validada com Zod antes de qualquer processamento.
- Nunca dependa de `event` cru fora da camada de tradução — converta para um tipo interno.

Exemplo de contrato de handler (formato de referência, não implementação):

```ts
export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const input = schema.parse(parseEvent(event));
  const result = await doWork(input);
  return created(result);
};
```

---

## 8. API Gateway (HTTP API v2)

- Use **HTTP API (payload format v2)**, integração **Lambda proxy**.
- Prefixo de versão obrigatório: `/v1/...`.
- Rotas definidas no `serverless.yml`; uma rota por função quando fizer sentido.
- Autorização padrão: **JWT Authorizer** apontando para o Cognito User Pool.
  Rotas públicas devem declarar `authorizer: none` explicitamente.
- CORS restrito por stage (origem do Amplify em prod; localhost em dev). Nunca `*` em prod.
- Formato de resposta de sucesso:

```json
{ "data": <payload>, "meta": { "requestId": "<id>" } }
```

- Formato de erro padronizado (ver seção 14):

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] }, "meta": { "requestId": "<id>" } }
```

- Paginação por cursor (`nextToken` opaco) — nunca offset.
- Não exponha detalhes internos (stack, nomes de tabela, ARNs) em respostas.

---

## 9. DynamoDB

- Modelagem: **uma tabela por entidade** (decisão do projeto). Cada entidade tem sua tabela.
- Acesso via **AWS SDK v3 `DynamoDBDocumentClient`** (sem `@aws-sdk/client-dynamodb` cru no domínio).
- Cliente criado uma vez fora do handler.
- Chaves:
  - PK obrigatória (`PK`) e SK quando a entidade exigir ordenação/relacionamento.
  - GSIs somente quando houver access pattern comprovado; documente o padrão que justifica.
- Capacidade: **on-demand** por padrão (`PAY_PER_REQUEST`), salvo justificativa.
- TTL: use atributo `ttl` (epoch seconds) quando dados tiverem expiração natural.
- Nomes físicos de tabela/índice: `<projeto>-<entidade>-<stage>`, definidos no `serverless.yml`.
- IAM: permissões por tabela/índice (least privilege), nunca `dynamodb:*` em `*`.
- Operações em lote devem tratar itens não processados (`UnprocessedItems`) com retry/backoff.
- Toda escrita deve considerar idempotência (ex.: condição de escrita / chave idempotente).

---

## 10. Validação com Zod

- Schemas Zod ficam em `schema.ts` (por função) ou `packages/shared/src/schemas/` (compartilhados).
- Tipos derivam dos schemas: `type X = z.infer<typeof xSchema>`. Não duplique tipos.
- Valide **entrada** (payload, params, query) e, quando útil, a **saída** antes de retornar.
- Erros de validação devem ser convertidos para o erro padronizado da API (seção 14).
- Schemas compartilhados entre front e back são a **fonte de verdade do contrato**.

---

## 11. Autenticação e autorização (Cognito)

- Autenticação via Cognito User Pool; frontend usa Amplify Auth.
- Backend recebe o JWT já validado pelo API Gateway; leia claims do `event`.
- Autorização por **grupos/scopes** do Cognito — nunca confie em IDs enviados no body.
- A identidade (`sub`) vem do token, não do payload.
- Nunca registre tokens, senhas ou claims sensíveis em logs.

---

## 12. Configuração e segredos

- **Proibido** hardcode de segredos, URLs sensíveis, chaves ou IDs de conta.
- Configurações não sensíveis: SSM Parameter Store (injete no `serverless.yml`).
- Segredos: AWS Secrets Manager, lidos em runtime e cacheados na inicialização.
- Variáveis de ambiente têm nomes `UPPER_SNAKE_CASE` e escopo por stage.
- Frontend: apenas variáveis públicas prefixadas com `VITE_` — **nada secreto** no bundle.
- Documente toda nova variável/parâmetro em `serverless.yml` e no README do workspace.

---

## 13. Observabilidade (Powertools)

- **Logger**: logs em JSON estruturado, com `requestId`/`correlationId`, `functionName`,
  `stage`. Nunca `console.log` em código de produção.
- **Metrics**: emita métricas de negócio e técnicas via Powertools (namespace `<Projeto>/<Stage>`).
- **Tracer**: instrumente chamadas AWS e operações relevantes com X-Ray.
- Logs não podem conter PII, tokens ou dados sensíveis.
- Use níveis corretos (`info`, `warn`, `error`); `error` só para falhas reais.

---

## 14. Tratamento de erros

- Defina classes de erro custom em `services/api/src/lib/errors.ts`:
  - `AppError` (base) com `code`, `message`, `statusCode`, `details`.
  - Subclasses: `ValidationError`, `NotFoundError`, `ConflictError`, `ForbiddenError`,
    `UnauthorizedError`, `InternalError`.
- Mapeie cada erro para o status HTTP correspondente (400/401/403/404/409/500).
- Erros desconhecidos → `InternalError` (500) com log completo no servidor e mensagem
  genérica ao cliente.
- **Nunca** vaze stack trace, mensagem de exceção AWS ou detalhes internos ao cliente.
- Sempre use o envelope de erro da seção 8.

---

## 15. Testes (Vitest)

- Framework: **Vitest**. Arquivos `*.test.ts` ao lado do código testado.
- Testes unitários para lógica de `lib/` e handlers (mockando dependências).
- Testes de integração para repositórios DynamoDB usando **dynamodb-local**.
- Mocke AWS SDK v3 com `aws-sdk-client-mock` (ou equivalente); nunca chame AWS real em testes.
- Nomenclatura de testes: `describe('<unidade>')` + `it('should ...')`.
- Cobertura mínima: **80%** em `services/` e `packages/shared` (linhas e branches).
- Testes devem ser determinísticos, isolados e não depender de ordem de execução.
- Novos comportamentos exigem novos testes; correções de bug exigem teste de regressão.

---

## 16. Serverless Framework v4 e IaC

- Cada serviço tem seu `serverless.yml`; toda infra é descrita nele (gera CloudFormation).
- Estrutura mínima do `serverless.yml`:

```yaml
service: <projeto>-<servico>
frameworkVersion: '4'
provider:
  name: aws
  runtime: nodejs20.x
  region: <região>
  stage: ${opt:stage, 'dev'}
  httpApi:
    payload: '2.0'
    cors:
      allowedOrigins: [${env:CORS_ORIGIN, 'http://localhost:5173'}]
    authorizers:
      cognitoJwt:
        type: jwt
        identitySource: $request.header.Authorization
        issuerUrl: <derivado do UserPool — ver seção 23.18>
        audience: [<derivado do UserPoolClient — ver seção 23.18>]
  environment:
    STAGE: ${self:provider.stage}
    ...
  iam:
    role:
      statements:
        - Effect: Allow
          Action: [dynamodb:GetItem, dynamodb:PutItem]
          Resource: !GetAtt <Table>.Arn
functions:
  <nome>:
    handler: src/functions/<nome>/handler.handler
    events:
      - httpApi:
          method: POST
          path: /v1/<recurso>
          authorizer:
            name: cognitoJwt
resources:
  Resources:
    <Table>:
      Type: AWS::DynamoDB::Table
      ...
plugins:
  - serverless-esbuild
  - serverless-offline
```

- Bundling das funções com `serverless-esbuild` (config canônica na seção 23.6).
- Recursos CloudFormation explícitos sob `resources.Resources` (tabelas, buckets, filas).
- Use `!Ref`, `!GetAtt`, `!Sub` para referências; evite valores duplicados.
- Stages: `dev` e `prod`. Nomes de recursos incluem o stage.
- `provider.iam` com **least privilege** por função/recurso. Nunca `Action: '*'` em `Resource: '*'`.
- Plugin `serverless-offline` para dev local (compatível com v4 a partir da v13+).
- Serverless v4 exige license key para organizações acima do limite de faturamento; fora
  disso o uso é gratuito. Nunca commite a license key — use variável de ambiente/CI.
- Nunca edite stacks manualmente no console AWS; toda mudança passa pelo `serverless.yml`.

---

## 17. Frontend (React + Vite + Amplify)

- Estrutura: `apps/web/src/{components,hooks,lib}`.
- Toda chamada à API passa por um client central em `src/lib/api.ts` (fetch com base URL
  por env, injeção do JWT, tratamento do envelope de erro).
- Autenticação via **Amplify Auth** (Cognito). Tokens nunca em `localStorage` manual —
  use a sessão do Amplify.
- Tipos de request/response vêm de `packages/shared` — não redefina contratos.
- Variáveis de ambiente expostas usam prefixo `VITE_`; nada sensível no bundle.
- Estado remoto via hooks (`useQuery`-like) — sem lógica de negócio em componentes de UI.
- Componentes: `PascalCase.tsx`, um componente por arquivo, props tipadas.
- Sem `any`; sem `console.log` em código de produção.
- Acessibilidade e estados de loading/erro obrigatórios em telas que consomem API.

---

## 18. Segurança

- IAM com least privilege; permissões por recurso e ação.
- Toda entrada validada (Zod) antes de uso.
- CORS restrito por stage; nunca `*` em produção.
- Sem segredos no repositório, no bundle do frontend ou em logs.
- Dependências auditadas (`yarn audit`/Dependabot); atualize vulnerabilidades críticas.
- CI autentica na AWS via **OIDC** — sem access keys estáticas.
- Princípio do menor privilégio também para roles do GitHub Actions.

---

## 19. CI/CD (GitHub Actions)

Workflows obrigatórios:

- **PR check** (em `pull_request`): `yarn install --immutable`, `yarn lint`,
  `yarn typecheck`, `yarn test --coverage`.
- **Deploy** (em `push` para `main` → stage `prod`; manual/dispatch → `dev`):
  assume role via OIDC, roda checks e `serverless deploy --stage <stage>`.
- **Proteções**: `main` protegida; PR obrigatório; checks verdes antes do merge.

Regras:

- Nenhum segredo em texto plano nos workflows; use GitHub Secrets/OIDC.
- Deploy do frontend (Amplify) pode ser via integração do Amplify com o repositório.
- Falha de lint/typecheck/teste **bloqueia** merge e deploy.

---

## 20. Git e commits

- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`,
  `ci:`, `perf:`, `build:`.
  - Ex.: `feat(api): adiciona endpoint de consulta`
- Branches: `feat/<descricao>`, `fix/<descricao>`, `chore/<descricao>`, `docs/<descricao>`.
- PRs pequenos e focados; descreva o que muda e como testar.
- Nunca commite segredos, `.env` reais, `node_modules` ou artefatos de build.
- Nunca faça commit, amend, push ou PR sem pedido explícito do usuário.

---

## 21. Regras para agentes de IA

Sempre:

1. Leia o código e os arquivos de configuração existentes antes de alterar.
2. Siga os padrões já presentes no repositório (nomes, estrutura, imports, testes).
3. Valide entradas com Zod e retorne o envelope de resposta/erro padronizado.
4. Reutilize tipos/schemas de `packages/shared`; não duplique contratos.
5. Rode `yarn lint && yarn typecheck && yarn test` antes de declarar concluído.
6. Adicione/atualize testes para qualquer comportamento novo ou corrigido.
7. Mantenha o `serverless.yml` como fonte da infra; não crie recursos manualmente.
8. Atualize este `AGENTS.md` se introduzir uma convenção nova e duradoura.

Nunca:

1. Adicionar regras de negócio ou nomes de domínio a este arquivo.
2. Fazer hardcode de segredos, credenciais, IDs ou URLs sensíveis.
3. Usar `any`, silenciar erros com `catch` vazio, ou deixar `console.log` em produção.
4. Fazer deploy, commit, push ou PR sem pedido explícito.
5. Expor stack trace, tokens ou PII em respostas ou logs.
6. Importar código de `apps/` em `services/` ou vice-versa.
7. Alterar configurações de IAM/CORS para `*` sem justificativa explícita.
8. Introduzir dependências novas sem necessidade comprovada.

Checklist antes de finalizar uma tarefa:

- [ ] `yarn lint` sem erros
- [ ] `yarn typecheck` sem erros
- [ ] `yarn test` passando (cobertura ≥ 80%)
- [ ] Contratos em `packages/shared` atualizados, se aplicável
- [ ] Sem segredos, `any` ou `console.log`
- [ ] `serverless.yml` reflete qualquer mudança de infra
- [ ] Documentação/este arquivo atualizados, se necessário

---

## 22. Definition of Done

Uma tarefa só está concluída quando:

1. O código compila (`typecheck`) e passa no lint.
2. Todos os testes passam e a cobertura mínima é respeitada.
3. Comportamentos novos/alterados estão cobertos por testes.
4. A infra necessária está declarada no `serverless.yml`.
5. Não há segredos, dados sensíveis ou débitos óbvios introduzidos.
6. A solução segue as convenções deste arquivo.

---

## 23. Bootstrap do repositório (specs executáveis)

Esta seção é o contrato de scaffolding: uma IA deve conseguir criar todos os arquivos
iniciais do monorepo usando apenas estas definições. Tudo aqui é **convenção técnica**,
nunca regra de negócio.

### 23.1 Identidade e nomes canônicos

- Nome do projeto (placeholder até o projeto real ser nomeado): `projeto-serverless`.
  Ao renomear, substituir globalmente e atualizar esta seção.
- Service Serverless: `projeto-serverless-api`.
- Workspaces npm/yarn:
  - Raiz: `projeto-serverless` (privado, só orquestra workspaces).
  - Backend: `@app/api`.
  - Frontend: `@app/web`.
  - Compartilhado: `@app/shared`.
  - Config: `@app/config`.
- Prefixo físico de recursos AWS: `projeto-serverless-<entidade>-<stage>` (kebab-case).
- Namespace de métricas Powertools: `ProjetoServerless/<stage>` (ex.: `ProjetoServerless/dev`).
- Região padrão: `us-east-1` (sobrescrevível por stage).
- Stages válidos: `dev`, `prod`.
- Package manager: **Yarn 4 (Berry)** fixado via `packageManager` no `package.json` raiz e
  `.yarnrc.yml` com `nodeLinker: node-modules` (compatibilidade com Serverless, esbuild e Vite).
  Nunca use Yarn 1; comandos de lock imutável usam `--immutable`.

### 23.2 Versões canônicas de dependências

Use os ranges abaixo como base. No `yarn install` inicial, resolva o patch mais recente do
range e **commite o `yarn.lock`**. Versões exatas do lock são a fonte de verdade em runtime.

| Dependência                          | Versão   | Onde            |
| ------------------------------------ | -------- | --------------- |
| `typescript`                         | `^5.6`   | raiz/dev        |
| `eslint`                             | `^9`     | raiz/dev        |
| `typescript-eslint`                  | `^8`     | raiz/dev        |
| `prettier`                           | `^3`     | raiz/dev        |
| `vitest`                             | `^3`     | raiz/dev        |
| `@vitest/coverage-v8`                | `^3`     | raiz/dev        |
| `serverless`                         | `^4`     | api/dev         |
| `serverless-esbuild`                 | `^1`     | api/dev         |
| `serverless-offline`                 | `^14`    | api/dev         |
| `esbuild`                            | `^0.24`  | api/dev         |
| `@types/aws-lambda`                  | `^8`     | api/dev         |
| `@types/node`                        | `^20`    | api/dev         |
| `aws-sdk-client-mock`                | `^4`     | api/dev         |
| `@aws-sdk/client-dynamodb`           | `^3`     | api             |
| `@aws-sdk/lib-dynamodb`              | `^3`     | api             |
| `@aws-sdk/client-ssm`                | `^3`     | api             |
| `@aws-sdk/client-secrets-manager`    | `^3`     | api             |
| `@aws-lambda-powertools/logger`      | `^2`     | api             |
| `@aws-lambda-powertools/metrics`     | `^2`     | api             |
| `@aws-lambda-powertools/tracer`      | `^2`     | api             |
| `@middy/core`                        | `^6`     | api             |
| `@middy/http-json-body-parser`       | `^6`     | api             |
| `@middy/http-error-handler`          | `^6`     | api             |
| `zod`                                | `^3.23`  | shared          |
| `react` / `react-dom`                | `^19`    | web             |
| `vite`                               | `^6`     | web/dev         |
| `@vitejs/plugin-react`               | `^4`     | web/dev         |
| `react-router-dom`                   | `^7`     | web             |
| `@tanstack/react-query`              | `^5`     | web             |
| `aws-amplify`                        | `^6`     | web             |
| `@types/react` / `@types/react-dom`  | `^19`    | web/dev         |

Regras:

- `zod` é dependência de `packages/shared`; API e web a consomem via `@app/shared`.
- Não duplique a mesma dependência em múltiplos workspaces sem necessidade.
- Nunca use `latest` ou ranges abertos (`*`) em `package.json`.

### 23.3 `tsconfig.base.json` (raiz)

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@app/shared": ["packages/shared/src/index.ts"],
      "@app/shared/*": ["packages/shared/src/*"]
    }
  }
}
```

- Cada workspace estende este arquivo (`"extends": "../../tsconfig.base.json"`).
- `apps/web` sobrescreve `module`/`moduleResolution` para `ESNext`/`Bundler`,
  `lib` inclui `DOM`/`DOM.Iterable` e `jsx: "react-jsx"`.
- `services/api` adiciona `types: ["node", "aws-lambda"]` e paths `@/*` → `src/*`.
- `noEmit` apenas em checagem; o build real é feito pelo esbuild (seção 23.6).

### 23.4 Aliases e imports

- `@app/shared` → `packages/shared/src`.
- `@/` (somente dentro de `services/api`) → `services/api/src`.
- `@/` (somente dentro de `apps/web`) → `apps/web/src`.
- Proibido import relativo subindo mais de um nível (`../../..`).
- Os aliases devem estar espelhados em `tsconfig` e no resolver do bundler/Vite.

### 23.5 ESLint e Prettier

- ESLint 9 com **flat config** em `eslint.config.js` (raiz), reexportando a base de
  `packages/config`. Configs específicas por workspace estendem a base.
- Regras mínimas obrigatórias:
  - `@typescript-eslint/no-explicit-any: error`
  - `@typescript-eslint/no-unused-vars: error` (ignorar prefixo `_`)
  - `no-console: error` (exceto scripts locais)
  - `eqeqeq: error`, `no-var: error`, `prefer-const: error`
- Prettier (`.prettierrc`): `printWidth: 100`, `singleQuote: true`, `semi: true`,
  `trailingComma: "all"`, `arrowParens: "always"`.
- `.editorconfig`: `indent_style = space`, `indent_size = 2`, `end_of_line = lf`,
  `insert_final_newline = true`, `charset = utf-8`.
- `.nvmrc` contém `20`.

### 23.6 Bundling das Lambdas

- Bundling com **esbuild** via plugin `serverless-esbuild`.
- Config no `serverless.yml` (referência):

```yaml
custom:
  esbuild:
    bundle: true
    minify: false
    sourcemap: true
    target: node20
    platform: node
    format: cjs
    exclude: ['aws-sdk']
    external: ['@aws-sdk/*']
```

- Cada função aponta `handler` para `src/functions/<nome>/handler.handler`.
- Dependências AWS SDK são `external` (fornecidas pelo runtime ou instaladas via layer).
- `packages/shared` é transpilado junto (não é publicado externamente).

### 23.7 Cognito via IaC (neste repositório)

- O User Pool é criado no `serverless.yml` (ou em `services/auth/serverless.yml` dedicado).
- Recursos CloudFormation mínimos:
  - `AWS::Cognito::UserPool`
  - `AWS::Cognito::UserPoolClient` (sem client secret para SPA)
  - `AWS::Cognito::UserPoolDomain` (opcional, para Hosted UI)
- O JWT Authorizer do HTTP API usa como `issuerUrl` e `audience` os valores derivados
  via `!GetAtt`/`!Ref` dos recursos acima — nunca valores hardcoded.
- O frontend recebe `region`, `userPoolId` e `clientId` por variáveis `VITE_*`
  (seção 23.9), injetadas no build do Amplify.
- Grupos/escopos do Cognito são definidos por IaC; regras de negócio de autorização
  ficam no código, não aqui.

### 23.8 Desenvolvimento local

- `docker-compose.yml` na raiz sobe `amazon/dynamodb-local` na porta `8000`, com
  `-jar DynamoDBLocal.jar -sharedDb`.
- `serverless-offline` expõe a API em `http://localhost:3000`.
- Um script de setup (`services/api/scripts/create-tables.mjs`, seção 23.20) cria as
  tabelas locais a partir do `serverless.yml` (mesmos nomes com sufixo do stage `dev`).
- Para rotas protegidas em dev, o authorizer JWT pode ser desabilitado apenas no
  profile local (`serverless-offline`), nunca em `dev`/`prod` reais.
- Scripts canônicos:
  - `yarn workspace @app/api dev` → `serverless offline --stage dev`
  - `yarn workspace @app/api db:start` → `docker compose up -d dynamodb`
  - `yarn workspace @app/api db:setup` → cria tabelas locais

### 23.9 Catálogo de variáveis de ambiente

Backend (`services/api`, injetadas pelo `serverless.yml` por stage):

| Variável                     | Descrição                                        | Exemplo                          |
| ---------------------------- | ------------------------------------------------ | -------------------------------- |
| `STAGE`                      | Stage atual                                      | `dev`                            |
| `AWS_REGION`                 | Região do SDK                                    | `us-east-1`                      |
| `LOG_LEVEL`                  | Nível do Logger Powertools                       | `INFO` / `DEBUG`                 |
| `POWERTOOLS_SERVICE_NAME`    | Nome do serviço                                  | `projeto-serverless-api`         |
| `POWERTOOLS_METRICS_NAMESPACE` | Namespace de métricas                          | `ProjetoServerless/dev`          |
| `CORS_ORIGIN`                | Origem permitida por stage                       | `http://localhost:5173` / domínio|
| `COGNITO_USER_POOL_ID`       | ID do User Pool                                  | derivado via `!Ref`              |
| `COGNITO_CLIENT_ID`          | ID do App Client                                 | derivado via `!Ref`              |
| `<ENTIDADE>_TABLE_NAME`      | Nome físico de cada tabela DynamoDB              | `projeto-serverless-x-dev`       |

Frontend (`apps/web`, prefixo obrigatório `VITE_`, nada secreto):

| Variável                          | Descrição                          |
| --------------------------------- | ---------------------------------- |
| `VITE_API_BASE_URL`               | Base URL do API Gateway            |
| `VITE_AWS_REGION`                 | Região do Cognito                  |
| `VITE_COGNITO_USER_POOL_ID`       | User Pool ID                       |
| `VITE_COGNITO_USER_POOL_CLIENT_ID`| App Client ID                      |

- Toda variável nova deve ser adicionada aqui, no `serverless.yml` e no README do workspace.

### 23.10 Helpers obrigatórios em `services/api/src/lib/`

| Arquivo          | Exports obrigatórios                                                                 |
| ---------------- | ------------------------------------------------------------------------------------ |
| `powertools.ts`  | `logger`, `metrics`, `tracer` (singletons, criados fora do handler)                  |
| `dynamodb.ts`    | `docClient` (DocumentClient singleton), `getTableName(entity)`                        |
| `response.ts`    | `ok`, `created`, `noContent`, `list` — sempre aplicam o envelope `{ data, meta }`     |
| `event.ts`       | `parseEvent(event)` → tipo interno `{ body, path, query, headers, requestId, identity }` |
| `errors.ts`      | `AppError` e subclasses (seção 14), `toApiError(err)` → envelope de erro              |
| `config.ts`      | leitura/validação de env vars com Zod, cacheada na inicialização                      |
| `secrets.ts`     | leitura de Secrets Manager/SSM com cache e TTL                                        |

- Handlers usam apenas esses helpers; não acessam `event` cru nem `process.env` direto.

### 23.11 Catálogo de códigos de erro

| Código             | HTTP | Uso                                         |
| ------------------ | ---- | ------------------------------------------- |
| `VALIDATION_ERROR` | 400  | Falha de schema Zod                         |
| `UNAUTHORIZED`     | 401  | Token ausente/inválido                      |
| `FORBIDDEN`        | 403  | Sem permissão (grupo/escopo)                |
| `NOT_FOUND`        | 404  | Recurso inexistente                         |
| `CONFLICT`         | 409  | Conflito de escrita/idempotência            |
| `RATE_LIMITED`     | 429  | Throttling                                  |
| `INTERNAL_ERROR`   | 500  | Erro inesperado (mensagem genérica)         |

### 23.12 Frontend — libs e convenções

- Router: `react-router-dom` (rotas declarativas em `src/main.tsx`/`App.tsx`).
- Data fetching/estado remoto: `@tanstack/react-query` (configurado em `main.tsx`).
- Auth: `aws-amplify` (`Amplify.configure` em `src/lib/auth.ts`).
- Client HTTP central em `src/lib/api.ts`:
  - usa `VITE_API_BASE_URL`;
  - injeta o JWT da sessão Amplify em `Authorization`;
  - desembrulha o envelope `{ data, meta }` e lança erro tipado a partir de `{ error }`.
- Componentes em `src/components/`, um por arquivo, `PascalCase.tsx`, props tipadas.
- Hooks de dados em `src/hooks/`, um por recurso.
- `App.tsx` declara as rotas (`react-router-dom`); `main.tsx` monta `QueryClientProvider`
  e `BrowserRouter`, e chama `Amplify.configure` (via `src/lib/auth.ts`).
- `vite.config.ts` (obrigatório) registra o plugin React e o alias `@/`:

```ts
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
```

### 23.13 Arquivos de configuração obrigatórios na raiz

`.nvmrc` (`20`), `.yarnrc.yml`, `.editorconfig`, `.prettierrc`, `eslint.config.js`,
`tsconfig.base.json`, `package.json` (workspaces), `yarn.lock`, `vitest.config.ts`,
`docker-compose.yml`, `.gitignore`
(ignorar `node_modules`, `.serverless`, `dist`, `coverage`, `.env*` exceto `.env.example`,
`.yarn/cache`, `.yarn/install-state.gz`, `.pnp.*`; manter `.yarnrc.yml` e `.yarn/releases`),
`.env.example` por workspace.

### 23.14 CI/CD concreto

Workflows em `.github/workflows/`:

- `ci.yml` (gatilho `pull_request`): `yarn install --immutable`, `yarn lint`,
  `yarn typecheck`, `yarn test:coverage`.
- `deploy.yml` (gatilho `push` em `main` → `prod`; `workflow_dispatch` com input
  `stage` → `dev`): assume role OIDC e roda
  `yarn workspace @app/api deploy --stage <stage>`.

Secrets/vars esperados (nunca em texto plano):

| Nome                 | Tipo   | Uso                                   |
| -------------------- | ------ | ------------------------------------- |
| `AWS_ROLE_ARN`       | secret | Role assumida via OIDC                |
| `AWS_REGION`         | var    | Região do deploy                      |
| `SERVERLESS_ACCESS_KEY` | secret | License key do Serverless v4 (se aplicável) |

- Permissões do workflow: `id-token: write`, `contents: read`.
- Falha de qualquer check bloqueia merge/deploy.

### 23.15 Templates de `package.json` e `.yarnrc.yml`

`.yarnrc.yml` (raiz):

```yaml
nodeLinker: node-modules
```

`package.json` (raiz):

```json
{
  "name": "projeto-serverless",
  "version": "0.0.0",
  "private": true,
  "packageManager": "yarn@4.5.0",
  "engines": { "node": ">=20" },
  "workspaces": ["apps/*", "packages/*", "services/*"],
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write .",
    "typecheck": "yarn workspaces foreach -Apt --exclude @app/config run typecheck",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "build": "yarn workspace @app/web build"
  },
  "devDependencies": {
    "@vitest/coverage-v8": "^3",
    "eslint": "^9",
    "prettier": "^3",
    "typescript": "^5.6",
    "typescript-eslint": "^8",
    "vitest": "^3"
  }
}
```

- Todo workspace com código TypeScript expõe o script `typecheck`. `@app/config` é excluído
  (não contém fonte TS). `build` na raiz cobre apenas o frontend; o backend é empacotado
  pelo `serverless-esbuild` no `deploy`/`package`.

`services/api/package.json`:

```json
{
  "name": "@app/api",
  "version": "0.0.0",
  "private": true,
  "type": "commonjs",
  "scripts": {
    "dev": "serverless offline --stage dev",
    "deploy": "serverless deploy",
    "remove": "serverless remove",
    "logs": "serverless logs",
    "typecheck": "tsc --noEmit",
    "db:start": "docker compose up -d dynamodb",
    "db:setup": "node scripts/create-tables.mjs"
  },
  "dependencies": {
    "@app/shared": "workspace:*",
    "@aws-lambda-powertools/logger": "^2",
    "@aws-lambda-powertools/metrics": "^2",
    "@aws-lambda-powertools/tracer": "^2",
    "@aws-sdk/client-dynamodb": "^3",
    "@aws-sdk/client-secrets-manager": "^3",
    "@aws-sdk/client-ssm": "^3",
    "@aws-sdk/lib-dynamodb": "^3",
    "@middy/core": "^6",
    "@middy/http-error-handler": "^6",
    "@middy/http-json-body-parser": "^6",
    "zod": "^3.23"
  },
  "devDependencies": {
    "@types/aws-lambda": "^8",
    "@types/node": "^20",
    "aws-sdk-client-mock": "^4",
    "esbuild": "^0.24",
    "serverless": "^4",
    "serverless-esbuild": "^1",
    "serverless-offline": "^14"
  }
}
```

`packages/shared/package.json`:

```json
{
  "name": "@app/shared",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "exports": { ".": "./src/index.ts" },
  "scripts": { "typecheck": "tsc --noEmit" },
  "dependencies": { "zod": "^3.23" }
}
```

`packages/config/package.json`:

```json
{
  "name": "@app/config",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    "./eslint": "./eslint.config.js"
  }
}
```

`apps/web/package.json`:

```json
{
  "name": "@app/web",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@app/shared": "workspace:*",
    "@tanstack/react-query": "^5",
    "aws-amplify": "^6",
    "react": "^19",
    "react-dom": "^19",
    "react-router-dom": "^7"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^4",
    "vite": "^6"
  }
}
```

### 23.16 `packages/config`

- `eslint.config.js` exporta a base flat config (default export) consumida pelo
  `eslint.config.js` da raiz.
- O `tsconfig.base.json` canônico vive na **raiz** (seção 23.3); `packages/config` fornece
  apenas a base de ESLint, evitando duplicar a config de TypeScript.
- Regras da base (mínimas):

```js
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'error',
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
);
```

- `eslint.config.js` da raiz reexporta: `export { default } from '@app/config/eslint';`.

### 23.17 `packages/shared`

- Consumido como **código TypeScript fonte** via workspace (`workspace:*`) + alias
  `@app/shared` (tsconfig e bundler). Não há build separado.
- Estrutura:

```
packages/shared/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts          # reexporta schemas e types
    ├── schemas/
    └── types/
```

- `src/index.ts` faz `export * from './schemas';` e `export * from './types';`.
- Nenhum schema de negócio é definido aqui por este arquivo; apenas a infraestrutura.

### 23.18 `serverless.yml` completo (referência canônica)

```yaml
service: projeto-serverless-api
frameworkVersion: '4'

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  architecture: arm64
  stage: ${opt:stage, 'dev'}
  httpApi:
    payload: '2.0'
    cors:
      allowedOrigins: [${env:CORS_ORIGIN, 'http://localhost:5173'}]
      allowedHeaders: [Content-Type, Authorization]
      allowedMethods: [GET, POST, PUT, PATCH, DELETE, OPTIONS]
      maxAge: 3600
    authorizers:
      cognitoJwt:
        type: jwt
        identitySource: $request.header.Authorization
        issuerUrl:
          Fn::Sub: https://cognito-idp.${AWS::Region}.amazonaws.com/${CognitoUserPool}
        audience:
          - Ref: CognitoUserPoolClient
  environment:
    STAGE: ${self:provider.stage}
    AWS_REGION: ${self:provider.region}
    LOG_LEVEL: ${self:custom.logLevel.${self:provider.stage}}
    POWERTOOLS_SERVICE_NAME: projeto-serverless-api
    POWERTOOLS_METRICS_NAMESPACE: ProjetoServerless/${self:provider.stage}
    CORS_ORIGIN: ${env:CORS_ORIGIN, 'http://localhost:5173'}
    COGNITO_USER_POOL_ID:
      Ref: CognitoUserPool
    COGNITO_CLIENT_ID:
      Ref: CognitoUserPoolClient
  tracing:
    lambda: true
    httpApi: true
  logs:
    httpApi: true
  iam:
    role:
      statements:
        - Effect: Allow
          Action: [dynamodb:GetItem, dynamodb:PutItem, dynamodb:Query]
          Resource:
            - !GetAtt HealthTable.Arn
            - !Sub ${HealthTable.Arn}/index/*

custom:
  logLevel:
    dev: DEBUG
    prod: INFO
  esbuild:
    bundle: true
    minify: false
    sourcemap: true
    target: node20
    platform: node
    format: cjs
    external: ['@aws-sdk/*']

functions:
  health:
    handler: src/functions/health/handler.handler
    events:
      - httpApi:
          method: GET
          path: /v1/health
          authorizer: none

resources:
  Resources:
    CognitoUserPool:
      Type: AWS::Cognito::UserPool
      Properties:
        UserPoolName: projeto-serverless-users-${self:provider.stage}
        UsernameAttributes: [email]
        AutoVerifiedAttributes: [email]
        Policies:
          PasswordPolicy:
            MinimumLength: 8
            RequireUppercase: true
            RequireLowercase: true
            RequireNumbers: true
            RequireSymbols: true
    CognitoUserPoolClient:
      Type: AWS::Cognito::UserPoolClient
      Properties:
        UserPoolId: !Ref CognitoUserPool
        ClientName: projeto-serverless-web-${self:provider.stage}
        GenerateSecret: false
        SupportedIdentityProviders: [COGNITO]
        ExplicitAuthFlows:
          - ALLOW_USER_SRP_AUTH
          - ALLOW_REFRESH_TOKEN_AUTH
    HealthTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: projeto-serverless-health-${self:provider.stage}
        BillingMode: PAY_PER_REQUEST
        AttributeDefinitions:
          - AttributeName: PK
            AttributeType: S
          - AttributeName: SK
            AttributeType: S
        KeySchema:
          - AttributeName: PK
            KeyType: HASH
          - AttributeName: SK
            KeyType: RANGE
        PointInTimeRecoverySpecification:
          PointInTimeRecoveryEnabled: true

plugins:
  - serverless-esbuild
  - serverless-offline
```

- O bloco `authorizers.cognitoJwt` usa intrinsic functions na forma longa (`Fn::Sub`,
  `Ref`), que o Serverless encaminha ao CloudFormation. Não hardcode `issuerUrl`/`audience`.
  Se a versão do Serverless rejeitar intrinsics no schema do authorizer, o fallback é
  publicar `issuerUrl`/`audience` como outputs do stack e consumi-los via variável
  `${cf:...}` (ou `Fn::ImportValue`) na configuração do authorizer.
- `CORS_ORIGIN` é variável de ambiente por stage; em `prod` deve apontar para o domínio do
  Amplify. Nunca use `*`.
- Cada nova entidade adiciona sua própria tabela em `resources.Resources` e a permissão
  IAM correspondente (least privilege).

### 23.19 Vitest (workspace)

`vitest.config.ts` (raiz):

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['packages/shared', 'services/api', 'apps/web'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['services/**/src/**', 'packages/shared/src/**'],
      exclude: ['**/*.test.ts', '**/*.d.ts', '**/index.ts'],
      thresholds: { lines: 80, branches: 80, functions: 80, statements: 80 },
    },
  },
});
```

`services/api/vitest.config.ts` (resolver de aliases para testes):

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@app/shared': fileURLToPath(new URL('../../packages/shared/src/index.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    env: { DYNAMODB_ENDPOINT: 'http://localhost:8000' },
  },
});
```

- Testes de integração usam `DYNAMODB_ENDPOINT`; `lib/dynamodb.ts` respeita essa env para
  apontar ao dynamodb-local (ver 23.20).
- `apps/web` usa `environment: 'jsdom'` quando houver testes de componente.

`services/api/vitest.setup.ts` (credenciais/região fake para o SDK):

```ts
process.env.AWS_REGION = 'us-east-1';
process.env.STAGE = 'test';
process.env.AWS_ACCESS_KEY_ID = 'test';
process.env.AWS_SECRET_ACCESS_KEY = 'test';
```

### 23.20 Desenvolvimento local — arquivos concretos

`docker-compose.yml` (raiz):

```yaml
services:
  dynamodb:
    image: amazon/dynamodb-local:latest
    container_name: projeto-serverless-dynamodb
    command: ['-jar', 'DynamoDBLocal.jar', '-sharedDb', '-dbPath', '/home/dynamodblocal/data']
    ports:
      - '8000:8000'
    volumes:
      - dynamodb-data:/home/dynamodblocal/data

volumes:
  dynamodb-data:
```

`services/api/scripts/create-tables.mjs`:

```js
import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT ?? 'http://localhost:8000',
  credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
});

const stage = process.env.STAGE ?? 'dev';

await client.send(
  new CreateTableCommand({
    TableName: `projeto-serverless-health-${stage}`,
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
  }),
);
```

- `lib/dynamodb.ts` deve usar `DYNAMODB_ENDPOINT` quando definido (dev/test) e o endpoint
  padrão da AWS em `dev`/`prod`.
- Em dev local o authorizer JWT pode ser desabilitado apenas no profile do
  `serverless-offline`, nunca em `dev`/`prod` reais.

### 23.21 Ordem de bootstrap esperada

1. Raiz: `package.json`, `.yarnrc.yml`, `tsconfig.base.json`, `eslint.config.js`,
   `.prettierrc`, `.editorconfig`, `.nvmrc`, `docker-compose.yml`, `vitest.config.ts`,
   `.gitignore`.
2. `packages/config` (base de ESLint) e `packages/shared` (Zod + `src/index.ts`).
3. `services/api` (`serverless.yml`, `package.json`, `tsconfig.json`, `src/lib/*`,
   `scripts/create-tables.mjs`, `vitest.config.ts`, `vitest.setup.ts`, função de exemplo
   em `src/functions/health/`).
4. `apps/web` (Vite + React + Amplify + client HTTP + uma rota de exemplo).
5. Workflows de CI/CD, `.env.example` por workspace e README por workspace.
6. Rodar `yarn install` e commitar `yarn.lock`; validar `yarn lint && yarn typecheck && yarn test`.

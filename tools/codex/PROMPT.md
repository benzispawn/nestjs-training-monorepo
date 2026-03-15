# PROMPT.md

Você está trabalhando em um monorepo de treinamento prático de NestJS.

Seu papel é atuar como um engenheiro de software disciplinado, objetivo e incremental, respeitando a estrutura pedagógica do repositório e evitando complexidade desnecessária.

---

# 1. Missão do repositório

Este repositório existe para treinar desenvolvedores em assuntos específicos de backend com NestJS, organizados em trilhas independentes e autocontidas.

Cada trilha deve:

- ensinar um assunto principal
- ser simples de iniciar
- ter documentação mínima
- permitir execução local fácil
- ter testes coerentes com o foco
- evitar estrutura enterprise desnecessária

---

# 2. Stack principal

Considere como padrão do repositório:

- NestJS
- npm workspaces
- Zod
- Jest para testes unitários
- TAP para testes e2e
- Bruno para exploração manual, sem automação
- TypeScript

---

# 3. Estrutura esperada do repositório

## Diretórios principais

- `apps/`: trilhas e desafios
- `packages/`: configs, shared e templates
- `tools/`: scripts utilitários, geradores e base do Codex
- `docs/`: documentação geral e convenções
- `bruno/`: exemplos e ambientes compartilhados

## Estrutura mínima de uma trilha

Toda trilha deve conter, no mínimo:

- `src/`
- `test/unit/`
- `test/e2e/`
- `docs/README.md`
- `docs/TASK.md`
- `docs/DONE.md`
- `package.json`
- `tsconfig.json`

Dependendo do tipo da trilha, também pode conter:

- `jest.config.js`
- `.env.example`
- `bruno/`

---

# 4. Antes de alterar qualquer coisa

Antes de criar, editar ou remover arquivos, leia primeiro os seguintes documentos, se existirem:

- `README.md`
- `docs/getting-started/quickstart.md`
- `docs/conventions/trail-structure.md`
- `docs/conventions/codex-rules.md`
- `tools/codex/rules/repo-rules.md`
- `tools/codex/rules/trail-rules.md`

Se estiver trabalhando em uma trilha específica, leia também:

- `apps/<categoria>/<trilha>/docs/README.md`
- `apps/<categoria>/<trilha>/docs/TASK.md`
- `apps/<categoria>/<trilha>/docs/DONE.md`

Nunca edite uma trilha sem antes entender:

- o objetivo pedagógico
- o assunto principal
- os critérios de conclusão
- o escopo real da tarefa

---

# 5. Regras gerais de comportamento

## 5.1 Simplicidade primeiro

Prefira a solução mais simples que:

- funcione
- seja legível
- seja didática
- respeite o escopo da trilha

Não introduza complexidade de arquitetura sem necessidade clara.

## 5.2 Uma trilha, um foco principal

Cada trilha deve ensinar principalmente um assunto.

Evite misturar vários objetivos ao mesmo tempo, a menos que a trilha seja explicitamente um desafio integrador.

## 5.3 Não inventar estrutura fora do padrão

Não crie diretórios, convenções ou fluxos fora do padrão do repositório sem necessidade explícita.

## 5.4 Não adicionar dependências sem motivo

Toda nova dependência deve ter justificativa clara.

Antes de sugerir ou adicionar uma dependência, considere:

- já existe algo equivalente no repo?
- é realmente necessária?
- aumenta a complexidade da trilha?
- torna a trilha menos didática?

## 5.5 Mudanças incrementais

Prefira mudanças pequenas, testáveis e reversíveis.

Evite refactors extensos sem necessidade.

---

# 6. Convenções por tipo de trilha

## 6.1 Trilhas REST

Devem preferencialmente conter:

- `AppModule`
- controller
- service
- ao menos um endpoint funcional
- um teste unitário
- um teste e2e

## 6.2 Trilhas de validação

Quando o foco for validação:

- usar Zod como ferramenta principal
- deixar claro onde a validação acontece
- documentar formato de entrada esperado
- incluir cenários válidos e inválidos

## 6.3 Trilhas de testes

Quando o foco for testes:

- Jest para unitários
- TAP para e2e
- testes devem ser claros e didáticos
- evitar mocks excessivos sem necessidade

## 6.4 Trilhas GraphQL

Quando o foco for GraphQL:

- deixar resolvers, schema e fluxo bem claros
- documentar queries/mutations principais
- se houver federation, explicar responsabilidades de cada parte

## 6.5 Trilhas Supergraph

Quando a trilha envolver supergraph:

- separar claramente gateway e subgraphs
- documentar portas
- documentar dependências entre serviços
- explicar como subir os componentes
- explicar como validar a composição

---

# 7. Regras para documentação

Toda trilha deve manter documentação mínima coerente.

## `docs/README.md`

Deve explicar:

- objetivo da trilha
- o que será praticado
- como executar
- como testar
- endpoints ou fluxo principal

## `docs/TASK.md`

Deve explicar:

- contexto
- requisitos
- restrições
- o que precisa ser implementado

## `docs/DONE.md`

Deve explicar:

- critérios de aceite
- quando a trilha pode ser considerada concluída

Sempre mantenha a documentação alinhada ao código.

Se o comportamento mudou, atualize a documentação.

---

# 8. Regras para leitura de logs, erros e saídas de comando

Você deve tratar logs, stack traces e mensagens de erro como fontes primárias de diagnóstico.

## 8.1 Sempre ler os logs com atenção

Ao encontrar falhas, leia cuidadosamente:

- mensagens de erro
- stack traces
- saída de `npm run`
- saída de testes
- erros de compilação TypeScript
- erros de bootstrap do NestJS
- falhas de importação
- erros de path/workspace
- erros de configuração de Jest ou TAP

## 8.2 Não ignorar detalhes do erro

Não responda com suposições genéricas se o log já aponta uma causa provável.

Extraia dos logs:

- arquivo
- linha
- tipo de erro
- módulo afetado
- comando que falhou
- contexto de execução

## 8.3 Priorizar causa raiz

Ao analisar logs, busque primeiro a causa raiz, e não apenas o sintoma final.

Exemplos de causa raiz comuns:

- arquivo não encontrado
- workspace incorreto
- template ausente
- import quebrado
- tsconfig inválido
- dependência faltando
- script mal definido
- teste apontando para caminho errado

## 8.4 Se usar logs na resposta, sintetize

Ao relatar um problema, organize a análise assim:

1. o que falhou
2. onde falhou
3. causa provável
4. correção sugerida
5. impacto em outros arquivos, se houver

## 8.5 Não mascarar incerteza

Se os logs forem insuficientes, diga claramente o que está evidente e o que ainda é hipótese.

---

# 9. Regras para implementar mudanças

Quando for implementar algo, siga este processo mental:

1. identificar a trilha e o objetivo
2. ler documentação e regras
3. localizar arquivos afetados
4. entender o estado atual
5. propor a menor mudança viável
6. implementar
7. revisar impactos
8. atualizar documentação
9. validar scripts e testes relacionados

---

# 10. Regras para criação de novas trilhas

Ao criar uma nova trilha:

- respeite a categoria informada
- use prefixo numérico no nome
- mantenha foco em um assunto principal
- gere estrutura mínima obrigatória
- inclua docs mínimas
- use scripts previsíveis

Exemplos de nomes válidos:

- `01-nest-basics`
- `02-zod-request-validation`
- `03-jest-unit-services`
- `04-supergraph`

---

# 11. Regras para testes

## Unitários

- usar Jest
- manter testes pequenos e claros
- focar no comportamento principal
- evitar mockar tudo sem necessidade

## E2E

- usar TAP
- validar fluxo real da aplicação
- priorizar casos simples e representativos
- cobrir sucesso e ao menos um cenário de erro quando fizer sentido

## Importante

Não criar testes só para “ter teste”.
Os testes devem reforçar o aprendizado da trilha.

---

# 12. Regras para Bruno

Bruno deve ser usado apenas como suporte manual.

Pode incluir:

- collections
- requests REST
- requests GraphQL
- environments

Não criar automação de Bruno neste repositório, a menos que isso seja explicitamente solicitado.

---

# 13. O que evitar

Evite:

- criar camadas artificiais
- adicionar DDD/hexagonal sem necessidade pedagógica
- criar abstrações prematuras
- adicionar libs sem motivo claro
- mudar muitos arquivos fora do escopo
- deixar docs desatualizadas
- ignorar logs e saída de testes
- propor refactor amplo quando a tarefa é localizada

---

# 14. Formato esperado das respostas e entregas

Quando estiver propondo uma mudança, seja direto e estruturado.

Sempre que possível:

- diga quais arquivos devem ser criados ou alterados
- explique brevemente o motivo
- mantenha coerência com a trilha
- preserve a simplicidade

Se estiver corrigindo erro com base em logs, deixe explícito:

- erro observado
- causa provável
- correção sugerida

---

# 15. Prioridades do repositório

Em caso de dúvida, priorize nesta ordem:

1. clareza didática
2. simplicidade
3. consistência com o padrão do repo
4. executabilidade local
5. qualidade dos testes
6. elegância arquitetural

---

# 16. Instrução final

Antes de produzir qualquer alteração:

- leia as regras
- leia a trilha
- leia os logs, se existirem
- preserve o padrão
- faça o mínimo necessário para resolver bem o problema
- faça as tarefas em etapas entre 3 à 20 passos.
- apresente um plano de execução antes de começar a fazer a tarefa
- faça perguntas se for necessário
- os padrões a serem seguidos estão dentro da pasta `<root>/tools/codex` e os logs também

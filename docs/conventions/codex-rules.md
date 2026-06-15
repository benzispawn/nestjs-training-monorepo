# Codex Rules

O Codex deve seguir estas regras ao criar ou editar trilhas.

## Regras gerais

- não criar estrutura fora do padrão do repositório
- preferir simplicidade
- não adicionar dependências sem necessidade clara
- manter uma trilha focada em um assunto principal
- toda trilha deve incluir documentação mínima

## Documentação mínima

- `docs/README.md`
- `docs/TASK.md`
- `docs/DONE.md`

## Scripts

Usar nomes previsíveis quando aplicável:

- `start`
- `start:dev`
- `start:mocks`
- `build`
- `lint`
- `test`
- `test:unit`
- `test:e2e`
- `check`

## Testes

- Jest para testes unitários
- TAP para testes e2e
- Bruno apenas para exploração manual, sem automação

## Lint

- usar ESLint 9 com flat config no root
- usar `npm run lint` antes de concluir mudancas de codigo
- templates devem passar em `npm run check:templates` depois de gerados

## GraphQL Supergraph

Quando a trilha envolver supergraph:

- separar gateway e subgraphs claramente
- documentar portas e fluxo
- incluir explicação de composição
- consumir subgraphs por clients HTTP quando a trilha simular servicos externos

## Servicos externos simulados

Quando a trilha precisar de dependencias externas:

- usar clients dedicados, por exemplo `FeatureToggleClient` ou `SupergraphClient`
- manter mocks HTTP locais em `src/mock-services.ts`
- expor script `start:mocks`
- documentar portas e variaveis de ambiente
- preferir `node:http` antes de adicionar dependencias novas

## Templates suportados

O gerador aceita os tipos:

- `generic`
- `rest`
- `feature-toggle`
- `feature-toggle-removal`
- `supergraph`
- `bff-endpoint`

Nao use tipos sem template executavel.

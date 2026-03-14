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

## GraphQL Supergraph

Quando a trilha envolver supergraph:
- separar gateway e subgraphs claramente
- documentar portas e fluxo
- incluir explicação de composição

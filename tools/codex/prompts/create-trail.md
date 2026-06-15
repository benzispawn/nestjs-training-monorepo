Crie ou complete uma trilha neste monorepo seguindo rigorosamente as convenções.

## Entrada esperada

- categoria da trilha
- nome da trilha
- tipo da trilha: generic, rest, feature-toggle, feature-toggle-removal, supergraph ou bff-endpoint
- objetivo pedagógico

## Regras

- manter a trilha autocontida
- criar apenas o necessário
- documentação mínima obrigatória:
  - docs/README.md
  - docs/TASK.md
  - docs/DONE.md
- scripts previsíveis
- foco em um assunto principal

## Estrutura mínima

- src/
- test/unit/
- test/e2e/
- docs/
- bruno/
- package.json
- tsconfig.json
- jest.config.js
- .env.example

## Testes

- usar Jest para unitários
- usar TAP para e2e
- Bruno apenas para uso manual

## Observação

Use `supergraph` para trilhas de alteracao ou criacao de query federada.
Use `bff-endpoint` para trilhas de endpoint completo com orquestracao.

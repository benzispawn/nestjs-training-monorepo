# NestJS Training Monorepo

Monorepo para treinar NestJS por trilhas práticas e isoladas.

## Objetivos

- praticar NestJS por assunto
- manter cada trilha autocontida
- facilitar execução, teste e estudo
- padronizar estrutura e documentação
- permitir automação de criação com Codex

## Stack principal

- NestJS
- Zod
- Jest
- TAP
- Bruno
- npm workspaces

## Estrutura

- `apps/`: trilhas e desafios
- `packages/`: configs, shared e templates
- `tools/`: scripts utilitários e base do Codex
- `docs/`: convenções e onboarding
- `bruno/`: ambientes e exemplos compartilhados

## Primeiros passos

```bash
npm install
npm run check:repo
npm run list:trails
```

## Gerar trilha

```bash
npm run generate:trail -- --category feature-flags --name 01-add-toggle --type feature-toggle
```

Tipos suportados:

- `generic`
- `rest`
- `feature-toggle`
- `feature-toggle-removal`
- `supergraph`
- `bff-endpoint`

Templates que simulam servicos externos usam clients HTTP dedicados e podem expor:

```bash
npm --workspace @trails/<nome-da-trilha> run start:mocks
```

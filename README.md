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

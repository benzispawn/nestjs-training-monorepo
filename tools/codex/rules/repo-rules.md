# Repo Rules

Você está trabalhando em um monorepo de trilhas práticas de NestJS.

## Objetivo

Criar trilhas pequenas, focadas e executáveis.

## Restrições

- usar npm workspaces
- manter estrutura consistente
- evitar complexidade desnecessária
- não transformar o repo em produto enterprise
- cada trilha deve ser didática e autocontida

## Estrutura obrigatória de uma trilha

- `src/`
- `test/`
- `docs/README.md`
- `docs/TASK.md`
- `docs/DONE.md`
- `package.json`

## Stack

- NestJS
- Zod
- Jest
- TAP
- Bruno

## Padrões

- nomes de trilhas com prefixo numérico
- categoria no caminho, por exemplo `apps/validation/01-zod-request-validation`
- código mínimo para rodar e concluir a tarefa

# Trail Structure

Toda trilha deve ser simples, autocontida e objetiva.

## Estrutura mínima esperada

- `src/`
- `test/unit/`
- `test/e2e/`
- `docs/README.md`
- `docs/TASK.md`
- `docs/DONE.md`
- `package.json`
- `tsconfig.json`

## Tipos de template suportados

- `generic`: esqueleto simples para trilhas sem aplicacao completa
- `rest`: endpoint REST basico com controller, service e testes
- `feature-toggle`: adicionar toggle, expor contrato e garantir fallback
- `feature-toggle-removal`: remover toggle legado e validar consumidores
- `supergraph`: praticar queries federadas, DTOs e mapeamentos sem dependencia GraphQL real
- `bff-endpoint`: endpoint completo com orquestracao, regra de negocio, logs e metricas

## Regras

- a trilha deve focar em um assunto principal
- deve conter apenas o necessário para executar a tarefa
- scripts devem usar nomes previsíveis
- a documentação deve explicar objetivo, execução e critérios de aceite
- templates com dependencias externas devem usar clients HTTP dedicados e mocks locais em `start:mocks`

## Scripts recomendados

- `start`
- `start:dev`
- `start:mocks`
- `build`
- `lint`
- `test`
- `check`

## Validacao de templates

Ao alterar templates ou o gerador, execute:

```bash
npm run check:templates
```

Esse comando gera cada tipo de trilha em `/tmp` e valida build, lint, testes unitarios e testes e2e.

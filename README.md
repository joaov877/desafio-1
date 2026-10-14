# Desafio 1.1 — Containerização segura e CI

API Express com listagem e cadastro em memória. O projeto original está em JavaScript; `npm run build` copia os arquivos executáveis de `src/` para `dist/`, que é o diretório levado à imagem final. Isso atende à separação de artefatos do multi-stage, mas não é compilação TypeScript.

## Executar localmente

```bash
npm ci
npm test
npm run build
npm start
```

## Construir e executar Docker

```bash
docker build -t desafio-1-1 .
docker run --rm -p 3000:3000 desafio-1-1
```

Teste `GET http://localhost:3000/api/users` e `POST http://localhost:3000/api/users` com JSON `{"name":"João","email":"joao@example.com"}`.

## Segurança

O workflow `.github/workflows/ci.yml` executa testes, auditoria npm, Gitleaks e Trivy. Para bloquear PRs na interface do GitHub, configure em **Settings → Branches / Rulesets** uma regra para `main` exigindo os checks apropriados. A disponibilidade dos nomes de checks depende do primeiro workflow executado.

# Front-end (Next.js)

## Execucao local

```bash
npm install
npm run dev
```

## Deploy no Render (topologia B - proxy no Next)

Este front usa rewrite/proxy no `next.config.ts` para encaminhar:
- `/api/:path*`
- `/customer/:path*`

para o backend definido em `BACKEND_PROXY_TARGET`.

### Variaveis obrigatorias

- `BACKEND_PROXY_TARGET=https://api-gateway-ye0f.onrender.com`
- `NEXT_PUBLIC_API_BASE_URL=` (deixar vazio no modo proxy)
- `NEXT_PUBLIC_ANALYZE_API_BASE_URL=https://analyze-backend-5jyg.onrender.com`

Se `BACKEND_PROXY_TARGET` nao estiver definido em producao, o build falha por seguranca de configuracao.

## Checklist rapido de validacao

- Login funciona e cria sessao
- `GET /api/auth-status` retorna autenticado apos login
- Refresh da pagina mantem sessao
- Rotas de cliente (`/customer/*`) respondem sem erro de CORS

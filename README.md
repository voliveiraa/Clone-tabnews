# MediaLake

Site de fundamentos de broadcast, baseado no código aberto do
[TabNews](https://github.com/filipedeschamps/tabnews.com.br) (licença MIT, mantida em `LICENSE`).
Mesma estrutura (Relevantes, Recentes, páginas de conteúdo, login, publicar), mas **sem cadastro público**:
existe uma única conta, a sua, que publica pelo próprio site.

## O que é preciso

| Item | Para quê | Obrigatório |
|---|---|---|
| Banco PostgreSQL | guarda usuário e publicações | sim (gratuito no Neon ou no Postgres da Vercel) |
| Serviço de e-mail | recuperar senha / ativar contas | **não** (cadastro está fechado) |
| Mensageria, Redis, Umami, Axiom | | **não** |

## Subir na Vercel

1. **Banco.** Na Vercel: Storage → Neon (ou crie em neon.tech). Copie a `DATABASE_URL`
   (formato `postgres://usuario:senha@host/banco?sslmode=require`).
2. **Variáveis de ambiente** do projeto na Vercel (Settings → Environment Variables):

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | a string do banco |
   | `ADMIN_EMAIL` | seu e-mail de login |
   | `ADMIN_USERNAME` | nome de usuário (aparece na URL dos posts); padrão `admin` |
   | `ADMIN_PASSWORD` | sua senha (mínimo 8 caracteres) |

   Mantenha ligada a opção **Automatically expose System Environment Variables**
   (Settings → Environment Variables). O site usa `NEXT_PUBLIC_VERCEL_ENV` para saber que roda na Vercel.
3. **Deploy.** A cada build a Vercel executa `npm run vercel-build`, que:
   aplica as migrations → cria/atualiza o admin → gera o site.
4. **Domínio.** Settings → Domains → `medialake.com.br`.
5. Se o seu GitHub Action usa `vercel build`, rode antes `vercel pull --environment=production`
   para trazer as variáveis acima.

Node 24 é exigido (`engines` no `package.json`); a Vercel escolhe sozinha.

## Publicar

Acesse `/login`, entre com `ADMIN_EMAIL` e `ADMIN_PASSWORD` e use **+** (Publicar novo conteúdo).
O endereço do post fica `medialake.com.br/<usuario>/<titulo-do-post>`.

**Trocar a senha:** mude `ADMIN_PASSWORD` na Vercel e faça um novo deploy (o build atualiza a senha).

## Rodar local

```bash
npm ci
npm run local:setup   # sobe o Postgres (Docker), roda migrations e cria o admin (.env.development)
npm run dev           # http://localhost:3000   login: admin@medialake.local / troque-esta-senha
```

Sem Docker, aponte `DATABASE_URL` em `.env.development` para qualquer Postgres e use
`npm run local:migrate && npm run local:admin`.

## O que foi alterado em relação ao TabNews

- Cadastro público, recuperação de senha, FAQ, museu, contato, termos, busca (Google) e analytics (Umami) removidos.
- Anônimos não têm a permissão `create:user`: a API de cadastro responde 403.
- Marca, ícones, cores e textos trocados para MediaLake.
- Conexão por `DATABASE_URL`; script `infra/scripts/create-admin.js` cria a conta de administrador.
- TabCoins, votos e comentários continuam no código do TabNews; só o admin está logado, então na prática só ele os usa.

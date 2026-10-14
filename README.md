# MediaLake (Next.js + PostgreSQL)

Site de fundamentos de broadcast no formato do TabNews: lista numerada de publicações, páginas de post,
tópicos e RSS. Os posts ficam no **PostgreSQL** e são escritos pelo próprio site, em `/admin`.
**Sem contas de usuário:** existe uma única senha de admin, definida em variável de ambiente.

## Subir na Vercel

1. **Banco:** na Vercel, Storage → Neon (grátis), ou crie em neon.tech. Copie a `DATABASE_URL`
   (`postgres://usuario:senha@host/banco?sslmode=require`).
2. **Variáveis de ambiente** (Settings → Environment Variables):

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | string de conexão do Postgres |
   | `ADMIN_PASSWORD` | a senha do /admin (use uma senha longa e só sua) |

3. Suba o código para o GitHub e faça o deploy. A tabela `posts` é criada sozinha na primeira consulta
   (não há migrations para rodar).
4. Domínio: Settings → Domains → `medialake.com.br`.
5. Se o seu GitHub Action usa `vercel build`, rode antes `vercel pull --environment=production`.

## Publicar

Acesse `medialake.com.br/admin`, entre com a senha e use **+ Nova publicação**: título, tópico, data,
resumo (opcional) e texto em Markdown (títulos, listas, tabelas, código, imagens por URL).
Dá para salvar como **rascunho**, editar e excluir. Publicou, já está no ar (sem novo deploy).

Para trocar a senha: mude `ADMIN_PASSWORD` na Vercel e faça redeploy.

## Tópicos

Edite `content/topics.json` (`slug`, `name`, `description`) e faça deploy. Os tópicos iniciais:
Vídeo digital, Cor e HDR, Sinais e SDI, Sincronismo, Vídeo sobre IP, Codecs e arquivos, Áudio.

## Rodar local

```bash
npm install
export DATABASE_URL=postgres://usuario:senha@localhost:5432/medialake
export ADMIN_PASSWORD=uma-senha
npm run seed     # opcional: importa 3 posts de exemplo da pasta seed/
npm run dev      # http://localhost:3000
```

## Segurança do admin

- A senha é comparada no servidor; a sessão é um cookie assinado, `httpOnly` e `sameSite=strict`, que dura 8 horas
  e só vale em `/admin`.
- Senha errada espera ~1 s antes de responder, o que freia tentativas em sequência. Use uma senha longa.
- `/admin` não é indexado (`robots`) e as ações de salvar e excluir revalidam a sessão no servidor.

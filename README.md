# MediaLake (Next.js + PostgreSQL)

Site de fundamentos de broadcast no formato do TabNews: lista numerada de publicações, páginas de post,
tópicos e RSS. Os posts ficam no **PostgreSQL** e são escritos pelo próprio site, em `/admin`.
O **admin** entra com o usuário `admin` e a senha da variável `ADMIN_PASSWORD`. **Autores** criam conta em
`/cadastro` e só publicam depois de aprovados pelo admin; cada autor edita apenas os próprios posts.
Tópicos e autores são gerenciados só pelo admin.

## Subir na Vercel

1. **Banco:** na Vercel, Storage → Neon (grátis), ou crie em neon.tech. Copie a `DATABASE_URL`
   (`postgres://usuario:senha@host/banco?sslmode=require`).
2. **Variáveis de ambiente** (Settings → Environment Variables):

   | Variável | Valor |
   |---|---|
   | `DATABASE_URL` | string de conexão do Postgres |
   | `ADMIN_PASSWORD` | a senha do /admin (use uma senha longa e só sua) |
   | `BLOB_STORE_ID` (ou `BLOB_READ_WRITE_TOKEN`) | criada ao conectar um **Vercel Blob** (Storage → Blob) ao projeto; ativa o envio de fotos |

   As integrações podem criar as variáveis com prefixo (ex.: `storage_DATABASE_URL`); o site aceita os dois nomes.

3. Suba o código para o GitHub e faça o deploy. As tabelas são criadas sozinhas na primeira consulta
   (não há migrations para rodar).
4. Domínio: Settings → Domains → `medialake.com.br`.
5. Se o seu GitHub Action usa `vercel build`, rode antes `vercel pull --environment=production`.

## Publicar

Acesse `medialake.com.br/admin` (ou **Entrar**, no canto do topo) e use **+ Nova publicação**: título, tópico, data,
resumo (opcional) e texto em Markdown (títulos, listas, tabelas, código, imagens). O botão **📷 Inserir foto**
envia a imagem (JPG, PNG, WebP ou GIF, até 4 MB) para o Vercel Blob e coloca no texto.
Dá para salvar como **rascunho**, editar e excluir. Publicou, já está no ar (sem novo deploy).

Para trocar a senha: mude `ADMIN_PASSWORD` na Vercel e faça redeploy (isso desconecta todo mundo, admin e autores).

## Autores

Em **Admin → Autores**: aprovar, bloquear ou excluir contas. Bloquear tira o acesso na hora; excluir mantém
os posts no site, sem autor.

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

- A senha é comparada no servidor; a sessão é um cookie assinado, `httpOnly` e `sameSite=strict`, que dura 30 dias
  e só vale em `/admin`.
- Senha errada espera ~1 s antes de responder, o que freia tentativas em sequência. Use uma senha longa.
- `/admin` não é indexado (`robots`) e as ações de salvar e excluir revalidam a sessão no servidor.

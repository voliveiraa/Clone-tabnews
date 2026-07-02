# Clone-tabnews

# Implementação do Tabnews para o curso.dev

# Implementação de website com Next.js 13.1.6 e React 18.2.0, executado em Node.js LTS Hydrogen (v18).

Versões utilizadas -

° Versão do node.js - lts/hydrogen
° Versão do next - 13.1.6 - controla e orquestra tudo o que está acontecendo (limites de cada coisa back e front end)
° Versão do react - 18.2.0 - responsável por criar colocar os itens
° Versão do react-dom - 18.2.0

*Foi criado o .nvmrc para padronizar a versão correta que é utilizado no Tabnews.
Nesse projeto foi rodado o comando - nvm alias defaut lts/hydrogen para deixar como defaut a versão utilizada no projeto.

Para teste de execução de inicio foi verificardo as versões de cada tool - node -v, nvm -v

1-nvm install lts/hydrogen

2 - Foi criado o package.jason

O package-lock.json é criado automaticamente pelo npm quando você instala dependências no seu projeto. A diferença entre eles é que:

O package.json tem uma visão mais macro do projeto, salvando informações gerais e as dependências principais (com possibilidade de aceitar versões compatíveis);

Já o package-lock.json congela a versão exata de cada dependência e subdependência, garantindo que todos que clonarem o projeto terão exatamente o mesmo ambiente.

# npm

O NPM (Node Package Manager) é o gerenciador de pacotes do Node.js
npm init
npm install next@version
npm install react@version
npm install react-dom@version

# index.js

Para o teste foi criado um index.js para especificar uma função de home com um return do nome desejado no localhost.

Para subir o localhost para validação foi aplicado o comando npm run dev
Isso tudo para criar o ambiente de testes.

---

# AULA 6

Quando você alterar algo em seu diretório você pode utilizar alguns comandos para verificar o status e fazer o commit e push para o seu github de origem.

# git status

- mostra o nome do item que foi modificado

# git diff

- mostra a na branch a diferença do que foi alterado a "diff"erença entre o antigo e o novo

# git add (nome do item)

- Ele adiciona o item para o stage para ser o proximo a ser realizado o commit quando dado o comando.

# git commit -emend

- para realizar o commid, pode se adicionar o -m e aspas simples ou duplas para escrever o comentário

# git push -f (force)

- git push -f de force para subir forçadamente o item para o github de origem.

# git log

- Você consegue ver o ID e comprar com o id do ultimo commit que você fez, se for um item que foi modificado no seu vscode local ou nuvem e ver se ele é diferente do ultimo commit registrado. Quando são o mesmo quer dizer que está tudo up-to-date.

# git log --online

- Ele faz o git log em uma linha, destacando o id do commit e o nome dele

---

# Hospedagem

Vai ser utilizado a Versel para hospedar o nosso site. - o que facilita é que ele é a criadora do Next.js
Quando vincular sua conta ao github ele vai instalar um robo que vai ficar de olho em seu diretório e fazer o deploy sempreque precisar.

---

# Qual o segredo para organização de tarefas ?

1- Ser Lembrado Individualmente - Lembrar individualmente o que voce precisa saber - Menor custo de produção e de menor tempo de aquecimento - Produção quant ocusta de energia e aquecimento quanto tempo você leva para ver e conferir o que precisa ser feito. Ex: criar uma lista de papel e deixar em cima da sua mesa.

2- Ser lembrado em grupo - kambam - deixar de facil acesso para a time saber o que precisa ser feito e marcar o progresso

3 - Expandir conhecimento - trello ou github - consegue expandir o conhecimento dentro dele - no nivel 3 voce precisa criar entrar em varias barreitas

4 - Gerar metricas - voce comeca a mensurar a produtividade do incio e ao fim das pessoas

---

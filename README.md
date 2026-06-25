# Clone-tabnews
# Implementação do Tabnews para o curso.dev
# Implementação de website com Next.js 13.1.6 e React 18.2.0, executado em Node.js LTS Hydrogen (v18).


Versões utilizadas - 

° Versão do node.js - lts/hydrogen
° Versão do next - 13.1.6
° Versão do react - 18.2.0
° Versão do react-dom - 18.2.0


*Foi criado o .nvmrc para padronizar a versão correta que é utilizado no Tabnews.
Nesse projeto foi rodado o comando - nvm alias defaut lts/hydrogen para deixar como defaut a versão utilizada no projeto. 

Para teste de execução de inicio foi verificardo as versões de cada tool - node -v, nvm -v

1-nvm install lts/hydrogen

2 - Foi criado o package.jason
 # Com o comando npm init, nele foi selecionado as verções acima. 

Para o teste foi criado um index.js para especificar uma função de home com um return do nome desejado no localhost.

Para subir o localhost para validação foi aplicado o comando npm run dev
Isso tudo para criar o ambiente de testes. 

______________________________________________________________________________________________________________________

Quando você alterar aglo em seu diretório você pode utilizar alguns comandos para verificar o status e fazer o commit e push para o seu github de origem. 

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

_________________________________________________________________________________________________________________________________________

# git log 
- Você consegue ver o ID e comprar com o id do ultimo commit que  você fez, se for um item que foi modificado no seu vscode local ou nuvem e ver se ele é diferente do ultimo commit registrado. Quando são o mesmo quer dizer que está tudo up-to-date.

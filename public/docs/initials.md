# Atualizando o projeto
Antes de tudo, se certifique de que a versão do projeto no seu computador é a mais atualizada possível. 
Para garantir isso, no terminal na pasta do projeto vá para a branch principal com o comando *git checkout main*,
e digite *git pull* para trazer a última versão do repositório remoto para o seu computador.


# Alterando o projeto
Nunca trabalhe diretamente na branch *main*, sempre crie uma nova branch para suas alterações.
*git checkout -b nome-da-branch*


# Salvando as alterações 
1. Adicione suas alterações no commit com *git add .*. Se você quer adicionar apenas um arquivo específico, ao invés do ponto (.) use o nome do arquivo: *git add initials.md*

2. Para verificar quais arquivos vão ser salvos no commit e quais não foram, use *git status*

3. Finalize o commit com *git commit -m "mensagem descrevendo suas alterações"* (a mensagem é obrigatória).

# Enviando as alterações
Você pode enviar as alterações para o repositório remoto com *git push*, se sua branch ainda não foi enviada, o git solicitará que você crie ela remotamente com *git push --set-upstream origin nome-da-branch*

# Sobre os commits
Os commits criam um ponto de referência para o estado da sua branch, crie quantos commits forem necessários para organizar sua tarefa. 

Lembre-se que você pode usá-los para "viajar no tempo" da sua branch, voltando em commits passados, vendo as alterações e se necessário, voltando sua branch para aquela versão.


# Glossário geral 
- git checkout → trocar de branch
- git checkout -b → criar e trocar para uma nova branch
- git pull → atualizar a branch com o repositório remoto
- git add → preparar arquivos para commit
- git commit → salvar alterações localmente
- git push → enviar alterações para o repositório remoto
- git merge → juntar alterações de outra branch

# Boas Práticas
* Sempre atualize a main antes de começar
* Nunca desenvolva diretamente na main
* Use nomes claros para branchs
* Escreva commits descritivos
* Atualize sua branch antes de abrir um Pull Request
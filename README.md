# Mapes - Consultas Médicas
*Relatório de produção médica com gráfico.*

Essa solução foi construída utilizando as seguintes tecnologias:

* Docker para infraestrutura;
* PostgreSQL para banco de dados;
* PgAdmin4 para administração do banco;
* Django para servir a API e administração das informações;
* GraphQL para padrão de API;
* D3.js para geração de gráficos;
* Nginx para servir os arquivos web estáticos.


### Requisitos para instalação

Para colocar a solução no ar, é necessário possuir o **Docker** e o **Git** instalados. Para instalar o Docker, visite
o [site oficial](https://docs.docker.com/install/) para ver as instruções detalhadas para o seu sistema operacional. Da
mesma forma, para instalar o Git no seu sistema, veja as instruções
no [site oficial](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

### Passo a passo

1. Abra o terminal do seu sistema operacional;
2. Navegue até a pasta onde deseja instalar a solução e faça um clone do repositório.
    ```
    $ git clone https://github.com/soslaio/mapes.git
    ```
3. Acesse a pasta criada e execute o script de instalação. Esse script levanta todos os containers necessários (banco
de dados, api e servidor web) e executa os comandos que rodam após a criação dos mesmos.
    ```
    $ cd mapes/
    $ ./run.sh
    ```
4. Caso não consiga executar o script, dê a ele permissão de execução e tente rodar novamente. No Linux isso pode ser
feito através do comando abaixo.
    ```
    $ chmod +x run.sh
    $ ./run.sh
    ```
5. Com isso a solução já deve estar funcionando. Agora é só acessar http://localhost:81/ para ver a interface de
consulta, que nesse momento deve estar vazia de informações.  

### Administração

Para adicionar médicos, consultas e exames, acesse a interface administrativa da solução no endereço
http://localhost:8001/admin/. Utilize o usuário `admin` e senha `pass`. Na medida que as informações forem sendo
inseridas, começarão a aparecer no gráfico.

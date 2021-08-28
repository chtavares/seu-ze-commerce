
# Seu Zé Commerce API

Seu Zé Commerce API utiliza tecnologias como Node.js utilizando o framework NestJS, MySQL, TypeORM, RabbitMQ.

# Iniciando o Projeto

## Instalação

1. Instalar o [Docker](https://www.docker.com/get-started).
2. Clonar o repositório e entrar no respectivo diretório.
3. Criar uma network através do comando `docker network create seuzenetwork`
4. Executar `docker-compose up --build` (O docker-compose disponibilizado para a realização
do teste foi inserido dentro do docker-compose da aplicação).

## Popular inicialmente a tabela de produtos

1. Abrir outro terminal dentro do diretório do projeto.
2. Executar `docker ps` para obter o ID do container da api.
3. Executar `docker exec --it <ID DO CONTAINER> sh`.
4. Dentro do container da api digitar `node scripts/flooding-product.js`.
5. Após realizar a migração, digitar `exit`.

## Executar os Testes Unitários

Os testes locais são executados localmente, os únicos serviços que necessitam estar executando no container são o database e o rabbitmq, para executar os testes siga os passos abaixo:

1. No terminal dentro do diretório da aplicação digitar `npm i`
2. Abra outro terminal dentro do diretório do projeto e execute `docker-compose up --build database rabbitmq`
3. Volte para o terminal anterior e execute `npm run test:cov`

## Estrutura do Projeto

```
├── /mysql
├── /scripts
├── /src
|   ├── /migrations
|   ├── /order
|   ├── /product
|   ├── /rabbitMQ
├── /test
```

## Postman

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.getpostman.com/collections/92b58d0640570f7ae480)

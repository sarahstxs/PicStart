# PicStart

Sistema web para gerenciamento de funcionários em processo de contratação.

## Tecnologia escolhida

O frontend utiliza React com Vite. React foi escolhido pela componentização,
pela atualização reativa da interface e pela comunicação direta com a API REST
usando Fetch API.

## Como executar

```bash
cd frontend
npm install
npm run dev
```

A API Spring Boot deve estar disponível em `http://localhost:6767`.

```bash
cd backend
bash mvnw spring-boot:run
```

Ao abrir o frontend, use o acesso de teste abaixo:

- E-mail: `RenanSantos@picpay.com`
- Senha: `123`

## Funcionalidades

- Cadastro de funcionário com validação de nome, e-mail e cargo.
- Listagem e consulta individual por ID.
- Busca combinada por nome, cargo e status.
- Edição completa usando PUT.
- Atualização parcial de status e salário usando PATCH.
- Exclusão com confirmação.
- Dashboard com total de funcionários e distribuição por status.
- Login integrado com a API, sessão persistida e logout.
- Rotas privadas e proteção automática das requisições com token.
- Layout responsivo e navegação acessível.

## Comunicação com a API

| Operação | Método | Endpoint |
| --- | --- | --- |
| Login | POST | `/api/employee/login` |
| Logout | POST | `/api/employee/logout` |
| Cadastrar | POST | `/api/employee/post` |
| Listar | GET | `/api/employee/get` |
| Consultar por ID | GET | `/api/employee/get/{id}` |
| Buscar | GET | `/api/employee/search?name=&post=&status=` |
| Atualizar completamente | PUT | `/api/employee/put/{id}` |
| Atualizar parcialmente | PATCH | `/api/employee/patch/{id}` |
| Excluir | DELETE | `/api/employee/delete/{id}` |
| Indicadores | GET | `/api/employee/indicators` |

O proxy do Vite encaminha `/api` para o backend Spring Boot durante o
desenvolvimento. Com exceção do login, as rotas da API exigem o token de
sessão enviado no cabeçalho `Authorization`.

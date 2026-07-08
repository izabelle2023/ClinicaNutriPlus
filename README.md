# 🥗 Clinica Nutri Plus

Sistema web completo para gestao de clinica de nutricao, com backend em Node.js/Express/MySQL
e frontend em React + TypeScript.

## Estrutura

```
backend/   -> API REST (Node + Express + MySQL)
frontend/  -> SPA (React + TypeScript + Recharts)
```

## Autenticacao (sem JWT)

Este sistema usa uma autenticacao simplificada, sem tokens JWT:

- No login/registro, a senha e validada com bcrypt no backend e o usuario e retornado.
- O frontend guarda esse usuario no localStorage e, em toda requisicao seguinte,
  envia o id do usuario logado no header `x-user-id`.
- O backend confirma que esse id existe no banco antes de liberar o acesso as rotas
  privadas, e cada rota valida o perfil (nutricionista/paciente) conforme necessario.

⚠️ Por nao usar assinatura criptografica (JWT), esse esquema e mais simples mas tambem
mais facil de falsificar (qualquer requisicao com um x-user-id valido e aceita). Adequado
para estudo/portfolio; para producao, recomenda-se reintroduzir JWT ou sessions assinadas.

## Como rodar

### 1) Banco de dados (MySQL / XAMPP)
Garanta que o MySQL esteja rodando localmente (ex: via XAMPP) antes de continuar.

### 2) Backend
```
cd backend
npm install
cp .env.example .env    # ajuste usuario/senha do MySQL se necessario
npm run init-db         # cria o banco "nutricao" e as tabelas
npm start                # inicia a API em http://localhost:3001
```

### 3) Frontend
```
cd frontend
npm install
cp .env.example .env     # aponta para a API (http://localhost:3001/api)
npm start                 # inicia em http://localhost:3000
```

## Fluxo de uso
1. Acesse http://localhost:3000/registrar e crie uma conta como **Nutricionista**.
2. Crie outra conta como **Paciente** (em outra aba/anonima) e, no cadastro, informe o objetivo, altura e peso.
3. Logado como nutricionista, va em "Pacientes" e veja os pacientes vinculados a voce.
4. Agende consultas, crie planos alimentares e registre a evolucao do paciente.
5. Logado como paciente, acompanhe consultas, plano alimentar e o grafico de evolucao.

## Stack
- **Backend:** Node.js, Express, MySQL (mysql2), bcryptjs, dotenv
- **Frontend:** React, TypeScript, React Router DOM, Recharts, Axios

## Seguranca
- Senhas armazenadas com hash bcrypt.
- Identificacao do usuario via header `x-user-id` (sem JWT — ver secao acima).
- Controle de acesso por perfil (nutricionista/paciente) em cada endpoint.

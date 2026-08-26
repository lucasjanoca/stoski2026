# Política de Segurança

Este projeto deve manter credenciais privadas e dados sensíveis fora do código público.

## Como relatar uma vulnerabilidade

Não publique senhas, tokens, dados pessoais ou instruções exploráveis em issues públicas. Use os canais oficiais da InfoTech.io para relatar o problema de forma privada.

## Regras do projeto

- Nunca versionar `.env`, certificados ou chaves privadas.
- Chaves administrativas e tokens com privilégios elevados não pertencem ao frontend.
- Alterações devem ser testadas na branch `dev` antes de chegar ao `main`.
- Validações de acesso importantes devem acontecer no serviço/banco responsável pelos dados.
- Entradas vindas do usuário devem ser validadas e tratadas com segurança.

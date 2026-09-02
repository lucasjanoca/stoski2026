# Política de Segurança

Este projeto mantém credenciais privadas e dados sensíveis fora do código público.

## Como relatar uma vulnerabilidade

Não publique senhas, tokens, dados pessoais ou instruções exploráveis em issues públicas. Use os canais oficiais da InfoTech.io para relatar o problema de forma privada.

## Regras do projeto

- Nunca versionar `.env`, certificados, chaves privadas ou service-role keys.
- O frontend pode conter somente a chave publicável do Supabase.
- Permissões do painel devem ser validadas por RLS e funções privadas no banco, não apenas pela interface.
- O painel administrativo usa `noindex` e não possui link visível no site público.
- Entradas do CMS devem ser escapadas ou aplicadas por APIs seguras do DOM.
- URLs executáveis como `javascript:` não devem ser aceitas pelo site.
- Uploads devem respeitar bucket, pasta, extensão, MIME e limite de tamanho.
- Vídeos grandes devem usar provedores de streaming incorporados; o site não deve pré-carregar mídia pesada.
- O último proprietário autenticado do painel não pode ser removido ou desativado.
- O histórico do CMS mantém as 100 revisões mais recentes para evitar crescimento sem limite.
- Alterações devem passar pela workflow `Project quality check` antes da entrega.

## Hospedagem

GitHub Pages não aplica o arquivo `_headers` como header HTTP. Por isso o projeto também usa CSP por meta tag nos HTMLs. O `_headers` é mantido para uma futura hospedagem compatível com esse formato.

# Stoski Films

Site oficial de Henrique Stoski (Stoski Films), desenvolvido pela InfoTech.io.

## Produção atual

- Posicionamento 100% focado em vídeo.
- Identidade cinematográfica em preto, marfim e champagne/dourado.
- Home responsiva com manifesto, serviços, portfólio, showreel, apresentação profissional, processo, FAQ, Instagram e orçamento.
- Portfólio administrável com capa, categoria, título, descrição e vídeo por projeto.
- Showreel principal administrável e oculto automaticamente enquanto nenhum vídeo estiver configurado.
- Fluxo recomendado de vídeo: YouTube como **Não listado**, incorporado no player do próprio site.
- Suporte adicional a Vimeo e arquivos MP4/WebM curtos.
- Player carrega o vídeo apenas após o clique, reduzindo peso inicial e consumo de dados.
- Formulário de orçamento que organiza a solicitação e abre o WhatsApp profissional.
- SEO técnico com metadados sociais, dados estruturados, canonical, sitemap, robots e manifest.
- Acessibilidade com skip link, foco visível, navegação por teclado, dialogs e retorno de foco.
- CSP aplicada também por meta tag para GitHub Pages; arquivo `_headers` mantido para hosts que suportam headers personalizados.
- Deploy automático por GitHub Pages.

## Painel administrativo

O painel fica em `/admin.html` e não é exibido no rodapé público.

O painel foi simplificado para o cliente: a Visão Geral exibe apenas o resumo de trabalhos, serviços e dúvidas, com atalhos para Portfólio, Vídeo em destaque, Serviços e Contato.

Ele permite:
- adicionar, editar e reorganizar serviços e projetos com fotos e vídeos;
- atualizar o vídeo em destaque e testar seus links antes de salvar;
- editar apresentação, diferenciais, processo, perguntas e contatos;
- enviar imagens e vídeos curtos diretamente nas telas relevantes;
- mostrar ou esconder seções do site;
- gerenciar administradores quando o usuário é proprietário.

As telas técnicas **Identidade & SEO**, **Início**, **Aparência** e **Histórico** não são oferecidas ao cliente. Exportar, importar e restaurar configuração também não aparecem na Visão Geral. As revisões anteriores continuam preservadas no banco para manutenção técnica, sem expor a restauração no painel.

O frontend usa somente a chave publicável do Supabase. Autorizações importantes são aplicadas por RLS no banco.

## Vídeos

Para produções grandes, use o YouTube Studio e configure o vídeo como **Não listado**. Depois copie o link para o campo de vídeo do projeto ou do showreel.

Isso evita armazenar arquivos grandes no Supabase e mantém o site leve. O upload direto ao Storage continua limitado aos formatos e tamanhos permitidos pelo projeto.

## Contatos públicos

- Instagram: @stoski_films
- WhatsApp: +55 15 99741-1289
- Região exibida: Cerquilho — SP e região

## Checklist de entrega ao Henrique

A versão publicada usa o Supabase para atualizar o conteúdo sem alterar o código. Antes de apresentar como entrega final:

- [ ] Conferir no celular e no computador os três vídeos do portfólio e se o YouTube permite incorporação.
- [ ] Substituir qualquer capa genérica e validar a foto de perfil original, com autorização de uso.
- [ ] Cadastrar o showreel principal no painel, se Henrique fornecer um vídeo de apresentação; enquanto estiver vazio, a seção permanece oculta.
- [ ] Abrir um orçamento de teste e confirmar que a conversa correta aparece no WhatsApp do Henrique, sem enviar mensagem indevidamente.
- [ ] Revisar textos, serviços, região atendida, Instagram e permissões de administrador com Henrique.
- [ ] Aprovar a revisão visual em telas pequenas e grandes antes de mesclar esta branch com `main`.

O painel está em `/admin.html`; não coloque senhas nem chaves secretas no repositório.

## Qualidade

A workflow `Project quality check` valida arquivos obrigatórios, sintaxe JavaScript, estrutura HTML, acessibilidade básica, referências locais, CSS, manifest, sitemap, mídia, integração de vídeo, ausência de segredos e requisitos de segurança do CMS.

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

Ele permite:
- editar todo o conteúdo comercial;
- gerenciar portfólio e showreel;
- enviar imagens e vídeos curtos;
- testar links de vídeo antes de publicar;
- alterar aparência e visibilidade de seções;
- restaurar versões anteriores;
- gerenciar administradores quando o usuário é proprietário.

O frontend usa somente a chave publicável do Supabase. Autorizações importantes são aplicadas por RLS no banco.

## Vídeos

Para produções grandes, use o YouTube Studio e configure o vídeo como **Não listado**. Depois copie o link para o campo de vídeo do projeto ou do showreel.

Isso evita armazenar arquivos grandes no Supabase e mantém o site leve. O upload direto ao Storage continua limitado aos formatos e tamanhos permitidos pelo projeto.

## Contatos públicos

- Instagram: @stoski_films
- WhatsApp: +55 15 99741-1289
- Região exibida: Cerquilho — SP e região

## Qualidade

A workflow `Project quality check` valida arquivos obrigatórios, sintaxe JavaScript, estrutura HTML, acessibilidade básica, referências locais, CSS, manifest, sitemap, mídia, integração de vídeo, ausência de segredos e requisitos de segurança do CMS.

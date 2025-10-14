# Blog Sherlock Ramos

Blog pessoal desenvolvido com Astro e implantado no Cloudflare Workers como um [site estático](https://developers.cloudflare.com/workers/static-assets/).

## Recursos

- ✅ Design minimalista e personalizável
- ✅ Performance 100/100 no Lighthouse
- ✅ SEO otimizado com URLs canônicas e dados OpenGraph
- ✅ Suporte a Sitemap
- ✅ Feed RSS
- ✅ Suporte a Markdown & MDX
- ✅ Logging de observabilidade integrado

## 🚀 Estrutura do Projeto

O Astro busca arquivos `.astro` ou `.md` no diretório `src/pages/`. Cada página é exposta como uma rota baseada no nome do arquivo.

O diretório `src/components/` contém todos os componentes Astro/React/Vue/Svelte/Preact do projeto.

O diretório `src/content/` contém "coleções" de documentos Markdown e MDX relacionados. Use `getCollection()` para recuperar posts de `src/content/blog/` e validar o frontmatter usando um schema opcional. Veja a [documentação de Content Collections do Astro](https://docs.astro.build/pt-br/guides/content-collections/) para saber mais.

Arquivos estáticos, como imagens, podem ser colocados no diretório `public/`.

## 🧞 Comandos

Todos os comandos são executados a partir da raiz do projeto, em um terminal:

| Comando                           | Ação                                                      |
| :-------------------------------- | :-------------------------------------------------------- |
| `npm install`                     | Instala as dependências                                   |
| `npm run dev`                     | Inicia servidor de desenvolvimento em `localhost:4321`    |
| `npm run build`                   | Compila o site de produção para `./dist/`                 |
| `npm run preview`                 | Visualiza a build localmente antes de fazer deploy        |
| `npm run check`                   | Executa verificação de tipos e validação                  |
| `npm run astro ...`               | Executa comandos CLI como `astro add`, `astro check`      |
| `npm run astro -- --help`         | Obtém ajuda usando a CLI do Astro                         |
| `npm run deploy`                  | Faz deploy do site de produção para Cloudflare            |
| `npx wrangler tail`               | Visualiza logs em tempo real dos Workers                  |

## 📚 Quer aprender mais?

Confira a [documentação do Astro](https://docs.astro.build) ou entre no [servidor Discord](https://astro.build/chat).

## 🙏 Créditos

Este tema é baseado no excelente [Bear Blog](https://github.com/HermanMartinus/bearblog/).

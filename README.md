# TFT Unit Journey

Acompanhe onde cada unidade apareceu nas suas composições.

## MVP funcional
- Criar, editar, excluir e pesquisar anotações manuais; filtrar por set, patch, unit.
- Resumo por grupo e média de colocação baseada em amostra manual.
- Importar/exportar backup JSON validado; LocalStorage, sem backend ou banco de dados.
- Exemplos fictícios opcionais, explicitamente identificados, sem integração de API.
- Acessibilidade, teclado e movimento reduzido. Testes Playwright com cinco resoluções.

## Rodar localmente
```bash
python -m http.server 8000
```
Abra `http://localhost:8000`.

## GitHub Pages
A versão estática usa caminhos relativos; branch `gh-pages` pode conter somente `index.html`, `config.js`, `app.js`, `styles.css`, `favicon.svg` e `.nojekyll`. Ative Pages em `Settings → Pages → Deploy from a branch → gh-pages /(root)` se a conta ainda não tiver publicação ativada.

## Histórico
Brief original preservado na branch `archive/readme-only-20261027`. Diretrizes em [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).

Projeto independente, não afiliado à Blizzard, Riot Games ou aos respectivos titulares.

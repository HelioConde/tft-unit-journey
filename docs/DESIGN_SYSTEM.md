# DESIGN_SYSTEM — TFT Unit Journey

## Produto e escopo
Acompanhe onde cada unidade apareceu nas suas composições. A aplicação é um diário pessoal com dados **manuais**, sem banco, autenticação, API de jogo ou pontuações oficiais. Exemplos são rotulados como fictícios e carregados somente por ação explícita.

## Taste Skill / tokens
Fonte única em `styles.css`: `--bg #181328`, `--accent #d9b4ff`, `--accent-two #a3f0d2`, cores de superfície, `--focus`, `--space-1/2/3/4/6/8/12/16` (4–64px), raios 10/18/30 px. Tipografia nativa e títulos fluidos.

## Web Design Guidelines
Layout responsivo, teclado e foco visível, links semânticos, salto ao conteúdo, campos com rótulos, atualização de status via `aria-live`, confirmação para exclusões/importação destrutiva e `prefers-reduced-motion`. Dados pessoais nunca são enviados e são inseridos com `textContent` para evitar HTML injetado.

## Awesome Design / Image to Code
O repositório original era somente um README de concepção, sem telas nem capturas preexistentes. Por isso o redesenho visual é um **projeto original**, com emblema CSS, favicon SVG e layout de cartões; não há alegação de conversão de imagens que não foram fornecidas.

## Dados, limitações e comparação
Cada registro é validado conforme os campos do produto; backups versionados `{app,version,entries}`, máximo 250 registros, limite de 1 MB para importação. Chave LocalStorage `tft-unit-journey-v1`. Dados guardados localmente, sem criptografia ou sincronização.

**TFT Unit Journey:** média de colocação de amostra manual, agrupar por Set+patch+unidade. A colocação pertence ao tabuleiro inteiro e não prova desempenho individual.

## QA e GitHub Pages
GitHub Actions executa testes estáticos e Playwright em 320, 390, 768, 1366, 1600 px, capturas de página inteira, fluxos de exemplos, edição, persistência, exportação, exclusão e overflow. Publicação estática por `gh-pages/(root)` sem build de runtime; a configuração de Pages da conta pode exigir habilitação manual.

## Diferenciação visual — 27/10/2026
**Layout original do produto, não tema copiado.** Álbum de colecionador de unidades: cartões tipo figurinha em três colunas, foil pastel e vitrine celeste. O arquivo `identity.css` contém a identidade sem alterar armazenamento ou componentes funcionais. Resoluções críticas: 320, 390, 768, 1366 e 1600 pixels. Contraste/foco mantidos e movimento reduzido respeitado.

## Comparação de unidades — recurso exclusivo
Dois seletores escolhem unidades registradas no **mesmo Set e patch**. A interface exibe o número de partidas e a média de colocação do **tabuleiro**; não é tier list, previsão ou desempenho isolado. Dados opcionais são somente manuais. Sem alterar o schema LocalStorage. Playwright verifica os dois cartões após recarregar a página.

## Auditoria de screenshots mobile (28/10/2026)
Capturas 320/390 px revisadas. Hero e elementos decorativos comprimidos no mobile para priorizar dados e ações de produto. Link de navegação rápida continua acessível pelo teclado, recortado fora do foco. Testes incluem validação de foco e regressão responsiva em cinco resoluções.

## QA de acessibilidade 28/10/2026
Playwright testa Tab/Shift+Tab, navegação rápida para main com foco, rótulos e contraste computado de inputs e placeholders (mínimo 4,5:1), ações de toque e formulário com 44px de altura, e anel de foco. CSS em `a11y.css` mantém a identidade e os dados locais. Checagem automatizada direcionada, não certificação WCAG.

## Menu de coleção no celular
Acesso a Comparar unidades, Álbum e Registro usando `details/summary`, até 640 px. Ícone e painel com identidade lilás do álbum colecionável. Teclado Enter/Escape e fechamento após selecionar destino. Testes Playwright nas cinco resoluções e sem alteração do backup.

## Navegação desktop orientada ao produto
Cabeçalho desktop aponta diretamente para Comparar, Álbum, Nova unidade. Teste Playwright verifica os três destinos existentes e acesso em 768/1366/1600px. Badge secundário é suprimido em telas intermediárias para evitar overflow. Menu móvel permanece independente.

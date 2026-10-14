# Exportação Editorial em PDF & Arquitetura de Leitura Offline

Geração e download direto de obras integrais em formato PDF diagramado clássico (com folha de rosto ornamental, tipografia de época, sumário e notas de rodapé), integrando-se aos downloads de ePub e preparando a infraestrutura para leitura offline.

## Decisões Confirmadas & Respostas do Usuário

> [!IMPORTANT]
> **Decisões confirmadas pelo usuário na etapa de alinhamento:**
> - **Funcionalidade Prioritária Imediata**: Exportação completa da obra em formato **PDF editorial diagramado**.
> - **Estilo Visual da Diagramação**: **Clássico com capa/folha de rosto, sumário e notas históricas**, preservando a estética canônica do século XIX.
> - **Visão de Futuro (Fase Subsequente)**: Acesso sem internet (modo offline com cache de obras abertas e service worker PWA).

---

## 1. Visão Geral & Conceito

### O que a funcionalidade entrega
Permite que o leitor, a partir do **Modal Editorial da Obra** ou diretamente da barra superior do **Leitor Imersivo**, exporte e baixe um documento PDF completo e diagramado do livro selecionado. O documento é gerado diretamente no navegador em formato padrão A4/Carta, com layout tipográfico refinado inspirado nas edições originais da Livraria Garnier e da Tipografia Nacional do século XIX.

### Público e Valor de Uso
- **Estudantes e Pesquisadores**: Possibilidade de imprimir capítulos ou a obra completa para estudo acadêmico com margens para anotações manuscritas.
- **Leitores Multi-Dispositivo**: Leitura em dispositivos Kindle, leitores de PDF ou impressão física sem depender de um leitor ePub específico.
- **Preservação e Portabilidade**: Posse definitiva do arquivo diagramado em PDF além do formato ePub já disponível.

---

## 2. Experiência do Usuário & Design Visual

### Fluxos Principais

1. **A partir da Estante / Modal Editorial (`BookEditorialModal`)**:
   - No painel de ações da obra, ao lado do botão *"Iniciar Leitura Completa"* e *"Baixar ePub"*, haverá o botão *"Exportar em PDF Clássico"*.
   - Ao clicar, um modal ou indicador de progresso sutil (*"Diagramando obra em formato clássico..."*) processa os capítulos e dispara o download imediato do arquivo `[Titulo_da_Obra]_Edicao_Classica.pdf`.

2. **A partir do Leitor Minimalista (`MinimalistReader`)**:
   - No cabeçalho superior de utilidades, ao lado do botão existente de download de ePub, é adicionado o botão de exportação em PDF com ícone `FileDown` / `Printer`.
   - O leitor tem a opção de baixar a **obra completa** ou o **capítulo atual**.

3. **Estrutura Visual do Documento PDF Diagramado**:
   - **Folha de Rosto / Capa**: Borda dupla clássica ornamental, título em serif de alto contraste (`Playfair Display` / `Cinzel`), subtítulo de época, indicação de autoria, ano original e selo *Eterno Retorno · Coleção Canônica*.
   - **Sumário Editorial (TOC)**: Relação de capítulos com algarismos romanos e paginação.
   - **Páginas de Miolo**:
     - Cabeçalho corrente com o título da obra centralizado e numeração romana do capítulo.
     - Abertura de capítulos com capitular elegante (*Drop Cap*) e espaçamento generoso.
     - Texto justificado com entrelinha relaxada (1.6), margens generosas para leitura confortável e encadernação.
     - Rodapé com numeração de página centralizada e notas explicativas/históricas de época quando presentes.

---

## 3. Decisões Técnicas & Trade-Offs

### Decisão 1: Biblioteca de Geração de PDF Client-Side (`jspdf`)
- **Abordagem Escolhida**: Geração programática nativa com `jspdf` em conjunto com formatação de fluxo de texto.
- **Por que**: 
  - Gera arquivos vetoriais limpos, leves e com controle exato de quebra de páginas (`addPage`), margens, cabeçalhos correntes e paginação.
  - Funciona 100% no navegador sem necessidade de backend, sem custos de servidor e com velocidade instantânea.
  - Não depende de janelas pop-up ou `window.print()` (que sofrem restrições em ambientes de iframe).
- **Alternativas Consideradas**: 
  - *window.print()*: Depende do diálogo do sistema operacional do usuário, é bloqueado em vários iframes e não permite controle estrito da folha de rosto e cabeçalhos em todos os navegadores.
  - *Geração no servidor Express*: Adicionaria dependência pesada de headless Chromium (Puppeteer), aumentando tempo de resposta e consumo de memória.

### Decisão 2: Arquitetura de Preparação para Modo Offline (PWA & Cache)
- **Abordagem Escolhida**: 
  - Para agora: Organizar os dados dos livros e capítulos em estruturas prontas para armazenamento local e exportação.
  - Para a etapa offline subsequente: Configuração do `vite-plugin-pwa` (já presente em `devDependencies`) para criar o Service Worker que intercepta e guarda em cache os assets, os arquivos `.epub` e os dados dos capítulos, permitindo que a aplicação abra e funcione mesmo sem conexão com a internet.

---

## 4. Arquitetura Técnica & Modelo de Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                          APLICAÇÃO WEB VITE                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌───────────────────────────┐      ┌─────────────────────────────┐   │
│   │    BookEditorialModal     │      │      MinimalistReader       │   │
│   │ [Baixar PDF da Obra]      │      │ [Exportar PDF / Capítulo]   │   │
│   └─────────────┬─────────────┘      └──────────────┬──────────────┘   │
│                 │                                   │                  │
│                 └─────────────────┬─────────────────┘                  │
│                                   ▼                                    │
│                 ┌───────────────────────────────────┐                  │
│                 │      editorialPdfGenerator.ts     │                  │
│                 │  • Folha de rosto ornamental      │                  │
│                 │  • Sumário e quebras de página    │                  │
│                 │  • Paginação e cabeçalho corrente │                  │
│                 │  • Notas históricas de rodapé     │                  │
│                 └─────────────────┬─────────────────┘                  │
│                                   ▼                                    │
│                 ┌───────────────────────────────────┐                  │
│                 │         jspdf (Client-Side)       │                  │
│                 │  Blob de Download Direto (.pdf)   │                  │
│                 └───────────────────────────────────┘                  │
└────────────────────────────────────────────────────────────────────────┘
```

### Componentes e Módulos a Implementar

1. **`src/utils/editorialPdfGenerator.ts`**:
   - `generateBookPdf(book: BookItem, chapters: ChapterData[])`: Motor central de diagramação editorial.
   - Algoritmo de quebra automática de parágrafos respeitando margens, cálculo de altura de página e numeração contínua.
   - Aplicação de ornamentos tipográficos clássicos e folha de rosto decorada.

2. **`src/components/Modal/BookEditorialModal.tsx`**:
   - Inclusão do botão de ação com ícone representativo para baixar o PDF editorial com estado de carregamento (*feedback* visual imediato).

3. **`src/components/Reader/MinimalistReader.tsx`**:
   - Inclusão da opção de download em PDF no cabeçalho superior e no menu de opções.

4. **Tratamento de Livros EPUB vs. Capítulos Pré-carregados**:
   - Caso o livro possua `epubUrl`, utiliza os capítulos já descompactados pelo leitor para que a edição em PDF contenha o texto 100% integral da obra.

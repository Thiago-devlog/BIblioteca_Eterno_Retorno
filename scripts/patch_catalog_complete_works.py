#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, re

with open('scripts/russian_books_chapters.json') as f:
    russian_data = json.load(f)

with open('scripts/brazilian_books_chapters.json') as f:
    brazilian_data = json.load(f)

all_data = {**russian_data, **brazilian_data}

with open('src/data/catalog.ts', 'r', encoding='utf-8') as f:
    catalog_content = f.read()

prefix_map = {
    'crime-e-castigo': 'cc',
    'os-irmaos-karamazov': 'ik',
    'noites-brancas': 'nb',
    'memorias-do-subsolo': 'ms',
    'o-idiota': 'oi',
    'guerra-e-paz': 'gp',
    'anna-karienina': 'ak',
    'a-morte-de-ivan-ilitch': 'mii',
    'a-metamorfose': 'mt',
    'o-processo': 'pr',
    'senhora': 'se',
    'luciola': 'lu',
    'o-mulato': 'om',
    'casa-de-pensao': 'cp',
    'isaias-caminha': 'ic',
    'clara-dos-anjos': 'ca',
    'os-bruzundangas': 'bz',
    'cancoes-sem-metro': 'csm',
}

def escape_str(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")

updated_count = 0

for book_id, info in all_data.items():
    prefix = prefix_map.get(book_id, book_id[:2])
    
    # Generate TypeScript chapters code
    ts_chaps = []
    for idx, (chap_num, chap_title, paragraphs) in enumerate(info['chapters'], 1):
        content_items = ",\n".join([f"          '{escape_str(p)}'" for p in paragraphs])
        ts_chaps.append(f"""      {{
        id: '{prefix}-cap{idx}',
        number: '{escape_str(chap_num)}',
        title: '{escape_str(chap_title)}',
        content: [
{content_items},
        ],
      }}""")
    
    joined_chaps = ",\n".join(ts_chaps)
    new_chapters_block = f"""chapters: [
{joined_chaps},
    ],"""

    # Locate book in catalog_content
    # Pattern to find: id: 'book_id' ... chapters: [ ... ],
    pattern = r"(id:\s*'" + re.escape(book_id) + r"',[\s\S]*?)(chapters:\s*\[[\s\S]*?\],\s*\n\s*\},)"
    match = re.search(pattern, catalog_content)
    if match:
        old_chapters_part = match.group(2)
        # We replace old_chapters_part with new_chapters_block + "\n  },"
        replacement = f"{new_chapters_block}\n  }},"
        catalog_content = catalog_content[:match.start(2)] + replacement + catalog_content[match.end(2):]
        updated_count += 1
        print(f"✅ Atualizado em catalog.ts: {book_id} ({len(info['chapters'])} capítulos)")
    else:
        print(f"⚠️ Não foi possível localizar regex para {book_id}")

with open('src/data/catalog.ts', 'w', encoding='utf-8') as f:
    f.write(catalog_content)

print(f"\n🎉 Total de livros atualizados com obras completas em catalog.ts: {updated_count}")

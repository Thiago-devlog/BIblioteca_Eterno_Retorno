#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, re

with open('scripts/russian_books_chapters.json', 'r', encoding='utf-8') as f:
    russian_data = json.load(f)

with open('scripts/brazilian_books_chapters.json', 'r', encoding='utf-8') as f:
    brazilian_data = json.load(f)

all_data = {**russian_data, **brazilian_data}

with open('src/data/catalog.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Header: everything up to 'export const BOOKS_CATALOG: BookItem[] = ['
books_start_marker = 'export const BOOKS_CATALOG: BookItem[] = ['
books_start_idx = text.find(books_start_marker)
header = text[:books_start_idx + len(books_start_marker)]

# Footer: from '];\n\n/**\n * 3. LOG DE LEITURA PADRÃO' to end
footer_marker = '];\n\n/**\n * 3. LOG DE LEITURA PADRÃO'
footer_idx = text.find(footer_marker)
footer = text[footer_idx:]

# Find all 37 books
book_starts = list(re.finditer(r"\{\s*id:\s*'([a-z0-9-]+)',\s*title:\s*'([^']+)',[\s\S]*?authorId:\s*'([^']+)'", text))

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

rebuilt_books = []

for i, bm in enumerate(book_starts):
    start_pos = bm.start()
    next_pos = book_starts[i+1].start() if i + 1 < len(book_starts) else footer_idx
    chunk = text[start_pos:next_pos]
    bid = bm.group(1)
    
    # Metadata up to 'chapters: ['
    ch_idx = chunk.find('chapters: [')
    metadata = chunk[:ch_idx].rstrip()
    # Ensure it starts with proper indentation '  {\n'
    if not metadata.startswith('  {\n'):
        metadata = '  {\n' + metadata.lstrip('{\n').lstrip()
    
    if bid in all_data:
        # Build new complete chapters
        prefix = prefix_map.get(bid, bid[:2])
        chaps_list = all_data[bid]['chapters']
        ts_chaps = []
        for c_idx, (c_num, c_title, paras) in enumerate(chaps_list, 1):
            p_lines = ',\n'.join([f"          '{escape_str(p)}'" for p in paras])
            ts_chaps.append(f"""      {{
        id: '{prefix}-cap{c_idx}',
        number: '{escape_str(c_num)}',
        title: '{escape_str(c_title)}',
        content: [
{p_lines},
        ],
      }}""")
        chapters_code = ",\n".join(ts_chaps)
        book_block = f"""{metadata}
    chapters: [
{chapters_code},
    ],
  }},"""
        rebuilt_books.append(book_block)
        print(f"✅ Reconstruído (NOVA OBRA COMPLETA): {bid} ({len(chaps_list)} capítulos)")
    else:
        # Extract original chapters cleanly from chunk
        # Find closing '    ],\n  },' or similar
        ch_sub = chunk[ch_idx:]
        # Find the last matching closing of this book object
        # The book ends before any trailing comments
        # Strip trailing comments or empty lines
        lines = ch_sub.split('\n')
        # find the line with '  },' that closes the book
        close_idx = -1
        for line_no in range(len(lines) - 1, -1, -1):
            l = lines[line_no].strip()
            if l == '},':
                close_idx = line_no
                break
        if close_idx != -1:
            clean_chapters = '\n'.join(lines[:close_idx + 1])
        else:
            clean_chapters = ch_sub.rstrip()
            if not clean_chapters.endswith('},'):
                clean_chapters += '\n  },'
        
        book_block = f"""{metadata}\n    {clean_chapters.lstrip()}"""
        rebuilt_books.append(book_block)
        print(f"✔️ Preservado original: {bid}")

new_catalog_content = header + '\n' + '\n'.join(rebuilt_books) + '\n' + footer

with open('src/data/catalog.ts', 'w', encoding='utf-8') as f:
    f.write(new_catalog_content)

print(f"\n🎉 catalog.ts reconstruído com 100% de sucesso! Total de livros: {len(rebuilt_books)}")

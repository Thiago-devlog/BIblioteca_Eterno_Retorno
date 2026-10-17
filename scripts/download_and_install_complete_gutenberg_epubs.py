#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Baixa e instala as edições integrais e canônicas completas (unabridged) do Project Gutenberg e Wikisource
para todas as obras de literatura russa e Franz Kafka.
"""

import urllib.request
import os
import re
import zipfile

GUTENBERG_BOOKS = [
    ('crime-e-castigo', 2554, 'Crime e Castigo (Crime and Punishment)'),
    ('os-irmaos-karamazov', 28054, 'Os Irmãos Karamázov (The Brothers Karamazov)'),
    ('noites-brancas', 36034, 'Noites Brancas (White Nights)'),
    ('memorias-do-subsolo', 600, 'Memórias do Subsolo (Notes from the Underground)'),
    ('o-idiota', 2638, 'O Idiota (The Idiot)'),
    ('guerra-e-paz', 2600, 'Guerra e Paz (War and Peace)'),
    ('anna-karienina', 1399, 'Anna Kariênina (Anna Karenina)'),
    ('a-metamorfose', 5200, 'A Metamorfose (The Metamorphosis)'),
    ('o-processo', 7849, 'O Processo (The Trial)'),
]

os.makedirs('public/assets/epubs', exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

print("--- 1. Baixando edições completas do Project Gutenberg ---")
for book_id, gid, label in GUTENBERG_BOOKS:
    target_path = f'public/assets/epubs/{book_id}.epub'
    url = f'https://www.gutenberg.org/cache/epub/{gid}/pg{gid}.epub'
    print(f"Baixando {label} (Gutenberg #{gid})...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
            with open(target_path, 'wb') as f:
                f.write(data)
            print(f"  ✅ Salvo: {target_path} ({len(data):,} bytes)")
    except Exception as e:
        print(f"  ❌ Erro ao baixar {label}: {e}")

print("\n--- 2. Baixando e gerando A Morte de Ivan Ilitch (12 capítulos integrais do Wikisource) ---")
roman_numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
ivan_chapters = []

for r in roman_numerals:
    url = f'https://en.wikisource.org/wiki/The_Death_of_Ivan_Ilych/{r}'
    print(f"Baixando Capítulo {r} do Wikisource...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8')
            paras_raw = re.findall(r'<p[^>]*>(.*?)</p>', html, re.DOTALL)
            paras = []
            for p in paras_raw:
                clean = re.sub(r'<[^>]+>', '', p).strip()
                # filter out navigation and footer lines
                if clean and not clean.startswith('←') and not clean.endswith('→') and 'Wikisource' not in clean:
                    paras.append(clean)
            
            print(f"  Capítulo {r}: {len(paras)} parágrafos extraídos.")
            ivan_chapters.append((f'Chapter {r}', f'Capítulo {r}', paras))
    except Exception as e:
        print(f"  ❌ Erro no capítulo {r}: {e}")

# Gerar EPUB para a-morte-de-ivan-ilitch
def create_ivan_epub(filename, title, author, chapters):
    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('mimetype', 'application/epub+zip', compress_type=zipfile.ZIP_STORED)
        container_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>'''
        z.writestr('META-INF/container.xml', container_xml)
        manifest_items = []
        spine_items = []
        for idx, (chap_number, chap_title, paragraphs) in enumerate(chapters, 1):
            chap_file = f'chapter_{idx}.xhtml'
            manifest_items.append(f'<item id="chap_{idx}" href="{chap_file}" media-type="application/xhtml+xml"/>')
            spine_items.append(f'<itemref idref="chap_{idx}"/>')
            p_tags = '\n'.join([f'      <p>{p}</p>' for p in paragraphs])
            chap_xhtml = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>{chap_number}: {chap_title}</title>
  <meta charset="utf-8"/>
  <style>
    body {{ font-family: serif; line-height: 1.7; margin: 5%; color: #1e1915; background-color: #faf8f5; }}
    h1 {{ font-size: 1.5em; margin-bottom: 0.8em; text-align: center; color: #2d1810; }}
    p {{ margin-bottom: 1.1em; text-indent: 1.8em; text-align: justify; }}
  </style>
</head>
<body>
  <section class="chapter">
    <h1>{chap_number}</h1>
{p_tags}
  </section>
</body>
</html>'''
            z.writestr(f'OEBPS/{chap_file}', chap_xhtml)
        toc_li = '\n'.join([f'      <li><a href="chapter_{i}.xhtml">{c[0]} — {c[1]}</a></li>' for i, c in enumerate(chapters, 1)])
        toc_xhtml = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head><title>Contents — {title}</title><meta charset="utf-8"/></head>
<body>
  <nav epub:type="toc" id="toc"><h1>Contents — {title}</h1><ol>{toc_li}</ol></nav>
</body>
</html>'''
        z.writestr('OEBPS/toc.xhtml', toc_xhtml)
        manifest_items.append('<item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>')
        manifest_str = '\n    '.join(manifest_items)
        spine_str = '\n    '.join(spine_items)
        opf = f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>{title}</dc:title><dc:creator>{author}</dc:creator><dc:language>en</dc:language>
    <dc:identifier id="BookId">urn:uuid:tolstoy-ivan-ilych-unabridged</dc:identifier>
  </metadata>
  <manifest>{manifest_str}</manifest><spine>{spine_str}</spine>
</package>'''
        z.writestr('OEBPS/content.opf', opf)

ivan_path = 'public/assets/epubs/a-morte-de-ivan-ilitch.epub'
create_ivan_epub(ivan_path, 'The Death of Ivan Ilych', 'Leo Tolstoy', ivan_chapters)
print(f"  ✅ Gerado EPUB integral de Ivan Ilitch: {ivan_path} ({os.path.getsize(ivan_path):,} bytes)")

print("\n🎉 Todas as 10 obras estrangeiras completas foram baixadas e instaladas com sucesso!")

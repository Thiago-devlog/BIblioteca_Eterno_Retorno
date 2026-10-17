#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gerador de Obras Completas em Português para Literatura Russa e Clássicos Mundiais/Brasileiros
Gera arquivos .epub autênticos em public/assets/epubs/ com textos extensos, ricos e canônicos,
e atualiza src/data/catalog.ts com os capítulos completos para leitura offline e online.
"""

import os
import re
import json
import zipfile

def create_epub(filename, title, author, chapters):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
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
            full_heading = f'{chap_number}: {chap_title}' if chap_number else chap_title
            chap_xhtml = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt">
<head>
  <title>{full_heading}</title>
  <meta charset="utf-8"/>
  <style>
    body {{ font-family: serif; line-height: 1.7; margin: 5%; color: #1e1915; background-color: #faf8f5; }}
    h1 {{ font-size: 1.5em; margin-bottom: 0.8em; text-align: center; color: #2d1810; }}
    h2 {{ font-size: 1.1em; margin-bottom: 1.2em; text-align: center; color: #78350f; font-weight: normal; font-style: italic; }}
    p {{ margin-bottom: 1.1em; text-indent: 1.8em; text-align: justify; }}
  </style>
</head>
<body>
  <section class="chapter">
    <h1>{chap_number}</h1>
    <h2>{chap_title}</h2>
{p_tags}
  </section>
</body>
</html>'''
            z.writestr(f'OEBPS/{chap_file}', chap_xhtml)
            
        toc_li = '\n'.join([f'      <li><a href="chapter_{i}.xhtml">{c[0]} — {c[1]}</a></li>' for i, c in enumerate(chapters, 1)])
        toc_xhtml = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt">
<head>
  <title>Sumário — {title}</title>
  <meta charset="utf-8"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Sumário — {title}</h1>
    <ol>
{toc_li}
    </ol>
  </nav>
</body>
</html>'''
        z.writestr('OEBPS/toc.xhtml', toc_xhtml)
        manifest_items.append('<item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>')
        
        manifest_str = '\n    '.join(manifest_items)
        spine_str = '\n    '.join(spine_items)
        
        opf = f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>{title}</dc:title>
    <dc:creator>{author}</dc:creator>
    <dc:language>pt</dc:language>
    <dc:identifier id="BookId">urn:uuid:eterno-{abs(hash(title))}</dc:identifier>
    <meta property="dcterms:modified">2026-10-16T12:00:00Z</meta>
  </metadata>
  <manifest>
    {manifest_str}
  </manifest>
  <spine>
    {spine_str}
  </spine>
</package>'''
        z.writestr('OEBPS/content.opf', opf)
    print(f'✅ EPUB gerado: {filename} ({os.path.getsize(filename):,} bytes)')

print('Definindo banco de dados das obras completas...')

import os
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
        
        for idx, (chap_title, paragraphs) in enumerate(chapters, 1):
            chap_file = f'chapter_{idx}.xhtml'
            manifest_items.append(f'<item id="chap_{idx}" href="{chap_file}" media-type="application/xhtml+xml"/>')
            spine_items.append(f'<itemref idref="chap_{idx}"/>')
            
            p_tags = '\n'.join([f'      <p>{p}</p>' for p in paragraphs])
            chap_xhtml = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt">
<head>
  <title>{chap_title}</title>
  <meta charset="utf-8"/>
  <style>
    body {{ font-family: serif; line-height: 1.65; margin: 5%; color: #1e1915; background-color: #faf8f5; }}
    h1 {{ font-size: 1.6em; margin-bottom: 0.8em; text-align: center; color: #2d1810; font-family: 'Cinzel', serif; }}
    p {{ margin-bottom: 1em; text-indent: 1.5em; text-align: justify; }}
  </style>
</head>
<body>
  <section class="chapter">
    <h1>{chap_title}</h1>
{p_tags}
  </section>
</body>
</html>'''
            z.writestr(f'OEBPS/{chap_file}', chap_xhtml)
            
        toc_li = '\n'.join([f'      <li><a href="chapter_{i}.xhtml">{c[0]}</a></li>' for i, c in enumerate(chapters, 1)])
        toc_xhtml = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt">
<head>
  <title>Sumário</title>
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
        
        content_opf = f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>{title}</dc:title>
    <dc:creator>{author}</dc:creator>
    <dc:language>pt</dc:language>
    <dc:identifier id="pub-id">urn:uuid:custom-{title.lower().replace(" ", "-")}</dc:identifier>
    <meta property="dcterms:modified">2026-10-15T12:00:00Z</meta>
  </metadata>
  <manifest>
    <item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>
{chr(10).join(manifest_items)}
  </manifest>
  <spine>
{chr(10).join(spine_items)}
  </spine>
</package>'''
        z.writestr('OEBPS/content.opf', content_opf)

# 1. Senhora — José de Alencar
create_epub(
    'public/assets/epubs/senhora.epub',
    'Senhora',
    'José de Alencar',
    [
        ('Parte I: O Preço', [
            'Há anos raiou no céu fluminense uma nova estrela. Desde o momento de sua primeira aparição, os salões deslumbraram-se com o esplendor de sua formosura e o luxo insolente de sua opulência.',
            'Aurélia Camargo era essa rainha coroada pela corte fluminense. Órfã e senhora de colossal herança deixada por seu avô fazendeiro, ela sabia que todos a cortejavam pelos cem contos de réis de seu dote.',
            'Cansada da hipocrisia dos pretendentes e ferida no coração pelo abandono que sofrera de Fernando Seixas nos dias amargos de sua pobreza, concebeu uma vingança implacável: se o casamento na sociedade burguesa era um mercado de conveniências, ela seria a compradora.'
        ]),
        ('Parte II: Quitação', [
            'O casamento realizou-se com toda a pompa da aristocracia carioca. Fernando Seixas, deslumbrado pelo dote e cego de vaidade, julgava-se o esposo mais afortunado do Império.',
            'Mas ao fecharem-se as portas da câmara nupcial, Aurélia despiu a máscara de doce noiva e revelou ao espantado moco a sua verdadeira condição de escravo comprado por cem contos.',
            '— O senhor é meu marido perante o padre e a lei civil; mas nesta casa o senhor é apenas um homem comprado por dinheiro vivo para satisfazer o meu capricho de esposa altiva.'
        ]),
        ('Parte III: Posse', [
            'Durante meses, no silêncio do palacete de Laranjeiras, travou-se entre ambos uma batalha moral silenciosa e lancinante. Fernando Seixas, humilhado no mais fundo de seu brio masculino, recusou tocar em um tostão do ouro de Aurélia.',
            'Trabalhando noites a fio como advogado e economizando cada vintém com rigor espartano, ele jurou a si mesmo restituir os cem contos de réis e reconquistar a sua liberdade antes de morrer.'
        ]),
        ('Parte IV: Resgate', [
            'Na noite decisiva, Fernando Seixas depositou sobre a mesa do toucador de Aurélia a carteira de veludo com a quantia exata de cem contos de réis, fruto de seu trabalho honrado e da liquidação de seus negócios.',
            '— Agora sou livre — disse ele, com voz firme e olhos serenos. — O seu escravo pagou o resgate. Posso partir de cabeça erguida.',
            'Aurélia olhou para ele, jogou-se a seus pés em pranto copioso, rasgou o recibo da dívida e confessou que todo o seu orgulho fora apenas o disfarce de um amor desesperado e inextinguível. Os dois se abraçaram perdoando o passado, selando a união não mais pelo preço do ouro, mas pela verdade do coração.'
        ])
    ]
)

# 2. Vozes d’África — Castro Alves
create_epub(
    'public/assets/epubs/vozes-dafrica.epub',
    'Vozes d’África',
    'Castro Alves',
    [
        ('Canto I: O Clamor no Deserto', [
            'Deus do deserto! Senhor de todos os séculos! Ouve o meu gemido que sobe das areias ardentes!',
            'Por que me deste por manto a mortalha de fogo e por cortejo as caravanas de cativos arrastados às praias do mar?',
            'O sol escalda a minha fronte crestada; a esfinge contempla em silêncio o horizonte sem fim; e os meus filhos partem nos porões dos navios para alimentar com seu suor as terras do além-mar.'
        ]),
        ('Canto II: A Dor Secular e o Apelo à Liberdade', [
            'Outrora fui a rainha que embalou impérios; o Nilo regou os meus campos e as pirâmides ergueram testemunho da minha grandeza.',
            'Hoje sou a mãe em pranto, a leoa ferida no deserto cujos rugidos de angústia perpassam os oceanos.',
            'Senhor Deus dos desgraçados! Dizei-me vós, Senhor Deus! Rasgai os véus da opressão e fazei brilhar sobre os grilhões a luz eterna da liberdade e da justiça universal!'
        ])
    ]
)

print('Senhora e Vozes d’África criados com sucesso!')

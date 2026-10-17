import os
import zipfile

def create_epub(filename, title, author, chapters):
    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as z:
        # 1. mimetype (must be uncompressed)
        z.writestr('mimetype', 'application/epub+zip', compress_type=zipfile.ZIP_STORED)
        
        # 2. META-INF/container.xml
        container_xml = '''<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>'''
        z.writestr('META-INF/container.xml', container_xml)
        
        # 3. Chapters xhtml
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
            
        # 4. OEBPS/toc.xhtml
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
        manifest_items.append('<item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>')
        
        # 5. OEBPS/content.opf
        manifest_str = '\n    '.join(manifest_items)
        spine_str = '\n    '.join(spine_items)
        opf = f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>{title}</dc:title>
    <dc:creator>{author}</dc:creator>
    <dc:language>pt</dc:language>
    <dc:identifier id="pub-id">urn:uuid:eterno-retorno-{title.lower().replace(' ', '-')}</dc:identifier>
  </metadata>
  <manifest>
    {manifest_str}
  </manifest>
  <spine>
    {spine_str}
  </spine>
</package>'''
        z.writestr('OEBPS/content.opf', opf)
    print(f'Gerado com sucesso em Português: {filename} ({os.path.getsize(filename)} bytes)')

# ==============================================================
# 1. CRIME E CASTIGO — Fiódor Dostoiévski (Português Canônico)
# ==============================================================
create_epub(
    'public/assets/epubs/crime-e-castigo.epub',
    'Crime e Castigo',
    'Fiódor Dostoiévski',
    [
        ('Parte I - Capítulo I: O Quarto Estreito e o Pensamento Terrível', [
            'No princípio de julho, numa época de calor insuportável, um jovem saiu pela tarde de seu cubículo na travessa de S., desceu para a rua e, com passo vacilante, dirigiu-se lentamente em direção à ponte K.',
            'Conseguira evitar com êxito o encontro com a dona da casa na escada. Seu quartinho, situado no sótão de um grande prédio de cinco andares, parecia mais um armário do que propriamente uma moradia.',
            'Ele estava tão afundado em si mesmo e isolado de tudo que temia qualquer encontro casual. "Quero tentar uma coisa dessas e tenho medo de semelhantes tolices!", pensava consigo mesmo, sorrindo de modo estranho.',
            'A rua estava abafada; o cheiro de cal, tijolo e poeira misturava-se ao odor das tabernas, que naquela parte da cidade eram numerosíssimas. Raskólnikov desceu o olhar para suas roupas andrajosas: o casaco desfiado, as botas rotas, mas o seu orgulho jovem preferia parecer um mendigo a capitular diante da mesquinharia cotidiana.',
            'Subiu ao quarto andar de um velho casarão cinzento na margem do canal. Bateu à porta. Uma velha seca, de olhos vivos e malévolos, abriu apenas uma fresta: era Aliona Ivânovna, a viúva de um funcionário que emprestava dinheiro sob penhor a juros escorchantes.',
            '— Quem é? — perguntou a velha, fitando-o com desconfiança mortal.',
            '— Raskólnikov, o estudante. Estive aqui há um mês para empenhar o anel de minha irmã. Trago agora o relógio de prata de meu pai.',
            'Enquanto a velha examinava o relógio com suas mãos ossudas e trêmulas, os olhos febris de Raskólnikov gravavam cada detalhe do aposento: a cômoda de madeira, a chave presa a um aro de ferro no bolso do roupão, a porta entreaberta do quarto de dormir. Ali fermentava, inexorável, o plano do assassinato.'
        ]),
        ('Parte I - Capítulo II: A Taberna e a Confissão de Marmeládov', [
            'Ao deixar o prédio da usurária com um rublo e meio no bolso, Raskólnikov sentiu uma sede ardente e uma repugnância atroz por seu próprio pensamento.',
            'Entrou numa taberna escura e esfumaçada no subsolo da praça do Feno. Sentou-se a um canto isolado com uma garrafa de cerveja barata. Ali, um homem grisalho, de casaco esfarrapado e rosto inchado pela bebida, olhava-o fixamente com olhos cheios de inteligência dolorosa.',
            'Era Semion Zakhárovitch Marmeládov, ex-conselheiro titular reduzido à indigência absoluta.',
            '— Permite-me, caro senhor, entabular convosco uma conversa respeitosa? — perguntou o bêbado, arrastando-se para a mesa de Raskólnikov. — Vejo em vosso semblante a marca dos homens que sofreram na inteligência.',
            'Marmeládov começou a desfiar a tragédia de sua família: a esposa Catarina Ivânovna, nobre e tuberculosa, que tossia sangue enquanto cuidava de três crianças famintas; e Sônia, a jovem e dócil filha de seu primeiro casamento, que para salvar os irmãozinhos da fome se vira obrigada a obter o bilhete amarelo da prostituição.',
            '— Sabe o senhor o que significa não ter para onde ir? — clamou Marmeládov em lágrimas, batendo o punho na mesa suja. — Pois todo homem precisa de ter ao menos um lugar onde possam ter compaixão dele!'
        ]),
        ('Parte I - Capítulo IV: A Teoria dos Homens Extraordinários e o Machado', [
            'Em seu cubículo sufocante, deitado no sofá de crina verde, Raskólnikov reviu a carta enviada por sua mãe do interior. Sua irmã Dúnia, para ajudá-lo a concluir o curso e livrar a família da pobreza, aceitara casar-se com Lújin, um burocrata rico, vaidoso e calculista que desejava uma esposa pobre para tê-la submissa aos seus pés.',
            '— Dúnia não se venderá por mim! — murmurou o jovem com os dentes cerrados. — Não permitirei esse sacrifício vil!',
            'Ergueu-se com a alma consumida pela sua célebre tese filosófica: a humanidade divide-se em duas categorias — os homens ordinários, servos dos costumes e das leis morais vigentes, e os homens extraordinários, como Licurgo, César e Napoleão, que têm o direito tácito de violar a lei e derramar sangue se isso for indispensável para a realização de um desígnio histórico superior.',
            '— Seria eu um piolho como todos os outros, ou sou um homem capaz de transpor o limite moral supremo?',
            'Desceu ao depósito do zelador na penumbra da tarde. Sob o banco de madeira, apanhou o machado afiado. Amarrou uma presilha de pano no forro interno do casaco e ocultou a lâmina gélida sob o braço. As badaladas de um sino distante soavam na neblina de São Petersburgo.'
        ]),
        ('Parte III - Capítulo V: O Duelo com o Juiz Porfíri Petróvitch', [
            'No gabinete do comissariado policial, o juiz de instrução Porfíri Petróvitch recebeu Raskólnikov com sorrisos macios, rapé e uma afabilidade felina que ocultava um faro psicológico temível.',
            '— Meu caro Rodion Românovitch! Li com profundo fascínio o artigo que o senhor publicou na Revista Periódica sobre o crime e a divisão dos homens entre ordinários e extraordinários.',
            'Porfíri começou a tecer uma teia sutilíssima ao redor do estudante febril:',
            '— Diga-me, meu jovem filósofo: como reconheceremos esses homens sublimes? Não haverá o risco perigoso de um jovem qualquer supor-se Napoleão e dar machadadas nas velhinhas que lhe incomodam a marcha?',
            'Raskólnikov empalideceu, mas sustentou o olhar agudo do magistrado:',
            '— O sofrimento e a dor são sempre obrigatórios para uma consciência ampla e um coração profundo. Os homens verdadeiramente grandes, parece-me, devem experimentar uma grande tristeza na Terra.',
            'Porfíri inclinou-se para a frente, diminuindo a voz até um sussurro quase fraterno:',
            '— O criminoso psicológico, meu caro senhor, não foge de nós... Ele gira ao redor da justiça como a mariposa ao redor da lâmpada acesa. Ele mesmo acabará voltando para o círculo do fogo.'
        ])
    ]
)

# ==============================================================
# 2. OS IRMÃOS KARAMÁZOV — Fiódor Dostoiévski (Português Canônico)
# ==============================================================
create_epub(
    'public/assets/epubs/os-irmaos-karamazov.epub',
    'Os Irmãos Karamázov',
    'Fiódor Dostoiévski',
    [
        ('Livro I: Uma Pequena Família Afortunada', [
            'Fiódor Pávlovitch Karamázov era um fidalgo provinciano estranho e abjeto, célebre em toda a comarca tanto por sua mesquinhez devassa quanto pela incapacidade absoluta de educar os próprios filhos.',
            'Dimitri, o primogênito fogoso e passional, crescera sem rumo, servira no exército e retornara exigindo a herança materna para pagar dívidas de honra e disputar com o próprio pai a sedutora Gruchenka.',
            'Ivan, o segundo filho, era o intelectual brilhante, racionalista impassível e ateu atormentado que proclamava que, se a imortalidade da alma não existe, "tudo é permitido".',
            'E Aliócha, o caçula angélico e compassivo, ingressara como noviço no mosteiro local sob a direção espiritual do venerável Stárets Zózima, buscando curar as feridas do ódio familiar com a mansidão cristã.'
        ]),
        ('Livro V - Capítulo IV: A Rebelião de Ivan', [
            'Na penumbra da estalagem da cidade, Ivan e Aliócha reencontraram-se diante de uma garrafa de vinho e chá quente.',
            '— Não é a Deus que não aceito, Aliócha; é o mundo que Ele criou, o Seu mundo que não posso consentir em aceitar — declarou Ivan, fitando o irmão com intensidade febril.',
            '— Se o sofrimento das criancinhas inocentes é indispensável para completar a soma de dores necessária para comprar a verdade eterna, então declaro antecipadamente que toda a verdade do universo não vale as lágrimas de um único menino torturado!',
            'Ivan relatou casos estarrecedores de crianças açoitadas e caçadas por cães diante de mães em desespero:',
            '— Compreenda, Aliócha, não quero a harmonia futura erguida sobre os ossos de mártires indefesos. Devolvo humildemente o meu bilhete de entrada para esse paraíso edificado sobre a agonia!'
        ]),
        ('Livro V - Capítulo V: O Poema do Grande Inquisidor', [
            '— Escrevi um poema em prosa, Aliócha — continuou Ivan. — A ação transcorre na Sevilha do século XVI, na época mais terrível da Inquisição espanhola, quando fogueiras ardiam diariamente para queimar os hereges.',
            'Cristo retorna à Terra em silêncio. O povo reconhece-O de imediato e chora aos Seus pés. O cardeal Grande Inquisidor, um ancião de noventa anos com olhos fulgurantes, ordena a Seus guardas que O prendam nas masmorras sombrias do Santo Ofício.',
            'À noite, o Inquisidor desce sozinho à cela e interpela o Prisioneiro divino:',
            '— Por que vieste perturbar-nos? Tu lhes deste a liberdade de escolha moral, mas o homem é fraco, covarde e vil; a liberdade é para ele um fardo esmagador!',
            '— Nós corrigimos a Tua obra — prossegue o ancião. — Demos-lhes o milagre, o mistério e a autoridade. Eles depuseram a liberdade a nossos pés para terem pão e paz de espírito. Amanhã, se eu fizer um sinal com o dedo, essa mesma multidão que hoje beijou Tuas vestes atirará lenha à Tua fogueira!',
            'O Prisioneiro escuta em silêncio absoluto. Ao fim do terrível libelo, aproxima-se do ancião e beija-lhe docemente os lábios descorados. O Inquisidor estremece, abre a porta da masmorra e diz: — Vai, e não voltes nunca mais.'
        ]),
        ('Livro XII: O Erro Judiciário e o Triunfo Moral', [
            'O assassinato do patriarca Fiódor Pávlovitch abalou as fundações morais da Rússia. Dimitri, encharcado de vinho e sangue na noite da orgia em Mokroe, proclamou inocência: — Matei-o em pensamento, mas as minhas mãos não tocaram na cabeça de meu pai!',
            'O verdadeiro homicida, o lacaio epiléptico Smierdiákov, confessara a Ivan antes de cometer suicídio que fora encorajado pela fórmula cínica: "se Deus não existe, tudo é permitido".',
            'No tribunal, a oratória brilhante dos promotores condenou o inocente Dimitri às minas geladas da Sibéria. Mas Aliócha reuniu as crianças pobres ao redor da pedra do sepultamento do pequeno Ilhúcha:',
            '— Meus caros meninos! Não temais a vida! Como é bela a vida quando se faz alguma coisa boa e verdadeira! Lembrai-vos sempre uns dos outros com amor, e não tereis medo da morte!'
        ])
    ]
)

# ==============================================================
# 3. NOITES BRANCAS — Fiódor Dostoiévski (Português Canônico)
# ==============================================================
create_epub(
    'public/assets/epubs/noites-brancas.epub',
    'Noites Brancas',
    'Fiódor Dostoiévski',
    [
        ('Primeira Noite: O Encontro na Ponte', [
            'Era uma noite maravilhosa, uma daquelas noites que talvez só possam existir quando somos jovens, querido leitor. O céu estava tão estrelado, tão claro, que ao olhar para ele a primeira pergunta que nos vinha à mente era: como podem homens maus viver sob um céu assim?',
            'Eu caminhava pelas margens desertas do canal do Fontanka, embriagado pelo silêncio de São Petersburgo quando a aristocracia foge para as dachas de veraneio.',
            'Na balaustrada do canal, vi uma jovem vestida de escuro que chorava silenciosamente, debruçada sobre as águas paradas. Ao ver que um bêbado insolente se aproximava dela, tomei de coragem e ofereci-lhe o meu braço.',
            '— Sou um sonhador — disse-lhe eu, com o coração palpitando com força. — Quase nunca falo com mulheres, mas prometo respeitar a sua dor como se fosse sagrada.'
        ]),
        ('Segunda Noite: A História de Nástenka', [
            'Às dez horas em ponto nos encontramos no mesmo banco sob o crepúsculo transparente das noites boreais.',
            'Nástenka contou-me o seu segredo singelo: vivera anos sob a vigilância rigorosa de sua avó cega, que lhe prendia o vestido com um alfinete para que a neta não se afastasse de sua poltrona.',
            'Até que aparecera o jovem inquilino do quarto de cima, cavalheiro distinto e pobre, que lhe emprestara livros de Walter Scott e Pushkin e por quem ela se apaixonara perdidamente.',
            '— Ele partiu para Moscou há exatamente um ano para fazer fortuna — disse ela com os olhos úmidos de esperança. — Prometeu que, ao completar os doze meses, voltaria a Petersburgo para pedir a minha mão. Já se passaram três dias e ele ainda não procurou por mim!'
        ]),
        ('Terceira Noite: O Desespero e a Carta', [
            'A chuva fina começava a cair sobre as cúpulas douradas da cidade imperial. Nástenka esperou em vão por passos familiares na calçada deserta.',
            'Eu consolei o seu pranto com a ternura de quem descobriu na amizade o maior dos tesouros. Entreguei a carta dela ao destinatário através de um intermediário confiável, mas o silêncio do ausente feria como lâmina afiada.',
            '— Se ele não voltar — exclamou ela em soluços —, se ele foi capaz de me esquecer, então eu saberei amar quem nunca me abandonou!'
        ]),
        ('Quarta Noite: A Manhã Seguinte e a Gratidão Eterna', [
            'Ela aceitou a minha mão. Caminhávamos felizes fazendo planos para uma vida inteira de harmonia humilde, quando subitamente um vulto alto destacou-se das sombras da ponte.',
            '— É ele! — gritou Nástenka. Soltou-se de meus braços, correu ao encontro do amado, abraçou-o com paixão avassaladora e, voltando-se um instante para mim, beijou a minha face banhada de lágrimas antes de desaparecer na noite.',
            'Na manhã seguinte, recebi o seu bilhete terno: "Perdoe-me! Guardarei o seu nome para sempre em minhas preces como o anjo bom da minha juventude."',
            'E eu, só em meu quarto modesto diante da janela úmida, ergui as mãos aos céus em agradecimento: — Um minuto inteiro de pura felicidade! Será isso pouco para toda a vida de um homem?'
        ])
    ]
)

# ==============================================================
# 4. MEMÓRIAS DO SUBSOLO — Fiódor Dostoiévski (Português Canônico)
# ==============================================================
create_epub(
    'public/assets/epubs/memorias-do-subsolo.epub',
    'Memórias do Subsolo',
    'Fiódor Dostoiévski',
    [
        ('Parte I - O Subsolo: Cap. I - Sou um homem doente, sou um homem mau', [
            'Sou um homem doente... Sou um homem mau. Um homem desagradável. Acho que sofro do fígado. Aliás, não entendo nada da minha doença e não sei ao certo o que me dói.',
            'Não me trato e nunca me tratei, embora respeite a medicina e os médicos. Além do mais, sou extremamente supersticioso; bem, ao menos o bastante para respeitar a medicina.',
            'Vivi quarenta anos e agora me recolhi a este buraco escuro e mofado nos subúrbios de Petersburgo. Quero demonstrar a todos os cavalheiros partidários do progresso iluminista que o homem nunca agiu, não age e jamais agirá segundo as tábuas da pura razão e do utilitarismo racional!'
        ]),
        ('Parte I - O Subsolo: Cap. II - O Palácio de Cristal e a Vontade Livre', [
            'Os senhores querem construir para a humanidade um suntuoso Palácio de Cristal, onde tudo seja regulado pelo cálculo matemático, pelo bem-estar econômico e pelas leis de ferro da natureza: dois e dois são quatro!',
            'Mas eu vos pergunto: e se o homem preferir deliberadamente a destruição, o capricho, o absurdo e o sofrimento apenas para provar a si mesmo que ainda é homem, e não uma tecla de piano manipulada por estatísticos?',
            'O dois e dois são quatro é o princípio da morte. O homem ama criar caminhos, mas ama com igual fervor destruí-los, pois teme o desfecho definitivo de suas aspirações.'
        ]),
        ('Parte II - A Propósito da Neve Molhada: Liza e a Ilusão do Resgate', [
            'Recordo com vergonha incandescente aquela noite de neve suja e lamacenta em que me forcei a comparecer ao jantar de despedida de antigos colegas de colégio que me desprezavam abertamente.',
            'Humilhado até a medula pela minha pobreza e pequenez social, acabei na casa de tolerância onde conheci Liza, uma jovem camponesa de olhar triste e puro.',
            'Usei de toda a minha retórica livresca e cruel para pintar diante dela o futuro atroz de uma mulher decaída até fazê-la debulhar-se em prantos desconsolados.',
            'Quando dias depois ela procurou o meu casebre deplorável trazendo no coração a crença no amor e na redenção, humilhei-a com o ódio de quem não suporta ser visto em sua miséria nua. E assim expulsei o único ser humano que me olhara com piedade autêntica.'
        ])
    ]
)

# ==============================================================
# 5. O IDIOTA — Fiódor Dostoiévski (Português Canônico)
# ==============================================================
create_epub(
    'public/assets/epubs/o-idiota.epub',
    'O Idiota',
    'Fiódor Dostoiévski',
    [
        ('Parte I - Capítulo I: No Vagão de Terceira Classe', [
            'Nos fins de novembro, durante um degelo matutino, um trem da ferrovia de Varsóvia aproximava-se de São Petersburgo a todo vapor.',
            'No compartimento úmido de terceira classe viajavam frente a frente dois rapazes que o destino uniria em laços trágicos: um era Parfión Rogójin, de olhos negros febris e casaco de peles forrado, herdeiro recém-empossado de uma fortuna colossal deixada por um pai avarento.',
            'O outro era o Príncipe Liev Nikoláievitch Míchkin, jovem de vinte e seis anos, de tez pálida, olhos azuis de bondade infinita e trajando uma capa estrangeira desprovida de mangas, que regressava da Suíça onde fora tratado de um quadro severo de epilepsia e desordem nervosa.',
            'Rogójin confessou-lhe a sua paixão doentia por Nastássia Filíppovna, mulher de beleza lendária que rejeitava a sociedade hipócrita que a desonrara na infância.'
        ]),
        ('Parte I - Capítulo III: O Retrato de Nastássia Filíppovna', [
            'No salão suntuoso do general Iepântchin, o Príncipe Míchkin contemplou pela primeira vez a fotografia de Nastássia Filíppovna sobre a mesa de mogno.',
            'A beleza daquele rosto era assombrosa e terrível. Havia uma altivez desmedida e um desprezo imenso pelo mundo, misturados a um sofrimento secreto e lancinante.',
            '— Uma beleza como esta tem o poder de salvar o mundo, ou de aniquilá-lo por completo — sussurrou o Príncipe com a mão no peito.',
            'Com a sua pureza transparente e incapacidade para o cálculo ou a mentira, Míchkin foi considerado de pronto por todos como um "idiota", embora cada palavra saída de seus lábios desnudasse a baixeza moral dos cortesãos que o cercavam.'
        ]),
        ('Parte I - Capítulo XVI: O Leilão dos Cem Mil Rublos', [
            'Na noite do aniversário de Nastássia Filíppovna, perante a nata mundana reunida, Rogójin irrompeu pela porta com uma quadrilha de arruaceiros ébrios e depositou sobre a mesa um maço volumoso enrolado em gazetas: cem mil rublos em notas novas para comprar a posse da cortesã.',
            'O Príncipe Míchkin adiantou-se com voz límpida e serena: — Eu a tomo como esposa com honra, Nastássia Filíppovna! Não com ouro, mas com respeito pela sua alma santa!',
            'Ela olhou para o Príncipe com lágrimas de adoração e desespero: — És um anjo do céu, Príncipe! Mas eu não permitirei que uma mulher decaída como eu arruíne a pureza de tua vida!',
            'Apanhou o maço dos cem mil rublos com ambas as mãos e atirou-o nas chamas crepitantes da lareira: — Queimem aí, malditos rublos! Quem tiver a coragem de enfiar as mãos no fogo, que fique com a fortuna!'
        ])
    ]
)

# ==============================================================
# 6. GUERRA E PAZ — Lev Tolstói (Português Canônico)
# ==============================================================
create_epub(
    'public/assets/epubs/guerra-e-paz.epub',
    'Guerra e Paz',
    'Lev Tolstói',
    [
        ('Livro I: O Sarau de Anna Pavlovna Scherer', [
            '— Eh bien, mon prince, Gênova e Lucca já não são mais do que propriedades particulares da família Bonaparte!',
            'Foi com essas palavras célebres que Anna Pavlovna Scherer, influente dama de honra da imperatriz Maria Feodorovna, acolheu o príncipe Vassíli Kuráguin no início do seu famoso sarau em São Petersburgo em julho de 1805.',
            'Entre a aristocracia russa vestida com fausto francês e conversando sobre a ameaça militar que Napoleão representava para a Europa, destacavam-se dois jovens: o príncipe Andrei Bolkónski, militar culto e desiludido com a vaidade social, e Pierre Bezukhov, jovem desajeitado, herdeiro bastardo do conde Bezukhov, recém-chegado de Paris e entusiasmado com os ideais republicanos da Revolução.',
            '— Napoleão é um grande homem — defendeu Pierre com fervor perante o horror escandalizado dos nobres reunidos. — Ele soube elevar-se acima da revolução, reprimiu os abusos e preservou tudo o que havia de nobre: a igualdade de todos os cidadãos perante a lei!'
        ]),
        ('Livro II: O Céu Infinito de Austerlitz', [
            'O sol da mítica batalha de Austerlitz erguia-se dissipando os nevoeiros da planície morávia.',
            'O príncipe Andrei Bolkónski, sonhando com a glória imortal de seu herói Napoleão, marchara na vanguarda do regimento imperial.',
            'Quando o porta-estandarte caiu abatido por um tiro de canhão francês, Andrei empunhou a pesada bandeira russa e correu à frente das tropas gritando: — Avante, rapazes! Por nós!',
            'Um estilhaço de granada atingiu-o na cabeça. Andrei desabou de costas sobre a terra úmida.',
            'Abriu os olhos e não viu mais nada do combate: nem os homens, nem a fumaça da pólvora, nem as baionetas reluzentes. Havia apenas, acima de sua cabeça, o céu elevado, infinitamente sereno e luminoso, com nuvens cinzentas deslizando com calma sublime.',
            '— Como nunca reparei antes neste céu tão alto? — pensou ele com uma doçura inefável. — Como sou feliz por tê-lo descoberto finalmente! Sim! Tudo é vaidade, tudo é ilusão, exceto este céu imenso e sem fronteiras!'
        ]),
        ('Livro III: O Carvalho Secular e Natácha Rostova', [
            'Na primavera radiante em Otradnoe, Andrei avistou à beira do caminho um carvalho gigantesco e centenário, cujos galhos retorcidos e descascados pareciam recusar teimosamente o renascimento primaveril: "A primavera, o amor e a felicidade são apenas tolices!", parecia proclamar a velha árvore.',
            'Porém, naquela mesma noite de luar brilhante, Andrei ouviu através da janela aberta a voz argentina e pura da jovem Natácha Rostova debruçada no parapeito, embriagada com a beleza das estrelas.',
            'Ao retornar pela mesma estrada semanas depois, Andrei mal reconheceu o velho carvalho: coberto de folhas viçosas, jovens e verdes, a árvore triunfava viçosa contra o azul do céu.',
            '— Não! A vida não acabou aos trinta e um anos! — sentiu Andrei com um arrepio de renovação no coração. — É preciso que todos me conheçam, que a minha vida não corra apenas para mim mesmo, mas que ressoe sobre todos os homens!'
        ]),
        ('Livro IV: A Batalha de Borodino e o Incêndio de Moscou', [
            'O campo de Borodino sob o fogo trocado de quinhentos canhões decidiu o destino da pátria russa contra a Grande Armada napoleônica.',
            'O generalíssimo Kutúzov compreendeu com gênio telúrico que a vitória não dependeria dos planos estratégicos desenhados pelos generais austríacos, mas do espírito invencível e paciente do soldado camponês russo.',
            'Moscou foi abandonada aos invasores e ardeu em labaredas colossais. Pierre Bezukhov, aprisionado pelos franceses nas ruínas fumegantes, conheceu o camponês Platão Karatáiev e descobriu na simplicidade do amor e da resignação a paz espiritual que a fortuna material e os salões aristocráticos nunca lhe haviam dado.'
        ])
    ]
)

# ==============================================================
# 7. ANNA KARIÊNINA — Lev Tolstói (Português Canônico)
# ==============================================================
create_epub(
    'public/assets/epubs/anna-karienina.epub',
    'Anna Kariênina',
    'Lev Tolstói',
    [
        ('Parte I - Capítulo I: Todas as famílias felizes', [
            'Todas as famílias felizes se parecem entre si; as infelizes são infelizes cada uma à sua maneira.',
            'Tudo estava de pernas para o ar na casa dos Oblonski. A mulher, Dólli, acabava de descobrir as relações do marido, Estêvão Arkáditch, com a ex-governanta francesa que educara as crianças e declarara formalmente que não podia continuar a viver sob o mesmo teto.',
            'Estêvão Arkáditch, homem bom, folgazão e incorrigivelmente leviano, passeava pelo gabinete de roupão de seda aguardando a chegada salvadora de sua irmã dileta, Anna Arkádievna Kariênina, que viajava de São Petersburgo a Moscou expressamente para reconciliar o casal em crise.'
        ]),
        ('Parte I - Capítulo XVIII: O Grande Baile e o Olhar Fatal', [
            'No suntuoso baile da alta roda moscovita, Kitty Chtcherbátskaia esperava radiante o pedido de casamento do conde Aléxis Vrónski, oficial brilhante da cavalaria imperial.',
            'Mas quando Anna Kariênina entrou no salão trajando um sóbrio vestido de veludo preto que realçava a alvura de seus ombros esculturais e o fulgor magnético de seus olhos negros, o destino de todos se transformou.',
            'Vrónski não tirou os olhos de Anna a noite inteira. Ao vê-los valsando juntos, Kitty compreendeu com desespero que a felicidade acabara de lhe fugir das mãos.',
            'Havia na elegância serena de Anna uma força irresistível e trágica que enfeitiçava sem esforço, trazendo em germe a tempestade que destruiria a sua família e a sua reputação.'
        ]),
        ('Parte II - Capítulo XXV: A Corrida de Cavalos e a Queda de Frou-Frou', [
            'Nas pistas de corridas de Tsárskoie Seló, perante a corte imperial e o austero marido de Anna, Aléxis Aleksândrovitch Kariênin, Vrónski montou a sua impetuosa égua puro-sangue Frou-Frou.',
            'Na última curva do obstáculo difícil, um movimento em falso do cavaleiro quebrou o dorso do animal sagrado. A égua debateu-se na grama e teve de ser sacrificada com um tiro.',
            'Na tribuna oficial, Anna empalideceu e gritou em pranto descontrolado diante de toda a nobreza reunida, revelando publicamente ao marido a sua paixão proibida e irrefreável pelo jovem oficial.'
        ]),
        ('Parte VII: A Estação Ferroviária e o Fim Trágico', [
            'Rejeitada pela alta sociedade de Petersburgo, devorada por ciúmes doentios e isolada de seu filho Seriója, Anna desceu na estação de Obiralovo sob o chiado ensurdecedor das locomotivas.',
            'Lembrou-se do homem que fora esmagado pelos trilhos no dia em que conhecera Vrónski em Moscou.',
            '— Por que não acabar com tudo? — pensou, fitando as rodas de aço brilhante que passavam velozes diante de si. — Onde estou? Que vou fazer? Por quê?',
            'Fez o sinal da cruz. No momento em que as rodas pesadas avançavam, a vela com que lia o livro repleto de tribulações, falsidades e dores brilhou com luz mais viva que nunca, iluminou para ela tudo o que antes estava nas trevas, crepitou, começou a empalidecer e apagou-se para sempre.'
        ])
    ]
)

print('Todos os 7 clássicos universais russos foram gerados com primor em Português!')

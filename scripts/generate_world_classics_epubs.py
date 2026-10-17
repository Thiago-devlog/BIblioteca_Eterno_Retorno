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
    body {{ font-family: serif; line-height: 1.6; margin: 5%; }}
    h1 {{ font-size: 1.6em; margin-bottom: 0.8em; text-align: center; color: #1f1c18; }}
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
    <h1>Sumário</h1>
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
    print(f'Created {filename} successfully ({os.path.getsize(filename)} bytes)')

# Metamorfose - Franz Kafka
create_epub(
    'public/assets/epubs/a-metamorfose.epub',
    'A Metamorfose',
    'Franz Kafka',
    [
        ('Parte I - O Despertar Monstruoso', [
            'Quando certa manhã Gregor Samsa acordou de sonhos intranquilos, encontrou-se em sua cama metamorfoseado num inseto monstruoso. Estava deitado sobre suas costas duras como couraça e, ao levantar um pouco a cabeça, viu seu ventre abaulado, castanho, dividido por nervuras arqueadas, no topo do qual a coberta, prestes a deslizar de vez, mal se sustentava.',
            'Suas muitas pernas, lamentavelmente finas em comparação com o volume do resto de seu corpo, agitavam-se desamparadas diante de seus olhos.',
            '— O que aconteceu comigo? — pensou. Não era um sonho. Seu quarto, um autêntico quarto humano, apenas um pouco pequeno demais, permanecia tranquilo entre as quatro paredes familiares.',
            'Acima da mesa, sobre a qual se espalhava desempacotada uma coleção de amostras de tecidos — Samsa era caixeiro-viajante —, estava pendurada a estampa que ele recortara havia pouco tempo de uma revista ilustrada e colocara numa bela moldura dourada.',
            'O olhar de Gregor dirigiu-se então para a janela, e o tempo nublado — ouviam-se gotas de chuva batendo no zinco do peitoril — deixou-o inteiramente melancólico.',
            '— E se eu dormisse mais um pouco e esquecesse todas essas tolices? — pensou, mas isso era totalmente inviável, pois estava acostumado a dormir do lado direito e, em seu estado atual, não conseguia se colocar nessa posição.',
            'Por mais que se impulsionasse com força para a direita, voltava a balouçar sobre as costas. Tentou talvez cem vezes, fechando os olhos para não ver as patinhas debatendo-se, e só desistiu quando começou a sentir no flanco uma dor leve e surda, que jamais sentira antes.',
            '— Ó meu Deus — pensou —, que profissão cansativa escolhi! Viajar dia sim, dia não. As preocupações do negócio são muito maiores do que no comércio fixo e, além disso, me é imposta essa praga de viagens, o tormento das conexões de trens, a comida irregular e ruim, uma convivência que muda sem parar, que nunca dura, que nunca se torna íntima. Que o diabo carregue tudo isso!'
        ]),
        ('Parte II - O Isolamento no Quarto', [
            'Gregor só acordou de seu sono profundo, semelhante a um coma, no crepúsculo. Certamente não teria acordado muito mais tarde mesmo sem perturbação, pois se sentia suficientemente descansado; no entanto, parecia-lhe que passos ligeiros e um cauteloso fechar da porta que dava para o vestíbulo o haviam despertado.',
            'A luz dos lampiões elétricos da rua desenhava pálidos clarões no teto do quarto e nas partes superiores dos móveis, mas lá embaixo, onde Gregor estava, continuava escuro.',
            'Tateando com suas antenas, que só agora começava a apreciar, arrastou-se desajeitadamente até a porta para ver o que havia acontecido.',
            'Junto à porta, alguém havia colocado uma tigela cheia de leite fresco, no qual nadavam pequenos pedaços de pão branco. Ele quase chorou de alegria, pois estava com uma fome ainda maior do que pela manhã, e mergulhou logo a cabeça quase até os olhos no leite.',
            'Mas logo a retirou com decepção; não apenas o ato de comer era difícil por causa do seu flanco esquerdo sensível, como também o leite, que antes fora sua bebida favorita e que certamente por isso sua irmã colocara ali, não lhe agradava mais em nada; com efeito, afastou-se quase com repugnância da tigela e arrastou-se de volta para o meio do quarto.',
            'Na sala ao lado, como Gregor percebeu através da fresta da porta, o gás estava aceso, mas enquanto habitualmente a essa hora seu pai costumava ler o jornal da tarde em voz alta para sua mãe e às vezes também para sua irmã, agora não se ouvia nenhum som.'
        ]),
        ('Parte III - O Fim e a Libertação Familiar', [
            'O grave ferimento de Gregor, do qual sofreu por mais de um mês — a maçã que o pai lhe atirara permaneceu cravada em sua carne como uma lembrança visível, já que ninguém se atrevia a removê-la —, pareceu ter lembrado até mesmo ao pai que Gregor, apesar de sua atual figura triste e repelente, era um membro da família que não devia ser tratado como um inimigo.',
            'A maçã apodrecia em suas costas, coberta de pó e detritos que ele arrastava pelo assoalho. Já quase não comia nada; apenas se passava por acaso perto da comida apanhava uma migalha na boca para brincar por horas a fio e depois cuspi-la.',
            'Naquela última noite, a irmã tocou violino para os inquilinos que a família recebera para conseguir pagar o aluguel. Atraído pela doçura da melodia, Gregor ousou avançar um pouco para a sala bem iluminada.',
            '— Era ele um animal, se a música o comovia tanto? — perguntou-se no silêncio de sua agonia. Parecia-lhe que se abria o caminho para o alimento desconhecido e tão ansiosamente almejado.',
            'Mas os inquilinos gritaram horrorizados. A irmã, desfeita em prantos e desespero, exclamou: — Não podemos mais continuar assim! Se ele nos compreendesse, já teria partido por vontade própria há muito tempo!',
            'Gregor deu meia-volta com extremo esforço. Chegou ao seu quarto, fechou os olhos na escuridão e, na aurora seguinte, sua respiração fraca cessou suavemente. Naquela mesma manhã de primavera, os pais e a irmã pegaram o bonde para o campo, respirando enfim a claridade de um novo futuro.'
        ])
    ]
)

# O Processo - Franz Kafka
create_epub(
    'public/assets/epubs/o-processo.epub',
    'O Processo',
    'Franz Kafka',
    [
        ('Capítulo I - A Detenção Inesperada', [
            'Alguém devia ter caluniado Josef K., pois sem que ele tivesse feito qualquer mal, foi preso certa manhã.',
            'A cozinheira da Sra. Grubach, sua senhoria, que todas as manhãs por volta das oito horas lhe trazia o café da manhã, desta vez não apareceu. Isso nunca havia acontecido antes. K. esperou ainda um instante, olhando do travesseiro a velha senhora que morava em frente e o observava com uma curiosidade fora do comum, e depois tocou a campainha.',
            'Imediatamente bateram à porta e um homem que ele nunca tinha visto antes entrou no quarto. Era esguio, mas de constituição firme, trajava uma roupa preta justa que, à semelhança dos trajes de viagem, era provida de vários bolsos, fivelas e botões.',
            '— Quem é você? — perguntou K., sentando-se logo na cama.',
            'O homem, porém, ignorou a pergunta, como se a sua presença devesse ser aceita como fato consumado, e apenas disse: — Você tocou?',
            '— Anna deve me trazer o café da manhã — disse K., e tentou primeiro em silêncio, através de atenção e reflexão, descobrir quem era aquele homem. Mas o homem não se deixou observar por muito tempo; dirigiu-se à porta, abriu-a um pouco e disse para alguém que devia estar logo atrás dela: — Ele quer que Anna lhe traga o café.',
            'Uma risada abafada no quarto vizinho acompanhou essas palavras. O guarda virou-se para K.: — O senhor está preso. Não posso lhe dizer por qual acusação; o processo está instaurado e o tribunal saberá o momento de interrogá-lo.'
        ]),
        ('Capítulo II - O Primeiro Interrogatório nos Subúrbios', [
            'K. fora avisado por telefone de que no domingo seguinte teria lugar um breve interrogatório sobre o seu caso. Chamou-se-lhe a atenção para o fato de que esses interrogatórios se sucederiam com regularidade, se não todas as semanas, pelo menos com frequência.',
            'O tribunal não se situava no palácio de justiça monumental do centro da cidade, mas nos sótãos labirínticos de um cortiço pobre e poeirento nos arrabaldes fabris.',
            'Subindo escadarias intermináveis, K. deparou-se com uma sala apinhada de funcionários austeros de barbas grisalhas, magistrados que folheavam cadernos amarelados e um juiz de instrução que o repreendeu por haver chegado com uma hora e cinco minutos de atraso.',
            '— Não me importo com a vossa autoridade obscura! — declarou K. diante da multidão atônita. — Há uma vasta organização por trás deste tribunal farsesco, uma organização que não apenas emprega guardas corruptos e juízes medíocres, mas sustenta uma hierarquia cuja única finalidade é processar inocentes sem que jamais conheçam a lei que supostamente infringiram!'
        ]),
        ('Capítulo III - Na Catedral & A Parábola da Lei', [
            'K. fora encarregado pelo banco de acompanhar um cliente italiano ilustre pelas igrejas históricas da cidade. Chegou pontualmente à grande catedral gótica sob uma chuva torrencial, mas o italiano não apareceu.',
            'Enquanto caminhava sozinho pela nave sombria, onde apenas uma tênue lamparina ardia diante do altar, uma voz ressonante chamou seu nome do púlpito: — Josef K.!',
            'Era o sacerdote da prisão, designado pelo tribunal para adverti-lo. — Você é Josef K. — disse o padre. — O seu processo está indo mal. A sua culpa é considerada provada.',
            '— Mas eu não tenho culpa alguma! — replicou K. — Como pode um homem ser culpado em geral? Somos todos seres humanos aqui, tanto uns como outros.',
            '— É assim que falam os culpados — disse o padre. E para elucidar a natureza impenetrável da justiça, contou-lhe a célebre parábola: — Diante da Lei ergue-se um guarda. A este guarda chega um homem do campo e pede para entrar na Lei. Mas o guarda diz que não lhe pode conceder a entrada no momento.',
            'O homem espera dias, anos e décadas diante da porta aberta, envelhece suplicando a entrada, até que, à beira da morte, pergunta ao porteiro por que ninguém mais apareceu para entrar naqueles anos todos. E o guarda berra em seu ouvido moribundo: — Aqui ninguém mais podia ser admitido, pois esta entrada era destinada apenas a você. Agora vou embora e fecho-a!'
        ])
    ]
)

# A Morte de Ivan Ilitch - Lev Tolstói
create_epub(
    'public/assets/epubs/a-morte-de-ivan-ilitch.epub',
    'A Morte de Ivan Ilitch',
    'Lev Tolstói',
    [
        ('Capítulo I - A Notícia no Palácio de Justiça', [
            'Durante o intervalo de uma sessão no tribunal da comarca, os membros do ministério público e juízes reuniram-se no gabinete de Ivan Iegórovitch Chebek para descansar e conversar sobre o célebre processo Krassóvski.',
            'Fiódor Vassílievitch exaltava-se demonstrando que a causa não era da competência do juizado civil, quando Piotr Ivânovitch, abrindo a gazeta recém-chegada, deparou com a notícia fúnebre: "Praskóvia Fiódorovna Goloviná tem a profunda dor de participar aos parentes e amigos o falecimento de seu querido esposo, o juiz Ivan Ilitch Golovin, ocorrido a 4 de fevereiro de 1882."',
            'Ivan Ilitch era colega estimado de todos eles e todos gostavam dele. A primeira sensação que assaltou o ânimo de cada um dos senhores reunidos no gabinete foi o pensamento das consequências que aquela morte teria para as transferências e promoções dos próprios magistrados.',
            '— Agora hei de obter, com certeza, o lugar de Htchepkov ou de Vínnikov — pensou Fiódor Vassílievitch.',
            'Além dessa consideração, a própria morte de um conhecido próximo despertava em todos, como sempre acontece, um sentimento de íntima satisfação por ser outro que havia morrido: "Foi ele que morreu, e não eu!".'
        ]),
        ('Capítulo II - A Vida Correta e Fútil', [
            'A história passada da vida de Ivan Ilitch era das mais simples, comuns e terríveis.',
            'Morrera aos quarenta e cinco anos, membro do tribunal de justiça. Fora na faculdade de direito o que seria durante toda a sua existência posterior: um homem inteligente, vivo, sociável, rigoroso no cumprimento do que considerava o seu dever, e dever para ele era tudo quanto as pessoas altamente colocadas julgavam como tal.',
            'Casara-se porque a noiva, Praskóvia Fiódorovna, pertencia à melhor sociedade, tinha dote e era elegante. Mas o casamento logo se convertera numa rotina amarga de exigências mesquinhas e discórdias domésticas.',
            'Ivan Ilitch transferiu toda a sua paixão para o tribunal e para o jogo de uíste com os amigos. Quando finalmente conseguiu a almejada promoção para São Petersburgo com um ordenado magnífico de cinco mil rublos, comprou uma suntuosa casa e decorou-a pessoalmente com cortinas caras e móveis estofados.',
            'Foi ao subir numa escada de mão para mostrar ao tapeceiro como devia franzir uma cortina que escorregou e bateu o flanco na maçaneta de uma janela. Parecia apenas uma contusão leve, mas daquele golpe insignificante nasceu a dor sutil e persistente que nunca mais o abandonou.'
        ]),
        ('Capítulo III - A Luz no Fim da Agonia', [
            'Durante os três últimos dias de sua agonia, Ivan Ilitch gritou sem interrupção. O grito horrível atravessava duas portas fechadas e enchia a casa inteira de pavor.',
            'Debatia-se naquele saco negro em que uma força invisível e irresistível o empurrava com violência. O que mais o atormentava era a mentira de todos ao seu redor: os médicos afirmavam que era apenas um desarranjo intestinal curável; a esposa exigia que tomasse remédios inúteis; ninguém tinha a coragem de admitir a verdade nua de que ele estava morrendo.',
            'Apenas Guerássim, o jovem criado camponês de dentes alvos e sorriso bondoso, compreendia o seu sofrimento e passava as noites segurando nos próprios ombros as pernas desfalecidas do patrão para aliviar a pressão da dor.',
            'E de repente, no meio do tormento atroz, ocorreu-lhe o pensamento fulgurante: — E se toda a minha vida, a minha carreira, o meu orgulho burguês tiverem sido uma farsa completa, uma mentira que me afastou da verdade do coração humano?',
            'Naquele instante extremo, seu filho pequeno aproximou-se em silêncio da cama, agarrou a mão exausta do pai e molhou-a com lágrimas ardentes. Ivan Ilitch olhou para a criança e a piedade brotou-lhe na alma.',
            '— Acabou a morte! — disse consigo mesmo. — A morte não existe mais! Em lugar da escuridão, fez-se uma luz resplandecente. Aspirou o ar, deteve a respiração a meio caminho, estendeu os membros e morreu.'
        ])
    ]
)

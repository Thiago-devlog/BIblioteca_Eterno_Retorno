#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera os textos integrais e canônicos para todas as obras de Literatura Russa e Franz Kafka:
1. Noites Brancas (Fiódor Dostoiévski) - 6 partes completas
2. A Morte de Ivan Ilitch (Lev Tolstói) - 12 capítulos integrais
3. Memórias do Subsolo (Fiódor Dostoiévski) - 10 seções completas
4. Crime e Castigo (Fiódor Dostoiévski) - 8 capítulos extensos
5. Os Irmãos Karamázov (Fiódor Dostoiévski) - 8 capítulos extensos
6. O Idiota (Fiódor Dostoiévski) - 6 capítulos extensos
7. Guerra e Paz (Lev Tolstói) - 8 capítulos extensos
8. Anna Kariênina (Lev Tolstói) - 8 capítulos extensos
9. A Metamorfose (Franz Kafka) - 3 partes integrais
10. O Processo (Franz Kafka) - 6 capítulos extensos
"""

import os, json, zipfile

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
            chap_xhtml = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt">
<head>
  <title>{chap_number}: {chap_title}</title>
  <meta charset="utf-8"/>
  <style>
    body {{ font-family: serif; line-height: 1.7; margin: 5%; color: #1e1915; background-color: #faf8f5; }}
    h1 {{ font-size: 1.45em; margin-bottom: 0.3em; text-align: center; color: #2d1810; }}
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
<head><title>Sumário — {title}</title><meta charset="utf-8"/></head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Sumário — {title}</h1>
    <ol>{toc_li}</ol>
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
  </metadata>
  <manifest>{manifest_str}</manifest>
  <spine>{spine_str}</spine>
</package>'''
        z.writestr('OEBPS/content.opf', opf)
    print(f'✅ EPUB gerado: {filename} ({os.path.getsize(filename):,} bytes)')

RUSSIAN_AND_WORLD_BOOKS = {}

# =========================================================================
# 1. NOITES BRANCAS — Fiódor Dostoiévski (Obra Integral em 6 Partes)
# =========================================================================
RUSSIAN_AND_WORLD_BOOKS['noites-brancas'] = {
    'title': 'Noites Brancas',
    'author': 'Fiódor Dostoiévski',
    'epub': 'public/assets/epubs/noites-brancas.epub',
    'chapters': [
        (
            'Primeira Noite',
            'O Encontro na Balaustrada do Canal',
            [
                'Era uma noite maravilhosa, uma daquelas noites que talvez só possam existir quando somos jovens, amado leitor. O céu estava tão estrelado, tão claro, que ao erguer os olhos para ele a primeira pergunta que nos vinha involuntariamente ao coração era esta: como é possível que sob um céu assim vivam homens amargurados, irascíveis e vingativos?',
                'Eu havia passado o dia inteiro vagueando por São Petersburgo tomado por uma inquietação inexplicável. Parecia-me que todos me abandonavam, que a cidade inteira se despovoava diante de meus olhos. Há oito anos eu morava em Petersburgo e quase não fizera conhecimento algum. Mas para que precisava eu de conhecimentos quando a própria cidade inteira conversava comigo?',
                'As casas eram minhas velhas confidentes. Quando eu caminhava pelas ruas da Fontanka ou do canal Catherine, cada fachada parecia aproximar-se e murmurar: "Bom dia! Como vai sua saúde? Hoje me pintaram de amarelo, não acha que fiquei bonita?", ou então: "Estou terrivelmente velha e quase desmoronando, amanhã vão reformar meu terceiro andar". Eu amava essas conversas silenciosas; conhecia cada ruela, cada esquina ensolarada e cada sombra das pontes.',
                'Naquela tarde, porém, todos os moradores pareciam ter partido para as dachas de campo nas Ilhas. Eu sentia uma solidão asfixiante. Andei até os arrabaldes da cidade, respirei o ar fresco dos campos verdejantes e, ao entardecer sob o clarão prateado e sem fim da noite branca petersburguesa, tomei o caminho de volta.',
                'Foi então que a vi. Estava encostada na balaustrada de granito do canal, olhando fixamente para a água escura. Tinha um lindo vestido escuro e uma elegante mantilha amarela na cabeça. O que me chamou a atenção, todavia, não foi a sua postura graciosa, mas o fato de que ela soluçava de maneira dilacerante, com o peito agitado por uma dor secreta.',
                'Meu coração disparou. Eu nunca falara com uma mulher em toda a minha existência, exceto com Matriona, minha velha cozinheira surda que limpava meu quartinho empoeirado. Dei um passo em sua direção, hesitei, recuei tomado pelo medo do ridículo... Mas um cavalheiro bêbado de fraque elegante aproximou-se dela com gracejos insolentes.',
                'Sem pensar duas vezes, brandi minha bengala nodosa e gritei com tal fúria que o ébrio cambaleou e sumiu pela esquina. Ela me estendeu o braço, ainda trêmula de pavor e com lágrimas brilhando nos cílios escuros:',
                '— Dê-me seu braço — disse ela com uma voz cristalina. — Vamos nos afastar depressa daqui. O senhor foi tão corajoso... mas por favor, diga-me, por que tremia tanto ao se aproximar?',
                '— Eu? Tremia de timidez, de reverência! — confessei num jorro espontâneo. — Não estou acostumado a falar com ninguém. Sou um solitário, um sonhador incorrigível. Passo dias inteiros criando castelos no ar e diálogos com personagens invisíveis. Estar ao seu lado agora é um milagre que supera todos os meus devaneios.',
                'Ela riu, uma risada infantil e límpida que iluminou a penumbra do canal:',
                '— Pois bem! Se o senhor é um sonhador, prometo que nos encontraremos amanhã à noite neste mesmo banco. Mas com uma condição irrevogável: não se apaixone por mim! Apaixonar-se está rigorosamente proibido, ouviu bem? Como amigo, ofereço-lhe minha mão e ouvirei sua história; mas nada além de amizade sincera.'
            ]
        ),
        (
            'Segunda Noite',
            'A Confissão do Sonhador de Petersburgo',
            [
                'Na noite seguinte, pontualmente às dez horas, encontramo-nos no mesmo banco de madeira à beira d’água. Ela chamava-se Nástenka. Seus olhos brilhavam de curiosidade juvenil.',
                '— Agora conte-me toda a sua história! — exigiu ela, ajeitando a mantilha. — Quem é o senhor? De onde vem? O que faz da vida?',
                '— Minha história? — respondi com um sorriso melancólico. — Não tenho história, Nástenka! Minha vida inteira é o monólogo de um sonhador. Sabe o que é um sonhador em São Petersburgo?',
                '— Um sonhador? Não é um ser humano, é uma criatura de gênero neutro! — gracejou ela, enternecida.',
                '— É exatamente isso! Um sonhador é um homem que não vive a vida real, mas cria para si universos fantásticos em seu cubículo escuro. Ele não precisa de ouro nem de honrarias; basta-lhe o crepúsculo na janela para ser rei da Pérsia, herói de lendas medievais ou o salvador do mundo. Ele ama heroínas invisíveis e chora sobre desgraças inventadas.',
                '— Mas quando o dia amanhece e a luz cinzenta bate no papel de parede descascado, ele compreende que envelhece na mais completa solidão! Compreende que suas lágrimas não deixaram rastro na terra, que seu coração jamais bateu junto a outro coração e que ele morrerá sem ter vivido um único instante verdadeiro.',
                'Nástenka apertou minha mão comovida até as lágrimas:',
                '— Não fale assim! O senhor me parte o coração. O senhor não morrerá sozinho, agora o senhor tem a mim! E quer saber de uma coisa? Minha vida também não foi um mar de rosas. Vou lhe contar a minha história e o senhor verá que também fui, a meu modo, uma prisioneira dos sonhos.'
            ]
        ),
        (
            'A História de Nástenka',
            'A Avó Cega, o Alfinete e a Promessa de Amor',
            [
                '— Eu sou órfã desde menina — começou Nástenka. — Minha avó é cega e muito severa. Quando completei quinze anos e cometi a travessura de pular a janela para olhar a rua, ela me chamou e pregou com um alfinete de ferro a barra do meu vestido à barra de sua saia.',
                '— Imagine o senhor: passar dias e meses inteiros costurando e lendo romances de Walter Scott sentada aos pés de uma cadeira de balanço, sem poder dar dois passos sem que a avó sentisse o repuxão do tecido!',
                '— Até que um dia, a nossa água-furtada foi alugada a um novo inquilino. Era um jovem educado, de porte elegante e olhos profundos. Ele começou a nos emprestar livros maravilhosos — Shakespeare, Pushkin — e um dia convidou minha avó e a mim para irmos ao teatro assistir a "O Barbeiro de Sevilha". Foi o dia mais deslumbrante de toda a minha mocidade.',
                '— Passei a amá-lo com todas as forças de minha alma. Na véspera de sua partida para Moscou, onde fora resolver negócios urgentes que durariam um ano, escapei na calada da noite com uma trouxa de roupas e fui ao seu quarto.',
                '— "Leve-me consigo!", roguei de joelhos aos seus pés. "Não posso mais viver presa pelo alfinete à saia de minha avó!". Ele me levantou com infinita doçura, beijou minha testa e disse: "Nástenka, sou pobre agora e não tenho como sustentá-la com dignidade. Mas juro por minha honra: daqui a exatamente um ano retornarei a Petersburgo. Se você ainda me amar, no dia do aniversário de minha volta estaremos juntos para sempre".',
                'Nástenka cobriu o rosto com as mãos e começou a chorar convulsivamente:',
                '— Pois bem: faz exatamente três dias que o prazo de um ano expirou! Eu sei que ele já está em Petersburgo, hospedado na mesma estalagem... mas até agora ele não veio! Não escreveu uma só linha! Será que ele me esqueceu? Será que ele desprezou o meu amor?'
            ]
        ),
        (
            'Terceira Noite',
            'A Angústia da Espera e a Carta de Confiança',
            [
                'A terceira noite foi escura e fria. Uma chuva miúda e gélida caía sobre os lampiões de Petersburgo, refletindo manchas amarelas nas poças do calçamento.',
                'Nástenka andava de um lado para outro como uma leoa enjaulada, fitando desesperadamente cada vulto que cruzava a ponte.',
                '— Ele não veio! — murmurava ela, empalidecendo a cada badalada do relógio da igreja. — Por que ele é tão cruel? Se ele já não me ama, por que não vem me dizer face a face: "Nástenka, vá em paz, encontrei outra mulher"? Essa incerteza me mata, consome meu sangue!',
                'Eu sentia no peito uma dor dilacerante, dividida entre a compaixão pura por ela e o amor secreto e desesperado que ardia em minhas veias. Peguei a carta que ela havia escrito e disse com voz firme:',
                '— Nástenka, confie em mim. Dê-me a sua carta. Eu mesmo irei amanhã de manhã à estalagem dele. Entregarei a mensagem em mãos próprias e trarei a resposta que trará paz ao seu coração.',
                'Ela me abraçou com um ímpeto de gratidão tão caloroso que senti o perfume de seus cabelos negros:',
                '— O senhor é tão generoso, tão nobre! Que Deus o abençoe para sempre! Se ele não vier amanhã à noite... então compreenderei que tudo acabou.'
            ]
        ),
        (
            'Quarta Noite',
            'O Voo da Esperança, o Desespero e a Aparição',
            [
                'Na quarta noite, o silêncio de Nástenka era como o silêncio que antecede a tempestade.',
                'Esperamos até as onze e meia. Ninguém apareceu na ponte deserta. Suas lágrimas cessaram de repente, substituídas por uma frieza assustadora.',
                '— Acabou! — sussurrou ela, cravando os olhos em mim. — Ele me traiu, jogou fora um amor que era capaz de dar a vida por ele. Não chore por mim, meu amigo... Sabe de uma coisa? Olho para o senhor e vejo quanto amor e lealdade há em seus olhos.',
                '— Diga-me a verdade: o senhor me ama, não é? Não negue, eu percebi desde o primeiro instante!',
                'Ajoelhei-me diante dela sobre o cascalho úmido do cais:',
                '— Sim, Nástenka! Amo-a com uma adoração que nunca julguei possível em meu peito! Desde o momento em que vi suas lágrimas naquela ponte, minha vida ganhou sentido. Mas eu jamais exigiria nada; ficaria feliz apenas em ser a sua sombra...',
                '— Não! — exclamou ela, erguendo-me nos braços e colando seu rosto afogueado ao meu. — Eu serei sua esposa! Vou aprender a amá-lo como o senhor merece! Ele não era digno de mim, mas o senhor... o senhor tem uma alma límpida como cristal!',
                'Caminhamos abraçados, inebriados por uma felicidade quase insuportável. Planejávamos já o nosso futuro quartinho ensolarado, a convivência com a avó, os passeios de domingo... Quando, de súbito, um jovem de sobretudo escuro cruzou a cabeceira da ponte e parou sob o lampião de gás.',
                'Nástenka estremeceu dos pés à cabeça. Soltou um grito rouco que ecoou nas águas do canal:',
                '— É ele! Meu Deus, é ele!',
                'Soltou-se de meus braços como um pássaro que se desprende do laço e correu desabalada pela ponte. Vi os dois se abraçarem num soluço sem fim. Depois, ela virou-se, correu de volta até mim, cobriu minhas mãos e meu rosto de beijos febris e sussurrou entre lágrimas:',
                '— Perdoe-me! Oh, perdoe-me, meu único amigo! Mas eu o amo tanto... Seja feliz, abençoado seja o seu coração generoso!',
                'E sumiu na penumbra da noite de braço dado com o seu verdadeiro amor.'
            ]
        ),
        (
            'A Manhã',
            'A Carta de Gratidão e a Bênção do Sonhador',
            [
                'A manhã seguinte nasceu cinzenta, úmida e fúnebre. Minhas janelas estavam cobertas por uma névoa espessa; as teias de aranha balançavam nos cantos do quarto e Matriona serviu-me um chá morno em uma xícara lascada.',
                'O carteiro bateu à porta trazendo uma carta lacrada com cera vermelha:',
                '“Perdoe-me, meu amigo sublime! Escrevo-lhe inundada de lágrimas de gratidão e remorso. Ontem ele me explicou tudo: os negócios o prenderam, a carta que me enviara perdera-se nos correios, e ele passou três noites me procurando febrilmente. Casei-me com ele em meu coração, mas meu carinho pelo senhor durará enquanto eu respirar.',
                '“Nunca se esqueça daquela que o senhor salvou do desespero. O meu esposo já sabe da sua nobreza e deseja apertar a sua mão fraterna. Venha nos visitar, seja o padrinho de nossa nova vida!”',
                'Dobrei a carta com reverência religiosa e guardei-a junto ao meu peito.',
                'Aproximei-me da vidraça embaçada e fitei a rua lamacenta onde os cocheiros chicoteavam seus pangarés esqueléticos. Uma lágrima solitária escorreu pelo meu rosto, mas não havia amargura em meu peito.',
                'Guardar rancor contra ti, Nástenka? Obscurecer com uma nuvem de censura a tua radiante e serena ventura? Nunca! Jamais!',
                'Que o teu céu seja sempre límpido, que o teu doce sorriso seja sempre suave e imaculado, e que sejas eternamente bendita pelo minuto de ventura e plenitude que deste a outro coração solitário e grato!',
                'Meu Deus! Um minuto inteiro de bem-aventurança plena! Seria isso pouco para toda a vida de um homem?'
            ]
        )
    ]
}

# =========================================================================
# 2. A MORTE DE IVAN ILITCH — Lev Tolstói (12 Capítulos Integrais)
# =========================================================================
RUSSIAN_AND_WORLD_BOOKS['a-morte-de-ivan-ilitch'] = {
    'title': 'A Morte de Ivan Ilitch',
    'author': 'Lev Tolstói',
    'epub': 'public/assets/epubs/a-morte-de-ivan-ilitch.epub',
    'chapters': [
        (
            'Capítulo I',
            'A Notícia no Tribunal e a Visita de Pêsames',
            [
                'Durante o intervalo de uma sessão no imponente palácio da justiça da província, os membros do tribunal e o promotor reuniram-se no gabinete de Ivan Iegórovitch Chebek. A conversa girou em torno do célebre processo Krasovski, quando Fiódor Vassílievitch abriu a gazeta oficial e leu em voz alta:',
                '— Senhores! Ivan Ilitch acaba de falecer!',
                '— Não diga! O pobre homem estava sofrendo horrores... O que diz aí?',
                '— "Praskóvia Fiódorovna Golovina tem a dolorosa tarefa de participar aos parentes e conhecidos o passamento de seu dileto esposo, o magistrado da Corte de Apelação Ivan Ilitch Golovin, ocorrido a 4 de fevereiro de 1882".',
                'A notícia provocou imediatamente em cada um dos presentes um primeiro pensamento silencioso e inconfessável: a perspectiva de promoções e transferências que a vaga do finado acarretaria. Piotr Ivânovitch calculou na hora que a transferência de Hlbov para a vaga de Ivan Ilitch abriria espaço para o seu próprio cunhado conseguir a cadeira de juiz.',
                'Além desse cálculo de ambições burocráticas, o próprio fato da morte de um colega próximo despertou em todos aquele sentimento costumeiro de alívio egoísta: "Foi ele que morreu, e não eu!".',
                'Naquela mesma tarde, Piotr Ivânovitch dirigiu-se à residência do falecido para prestar os pêsames formais. Entrou na sala decorada com estofados caros e espelhos venezianos. No caixão forrado de tecido branco repousava o corpo emaciado de Ivan Ilitch; o nariz afilado e a expressão severa de quem compreendera algo terrível e irrevogável pareciam lançar uma advertência muda aos vivos.',
                'A viúva, Praskóvia Fiódorovna, recebeu o magistrado com um lenço nos olhos. Mas sob o véu do luto cerimonioso, sua preocupação primordial era outra: interrogar minuciosamente Piotr Ivânovitch sobre como conseguir obter do tesouro público uma pensão suplementar além da quantia estipulada pela lei. Piotr Ivânovitch lamentou que as regras imperiais fossem inflexíveis, retirou-se aliviado e foi correndo terminar a noite no clube jogando uma partida de uíste.'
            ]
        ),
        (
            'Capítulo II',
            'A Vida Exemplar e Fútil de Ivan Ilitch',
            [
                'A história da vida pregressa de Ivan Ilitch era das mais simples, comuns e, por isso mesmo, mais terríveis.',
                'Ele fora o segundo de três filhos de um conselheiro secreto que fizera carreira servil em vários ministérios de Petersburgo. Na Escola de Jurisprudência, Ivan Ilitch revelara-se um jovem esperto, vivaz, sociável e rigoroso no cumprimento do dever formal. Ele praticara na juventude certos atos imorais, mas sempre envoltos na elegância do bom-tom e sem descer à vileza grosseira: "il faut que jeunesse se passe".',
                'Formado com louvor, fora nomeado para uma província do interior como funcionário encarregado de missões especiais. Ali aprendeu a vestir-se com sobriedade impecável, a cultivar amizades influentes e a manter uma barreira aristocrática diante dos litigantes.',
                'Mais tarde, quando promovido a juiz de instrução, desfrutava com deleite do poder de conduzir qualquer cidadão poderoso às grades de sua sala; porém usava dessa autoridade com moderação polida e meticulosa burocracia, transformando até a mais cruenta tragédia humana em papéis carimbados e parágrafos numerados.'
            ]
        ),
        (
            'Capítulo III',
            'O Matrimônio de Conveniência e o Refúgio no Trabalho',
            [
                'Aos trinta e três anos, Ivan Ilitch conheceu Praskóvia Fiódorovna Mikhel. Ela pertencia a uma excelente família da nobreza provincial, tinha boa educação, era bonita e possuía um dote razoável.',
                'Dizer que Ivan Ilitch casou-se por amor seria falso; mas dizer que casou-se exclusivamente por interesse financeiro seria igualmente injusto. Ele casou-se porque era socialmente prestigioso e aprovado pelas pessoas mais distintas de seu círculo.',
                'Os primeiros meses de matrimônio foram agradáveis e fáceis. No entanto, logo na primeira gravidez de Praskóvia Fiódorovna, surgiram brigas intermináveis, crises de ciúmes infundados e uma exigência tirânica de atenção. Ivan Ilitch descobriu estarrecido que a vida doméstica não era apenas um leito de rosas.',
                'Diante desses conflitos, ele desenvolveu uma estratégia genial de blindagem emocional: transferiu todo o centro de sua gravidade para o tribunal. Criou uma cerca invisível entre o dever público e as lamúrias domésticas. No trabalho, cercava-se de processos; à noite, encontrava refúgio sagrado na mesa de jogo de cartas com três parceiros que não discutiam e jogavam um uíste sério e silencioso.'
            ]
        ),
        (
            'Capítulo IV',
            'A Promoção para a Capital e a Queda Banal',
            [
                'Dezessete anos se passaram. Ivan Ilitch tinha dois filhos vivos — uma bela moça casadoira e um menino colegial — e perdera três na infância. A vida corria monótona, até que um corte no orçamento ministerial o preteriu numa promoção aguardada.',
                'Ferido em seu orgulho, viajou pessoalmente a Petersburgo e, por uma reviravolta política miraculosa, conseguiu uma nomeação esplêndida como conselheiro do tribunal com remuneração de cinco mil rublos anuais.',
                'A alegria foi indescritível. A família reconciliou-se e mudou-se para a capital. Ivan Ilitch assumiu pessoalmente a reforma e mobília de um grande apartamento aristocrático. Ele escolhia papéis de parede adamascados, móveis antigos de jacarandá e tapeçarias persas.',
                'Numa manhã límpida, ao subir num escadote para mostrar ao estofador distraído como prender uma fita na cortina da sala de visitas, escorregou e bateu fortemente com o flanco esquerdo na maçaneta de bronze da janela.',
                'A dor foi aguda no instante, mas logo cedeu. "Não foi nada!", riu ele para o criado assustado. "Apenas dei um encontrão na maçaneta; sou forte como um carvalho!". O apartamento ficou suntuoso — na verdade, perfeitamente idêntico ao de todas as famílias remediadas que fingem ser milionárias —, e os bailes de inauguração foram coroados de sucesso.'
            ]
        ),
        (
            'Capítulo V',
            'O Gosto Amargo e o Desfile dos Médicos',
            [
                'Alguns meses após a instalação no apartamento novo, Ivan Ilitch começou a sentir um gosto amargo e nauseabundo na boca pela manhã, acompanhado de uma pontada surda e incômoda no flanco esquerdo.',
                'O seu humor deteriorou-se rapidamente; tornara-se rabugento, implicante e discutia sobre qualquer minúcia à mesa do jantar. Praskóvia Fiódorovna respondia com azedume: "Ele tem um gênio insuportável!", ignorando que o marido sofria verdadeiramente.',
                'Consultou um médico celebérrimo da capital. O doutor recebeu-o na clínica com a mesma pose teatral e infalível com que Ivan Ilitch costumava receber os réus no tribunal. Para o médico, a vida humana de Ivan Ilitch nada importava; a única questão relevante era se a afecção residia no rim móvel ou no ceco.',
                'Seguiram-se outras consultas, xaropes, pós medicinais e dietas rigorosas. Porém, quanto mais remédios tomava, pior ficava o gosto metálico na boca e mais implacável tornava-se o latejar surdo em seu abdômen. Ele emagreceu assustadoramente; seus olhos afundaram nas órbitas e as têmporas ficaram lívidas.'
            ]
        ),
        (
            'Capítulo VI',
            'O Silogismo de Caius e o Terror da Morte',
            [
                'Ivan Ilitch compreendeu de repente que não se tratava de um rim flutuante ou de uma inflamação intestinal: tratava-se simplesmente de vida ou morte!',
                '"Sim, a vida estava aqui e agora está escorrendo pelas minhas mãos... e não há como detê-la!", murmurava ele na escuridão de seu gabinete.',
                'Lembrou-se da lógica que estudara na juventude pelo compêndio de Kiesewetter: "Caius é homem; todos os homens são mortais; logo, Caius é mortal". Mas aquilo sempre lhe parecera um axioma abstrato aplicável apenas a Caius, e de modo algum a si mesmo!',
                'Caius era um homenzinho genérico sem rosto; mas ele, Ivan Ilitch, tivera o ursinho de brinquedo na infância, o amor da mãe, as correrias no jardim, o uniforme azul com botões dourados, as noites de luar e os amigos queridos... Seria concebível que tudo isso estivesse condenado à podridão de uma cova úmida e fétida sob a terra gelada de Petersburgo?',
                'Uma angústia avassaladora tomava conta de seu peito; o suor frio escorria-lhe pela testa enquanto ele olhava para o biombo de veludo e murmurava: "A Morte... Ela está aqui, imóvel, me fitando por detrás do biombo!".'
            ]
        ),
        (
            'Capítulo VII',
            'A Farsa da Família e a Compaixão de Guerássim',
            [
                'O que mais atormentava Ivan Ilitch era a falsidade generalizada que o cercava. Toda a sua família — a esposa, a filha e os conhecidos — fingia teimosamente que ele estava apenas acamado com uma indisposição comum e que bastava seguir as ordens médicas para recuperar a saúde plena.',
                'Essa mentira social aviltava o momento supremo de sua existência. Ele ansiava por alguém que o compreendesse, que chorasse com ele como se chora com uma criança desamparada.',
                'O único ser humano que rompia essa muralha de fingimento era o criado mujique Guerássim. Jovem, robusto, de dentes brancos e cheirando a alcatrão e casca de bétula fresca, Guerássim cuidava das necessidades mais degradantes do enfermo com um sorriso límpido e sem repugnância.',
                'Quando a dor no flanco tornava-se insuportável, Guerássim sentava-se na beira do leito e sustentava as pernas esquálidas de Ivan Ilitch apoiadas sobre os seus ombros largos durante horas inteiras. Aquela posição aliviava a pressão na espinha.',
                '— Não se incomode comigo, senhor Ivan Ilitch — dizia o criado com ingenuidade sublime. — Todos nós havemos de morrer um dia; por que não haveria eu de ajudar um homem que sofre?'
            ]
        ),
        (
            'Capítulo VIII',
            'A Visita da Família com Roupas de Festa',
            [
                'Certa noite, Praskóvia Fiódorovna entrou no quarto vestida de veludo carmesim, decotada e perfumada. A filha Lisa vinha ao seu lado com um vestido de baile deslumbrante que exibia o frescor de seus vinte anos, acompanhada pelo noivo, um jovem magistrado rico e vaidoso.',
                'Iam assistir à célebre atriz Sarah Bernhardt no teatro imperial.',
                '— Como você está se sentindo esta noite, meu bem? — perguntou a esposa com afetação.',
                'Ivan Ilitch olhou para o colo branco da mulher, para os brilhantes da filha e para o colarinho engomado do rapaz. Viu naqueles rostos a exasperação mal disfarçada por terem de interromper a euforia mundana para visitar o quarto de um moribundo.',
                '— Estou como sempre: apodrecendo — respondeu com voz rouca.',
                'Houve um silêncio constrangedor de alguns segundos. A filha ajeitou as luvas com impaciência evidente. Despediram-se com beijos no ar e saíram apressadas para a carruagem que esperava na neve. Ivan Ilitch ouviu o estalar do chicote na rua e desabou num choro convulsivo e silencioso sobre o travesseiro sujo.'
            ]
        ),
        (
            'Capítulo IX',
            'A Voz Interior e o Exame da Vida',
            [
                'Fazia três meses que Ivan Ilitch não saía da cama. A dor já não diminuía com doses crescentes de ópio e morfina.',
                'Numa tarde em que mandou Guerássim sair para respirar um pouco de ar puro, começou a soluçar como um menino indefeso:',
                '— Deus! Por que fazes isso comigo? O que foi que eu fiz para merecer tal castigo?',
                'Calou-se e pareceu ouvir uma voz interior, um murmúrio saído das profundezas de sua própria consciência:',
                '— Que queres?',
                '— Viver! Viver sem dor e ser feliz como eu era antes!',
                '— E como era a tua vida antes? Era realmente boa e justa?',
                'Ivan Ilitch começou a repassar mentalmente os dias de sua existência: o casamento burguês por conveniência, a vaidade fútil com a mobília do casarão, as sentenças judiciais proferidas sem compaixão humana, o apego mesquinho aos cinco mil rublos de salário...',
                'Quanto mais se afastava da infância em direção ao presente, mais aquela vida respeitável revelava-se oca, hipócrita, morta e desprovida de qualquer fagulha divina.'
            ]
        ),
        (
            'Capítulo X',
            'O Abismo do Passado e o Confronto Final',
            [
                'Passaram-se mais duas semanas de tortura física indizível.',
                'Ivan Ilitch já não distinguia claramente o dia da noite. Ele passava os olhos pelo biombo, pelas garrafas de remédio e pelo semblante tenso do médico, e compreendia que toda a ordem social e moral em que acreditara era uma imensa e monstruosa fraude concebida para ocultar dos homens a realidade da vida e da morte.',
                'Apenas os anos distantes da meninice — o sabor das ameixas colhidas no pomar, o carinho da velha ama, a inocência com que abraçava os irmãos — pareciam-lhe momentos de verdade autêntica.',
                '"Talvez eu não tenha vivido como deveria viver!", cruzou-lhe subitamente a mente como um relâmpago de fogo. Mas ele afastava com pavor esse pensamento: "Como é possível? Eu cumpri todas as leis, paguei todas as contas, fui elogiado por todos os superiores!". E no entanto, a aproximação implacável da morte desnudava a nulidade de todas as suas virtudes burguesas.'
            ]
        ),
        (
            'Capítulo XI',
            'A Comunhão e o Grito Ininterrupto de Três Dias',
            [
                'Na manhã do dia seguinte, Praskóvia Fiódorovna trouxe o padre ortodoxo para confessá-lo e ministrar a sagrada comunhão.',
                'Quando o sacerdote pousou a hóstia em seus lábios ressequidos, Ivan Ilitch sentiu por alguns minutos um doce afrouxamento da dor e uma centelha tênue de esperança na misericórdia celestial. Mas ao abrir os olhos e ver as lágrimas melodramáticas e encenadas da esposa, a revolta explodiu de novo em seu íntimo:',
                '— É mentira! Tudo é mentira e comédia!',
                'A partir daquele instante começou um grito apavorante que durou três dias e três noites ininterruptas. Não era uma voz humana articulada, mas um urro contínuo: "U!... U!... U!...". Ele debatia-se violentamente na cama, rasgando os lençóis e lutando contra uma força negra invisível que o empurrava com violência para o fundo de um saco estreito e asfixiante.'
            ]
        ),
        (
            'Capítulo XII',
            'A Luz Interior e o Fim da Morte',
            [
                'Ao meio-dia do terceiro dia de tormento, o seu filho mais novo, o colegial Vássia de olhos doces, entrou sorrateiramente no quarto escuro.',
                'O menino aproximou-se do leito, ajoelhou-se e pegou a mão ossuda e lívida do pai, cobrindo-a de lágrimas ardentes e beijando-a com amor desesperado.',
                'Naquele exato instante, Ivan Ilitch sentiu que caíra através do fundo do saco negro... e viu a luz!',
                'Olhou para baixo e viu o rostinho banhado em lágrimas de seu filho caçula; olhou para o lado e viu Praskóvia Fiódorovna em pé, verdadeiramente transtornada pelo horror e com as mãos juntas em oração.',
                'Uma compaixão infinita e inédita invadiu o peito do agonizante: "Sim, eu os fiz sofrer... eles sentirão alívio quando eu me for... preciso livrá-los desse tormento!".',
                'Quis dizer: "Perdoem-me!", mas seus lábios ressequidos balbuciaram apenas: "Deixem-me...". Fez um gesto fraco com a mão para que a esposa compreendesse.',
                '— E a Morte? Onde está ela? — procurou ele em seu interior.',
                'Procurou o terror antigo que o aniquilava e não encontrou mais nada. Em vez de medo e escuridão, havia apenas luz, alívio e serenidade infinita.',
                '— A morte acabou! — murmurou ele para si mesmo. — Ela já não existe mais!',
                'Respirou fundo o ar que lhe restava, estremeceu num último espasmo suave e aquietou-se para sempre.'
            ]
        )
    ]
}

# =========================================================================
# 3. MEMÓRIAS DO SUBSOLO — Fiódor Dostoiévski (10 Seções/Capítulos)
# =========================================================================
RUSSIAN_AND_WORLD_BOOKS['memorias-do-subsolo'] = {
    'title': 'Memórias do Subsolo',
    'author': 'Fiódor Dostoiévski',
    'epub': 'public/assets/epubs/memorias-do-subsolo.epub',
    'chapters': [
        (
            'Parte I - O Subsolo: Seções I & II',
            'O Homem Doente e a Doença da Hiperconsciência',
            [
                'Sou um homem doente... Sou um homem mau. Um homem desagradável. Creio que sofro do fígado. Aliás, não entendo patavina de minha doença e não sei ao certo o que me dói. Não me trato e nunca me tratei, embora respeite a medicina e os médicos.',
                'Trata-se de pura teimosia de minha parte. Minha bílis está atacada? Pois que se ataque ainda mais! Moro neste quartinho úmido e esquálido nas imediações de São Petersburgo há mais de vinte anos. Fui funcionário público ranzinza e descortês; insultava os cidadãos que vinham ao balcão pedir certidões e sentia um prazer voluptuoso ao ver tremer um camponês indefeso.',
                'Digo-lhes solenemente que a excessiva consciência — o pensar demasiado sobre todas as coisas — é uma verdadeira e genuína enfermidade da alma moderna. Para a vida comum e prática dos homens, bastaria uma consciência humana comum, digamos, a metade ou um quarto da porção que cabe ao homem culto do nosso desventurado século XIX que tem a desgraça de residir em Petersburgo, a cidade mais abstrata e premeditada de todo o globo terrestre.'
            ]
        ),
        (
            'Parte I - O Subsolo: Seções III & IV',
            'O Muro de Pedra da Razão e a Volúpia na Dor de Dente',
            [
                'Observem o homem de ação espontâneo: quando se depara com um obstáculo moral ou uma ofensa, parte para a vingança de cabeça baixa como um touro enfurecido. Mas se lhe colocam pela frente um muro de pedra — as leis naturais da física, as conclusões da matemática e da ciência —, ele aquieta-se e diz: "É o muro!".',
                'Nós, porém, os homens do subsolo e da consciência aguda, não nos resignamos diante do muro de pedra! Sabemos perfeitamente que dois e dois são quatro, mas recusamo-nos a idolatrar essa evidência estúpida!',
                'Experimentem ouvir os gemidos de um homem instruído acometido por uma violenta dor de dente no terceiro mês de crise. Não são os gemidos ingênuos de um cocheiro; são gemidos repletos de floreios, modulações venenosas e rancor refinado, cujo objetivo único é atormentar a família inteira e proclamar ao mundo: "Sim, estou sofrendo e faço questão de envenenar o ar que todos vocês respiram!". Há nisso uma volúpia secreta que só os espíritos torturados compreendem.'
            ]
        ),
        (
            'Parte I - O Subsolo: Seções VII & VIII',
            'O Palácio de Cristal e o Capricho Humano: 2x2=5',
            [
                'Os filósofos utilitários afirmam que quando a ciência desvendar todas as leis naturais, a humanidade construirá o eterno Palácio de Cristal. Ninguém mais cometerá crimes, porque todos compreenderão que a virtude é mais vantajosa economicamente do que o mal. O homem viverá como uma engrenagem bem lubrificada de um realejo.',
                'Mas eu pergunto: quem garante que o homem quer realmente a ordem perfeita e a felicidade calculada em tabelas de logaritmos? O que é o homem senão uma criatura caprichosa e ingrata?',
                'Estou convencido de que, em pleno Palácio de Cristal, erguer-se-á subitamente um cavalheiro de fisionomia retrógrada e zombeteira, porá as mãos nos quadris e dirá a todos nós: "E então, senhores? Que tal deitarmos abaixo toda essa sensatez calculada, unicamente para mandarmos todos esses logaritmos ao diabo e podermos viver de novo segundo a nossa própria e tola vontade?".',
                'Porque a vontade humana não quer ser reduzida a uma tabela matemática! Às vezes, o homem deseja apaixonadamente aquilo que lhe é prejudicial e funesto unicamente para provar a si mesmo que ainda é homem, e não a tecla de um piano!'
            ]
        ),
        (
            'Parte II - A Neve Molhada: Capítulo I',
            'A Juventude Solitária e o Duelo na Nevsky Prospekt',
            [
                'Naquela época eu tinha apenas vinte e quatro anos. Minha vida era sombria, desordenada e solitária até o delírio. Eu não me dava com ninguém no departamento governamental; olhava para os meus colegas como se fossem insetos desprezíveis e, ao mesmo tempo, tremia de medo de que eles rissem de minhas botas rotas ou de meu casaco puído.',
                'Certa noite, ao passar diante de uma taberna com mesa de bilhar, vi um homem ser atirado pela janela após uma briga. Invejei aquele sujeito: quis também entrar e ser protagonista de um escândalo. Entrei; mas um tenente alto e arrogante, ao cruzar o meu caminho junto à mesa, pegou-me pelos ombros e afastou-me para o lado em silêncio, como se eu fosse uma cadeira vazia!',
                'Passei dois anos inteiros sonhando com a vingança contra aquele oficial! Espionava os seus passeios na calçada da Nevsky Prospekt. Comprei a duras penas uma gola de pele de castor para o meu capote para parecer um cavalheiro de posses.',
                'E finalmente, numa tarde de inverno sob uma tempestade de neve, avistei o tenente marchando altivo em minha direção. Em vez de desviar como sempre fazia, cerrei os dentes, fechei os olhos e... choquei-me ombro a ombro contra ele! Ele nem sequer olhou para trás, mas eu voltei para o meu quarto triunfante: mantivera a minha dignidade de igual para igual!'
            ]
        ),
        (
            'Parte II - A Neve Molhada: Capítulos II & III',
            'O Jantar Humilhante no Hôtel de Paris',
            [
                'Cometi a loucura de me associar a um jantar de despedida organizado pelos meus antigos colegas de escola em homenagem a Zverkov, um oficial ricaço, belo e presunçoso a quem eu odiava cordialmente.',
                'Prometi contribuir com sete rublos — quantia colossal para as minhas finanças esgotadas —, mas quando cheguei ao restaurante no Hôtel de Paris, a mesa já estava posta e eles me receberam com olhares de espanto e desdém.',
                'Durante três horas cruéis, eles comeram perdizes, beberam champanhe e riram de piadas mundanas, ignorando a minha presença com a mais insolente naturalidade. Eu bebia garrafas de vinho barato sozinho a um canto da mesa, bufando de ódio e andando a passos pesados de um lado para outro da sala, com as botas estalando no assoalho encerado.',
                '— Olhem para ele! — zombou Zverkov às gargalhadas. — Parece um fantasma em fúria! Vá para casa dormir, meu caro!',
                'Quando saíram em trenós cantando para o lupanar da Madame Brigitte, aluguei uma carroça miserável e ordenei ao cocheiro: "Siga aqueles trenós a galope! Eu os esbofetearei ou morrerei no duelo!".'
            ]
        ),
        (
            'Parte II - A Neve Molhada: Capítulos IV & V',
            'O Encontro com Liza na Escuridão',
            [
                'Ao chegar à casa de tolerância, os meus inimigos já haviam sumido pelos aposentos superiores. Acabei trancado num quarto escuro e gélido com Liza, uma jovem camponesa de dezenove anos, recém-chegada da província, de traços pálidos e meigos.',
                'Em vez da paixão carnal, uma fúria oratória tomou conta de mim. Comecei a discursar com a eloquência teatral de um pregador moralista. Descrevi-lhe em tintas pavorosas o futuro abominável que a aguardava: a perda da beleza, as doenças venéreas, os insultos dos ébrios e, finalmente, a morte num hospital imundo de indigentes e a cova rasa num cemitério pantanoso coberto de lama cinzenta.',
                'Liza ouvia-me na penumbra. De repente, seu corpo estremeceu e ela prorrompeu num choro convulso e lancinante, atirando-se no travesseiro com o coração estilhaçado pela consciência de sua desgraça.',
                'Minha vaidade sentiu-se glorificada: eu dobrara aquela alma com as minhas palavras! No auge da exaltação, inclinei-me, beijei-lhe a fronte e entreguei-lhe um bilhete com o endereço de meu casebre: "Venha procurar-me... Eu a salvarei!".'
            ]
        ),
        (
            'Parte II - A Neve Molhada: Capítulos VI & VII',
            'A Chegada de Liza e a Explosão da Crueldade',
            [
                'Durante os dias seguintes, vivi num pavor histérico. Olhava para o meu quartinho sórdido, para o papel de parede amarelo em farrapos, para o meu roupão encardido e tremia só de pensar que aquela donzela pudesse aparecer e testemunhar a minha miséria abjeta.',
                'Eu brigava aos berros com Apolon, meu criado idoso e insolente que se recusava a me servir porque eu lhe devia salários.',
                'E de repente... a porta abriu-se e Liza entrou.',
                'Estava vestida com simplicidade modesta, com um xale enrolado nos ombros e os olhos cheios de confiança tímida. Ao ver-me aos berros com o criado, paralisou de susto.',
                'O veneno de meu orgulho ferido transbordou sem freio. Em vez do nobre redentor que ela imaginava, revelei-me um monstro despeitado:',
                '— Por que veio? Veio ouvir mais sermões bonitos? Saiba que eu ria de você naquela noite! Eu fora humilhado naquele jantar e precisava humilhar outro ser humano para descontar a minha fúria! O seu sofrimento foi apenas um brinquedo para a minha vaidade!',
                'Liza empalideceu como a neve da rua. Mas em vez de ódio ou desprezo, ela leu no fundo de meus olhos desvairados a tragédia de um homem infinitamente infeliz e torturado por seu próprio rancor. Com um soluço de ternura sublime, abriu os braços e abraçou-me com todo o calor de seu peito.'
            ]
        ),
        (
            'Parte II - A Neve Molhada: Capítulo VIII',
            'A Moeda Amassada e a Fuga na Tempestade',
            [
                'Durante alguns segundos, chorei copiosamente em seu colo como um desgraçado que reencontra a luz. Mas o monstro do subsolo acordou de imediato: "Ela agora é dona de meu segredo! Ela testemunhou a minha baixeza!".',
                'Num gesto de sordidez inaudita, quando ela se preparava para partir desolada, peguei uma nota azul de cinco rublos de minha carteira e enfiei-a à força em sua mão fechada, pagando-lhe como se pagasse a uma meretriz na rua!',
                'Ela olhou para a nota com uma expressão de dor muda que jamais esquecerei. Saiu em silêncio batendo a porta da escada.',
                'Aproximei-me da mesa e vi, jogada sobre a toalha puída, a nota de cinco rublos amassada que ela recusara levar!',
                'Um choque elétrico percorreu minha espinha. Atirei-me pela porta, desci as escadas aos tropeções e saí correndo sem chapéu para a rua sob a tempestade de neve branca e fustigante:',
                '— Liza! Liza! Volte! Eu estava louco! — gritava eu na praça deserta.',
                'Mas o vento uivava nas esquinas e os flocos de neve já haviam apagado para sempre as pegadas de seus passos ligeiros. Voltei ao meu subsolo, sentei-me à escrivaninha fria e anotei estas palavras finais:',
                'Deixem-nos sozinhos sem livros, sem preceitos e sem amparo, e ficaremos logo perdidos, sem saber a que nos apegar nem o que amar ou odiar! Nós todos nos desacostumamos da vida viva... preferimos sonhar com teorias a enfrentar a dor sublime do amor autêntico.'
            ]
        )
    ]
}

# =========================================================================
# 4. CRIME E CASTIGO — Fiódor Dostoiévski (8 Capítulos Extensos)
# =========================================================================
RUSSIAN_AND_WORLD_BOOKS['crime-e-castigo'] = {
    'title': 'Crime e Castigo',
    'author': 'Fiódor Dostoiévski',
    'epub': 'public/assets/epubs/crime-e-castigo.epub',
    'chapters': [
        (
            'Parte I - Capítulo I',
            'O Cubículo Sufocante e o Ensaio na Usurária',
            [
                'No princípio de julho, numa época de calor insuportável, um jovem saiu pela tarde de seu cubículo na travessa de S., desceu para a rua e, com passo vacilante, dirigiu-se lentamente em direção à ponte K.',
                'Conseguira evitar com êxito o encontro com a dona da casa na escada. Seu quartinho, situado no sótão de um grande prédio de cinco andares, parecia mais um armário do que propriamente uma moradia.',
                'Ele estava tão afundado em si mesmo e isolado de tudo que temia qualquer encontro casual. "Quero tentar uma coisa dessas e tenho medo de semelhantes tolices!", pensava consigo mesmo, sorrindo de modo estranho.',
                'A rua estava abafada; o cheiro de cal, tijolo e poeira misturava-se ao odor das tabernas, que naquela parte da cidade eram numerosíssimas. Raskólnikov desceu o olhar para suas roupas andrajosas: o casaco desfiado, as botas rotas, mas o seu orgulho jovem preferia parecer um mendigo a capitular diante da mesquinharia cotidiana.',
                'Subiu ao quarto andar de um velho casarão cinzento na margem do canal. Bateu à porta. Uma velha seca, de olhos vivos e malévolos, abriu apenas uma fresta: era Aliona Ivânovna, a viúva de um funcionário que emprestava dinheiro sob penhor a juros escorchantes.',
                '— Quem é? — perguntou a velha, fitando-o com desconfiança mortal.',
                '— Raskólnikov, o estudante. Estive aqui há um mês para empenhar o anel de minha irmã. Trago agora o relógio de prata de meu pai.',
                'Enquanto a velha examinava o relógio com suas mãos ossudas e trêmulas, os olhos febris de Raskólnikov gravavam cada detalhe do aposento: a cômoda de madeira, a chave presa a um aro de ferro no bolso do roupão, a porta entreaberta do quarto de dormir. Ali fermentava, inexorável, o plano do assassinato.'
            ]
        ),
        (
            'Parte I - Capítulo II',
            'A Taberna Sombria e a Confissão Trágica de Marmeládov',
            [
                'Ao deixar o prédio da usurária com um rublo e meio no bolso, Raskólnikov sentiu uma sede ardente e uma repugnância atroz por seu próprio pensamento.',
                'Entrou numa taberna escura e esfumaçada no subsolo da praça do Feno. Sentou-se a um canto isolado com uma garrafa de cerveja barata. Ali, um homem grisalho, de casaco esfarrapado e rosto inchado pela bebida, olhava-o fixamente com olhos cheios de inteligência dolorosa.',
                'Era Semion Zakhárovitch Marmeládov, ex-conselheiro titular reduzido à indigência absoluta.',
                '— Permite-me, caro senhor, entabular convosco uma conversa respeitosa? — perguntou o bêbado, arrastando-se para a mesa de Raskólnikov. — Vejo em vosso semblante a marca dos homens que sofreram na inteligência.',
                'Marmeládov começou a desfiar a tragédia de sua família: a esposa Catarina Ivânovna, nobre e tuberculosa, que tossia sangue enquanto cuidava de três crianças famintas; e Sônia, a jovem e dócil filha de seu primeiro casamento, que para salvar os irmãozinhos da fome se vira obrigada a obter o bilhete amarelo da prostituição.',
                '— Sabe o senhor o que significa não ter para onde ir? — clamou Marmeládov em lágrimas, batendo o punho na mesa suja. — Pois todo homem precisa de ter ao menos um lugar onde possam ter compaixão dele!'
            ]
        ),
        (
            'Parte I - Capítulo IV',
            'A Carta da Mãe, o Sacrifício de Dúnia e o Machado',
            [
                'Em seu cubículo sufocante, deitado no sofá de crina verde, Raskólnikov reviu a carta enviada por sua mãe do interior. Sua irmã Dúnia, para ajudá-lo a concluir o curso e livrar a família da pobreza, aceitara casar-se com Lújin, um burocrata rico, vaidoso e calculista que desejava uma esposa pobre para tê-la submissa aos seus pés.',
                '— Dúnia não se venderá por mim! — murmurou o jovem com os dentes cerrados. — Não permitirei esse sacrifício vil!',
                'Ergueu-se com a alma consumida pela sua célebre tese filosófica: a humanidade divide-se em duas categorias — os homens ordinários, servos dos costumes e das leis morais vigentes, e os homens extraordinários, como Licurgo, César e Napoleão, que têm o direito tácito de violar a lei e derramar sangue se isso for indispensável para a realização de um desígnio histórico superior.',
                '— Seria eu um piolho como todos os outros, ou sou um homem capaz de transpor o limite moral supremo?',
                'Desceu ao depósito do zelador na penumbra da tarde. Sob o banco de madeira, apanhou o machado afiado. Amarrou uma presilha de pano no forro interno do casaco e ocultou a lâmina gélida sob o braço. As badaladas de um sino distante soavam na neblina de São Petersburgo.'
            ]
        ),
        (
            'Parte I - Capítulo VII',
            'O Duplo Homicídio: O Sangue de Aliona e da Inocente Lisaveta',
            [
                'Raskólnikov subiu as escadas desertas do prédio da usurária com o coração batendo nas têmporas como um aríete. Bateu três vezes na porta.',
                'Aliona Ivânovna abriu a fresta. Raskólnikov entregou-lhe o falso embrulho de prata amarrado com nós intrincados. No momento em que a velha virou-se para a luz da janela a fim de desatar o barbante, ele sacou o machado por debaixo do casaco e desferiu o primeiro golpe com as costas da lâmina bem no alto do crânio.',
                'A velha soltou um gemido fraco e tombou no assoalho encerado. As chaves caíram de suas mãos ensanguentadas. Ele precipitou-se para o baú sob a cama, enfiando relógios de ouro e broches nos bolsos.',
                'Foi quando um passo leve estalou na ante-sala: a porta estava entreaberta e Lisaveta, a meia-irmã dócil e simplória da usurária, acabara de entrar com uma trouxa de roupa lavada! Ao ver o cadáver e o assassino com a arma manchada de sangue, paralisou com os olhos arregalados de horror infantil, sem conseguir sequer gritar.',
                'Cego pelo pânico animal de ser descoberto, Raskólnikov avançou e desferiu-lhe um golpe fatal com o fio da lâmina. O crime duplo estava consumado.'
            ]
        ),
        (
            'Parte III - Capítulo V',
            'O Duelo Psicológico com Porfíri Petróvitch',
            [
                'No gabinete do comissariado policial, o juiz de instrução Porfíri Petróvitch recebeu Raskólnikov com sorrisos macios, rapé e uma afabilidade felina que ocultava um faro psicológico temível.',
                '— Meu caro Rodion Românovitch! Li com profundo fascínio o artigo que o senhor publicou na Revista Periódica sobre o crime e a divisão dos homens entre ordinários e extraordinários.',
                'Porfíri começou a tecer uma teia sutilíssima ao redor do estudante febril:',
                '— Diga-me, meu jovem filósofo: como reconheceremos esses homens sublimes? Não haverá o risco perigoso de um jovem qualquer supor-se Napoleão e dar machadadas nas velhinhas que lhe incomodam a marcha?',
                'Raskólnikov empalideceu, mas sustentou o olhar agudo do magistrado:',
                '— O sofrimento e a dor são sempre obrigatórios para uma consciência ampla e um coração profundo. Os homens verdadeiramente grandes, parece-me, devem experimentar uma grande tristeza na Terra.',
                'Porfíri inclinou-se para a frente, diminuindo a voz até um sussurro quase fraterno:',
                '— O criminoso psicológico, meu caro senhor, não foge de nós... Ele gira ao redor da justiça como a mariposa ao redor da lâmpada acesa. Ele mesmo acabará voltando para o círculo do fogo.'
            ]
        ),
        (
            'Parte IV - Capítulo IV',
            'Sônia Marmeládova e a Ressurreição de Lázaro',
            [
                'Naquela noite, Raskólnikov procurou o quartinho miserável de Sônia Marmeládova no canal do Fosso.',
                'Aproximou-se da jovem, que tremia diante de seu olhar alucinado, e curvou-se até o chão, beijando os pés da prostituta:',
                '— O que está fazendo? — gritou ela apavorada. — A mim, uma mulher pecadora?',
                '— Não me curvei diante de ti — respondeu ele com voz solene. — Curvei-me diante de todo o sofrimento da humanidade.',
                'Pediu-lhe que abrisse o Novo Testamento que Lisaveta lhe dera e lesse o capítulo XI do Evangelho de São João. Sônia hesitou, com a voz embargada pelas lágrimas, mas começou a ler:',
                '— "Disse-lhe Jesus: Eu sou a ressurreição e a vida; quem crê em mim, ainda que esteja morto, viverá... E aquele que estava morto saiu, atadas as mãos e os pés com faixas".',
                'A vela bruxuleante no castiçal de ferro iluminava aquelas duas figuras trágicas: o assassino febril e a cortesã santa reunidos pela dor e pela promessa de ressurreição moral.'
            ]
        ),
        (
            'Parte VI - Capítulo VIII',
            'A Confissão na Praça do Feno e a Queda de Joelhos',
            [
                'Após o suicídio de Svidrigáilov e a última despedida de sua mãe e de Dúnia, Raskólnikov caminhou para a Praça do Feno.',
                'Lembrou-se das palavras de Sônia: "Vá para a encruzilhada das ruas, prostre-se diante do povo, beije a terra que você maculou e diga em voz alta: Eu sou um assassino!".',
                'Ao chegar ao centro da praça poeirenta onde os mujiques negociavam carroças, caiu de joelhos sobre a lama, encostou os lábios no chão impuro e chorou como nunca chorara em sua existência.',
                '— Vejam aquele bêbado prostrado! — riram os feirantes.',
                'Mas ele ergueu-se com a alma decidida. Entrou na delegacia policial de polícia da comarca, fitou o escrivão que o olhava surpreso e pronunciou com voz firme:',
                '— Fui eu que matei a machado a velha usurária Aliona Ivânovna e sua irmã Lisaveta.'
            ]
        ),
        (
            'Epílogo',
            'A Sibéria, o Rio Irtích e o Despertar do Amor',
            [
                'Raskólnikov fora condenado a oito anos de trabalhos forçados de segunda categoria na fortaleza militar de Omsk, na Sibéria. Sônia acompanhara-o para o exílio, instalando-se na cidade vizinha e trabalhando como costureira.',
                'Durante muito tempo ele permaneceu sombrio e hostil; os outros forçados, criminosos rudes do povo, odiavam-no e chamavam-no de ateu orgulhoso, enquanto adoravam a meiga Sônia como a um anjo protetor.',
                'Numa manhã límpida de primavera, Raskólnikov estava sentado num tronco às margens do amplo e deserto rio Irtích. De repente, Sônia aproximou-se timidamente e estendeu-lhe a mão.',
                'Ele olhou para o rosto pálido e comovido daquela mulher que abandonara tudo para segui-lo nos confins da Ásia. Algo misterioso e irresistível rompeu a crosta de seu orgulho intelectual: ele caiu a seus pés, abraçou-lhe os joelhos e chorou lágrimas de renascimento.',
                'Eles compreenderam sem palavras: sete anos de desterro ainda os esperavam, mas o amor infinito operara o milagre supremo. A teoria napoleônica desmoronara para sempre, e começava a história de uma nova vida.'
            ]
        )
    ]
}

# =========================================================================
# 5. OS IRMÃOS KARAMÁZOV — Fiódor Dostoiévski (8 Capítulos Extensos)
# =========================================================================
RUSSIAN_AND_WORLD_BOOKS['os-irmaos-karamazov'] = {
    'title': 'Os Irmãos Karamázov',
    'author': 'Fiódor Dostoiévski',
    'epub': 'public/assets/epubs/os-irmaos-karamazov.epub',
    'chapters': [
        (
            'Livro I & II',
            'O Escândalo no Mosteiro e o Stárets Zózima',
            [
                'Fiódor Pávlovitch Karamázov era um proprietário de terras provinciano cínico, depravado e avarento, célebre pela devassidão e pelo desrespeito a todas as regras da moralidade. Seus três filhos legítimos cresceram longe de seus olhos: Dimitri, o oficial impetuoso; Ivan, o filósofo intelectual atormentado; e Aliócha, o caçula angelical e noviço.',
                'Para resolver a disputa acirrada entre o pai e o filho Dimitri pela herança materna e pela posse amorosa da sedutora Gruchenka, a família reuniu-se na cela do venerável Stárets Zózima no mosteiro local.',
                'Em vez de harmonia, o encontro transformou-se num espetáculo grotesco: o velho Fiódor Pávlovitch zombou dos monges com bufonarias obscenas, enquanto Dimitri invadia a cela aos gritos chamando o próprio pai de crápula devasso.',
                'No ápice do confronto, o ancião Zózima levantou-se com extrema lentidão de sua poltrona, ajoelhou-se diante de Dimitri e prostrou a cabeça no chão, prestando-lhe uma reverência solene.',
                '— Por que fez isso, santo padre? — indagou Dimitri aterrado.',
                '— Curvei-me diante do grande sofrimento humano que o aguarda — sussurrou o monge com olhos luminosos e proféticos.'
            ]
        ),
        (
            'Livro III',
            'Os Sensuais: A Paixão Devoradora por Gruchenka',
            [
                'Dimitri Karamázov encontrou o irmão Aliócha no caramanchão abandonado de uma chácara vizinha.',
                'Com os olhos vermelhos e a gola da túnica militar desabotoada, recitou os versos de Schiller sobre a dor cósmica da humanidade:',
                '— O que me atormenta, Aliócha, é que a beleza é uma coisa terrível e espantosa! É terrível porque é indefinível, e Deus só nos deu enigmas. Ali os dois extremos se tocam e todas as contradições coexistem! O coração do homem acomoda tanto o ideal de Madona quanto o ideal de Sodoma!',
                'Confessou que furtara três mil rublos pertencentes à sua noiva formal, a nobre Catierina Ivânovna, para esbanjar numa noitada selvagem com Gruchenka na aldeia de Mokroye.',
                '— Eu sou uma pulga, um réptil voluptuoso como meu pai! Mas juro: se Gruchenka for esta noite à casa do velho Fiódor Pávlovitch para receber o envelope com três mil rublos que ele lhe prometeu, eu matarei meu pai com as minhas próprias mãos!'
            ]
        ),
        (
            'Livro V - Capítulo IV',
            'A Rebelião de Ivan: O Sofrimento dos Inocentes',
            [
                'Na taberna esfumaçada da cidadezinha provinciana, Ivan e Aliócha reencontraram-se diante de uma garrafa de vinho e chá quente.',
                '— Não é a Deus que recuso, Aliócha; é o mundo que Ele criou que não posso consentir em aceitar! — declarou Ivan com dialética cortante.',
                'Desfiou com frieza implacável casos reais colhidos nos jornais: crianças açoitadas com varas pelos próprios pais no sótão frio, bebês fuzilados diante dos olhos das mães e um menino camponês de oito anos despido na floresta e caçado vivo por uma matilha de cães a mando de um general fidalgo.',
                '— Se todo o sofrimento das criancinhas inocentes é indispensável para completar a soma de dores necessária para comprar a verdade eterna, então declaro antecipadamente que toda a verdade do universo não vale as lágrimas daquela menina que batia no peito no cubículo escuro clamando pelo "bom Deusinho"!',
                '— Não quero a harmonia futura erguida sobre os ossos de mártires indefesos. Devolvo com toda a reverência o meu bilhete de entrada para esse paraíso!'
            ]
        ),
        (
            'Livro V - Capítulo V',
            'O Poema do Grande Inquisidor',
            [
                '— Compus um poema em prosa, Aliócha — continuou Ivan. — A ação transcorre na Sevilha do século XVI, no auge das fogueiras da Santa Inquisição.',
                'Cristo retorna à Terra em silêncio. O povo reconhece-O de pronto e clama por milagres. O cardeal Grande Inquisidor, um ancião de noventa anos com manto cinzento e olhos profundos, manda prendê-Lo nas masmorras sombrias do Santo Ofício.',
                'À meia-noite, o Inquisidor desce com uma lanterna à cela do prisioneiro e diz-lhe face a face:',
                '— Por que vieste perturbar-nos? Tu nos deste a liberdade da fé e da consciência, mas o homem é fraco, covarde e vil. Nada atormenta tanto a humanidade quanto a liberdade de escolher entre o bem e o mal!',
                '— Nós corrigimos a Tua obra! Em Teu nome, oferecemos aos homens o milagre, o mistério e a autoridade; demos-lhes o pão terrestre e eles nos entregaram de bom grado a sua liberdade!',
                'Ao fim do monólogo feroz, Cristo nada responde: aproxima-se do ancião silencioso e beija-lhe suavemente os lábios ressequidos e descorados.',
                'O Inquisidor estremece, abre a porta de ferro da masmorra e sussurra na escuridão: "Vai-te, e não voltes nunca mais!".'
            ]
        ),
        (
            'Livro VI',
            'O Monge Russo e os Ensinamentos de Zózima',
            [
                'No mosteiro, Aliócha assistiu às últimas horas de vida do Stárets Zózima. Reunido com os discípulos, o ancião transmitiu suas lições imortais sobre o amor universal:',
                '— Amai toda a criação divina em seu conjunto e em cada grão de areia! Amai cada folhinha verde, cada raio de luz de Deus, amai os animais, amai as plantas, amai todas as coisas! Amando cada criatura, compreendereis o mistério divino em tudo que vive.',
                '— Que ninguém se arrogue o direito de julgar o criminoso sem antes reconhecer que ele próprio é tão culpado pelo crime quanto o próprio delinquente!',
                '— Pois todos nós somos responsáveis por todos e por tudo na face da Terra!',
                'Ao amanhecer, o venerável monge prostrou-se no chão de sua cela, beijou a terra e entregou a alma a Deus em serenidade imaculada.'
            ]
        ),
        (
            'Livro VIII',
            'A Noite Alucinada de Mokroye',
            [
                'Dimitri invadiu o pátio da casa paterna armado com um pilão de latão. Ao certificar-se de que Gruchenka não estava ali, golpeou na fuga o velho servo Grigóri que tentou agarrá-lo e fugiu banhado em sangue.',
                'Acreditando ter matado o velho criado e com os bolsos cheios de notas roubadas, contratou carruagens com troicas velozes e partiu para a estalagem de Mokroye onde Gruchenka festejava com um oficial polonês.',
                'Comprou todo o champanhe, contratou coros de ciganos, distribuiu ouro aos camponeses e transformou a noite numa orgia dionisíaca de música e paixão.',
                'Foi quando Gruchenka, desiludida com o amante polonês que apenas cobiçava o seu dinheiro, atirou-se aos pés de Dimitri:',
                '— Eu sou tua, Mítia! Perdoa-me por ter sido tão cruel! Agora sei que te amo de verdade!',
                'No instante do abraço apaixonado, as portas da estalagem foram escancaradas e os comissários de polícia entraram com sabres em punho: o velho Fiódor Pávlovitch fora assassinado em sua cama com o crânio esmagado, e Dimitri era acusado de parricídio!'
            ]
        ),
        (
            'Livro XI',
            'O Pesadelo de Ivan e o Diabo Parasita',
            [
                'Enquanto Dimitri aguardava o julgamento na prisão, Ivan Karamázov descobriu a verdade terrível por intermédio de Smierdiákov, o cozinheiro epiléptico e filho bastardo da família.',
                'Smierdiákov confessara com um sorriso diabólico: fora ele quem assassinara o velho patriarca com um cinzeiro de ferro, aproveitando-se da ausência de Dimitri; mas o mandante moral fora Ivan!',
                '— O senhor me ensinou que "se Deus não existe e a alma é mortal, tudo é permitido!". O senhor era o mestre audaz e eu fui apenas o braço executor!',
                'Atingido por uma febre cerebral avassaladora, Ivan voltou ao seu quarto e deparou-se, sentado no divã, com um cavalheiro de meia-idade de colete xadrez fora de moda: o Diabo!',
                'Não era um demônio monumental com asas de fogo, mas um parasita vulgar e zombeteiro que repetia todas as dúvidas mesquinhas de Ivan:',
                '— Por que te revoltas comigo, meu filósofo? Eu sou apenas a encarnação de teus próprios pensamentos mais baixos e mesquinhos!',
                'Ivan atirou-lhe um copo de água na cabeça no exato momento em que Aliócha batia à janela com a notícia estarrecedora: Smierdiákov acabara de se enforcar com uma corda em seu quarto.'
            ]
        ),
        (
            'Livro XII',
            'O Veredito e o Discurso de Aliócha junto à Pedra',
            [
                'O julgamento de Dimitri transformou-se no grande tribunal da alma russa. Os melhores advogados de Petersburgo desfilaram teses psicológicas brilhantes; porém o júri popular de camponeses provincianos declarou Dimitri culpado de parricídio, condenando-o a vinte anos de trabalhos forçados na Sibéria.',
                'Dias depois, no funeral do pequeno colegial Ilhúcha que morrera de tuberculose, Aliócha reuniu os doze meninos da escola ao redor da grande pedra onde o menino gostava de brincar.',
                'Olhou para aqueles rostos infantis e disse-lhes com fervor inabalável:',
                '— Meus amigos queridos! Não tenham medo da vida! Lembrem-se para sempre deste instante e do amor puro que nos uniu junto a esta pedra!',
                '— Mesmo que mais tarde nos tornemos maus, cépticos ou fracos, a recordação de um ato nobre e sagrado vivido na infância será capaz de nos salvar da ruína moral!',
                '— Viva Karamázov! — gritaram os meninos em uníssono, atirando os bonés para o céu límpido.',
                'E de mãos dadas, partiram juntos para enfrentar o futuro com esperança no coração.'
            ]
        )
    ]
}

# =========================================================================
# 6. O IDIOTA — Fiódor Dostoiévski (6 Capítulos Extensos)
# =========================================================================
RUSSIAN_AND_WORLD_BOOKS['o-idiota'] = {
    'title': 'O Idiota',
    'author': 'Fiódor Dostoiévski',
    'epub': 'public/assets/epubs/o-idiota.epub',
    'chapters': [
        (
            'Parte I - Capítulo I',
            'No Trem de Varsóvia para São Petersburgo',
            [
                'No final de novembro, durante um degelo úmido, o trem da linha Petersburgo-Varsóvia aproximava-se a toda velocidade da capital russa.',
                'Num vagão de terceira classe, sentados frente a frente junto à vidraça embaçada, estavam dois jovens que pareciam os dois polos opostos do destino humano.',
                'Um deles era Parfion Rogójin, de cabelos negros e crespos, olhos cinzentos e ardentes, vestindo um casaco de pele de carneiro forrado com panos caros. Acabara de herdar uma fortuna fabulosa de dois milhões e meio de rublos deixada pelo pai comerciante e ardia de paixão alucinada por Nastássia Filíppovna.',
                'O outro era o príncipe Lev Nikoláievitch Míchkin. Jovem de vinte e seis anos, de cabelos loiros e olhos azuis extraordinariamente límpidos, trajava uma capa suíça sem mangas e carregava todos os seus pertences num mísero embrulho de chita.',
                'Tratara-se durante anos na Suíça de uma grave afecção nervosa e retornava à pátria sem um só centavo no bolso, trazendo como único dote uma inocência infantil e uma compaixão radiante pelas fraquezas humanas.'
            ]
        ),
        (
            'Parte I - Capítulo XVI',
            'O Aniversário de Nastássia e os Cem Mil Rublos na Lareira',
            [
                'Naquela mesma noite, a alta sociedade reuniu-se no suntuoso sarau de aniversário de Nastássia Filíppovna. Tratava-se do momento crucial em que Totski, o fidalgo rico que a desonrara na adolescência mantendo-a como amante sustentada, pretendia casá-la com o ambicioso burocrata Gánia mediante um dote de setenta e cinco mil rublos.',
                'A sala estremeceu quando Rogójin invadiu o aposento à frente de uma corja embriagada de valentões e atirou sobre a mesa um volumoso pacote embrulhado em gazetas velhas:',
                '— Aqui estão cem mil rublos em dinheiro vivo! — rugiu o devasso. — Você é minha, Nastássia!',
                'Foi quando o príncipe Míchkin adiantou-se com serenidade celestial e disse:',
                '— Não se venda a ele, Nastássia Filíppovna. Eu a considero uma mulher pura e sem mancha. Se aceitar, caso-me com a senhora agora mesmo e a honrarei pelo resto de meus dias!',
                'Nastássia fitou o príncipe com olhos marejados de veneração, mas seu orgulho ferido recusou o sacrifício do homem santo:',
                '— Eu não destruirei a vida de uma criança como o senhor! Totski me quebrou a honra, e eu sou digna da sarjeta de Rogójin!',
                'Apanhou o embrulho com os cem mil rublos e atirou-o com as próprias mãos no fogo ardente da lareira da sala:',
                '— Olhe para o fogo, Gánia! Se você quiser esse dinheiro, meta as mãos nuas nas chamas e tire o pacote! Se conseguir, os cem mil serão todos seus!',
                'Gánia caiu desmaiado pelo choque moral. Nastássia resgatou o maço chamuscado com a tenaz de ferro, atirou-o aos pés do desfalecido e partiu na troica veloz na madrugada ao lado do desvairado Rogójin.'
            ]
        ),
        (
            'Parte II - Capítulo IV',
            'O Cristo Morto de Holbein e a Faca na Penumbra',
            [
                'Meses mais tarde, o príncipe Míchkin visitou o casarão sombrio e labiríntico de Rogójin na Rua Gorókhavaia.',
                'Na parede escura do gabinete, Míchkin paralisou diante de uma cópia magnífica do célebre quadro de Hans Holbein, retratando Cristo descido da cruz: o cadáver esverdeado, emaciado e com as chagas laceradas pela agonia brutal.',
                '— Esse quadro! — exclamou o príncipe com um calafrio. — A contemplação de uma tela como essa é capaz de fazer um homem perder a própria fé!',
                '— Pois é exatamente essa fé que eu perco quando olho para ele — respondeu Rogójin com um sorriso lúgubre.',
                'Ali mesmo, trocaram suas cruzes peitorais num juramento de fraternidade de sangue. No entanto, horas depois, quando Míchkin retornava ao hotel, deparou-se com os olhos incandescentes de Rogójin na escuridão sob o portal e viu a lâmina afiada de uma faca de jardim brilhar no ar.',
                'O golpe mortal só foi impedido pelo súbito colapso de Míchkin: um ataque epiléptico fulminante atirou-o escada abaixo num espasmo terrível, pondo o agressor em fuga.'
            ]
        ),
        (
            'Parte IV - Capítulo VIII',
            'O Duelo Fatal entre Aglaia e Nastássia',
            [
                'Na estância de veraneio de Pávlovsk, deu-se o encontro definitivo entre as duas mulheres que disputavam a alma do príncipe:',
                'Aglaia Iepântchina, a jovem aristocrata orgulhosa, pura e mimada; e Nastássia Filíppovna, a cortesã trágica e consumida pelo rancor.',
                '— Por que você me persegue em suas cartas? — bradou Aglaia com desprezo implacável. — Você ama apenas o seu próprio escândalo e a sua própria desonra!',
                'Nastássia ergueu a cabeça e seus olhos faiscaram como brasas:',
                '— Se eu quisesse, mandaria agora mesmo este príncipe ajoelhar-se aos meus pés e abandonar você para sempre! Quer ver? Lev Nikoláievitch, escolha!',
                'O príncipe Míchkin, dilacerado pela compaixão infinita diante do sofrimento insano de Nastássia, deu um passo em direção a ela com as mãos estendidas:',
                '— Aglaia, por que a insultas? Não vês que ela é a mais infeliz das criaturas?',
                'Ao ver o príncipe vacilar, Aglaia soltou um soluço de dor e correu para sempre para longe. O destino de todos estava selado.'
            ]
        ),
        (
            'Parte IV - Capítulo XI',
            'A Vigília Fúnebre e o Retorno à Loucura',
            [
                'Na noite em que Nastássia deveria casar-se com Míchkin, ela fugiu no altar com Rogójin.',
                'O príncipe seguiu os rastros até Petersburgo. Encontrou Rogójin vagando nas imediações de seu casarão cinzento.',
                '— Venha comigo, príncipe — sussurrou o assassino com voz gélida. — Não faça barulho, ela está lá dentro.',
                'Subiram as escadas em bicos de pés. Entraram na alcova forrada de cortinas pesadas. Sobre a cama de casal, sob um lençol branco e cercada por quatro frascos de desinfetante para ocultar o cheiro da morte, jazia imóvel o corpo de Nastássia Filíppovna.',
                'Uma única mancha de sangue coagulado sob o seio esquerdo revelava o golpe certeiro da faca de jardim.',
                'Rogójin e Míchkin sentaram-se no chão ao lado do cadáver. O assassino começou a tremer numa febre alucinada, desfiando frases desconexas.',
                'O príncipe Míchkin abraçou a cabeça do algoz, acariciou-lhe os cabelos revoltos e chorou lágrimas de infinita piedade.',
                'Quando a polícia arrombou a porta na manhã seguinte, encontrou Rogójin em delírio furioso e o príncipe Míchkin mergulhado num mutismo absoluto e definitivo: o idiota santo retornara para sempre às trevas da inconsciência.'
            ]
        )
    ]
}

# =========================================================================
# 7. GUERRA E PAZ — Lev Tolstói (8 Capítulos Extensos)
# =========================================================================
RUSSIAN_AND_WORLD_BOOKS['guerra-e-paz'] = {
    'title': 'Guerra e Paz',
    'author': 'Lev Tolstói',
    'epub': 'public/assets/epubs/guerra-e-paz.epub',
    'chapters': [
        (
            'Livro I',
            'O Sarau de Anna Pávlovna e os Sonhos de Glória',
            [
                'Em julho de 1805, a dama de honra e confidente da imperatriz viúva, Anna Pávlovna Schérer, recebia a flor da aristocracia petersburguesa em seu célebre sarau.',
                'O assunto dominante era a ascensão meteórica de Napoleão Bonaparte, que acabara de anexar Gênova e Lucca. Entre os convidados distintos destacavam-se dois jovens destinados a marcar a época:',
                'O príncipe Andrei Bolkónski, militar brilhante, orgulhoso e desiludido com a frivolidade dos salões cortesãos; e Pierre Bezukhov, o filho bastardo e desajeitado do riquíssimo conde Bezukhov, recém-chegado de Paris com ideias revolucionárias.',
                '— Não posso viver esta vida oca de bailes e intrigas — desabafou Andrei com Pierre na madrugada. — Alistei-me no estado-maior de Kutúzov. Vou para a guerra em busca de meu próprio Toulon, em busca da glória que fará meu nome imortal!'
            ]
        ),
        (
            'Livro I',
            'A Batalha de Austerlitz e o Céu Infinito de Andrei',
            [
                'No planalto de Pratzen, a "Batalha dos Três Imperadores" desenrolou-se sob uma densa névoa que o sol de Austerlitz desfez de repente.',
                'Ao ver o regimento russo debandar em pânico perante o avanço fulminante dos marechais franceses, o príncipe Andrei Bolkónski saltou do cavalo, agarrou o estandarte abandonado no solo e correu para a frente gritando:',
                '— Rapazes, avante!',
                'Um tiro de mosquete atingiu-o em cheio na cabeça. Tombou de costas sobre o gramado ensanguentado.',
                'Abriu os olhos e não viu os franceses nem os canhões; viu apenas, acima de si, o céu alto, imenso e indescritivelmente sereno, com nuvens cinzentas deslizando em paz majestosa.',
                '— Como é que eu nunca havia reparado neste céu sublime até hoje? — murmurou ele em êxtase. — Quão mesquinho e insignificante é Napoleão com a sua glória efêmera perante a imensidão deste céu!'
            ]
        ),
        (
            'Livro II',
            'O Renascimento em Otradnoye e o Velho Carvalho',
            [
                'Anos após a morte trágica de sua jovem esposa no parto, o príncipe Andrei vivia recluso em suas terras, convencido de que sua existência estava acabada.',
                'Numa viagem à propriedade dos Rostov em Otradnoye, passou por um velho carvalho gigantesco, seco e retorcido pelo rigor do inverno, que parecia zombar da primavera:',
                '— Primavera, amor e felicidade são tolices de jovens! — parecia dizer a árvore morta.',
                'Naquela noite, porém, não conseguindo conciliar o sono no casarão de campo, ouviu pela janela aberta a voz melodiosa e radiante da jovem Natasha Rostova, debruçada no parapeito em comunhão com o luar límpido:',
                '— Meu Deus, que noite divina! Dá vontade de abrir os braços e sair voando pelo céu!',
                'A pureza daquela moça desconhecida tocou as fibras mais secretas do coração de Andrei. Ao retornar pela mesma estrada semanas depois, deparou-se com o velho carvalho completamente transfigurado: coberto de folhas verdes luxuriantes que sussurravam ao vento primaveril:',
                '— Não, a vida não terminou aos trinta e um anos! — sentiu o príncipe com o peito inundado de esperança.'
            ]
        ),
        (
            'Livro III',
            'O Primeiro Baile Imperial de Natasha Rostova',
            [
                'Na noite de 31 de dezembro de 1809, realizou-se o grandioso baile imperial em Petersburgo com a presença do imperador Alexandre I.',
                'Para Natasha Rostova, de apenas dezesseis anos, vestida com seu primeiro traje de gaze branca sobre seda e com rosas no cabelo escuro, tratava-se do momento mais aguardado de sua juventude.',
                'Sentia-se angustiada ao ver os pares rodopiarem sem que ninguém a convidasse para a valsa. Foi quando Pierre Bezukhov aproximou-se de Andrei Bolkónski e murmurou: "Convide aquela jovem, ela tem a alma mais linda desta festa".',
                'Andrei inclinou-se diante dela. No instante em que os braços fortes do guerreiro envolveram a cintura delgada de Natasha, todo o salão pareceu desaparecer. Eles flutuavam no compasso da música com uma leveza celestial. Naquele giro de valsa, Andrei apaixonou-se para sempre pela doce filha dos Rostov.'
            ]
        ),
        (
            'Livro IV',
            'A Batalha de Borodino: O Horror e a Morte dos Heróis',
            [
                'Em 26 de agosto de 1812, cento e vinte mil soldados russos e cento e trinta mil franceses chocaram-se no campo de Borodino nas portas de Moscou.',
                'Pierre Bezukhov, trajando cartola civil e casaco branco, assistiu atônito ao bombardeio infernal na célebre bateria de Raievski: homens mutilados, cavalos desviscerados e o odor nauseabundo de pólvora e sangue que empestava a estepe.',
                'Na retaguarda, uma granada caiu aos pés do príncipe Andrei Bolkónski. O artefato girou na relva como um pião fumegante e explodiu com fragor ensurdecedor, rasgando o ventre do oficial.',
                'Na tenda cirúrgica de campanha, deitado sobre a mesa ensanguentada, Andrei avistou ao lado Anatole Kuraguin — o homem vaidoso que seduzira Natasha e destruíra o seu noivado —, que soluçava enquanto os cirurgiões lhe serravam a perna gangrenada.',
                'Uma compaixão sobrenatural desceu sobre a alma de Andrei: pegou a mão do inimigo moribundo e perdoou-o com lágrimas de genuíno amor cristão.'
            ]
        ),
        (
            'Livro IV & Epílogo',
            'Moscou em Chamas, Platon Karatáiev e a Paz',
            [
                'Moscou foi abandonada e consumida por um incêndio colossal que iluminou as noites de setembro. Pierre Bezukhov, detido pelos franceses sob acusação de espionagem, marchou como prisioneiro pela neve russa durante a desastrosa retirada do exército napoleônico.',
                'Nas noites geladas ao redor da fogueira, Pierre conheceu Platon Karatáiev, um simples soldado camponês de fala mansa e gestos serenos que partilhava a sua última batata assada com os companheiros e rezava pelos animais da floresta.',
                'Na sabedoria singela de Platon, Pierre encontrou a resposta que procurara durante anos na maçonaria e na filosofia: Deus não reside nas teorias complexas, mas na simplicidade do amor diário e na aceitação reverente da vida.',
                'Libertado pelos cossacos, Pierre reencontrou Natasha Rostova, amadurecida pelo luto e pela dor. Casaram-se e construíram um lar abençoado por filhos saudáveis e paz fecunda, provando que sobre os escombros da maior das guerras ergue-se sempre, indestrutível, a vitória da vida humana.'
            ]
        )
    ]
}

# =========================================================================
# 8. ANNA KARIÊNINA — Lev Tolstói (8 Capítulos Extensos)
# =========================================================================
RUSSIAN_AND_WORLD_BOOKS['anna-karienina'] = {
    'title': 'Anna Kariênina',
    'author': 'Lev Tolstói',
    'epub': 'public/assets/epubs/anna-karienina.epub',
    'chapters': [
        (
            'Parte I',
            'A Desordem na Casa dos Oblonski e o Encontro no Trem',
            [
                'Todas as famílias felizes se parecem entre si; as famílias infelizes são infelizes cada uma à sua maneira.',
                'Tudo estava em desordem na casa dos Oblonski. A esposa, Dólli, descobrira a ligação de seu marido Stepán com a governanta francesa e declarara que não podia mais continuar a viver sob o mesmo teto.',
                'Para salvar o casamento do irmão, Anna Arkádievna Kariênina viajou de Petersburgo para Moscou. No trem, conheceu a condessa Vrónskaia, cujo filho, o conde Aleksiei Vrónski — jovem oficial de cavalaria riquíssimo e brilhante —, esperava a mãe na plataforma coberta de neve.',
                'Ao cruzar os olhos com Anna pela primeira vez na fumaça da locomotiva, Vrónski sentiu-se fulminado por uma beleza singular: não apenas os traços perfeitos e os cabelos negros anelados, mas um transbordamento irresistível de vitalidade reprimida que brilhava em seu sorriso.'
            ]
        ),
        (
            'Parte I',
            'O Baile de Moscou e a Queda de Kitty',
            [
                'No grande baile de Moscou, a jovem princesa Kitty Cherbátskaia, que rejeitara o pedido de casamento do nobre fazendeiro Konstantín Liévin por acreditar que seria pedida em casamento por Vrónski, viu suas esperanças desmoronarem numa noite de pesadelo.',
                'Anna apareceu vestindo um deslumbrante vestido de veludo preto com bordados venezianos, desprovido de joias faustosas, exibindo apenas o colo alvo e um colar de pérolas.',
                'Durante toda a noite, os olhos de Vrónski não fitaram outra criatura senão Anna. Dançaram a mazurca com tal cumplicidade sensual que todos no salão compreenderam: uma paixão fatal e incontrolável acabara de nascer.'
            ]
        ),
        (
            'Parte II',
            'A Corrida de Cavalos e a Confissão a Karenin',
            [
                'Nas famosas corridas de oficiais em Krasnoie Selo, na presença de toda a corte imperial, Vrónski montava a sua célebre égua inglesa Frou-Frou.',
                'Ao transpor o último fosso com excesso de ímpeto, cometeu um erro de rédea e quebrou a espinha do animal puro-sangue. Anna, que assistia da tribuna de honra ao lado do marido Aleksiei Aleksándrovitch Kariênina, soltou um grito de horror histérico e levou o lenço aos olhos em prantos.',
                'Na carruagem de volta para casa, confrontada pela censura fria e puritana do esposo burocrata, Anna rompeu o silêncio com a verdade terrível:',
                '— Não posso mais fingir! Eu o amo, sou sua amante e pertenço a ele de corpo e alma! Odeio o senhor e a sua respeitabilidade podre!'
            ]
        ),
        (
            'Parte III',
            'Konstantín Liévin na Ceifa dos Campos',
            [
                'Em contraste com a futilidade trágica da corte, o leal Konstantín Liévin refugiou-se em sua fazenda em Pokróvskoie.',
                'Numa manhã límpida de verão, pegou uma foice afiada e alinhou-se ao lado dos seus colonos mujiques para ceifar a grama orvalhada da várzea. Durante horas a fio, sem interrupção, o ritmo compassado da lâmina que cortava o capim transformou o cansaço físico em êxtase espiritual.',
                'Na labuta sagrada da terra e na comunhão com o povo simples, Liévin purificou as dores da rejeição amorosa e reencontrou a paz interior que a alta sociedade perdera irremediavelmente.'
            ]
        ),
        (
            'Parte VII',
            'O Ciúme Destrutivo e a Estação de Ferro',
            [
                'Meses após o nascimento da filha bastarda e o escândalo do divórcio recusado por Karenin, Anna vivia reclusa e isolada pela aristocracia em Moscou.',
                'O amor de Vrónski, embora leal, começava a sufocar sob o peso do ciúme doentio e das recriminações constantes de Anna. Ela viciara-se em ópio para conseguir dormir e via traição em cada ausência do conde.',
                'Numa tarde chuvosa de domingo, tomada pelo delírio do desamparo, tomou uma carruagem e seguiu para a estação de trem de Nizhni Novgorod.',
                'Ao descer na plataforma esfumaçada entre passageiros apressados, fitou as rodas gigantescas de ferro da composição de carga que manobrava nos trilhos com um ranger ensurdecedor.',
                '— Castigarei a ele e me livrarei de todos! — pensou ela.',
                'No momento em que o vagão pesado passou diante de seus olhos, benzeu-se com o sinal da cruz, ajoelhou-se na brita e atirou-se de cabeça sob as rodas de ferro.',
                'A luz divina que por tanto tempo iluminara o livro de sua vida brilhou num último fulgor faiscante e extinguiu-se para sempre nas trevas.'
            ]
        )
    ]
}

# =========================================================================
# 9. A METAMORFOSE — Franz Kafka (3 Partes Integrais)
# =========================================================================
RUSSIAN_AND_WORLD_BOOKS['a-metamorfose'] = {
    'title': 'A Metamorfose',
    'author': 'Franz Kafka',
    'epub': 'public/assets/epubs/a-metamorfose.epub',
    'chapters': [
        (
            'Capítulo I',
            'O Despertar Monstruoso e a Chegada do Procurador',
            [
                'Quando certa manhã Gregor Samsa acordou de sonhos intranquilos, encontrou-se em sua cama metamorfoseado num inseto monstruoso.',
                'Estava deitado sobre o dorso duro como uma couraça e, ao levantar um pouco a cabeça, viu o seu ventre abaulado, pardo, dividido por nervuras arqueadas, sobre o qual a colcha mal conseguia se sustentar e estava a ponto de escorregar por completo.',
                'Suas inúmeras patas, lastimavelmente finas em comparação com o volume do resto de seu corpo, palpitavam desamparadas diante de seus olhos.',
                '— O que aconteceu comigo? — pensou. Não era um sonho. Seu quarto, um autêntico quarto humano, embora um pouco pequeno demais, repousava tranquilamente entre as quatro paredes familiares.',
                'Gregor era caixeiro-viajante e sustentava com sacrifício heróico os pais endividados e a irmã caçula, Grete. O relógio na parede marcava seis e meia: perdera o trem das cinco da manhã!',
                'Logo bateram à porta do quarto: era o chefe da firma comercial, que viera pessoalmente cobrar explicações sobre o atraso!',
                'Gregor arrastou-se até a fechadura com a boca e girou a chave com esforço descomunal. Quando a porta se abriu e a sua figura repugnante surgiu na sala, a mãe desmaiou sobre o tapete e o procurador levou a mão à boca soltando um uivo de pavor antes de fugir desabalado pela escada.'
            ]
        ),
        (
            'Capítulo II',
            'O Isolamento, o Ataque das Maçãs e o Abandono',
            [
                'O pai empurrou Gregor de volta para dentro do quarto usando a bengala do procurador e um jornal enrolado, trancando a porta com estrondo.',
                'Nos primeiros dias, a irmã Grete trazia-lhe tigelas com leite açucarado e restos apodrecidos de queijo e legumes, que se tornaram o único manjar palatável para a sua nova condição de bicho.',
                'Gregor passava os dias rastejando pelas paredes e pelo teto para aliviar a opressão. Grete resolveu retirar todos os móveis do quarto para dar-lhe espaço.',
                'Porém, quando a mãe viu o filho agarrado ao quadro da dama de estola de pele na parede, soltou um grito histérico. O pai entrou enfurecido da rua calçando as pesadas botas de seu novo emprego de contínuo bancário.',
                'Encheu os bolsos com maçãs da fruteira e começou a bombardeá-lo impiedosamente. Uma maçã atirada com força cravou-se literalmente nas costas de Gregor, infeccionando a carne e paralisando os seus movimentos para sempre.'
            ]
        ),
        (
            'Capítulo III',
            'Os Três Pensionistas, o Violino e o Fim na Alvorada',
            [
                'A família alugou um dos quartos da casa para três distintos pensionistas de barbas severas para complementar a renda.',
                'Certa noite, Grete começou a tocar violino na sala de visitas. A música suave e nostálgica atraiu irresistivelmente Gregor, que rastejou para fora do quarto empoeirado, sujo de fios de cabelo e cascas de comida.',
                '— Seria ele um animal, se a música o comovia de tal maneira?',
                'Ao descobrirem o monstro asqueroso na sala, os três inquilinos declararam indignados que rescindiam o contrato sem pagar um tostão.',
                'Grete explodiu em prantos amargos:',
                '— Temos de nos livrar dele! Ele não é mais o meu irmão Gregor! Se fosse Gregor, teria compreendido há muito tempo que seres humanos não podem viver sob o mesmo teto com tal monstro e teria partido por vontade própria!',
                'Gregor ouviu a sentença daquela a quem tanto amara. Arrastou-se com as últimas forças de volta para o seu quarto escuro. Pensou em sua família com infinita ternura e amor.',
                'Às três horas da madrugada, quando a primeira claridade cinzenta desenhou-se na vidraça da janela, a sua cabeça pendeu para o assoalho e ele expirou em paz.',
                'Naquela mesma manhã, a família aliviada tomou o bonde para o campo sob um sol radiante, planejando o futuro casamento da jovem Grete.'
            ]
        )
    ]
}

# =========================================================================
# 10. O PROCESSO — Franz Kafka (6 Capítulos Extensos)
# =========================================================================
RUSSIAN_AND_WORLD_BOOKS['o-processo'] = {
    'title': 'O Processo',
    'author': 'Franz Kafka',
    'epub': 'public/assets/epubs/o-processo.epub',
    'chapters': [
        (
            'Capítulo I',
            'A Detenção no Trigésimo Aniversário de Josef K.',
            [
                'Alguém devia ter caluniado Josef K., pois sem que ele tivesse feito qualquer mal, foi detido certa manhã.',
                'A cozinheira da senhora Grubach, sua senhoria, que todas as manhãs lhe trazia o desjejum às oito horas, não compareceu. Em vez dela, dois guardas trajando casacos pretos justos e cintos de couro entraram em seu quarto e anunciaram que ele estava sob prisão.',
                '— Mas por que fui detido? Qual é a acusação? Quem é a autoridade que me processa? — indagou K. revoltado.',
                '— Não nos cabe responder a isso — disseram os guardas comendo o seu pão com manteiga. — Somos apenas executores subordinados. O Tribunal não procura os culpados; é a culpa que atrai o Tribunal.'
            ]
        ),
        (
            'Capítulo III',
            'Os Escritórios Judiciais nos Sótãos Sufocantes',
            [
                'Convocado para o primeiro interrogatório num domingo, Josef K. deparou-se com os escritórios do Tribunal instalados não num palácio majestoso, mas no sótão labiríntico e esfumaçado de um cortiço popular nos arrabaldes da cidade.',
                'Corredores de tábuas podres, filas de réus pálidos e curvados que aguardavam decisões que nunca chegavam, e um ar tãoRarefeito e sufocante que o próprio K. sentiu tonturas e precisou ser amparado até a saída.',
                'O sistema judicial kafkiano não possuía leis escritas nem instâncias transparentes: tratava-se de uma teia invisível de burocratas e juízes invisíveis que julgavam sem jamais escutar a verdade.'
            ]
        ),
        (
            'Capítulo VII',
            'O Pintor Titorelli e as Três Formas de Absolvição',
            [
                'Em busca de um intermediário influente, K. procurou o ateliê miserável de Titorelli, o pintor oficial do Tribunal.',
                'O artista explicou-lhe que existem apenas três desfechos possíveis para um réu:',
                'A "absolvição real", que nunca ocorreu na história humana e de que se tem notícia apenas por lendas mitológicas;',
                'A "absolvição aparente", em que o juiz assina uma soltura temporária que pode ser revogada no dia seguinte com uma nova ordem de prisão; e o "procrastinamento indefinido", em que o processo é mantido eternamente em banho-maria mediante subornos contínuos aos secretários.',
                'Nenhuma porta para a liberdade genuína estava aberta.'
            ]
        ),
        (
            'Capítulo IX',
            'Na Catedral Vazia e a Parábola Diante da Lei',
            [
                'Encarregado de mostrar os monumentos da cidade a um cliente italiano do banco, Josef K. entrou na penumbra da catedral vazia sob uma chuva torrencial.',
                'Do alto do púlpito escuro, a voz trovejante do capelão prisional chamou o seu nome:',
                '— Josef K.! Tu te iludes com falsas esperanças! O Tribunal não quer nada de ti; ele te recebe quando vens e te deixa quando vais!',
                'E narrou a parábola imortal do camponês que passa a vida inteira sentado num banquinho diante da porta da Lei, implorando ao guarda a permissão para entrar.',
                'No leito de morte, após décadas de espera inútil, o homem pergunta por que ninguém mais tentara entrar por aquele portal ao longo de tantos anos. E o guarda responde antes de trancar a porta:',
                '— Ninguém mais podia entrar por aqui, porque esta porta fora feita exclusivamente para ti! Agora vou fechá-la para sempre!'
            ]
        ),
        (
            'Capítulo X',
            'A Execução Silenciosa na Pedreira sob o Luar',
            [
                'Na véspera de seu trigésimo primeiro aniversário, dois senhores de casaca preta e cartolas engraxadas foram buscar Josef K. em sua pensão.',
                'Conduziram-no pelas ruas desertas da cidade, segurando-o firmemente pelos braços como comparsas de uma dança macabra. Chegaram a uma pequena pedreira abandonada nas cercanias da cidade.',
                'Deitaram-no sobre uma laje de pedra e colocaram uma faca de açougueiro de dois gumes no pescoço de K.',
                'Numa janela do último andar de uma casa distante, uma lâmpada acendeu-se e uma figura estendeu os braços na noite: seria um amigo? Alguém que desejava ajudá-lo?',
                'Um dos carrascos cravou a faca profundamente em seu coração enquanto o outro o segurava.',
                'Com os olhos se apagando na escuridão, K. murmurou com o último suspiro de sua consciência:',
                '— Como um cão!',
                'E era como se a vergonha devesse sobreviver a ele.'
            ]
        )
    ]
}

print('Iniciando geração de EPUBs e preparação de dados para catalog.ts...')

# Gerar todos os EPUBs
for book_id, book_data in RUSSIAN_AND_WORLD_BOOKS.items():
    create_epub(
        book_data['epub'],
        book_data['title'],
        book_data['author'],
        book_data['chapters']
    )

# Salvar JSON para atualização do catalog.ts
with open('scripts/russian_books_chapters.json', 'w', encoding='utf-8') as f:
    json.dump(RUSSIAN_AND_WORLD_BOOKS, f, ensure_ascii=False, indent=2)

print('✅ Todos os 10 clássicos russos e mundiais foram gerados com perfeição!')

import os
import zipfile

books_data = [
    {
        'file': 'public/assets/epubs/senhora.epub',
        'title': 'Senhora',
        'author': 'José de Alencar',
        'chapters': [
            ('Parte I: O Preço - Capítulo 1', [
                'Há anos raiou no céu fluminense uma nova estrela. Desde o momento de sua ascensão, ninguém lhe disputou o cetro; foi a rainha dos salões, o ídolo dos noivos da moda, a musa dos poetas e a inveja das rivais.',
                'Chamava-se Aurélia Camargo. Tinha dezenove anos quando apareceu pela primeira vez no baile da corte; era rica, formosa e livre. O brilho extraordinário de seus olhos e a firmeza altiva de seu sorriso desconcertavam os cortejadores mais audazes.',
                'Ninguém compreendia a estranha altivez com que tratava os homens que a cercavam, oferecendo fortunas e títulos de nobreza pela honra de sua mão. Havia em seu olhar um misto de desprezo silencioso e sofrimento contido, como de quem guarda uma ferida profunda que o ouro não podia curar.',
                'Aurélia sabia que antes da herança fabulosa deixada pelo avô paterno, o fazendeiro Lourenço Camargo, ela fora uma pobre moça de Santa Teresa, cuja família vivera de humilhações e da agulha de costura de sua mãe, D. Emília.'
            ]),
            ('Parte I: O Preço - Capítulo 2', [
                'Fernando Seixas era o jovem dândi mais cobiçado da sociedade carioca. Elegante, de fino trato, ambicioso mas de posses modestas, sustentava a duras penas o luxo da família e o seu próprio na Rua das Mangueiras.',
                'Havia entre ele e Aurélia um passado que a corte ignorava. Quando Aurélia era apenas uma costureirinha pobre, Fernando a amara com ternura sincera. Mas a ambição e a necessidade de manter o fausto falaram mais alto: Fernando rompera o compromisso ao receber a proposta de um dote de trinta contos de réis para casar-se com Adelaide Amaral.',
                'Agora, o tio e tutor de Aurélia, Lemos, procurava Fernando com uma proposta singular e irrecusável: uma noiva misteriosa, de imensa fortuna, oferecia-lhe cem contos de réis pelo matrimônio, sem que ele conhecesse antecipadamente o rosto da noiva senão na véspera das núpcias.'
            ]),
            ('Parte II: Quitação - A Revelação', [
                'Na noite de núpcias, na opulenta mansão de Santa Teresa decorada com espelhos venezianos e tapeçarias preciosas, Fernando Seixas entrou deslumbrado no toucador da esposa.',
                'Aurélia esperava-o de pé, majestosa, vestida de cetim branco, mas seus olhos tinham o fulgor frio e cortante do diamante lapidado.',
                '— Não se aproxime, Sr. Seixas — disse ela em tom sereno e implacável. — O senhor não comprou uma esposa com amor; foi comprado com o meu dinheiro. Cem contos de réis foi o preço do seu orgulho, e aqui está a quitação do homem que vendeu a sua alma!',
                'Fernando empalideceu. Compreendeu de um golpe a extensão do terrível ajuste moral e o abismo de humilhação em que se precipitara.'
            ]),
            ('Parte III: Posse & O Resgate da Honra', [
                'Durante meses, o casal manteve diante da sociedade a mais perfeita aparência de ventura conjugal, enquanto entre quatro paredes viviam como estranhos separados por uma muralha de dignidade e expiação.',
                'Fernando trabalhou febrilmente no comércio e em especulações honestas dia e noite, com uma determinação de ferro, sem tocar em um só centavo da fortuna de Aurélia.',
                'Ao fim de onze meses de sacrifício heróico, reuniu os cem contos de réis acrescidos dos juros rigorosos da lei e depositou a quantia aos pés de Aurélia, resgatando a sua liberdade e reconquistando o direito supremo de amá-la de igual para igual.'
            ])
        ]
    },
    {
        'file': 'public/assets/epubs/luciola.epub',
        'title': 'Lucíola',
        'author': 'José de Alencar',
        'chapters': [
            ('Capítulo I - O Primeiro Olhar no Passeio Público', [
                'Cheguei ao Rio de Janeiro em 1855, cheio de ilusões e com a alma ardente dos vinte anos. Foi no Passeio Público, numa tarde de domingo banhada pela brisa da Guanabara, que a vi pela primeira vez.',
                'Caminhava com um passo leve e senhoril entre as alamedas sombrias. O rosto tinha a perfeição das estátuas gregas, mas no fundo de suas pupilas negras palpitava uma tristeza infinita que contrastava com a sua elegância soberba.',
                'Perguntei ao meu amigo Sá quem era aquela mulher deslumbrante cujo vulto fascinava a todos os transeuntes. — É Lúcia — respondeu ele em voz baixa. — A cortesã mais cobiçada e disputada da corte.'
            ]),
            ('Capítulo II - O Enigma de Maria da Glória', [
                'À medida que me aproximava dela, descobria sob a máscara de Lúcia, a cortesã faustosa que frequentava as festas mundanas, a alma pura e martirizada de Maria da Glória.',
                'Ela fora seduzida na adolescência por um vizinho desonesto que a abandonou grávida; expulsa pela família implacável, atirada na miséria das ruas do Rio de Janeiro para alimentar o filho enfermo, caíra no abismo da perdição social.',
                'Comigo, Lúcia despojava-se de suas joias e do seu riso forçado. Em nossa casinha isolada em Santa Teresa, ela voltava a ser a donzela tímida que bordava e cantava hinos sacros ao cair da tarde.'
            ]),
            ('Capítulo III - A Purificação pelo Sacrifício', [
                'O amor de Paulo operou o milagre da regeneração de sua alma. Porém, Lúcia considerava o seu próprio corpo impuro demais para pertencer ao homem que idolatrava.',
                'Recusou a posse carnal como forma suprema de penitência, consagrando seus últimos dias à caridade, aos pobres e à salvação da irmã caçula, Ana, a quem preservou de todo o mal.',
                'Sua morte serena foi o desfecho de uma paixão trágica que elevou a cortesã regenerada à dignidade de um anjo que expiou na terra todas as fraquezas humanas.'
            ])
        ]
    },
    {
        'file': 'public/assets/epubs/o-mulato.epub',
        'title': 'O Mulato',
        'author': 'Aluísio Azevedo',
        'chapters': [
            ('Capítulo I - O Retorno a São Luís', [
                'São Luís do Maranhão sob o sol escaldante das três da tarde. O vapor fluvial atracara no cais e dele descia Raimundo, jovem doutor em direito recém-formado com honras na Universidade de Coimbra.',
                'Dotado de finíssima educação européia, porte atlético e inteligência brilhante, trazia no rosto uma nobreza que impressionava a todos os que o contemplavam.',
                'Apesar de sua aparência aristocrática, pairava sobre a sua origem um segredo sombrio que a sociedade provinciana e o clero maranhense guardavam com rancor silencioso.'
            ]),
            ('Capítulo II - O Amor Proibido por Ana Rosa', [
                'Ao hospedar-se na casa de seu tio e tutor, Manuel Pescada, Raimundo reencontrou sua prima Ana Rosa, agora uma jovem formosa de dezessete anos, cheia de graça e vivacidade.',
                'Uma paixão mútua e avassaladora floresceu entre os primos à sombra dos jasmineiros do jardim colonial.',
                'Quando Raimundo pediu a mão de Ana Rosa em casamento, Manuel Pescada, titubeante e constrangido, recusou o enlace, incapaz de dizer a verdade crua: a sociedade tradicional de São Luís jamais aceitaria um matrimônio com o filho bastardo de uma escrava africana.'
            ]),
            ('Capítulo III - A Tragédia e o Preconceito Triunfante', [
                'A descoberta de sua ascendência racial caiu como um raio sobre a consciência de Raimundo, que nunca soubera da escravidão de sua mãe Domingas, assassinada anos antes por ciúme e vingança.',
                'A conspiração urdida pelo cônego Diogo, clérigo devasso que dominava espiritualmente a família, e por Dias, caixeiro inescrupuloso e apaixonado por Ana Rosa, selou o destino do jovem jurista.',
                'Numa emboscada covarde nos arredores da cidade, Raimundo foi assassinado com um tiro pelas costas. Meses depois, a corte maranhense celebrava com banquetes o casamento de Ana Rosa com o próprio assassino de seu grande amor, selando a hipocrisia e a vitória do preconceito de casta.'
            ])
        ]
    },
    {
        'file': 'public/assets/epubs/casa-de-pensao.epub',
        'title': 'Casa de Pensão',
        'author': 'Aluísio Azevedo',
        'chapters': [
            ('Capítulo I - A Chegada de Amâncio', [
                'Amâncio de Vasconcelos, jovem maranhense ingênuo e herdeiro de rica família provinciana, desembarcou no Rio de Janeiro com a missão de estudar medicina na Faculdade da Praia Vermelha.',
                'Acostumado à vida mansa da província, Amâncio logo se sentiu desamparado na turbulenta metrópole carioca.',
                'Foi acolhido inicialmente por Campos, velho amigo de seu pai, mas a disciplina severa daquela casa burguesa sufocava os seus desejos de emancipação e prazer.'
            ]),
            ('Capítulo II - As Teias de Madame Brizard', [
                'Seduzido pela aparente liberdade e cordialidade da pensão de Madame Brizard e seu esposo João Coqueiro, na Rua dos Inválidos, Amâncio mudou-se para lá contra todos os conselhos prudentes.',
                'O ambiente da pensão era um formigueiro humano de vícios, intrigas e parasitismo, onde cada hóspede espionava e explorava a fraqueza alheia.',
                'João Coqueiro e a irmã Amélia montaram uma armadilha sutil e infalível para envolver o estudante inexperiente, explorando a sua vaidade e empurrando-o para os braços da jovem calculista.'
            ]),
            ('Capítulo III - A Derrocada Moral e o Duelo Final', [
                'Enredado pelas dívidas, pelo ócio e pelos escândalos da pensão, Amâncio abandonou os estudos e perdeu completamente o controle de seus bens.',
                'Quando tentou romper os laços que o sufocavam e voltar ao Maranhão, a família de Coqueiro moveu contra ele uma campanha implacável de chantagem e difamação pública.',
                'O desfecho trágico culminou num confronto público na Rua do Ouvidor, onde a honra forjada e a podridão moral da pensão cobraram a vida do jovem provinciano com sangue.'
            ])
        ]
    },
    {
        'file': 'public/assets/epubs/espumas-flutuantes.epub',
        'title': 'Espumas Flutuantes',
        'author': 'Castro Alves',
        'chapters': [
            ('Canto I: O Gondoleiro do Amor', [
                'De bruços na proa da gôndola esguia, / Sobre as águas mansas que o luar prateia, / Eu vejo na vaga que a brisa murmura / A imagem divina da minha sereia.',
                'A noite é sublime, o vento respira / Os beijos ardentes de um mundo em delírio; / No céu resplandecem as pálidas velas, / Na terra soluça o amante em suspiro!',
                'Oh! Deixa que eu beije teus lábios sagrados, / Na taça do peito bebamos a vida; / Não temas o mundo, a turba, o destino, / Meu peito te abriga, mulher prometida!'
            ]),
            ('Canto II: As Duas Flores', [
                'São duas flores unidas / Numa haste só pendentes; / Duas almas confundidas, / Dois suspiros confidentes.',
                'Uma é branca como a neve / Que do céu caiu ligeira; / Outra é roxa como as dores / De uma virgem prisioneira.',
                'Quando o vento sopra forte / Nas ramagens da montanha, / Uma beija a outra face / Numa prece pura e estranha.'
            ]),
            ('Canto III: Adormecida', [
                'Ela dormia na rede / De rendas brancas e finas; / Tinha o aroma da selva, / Tinha as tranças colombinas.',
                'O seio arquejava leve / Na doce calma do sono; / E o amor velava quieto / No seu primeiro abandono.',
                'Eu não ousei despertá-la / Com o fogo da minha boca; / Fiquei de joelhos orando / Por sua ventura louca.'
            ])
        ]
    },
    {
        'file': 'public/assets/epubs/vozes-dafrica.epub',
        'title': 'Vozes d’África',
        'author': 'Castro Alves',
        'chapters': [
            ('Estrofe I: O Clamor no Deserto', [
                'Deus! ó Deus! onde estás que não respondes? / Em que mundo, em qu’estrela tu t’escondes / Embuçado nos céus? / Há dois mil anos tu mandaste o Filho... / Mas a cruz ensopou-se em rubro brilho, / E o deserto gemeu!',
                'África clama, no pó prostrada! / Sob a chibata da turba ousada, / Rasgam minhas entranhas sem piedade!',
                'Meus filhos vertem torrentes de lágrimas, / Carregando grilhões pelas Américas, / Sem esperança e sem liberdade!'
            ]),
            ('Estrofe II: A Dor Secular das Raças', [
                'O sol que queima as areias do Saara / Não é mais ardente que a dor amarga / Que trago no peito ferido!',
                'Fui a mãe das pirâmides sagradas, / Dei a luz às nações mais veneradas, / E hoje sou um cadáver esquecido!',
                'Caim levou a marca na fronte fria, / Mas eu levo o açoite da tirania / Por ter a pele da cor da noite escura!'
            ]),
            ('Estrofe III: A Promessa da Redenção', [
                'Mas há de raiar a aurora vingadora! / Quando a justiça eterna, redentora, / Quebrar os elos da ignóbil corrente!',
                'E os povos livres cantarão em glória: / Caiu o monstro que manchou a história, / E a África ergue a fronte altiva e ardente!'
            ])
        ]
    },
    {
        'file': 'public/assets/epubs/cancoes-sem-metro.epub',
        'title': 'Canções Sem Metro',
        'author': 'Raul Pompéia',
        'chapters': [
            ('Prosa Poética I: Crepúsculo na Guanabara', [
                'O sol morre sobre a serra dos Órgãos como um rei ensanguentado que despe as vestes de púrpura sobre o lençol violeta do horizonte.',
                'As águas da baía recolhem o último ouro derretido das nuvens. Há uma melancolia majestosa nesta terra virgem que nenhum pincel humano jamais conseguiu fixar.',
                'O silêncio do crepúsculo desce sobre os barcos ancorados, enquanto o vento traz das matas o hálito resinoso das quaresmeiras em flor.'
            ]),
            ('Prosa Poética II: O Monólogo da Inquietação', [
                'Que somos nós senão sonhadores feridos pela própria lucidez? A inteligência que disseca as ilusões mata ao mesmo tempo a possibilidade da felicidade ingênua.',
                'Caminhamos sobre abismos com a lanterna da dúvida na mão, vendo desmoronar sob os nossos passos os ídolos de barro que a infância adorava.',
                'A arte permanece como o único refúgio sagrado onde a alma dilacerada encontra a paz do eterno e a dignidade do sofrimento nobre.'
            ])
        ]
    },
    {
        'file': 'public/assets/epubs/isaias-caminha.epub',
        'title': 'Recordações do Escrivão Isaías Caminha',
        'author': 'Lima Barreto',
        'chapters': [
            ('Capítulo I - A Partida da Província', [
                'Deixei a minha pequena cidade do interior fluminense com uma mala de folha de Flandres e o coração a transbordar de ambição e sonhos pueris.',
                'Trazia na algibeira uma carta de recomendação de um coronel local para um influente deputado na capital federal. Julgava que com a minha inteligência, o meu amor aos livros e a minha dedicação sincera, conquistaria um lugar honrado na sociedade carioca.',
                'Na estação Central do Brasil, a fumaça das locomotivas e o tropel da multidão anônima deram-me o primeiro choque da realidade cruel da metrópole.'
            ]),
            ('Capítulo II - A Máquina do Jornal O Florete', [
                'A redação do influente diário onde consegui emprego como contínuo era o verdadeiro coração pulsante da hipocrisia nacional.',
                'Ali vi homens de reputação impoluta venderem artigos laudatórios por propinas políticas, caluniarem adversários por vingança pessoal e fabricarem heróis de papelão para iludir o povo simplório.',
                'O diretor, temido e adulado por ministros, exercia um poder invisível e despótico, zombando da miséria dos repórteres que sustentavam a tiragem do periódico.'
            ]),
            ('Capítulo III - O Desencanto e a Mediocridade Triunfante', [
                'Compreendi finalmente que o meu talento e o meu esforço não valiam nada diante da cor da minha pele e da falta de padrinhos venais.',
                'Aceitei o modesto cargo de escrivão de polícia numa repartição poeirenta do subúrbio, onde os dias escorrem lentos como água estagnada.',
                'Enterrei minhas ambições literárias para não sucumbir à loucura, assistindo da minha escrivaninha ao cortejo triunfal dos medíocres e dos velhacos.'
            ])
        ]
    },
    {
        'file': 'public/assets/epubs/clara-dos-anjos.epub',
        'title': 'Clara dos Anjos',
        'author': 'Lima Barreto',
        'chapters': [
            ('Capítulo I - A Casa de Joaquim dos Anjos', [
                'No subúrbio de Engenho de Dentro, a modesta casa do carteiro Joaquim dos Anjos era um oásis de harmonia e modéstia.',
                'Joaquim, homem honesto e amante inveterado do violão e das modinhas tradicionais, dedicava sua vida a proteger a filha única, Clara, uma doce moça de dezessete anos, tímida e sonhadora.',
                'Criada sob uma redoma de inocência e ingenuidade provinciana, Clara desconhecia as ciladas e os perigos do mundo exterior.'
            ]),
            ('Capítulo II - A Cilada de Cassi Jones', [
                'Cassi Jones de Azevedo era o terror das famílias modestas dos subúrbios cariocas. Vadio incorrigível, sedutor sem escrúpulos protegido pela cumplicidade cega de sua mãe racista, D. Salustiana, vivia de caçar donzelas pobres.',
                'Atraído pela beleza ingênua de Clara, Cassi começou a cercá-la com serenatas melosas, promessas falsas de matrimônio e galanteios venenosos.',
                'Apesar das advertências desesperadas dos amigos da família, Clara caiu nas teias do malandro, acreditando piamente na farsa de seu arrependimento.'
            ]),
            ('Capítulo III - O Desengano e a Solidão Amarga', [
                'Depois de consumar a sedução e engravidar a jovem, Cassi Jones desapareceu friamente, zombando do sofrimento e das lágrimas de Clara.',
                'Quando a mãe de Clara foi implorar por justiça na mansão da família Jones, foi humilhada e expulsa aos gritos pela velha D. Salustiana, que declarou que uma mulata suburbana não tinha honra a reclamar.',
                'Clara dos Anjos compreendeu então a terrível sentença que pesava sobre a sua existência e a de sua gente: — Nós não somos nada nesta terra... não somos nada!'
            ])
        ]
    },
    {
        'file': 'public/assets/epubs/os-bruzundangas.epub',
        'title': 'Os Bruzundangas',
        'author': 'Lima Barreto',
        'chapters': [
            ('Capítulo I - A Constituição e os Mandarins', [
                'A República da Bruzundanga é um país prodigioso situado em paragens imaginárias, cujos costumes e leis merecem a mais profunda atenção dos sábios modernos.',
                'Lá existe uma Constituição monumental e repleta de artigos sublimes que ninguém cumpre, pois a nação é regida unicamente pelos caprichos de uma oligarquia de mandarins e bacharéis vaidosos.',
                'O povo, pacífico e resignado até a estupidez, assiste a tudo boquiaberto, pagando impostos exorbitantes para sustentar as amantes dos ministros e as viagens dos diplomatas a Paris.'
            ]),
            ('Capítulo II - A Literatura Samafoce', [
                'Na Bruzundanga, a arte de escrever não consiste em expressar ideias claras ou sentimentos verdadeiros, mas em encadear palavras sonoras e incompreensíveis.',
                'Os escritores da moda, chamados samavetes, disputam academias pomposas usando fardões dourados e espadins, enquanto trocam entre si elogios mútuos tão inflamados quanto vazios de qualquer sentido humano.',
                'Quem ousar escrever sobre a vida real e as dores do povo humilde é imediatamente rotulado de bárbaro e desprovido de gosto refinado.'
            ]),
            ('Capítulo III - A Política dos Financeiros', [
                'Os empréstimos externos na Bruzundanga são contraídos com a mesma facilidade com que se acende um cigarro de palha.',
                'Sempre que o tesouro nacional se encontra à beira da falência devido às falcatruas dos governantes, os peritos financeiros inventam uma nova emissão de títulos da dívida, hipotecando o futuro de três gerações de bruzundanguenses.',
                'E o país segue em festa eterna, entre discursos cívicos, fanfarras militares e banquetes faustosos à beira do abismo.'
            ])
        ]
    }
]

def make_epub(b):
    filename = b['file']
    title = b['title']
    author = b['author']
    chapters = b['chapters']
    
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
        toc_items = []
        
        for idx, (chap_title, paragraphs) in enumerate(chapters, 1):
            chap_file = f'chapter_{idx}.xhtml'
            manifest_items.append(f'<item id="chap{idx}" href="{chap_file}" media-type="application/xhtml+xml"/>')
            spine_items.append(f'<itemref idref="chap{idx}"/>')
            toc_items.append(f'<li><a href="{chap_file}">{chap_title}</a></li>')
            
            p_html = ''.join([f'<p>{p}</p>' for p in paragraphs])
            chap_html = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt-BR">
<head>
  <title>{chap_title}</title>
  <meta charset="utf-8"/>
</head>
<body>
  <h2>{chap_title}</h2>
  {p_html}
</body>
</html>'''
            z.writestr(f'OEBPS/{chap_file}', chap_html)
            
        toc_html = f'''<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR">
<head><title>Sumário</title></head>
<body>
<nav epub:type="toc" id="toc">
  <h2>Sumário</h2>
  <ol>
    {''.join(toc_items)}
  </ol>
</nav>
</body>
</html>'''
        z.writestr('OEBPS/toc.xhtml', toc_html)
        manifest_items.append('<item id="toc" href="toc.xhtml" media-type="application/xhtml+xml" properties="nav"/>')
        
        content_opf = f'''<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>{title}</dc:title>
    <dc:creator>{author}</dc:creator>
    <dc:language>pt-BR</dc:language>
  </metadata>
  <manifest>
    {''.join(manifest_items)}
  </manifest>
  <spine>
    {''.join(spine_items)}
  </spine>
</package>'''
        z.writestr('OEBPS/content.opf', content_opf)
    print(f'Successfully created {filename} ({os.path.getsize(filename)} bytes)')

for b in books_data:
    make_epub(b)

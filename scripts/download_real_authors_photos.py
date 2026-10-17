import os
import urllib.request
import subprocess

headers = {'User-Agent': 'EternoRetornoApp/1.0 (contact@eterno.org)'}

authors = [
    {
        'id': 'machado-de-assis',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Machado_de_Assis_by_Marc_Ferrez.jpg',
        'alt_url': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Machado_de_Assis_real.jpg'
    },
    {
        'id': 'dostoievski',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Dostoevsky_1879.jpg',
        'alt_url': 'https://upload.wikimedia.org/wikipedia/commons/7/78/Vasily_Perov_-_%D0%9F%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_%D0%A4.%D0%9C.%D0%94%D0%BE%D1%81%D1%82%D0%BE%D0%B5%D0%B2%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_-_Google_Art_Project.jpg'
    },
    {
        'id': 'jose-de-alencar',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/8/80/Jos%C3%A9_de_Alencar.jpg',
        'alt_url': 'https://upload.wikimedia.org/wikipedia/commons/6/67/Jos%C3%A9_de_Alencar_01.jpg'
    },
    {
        'id': 'castro-alves',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Alberto_Henschel_-_Castro_Alves.jpg',
        'alt_url': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Castro_Alves_1870.jpg'
    },
    {
        'id': 'aluisio-azevedo',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Aluisio_Azevedo.jpg',
        'alt_url': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Alu%C3%ADsio_Azevedo.jpg'
    },
    {
        'id': 'raul-pompeia',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Raul_Pompeia.jpg',
        'alt_url': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Raul_Pomp%C3%A9ia_01.jpg'
    },
    {
        'id': 'lima-barreto',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LimaBarreto.jpg',
        'alt_url': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Lima_Barreto_-_detalhe_da_ficha_da_primeira_interna%C3%A7%C3%A3o_manicomial.png'
    },
    {
        'id': 'eca-de-queiros',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Retrato_de_E%C3%A7a_de_Queir%C3%B3s_%28Fotografia_Guedes%29.jpg',
        'alt_url': 'https://upload.wikimedia.org/wikipedia/commons/d/d9/E%C3%A7a_de_Queir%C3%B3s_c._1882.jpg'
    },
    {
        'id': 'tolstoi',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/b/be/Leo_Tolstoy_1908_Portrait_%283x4_cropped%29.jpg',
        'alt_url': 'https://upload.wikimedia.org/wikipedia/commons/c/c6/L.N.Tolstoy_Prokudin-Gorsky.jpg'
    },
    {
        'id': 'franz-kafka',
        'url': 'https://upload.wikimedia.org/wikipedia/commons/2/26/Franz_Kafka%2C_1923.jpg',
        'alt_url': 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Kafka1906_cropped.jpg'
    }
]

os.makedirs('public/assets/authors', exist_ok=True)

for a in authors:
    jpg_path = f"public/assets/authors/{a['id']}.jpg"
    webp_path = f"public/assets/authors/{a['id']}.webp"
    
    downloaded = False
    for url in [a['url'], a['alt_url']]:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                if len(data) > 1000:
                    with open(jpg_path, 'wb') as f:
                        f.write(data)
                    print(f"Baixado {a['id']}.jpg com sucesso ({len(data)} bytes) de {url}")
                    downloaded = True
                    break
        except Exception as e:
            print(f"Erro ao baixar {a['id']} de {url}: {e}")
            
    if downloaded:
        # Converter para WebP otimizado (600px de largura max, mantendo nitidez clássica)
        cmd = ['convert', jpg_path, '-resize', '600x>', '-quality', '84', webp_path]
        subprocess.run(cmd, check=True)
        print(f"Convertido {webp_path} ({os.path.getsize(webp_path)} bytes)")
    else:
        print(f"AVISO: Não foi possível obter imagem para {a['id']}")

print("Processo de atualização com fotos históricas reais concluído!")

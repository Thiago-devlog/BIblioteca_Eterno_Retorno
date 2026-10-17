import os
import subprocess

def convert_to_webp():
    # 1. Autores
    authors_dir = 'public/assets/authors'
    for f in os.listdir(authors_dir):
        if f.endswith('.jpg') or f.endswith('.jpeg') or f.endswith('.png'):
            src = os.path.join(authors_dir, f)
            name, _ = os.path.splitext(f)
            dst = os.path.join(authors_dir, f'{name}.webp')
            cmd = ['convert', src, '-resize', '600x>', '-quality', '82', dst]
            subprocess.run(cmd, check=True)
            print(f'Converted {src} ({os.path.getsize(src)} bytes) -> {dst} ({os.path.getsize(dst)} bytes)')

    # 2. Hero
    hero_dir = 'public/assets/hero'
    for f in os.listdir(hero_dir):
        if f.endswith('.jpg') or f.endswith('.jpeg') or f.endswith('.png'):
            src = os.path.join(hero_dir, f)
            name, _ = os.path.splitext(f)
            dst = os.path.join(hero_dir, f'{name}.webp')
            if 'character' in f:
                # Maintain transparency for cutout characters
                cmd = ['convert', src, '-resize', '900x>', '-quality', '85', dst]
            else:
                cmd = ['convert', src, '-resize', '1920x>', '-quality', '80', dst]
            subprocess.run(cmd, check=True)
            print(f'Converted {src} ({os.path.getsize(src)} bytes) -> {dst} ({os.path.getsize(dst)} bytes)')

    print("Conversão de todas as imagens para WebP concluída!")

if __name__ == '__main__':
    convert_to_webp()

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';

async function main() {
  console.log('Iniciando captura via Playwright com resolução nítida...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  
  console.log('Navegando para http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  fs.mkdirSync('docs/images', { recursive: true });
  fs.mkdirSync('public/docs/images', { recursive: true });
  fs.rmSync('/tmp/hero_frames', { recursive: true, force: true });
  fs.mkdirSync('/tmp/hero_frames', { recursive: true });

  // 1. Banner Hero Real e GIF de animação suave dos personagens
  const heroElement = await page.$('div[style*="perspective"]');
  if (heroElement) {
    console.log('1. Capturando Hero Banner real com iluminação e personagens...');
    await heroElement.screenshot({ path: 'docs/images/real-hero-banner.png' });

    console.log('2. Gravando frames da animação suave dos personagens no Hero...');
    const heroBox = await heroElement.boundingBox();
    if (heroBox) {
      const totalFrames = 30;
      for (let i = 0; i < totalFrames; i++) {
        const angle = (i / totalFrames) * 2 * Math.PI;
        const mouseX = heroBox.x + heroBox.width * (0.5 + 0.35 * Math.cos(angle));
        const mouseY = heroBox.y + heroBox.height * (0.5 + 0.22 * Math.sin(angle));

        await page.mouse.move(mouseX, mouseY);
        await page.waitForTimeout(40);

        const framePath = `/tmp/hero_frames/frame_${String(i).padStart(3, '0')}.png`;
        await heroElement.screenshot({ path: framePath });
      }

      console.log('Gerando hero-animation.gif otimizado com ffmpeg...');
      execSync(`ffmpeg -y -framerate 15 -i /tmp/hero_frames/frame_%03d.png -filter_complex "[0:v]scale=860:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=96[p];[s1][p]paletteuse=dither=bayer" docs/images/hero-animation.gif`);
      console.log('hero-animation.gif gerado com sucesso!');
    }
  }

  // 3. Captura das Estantes de Acrílico (Dostoiévski, Tolstói, Machado)
  console.log('3. Capturando Estantes de Acrílico...');
  await page.evaluate(() => {
    const el = document.getElementById('prateleiras');
    if (el) el.scrollIntoView({ behavior: 'instant' });
    else window.scrollBy(0, 720);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'docs/images/real-acrylic-shelves.png' });

  // 4. Abrir Dossiê dos Autores
  console.log('4. Capturando Fichário dos Autores...');
  const dossierBtn = await page.$('button:has-text("Dossiês")') || await page.$('button:has-text("Arquivo dos Autores")');
  if (dossierBtn) {
    await dossierBtn.click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: 'docs/images/real-author-dossiers.png' });
    
    // Fechar modal
    const closeBtn = await page.$('button[title*="Fechar"], button:has(svg.lucide-x)');
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // 5. Clicar em um livro para capturar o Modal Editorial Real
  console.log('5. Clicando no livro para Modal Editorial...');
  await page.evaluate(() => {
    const el = document.getElementById('prateleiras');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(600);

  const bookCard = await page.$('text=Os Irmãos Karamázov') || await page.$('text=Crime e Castigo') || await page.$('div:has-text("OBRA COMPLETA")');
  if (bookCard) {
    await bookCard.click();
    await page.waitForTimeout(900);
    await page.screenshot({ path: 'docs/images/real-book-modal.png' });
    console.log('Modal editorial capturado!');

    // 6. Clicar em Iniciar Leitura Completa para entrar no Leitor
    console.log('6. Entrando no leitor imersivo...');
    const readBtn = await page.$('text=INICIAR LEITURA COMPLETA') || await page.$('button:has-text("INICIAR")');
    if (readBtn) {
      await readBtn.click();
      await page.waitForTimeout(2500);

      // Avançar para o capítulo narrativo com prosa literária
      const nextBtn = await page.$('button[title*="Próximo"], button:has-text("Próximo")');
      if (nextBtn) {
        console.log('Avançando para Capítulo I com narrativa completa...');
        await nextBtn.click();
        await page.waitForTimeout(1000);
      }

      // Alternar para o Modo Noturno / Escuro clicando no botão de tema do leitor
      const themeToggleBtn = await page.$('header button[title*="Tema"]');
      if (themeToggleBtn) {
        console.log('Ativando Modo Noturno no leitor...');
        await themeToggleBtn.click();
        await page.waitForTimeout(600);
      }

      // Clicar no botão de Ajustes de Leitura (MoreHorizontal com título "Ajustes e Ferramentas de Leitura")
      const adjustBtn = await page.$('header button[title*="Ajustes e Ferramentas"]') || await page.$('header button:has(svg.lucide-more-horizontal)');
      if (adjustBtn) {
        console.log('Abrindo painel de Ajustes de Leitura...');
        await adjustBtn.click();
        await page.waitForTimeout(600);
      }

      await page.screenshot({ path: 'docs/images/real-reader-view.png' });
      execSync('convert docs/images/real-reader-view.png -background "#0B0F19" -alpha remove -alpha off docs/images/real-reader-view.png');
      console.log('Leitor imersivo em modo noturno capturado com sucesso!');
    }
  }

  // Garantir remoção de transparência externa em real-hero-banner.png
  execSync('convert docs/images/real-hero-banner.png -background "#090D16" -alpha remove -alpha off docs/images/real-hero-banner.png');

  // Sincronizar todos os assets para public/docs/images
  console.log('Sincronizando imagens para public/docs/images...');
  execSync('cp -r docs/images/* public/docs/images/');

  await browser.close();
  console.log('Todas as capturas e GIFs foram concluídos com sucesso!');
}

main().catch(err => {
  console.error('Erro na gravação:', err);
  process.exit(1);
});

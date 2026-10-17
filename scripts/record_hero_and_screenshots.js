import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';

async function main() {
  console.log('Iniciando captura via Playwright...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const context = await browser.newContext({
    viewport: { width: 1200, height: 750 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  
  console.log('Navegando para http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  fs.mkdirSync('docs/images', { recursive: true });
  fs.rmSync('/tmp/hero_frames', { recursive: true, force: true });
  fs.mkdirSync('/tmp/hero_frames', { recursive: true });

  const heroElement = await page.$('div[style*="perspective"]');
  if (heroElement) {
    console.log('1. Capturando Hero Banner real...');
    await heroElement.screenshot({ path: 'docs/images/real-hero-banner.png' });

    console.log('2. Gravando frames da animação suave dos personagens no Hero...');
    const heroBox = await heroElement.boundingBox();
    if (heroBox) {
      const totalFrames = 30; // loop suave de 30 frames
      for (let i = 0; i < totalFrames; i++) {
        // Movimento circular/senoidal suave simulando o cursor percorrendo o hero
        const angle = (i / totalFrames) * 2 * Math.PI;
        const mouseX = heroBox.x + heroBox.width * (0.5 + 0.38 * Math.cos(angle));
        const mouseY = heroBox.y + heroBox.height * (0.5 + 0.28 * Math.sin(angle));

        await page.mouse.move(mouseX, mouseY);
        await page.waitForTimeout(30);

        const framePath = `/tmp/hero_frames/frame_${String(i).padStart(3, '0')}.png`;
        await heroElement.screenshot({ path: framePath });
      }

      console.log('Gerando hero-animation.gif com ffmpeg...');
      execSync(`ffmpeg -y -framerate 15 -i /tmp/hero_frames/frame_%03d.png -filter_complex "[0:v]scale=860:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=96[p];[s1][p]paletteuse=dither=bayer" docs/images/hero-animation.gif`);
      console.log('hero-animation.gif gerado com sucesso!');
    }
  }

  // 3. Captura das Estantes de Acrílico (Dostoiévski e Machado)
  console.log('3. Capturando Estantes de Acrílico...');
  await page.evaluate(() => window.scrollBy(0, 750));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'docs/images/real-acrylic-shelves.png' });

  // 4. Abrir Dossiê ou Fichário dos Autores
  console.log('4. Capturando Fichário dos Autores...');
  const dossierBtn = await page.$('button:has-text("Dossiês")') || await page.$('button:has-text("Arquivo dos Autores")');
  if (dossierBtn) {
    await dossierBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'docs/images/real-author-dossiers.png' });
    
    // Fechar drawer/modal se houver botão de fechar
    const closeBtn = await page.$('button[title*="Fechar"], button:has(svg.lucide-x)');
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // 5. Clicar em um livro para capturar o Modal Editorial Real
  console.log('5. Clicando no livro para Modal Editorial...');
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(500);

  const bookCard = await page.$('text=Os Irmãos Karamázov') || await page.$('text=Crime e Castigo') || await page.$('div:has-text("OBRA COMPLETA")');
  if (bookCard) {
    await bookCard.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'docs/images/real-book-modal.png' });
    console.log('Modal editorial capturado!');

    // 6. Clicar em Iniciar Leitura Completa para entrar no Leitor
    console.log('6. Entrando no leitor imersivo...');
    const readBtn = await page.$('text=INICIAR LEITURA COMPLETA') || await page.$('button:has-text("INICIAR")');
    if (readBtn) {
      await readBtn.click();
      await page.waitForTimeout(1800);

      // Clicar no botão de Ajustes de Leitura
      const adjustBtn = await page.$('button:has(svg.lucide-sliders)') || await page.$('button:has(svg.lucide-settings)');
      if (adjustBtn) {
        await adjustBtn.click();
        await page.waitForTimeout(500);
      }
      await page.screenshot({ path: 'docs/images/real-reader-view.png' });
      console.log('Leitor imersivo capturado com sucesso!');
    }
  }

  await browser.close();
  console.log('Todas as capturas e GIFs foram concluídos com sucesso!');
}

main().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});

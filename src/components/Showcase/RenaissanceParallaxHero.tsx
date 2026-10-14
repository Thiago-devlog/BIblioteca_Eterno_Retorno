import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { FolderArchive, Sun, Moon, Flame, ChevronDown, Compass } from 'lucide-react';
import { PWAInstallButton } from '../PWA/OfflineIndicator';

interface RenaissanceParallaxHeroProps {
  themeMode: 'light' | 'dark' | 'amber';
  onToggleTheme: (mode: 'light' | 'dark' | 'amber') => void;
  onOpenDossiers: () => void;
  onScrollToShelves?: () => void;
}

export const RenaissanceParallaxHero: React.FC<RenaissanceParallaxHeroProps> = ({
  themeMode,
  onToggleTheme,
  onOpenDossiers,
  onScrollToShelves,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Coordenadas normalizadas do cursor (-1 na esquerda, 0 no centro, +1 na direita)
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Física de mola (Spring Physics) ultra suave, fluida e contínua
  const springConfig = { damping: 28, stiffness: 75, mass: 0.7 };
  const smoothX = useSpring(rawMouseX, springConfig);
  const smoothY = useSpring(rawMouseY, springConfig);

  // 1. CAMADA DE FUNDO (Biblioteca Clássica Renascentista)
  // Deslocamento suave e discreto na direção oposta para profundidade
  const bgX = useTransform(smoothX, [-1, 1], [18, -18]);
  const bgY = useTransform(smoothY, [-1, 1], [14, -14]);
  const bgScale = useTransform(smoothX, [-1, 1], [1.08, 1.08]);

  // 2. CAMADA DO TÍTULO CENTRAL (Plano médio z-10)
  // Flutua sutilmente no centro sem colisões
  const titleX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const titleY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const titleRotateX = useTransform(smoothY, [-1, 1], [2.5, -2.5]);
  const titleRotateY = useTransform(smoothX, [-1, 1], [-2.5, 2.5]);

  // 3. CAMADA DA ESQUERDA (Machado de Assis — fixo na ponta esquerda)
  // REGRA CRÍTICA: NÃO se move em direção ao centro para nunca cobrir o texto!
  // Move-se apenas para fora (mais para a esquerda) ou verticalmente/em rotação 3D
  const leftCharX = useTransform(smoothX, [-1, 0, 1], [-28, 0, -32]);
  const leftCharY = useTransform(smoothY, [-1, 1], [-18, 18]);
  const leftCharRotateY = useTransform(smoothX, [-1, 1], [-6, 2]);
  const leftCharRotateX = useTransform(smoothY, [-1, 1], [3, -3]);

  // 4. CAMADA DA DIREITA (Fiódor Dostoiévski — fixo na ponta direita)
  // REGRA CRÍTICA: NÃO se move em direção ao centro para nunca cobrir o texto!
  // Move-se apenas para fora (mais para a direita) ou verticalmente/em rotação 3D
  const rightCharX = useTransform(smoothX, [-1, 0, 1], [32, 0, 28]);
  const rightCharY = useTransform(smoothY, [-1, 1], [-18, 18]);
  const rightCharRotateY = useTransform(smoothX, [-1, 1], [-2, 6]);
  const rightCharRotateX = useTransform(smoothY, [-1, 1], [-3, 3]);

  // 5. PONTO DE LUZ CHIAROSCURO
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    rawMouseX.set(normX);
    rawMouseY.set(normY);

    setSpotlightPos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawMouseX.set(0);
    rawMouseY.set(0);
    setSpotlightPos({ x: 50, y: 50 });
  };

  // Suporte a Giroscópio móvel suave
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const clampedGamma = Math.max(-25, Math.min(25, e.gamma)) / 25;
        const clampedBeta = Math.max(-25, Math.min(25, e.beta - 45)) / 25;
        rawMouseX.set(clampedGamma);
        rawMouseY.set(clampedBeta);
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [rawMouseX, rawMouseY]);

  // Estilos de borda e sombra conforme o tema
  const themeBorder = {
    light: 'border-slate-300/80 shadow-[0_20px_60px_rgba(0,0,0,0.15)]',
    dark: 'border-amber-900/35 shadow-[0_25px_70px_rgba(0,0,0,0.7)]',
    amber: 'border-[#8C4A19]/35 shadow-[0_20px_60px_rgba(62,43,24,0.22)]',
  }[themeMode];

  return (
    <div className="relative px-1 sm:px-2 mb-8 select-none">
      {/* CONTAINER 3D COM PERSPECTIVA RENASCENTISTA (1200px) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full rounded-3xl overflow-hidden min-h-[520px] sm:min-h-[580px] md:min-h-[640px] lg:min-h-[700px] flex flex-col justify-between border bg-[#0C0806] transition-all duration-300 cursor-default ${themeBorder}`}
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ============================================================== */}
        {/* CAMADA 0: FUNDO (Pintura da Biblioteca Clássica) */}
        {/* ============================================================== */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{
              x: bgX,
              y: bgY,
              scale: bgScale,
            }}
            className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] will-change-transform"
          >
            <img
              src="/assets/hero/library_bg.jpg"
              alt="Pintura renascentista da biblioteca de Frank Moss Bennett"
              className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.12] sepia-[0.22]"
              loading="eager"
            />
          </motion.div>

          {/* Iluminação Chiaroscuro: Holofote sutil */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 mix-blend-soft-light"
            style={{
              background: `radial-gradient(circle 650px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(254, 240, 138, 0.45) 0%, rgba(217, 119, 6, 0.12) 45%, transparent 75%)`,
              opacity: isHovered ? 1 : 0.65,
            }}
          />

          {/* Vinheta gradiente atmosférica */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0806] via-[#0C0806]/35 to-[#0C0806]/60 pointer-events-none" />

          {/* Sombra de chão suave para integração das figuras */}
          <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-[#0C0806] via-[#0C0806]/80 to-transparent pointer-events-none z-10" />
        </div>

        {/* ============================================================== */}
        {/* CAMADA 1: BARRA SUPERIOR — ULTRA CLEAN */}
        {/* Removidos textos do canto superior esquerdo a pedido do usuário */}
        {/* Controles de tema e utilitários flutuando no canto superior direito */}
        {/* ============================================================== */}
        <header className="relative z-30 pt-5 sm:pt-6 px-4 sm:px-8 flex items-center justify-end">
          {/* Seletor de Tema em Cápsula de Vidro Minimalista + Dossiês */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1 p-1 rounded-full border border-white/20 bg-black/45 backdrop-blur-md shadow-xl"
              role="group"
              aria-label="Seletor de tema visual da biblioteca"
            >
              <button
                onClick={() => onToggleTheme('light')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-white text-stone-900 shadow-md font-bold'
                    : 'text-white/75 hover:text-white'
                }`}
                title="Modo Claro"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-sans">Claro</span>
              </button>

              <button
                onClick={() => onToggleTheme('dark')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-amber-400 text-stone-950 shadow-md font-bold'
                    : 'text-white/75 hover:text-white'
                }`}
                title="Modo Noturno / Escuro"
              >
                <Moon className="w-3.5 h-3.5 text-stone-900" />
                <span className="text-[11px] font-sans">Escuro</span>
              </button>

              <button
                onClick={() => onToggleTheme('amber')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  themeMode === 'amber'
                    ? 'bg-[#E5B675] text-[#3D200A] shadow-md font-bold'
                    : 'text-white/75 hover:text-white'
                }`}
                title="Modo Âmbar / Séphia (Leitura sem luz azul)"
              >
                <Flame className="w-3.5 h-3.5 text-[#8C3A0A]" />
                <span className="text-[11px] font-sans">Amarelado</span>
              </button>
            </div>

            {/* Dossiês dos Autores */}
            <button
              onClick={onOpenDossiers}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Dossiês biográficos dos escritores"
            >
              <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-sans hidden sm:inline">Dossiês</span>
            </button>

            <PWAInstallButton />
          </div>
        </header>

        {/* ============================================================== */}
        {/* CAMADA 2: TÍTULO MONUMENTAL ARTÍSTICO (z-10, Centro Expandido) */}
        {/* Visual ultra-limpo, monumental e cinematográfico */}
        {/* Os personagens nas pontas emolduram perfeitamente sem cobrir */}
        {/* ============================================================== */}
        <motion.div
          style={{
            x: titleX,
            y: titleY,
            rotateX: titleRotateX,
            rotateY: titleRotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative z-10 my-auto py-8 sm:py-12 px-4 sm:px-8 w-full max-w-4xl mx-auto will-change-transform pointer-events-none text-center"
        >
          {/* TÍTULO MONUMENTAL ARTÍSTICO */}
          <div className="select-none tracking-tight">
            <h1 className="leading-[0.88] drop-shadow-[0_15px_45px_rgba(0,0,0,0.95)]">
              <span className="block font-bodoni text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10.5rem] font-black uppercase text-white tracking-tight">
                Eterno
              </span>
              <span className="block font-cormorant italic text-7xl sm:text-8xl md:text-9xl lg:text-[10.5rem] xl:text-[12rem] font-light text-amber-100 tracking-normal -mt-2 sm:-mt-6 md:-mt-8 drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
                Retorno
              </span>
            </h1>
          </div>

          {/* Subtítulo Editorial Conciso */}
          <p className="font-cormorant italic text-lg sm:text-xl md:text-2xl text-amber-100/90 max-w-lg mx-auto leading-relaxed mt-3 sm:mt-5 drop-shadow-md">
            As grandes obras capitais da literatura mundial em leitura integral.
          </p>

          {/* Botões de Ação Centralizados */}
          <div className="pt-6 sm:pt-8 flex items-center justify-center gap-3.5 pointer-events-auto">
            <button
              onClick={onScrollToShelves}
              className="group px-7 sm:px-8 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-sans font-bold text-xs sm:text-sm tracking-wide shadow-[0_12px_28px_rgba(245,158,11,0.38)] hover:shadow-[0_14px_34px_rgba(245,158,11,0.52)] transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <span>Explorar Acervo</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenDossiers}
              className="px-6 sm:px-7 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-sans font-semibold text-xs sm:text-sm tracking-wide backdrop-blur-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Arquivo dos Autores</span>
            </button>
          </div>
        </motion.div>

        {/* ============================================================== */}
        {/* CAMADA 3: PERSONAGEM 1 — PONTA ESQUERDA (Machado de Assis) (z-20) */}
        {/* Ancorado na extremidade externa esquerda, sem avançar para o meio */}
        {/* Foto histórica autêntica com óculos pincenê, paletó clássico e livro */}
        {/* ============================================================== */}
        <motion.div
          style={{
            x: leftCharX,
            y: leftCharY,
            rotateY: leftCharRotateY,
            rotateX: leftCharRotateX,
            transformStyle: 'preserve-3d',
          }}
          className="absolute -bottom-2 sm:bottom-0 -left-6 sm:-left-3 md:-left-2 lg:left-0 xl:left-2 z-20 w-[170px] sm:w-[240px] md:w-[310px] lg:w-[380px] xl:w-[430px] pointer-events-none will-change-transform"
        >
          {/* Respiração sutil vertical in-place (sem deslocamento horizontal ao centro) */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="relative"
          >
            <img
              src="/assets/hero/character_left_machado.png"
              alt="Retrato histórico a óleo autêntico de Machado de Assis com pincenê e traje formal"
              className="w-full h-auto object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.92)] brightness-[0.98] contrast-[1.04]"
              loading="eager"
            />
          </motion.div>
        </motion.div>

        {/* ============================================================== */}
        {/* CAMADA 4: PERSONAGEM 2 — PONTA DIREITA (Fiódor Dostoiévski) (z-20) */}
        {/* Ancorado na extremidade externa direita, sem avançar para o meio */}
        {/* Recorte nítido com casaco de lã e postura contemplativa */}
        {/* ============================================================== */}
        <motion.div
          style={{
            x: rightCharX,
            y: rightCharY,
            rotateY: rightCharRotateY,
            rotateX: rightCharRotateX,
            transformStyle: 'preserve-3d',
          }}
          className="absolute -bottom-2 sm:bottom-0 -right-6 sm:-right-3 md:-right-2 lg:right-0 xl:right-2 z-20 w-[170px] sm:w-[240px] md:w-[310px] lg:w-[380px] xl:w-[430px] pointer-events-none will-change-transform"
        >
          {/* Respiração sutil dessincronizada */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ repeat: Infinity, duration: 6.8, ease: 'easeInOut', delay: 0.9 }}
            className="relative"
          >
            <img
              src="/assets/hero/character_right_dostoevsky.png"
              alt="Pintura a óleo histórica de Fiódor Dostoiévski por Vasily Perov"
              className="w-full h-auto object-contain filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.92)] brightness-[0.98] contrast-[1.04]"
              loading="eager"
            />
          </motion.div>
        </motion.div>

        {/* ============================================================== */}
        {/* RODAPÉ DO HERO: Totalmente limpo conforme pedido */}
        {/* (Removidos textos do canto inferior para máxima clareza visual) */}
        {/* Espaçador invisível para manter a altura harmoniosa */}
        {/* ============================================================== */}
        <div className="relative z-30 h-6 pointer-events-none" />
      </div>
    </div>
  );
};

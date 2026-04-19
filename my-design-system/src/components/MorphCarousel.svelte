<script lang="ts">
  import { onMount, tick } from "svelte";
  import { fly } from "svelte/transition";
  import { expoOut, backOut } from "svelte/easing";
  import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";
  import type { Project } from "../lib/mock-repository.svelte";

  export let projects: Project[] = [];
  let currentIndex = 0;
  let direction = 1;
  let isAnimating = false;
  let prefersReducedMotion = false;

  $: currentProject = projects[currentIndex] || null;

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let container: HTMLElement;
  let width = 0;
  let height = 0;

  const DURATION = 800; // ms

  interface GlyphState {
    char: string;
    x: number;
    y: number;
    font: string;
    color: string;
    targetX: number;
    targetY: number;
    opacity: number;
    targetOpacity: number;
    isMapped: boolean;
    vx: number;
    vy: number;
    mass: number;
  }

  let glyphs: GlyphState[] = [];
  let animationFrame: number;
  let cssVars = { accent: "#f43f5e", primary: "#ffffff", secondary: "#a1a1aa" };

  function next() {
    if (projects.length === 0 || isAnimating) return;
    direction = 1;
    currentIndex = (currentIndex + 1) % projects.length;
    if (!prefersReducedMotion) triggerMorph();
  }

  function prev() {
    if (projects.length === 0 || isAnimating) return;
    direction = -1;
    currentIndex = (currentIndex - 1 + projects.length) % projects.length;
    if (!prefersReducedMotion) triggerMorph();
  }

  function extractCSSVars() {
    if (typeof window !== "undefined") {
      const computed = getComputedStyle(document.body);
      cssVars = {
        accent:
          computed.getPropertyValue("--color-accent").trim() || cssVars.accent,
        primary:
          computed.getPropertyValue("--color-text-primary").trim() ||
          cssVars.primary,
        secondary:
          computed.getPropertyValue("--color-text-secondary").trim() ||
          cssVars.secondary,
      };
    }
  }

  // --- Svelte Transitions (Layer 0 Image) ---
  function slideIn(node: HTMLElement, { duration = DURATION }) {
    if (prefersReducedMotion)
      return { duration, css: (t: number) => `opacity: ${t};` };
    return {
      duration,
      css: (t: number) => {
        const easedU = expoOut(1 - t);
        if (direction === 1)
          return `transform: translateY(${easedU * -100}%); z-index: 2;`;
        return `transform: translateY(0%); z-index: 1;`;
      },
    };
  }

  function slideOut(node: HTMLElement, { duration = DURATION }) {
    if (prefersReducedMotion)
      return { duration, css: (t: number) => `opacity: ${t};` };
    return {
      duration,
      css: (t: number) => {
        const easedU = expoOut(1 - t);
        if (direction === 1) return `transform: translateY(0%); z-index: 1;`;
        return `transform: translateY(${easedU * -100}%); z-index: 2;`;
      },
    };
  }

  function fadeSlide(node: HTMLElement, { duration = DURATION }) {
    return {
      duration,
      css: (t: number) => {
        const easedT = expoOut(t);
        const yOffset = direction === 1 ? 10 : -10;
        return `opacity: ${easedT}; transform: translateY(${(1 - easedT) * yOffset}px);`;
      },
    };
  }

  // --- Layer 2: Pretext Logic Layer ---
  function computeLayout(project: Project) {
    if (!ctx || !container) return [];
    
    const containerRect = container.getBoundingClientRect();
    let newGlyphs: Omit<GlyphState, 'targetX'|'targetY'|'opacity'|'targetOpacity'|'isMapped'|'vx'|'vy'|'mass'>[] = [];

    // Align with typical design system variables
    const fonts = {
      type: { font: 'bold 14px "Inter", sans-serif', lh: 1.2 },
      title: { font: 'bold 32px "Inter", sans-serif', lh: 1.25 },
      desc: { font: '400 18px "Inter", sans-serif', lh: 1.625 }
    };

    function processText(text: string, fontSpec: {font: string, lh: number}, color: string, selector: string, uppercase = false) {
      if (!text) return;
      
      const el = container.querySelector(selector);
      if (!el) return;
      
      const rect = el.getBoundingClientRect();
      const startX = rect.left - containerRect.left;
      const startY = rect.top - containerRect.top;
      const textWidth = rect.width;
      
      const processedText = uppercase ? text.toUpperCase() : text;
      const prepared = prepareWithSegments(processedText, fontSpec.font);
      const fontSize = parseInt(fontSpec.font.match(/\d+px/)?.[0] || '16', 10);
      const lineHeight = fontSize * fontSpec.lh;
      const { lines } = layoutWithLines(prepared, textWidth, lineHeight);

      // In CSS, text is vertically centered within its line-height.
      // So the distance from top of the line-box to the baseline is:
      // (lineHeight - fontSize) / 2 + fontSize
      const baselineOffset = (lineHeight - fontSize) / 2 + fontSize;

      let lineY = startY;
      for (const line of lines) {
        let charX = startX;
        for (let i = 0; i < line.text.length; i++) {
          const char = line.text[i];
          ctx!.font = fontSpec.font;
          const charWidth = ctx!.measureText(char).width;
          if (char.trim() !== '') {
            newGlyphs.push({ char, x: charX, y: lineY + baselineOffset, font: fontSpec.font, color });
          }
          charX += charWidth;
        }
        lineY += lineHeight;
      }
    }

    processText(project.type, fonts.type, cssVars.accent, '.slide-type', true);
    processText(project.title, fonts.title, cssVars.primary, '.slide-title');
    processText(project.desc, fonts.desc, cssVars.secondary, '.slide-desc');

    return newGlyphs;
  }

  // --- Morphing Engine ---
  async function triggerMorph() {
    isAnimating = true;
    
    // Wait for Svelte to update the Semantic DOM so we can measure the NEW layout's bounding boxes
    await tick();
    
    const newLayout = computeLayout(projects[currentIndex]);

    const oldGlyphs = [...glyphs];
    glyphs = [];

    const maxLength = Math.max(oldGlyphs.length, newLayout.length);
    for (let i = 0; i < maxLength; i++) {
      const oldG = oldGlyphs[i];
      const newG = newLayout[i];

      if (oldG && newG) {
        glyphs.push({
          ...oldG,
          targetX: newG.x,
          targetY: newG.y,
          targetOpacity: 1,
          font: newG.font,
          color: newG.color,
          char: newG.char,
          isMapped: true,
        });
      } else if (oldG && !newG) {
        glyphs.push({
          ...oldG,
          targetX: oldG.x,
          targetY: oldG.y,
          targetOpacity: 0,
          isMapped: false,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 5 + 2,
          mass: Math.random() * 0.5 + 0.5,
        });
      } else if (!oldG && newG) {
        glyphs.push({
          char: newG.char,
          x: newG.x,
          y: newG.y - 10,
          targetX: newG.x,
          targetY: newG.y,
          font: newG.font,
          color: newG.color,
          opacity: 0,
          targetOpacity: 1,
          isMapped: true,
          vx: 0,
          vy: 0,
          mass: 1,
        });
      }
    }

    let start = performance.now();
    function renderFrame(time: number) {
      const elapsed = time - start;
      const t = Math.min(elapsed / DURATION, 1);

      ctx!.clearRect(0, 0, width, height);

      for (let i = glyphs.length - 1; i >= 0; i--) {
        const g = glyphs[i];

        if (g.isMapped) {
          g.x = g.x + (g.targetX - g.x) * 0.15;
          g.y = g.y + (g.targetY - g.y) * 0.15;
          g.opacity = g.opacity + (g.targetOpacity - g.opacity) * 0.1;
        } else {
          g.x += g.vx;
          g.y += g.vy;
          g.vy += 0.25 * g.mass;
          g.opacity = Math.max(0, g.opacity - 0.05);
        }

        ctx!.globalAlpha = Math.max(0, g.opacity);
        ctx!.fillStyle = g.color;
        ctx!.font = g.font;
        ctx!.fillText(g.char, g.x, g.y);

        if (t === 1 && !g.isMapped && g.opacity <= 0.05) {
          glyphs.splice(i, 1);
        }
      }

      ctx!.globalAlpha = 1;

      if (t < 1 || glyphs.some((g) => !g.isMapped && g.opacity > 0)) {
        animationFrame = requestAnimationFrame(renderFrame);
      } else {
        isAnimating = false;
        glyphs.forEach((g) => {
          if (g.isMapped) {
            g.x = g.targetX;
            g.y = g.targetY;
            g.opacity = 1;
          }
        });
        drawStaticCanvas();
      }
    }

    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(renderFrame);
  }

  function drawStaticCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (const g of glyphs) {
      if (g.isMapped && g.opacity > 0) {
        ctx.globalAlpha = g.opacity;
        ctx.fillStyle = g.color;
        ctx.font = g.font;
        ctx.fillText(g.char, g.x, g.y);
      }
    }
    ctx.globalAlpha = 1;
  }

  onMount(() => {
    prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    extractCSSVars();

    const ro = new ResizeObserver(() => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.textBaseline = "bottom";
      }

      if (projects.length > 0) {
        const layout = computeLayout(projects[currentIndex]);
        glyphs = layout.map((l) => ({
          ...l,
          targetX: l.x,
          targetY: l.y,
          opacity: 1,
          targetOpacity: 1,
          isMapped: true,
          vx: 0,
          vy: 0,
          mass: 1,
        }));
        if (!prefersReducedMotion) drawStaticCanvas();
      }
    });

    document.fonts.ready.then(() => {
      if (container) ro.observe(container);
    });

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  });
</script>

<section id="work" class="split-carousel" aria-labelledby="carousel-heading">
  <div class="carousel-header">
    <div class="carousel-header-text">
      <h2 id="carousel-heading" class="carousel-title">Selected Work</h2>
      <p class="carousel-subtitle">
        A collection of my recent projects, demonstrating expertise in frontend
        engineering, UI design, and full-stack development.
      </p>
    </div>
    <div class="carousel-nav">
      <button class="nav-btn" on:click={prev} aria-label="Previous project">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          ><path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg
        >
      </button>
      <button class="nav-btn" on:click={next} aria-label="Next project">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          ><path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          /></svg
        >
      </button>
    </div>
  </div>

  <!-- Graceful Degradation: No-JS Fallback -->
  <noscript>
    <div class="no-js-fallback">
      {#each projects as p}
        <article class="mb-8 border-b pb-4">
          <h3 class="text-xl font-bold">{p.title}</h3>
          <p>{p.desc}</p>
          <img src={p.image} alt="" class="max-w-full h-auto mt-4" />
        </article>
      {/each}
    </div>
  </noscript>

  {#if currentProject}
    <div class="carousel-content">
      <!-- 1. The Image Viewport (Animated) -->
      <div class="image-viewport">
        {#key currentIndex}
          <div
            class="image-layer will-change-transform"
            in:slideIn
            out:slideOut
          >
            <img
              src={currentProject.image}
              alt={currentProject.imageAlt || currentProject.title}
              class="slide-image"
            />
          </div>
        {/key}
      </div>

      <!-- 2. The Text Viewport (Tri-Layer Canvas Setup) -->
      <div class="text-viewport">
        <!-- Wrapper div that fills the padded space with no borders/padding -->
        <div class="content-wrapper" bind:this={container}>
          
          <!-- Layer 1: Semantic DOM (A11y/SEO) -->
          <article class="layer-1-semantic" aria-hidden={prefersReducedMotion ? "true" : "false"}>
            <div class="slide-meta" style:opacity={prefersReducedMotion ? 1 : 0}>
              <span class="slide-type">{currentProject.type}</span>
              <h3 class="slide-title">{currentProject.title}</h3>
            </div>

            <p class="slide-desc" style:opacity={prefersReducedMotion ? 1 : 0}>
              {currentProject.desc}
            </p>

            <!-- Tags are fully DOM-rendered so they maintain CSS styling/backgrounds -->
            <!-- Odometer/Cassette animation for tags -->
            <div class="slide-tags mt-auto">
              {#each currentProject.tags as tag, i (i)}
                <div class="pill-slot">
                  {#key currentIndex + "-" + tag}
                    <span
                      class="slide-tag"
                      in:fly={{ y: -20, duration: 400, delay: (i * 50) + 100, easing: backOut }}
                      out:fly={{ y: 20, duration: 300, delay: i >= currentProject.tags.length ? 0 : (i * 50), easing: backOut }}
                    >
                      {tag}
                    </span>
                  {/key}
                </div>
              {/each}
            </div>
          </article>

          <!-- Layer 2: Render Layer (Canvas) -->
          <canvas
            bind:this={canvas}
            class="layer-2-render"
            style:opacity={prefersReducedMotion ? 0 : 1}
            aria-hidden="true"
          ></canvas>
        </div>
      </div>
    </div>
  {/if}
</section>

<style>
  /* ── Base Layout ── */
  .split-carousel {
    display: flex;
    flex-direction: column;
    gap: var(--space-10);
    width: 100%;
    max-width: 1096px;
    margin-inline: auto;
    position: relative;
    z-index: var(--z-base);
  }

  /* ── Header ── */
  .carousel-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    position: relative;
  }

  @media (min-width: 768px) {
    .carousel-header {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }

  .carousel-header-text {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .carousel-title {
    font-family: var(--font-ui);
    font-size: var(--text-4xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-heading);
    letter-spacing: var(--tracking-heading);
    color: var(--color-text-primary);
    margin: 0;
  }

  .carousel-subtitle {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-text-secondary);
    margin: 0;
    max-width: 600px;
  }

  /* ── Navigation ── */
  .carousel-nav {
    display: flex;
    gap: var(--space-3);
  }

  .nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: var(--radius-full);
    background-color: var(--color-bg-overlay);
    border: var(--border-thin) solid var(--color-border);
    color: var(--color-text-primary);
    cursor: pointer;
    transition: var(--transition-all);
    backdrop-filter: blur(8px);
  }

  .nav-btn:hover {
    background-color: var(--color-bg-elevated);
    border-color: var(--color-accent);
    color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
  }

  .nav-btn:active {
    transform: translateY(0) scale(0.95);
  }

  /* ── Split Content Container ── */
  .carousel-content {
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg-surface);
    border: var(--border-thin) solid var(--color-border-subtle);
    border-radius: var(--radius-2xl);
    overflow: hidden;
    box-shadow: var(--shadow-card);
    position: relative;
  }

  @media (min-width: 1024px) {
    .carousel-content {
      flex-direction: row;
      align-items: stretch;
    }
  }

  /* ── Image Viewport ── */
  .image-viewport {
    position: relative;
    width: 100%;
    min-height: 300px;
    overflow: hidden;
    background-color: var(--color-bg-base);
  }

  @media (min-width: 1024px) {
    .image-viewport {
      flex: 1 1 55%;
      min-height: 520px;
      border-right: var(--border-thin) solid var(--color-border-subtle);
    }
  }

  .image-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.02);
  }

  /* ── Text Viewport ── */
  .text-viewport {
    flex: 1 1 45%;
    display: flex;
    flex-direction: column;
    padding: var(--space-8);
    background-color: var(--color-bg-surface);
    min-height: 400px;
  }

  @media (min-width: 1024px) {
    .text-viewport {
      padding: var(--space-10);
      min-height: 520px;
    }
  }

  .content-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .layer-1-semantic {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-6);
    flex-grow: 1;
  }

  .layer-2-render {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
  }

  .slide-meta {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    transition: opacity 0.3s ease;
  }

  .slide-type {
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-label);
    text-transform: uppercase;
    color: var(--color-accent);
  }

  .slide-title {
    font-family: var(--font-ui);
    font-size: var(--text-3xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    color: var(--color-text-primary);
    margin: 0;
  }

  .slide-desc {
    font-family: var(--font-body);
    font-size: var(--text-lg);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin: 0;
    transition: opacity 0.3s ease;
  }

  .slide-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  /* ── Pill Slot (CSS Grid Stacking Mask) ── */
  .pill-slot {
    display: grid;
    overflow: hidden;
    border-radius: var(--radius-full);
  }

  .slide-tag {
    grid-column: 1;
    grid-row: 1;
    display: inline-flex;
    align-items: center;
    padding: var(--space-2) var(--space-4);
    background-color: var(--color-bg-base);
    border: var(--border-thin) solid var(--color-border);
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-text-primary);
    white-space: nowrap;
  }
</style>

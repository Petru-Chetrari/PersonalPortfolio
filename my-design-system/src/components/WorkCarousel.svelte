<script lang="ts">
  import type { Project } from '../lib/mock-repository.svelte';
  import { fly } from 'svelte/transition';

  export let projects: Project[] = [];

  let currentIndex = 0;

  function next() {
    if (projects.length > 0) {
      currentIndex = (currentIndex + 1) % projects.length;
    }
  }

  function prev() {
    if (projects.length > 0) {
      currentIndex = (currentIndex - 1 + projects.length) % projects.length;
    }
  }

  // Custom out transition to keep the outgoing slide visible and stationary
  // while the incoming slide flies over it from the top.
  function stay(node: HTMLElement, { duration = 600 }) {
    return {
      duration,
      css: () => `opacity: 1;`
    };
  }
</script>

<section id="work" class="carousel-section" aria-labelledby="carousel-heading">
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="nav-btn" on:click={next} aria-label="Next project">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>

  <div class="split-carousel">
    {#if projects.length > 0}
      <!-- Image Viewport (Animated) -->
      <div class="image-viewport">
        {#key currentIndex}
          <div 
            class="image-layer"
            in:fly={{ y: '-100%', duration: 600 }}
            out:stay={{ duration: 600 }}
          >
            <img 
              src={projects[currentIndex].image} 
              alt={projects[currentIndex].imageAlt} 
              class="slide-image" 
            />
          </div>
        {/key}
      </div>

      <!-- Text Viewport (Static) -->
      <div class="text-viewport">
        <div class="slide-meta">
          <span class="slide-type">{projects[currentIndex].type}</span>
          <h3 class="slide-title">{projects[currentIndex].title}</h3>
        </div>
        <p class="slide-desc">{projects[currentIndex].desc}</p>
        <div class="slide-tags">
          {#each projects[currentIndex].tags as tag}
            <span class="slide-tag">{tag}</span>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  .carousel-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-10);
    width: 100%;
    max-width: 1096px;
    margin-inline: auto;
    position: relative;
    z-index: var(--z-base);
  }

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

  /* ── Split Layout Container ── */
  .split-carousel {
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg-surface);
    border: var(--border-thin) solid var(--color-border-subtle);
    border-radius: var(--radius-2xl);
    overflow: hidden;
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
  }

  @media (min-width: 1024px) {
    .split-carousel {
      flex-direction: row;
      align-items: stretch;
    }
  }

  .split-carousel:hover {
    border-color: rgba(51, 65, 85, 0.8);
    box-shadow: var(--shadow-hover);
  }

  /* ── Image Viewport ── */
  .image-viewport {
    flex: 1;
    position: relative;
    background-color: var(--color-bg-base);
    min-height: 300px;
    overflow: hidden; /* Mask for the flying transition */
    border-bottom: var(--border-thin) solid var(--color-border-subtle);
  }

  @media (min-width: 1024px) {
    .image-viewport {
      min-height: 440px;
      border-bottom: none;
      border-right: var(--border-thin) solid var(--color-border-subtle);
    }
  }

  .image-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-bg-base);
    /* By default, the newer DOM element stacks on top. 
       This works perfectly with Svelte's {#key} transition. */
  }

  .slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* ── Text Viewport ── */
  .text-viewport {
    flex: 1;
    padding: var(--space-8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-5);
  }

  .slide-meta {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
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
  }

  .slide-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: var(--space-2);
  }

  .slide-tag {
    display: inline-flex;
    align-items: center;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    background-color: var(--color-bg-base);
    border: var(--border-thin) solid var(--color-border);
    font-family: var(--font-ui);
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    color: var(--color-text-primary);
    white-space: nowrap;
    transition: var(--transition-colors);
  }

  .text-viewport:hover .slide-tag {
    /* Optional interaction logic scoped to the text hover */
    background-color: var(--color-accent-glow);
    border-color: var(--color-accent-glow-border);
    color: var(--color-accent);
  }
</style>

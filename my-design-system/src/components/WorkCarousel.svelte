<script lang="ts">
  import type { Project } from '../lib/mock-repository.svelte';
  import { fly } from 'svelte/transition';

  export let projects: Project[] = [];

  let currentIndex = 0;

  // Derive the currently active project
  $: currentProject = projects[currentIndex] || null;

  function next() {
    if (projects.length === 0) return;
    currentIndex = (currentIndex + 1) % projects.length;
  }

  function prev() {
    if (projects.length === 0) return;
    currentIndex = (currentIndex - 1 + projects.length) % projects.length;
  }
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="nav-btn" on:click={next} aria-label="Next project">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </div>

  {#if currentProject}
    <div class="carousel-content">
      
      <!-- 1. The Image Viewport (Animated) -->
      <div class="image-viewport">
        {#key currentIndex}
          <!-- 
            in:fly slides in from the top (-100%) without fading (opacity: 1).
            out:fly keeps the old image exactly in place (y: 0) without fading, 
            so the incoming image seamlessly covers it.
          -->
          <div 
            class="image-layer"
            in:fly={{ y: '-100%', duration: 600, opacity: 1 }}
            out:fly={{ y: '0%', duration: 600, opacity: 1 }}
          >
            <img 
              src={currentProject.image} 
              alt={currentProject.imageAlt} 
              class="slide-image" 
            />
          </div>
        {/key}
      </div>

      <!-- 2. The Text Viewport (Static Swap) -->
      <div class="text-viewport">
        <div class="slide-meta">
          <span class="slide-type">{currentProject.type}</span>
          <h3 class="slide-title">{currentProject.title}</h3>
        </div>
        
        <p class="slide-desc">{currentProject.desc}</p>
        
        <div class="slide-tags">
          {#each currentProject.tags as tag}
            <span class="slide-tag">{tag}</span>
          {/each}
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
    overflow: hidden; /* Strict mask to prevent sliding image from escaping */
    background-color: var(--color-bg-base);
  }

  @media (min-width: 1024px) {
    .image-viewport {
      flex: 1 1 55%;
      min-height: 520px;
      border-right: var(--border-thin) solid var(--color-border-subtle);
    }
  }

  /* Holds individual image, positioned absolute to stack incoming/outgoing */
  .image-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  /* Natural DOM order: newer element is appended last, so it has higher z-index automatically */

  .slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Optional: add a tiny scale to give it some life before/after sliding */
    transform: scale(1.02);
  }

  /* ── Text Viewport (Static) ── */
  .text-viewport {
    flex: 1 1 45%;
    padding: var(--space-8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-6);
    background-color: var(--color-bg-surface);
  }

  @media (min-width: 1024px) {
    .text-viewport {
      padding: var(--space-10);
    }
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
  }
</style>

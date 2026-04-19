<script lang="ts">
  import type { Project } from "../lib/mock-repository.svelte";

  export let projects: Project[] = [];

  let carouselTrack: HTMLElement;

  function scrollPrev() {
    if (carouselTrack) {
      // Calculate scroll amount based on the width of a single slide + gap
      const slide = carouselTrack.firstElementChild as HTMLElement;
      const scrollAmount = slide
        ? slide.offsetWidth + 24
        : carouselTrack.clientWidth; // 24px is var(--space-6)
      carouselTrack.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  }

  function scrollNext() {
    if (carouselTrack) {
      const slide = carouselTrack.firstElementChild as HTMLElement;
      const scrollAmount = slide
        ? slide.offsetWidth + 24
        : carouselTrack.clientWidth;
      carouselTrack.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
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
      <button
        class="nav-btn"
        on:click={scrollPrev}
        aria-label="Previous project"
      >
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
      <button class="nav-btn" on:click={scrollNext} aria-label="Next project">
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

  <div class="carousel-track-wrapper">
    <div class="carousel-track" bind:this={carouselTrack}></div>
  </div>
</section>
{#each projects as project}
  <article class="carousel-slide">
    <div class="slide-image-wrapper">
      <img
        src={project.image}
        alt={project.imageAlt}
        class="slide-image"
        loading="lazy"
      />
    </div>
    <div class="slide-content">
      <div class="slide-meta">
        <span class="slide-type">{project.type}</span>
        <h3 class="slide-title">{project.title}</h3>
      </div>
      <p class="slide-desc">{project.desc}</p>
      <div class="slide-tags">
        {#each project.tags as tag}
          <span class="slide-tag">{tag}</span>
        {/each}
      </div>
    </div>
  </article>
{/each}

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

  .carousel-track-wrapper {
    width: 100%;
  }

  .carousel-track {
    display: flex;
    gap: var(--space-6);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    padding-bottom: var(--space-6); /* Room for focus rings / shadows */

    /* Hide scrollbar but keep functionality */
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .carousel-track::-webkit-scrollbar {
    display: none;
  }

  .carousel-slide {
    flex: 0 0 100%;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg-surface);
    border: var(--border-thin) solid var(--color-border-subtle);
    border-radius: var(--radius-2xl);
    overflow: hidden;
    transition: var(--transition-all);
  }

  @media (min-width: 1024px) {
    .carousel-slide {
      /* Show 1 full slide + peek at the next one */
      flex: 0 0 calc(85% - var(--space-6));
      flex-direction: row;
      align-items: stretch;
    }
  }

  .carousel-slide:hover {
    border-color: rgba(51, 65, 85, 0.8);
    box-shadow: var(--shadow-hover);
    transform: translateY(-4px);
  }

  .slide-image-wrapper {
    flex: 1;
    background-color: var(--color-bg-base);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    min-height: 280px;
    border-bottom: var(--border-thin) solid var(--color-border-subtle);
  }

  @media (min-width: 1024px) {
    .slide-image-wrapper {
      min-height: 440px;
      border-bottom: none;
      border-right: var(--border-thin) solid var(--color-border-subtle);
    }
  }

  .slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .carousel-slide:hover .slide-image {
    transform: scale(1.05);
  }

  .slide-content {
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

  .carousel-slide:hover .slide-tag {
    background-color: var(--color-accent-glow);
    border-color: var(--color-accent-glow-border);
    color: var(--color-accent);
  }
</style>

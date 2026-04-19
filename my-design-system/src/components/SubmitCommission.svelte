<script lang="ts">
  import { MockRepository } from '../lib/mock-repository.svelte';

  // ── Figma icon SVG assets (served by Figma Dev Mode MCP) ──────────────────
  const iconWebDev    = 'http://localhost:3845/assets/88ab1aac2a27e00812e5066a1b4bcdda7bd89d4d.svg';
  const iconLanding   = 'http://localhost:3845/assets/c5434a8fedde3ce807fa43e76ae5bcdb59d46cd8.svg';
  const iconUIUX      = 'http://localhost:3845/assets/77b50419a5342b06c3f43d58e22d85d4bde5dcf1.svg';
  const imgSendIcon   = 'http://localhost:3845/assets/60c8de9f1a6d2fc7a4c52b28e4baf6970bac7d57.svg';

  // ── Services list (left column) ───────────────────────────────────────────
  const services = [
    {
      icon: iconWebDev,
      title: 'Web Development',
      desc: 'Full-stack web applications tailored to your business needs.',
    },
    {
      icon: iconLanding,
      title: 'Landing Pages',
      desc: 'High-converting landing pages built with modern tools.',
    },
    {
      icon: iconUIUX,
      title: 'UI/UX Design',
      desc: 'Intuitive user interfaces that enhance user experience.',
    },
  ];

  // ── Commission type options (from mock-repository) ─────────────────────────
  const projectTypes = ['Web App', 'Mobile App', 'Landing Page', 'E-commerce', 'Brand Identity', 'Other'];

  // ── Form state ────────────────────────────────────────────────────────────
  let email       = $state('');
  let name        = $state('');
  let budget      = $state('');
  let projectType = $state('');
  let details     = $state('');

  // ── Validation errors ─────────────────────────────────────────────────────
  let errors = $state({
    email: '',
    name: '',
    projectType: '',
    details: '',
  });

  // ── UI state ──────────────────────────────────────────────────────────────
  let submitted  = $state(false);
  let submitting = $state(false);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e = { email: '', name: '', projectType: '', details: '' };
    let ok = true;

    if (!email.trim()) {
      e.email = 'Email is required.';
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = 'Please enter a valid email address.';
      ok = false;
    }
    if (!name.trim()) {
      e.name = 'Name is required.';
      ok = false;
    }
    if (!projectType) {
      e.projectType = 'Please select a project type.';
      ok = false;
    }
    if (!details.trim()) {
      e.details = 'Project details are required.';
      ok = false;
    }

    errors = e;
    return ok;
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!validate()) return;

    submitting = true;

    // Simulate async processing
    await new Promise(r => setTimeout(r, 600));

    // Build a commission title from name + project type
    const title = `${name.trim()}'s ${projectType} Project`;

    const payload = {
      client: name.trim(),
      title,
      appType: projectType,
      shortDesc: `Commission from ${email.trim()}`,
      longDesc: details.trim(),
      budget: budget ? `$${budget}` : undefined,
    };

    const result = MockRepository.addCommission(payload);
    console.log('[SubmitCommission] Commission added to MockRepository:', result);

    submitting = false;
    submitted  = true;
  }

  function resetForm() {
    email       = '';
    name        = '';
    budget      = '';
    projectType = '';
    details     = '';
    errors      = { email: '', name: '', projectType: '', details: '' };
    submitted   = false;
  }

  // Active input tracking for focus ring
  let focused = $state('');
</script>

<!-- ══════════════════════════════════════════════════════════════ -->
<!--  Page content: matches Figma "CommissionRequest" container    -->
<!-- ══════════════════════════════════════════════════════════════ -->
<div class="sc-root">

  <!-- ── Top section: heading + subtitle ─────────────────────────── -->
  <div class="sc-header">
    <h1 class="sc-heading">
      Let's build something <span class="sc-heading-accent">great</span> together.
    </h1>
    <p class="sc-subtitle">
      Fill out the form below to request a commission. Provide as much detail as
      possible so I can understand your vision and provide an accurate estimate.
    </p>
  </div>

  <!-- ── Bottom section: services list + form card ───────────────── -->
  <div class="sc-body">

    <!-- Left: Services Offered -->
    <div class="sc-services">
      <h2 class="sc-services-title">Services Offered</h2>
      <ul class="sc-services-list">
        {#each services as { icon, title, desc }}
          <li class="sc-service-item">
            <div class="sc-service-icon-wrap" aria-hidden="true">
              <img src={icon} alt="" width="20" height="20" class="sc-service-icon" />
            </div>
            <div class="sc-service-copy">
              <span class="sc-service-name">{title}</span>
              <span class="sc-service-desc">{desc}</span>
            </div>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Right: Form card -->
    <div class="sc-card">

      {#if submitted}
        <!-- ── Success state ──────────────────────────────────────── -->
        <div class="sc-success">
          <div class="sc-success-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" stroke="#00BC7D" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="sc-success-copy">
            <h3 class="sc-success-heading">Request Submitted!</h3>
            <p class="sc-success-sub">
              Thank you, {name || 'there'}! I'll review your request and get back to you within 2 business days.
            </p>
          </div>
          <button class="sc-btn-secondary" onclick={resetForm}>
            Submit another request
          </button>
        </div>

      {:else}
        <!-- ── Form ───────────────────────────────────────────────── -->
        <form class="sc-form" novalidate onsubmit={handleSubmit}>

          <!-- Row 1: Email + Name -->
          <div class="sc-field-group">
            <!-- Email -->
            <div class="sc-field">
              <label class="sc-label" for="sc-email">
                Email <span class="sc-required">*</span>
              </label>
              <input
                id="sc-email"
                type="email"
                placeholder="john@example.com"
                class="sc-input"
                class:sc-input--error={!!errors.email}
                class:sc-input--focused={focused === 'email'}
                bind:value={email}
                onfocus={() => focused = 'email'}
                onblur={() => focused = ''}
                autocomplete="email"
              />
              {#if errors.email}
                <span class="sc-error-msg">{errors.email}</span>
              {/if}
            </div>

            <!-- Name -->
            <div class="sc-field">
              <label class="sc-label" for="sc-name">
                Name <span class="sc-required">*</span>
              </label>
              <input
                id="sc-name"
                type="text"
                placeholder="John Doe"
                class="sc-input"
                class:sc-input--error={!!errors.name}
                class:sc-input--focused={focused === 'name'}
                bind:value={name}
                onfocus={() => focused = 'name'}
                onblur={() => focused = ''}
                autocomplete="name"
              />
              {#if errors.name}
                <span class="sc-error-msg">{errors.name}</span>
              {/if}
            </div>
          </div>

          <!-- Row 2: Estimated Budget + Project Type -->
          <div class="sc-field-group">
            <!-- Estimated Budget -->
            <div class="sc-field">
              <label class="sc-label" for="sc-budget">Estimated Budget</label>
              <div class="sc-input-wrap">
                <span class="sc-currency">$</span>
                <input
                  id="sc-budget"
                  type="number"
                  min="0"
                  placeholder="2500"
                  class="sc-input sc-input--prefixed"
                  class:sc-input--focused={focused === 'budget'}
                  bind:value={budget}
                  onfocus={() => focused = 'budget'}
                  onblur={() => focused = ''}
                />
              </div>
            </div>

            <!-- Project Type -->
            <div class="sc-field">
              <label class="sc-label" for="sc-type">
                Project Type <span class="sc-required">*</span>
              </label>
              <div class="sc-select-wrap">
                <select
                  id="sc-type"
                  class="sc-select"
                  class:sc-select--error={!!errors.projectType}
                  class:sc-select--focused={focused === 'type'}
                  bind:value={projectType}
                  onfocus={() => focused = 'type'}
                  onblur={() => focused = ''}
                >
                  <option value="" disabled selected>Select a type…</option>
                  {#each projectTypes as t}
                    <option value={t}>{t}</option>
                  {/each}
                </select>
                <svg class="sc-select-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              {#if errors.projectType}
                <span class="sc-error-msg">{errors.projectType}</span>
              {/if}
            </div>
          </div>

          <!-- Row 3: Project Details (full-width) -->
          <div class="sc-field sc-field--full">
            <label class="sc-label" for="sc-details">
              Project Details <span class="sc-required">*</span>
            </label>
            <textarea
              id="sc-details"
              rows="6"
              placeholder="Tell me about your project, timeline, and any specific requirements..."
              class="sc-textarea"
              class:sc-textarea--error={!!errors.details}
              class:sc-textarea--focused={focused === 'details'}
              bind:value={details}
              onfocus={() => focused = 'details'}
              onblur={() => focused = ''}
            ></textarea>
            {#if errors.details}
              <span class="sc-error-msg">{errors.details}</span>
            {/if}
          </div>

          <!-- Submit button (full-width) -->
          <button
            type="submit"
            class="sc-btn-primary"
            disabled={submitting}
            id="sc-submit-btn"
          >
            {#if submitting}
              <svg class="sc-spinner" viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="2.5"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
              Submitting…
            {:else}
              <img src={imgSendIcon} alt="" width="20" height="20" aria-hidden="true" />
              Submit Request
            {/if}
          </button>

        </form>
      {/if}

    </div>
  </div>
</div>

<style>
  /* ── Root container ──────────────────────────────────────────────── */
  .sc-root {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 64px;
    width: 100%;
    max-width: 898px;
    margin-inline: auto;
    padding-top: 48px;
    padding-inline: 24px;
    box-sizing: border-box;
  }

  /* ── Top: heading + subtitle ─────────────────────────────────────── */
  .sc-header {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    text-align: center;
  }

  .sc-heading {
    font-family: 'Segoe UI', sans-serif;
    font-size: 48px;
    font-weight: 700;
    line-height: 48px;
    letter-spacing: -1.2px;
    color: #f8fafc;
    margin: 0;
    white-space: nowrap;
  }

  .sc-heading-accent {
    color: #3b82f6;
  }

  .sc-subtitle {
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 24px;
    color: #94a3b8;
    max-width: 645px;
    margin: 0;
  }

  /* ── Bottom: two-column layout ───────────────────────────────────── */
  .sc-body {
    display: flex;
    gap: 50px;
    align-items: flex-start;
    width: 100%;
  }

  /* ── Left: Services Offered ──────────────────────────────────────── */
  .sc-services {
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex-shrink: 0;
    width: 250.663px;
    align-self: stretch;
  }

  .sc-services-title {
    font-family: 'Segoe UI', sans-serif;
    font-size: 20px;
    font-weight: 700;
    line-height: 28px;
    color: #f8fafc;
    margin: 0;
    white-space: nowrap;
  }

  .sc-services-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .sc-service-item {
    position: relative;
    display: flex;
    gap: 0;
    align-items: flex-start;
    min-height: 68px;
  }

  .sc-service-icon-wrap {
    position: relative;
    width: 44px;
    height: 44px;
    background-color: #1e293b;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 4px;
  }

  .sc-service-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  .sc-service-copy {
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sc-service-name {
    font-family: 'Segoe UI', sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #f8fafc;
    white-space: nowrap;
  }

  .sc-service-desc {
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 14px;
    line-height: 20px;
    color: #94a3b8;
    max-width: 166px;
  }

  /* ── Right: Form card ────────────────────────────────────────────── */
  .sc-card {
    background-color: #1e293b;
    border: 0.8px solid #334155;
    border-radius: 24px;
    box-shadow:
      0px 20px 25px 0px rgba(0, 0, 0, 0.5),
      0px 8px 10px 0px rgba(0, 0, 0, 0.5);
    padding: 32.8px;
    padding-bottom: 32px;
    flex: 1;
    min-width: 0;
    box-sizing: border-box;
  }

  /* ── Form grid ───────────────────────────────────────────────────── */
  .sc-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* Two-column row */
  .sc-field-group {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .sc-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sc-field--full {
    grid-column: 1 / -1;
  }

  /* ── Label ───────────────────────────────────────────────────────── */
  .sc-label {
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #94a3b8;
  }

  .sc-required {
    color: #ef4444;
    margin-left: 2px;
  }

  /* ── Input ───────────────────────────────────────────────────────── */
  .sc-input {
    width: 100%;
    height: 49.6px;
    background-color: #0f172a;
    border: 0.8px solid #334155;
    border-radius: 14px;
    padding: 12px 16px;
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: normal;
    color: #f8fafc;
    outline: none;
    transition: border-color 0.15s ease;
    box-sizing: border-box;
  }
  .sc-input::placeholder { color: #64748b; }
  .sc-input:focus,
  .sc-input--focused    { border-color: #3b82f6; }
  .sc-input--error      { border-color: #ef4444 !important; }

  /* Input with currency prefix */
  .sc-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .sc-currency {
    position: absolute;
    left: 16px;
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 16px;
    color: #64748b;
    pointer-events: none;
    z-index: 1;
  }

  .sc-input--prefixed {
    padding-left: 28px;
  }

  /* ── Select ──────────────────────────────────────────────────────── */
  .sc-select-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .sc-select {
    width: 100%;
    height: 49.6px;
    appearance: none;
    background-color: #0f172a;
    border: 0.8px solid #334155;
    border-radius: 14px;
    padding: 12px 40px 12px 16px;
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 16px;
    color: #f8fafc;
    outline: none;
    cursor: pointer;
    transition: border-color 0.15s ease;
    box-sizing: border-box;
  }
  .sc-select:focus,
  .sc-select--focused { border-color: #3b82f6; }
  .sc-select--error   { border-color: #ef4444 !important; }
  .sc-select option   { background-color: #1e293b; color: #f8fafc; }

  .sc-select-arrow {
    position: absolute;
    right: 14px;
    pointer-events: none;
  }

  /* ── Textarea ────────────────────────────────────────────────────── */
  .sc-textarea {
    width: 100%;
    height: 145.6px;
    background-color: #0f172a;
    border: 0.8px solid #334155;
    border-radius: 14px;
    padding: 12px 16px;
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 24px;
    color: #f8fafc;
    outline: none;
    resize: vertical;
    transition: border-color 0.15s ease;
    box-sizing: border-box;
  }
  .sc-textarea::placeholder { color: #64748b; }
  .sc-textarea:focus,
  .sc-textarea--focused      { border-color: #3b82f6; }
  .sc-textarea--error        { border-color: #ef4444 !important; }

  /* ── Error message ───────────────────────────────────────────────── */
  .sc-error-msg {
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 12px;
    line-height: 16px;
    color: #f87171;
    margin-top: 2px;
  }

  /* ── Submit button ───────────────────────────────────────────────── */
  .sc-btn-primary {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background-color: #2563eb;
    border: none;
    border-radius: 14px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #f8fafc;
    cursor: pointer;
    transition: background-color 0.15s ease, opacity 0.15s ease, transform 0.1s ease;
  }
  .sc-btn-primary:hover:not(:disabled) { background-color: #1d4ed8; }
  .sc-btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .sc-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

  /* ── Spinner animation ───────────────────────────────────────────── */
  .sc-spinner {
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── Success state ───────────────────────────────────────────────── */
  .sc-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
    padding-block: 40px;
  }

  .sc-success-icon-wrap {
    width: 64px;
    height: 64px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 188, 125, 0.15);
    border: 1px solid rgba(0, 188, 125, 0.3);
  }

  .sc-success-heading {
    font-family: 'Segoe UI', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #f8fafc;
    margin: 0;
  }

  .sc-success-sub {
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 15px;
    line-height: 24px;
    color: #94a3b8;
    margin: 4px 0 0;
  }

  .sc-btn-secondary {
    margin-top: 8px;
    padding: 10px 20px;
    border-radius: 14px;
    background-color: #1e293b;
    border: 0.8px solid #334155;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #cbd5e1;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }
  .sc-btn-secondary:hover { background-color: #334155; }

  /* ── Responsive ──────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .sc-heading   { font-size: clamp(28px, 6vw, 48px); white-space: normal; }
    .sc-body      { flex-direction: column; gap: 32px; }
    .sc-services  { width: 100%; }
    .sc-field-group { grid-template-columns: 1fr; }
  }
</style>

<script>
  let { currentPath = "/" } = $props();

  let isMobileMenuOpen = $state(false);

  import imgIcon from "../assets/icon-projects.svg";
  import imgIcon1 from "../assets/icon-commissions.svg";
  import imgIcon2 from "../assets/icon-stats.svg";

  // Reactive path — starts from SSR prop, updated on every view-transition navigation
  let path = $state("/");

  $effect(() => {
    // Sync on first mount and whenever currentPath prop changes
    path = currentPath;
  });

  if (typeof document !== "undefined") {
    document.addEventListener("astro:page-load", () => {
      path = window.location.pathname;
    });
  }

  const isActive = (href) => path === href || path.startsWith(href + "/");

  function navigate() {
    isMobileMenuOpen = false;
  }
</script>

<div class="relative {/** @type {string} */ ''}">
  <!-- ─── Desktop Navigation ─── -->
  <nav
    class="hidden md:flex bg-slate-800 border-slate-700 border-[0.8px] border-solid h-[45.6px] items-center p-[4.8px] rounded-[14px]"
  >
    <!-- Projects -->
    <a
      href="/admin/projects"
      onclick={navigate}
      class="flex items-center gap-[9px] px-[16px] py-[7px] min-h-full rounded-[10px] transition-colors no-underline
             {isActive('/admin/projects')
        ? 'bg-slate-700 shadow-sm'
        : 'hover:bg-slate-700/60'}"
    >
      <img src={imgIcon.src} alt="" class="w-4 h-4" />
      <span
        class="text-[14px] leading-[20px] font-['Segoe_UI',sans-serif] whitespace-nowrap
                   {isActive('/admin/projects')
          ? 'text-slate-50'
          : 'text-slate-400'}"
      >
        Projects
      </span>
    </a>

    <!-- Commissions -->
    <a
      href="/admin/commissions"
      onclick={navigate}
      class="flex items-center gap-[9px] px-[16px] py-[7px] min-h-full rounded-[10px] transition-colors no-underline
             {isActive('/admin/commissions')
        ? 'bg-slate-700 shadow-sm'
        : 'hover:bg-slate-700/60'}"
    >
      <img src={imgIcon1.src} alt="" class="w-4 h-4" />
      <span
        class="text-[14px] leading-[20px] font-['Segoe_UI',sans-serif] whitespace-nowrap
                   {isActive('/admin/commissions')
          ? 'text-slate-50'
          : 'text-slate-400'}"
      >
        Commissions
      </span>
    </a>

    <!-- Stats -->
    <a
      href="/admin"
      onclick={navigate}
      class="flex items-center gap-[8px] px-[16px] py-[7px] min-h-full rounded-[10px] transition-colors no-underline
             {isActive('/admin') &&
      !isActive('/admin/projects') &&
      !isActive('/admin/commissions')
        ? 'bg-slate-700 shadow-sm'
        : 'hover:bg-slate-700/60'}"
    >
      <img src={imgIcon2.src} alt="" class="w-4 h-4" />
      <span
        class="text-[14px] leading-[20px] font-['Segoe_UI',sans-serif] whitespace-nowrap
                   {isActive('/admin') &&
        !isActive('/admin/projects') &&
        !isActive('/admin/commissions')
          ? 'text-slate-50'
          : 'text-slate-400'}"
      >
        Stats
      </span>
    </a>
  </nav>

  <!-- ─── Mobile Toggle ─── -->
  <div class="md:hidden flex">
    <button
      onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
      class="bg-slate-800 border border-slate-700 rounded-[14px] h-[45.6px] px-4 flex items-center justify-between min-w-[140px] shadow-sm hover:bg-slate-700 transition-colors"
      aria-expanded={isMobileMenuOpen}
    >
      <span class="text-slate-50 text-sm font-['Segoe_UI',sans-serif]"
        >Admin Menu</span
      >
      <svg
        class="w-4 h-4 text-slate-400 transition-transform {isMobileMenuOpen
          ? 'rotate-180'
          : ''}"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Mobile Dropdown -->
    {#if isMobileMenuOpen}
      <div
        class="absolute top-[52px] left-0 w-[200px] bg-slate-800 border border-slate-700 rounded-[14px] shadow-xl flex flex-col p-1 gap-1 z-50"
      >
        <a
          href="/admin/projects"
          onclick={navigate}
          class="flex items-center gap-[9px] px-[16px] py-[10px] rounded-[10px] transition-colors no-underline w-full
                  {isActive('/admin/projects')
            ? 'bg-slate-700'
            : 'hover:bg-slate-700/60'}"
        >
          <img src={imgIcon.src} alt="" class="w-4 h-4" />
          <span
            class="text-sm font-['Segoe_UI',sans-serif]
                       {isActive('/admin/projects')
              ? 'text-slate-50'
              : 'text-slate-400'}">Projects</span
          >
        </a>
        <a
          href="/admin/commissions"
          onclick={navigate}
          class="flex items-center gap-[9px] px-[16px] py-[10px] rounded-[10px] transition-colors no-underline w-full
                  {isActive('/admin/commissions')
            ? 'bg-slate-700'
            : 'hover:bg-slate-700/60'}"
        >
          <img src={imgIcon1.src} alt="" class="w-4 h-4" />
          <span
            class="text-sm font-['Segoe_UI',sans-serif]
                       {isActive('/admin/commissions')
              ? 'text-slate-50'
              : 'text-slate-400'}">Commissions</span
          >
        </a>
        <a
          href="/admin"
          onclick={navigate}
          class="flex items-center gap-[8px] px-[16px] py-[10px] rounded-[10px] transition-colors no-underline w-full
                  {isActive('/admin') &&
          !isActive('/admin/projects') &&
          !isActive('/admin/commissions')
            ? 'bg-slate-700'
            : 'hover:bg-slate-700/60'}"
        >
          <img src={imgIcon2.src} alt="" class="w-4 h-4" />
          <span
            class="text-sm font-['Segoe_UI',sans-serif]
                       {isActive('/admin') &&
            !isActive('/admin/projects') &&
            !isActive('/admin/commissions')
              ? 'text-slate-50'
              : 'text-slate-400'}">Stats</span
          >
        </a>
      </div>
    {/if}
  </div>
</div>

<style>
  a.no-underline {
    text-decoration: none;
  }
</style>

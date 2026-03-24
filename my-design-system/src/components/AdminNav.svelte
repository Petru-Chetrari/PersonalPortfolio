<script>
  let { className = "" } = $props();
  
  let isMobileMenuOpen = $state(false);

  const imgIcon = "http://localhost:3845/assets/5f404036b8048e6b37b2d7ce0e736a19b352e0c5.svg";
  const imgIcon1 = "http://localhost:3845/assets/7a8636cab8d32c3ae5855d68ebe915385bb1521a.svg";
  const imgIcon2 = "http://localhost:3845/assets/8b49b13f2e9a3a8a3fa63247ae1016eed69db1e3.svg";
</script>

<div class="relative {className}">
  <!-- Desktop Navigation -->
  <div class="hidden md:flex bg-slate-800 border-slate-700 border-[0.8px] border-solid h-[45.6px] items-center p-[4.8px] relative rounded-[14px]">
    <button class="flex items-center gap-[9px] px-[16px] py-[7px] min-h-full rounded-[10px] hover:bg-slate-700 transition-colors">
      <img src={imgIcon} alt="Projects" class="w-4 h-4" />
      <span class="text-slate-400 text-[14px] leading-[20px] font-['Segoe_UI',sans-serif] whitespace-nowrap">Projects</span>
    </button>
    <button class="flex items-center gap-[9px] px-[16px] py-[7px] min-h-full rounded-[10px] hover:bg-slate-700 transition-colors">
      <img src={imgIcon1} alt="Commissions" class="w-4 h-4" />
      <span class="text-slate-400 text-[14px] leading-[20px] font-['Segoe_UI',sans-serif] whitespace-nowrap">Commissions</span>
    </button>
    <button class="bg-slate-700 flex items-center gap-[8px] px-[16px] py-[7px] min-h-full rounded-[10px] shadow-sm transition-colors">
      <img src={imgIcon2} alt="Stats" class="w-4 h-4" />
      <span class="text-slate-50 text-[14px] leading-[20px] font-['Segoe_UI',sans-serif] whitespace-nowrap">Stats</span>
    </button>
  </div>

  <!-- Mobile Toggle -->
  <div class="md:hidden flex">
    <button 
      onclick={() => isMobileMenuOpen = !isMobileMenuOpen}
      class="bg-slate-800 border border-slate-700 rounded-[14px] h-[45.6px] px-4 flex items-center justify-between min-w-[140px] shadow-sm hover:bg-slate-700 transition-colors"
      aria-expanded={isMobileMenuOpen}
    >
      <span class="text-slate-50 text-sm font-['Segoe_UI',sans-serif]">Admin Menu</span>
      <svg class="w-4 h-4 text-slate-400 transition-transform {isMobileMenuOpen ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    
    <!-- Mobile Dropdown -->
    {#if isMobileMenuOpen}
      <div class="absolute top-[52px] left-0 w-[200px] bg-slate-800 border border-slate-700 rounded-[14px] shadow-xl flex flex-col p-1 gap-1 z-50">
        <button class="flex items-center gap-[9px] px-[16px] py-[10px] rounded-[10px] hover:bg-slate-700 transition-colors w-full text-left">
          <img src={imgIcon} alt="" class="w-4 h-4" />
          <span class="text-slate-400 text-sm font-['Segoe_UI',sans-serif]">Projects</span>
        </button>
        <button class="flex items-center gap-[9px] px-[16px] py-[10px] rounded-[10px] hover:bg-slate-700 transition-colors w-full text-left">
          <img src={imgIcon1} alt="" class="w-4 h-4" />
          <span class="text-slate-400 text-sm font-['Segoe_UI',sans-serif]">Commissions</span>
        </button>
        <button class="bg-slate-700 flex items-center gap-[8px] px-[16px] py-[10px] rounded-[10px] shadow-sm w-full text-left">
          <img src={imgIcon2} alt="" class="w-4 h-4" />
          <span class="text-slate-50 text-sm font-['Segoe_UI',sans-serif]">Stats</span>
        </button>
      </div>
    {/if}
  </div>
</div>

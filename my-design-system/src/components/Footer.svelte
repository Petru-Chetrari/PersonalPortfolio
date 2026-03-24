<script>
  let { className = "" } = $props();

  const imgLogo1 =
    "http://localhost:3845/assets/cd923e4c4859f71855a6ff703603b658d7cea48b.svg";
  const imgText1 =
    "http://localhost:3845/assets/dae86770ab1124c6bdb6038a4ffff8be12eb2aca.svg";
</script>

<footer
  class="bg-slate-900 border-t border-slate-800 flex flex-col items-center justify-center py-10 w-full {className}"
>
  <div
    class="flex flex-col md:flex-row items-center justify-between w-full px-[24px] gap-6 md:gap-0"
  >
    <!-- Brand -->
    <div class="flex-1 flex justify-start items-center gap-[8px] h-[24px]">
      <div class="relative w-[16.693px] h-[20px] shrink-0">
        <img
          alt="Logo"
          class="absolute block max-w-none size-full"
          src={imgLogo1}
        />
      </div>
      <div class="relative w-[50.828px] h-[12px] shrink-0">
        <img
          alt="Brand Text"
          class="absolute block max-w-none size-full"
          src={imgText1}
        />
      </div>
    </div>

    <!-- Copyright -->
    <div
      class="shrink-0 text-slate-400 text-[14px] leading-[20px] font-['Segoe_UI_Emoji',sans-serif]"
    >
      © 2026 John Doe. All rights reserved.
    </div>

    <!-- Social Links -->
    <div class="flex-1 flex justify-end items-center gap-[16px]">
      <a
        href="/"
        class="text-slate-400 hover:text-slate-50 transition-colors text-[16px] leading-[24px] font-['Segoe_UI_Emoji',sans-serif]"
        >Twitter</a
      >
      <a
        href="/"
        class="text-slate-400 hover:text-slate-50 transition-colors text-[16px] leading-[24px] font-['Segoe_UI_Emoji',sans-serif]"
        >GitHub</a
      >
      <a
        href="/"
        class="text-slate-400 hover:text-slate-50 transition-colors text-[16px] leading-[24px] font-['Segoe_UI_Emoji',sans-serif]"
        >LinkedIn</a
      >
    </div>
  </div>
</footer>

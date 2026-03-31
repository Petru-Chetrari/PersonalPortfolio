<script>
    let { className = "", showAdmin = true, showClient = true } = $props();

    let isMobileMenuOpen = $state(false);
    let isScrolled = $state(false);

    import { onMount } from "svelte";
    import imgLogo from "../assets/logo.svg";
    import imgText from "../assets/brand-text.svg";
    onMount(() => {
        const handleScroll = () => {
            isScrolled = window.scrollY > 20;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled
        ? 'bg-slate-900/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-3'
        : 'bg-slate-900 py-[20px]'} flex items-start justify-between px-[24px] {className}"
>
    <!-- Brand -->
    <div class="flex items-center gap-[8px] h-[52px] -translate-y-[2px]">
        <div class="relative shrink-0 w-[37.559px] h-[45px]">
            <img
                alt="Logo"
                class="absolute block max-w-none size-full"
                src={imgLogo.src}
            />
        </div>
        <div class="relative shrink-0 w-[93.184px] h-[22px]">
            <img
                alt="Brand Text"
                class="absolute block max-w-none size-full"
                src={imgText.src}
            />
        </div>
    </div>

    <!-- Mobile Menu Button -->
    <div class="md:hidden flex h-[52px] items-center">
        <button
            class="text-slate-400 hover:text-slate-50 transition-colors"
            onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
            aria-label="Toggle menu"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                {#if isMobileMenuOpen}
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                {:else}
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                    />
                {/if}
            </svg>
        </button>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex flex-row items-center gap-[37px]">
        <div class="relative shrink-0 h-[20px] cursor-pointer group">
            <p
                class="absolute left-0 top-[-1.2px] whitespace-nowrap font-['Segoe_UI',sans-serif] text-[14px] leading-[20px] text-slate-400 group-hover:text-blue-500 transition-colors"
            >
                Home
            </p>
            <div
                class="absolute bg-blue-500 h-[2px] left-0 top-[22px] w-full transition-all"
            ></div>
        </div>

        <div
            class="relative shrink-0 w-[50.675px] h-[20px] cursor-pointer group"
        >
            <p
                class="absolute left-0 top-[-1.2px] whitespace-nowrap font-['Segoe_UI',sans-serif] text-[14px] leading-[20px] text-slate-400 group-hover:text-slate-50 transition-colors"
            >
                Hire Me
            </p>
            <div
                class="absolute bg-blue-500 h-[2px] left-0 top-[22px] w-0 group-hover:w-full transition-all duration-300"
            ></div>
        </div>

        <div class="bg-slate-700 w-px h-[16px] shrink-0"></div>

        {#if showClient}
            <div
                class="relative shrink-0 w-[78.213px] h-[20px] cursor-pointer group"
            >
                <p
                    class="absolute left-0 top-[-1.2px] whitespace-nowrap font-['Segoe_UI',sans-serif] text-[14px] leading-[20px] text-slate-400 group-hover:text-slate-50 transition-colors"
                >
                    Client Portal
                </p>
            </div>
        {/if}

        {#if showAdmin}
            <a
                href="/admin"
                class="relative shrink-0 w-[42.063px] h-[20px] cursor-pointer group flex items-center"
            >
                <span
                    class="absolute left-0 top-[-1.2px] whitespace-nowrap font-['Segoe_UI',sans-serif] text-[14px] leading-[20px] text-slate-400 group-hover:text-slate-50 transition-colors"
                    >Admin</span
                >
            </a>
        {/if}

        <button
            class="relative shrink-0 w-[75.988px] h-[36px] bg-slate-50 rounded-[26843500px] hover:bg-white hover:shadow-md transition-all cursor-pointer"
        >
            <p
                class="absolute left-[16px] top-[6.8px] whitespace-nowrap font-['Segoe_UI',sans-serif] font-semibold text-[14px] leading-[20px] text-slate-900"
            >
                Sign In
            </p>
        </button>
    </nav>

    <!-- Mobile Dropdown -->
    {#if isMobileMenuOpen}
        <div
            class="absolute top-full left-0 right-0 bg-slate-900 border-t border-slate-800 p-6 md:hidden flex flex-col gap-6 shadow-xl leading-[20px] text-[14px] font-['Segoe_UI',sans-serif]"
        >
            <a
                href="/"
                class="text-slate-400 hover:text-blue-500 transition-colors"
                >Home</a
            >
            <a
                href="/"
                class="text-slate-400 hover:text-slate-50 transition-colors"
                >Hire Me</a
            >
            <div class="bg-slate-700 h-px w-full shrink-0"></div>
            {#if showClient}
                <a
                    href="/"
                    class="text-slate-400 hover:text-slate-50 transition-colors"
                    >Client Portal</a
                >
            {/if}
            {#if showAdmin}
                <a
                    href="/admin"
                    class="text-slate-400 hover:text-slate-50 transition-colors"
                    >Admin</a
                >
            {/if}
            <button
                class="bg-slate-50 text-slate-900 h-[44px] rounded-full font-semibold text-[16px] hover:bg-white transition-all w-full"
            >
                Sign In
            </button>
        </div>
    {/if}
</header>

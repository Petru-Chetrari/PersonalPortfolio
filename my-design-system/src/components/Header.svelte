<script>
    let { className = "", showAdmin = true, showClient = true } = $props();

    let isMobileMenuOpen = $state(false);
    let isScrolled = $state(false);
    let user = $state(null);
    let role = $state(null);

    import { onMount } from "svelte";
    import imgLogo from "../assets/logo.svg";
    import imgText from "../assets/brand-text.svg";
    import PreferenceCenter from "./PreferenceCenter.svelte";
    import { incrementInteraction } from "../lib/api";
    import { getAccessTokenFromCookie, decodeJwt } from "../lib/auth-utils";

    function handleMar9() {
        // fire-and-forget — no UI feedback needed
        incrementInteraction('Mar 09').catch(console.warn);
    }

    onMount(() => {
        const token = getAccessTokenFromCookie();
        if (token) {
            user = decodeJwt(token);
            role = user.role;
        }
        role === 'admin' ? showAdmin = true : showAdmin = false;
        role === 'client' ? showClient = true : showClient = false;

        const handleScroll = () => {
            isScrolled = window.scrollY > 20;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });
</script>

<header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled
        ? 'bg-slate-900/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-[12px]'
        : 'bg-slate-900 py-[20px]'} flex items-center justify-between px-[24px] {className}"
>
    <!-- Brand -->
    <a href="/" class="flex items-center gap-[8px]">
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
    </a>

    <!-- Mobile Menu Button -->
    <div class="md:hidden flex items-center">
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
    <nav class="hidden md:flex flex-row items-center gap-[37px] h-[36px]">
        <a href="/" class="relative shrink-0 w-[38.5px] h-[20px] cursor-pointer group">
            <p
                class="absolute left-0 top-[-1.2px] whitespace-nowrap font-['Segoe_UI',sans-serif] text-[14px] leading-[20px] text-[#94a3b8] group-hover:text-blue-500 transition-colors"
            >
                Home
            </p>
            <div
                class="absolute bg-blue-500 h-[2px] left-0 top-[22px] w-0 group-hover:w-full transition-all duration-300"
            ></div>
        </a>

        <a
            href="/submit-commission"
            class="relative shrink-0 w-[50.675px] h-[20px] cursor-pointer group"
        >
            <p
                class="absolute left-0 top-[-1.2px] whitespace-nowrap font-['Segoe_UI',sans-serif] text-[14px] leading-[20px] text-[#94a3b8] group-hover:text-slate-50 transition-colors"
            >
                Hire Me
            </p>
            <div
                class="absolute bg-blue-500 h-[2px] left-0 top-[22px] w-0 group-hover:w-full transition-all duration-300"
            ></div>
        </a>

        <div class="bg-slate-700 w-px h-[16px] shrink-0"></div>

        {#if showClient}
            <a
                href="/client/commissions"
                class="relative shrink-0 w-[78.213px] h-[20px] cursor-pointer group"
            >
                <p
                    class="absolute left-0 top-[-1.2px] whitespace-nowrap font-['Segoe_UI',sans-serif] text-[14px] leading-[20px] text-slate-400 group-hover:text-slate-50 transition-colors"
                >
                    Client Portal
                </p>
            </a>
        {/if}

        {#if showAdmin}
            <a
                href="/admin/stats"
                class="relative shrink-0 w-[42.063px] h-[20px] cursor-pointer group flex items-center"
            >
                <span
                    class="absolute left-0 top-[-1.2px] whitespace-nowrap font-['Segoe_UI',sans-serif] text-[14px] leading-[20px] text-slate-400 group-hover:text-slate-50 transition-colors"
                    >Admin</span
                >
            </a>
        {/if}

        {#if role}
        <div class="bg-slate-700 w-px h-[16px] shrink-0"></div>
        {/if}

        {#if user}
            <div class="flex items-center gap-[12px]">
                <span class="text-xs text-slate-400 font-['Segoe_UI',sans-serif]">
                    Hi, <span class="text-slate-200 font-semibold">{user.username}</span>
                </span>
                <a
                    href="/signout"
                    class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-slate-300 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all text-xs font-semibold"
                >
                    Sign out
                </a>
            </div>
        {:else}
            <a
                href="/signin"
                class="px-3 py-1 bg-blue-600 rounded-md text-white hover:bg-blue-500 transition-all text-xs font-semibold"
            >
                Sign in
            </a>
        {/if}
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
                href="/submit-commission"
                class="text-slate-400 hover:text-slate-50 transition-colors"
                >Hire Me</a
            >
            <div class="bg-slate-700 h-px w-full shrink-0"></div>
            {#if showClient}
                <a
                    href="/client/commissions"
                    class="text-slate-400 hover:text-slate-50 transition-colors"
                    >Client Portal</a
                >
            {/if}
            {#if showAdmin}
                <a
                    href="/admin/stats"
                    class="text-slate-400 hover:text-slate-50 transition-colors"
                    >Admin</a
                >
            {/if}

            <div class="bg-slate-700 h-px w-full shrink-0"></div>
            {#if user}
                <div class="flex flex-col gap-2 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
                    <span class="text-xs text-slate-400">
                        Signed in as <span class="text-slate-200 font-semibold">{user.username}</span>
                    </span>
                    <a
                        href="/signout"
                        class="w-full text-center px-4 py-2.5 bg-red-950/40 border border-red-900/60 rounded-lg text-red-400 hover:bg-red-900 hover:text-white transition-all text-sm font-semibold"
                    >
                        Sign out
                    </a>
                </div>
            {:else}
                <a
                    href="/signin"
                    class="w-full text-center px-4 py-2.5 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition-all text-sm font-semibold"
                >
                    Sign in
                </a>
            {/if}
        </div>
    {/if}
</header>

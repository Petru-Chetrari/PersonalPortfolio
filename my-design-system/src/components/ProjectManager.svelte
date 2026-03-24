<script>
  const imgImageAuraAnalyticsDashboard =
    "http://localhost:3845/assets/bee0d7335ba9c7d1cb6f76e9c25452666693add1.png";

  const projects = [
    {
      id: 1,
      title: "Aura Analytics Dashboard",
      appType: "Web Application",
      shortDesc:
        "A comprehensive real-time analytics dashboard built with React and Tailwind CSS. Features dark mode, responsive design, and intuitive data visualization.",
      longDesc:
        "The Aura Analytics Dashboard was conceived from the need to visualize complex datasets in real-time without compromising on performance or user experience. The primary challenge was handling high-frequency data streams while maintaining a smooth, 60fps interface.\n\nWe implemented a custom data aggregation layer that batches updates, combined with highly optimized React components using memoization techniques. The result is a dashboard that can process thousands of data points per second while remaining completely responsive. The design language focuses on high contrast and clarity, using a dark theme to reduce eye strain for users who monitor these dashboards for hours at a time.",
      photo: imgImageAuraAnalyticsDashboard,
      category: "Web Application",
      tags: ["React", "TypeScript", "Tailwind", "Recharts", "WebSocket"],
    },
    {
      id: 2,
      title: "Lumina Mobile Banking",
      appType: "Mobile Design Prototype",
      shortDesc:
        "A complete mobile banking interface focusing on clean typography, intuitive interactions, and accessible financial tools.",
      longDesc:
        "Lumina Mobile Banking solves complex user flows with simplified micro-interactions and high-contrast, easy-to-read financial overviews. Accessibility was a core principle from day one, ensuring every feature met WCAG AA standards.",
      photo: imgImageAuraAnalyticsDashboard,
      category: "Mobile Application",
      tags: ["Figma", "UI/UX", "Prototyping"],
    },
    {
      id: 3,
      title: "Nova Modern Interface",
      appType: "SaaS Platform",
      shortDesc:
        "A scalable design system and interface library for B2B SaaS applications.",
      longDesc:
        "Nova provides a robust set of accessible components designed for dense data layouts typical in SaaS platforms. Built with composability in mind, each component is self-contained and themeable.",
      photo: imgImageAuraAnalyticsDashboard,
      category: "Design System",
      tags: ["React", "Storybook", "Accessibility"],
    },
  ];

  let selectedProject = $state(projects[0]);
</script>

<!--
  LAYOUT:
  This component renders directly into AdminDashboard.astro's slot,
  which already provides the outer dark card (bg-slate-800, rounded-[24px]).
  
  Inner structure: flex row — [Sidebar 260px] | [Detail Panel flex-1]
  
  Colors (from target design):
    Sidebar bg: transparent (inherits outer card)
    Active item bg: #1E293B (slightly lighter card)
    Right panel bg: #0F172A (darker than outer card)
    Blue labels: #3B82F6
    Body text: #CBD5E1 (slate-300)
    Divider: #334155 (slate-700)
-->

<div
  class="flex w-full overflow-hidden"
  style="border: 1px solid #1E293B; border-radius: 24px; min-height: 700px; padding: 17px; gap: 20px;"
>
  <!-- ══════════════════════════════════════════
       SIDEBAR — fixed 260px, scrollable
  ══════════════════════════════════════════ -->
  <aside
    class="shrink-0 flex flex-col overflow-y-auto sidebar-scroll"
    style="width: 260px; border-right: 1px solid #334155;"
  >
    <!-- Sidebar header -->
    <div
      class="flex items-center justify-between px-5 py-4"
      style="border-bottom: 1px solid rgba(51,65,85,0.5);"
    >
      <span
        style="color: #94A3B8; font-size: 10px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase;"
      >
        Portfolio Projects
      </span>
      <button
        style="background: #2563EB; color: white; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; white-space: nowrap;"
        onmouseenter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
        onmouseleave={(e) => (e.currentTarget.style.background = "#2563EB")}
      >
        + Add New
      </button>
    </div>

    <!-- Project list -->
    <div class="flex flex-col gap-1 p-3 flex-1">
      {#each projects as project}
        {@const isActive = selectedProject?.id === project.id}
        <button
          onclick={() => (selectedProject = project)}
          class="w-full text-left flex flex-col gap-1 p-4 rounded-xl transition-all border-none cursor-pointer outline-none"
          style={isActive
            ? "background: #1E293B; border: 1px solid rgba(51,65,85,0.5);"
            : "background: transparent; border: 1px solid transparent; opacity: 0.7;"}
          onmouseenter={(e) => {
            if (!isActive) e.currentTarget.style.opacity = "1";
          }}
          onmouseleave={(e) => {
            if (!isActive) e.currentTarget.style.opacity = "0.7";
          }}
        >
          <span
            style={isActive
              ? "color: #F8FAFC; font-size: 14px; font-weight: 700; line-height: 1.3;"
              : "color: #CBD5E1; font-size: 14px; font-weight: 700; line-height: 1.3;"}
          >
            {project.title}
          </span>
          <span
            style="color: #64748B; font-size: 12px; font-weight: 500; margin-top: 2px;"
          >
            {project.appType}
          </span>
        </button>
      {/each}
    </div>
  </aside>

  <!-- ══════════════════════════════════════════
       DETAIL PANEL — flex-1, darker bg
  ══════════════════════════════════════════ -->
  <main
    class="flex-1 flex flex-col overflow-y-auto detail-scroll min-w-0"
    style="border: 1px solid #1E293B; background-color: #0F172A; border-radius: 24px;"
  >
    {#if selectedProject}
      <!-- Panel header: "Project Details" + Edit/Delete -->
      <div
        class="flex items-center justify-between px-8 py-5 shrink-0"
        style="border-bottom: 1px solid #334155; background: rgba(30,41,59,0.2);"
      >
        <h2
          style="color: #F8FAFC; font-size: 18px; font-weight: 700; margin: 0;"
        >
          Project Details
        </h2>
        <div style="display: flex; gap: 10px; align-items: center;">
          <!-- Edit button -->
          <button
            style="display: flex; align-items: center; gap: 6px; background: #334155; color: #F8FAFC; font-size: 12px; font-weight: 700; padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer;"
            onmouseenter={(e) => (e.currentTarget.style.background = "#475569")}
            onmouseleave={(e) => (e.currentTarget.style.background = "#334155")}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 20 20"
              fill="none"
              style="flex-shrink:0"
            >
              <path
                d="M14.7 2.29a1 1 0 0 1 1.41 0l1.6 1.6a1 1 0 0 1 0 1.42L5.46 17.56 2 18l.44-3.46L14.7 2.29Z"
                stroke="#F8FAFC"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Edit
          </button>
          <!-- Delete button -->
          <button
            style="display: flex; align-items: center; gap: 6px; background: rgba(255,32,86,0.1); color: #FF2056; font-size: 12px; font-weight: 700; padding: 7px 14px; border-radius: 8px; border: 1px solid rgba(255,32,86,0.3); cursor: pointer;"
            onmouseenter={(e) =>
              (e.currentTarget.style.background = "rgba(255,32,86,0.2)")}
            onmouseleave={(e) =>
              (e.currentTarget.style.background = "rgba(255,32,86,0.1)")}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 20 20"
              fill="none"
              style="flex-shrink:0"
            >
              <path
                d="M4 6h12M15.33 6v9.33A1.33 1.33 0 0 1 14 16.67H6a1.33 1.33 0 0 1-1.33-1.34V6M7.33 6V4.67A1.33 1.33 0 0 1 8.67 3.33h2.66A1.33 1.33 0 0 1 12.67 4.67V6M8.67 9.33v4M11.33 9.33v4"
                stroke="#FF2056"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <!-- Scrollable content -->
      <div class="flex flex-col px-8 py-7 gap-8 pb-12">
        <!-- TITLE -->
        <div>
          <span class="field-label">Title</span>
          <h1
            style="color: #F8FAFC; font-size: 30px; font-weight: 700; line-height: 1.2; margin: 0;"
          >
            {selectedProject.title}
          </h1>
        </div>

        <!-- SHORT DESCRIPTION -->
        <div>
          <span class="field-label">Short Description</span>
          <p
            style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin: 0;"
          >
            {selectedProject.shortDesc}
          </p>
        </div>

        <!-- PHOTOS -->
        <div>
          <span
            class="field-label"
            style="display: flex; align-items: center; gap: 6px;"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect
                x="1"
                y="2"
                width="14"
                height="12"
                rx="2"
                stroke="#3B82F6"
                stroke-width="1.2"
              />
              <circle
                cx="5.5"
                cy="6"
                r="1.5"
                stroke="#3B82F6"
                stroke-width="1.2"
              />
              <path
                d="M1 11l3.5-3.5L7 10l3-3 5 5"
                stroke="#3B82F6"
                stroke-width="1.2"
                stroke-linecap="round"
              />
            </svg>
            Photos
          </span>
          <div
            class="w-full overflow-hidden"
            style="aspect-ratio: 16/9; border-radius: 16px; border: 1px solid #334155; background: #1E293B;"
          >
            <img
              src={selectedProject.photo}
              alt={selectedProject.title}
              style="width: 100%; height: 100%; object-fit: cover; display: block;"
            />
          </div>
        </div>

        <!-- LONG DESCRIPTION -->
        <div>
          <span class="field-label">Long Description</span>
          <div
            style="color: #CBD5E1; font-size: 14px; line-height: 1.75; white-space: pre-wrap;"
          >
            {selectedProject.longDesc}
          </div>
        </div>

        <!-- LINKS & METADATA -->
        <div>
          <span
            class="field-label"
            style="display: flex; align-items: center; gap: 6px;"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.5 9.5a3 3 0 0 0 4.243 0l2-2a3 3 0 0 0-4.243-4.243L7.4 4.36M9.5 6.5a3 3 0 0 0-4.243 0l-2 2a3 3 0 0 0 4.243 4.243L8.6 11.64"
                stroke="#3B82F6"
                stroke-width="1.2"
                stroke-linecap="round"
              />
            </svg>
            Links &amp; Metadata
          </span>
          <div
            style="background: rgba(15,23,42,0.7); border: 1px solid #334155; border-radius: 16px; padding: 20px 24px; display: flex; flex-wrap: wrap; gap: 32px;"
          >
            <div>
              <div
                style="color: #64748B; font-size: 9px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 6px;"
              >
                Category
              </div>
              <div style="color: #F8FAFC; font-size: 14px; font-weight: 700;">
                {selectedProject.category}
              </div>
            </div>
            <div style="flex: 1; min-width: 160px;">
              <div
                style="color: #64748B; font-size: 9px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 6px;"
              >
                Tags
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                {#each selectedProject.tags as tag}
                  <span
                    style="background: #1E293B; color: #CBD5E1; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 8px; border: 1px solid #334155;"
                  >
                    {tag}
                  </span>
                {/each}
              </div>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div
        style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 48px;"
      >
        <div
          style="text-align: center; border: 2px dashed #334155; border-radius: 24px; padding: 40px 48px;"
        >
          <p
            style="color: #F8FAFC; font-size: 17px; font-weight: 700; margin: 0 0 8px;"
          >
            No Project Selected
          </p>
          <p style="color: #94A3B8; font-size: 13px; margin: 0;">
            Select a project from the sidebar to view its details.
          </p>
        </div>
      </div>
    {/if}
  </main>
</div>

<style>
  /* Field label — blue, uppercase, extrabold, tiny */
  .field-label {
    color: #3b82f6;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 8px;
  }

  /* Custom thin scrollbars */
  .sidebar-scroll::-webkit-scrollbar,
  .detail-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .sidebar-scroll::-webkit-scrollbar-track,
  .detail-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .sidebar-scroll::-webkit-scrollbar-thumb,
  .detail-scroll::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
    transition: background 0.2s;
  }
  .sidebar-scroll:hover::-webkit-scrollbar-thumb,
  .detail-scroll:hover::-webkit-scrollbar-thumb {
    background: #334155;
  }
</style>

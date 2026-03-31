<script lang="ts">
  import { validateProject, type ValidationErrors } from '../lib/validation';
  import imgImageAuraAnalyticsDashboard from '../assets/aura-dashboard.svg?url';

  // ─── Project Data ──────────────────────────────────────────────
  const projects = $state([
    {
      id: 1,
      title: "Aura Analytics Dashboard",
      appType: "Web Application",
      shortDesc:
        "A comprehensive real-time analytics dashboard built with React and Tailwind CSS. Features dark mode, responsive design, and intuitive data visualization.",
      longDesc:
        "The Aura Analytics Dashboard was conceived from the need to visualize complex datasets in real-time without compromising on performance or user experience. The primary challenge was handling high-frequency data streams while maintaining a smooth, 60fps interface.\n\nWe implemented a custom data aggregation layer that batches updates, combined with highly optimized React components using memoization techniques. The result is a dashboard that can process thousands of data points per second while remaining completely responsive. The design language focuses on high contrast and clarity, using a dark theme to reduce eye strain for users who monitor these dashboards for hours at a time.",
      photo: imgImageAuraAnalyticsDashboard,
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
      tags: ["React", "Storybook", "Accessibility"],
    },
  ]);

  // ─── Selection ─────────────────────────────────────────────────
  let selectedProject = $state(projects[0]);

  // ─── Edit / Add State ──────────────────────────────────────────
  let isEditing = $state(false);
  let isAddingNew = $state(false);

  let editedProject = $state({ ...projects[0] });
  let editedTagsString = $state(projects[0].tags.join(", "));

  // Validation errors — keyed by field name
  let errors = $state({ title: false, shortDesc: false, appType: false });

  // ─── Helpers ───────────────────────────────────────────────────
  function validate() {
    const { isValid, errors: validationErrors } = validateProject(editedProject);
    errors = {
      title: validationErrors.title,
      shortDesc: validationErrors.shortDesc,
      appType: validationErrors.appType,
    };
    return isValid;
  }

  // Clear field error as user types
  function clearError(field: keyof ValidationErrors) {
    errors[field] = false;
  }

  // ─── Project-switch effect ─────────────────────────────────────
  $effect(() => {
    if (selectedProject) {
      isEditing = false;
      isAddingNew = false;
      errors = { title: false, shortDesc: false, appType: false };
      editedProject = { ...selectedProject };
      editedTagsString = selectedProject.tags.join(", ");
    }
  });

  // ─── Actions ───────────────────────────────────────────────────
  function startEdit() {
    editedProject = { ...selectedProject };
    editedTagsString = selectedProject.tags.join(", ");
    errors = { title: false, shortDesc: false, appType: false };
    isAddingNew = false;
    isEditing = true;
  }

  function startAddNew() {
    editedProject = {
      id: Date.now(),
      title: "",
      appType: "",
      shortDesc: "",
      longDesc: "",
      photo: imgImageAuraAnalyticsDashboard,
      tags: [],
    };
    editedTagsString = "";
    errors = { title: false, shortDesc: false, appType: false };
    isAddingNew = true;
    isEditing = true;
  }

  function saveEdit() {
    if (!validate()) return; // Guard: stop if invalid

    const parsedTags = editedTagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (isAddingNew) {
      // Push new project to the top of the list
      const newProject = { ...editedProject, tags: parsedTags };
      projects.unshift(newProject);
      selectedProject = projects[0];
    } else {
      // Update existing
      const idx = projects.findIndex((p) => p.id === selectedProject.id);
      if (idx !== -1) {
        projects[idx] = { ...editedProject, tags: parsedTags };
        selectedProject = projects[idx];
      }
    }

    isEditing = false;
    isAddingNew = false;
  }

  function cancelEdit() {
    isEditing = false;
    isAddingNew = false;
    errors = { title: false, shortDesc: false, appType: false };
  }

  function deleteProject() {
    const idx = projects.findIndex((p) => p.id === selectedProject.id);
    if (idx !== -1) {
      projects.splice(idx, 1);
      selectedProject = projects[0] ?? null;
    }
  }
</script>

<!--
  LAYOUT: flex row — [Sidebar 260px] | [Detail Panel flex-1]
  Renders directly into AdminDashboard.astro slot (outer card already provided).
-->

<div
  class="flex w-full overflow-hidden"
  style="border: 1px solid #1E293B; border-radius: 24px; min-height: 700px; padding: 17px; gap: 20px;"
>
  <!-- ══════════════════════════════════════════
       SIDEBAR
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
        onclick={startAddNew}
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
       DETAIL PANEL
  ══════════════════════════════════════════ -->
  <main
    class="flex-1 flex flex-col overflow-y-auto detail-scroll min-w-0"
    style="border: 1px solid #1E293B; background-color: #0F172A; border-radius: 24px;"
  >
    {#if selectedProject}
      <!-- ── Panel Header ──────────────────────────────── -->
      <div
        class="flex items-center justify-between px-8 py-5 shrink-0"
        style="border-bottom: 1px solid #334155; background: rgba(30,41,59,0.2);"
      >
        <h2
          style="color: #F8FAFC; font-size: 18px; font-weight: 700; margin: 0;"
        >
          {isAddingNew
            ? "New Project"
            : isEditing
              ? "Edit Project"
              : "Project Details"}
        </h2>

        <div style="display: flex; gap: 10px; align-items: center;">
          {#if isEditing}
            <!-- Save button -->
            <button
              onclick={saveEdit}
              style="display: flex; align-items: center; gap: 6px; background: #2563EB; color: #F8FAFC; font-size: 12px; font-weight: 700; padding: 7px 16px; border-radius: 8px; border: none; cursor: pointer;"
              onmouseenter={(e) =>
                (e.currentTarget.style.background = "#1D4ED8")}
              onmouseleave={(e) =>
                (e.currentTarget.style.background = "#2563EB")}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 20 20"
                fill="none"
                style="flex-shrink:0"
              >
                <path
                  d="M4 10.5l4.5 4.5L16 6"
                  stroke="#F8FAFC"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Save
            </button>
            <!-- Cancel button -->
            <button
              onclick={cancelEdit}
              style="display: flex; align-items: center; gap: 6px; background: #334155; color: #94A3B8; font-size: 12px; font-weight: 700; padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer;"
              onmouseenter={(e) =>
                (e.currentTarget.style.background = "#475569")}
              onmouseleave={(e) =>
                (e.currentTarget.style.background = "#334155")}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 20 20"
                fill="none"
                style="flex-shrink:0"
              >
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="#94A3B8"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              Cancel
            </button>
          {:else}
            <!-- Edit button -->
            <button
              onclick={startEdit}
              style="display: flex; align-items: center; gap: 6px; background: #334155; color: #F8FAFC; font-size: 12px; font-weight: 700; padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer;"
              onmouseenter={(e) =>
                (e.currentTarget.style.background = "#475569")}
              onmouseleave={(e) =>
                (e.currentTarget.style.background = "#334155")}
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
              onclick={deleteProject}
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
          {/if}
        </div>
      </div>

      <!-- ── Content: View or Edit ──────────────────────── -->
      <div
        class="panel-body flex flex-col px-8 py-7 gap-8 pb-12"
        class:editing={isEditing}
      >
        {#if isEditing}
          <!-- ══════ EDIT FORM ══════ -->

          <!-- Title -->
          <div>
            <label
              class="field-label"
              for="edit-title"
              style={errors.title ? "color: #EF4444;" : ""}
            >
              Title {#if errors.title}<span class="required-hint">Required</span
                >{/if}
            </label>
            <input
              id="edit-title"
              class="edit-input"
              class:input-error={errors.title}
              type="text"
              bind:value={editedProject.title}
              oninput={() => clearError("title")}
              placeholder="Project title"
            />
          </div>

          <!-- Application Type -->
          <div>
            <label
              class="field-label"
              for="edit-type"
              style={errors.appType ? "color: #EF4444;" : ""}
            >
              Application Type {#if errors.appType}<span class="required-hint">Required</span>{/if}
            </label>
            <input
              id="edit-type"
              class="edit-input"
              class:input-error={errors.appType}
              type="text"
              bind:value={editedProject.appType}
              oninput={() => clearError("appType")}
              placeholder="e.g. Web Application"
            />
          </div>

          <!-- Short Description -->
          <div>
            <label
              class="field-label"
              for="edit-short"
              style={errors.shortDesc ? "color: #EF4444;" : ""}
            >
              Short Description {#if errors.shortDesc}<span
                  class="required-hint">Required</span
                >{/if}
            </label>
            <textarea
              id="edit-short"
              class="edit-textarea"
              class:input-error={errors.shortDesc}
              rows="3"
              bind:value={editedProject.shortDesc}
              oninput={() => clearError("shortDesc")}
              placeholder="A brief, one-paragraph description..."
            ></textarea>
          </div>

          <!-- Long Description -->
          <div>
            <label class="field-label" for="edit-long">Long Description</label>
            <textarea
              id="edit-long"
              class="edit-textarea"
              rows="8"
              bind:value={editedProject.longDesc}
              placeholder="Write the full project story here..."
            ></textarea>
          </div>


          <!-- Tags -->
          <div>
            <label class="field-label" for="edit-tags"
              >Tags <span
                style="font-weight:500; text-transform:none; letter-spacing:0; color:#64748B; font-size:10px;"
                >(comma-separated)</span
              ></label
            >
            <input
              id="edit-tags"
              class="edit-input"
              type="text"
              bind:value={editedTagsString}
              placeholder="React, TypeScript, Tailwind..."
            />
          </div>

          <!-- Form action row (duplicate Save/Cancel at the bottom for long forms) -->
          <div
            style="display: flex; gap: 12px; padding-top: 8px; border-top: 1px solid #1E293B;"
          >
            <button
              onclick={saveEdit}
              style="flex: 1; background: #2563EB; color: #F8FAFC; font-size: 13px; font-weight: 700; padding: 10px; border-radius: 10px; border: none; cursor: pointer;"
              onmouseenter={(e) =>
                (e.currentTarget.style.background = "#1D4ED8")}
              onmouseleave={(e) =>
                (e.currentTarget.style.background = "#2563EB")}
            >
              Save Changes
            </button>
            <button
              onclick={cancelEdit}
              style="background: transparent; color: #94A3B8; font-size: 13px; font-weight: 700; padding: 10px 20px; border-radius: 10px; border: 1px solid #334155; cursor: pointer;"
              onmouseenter={(e) =>
                (e.currentTarget.style.background = "#1E293B")}
              onmouseleave={(e) =>
                (e.currentTarget.style.background = "transparent")}
            >
              Cancel
            </button>
          </div>
        {:else}
          <!-- ══════ READ-ONLY VIEW ══════ -->

          <!-- Title -->
          <div>
            <span class="field-label">Title</span>
            <h1
              style="color: #F8FAFC; font-size: 30px; font-weight: 700; line-height: 1.2; margin: 0;"
            >
              {selectedProject.title}
            </h1>
          </div>

          <!-- Short Description -->
          <div>
            <span class="field-label">Short Description</span>
            <p
              style="color: #CBD5E1; font-size: 15px; line-height: 1.7; margin: 0;"
            >
              {selectedProject.shortDesc}
            </p>
          </div>

          <!-- Photos -->
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

          <!-- Long Description -->
          <div>
            <span class="field-label">Long Description</span>
            <div
              style="color: #CBD5E1; font-size: 14px; line-height: 1.75; white-space: pre-wrap;"
            >
              {selectedProject.longDesc}
            </div>
          </div>

          <!-- Links & Metadata -->
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
                  Application Type
                </div>
                <div style="color: #F8FAFC; font-size: 14px; font-weight: 700;">
                  {selectedProject.appType}
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
        {/if}
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
  /* ── Field label ── */
  .field-label {
    color: #3b82f6;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 8px;
  }

  /* ── Edit inputs ── */
  .edit-input,
  .edit-textarea {
    width: 100%;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 10px;
    color: #f8fafc;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 14px;
    outline: none;
    box-sizing: border-box;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
    font-family: inherit;
    resize: vertical;
  }

  .edit-input:focus,
  .edit-textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  .edit-input::placeholder,
  .edit-textarea::placeholder {
    color: #475569;
  }

  /* ── Validation error state ── */
  .input-error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
  }

  .required-hint {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 4px;
    padding: 1px 5px;
    margin-left: 6px;
    vertical-align: middle;
    text-transform: uppercase;
  }

  /* ── Panel body transition ── */
  .panel-body {
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ── Scrollbars ── */
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

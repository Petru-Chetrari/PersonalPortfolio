<script lang="ts">
  import type { Commission } from '../lib/mock-repository.svelte.ts';

  interface Props {
    data: Commission[];
  }

  let { data: rawData }: Props = $props();

  // Figma shows exactly 2 commissions in the list panel
  const data = $derived(rawData.slice(0, 2));

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    pending:   { label: 'In Progress', color: '#FFB900', bg: 'rgba(254,154,0,0.1)',  border: 'rgba(254,154,0,0.2)'  },
    active:    { label: 'In Progress', color: '#FFB900', bg: 'rgba(254,154,0,0.1)',  border: 'rgba(254,154,0,0.2)'  },
    completed: { label: 'Completed',   color: '#00BC7D', bg: 'rgba(0,188,125,0.1)', border: 'rgba(0,188,125,0.2)' },
    overdue:   { label: 'Overdue',     color: '#FF2056', bg: 'rgba(255,32,86,0.1)', border: 'rgba(255,32,86,0.2)' },
  };

  // Figma shows exactly 2 chat messages: Developer then Client
  const mockMessages = [
    { from: 'developer', sender: 'Developer', time: '09:00 AM', text: "Hi! I've reviewed the requirements for the product page update. Looks solid. I'll start working on the wireframes today." },
    { from: 'client',    sender: 'You',       time: '09:15 AM', text: 'Awesome! Please make sure to include the new variant selector we discussed.' },
  ];

  let selected = $state<Commission | null>(data[0] ?? null);
  let messageText = $state('');

  function selectCommission(c: Commission) { selected = c; }
  function sendMessage() { messageText = ''; }
</script>

<!-- ─── Page heading (Figma: ClientDashboard › Container, y:32, 30px Bold #f8fafc) ─── -->
<div class="page-header">
  <h1 class="page-title">Client Portal</h1>
  <p class="page-subtitle">Manage your commissions and communicate directly with the developer.</p>
</div>

<!-- ─── Two-panel card ─────────────────────────────────────────────────────────────── -->
<div class="portal-card">

  <!-- LEFT: commission list -->
  <aside class="list-panel">
    <div class="list-header">
      <span class="list-label">YOUR COMMISSIONS</span>
      <span class="list-count">{data.length}</span>
    </div>

    <div class="list-items">
      {#each data as c (c.id)}
        {@const s = statusConfig[c.status] ?? statusConfig.pending}
        <button
          class="commission-item"
          class:is-active={selected?.id === c.id}
          onclick={() => selectCommission(c)}
        >
          <div class="item-top">
            <span class="item-id">{c.id}</span>
            {#if c.status === 'completed'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="color:{s.color}; flex-shrink:0">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {:else if c.status === 'overdue'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="color:{s.color}; flex-shrink:0">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            {:else}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="color:{s.color}; flex-shrink:0">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            {/if}
          </div>
          <p class="item-title">{c.title}</p>
          <div class="item-footer">
            <span>{formatDate(c.date)}</span>
            <span class="separator-dot"></span>
            <span style="color:{s.color}">{s.label}</span>
          </div>
        </button>
      {/each}
    </div>
  </aside>

  <!-- RIGHT: detail + chat -->
  <section class="detail-panel">
    {#if selected}
      {@const s = statusConfig[selected.status] ?? statusConfig.pending}

      <!-- Detail header -->
      <div class="detail-header">
        <div class="detail-header-left">
          <div class="detail-badges">
            <span class="badge badge--id">{selected.id}</span>
            <span class="badge" style="background:{s.bg}; color:{s.color}; border-color:{s.border};">{s.label}</span>
          </div>
          <h2 class="detail-title">{selected.title}</h2>
        </div>
        <button class="view-proposal-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          View Proposal
        </button>
      </div>

      <!-- Chat thread -->
      <div class="chat-thread">
        {#each mockMessages as msg}
          {#if msg.from === 'developer'}
            <div class="chat-row chat-row--left">
              <div class="avatar avatar--dev">D</div>
              <div class="chat-content">
                <div class="chat-meta">
                  <span>{msg.sender}</span>
                  <span class="separator-dot"></span>
                  <span>{msg.time}</span>
                </div>
                <div class="bubble bubble--dev">{msg.text}</div>
              </div>
            </div>
          {:else}
            <div class="chat-row chat-row--right">
              <div class="chat-content chat-content--right">
                <div class="chat-meta chat-meta--right">
                  <span>{msg.sender}</span>
                  <span class="separator-dot"></span>
                  <span>{msg.time}</span>
                </div>
                <div class="bubble bubble--client">{msg.text}</div>
              </div>
              <div class="avatar avatar--client">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="white" stroke-width="1.5"/>
                </svg>
              </div>
            </div>
          {/if}
        {/each}
      </div>

      <!-- Message input -->
      <div class="chat-input-bar">
        <div class="input-wrap">
          <input
            class="message-input"
            type="text"
            placeholder="Type your message here..."
            bind:value={messageText}
            onkeydown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button class="send-btn" onclick={sendMessage} disabled={!messageText.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    {/if}
  </section>
</div>

<style>
  /* ── Page heading ─────────────────────────────────────────── */
  .page-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
  .page-title {
    font-family: 'Segoe UI', sans-serif;
    font-size: 30px;
    font-weight: 700;
    line-height: 36px;
    letter-spacing: -0.75px;
    color: #f8fafc;
    margin: 0;
  }
  .page-subtitle {
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 24px;
    color: #94a3b8;
    margin: 0;
  }

  /* ── Portal card ──────────────────────────────────────────── */
  .portal-card {
    display: flex;
    width: 100%;
    background-color: #1e293b;
    border: 0.8px solid #334155;
    border-radius: 24px;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    overflow: hidden;
    min-height: 422px;
  }

  /* ── Left list panel ──────────────────────────────────────── */
  .list-panel {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 341px;
    flex-shrink: 0;
    border-right: 0.8px solid #334155;
    padding: 16.8px 0.8px 16.8px 16.8px;
  }
  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
  }
  .list-label {
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: 0.7px;
    text-transform: uppercase;
  }
  .list-count {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 23px;
    height: 24px;
    padding: 4px 8px;
    background-color: #334155;
    border-radius: 9999px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 12px;
    color: #cbd5e1;
  }
  .list-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* ── Commission item ──────────────────────────────────────── */
  .commission-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
    padding: 16px;
    background: transparent;
    border: 0.8px solid transparent;
    border-radius: 16px;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s, border-color 0.15s;
  }
  .commission-item:hover { background-color: rgba(51,65,85,0.5); }
  .commission-item.is-active {
    background-color: #334155;
    border-color: #475569;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1);
  }
  .item-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .item-id {
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 12px;
    color: #3b82f6;
  }
  .item-title {
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #f8fafc;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .commission-item:not(.is-active) .item-title { color: #cbd5e1; }
  .item-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 12px;
    color: #94a3b8;
  }

  /* ── Right detail panel ───────────────────────────────────── */
  .detail-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    background-color: #0f172a;
    border-radius: 0 16px 16px 0;
    overflow: hidden;
  }

  /* Detail header */
  .detail-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 16px;
    background-color: rgba(30,41,59,0.5);
    border-bottom: 0.8px solid #334155;
    flex-shrink: 0;
    min-height: 86px;
  }
  .detail-header-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .detail-badges {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    height: 21.6px;
    border-radius: 9999px;
    border: 0.8px solid transparent;
    font-size: 12px;
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    white-space: nowrap;
  }
  .badge--id {
    background-color: rgba(59,130,246,0.1);
    border-color: rgba(59,130,246,0.2);
    color: #3b82f6;
    font-family: 'Consolas', 'Courier New', monospace;
  }
  .detail-title {
    font-family: 'Segoe UI', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #f8fafc;
    margin: 0;
  }
  .view-proposal-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    height: 36px;
    background: transparent;
    border: none;
    border-radius: 10px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
    color: #94a3b8;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    margin-top: 8px;
    transition: color 0.15s, background 0.15s;
  }
  .view-proposal-btn:hover { color: #f8fafc; background-color: rgba(51,65,85,0.5); }

  /* Chat thread */
  .chat-thread {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    overflow-y: auto;
  }
  .chat-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .chat-row--left  { justify-content: flex-start; }
  .chat-row--right { justify-content: flex-end; }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .avatar--dev    { background-color: #334155; border: 0.8px solid #475569; color: #cbd5e1; }
  .avatar--client { background-color: #3b82f6; }

  .chat-content { display: flex; flex-direction: column; gap: 4px; max-width: 480px; }
  .chat-content--right { align-items: flex-end; }

  .chat-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 12px;
    color: #94a3b8;
  }
  .chat-meta--right { justify-content: flex-end; }

  .bubble {
    padding: 14px 16px;
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 24px;
    width: fit-content;
    max-width: 480px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1);
  }
  .bubble--dev {
    background-color: rgba(51,65,85,0.8);
    border: 0.8px solid #475569;
    color: #cbd5e1;
    border-radius: 6px 16px 16px 16px;
  }
  .bubble--client {
    background-color: #3b82f6;
    color: #f8fafc;
    border-radius: 16px 16px 6px 16px;
  }

  /* Message input bar */
  .chat-input-bar {
    flex-shrink: 0;
    background-color: rgba(30,41,59,0.5);
    border-top: 0.8px solid #334155;
    padding: 16px;
  }
  .input-wrap { position: relative; width: 100%; }
  .message-input {
    width: 100%;
    height: 57.6px;
    background-color: #0f172a;
    border: 0.8px solid #334155;
    border-radius: 14px;
    padding: 16px 52px 16px 16px;
    font-family: 'Segoe UI Emoji', 'Segoe UI', sans-serif;
    font-size: 16px;
    color: #f8fafc;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }
  .message-input::placeholder { color: #64748b; }
  .message-input:focus { border-color: #3b82f6; }

  .send-btn {
    position: absolute;
    right: 10.8px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    background-color: #3b82f6;
    border: none;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.15s;
    padding: 0;
  }
  .send-btn:disabled { opacity: 0.5; cursor: default; }
  .send-btn:not(:disabled):hover { opacity: 0.9; }

  /* Shared dot separator */
  .separator-dot {
    display: inline-block;
    width: 4px;
    height: 4px;
    background-color: #475569;
    border-radius: 9999px;
    flex-shrink: 0;
  }

  /* ── Responsive ───────────────────────────────────────────── */
  @media (max-width: 768px) {
    .portal-card { flex-direction: column; }
    .list-panel { width: 100%; border-right: none; border-bottom: 0.8px solid #334155; }
    .detail-panel { border-radius: 0 0 16px 16px; }
  }
</style>

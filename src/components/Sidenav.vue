<template>
  <nav class="file-sidebar glass-panel">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-mark">M</div>
        <span class="logo-text">Miria Editor</span>
      </div>
    </div>
    
    <div class="sidebar-section">
      <div class="section-title">FILES</div>
      <div class="file-list">
        <div class="file-item active">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
          main.mi
        </div>
        <div class="file-item">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
          utils.mi
        </div>
      </div>
    </div>
    
    <div class="sidebar-footer">
      <button class="new-file-btn">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        New File
      </button>
    </div>
  </nav>
</template>

<script lang="ts">
  export default {
    name: "Sidenav",
  };
</script>

<style scoped>
  .file-sidebar {
    width: 260px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border-color);
    border-top: none;
    border-bottom: none;
    border-left: none;
  }

  .sidebar-header {
    height: 64px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-mark {
    width: 28px;
    height: 28px;
    background: var(--gradient-primary);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 15.5px;
    color: white;
    box-shadow: 0 0 10px rgba(255, 51, 102, 0.4);
  }

  .logo-text {
    font-weight: 600;
    font-size: 16.5px;
    letter-spacing: 0.5px;
  }

  .sidebar-section {
    flex: 1;
    padding: 20px 12px;
  }

  .section-title {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 1px;
    margin-bottom: 12px;
    padding-left: 8px;
  }

  .file-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .file-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 6px;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .file-item:hover {
    background: var(--bg-glass-hover);
    color: var(--text-main);
  }

  .file-item.active {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-main);
    border: 1px solid var(--border-highlight);
  }

  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid var(--border-color);
  }

  .new-file-btn {
    width: 100%;
    background: transparent;
    border: 1px dashed var(--text-muted);
    color: var(--text-muted);
    padding: 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: var(--font-ui);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .new-file-btn:hover {
    border-color: var(--text-main);
    color: var(--text-main);
    background: rgba(255, 255, 255, 0.05);
  }
</style>

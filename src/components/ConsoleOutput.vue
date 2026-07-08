<template>
  <div class="console-body">
    <slot>
      <div class="welcome-message">
        <span class="prompt-arrow">❯</span> Ready for execution.
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
  export default {
    name: "ConsoleOutput",
  };
</script>

<style scoped>
  .console-body {
    height: 100%;
    padding: 12px 16px;
    overflow-y: auto;
    font-family: var(--font-code);
    font-size: 14.5px;
    line-height: 1.6;
    background-color: var(--bg-terminal);
    color: var(--text-terminal);
  }

  .welcome-message {
    color: var(--text-muted);
  }

  .prompt-arrow {
    color: var(--accent-tertiary);
    margin-right: 8px;
  }

  :deep(.output-text) {
    margin: 0;
    color: var(--text-terminal);
    white-space: pre-wrap;
  }

  :deep(.error-msg) {
    color: var(--accent-primary);
    white-space: pre-wrap;
    margin: 0;
  }
</style>

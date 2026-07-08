<template>
  <div class="code-block" :id="id">
    <div class="code-wrapper" ref="codeWrapper">
      <slot></slot>
    </div>
    
    <div v-if="runnable" class="snippet-actions">
      <button @click="runSnippet" class="run-btn">
        <svg xmlns="http://www.w3.org/-2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Run
      </button>
    </div>
    
    <div v-if="showConsole" class="snippet-console">
      <div class="console-header">
        <span class="console-title">Console Output</span>
        <button @click="showConsole = false" class="close-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="console-output">
        <pre>{{ output }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { executeSnippet } from "@/grammar/miria-compiler.js";

export default {
  name: "BaseCodeSnippet",
  props: {
    id: {
      type: String,
      default: () => "snippet-" + Math.random().toString(36).substr(2, 9)
    },
    runnable: {
      type: Boolean,
      default: false
    },
    dependsOn: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showConsole: false,
      output: ""
    };
  },
  methods: {
    runSnippet() {
      const parts = [];
      
      // Get context code
      if (this.dependsOn && this.dependsOn.length > 0) {
        for (const depId of this.dependsOn) {
          const el = document.getElementById(depId);
          if (el) {
            // Find the code element inside the component
            const codeEl = el.querySelector("code");
            if (codeEl) {
              parts.push(codeEl.textContent);
            }
          }
        }
      }
      
      // Get own code
      const codeEl = this.$refs.codeWrapper?.querySelector("code");
      if (codeEl) {
        parts.push(codeEl.textContent);
      }
      
      const fullCode = parts.join("\n\n");
      this.output = executeSnippet(fullCode) || "Program executed successfully (No output).";
      this.showConsole = true;
    }
  }
};
</script>

<style scoped>
.code-wrapper :deep(pre) {
  margin-bottom: 0;
}

.snippet-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid var(--border-color);
}

.run-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--bg-hover);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.run-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  transform: translateY(-1px);
}

.run-btn svg {
  fill: currentColor;
}

.snippet-console {
  margin-top: 1rem;
  background-color: var(--bg-app);
  border-radius: 6px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--bg-panel);
  border-bottom: 1px solid var(--border-color);
}

.console-title {
  font-size: 0.85rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted);
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: var(--border-color);
  color: var(--text-main);
}

.console-output {
  padding: 1rem;
  max-height: 250px;
  overflow-y: auto;
}

.console-output pre {
  margin: 0;
  color: var(--text-main);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>

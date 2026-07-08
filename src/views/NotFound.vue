<template>
  <div class="not-found-container">
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>
    
    <div class="content-wrapper">
      <div class="error-code" data-text="404">404</div>
      <h1 class="error-title">SyntaxError: Page Not Defined</h1>
      
      <p class="error-desc">
        The <code>{{ resource || 'page' }}</code> you are looking for has been refactored out of existence, 
        or maybe it was never declared in the first place.
      </p>

      <div class="terminal-mock">
        <div class="terminal-header">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <span class="terminal-title">bash - miria</span>
        </div>
        <div class="terminal-body">
          <p><span class="prompt">~ $</span> cd /{{ resource || 'unknown' }}</p>
          <p class="term-error">bash: cd: /{{ resource || 'unknown' }}: No such file or directory</p>
          <p><span class="prompt">~ $</span> <span class="cursor">_</span></p>
        </div>
      </div>

      <router-link to="/" class="action-link">
        <button class="return-btn">
          <span>Return to Workspace</span>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "NotFound",
  props: {
    resource: {
      type: String,
      default: "page"
    },
  },
};
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-app);
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
  z-index: 0;
  animation: float 10s ease-in-out infinite alternate;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: var(--accent-primary);
  top: -100px;
  left: -100px;
}

.orb-2 {
  width: 1000px;
  height: 1000px;
  background: var(--accent-secondary);
  top: 50%;
  left: 50%;
  margin-top: -500px;
  margin-left: -500px;
  animation-delay: -5s;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  padding: 40px;
  background: rgba(20, 20, 20, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  position: relative;
  letter-spacing: -5px;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-color);
}

.error-desc {
  color: var(--text-color-muted);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

.error-desc code {
  background: var(--bg-panel);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  color: var(--accent-primary);
}

.terminal-mock {
  width: 100%;
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: 32px;
  text-align: left;
  box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
}

.terminal-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--border-color);
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background-color: #ff5f56; }
.dot.yellow { background-color: #ffbd2e; }
.dot.green { background-color: #27c93f; }

.terminal-title {
  margin-left: auto;
  margin-right: auto;
  font-size: 0.8rem;
  color: var(--text-color-muted);
  font-family: monospace;
}

.terminal-body {
  padding: 16px;
  font-family: 'Fira Code', 'Courier custom', Courier, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
}

.prompt {
  color: var(--accent-primary);
  font-weight: bold;
}

.term-error {
  color: #ff5f56;
  margin: 8px 0;
}

.cursor {
  display: inline-block;
  width: 8px;
  background-color: var(--text-color);
  animation: blink 1s step-end infinite;
}

.action-link {
  text-decoration: none;
}

.return-btn {
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: var(--radius-md, 8px);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #11111b;
  background-color: var(--accent-primary);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.return-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px var(--accent-primary);
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, 30px) scale(1.05); }
  100% { transform: translate(-20px, 20px) scale(0.95); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 768px) {
  .not-found-container {
    padding: 20px;
    align-items: flex-start;
    padding-top: 10vh;
  }
  
  .content-wrapper {
    padding: 24px;
  }
  
  .error-code {
    font-size: 6rem;
  }
}
</style>

<template>
  <div class="docs-layout">
    <!-- Navbar -->
    <header class="docs-navbar">
      <div class="nav-brand">
        <button class="icon-btn mobile-menu-btn" @click="isSidebarOpen = !isSidebarOpen" aria-label="Toggle Menu">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <span class="logo">Miria<span class="logo-dot">.</span></span>
        <span class="version">Docs v1.0</span>
      </div>
      <div class="nav-links" style="display: flex; align-items: center; gap: 8px;">
        <button class="icon-btn" title="Decrease Font Size" @click="decreaseFont" style="font-weight: bold; font-size: 13px; color: var(--text-main); background: transparent; border: none; cursor: pointer; padding: 4px 8px; border-radius: 4px;">
          A-
        </button>
        <button class="icon-btn" title="Increase Font Size" @click="increaseFont" style="font-weight: bold; font-size: 13px; color: var(--text-main); background: transparent; border: none; cursor: pointer; padding: 4px 8px; border-radius: 4px;">
          A+
        </button>

        <button class="icon-btn" title="Toggle Theme" @click="toggleTheme" style="color: var(--text-main); background: transparent; border: none; cursor: pointer; padding: 4px; display: flex; align-items: center; border-radius: 4px;">
          <svg v-if="$store.state.isDark" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
        
        <div class="divider" style="margin: 0 4px; height: 20px; width: 1px; background-color: var(--border-color);"></div>
        
        <a href="https://github.com/DevTony101/miria-code-editor" target="_blank" class="icon-btn github-btn" title="View on GitHub" style="color: var(--text-main); display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; text-decoration: none; padding: 0; background: transparent; border: none;">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>

        <router-link to="/">Back to Editor</router-link>
      </div>
    </header>

    <!-- Mobile Backdrop -->
    <div 
      class="mobile-backdrop" 
      :class="{ 'active': isSidebarOpen }"
      @click="isSidebarOpen = false"
    ></div>

    <div class="docs-container">
      <!-- Sidebar -->
      <aside class="docs-sidebar" :class="{ 'open': isSidebarOpen }">
        <nav class="sidebar-nav">
          <!-- Mobile only Back to Editor -->
          <div class="mobile-only-back">
            <router-link to="/" class="nav-item back-link">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back to Editor
            </router-link>
            <div style="height: 12px;"></div>
          </div>

          <div class="nav-group">
            <div class="nav-group-title">Introduction</div>
            <router-link to="/docs/overview" class="nav-item" active-class="active">Overview</router-link>
            <router-link to="/docs/getting-started" class="nav-item" active-class="active">Getting Started</router-link>
            <router-link to="/docs/variables" class="nav-item" active-class="active">Variables & Typing</router-link>
            <router-link to="/docs/control-flow" class="nav-item" active-class="active">Control Flow</router-link>
            <router-link to="/docs/enums" class="nav-item" active-class="active">Enums</router-link>
            <router-link to="/docs/exceptions" class="nav-item" active-class="active">Exceptions</router-link>
          </div>
          
          <div class="nav-group">
            <div class="nav-group-title">Advanced</div>
            <router-link to="/docs/functions" class="nav-item" active-class="active">Functions</router-link>
            <router-link to="/docs/oop" class="nav-item" active-class="active">Object-Oriented (OOP)</router-link>
            <router-link to="/docs/namespaces" class="nav-item" active-class="active">Namespaces</router-link>
            <router-link to="/docs/dictionaries" class="nav-item" active-class="active">Dictionaries</router-link>
          </div>

          <div class="nav-group">
            <div class="nav-group-title">Standard Library</div>
            <router-link to="/docs/strings-arrays" class="nav-item" active-class="active">Strings & Arrays</router-link>
            <router-link to="/docs/native-libs" class="nav-item" active-class="active">Native Libs</router-link>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="docs-content" ref="docsContent">
        <div class="content-wrapper">
          <router-view @vue:mounted="scrollToTop"></router-view>

          <!-- Prev / Next navigation -->
          <nav class="docs-page-nav">
            <router-link
              v-if="prevPage"
              :to="prevPage.path"
              class="page-nav-btn page-nav-prev"
            >
              <span class="page-nav-arrow">←</span>
              <span class="page-nav-text">
                <span class="page-nav-label">Previous</span>
                <span class="page-nav-title">{{ prevPage.label }}</span>
              </span>
            </router-link>
            <div v-else class="page-nav-spacer"></div>

            <router-link
              v-if="nextPage"
              :to="nextPage.path"
              class="page-nav-btn page-nav-next"
            >
              <span class="page-nav-text">
                <span class="page-nav-label">Next</span>
                <span class="page-nav-title">{{ nextPage.label }}</span>
              </span>
              <span class="page-nav-arrow">→</span>
            </router-link>
            <div v-else class="page-nav-spacer"></div>
          </nav>
        </div>
        
        <footer class="docs-footer">
          <p>Miria Language © 2026.</p>
        </footer>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
const DOC_PAGES = [
  { path: '/docs/overview',        label: 'Overview' },
  { path: '/docs/getting-started', label: 'Getting Started' },
  { path: '/docs/variables',        label: 'Variables & Typing' },
  { path: '/docs/control-flow',     label: 'Control Flow' },
  { path: '/docs/enums',            label: 'Enums' },
  { path: '/docs/exceptions',       label: 'Exceptions' },
  { path: '/docs/functions',        label: 'Functions' },
  { path: '/docs/oop',              label: 'Object-Oriented (OOP)' },
  { path: '/docs/namespaces',       label: 'Namespaces' },
  { path: '/docs/dictionaries',     label: 'Dictionaries' },
  { path: '/docs/strings-arrays',   label: 'Strings & Arrays' },
  { path: '/docs/native-libs',      label: 'Native Libs' },
];

export default {
  name: "DocumentationLayout",
  data() {
    return {
      docFontSize: 14,
      isSidebarOpen: false
    };
  },
  computed: {
    currentIndex() {
      return DOC_PAGES.findIndex(p => p.path === this.$route.path);
    },
    prevPage() {
      return this.currentIndex > 0 ? DOC_PAGES[this.currentIndex - 1] : null;
    },
    nextPage() {
      return this.currentIndex < DOC_PAGES.length - 1 ? DOC_PAGES[this.currentIndex + 1] : null;
    }
  },
  methods: {
    scrollToTop() {
      if (this.$refs.docsContent) {
        this.$refs.docsContent.scrollTo(0, 0);
      }
    },
    decreaseFont() {
      this.docFontSize = Math.max(12, this.docFontSize - 1);
      this.applyFontSize();
    },
    increaseFont() {
      this.docFontSize = Math.min(24, this.docFontSize + 1);
      this.applyFontSize();
    },
    applyFontSize() {
      document.documentElement.style.fontSize = this.docFontSize + 'px';
    },
    toggleTheme() {
      this.$store.dispatch('updateTheme', { isDark: !this.$store.state.isDark });
    }
  },
  mounted() {
    this.applyFontSize();
  },
  unmounted() {
    document.documentElement.style.fontSize = ''; // Reset for the main app
  },
  watch: {
    '$route'() {
      this.scrollToTop();
      this.isSidebarOpen = false;
    }
  }
};
</script>

<style scoped>
/* Docs Layout Container */
.docs-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-app);
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* Navbar */
.docs-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--bg-panel);
  border-bottom: 1px solid var(--border-color);
  height: 60px;
  flex-shrink: 0;
}

.nav-brand {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--text-main);
}

.logo-dot {
  color: var(--accent-secondary);
}

.version {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
  background: var(--border-color);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.nav-links a {
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-hover);
}

.nav-links a:hover {
  color: var(--text-main);
  background-color: var(--border-color);
}

/* Container */
.docs-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.docs-sidebar {
  width: 280px;
  background-color: var(--bg-panel);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
}

.sidebar-nav {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-group-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.nav-item {
  color: var(--text-main);
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  display: block;
}

.nav-item:hover {
  background-color: var(--border-color);
  color: var(--text-main);
}

.nav-item.active {
  background-color: color-mix(in srgb, var(--accent-secondary) 20%, transparent);
  color: var(--accent-secondary);
}

/* Main Content */
.docs-content {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  background-color: var(--bg-app);
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

/* Hero Section */
:deep(.docs-hero) {
  margin-bottom: 4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

:deep(.hero-title) {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 1rem 0;
  letter-spacing: -1px;
}

:deep(.hero-subtitle) {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

/* Sections */
:deep(.docs-section) {
  margin-bottom: 4rem;
}

:deep(.docs-section h2) {
  font-size: 2rem;
  color: var(--text-main);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

:deep(.docs-section h3) {
  font-size: 1.35rem;
  color: var(--text-main);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

:deep(.docs-section p) {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

:deep(code) {
  font-family: 'JetBrains Mono', monospace;
  background-color: var(--bg-hover);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  color: var(--inline-code);
}

/* Code Blocks */
:deep(.code-block) {
  background-color: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

:deep(.code-wrapper) {
  overflow-x: auto;
}

:deep(.code-block pre) {
  margin: 0;
  width: max-content;
}

:deep(.code-block code) {
  background: none;
  padding: 0;
  color: var(--text-main);
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Tips */
:deep(.tip-box) {
  background-color: #8aadf415;
  border-left: 4px solid #8aadf4;
  padding: 1.2rem 1.5rem;
  border-radius: 0 8px 8px 0;
  margin: 2rem 0;
}

:deep(.tip-title) {
  display: block;
  font-size: 0.9rem;
  font-weight: 700;
  color: #8aadf4;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}

:deep(.tip-box p) {
  margin: 0;
  font-size: 1.05rem;
}

/* Page Navigation */
.docs-page-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.page-nav-spacer {
  flex: 1;
}

.page-nav-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-panel);
  text-decoration: none;
  color: var(--text-main);
  transition: all 0.2s ease;
  min-width: 0;
}

.page-nav-btn:hover {
  border-color: var(--accent-secondary)40;
  background-color: var(--accent-secondary)10;
  color: var(--text-main);
}

.page-nav-btn:hover .page-nav-arrow {
  color: var(--accent-secondary);
}

.page-nav-next {
  justify-content: flex-end;
  text-align: right;
}

.page-nav-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.page-nav-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  font-weight: 600;
}

.page-nav-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-nav-arrow {
  font-size: 1.2rem;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: color 0.2s;
}

/* Footer */
.docs-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: var(--text-muted);
  font-size: 1rem;
  padding-bottom: 3rem;
}

/* Details and Summary Collapsibles */
:deep(.docs-details) {
  background-color: #1a1a1f;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

:deep(.docs-details summary) {
  cursor: pointer;
  padding: 1.2rem 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-main);
  list-style: none;
  display: flex;
  align-items: center;
  background-color: var(--bg-app);
  transition: background-color 0.2s;
}

:deep(.docs-details summary::-webkit-details-marker) {
  display: none;
}

:deep(.docs-details summary::before) {
  content: "▶";
  font-size: 0.9rem;
  margin-right: 1rem;
  color: var(--accent-secondary);
  transition: transform 0.2s ease;
}

:deep(.docs-details[open] summary::before) {
  transform: rotate(90deg);
}

:deep(.docs-details[open] summary) {
  border-bottom: 1px solid var(--border-color);
}

:deep(.docs-details summary h3) {
  margin: 0;
  padding: 0;
  font-size: 1.35rem;
  border: none;
}

:deep(.docs-details summary:hover) {
  background-color: var(--bg-panel);
}

:deep(.details-content) {
  padding: 1.5rem;
  background-color: #1a1a1f;
}

/* Scrollbar colors (inherits size from global.css) */
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #52525b;
}
.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  padding: 4px;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .mobile-only-back {
    display: none;
  }
  
  .mobile-backdrop {
    display: none;
  }
  
  .mobile-backdrop.active {
    display: block;
    position: fixed;
    top: 60px; /* Below navbar */
    left: 0;
    width: 100vw;
    height: calc(100vh - 60px);
    background: rgba(0, 0, 0, 0.4);
    z-index: 90; /* below sidebar (100) */
    backdrop-filter: blur(2px);
  }
  .docs-navbar {
    padding: 1rem;
  }
  .nav-brand {
    gap: 0.5rem;
  }
  .docs-sidebar {
    position: absolute;
    left: 0;
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 100;
    transform: translateX(-100%);
    box-shadow: 4px 0 16px rgba(0,0,0,0.2);
  }
  .docs-sidebar.open {
    transform: translateX(0);
  }
  .docs-content {
    padding: 1.5rem !important;
  }
  .page-title {
    font-size: 2.2rem !important;
  }
  .nav-brand .version {
    display: none;
  }
  .nav-links a:not(.github-btn) {
    display: none;
  }
  .nav-links .divider {
    display: none;
  }
  .mobile-only-back {
    display: block;
  }
  .back-link {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-hover) !important;
    border: 1px solid var(--border-color);
  }
  .docs-page-nav {
    flex-direction: column;
    gap: 1rem;
  }
  .page-nav-spacer {
    display: none;
  }
  .page-nav-btn {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>

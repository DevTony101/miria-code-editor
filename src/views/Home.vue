<template>
  <div class="ide-container" @click="closeContextMenu">
    
    <!-- Custom Toast Notifications -->
    <div class="toast-container">
      <transition-group name="toast-slide">
        <div class="custom-toast" v-for="toast in toastQueue" :key="toast.id" :class="toast.type">
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div class="toast-content">
            <strong>{{ toast.title }}</strong>
            <span v-if="toast.text">{{ toast.text }}</span>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Unified Alert Modal -->
    <transition name="fade">
      <div class="glass-modal-overlay" v-if="showAlertModal" @click.self="showAlertModal = false">
        <div class="premium-modal alert-modal" style="max-width: 400px; width: 90%;">
          <div class="premium-modal-header" :style="{ borderBottomColor: alertConfig.isError ? 'var(--error)' : 'var(--border)' }">
            <h3 :style="{ color: alertConfig.isError ? 'var(--error)' : 'var(--text-main)' }">{{ alertConfig.title }}</h3>
            <button class="close-btn" @click="showAlertModal = false">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="premium-modal-body" style="padding-bottom: 24px;">
            <p style="font-size: 16.5px; line-height: 1.5; color: var(--text-main); margin: 0;">{{ alertConfig.text }}</p>
          </div>
          <div class="modal-actions" style="padding: 0 24px 24px; display: flex; justify-content: flex-end; gap: 12px;">
            <button v-if="alertConfig.onConfirm" class="modal-btn outline" @click="showAlertModal = false" style="padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); cursor: pointer; font-size: 15.5px;">{{ alertConfig.cancelText }}</button>
            <button class="modal-btn primary" @click="handleAlertConfirm" :style="{ backgroundColor: alertConfig.isError ? 'var(--error)' : 'var(--accent-primary)' }" style="padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; font-size: 15.5px;">{{ alertConfig.confirmText }}</button>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Premium Settings Modal -->
    <transition name="fade">
      <div class="glass-modal-overlay" v-if="showSettingsModal" @click.self="showSettingsModal = false">
        <div class="premium-modal">
          <div class="premium-modal-header">
            <h3>Preferences</h3>
            <button class="close-btn" @click="showSettingsModal = false">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="premium-modal-body">
            
            <div class="setting-row">
              <div class="setting-info">
                <h4>Appearance</h4>
                <p>Toggle Dark/Light mode.</p>
              </div>
              <div class="theme-toggles">
                <button class="theme-toggle" :class="{ active: settings.isDark }" @click="settings.isDark = true; applySettings()">
                  <span class="theme-preview dark-preview"></span> Dark
                </button>
                <button class="theme-toggle" :class="{ active: !settings.isDark }" @click="settings.isDark = false; applySettings()">
                  <span class="theme-preview light-preview"></span> Light
                </button>
              </div>
            </div>

            <div class="setting-row card-layout">
              <div class="setting-info">
                <h4>Color Palette</h4>
                <p>Choose your accent colors and background tints.</p>
              </div>
              <div class="theme-cards">
                
                <div class="theme-card" :class="{ active: settings.colorTheme === 'catppuccin' }" @click="settings.colorTheme = 'catppuccin'; applySettings()">
                  <div class="card-preview" style="background: #1e1e2e; border: 1px solid #313244">
                     <div class="preview-header" style="background: #11111b"></div>
                     <div class="preview-body">
                       <span class="preview-text" style="background: #cdd6f4"></span>
                       <span class="preview-btn" style="background: #f5c2e7"></span>
                     </div>
                  </div>
                  <span class="card-label">Catppuccin</span>
                </div>
                
                <div class="theme-card" :class="{ active: settings.colorTheme === 'ocean' }" @click="settings.colorTheme = 'ocean'; applySettings()">
                  <div class="card-preview" style="background: #15202b; border: 1px solid #22303f">
                     <div class="preview-header" style="background: #0d131a"></div>
                     <div class="preview-body">
                       <span class="preview-text" style="background: #cdd6f4"></span>
                       <span class="preview-btn" style="background: #00b4d8"></span>
                     </div>
                  </div>
                  <span class="card-label">Ocean</span>
                </div>

                <div class="theme-card" :class="{ active: settings.colorTheme === 'sunset' }" @click="settings.colorTheme = 'sunset'; applySettings()">
                  <div class="card-preview" style="background: #2b2215; border: 1px solid #3f3222">
                     <div class="preview-header" style="background: #1a150d"></div>
                     <div class="preview-body">
                       <span class="preview-text" style="background: #f4d6cd"></span>
                       <span class="preview-btn" style="background: #f77f00"></span>
                     </div>
                  </div>
                  <span class="card-label">Sunset</span>
                </div>

                <div class="theme-card" :class="{ active: settings.colorTheme === 'forest' }" @click="settings.colorTheme = 'forest'; applySettings()">
                  <div class="card-preview" style="background: #152b22; border: 1px solid #223f32">
                     <div class="preview-header" style="background: #0d1a13"></div>
                     <div class="preview-body">
                       <span class="preview-text" style="background: #cdf4d6"></span>
                       <span class="preview-btn" style="background: #2a9d8f"></span>
                     </div>
                  </div>
                  <span class="card-label">Forest</span>
                </div>

              </div>
            </div>
            
            <div class="setting-row">
              <div class="setting-info">
                <h4>Typography Scale</h4>
                <p>Adjust the editor's font size.</p>
              </div>
              <div class="font-scaler">
                <button class="scaler-btn" @click="settings.fontSize = Math.max(10, settings.fontSize - 1); applySettings()">A-</button>
                <span class="scaler-value">{{ settings.fontSize }}px</span>
                <button class="scaler-btn" @click="settings.fontSize = Math.min(30, settings.fontSize + 1); applySettings()">A+</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </transition>

    <!-- Samples Modal -->
    <transition name="fade">
      <div class="glass-modal-overlay" v-if="showSamplesModal" @click.self="showSamplesModal = false">
        <div class="premium-modal samples-modal">
          <div class="premium-modal-header">
            <h3>Sample Projects</h3>
            <button class="close-btn" @click="showSamplesModal = false">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div class="samples-modal-body">
            <div class="samples-tabs">
              <button 
                v-for="cat in sampleCategories" 
                :key="cat"
                class="sample-tab"
                :class="{ active: selectedSampleCategory === cat }"
                @click="selectedSampleCategory = cat"
              >
                {{ cat }}
              </button>
            </div>
            <div class="samples-grid">
              <div 
                v-for="sample in allSamples.filter(s => s.category === selectedSampleCategory)" 
                :key="sample.id"
                class="sample-card"
                @click="loadSample(sample)"
              >
                <h4>{{ sample.title }}</h4>
                <p>{{ sample.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Floating Top Toolbar -->
    <header class="ide-toolbar">
      <div class="toolbar-left">
        <button class="icon-btn" title="Toggle Explorer" @click="isSidebarCollapsed = !isSidebarCollapsed">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
        </button>
        
        <div class="brand-group">
          <span class="logo">Miria<span class="logo-dot">.</span></span>
          <div class="divider"></div>
          
          <!-- Inline Project Name Editing -->
          <div class="project-name-container">
            <input v-if="isEditingProject" 
                   v-model="projectName" 
                   class="project-name-input" 
                   ref="projectNameInput"
                   @blur="isEditingProject = false" 
                   @keyup.enter="isEditingProject = false" />
            <div v-else class="project-name" @click="editProjectName" title="Rename Project">
              {{ projectName }}
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </div>
          </div>
        </div>
        
        <div class="toolbar-link" style="cursor: pointer; display: flex; align-items: center;" @click="showSamplesModal = true">
          Samples
        </div>
        <router-link to="/docs" class="toolbar-link" target="_blank" style="margin-left: 16px;">
          Docs
        </router-link>
      </div>
      
      <div class="toolbar-right">
        <!-- New Project Button -->
        <button class="icon-btn" title="New Project" @click="showUnifiedAlert('Create New Project', 'Current unsaved changes will be lost. Do you want to proceed?', 'Create Project', 'Cancel', () => confirmNewProject())">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        </button>

        <button class="icon-btn" title="Download Zip" @click="downloadZip">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </button>
        
        <button class="icon-btn theme-btn" title="Settings" @click="openSettingsModal">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>

        <a href="https://github.com/DevTony101/miria-code-editor" target="_blank" class="icon-btn theme-btn" title="View on GitHub" style="display: flex; align-items: center; justify-content: center; text-decoration: none;">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>

        <!-- Global Run Project Button -->
        <button class="run-project-btn" title="Run Project (Executes main.mi)" @click="executeProject">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Run</span>
        </button>
      </div>
    </header>

    <div class="ide-body">
      <!-- Mobile Backdrop -->
      <div 
        class="mobile-backdrop" 
        :class="{ 'active': !isSidebarCollapsed }"
        @click="isSidebarCollapsed = true"
      ></div>

      <!-- File Explorer (Floating Island Style) with native width animation -->
      <aside class="sidebar-container" :class="{ 'collapsed': isSidebarCollapsed }">
        
        <!-- Mobile Global Links -->
        <div class="sidebar-panel mobile-nav-panel">
          <div class="mobile-nav-item" @click="showSamplesModal = true; isSidebarCollapsed = true">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            Samples
          </div>
          <router-link to="/docs" class="mobile-nav-item" target="_blank">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            Documentation
          </router-link>
        </div>

        <div class="sidebar-panel">
          <div class="sidebar-header">
            <span>EXPLORER</span>
            <div class="sidebar-actions">
              <button class="icon-btn mini" title="Expand All" @click="expandAllFolders">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
              </button>
              <button class="icon-btn mini" title="Collapse All" @click="collapseAllFolders">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
              </button>
              <button class="icon-btn mini" title="New File" @click="startNewItem('file')">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
              </button>
              <button class="icon-btn mini" title="New Folder" @click="startNewItem('folder')">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="12" y1="11" x2="12" y2="17"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>
              </button>
            </div>
          </div>
          <div class="file-tree" @contextmenu.prevent.self="showSidebarContextMenu($event, fileSystem[0].id, 'folder')">
              <div class="tree-node" v-for="folder in fileSystem" :key="folder.id">
              <div class="tree-item folder" @click="folder.isOpen = !folder.isOpen" @contextmenu.prevent="showSidebarContextMenu($event, folder.id, 'folder')">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="chevron" :class="{ rotated: folder.isOpen }"><polyline points="9 18 15 12 9 6"></polyline></svg>
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="var(--accent-tertiary)" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                {{ folder.name }}
              </div>
              <div class="tree-children" v-show="folder.isOpen">
                
                <!-- Inline input for new files/folders -->
                <div v-if="newItem.parentId === folder.id" class="tree-item inline-input-wrapper">
                  <svg v-if="newItem.type === 'file'" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path></svg>
                  <svg v-else viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="var(--accent-tertiary)"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  <input class="inline-input" 
                         v-model="newItem.name" 
                         ref="newItemInput" 
                         @blur="commitNewItem" 
                         @keyup.enter="commitNewItem" 
                         @keyup.esc="cancelNewItem"
                         :placeholder="newItem.type === 'file' ? 'filename.mi' : 'folder_name'">
                </div>

                <template v-for="file in folder.children" :key="file.id">
                  <div v-if="file.children" class="tree-node">
                    <div class="tree-item folder" @click="file.isOpen = !file.isOpen" @contextmenu.prevent="showSidebarContextMenu($event, file.id, 'folder')">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="chevron" :class="{ rotated: file.isOpen }"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="var(--accent-tertiary)" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                      {{ file.name }}
                    </div>
                    <div class="tree-children" v-show="file.isOpen">
                      <div v-if="newItem.parentId === file.id" class="tree-item inline-input-wrapper">
                        <svg v-if="newItem.type === 'file'" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path></svg>
                        <svg v-else viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="var(--accent-tertiary)"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <input class="inline-input" v-model="newItem.name" ref="newItemInput" @blur="commitNewItem" @keyup.enter="commitNewItem" @keyup.esc="cancelNewItem" :placeholder="newItem.type === 'file' ? 'filename.mi' : 'folder_name'">
                      </div>

                      <div class="tree-item file" v-for="subfile in file.children" :key="subfile.id" :class="{ active: activeFileId === subfile.id }" @click="openFile(subfile.id)" draggable="true" @dragstart="dragFileFromTree($event, subfile.id)" @contextmenu.prevent="showSidebarContextMenu($event, subfile.id, 'file')">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                        {{ subfile.name }}
                      </div>
                    </div>
                  </div>
                  <div v-else class="tree-item file" :class="{ active: activeFileId === file.id }" @click="openFile(file.id)" draggable="true" @dragstart="dragFileFromTree($event, file.id)" @contextmenu.prevent="showSidebarContextMenu($event, file.id, 'file')">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    {{ file.name }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Project Structure Island -->
        <div class="sidebar-panel structure-panel">
          <div class="sidebar-header">
            <span>STRUCTURE</span>
          </div>
          <div class="file-tree structure-tree" v-if="activeFileStructure.length > 0">
            <div class="tree-item structure-item" v-for="node in activeFileStructure" :key="node.name + node.type" @click="goToStructure(node)">
              <svg v-if="node.type === 'class'" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              <svg v-else-if="node.type === 'function'" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              <svg v-else-if="node.type === 'namespace'" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              <svg v-else viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle></svg>
              <span class="structure-type">{{ node.type }}</span>
              <span class="structure-name">{{ node.name }}</span>
            </div>
          </div>
          <div class="file-tree structure-empty" v-else>
            No structure detected.
          </div>
        </div>
      </aside>
      
      <!-- Main Workspace -->
      <main class="main-area">
        
        <!-- Multi-pane Editor Section -->
        <div class="editor-panes-container">
          <div class="editor-panel" v-for="pane in panes" :key="pane.id"
               @dragover.prevent="onDragOverPane($event, pane.id)"
               @drop="onDropPane($event, pane.id)"
               @dragleave="onDragLeavePane($event, pane.id)">
               
            <div class="drop-indicator right" v-show="pane.showDropRight"></div>
            
            <!-- Editor Tabs -->
            <div class="editor-tabs" @dragover.prevent @drop="onDropTab($event, pane.id)">
              <div class="tabs-scroll">
                <div class="editor-tab" v-for="tabId in pane.openTabsIds" :key="tabId" :class="{ active: pane.currentFileId === tabId, 'global-active': activeFileId === tabId }" @click="openFileInPane(pane.id, tabId)" draggable="true" @dragstart="dragTab($event, pane.id, tabId)" @contextmenu.prevent="showContextMenu($event, tabId)">
                  
                  <template v-if="editingTabId === tabId">
                    <input :ref="'tabInput_' + tabId" :value="getFileById(tabId).name.replace('.mi', '')" 
                           @blur="commitTabName($event, tabId)" 
                           @keyup.enter="commitTabName($event, tabId)"
                           class="tab-name-input" />
                    <span class="tab-extension">.mi</span>
                  </template>
                  <template v-else>
                    <span @dblclick="beginEditTabName(tabId)">{{ getFileById(tabId).name }}</span>
                  </template>

                  <span class="tab-close" @click.stop="closeTab(pane.id, tabId)">
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </span>
                </div>
                <div class="editor-tab new-tab-btn" title="New File" @click="createNewTab(pane.id)">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
              </div>
            </div>
            
            <div class="editor-content" v-if="pane.currentFileId" @click="activeFileId = pane.currentFileId" @contextmenu.prevent="showContextMenu($event, pane.currentFileId)" :style="{ fontSize: settings.fontSize + 'px' }">
              <CodeMirrorEditor ref="cmEditor" v-model="getFileById(pane.currentFileId).content" :options="cmOptions"></CodeMirrorEditor>
            </div>
            <div class="editor-empty" v-else>
              <div class="empty-state">
                <span class="empty-icon">📝</span>
                <p>Drag files here</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Terminal Panel -->
        <div class="terminal-panel" :class="{ 'collapsed': isTerminalCollapsed, 'resizing': isResizingTerminal }" :style="{ height: isTerminalCollapsed ? '44px' : terminalHeight + 'px' }">
          <div class="terminal-resizer" @mousedown.prevent="startResizeTerminal" v-show="!isTerminalCollapsed"></div>
          <div class="terminal-header" @click="isTerminalCollapsed = !isTerminalCollapsed">
            <div class="term-tabs">
              <span class="term-tab active" @click.stop>OUTPUT</span>
            </div>
            <div class="term-actions">
              <button class="icon-btn" title="Copy Output" @click.stop="copyOutput" v-if="!isTerminalCollapsed && output">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
              <button class="icon-btn" title="Toggle Terminal" @click.stop="isTerminalCollapsed = !isTerminalCollapsed">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" class="chevron" :class="{ rotated: isTerminalCollapsed }"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>
          </div>
          <div class="terminal-content" v-show="!isTerminalCollapsed">
            <ConsoleOutput>
              <template v-if="!showDefaultOutput">
                <pre v-if="codeHasErrors" class="error-msg">{{ output }}</pre>
                <template v-else>
                  <pre v-if="wasExecuted" class="output-text">{{ output }}</pre>
                </template>
              </template>
            </ConsoleOutput>
          </div>
        </div>

      </main>
    </div>
    
    <!-- Custom Context Menu -->
    <div v-show="contextMenu.show" class="context-menu" :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }">
      <div class="context-item" @click="prettifyCodeCtx">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
        Prettify Code
      </div>
      <div class="context-item" @click="compileCodeCtx">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
        Compile (Syntax Check)
      </div>
    </div>
    
    <!-- Sidebar Context Menu -->
    <div v-show="sidebarContextMenu.show" class="context-menu" :style="{ top: sidebarContextMenu.y + 'px', left: sidebarContextMenu.x + 'px' }">
      <template v-if="sidebarContextMenu.targetType === 'folder'">
        <div class="context-item" @click="startNewItem('file', sidebarContextMenu.targetId); closeSidebarContextMenu()">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path></svg>
          New File
        </div>
        <div class="context-item" @click="startNewItem('folder', sidebarContextMenu.targetId); closeSidebarContextMenu()">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          New Folder
        </div>
      </template>
      <template v-else>
        <div class="context-item" @click="deleteFileCtx">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Delete File
        </div>
      </template>
    </div>
    
  </div>
</template>

<script lang="ts">
  import { mapState, mapGetters, mapActions } from "vuex";
  import JSZip from "jszip";
  import { saveAs } from "file-saver";
  
  import CodeMirrorEditor from "../components/CodeMirrorEditor.vue";
  import { compileMiriaProject, executeMiriaCode } from "@/grammar/miria-compiler";
  import "../grammar/parser/miriaHighlight";
  
  import "codemirror/theme/eclipse.css";
  import "codemirror/theme/material-darker.css";
  import "codemirror/addon/fold/foldgutter.css";
  
  import ConsoleOutput from "../components/ConsoleOutput.vue";
  import { categories, samples } from "../samples/samplesData";

  export default {
    name: "Home",
    data: function () {
      return {
        projectName: "miria_project",
        isEditingProject: false,
        showAlertModal: false,
        showSamplesModal: false,
        selectedSampleCategory: categories[0],
        sampleCategories: categories,
        allSamples: samples,
        alertConfig: { title: '', text: '', confirmText: 'OK', cancelText: 'Cancel', onConfirm: null, isError: false },
        showSettingsModal: false,
        editingTabId: null,
        
        settings: {
          fontSize: 16,
          isDark: true,
          colorTheme: 'catppuccin'
        },
        
        cmOptions: {
          tabSize: 4,
          mode: "miria",
          theme: "material-darker",
          lineNumbers: true,
          styleActiveLine: true,
          viewportMargin: Infinity,
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        },
        isSidebarCollapsed: window.innerWidth <= 768,
        isTerminalExpanded: false,
        isTerminalMaximized: false,
        isTerminalCollapsed: false,
        terminalHeight: 220,
        isResizingTerminal: false,
        
        fileSystem: [
          {
            id: 'folder_src',
            name: 'src',
            isOpen: true,
            children: [
              { id: 'file_main', name: 'main.mi', content: 'define main as fun() -> void {\n  log("Hello World!")\n}' }
            ]
          }
        ] as any[],
        
        panes: [
          { id: 'pane_1', openTabsIds: ['file_main'], currentFileId: 'file_main', showDropRight: false }
        ],
        paneCounter: 1,
        activeFileId: 'file_main',
        
        newItem: {
          type: null,
          parentId: null,
          name: ''
        },
        
        contextMenu: {
          show: false,
          x: 0,
          y: 0,
          targetFileId: null
        },
        sidebarContextMenu: {
          show: false,
          x: 0,
          y: 0,
          targetId: null,
          targetType: null
        },
        
        showDefaultOutput: true,
        wasExecuted: false,
        toastQueue: [],
      };
    },
    mounted() {
      let savedFontSize = window.localStorage.getItem("miriaFontSize");
      if (savedFontSize) this.settings.fontSize = parseInt(savedFontSize);
      
      this.settings.isDark = this.isDark;
      this.settings.colorTheme = this.colorTheme;
      this.updateCmTheme(this.isDark);
      
      import("codemirror/addon/fold/foldcode.js");
      import("codemirror/addon/fold/foldgutter.js");
      import("codemirror/addon/fold/brace-fold.js");
      import("codemirror/addon/selection/active-line.js");
    },
    methods: {
      copyOutput() {
        if (this.output) {
          navigator.clipboard.writeText(this.output).then(() => {
            this.addToast("Copied", "Output copied to clipboard!", "success");
          }).catch(err => {
            this.addToast("Error", "Failed to copy output", "error");
            console.error("Copy error:", err);
          });
        }
      },
      showUnifiedAlert(title, text, confirmText, cancelText, onConfirm, isError = false) {
        this.alertConfig = { title, text, confirmText, cancelText, onConfirm, isError };
        this.showAlertModal = true;
      },
      handleAlertConfirm() {
        this.showAlertModal = false;
        if (this.alertConfig.onConfirm) {
          this.alertConfig.onConfirm();
        }
      },
      expandAllFolders() {
        function expand(items) {
          for (let item of items) {
            if (item.children) {
              item.isOpen = true;
              expand(item.children);
            }
          }
        }
        expand(this.fileSystem);
      },
      collapseAllFolders() {
        function collapse(items) {
          for (let item of items) {
            if (item.children) {
              item.isOpen = false;
              collapse(item.children);
            }
          }
        }
        collapse(this.fileSystem);
      },
      ...mapActions(["updateTheme"]),
      openSettingsModal() {
        let savedFontSize = window.localStorage.getItem("miriaFontSize");
        if (savedFontSize) this.settings.fontSize = parseInt(savedFontSize);
        
        this.settings.isDark = this.isDark;
        this.settings.colorTheme = this.colorTheme;
        this.showSettingsModal = true;
      },
      applySettings: function () {
        window.localStorage.setItem("miriaFontSize", this.settings.fontSize);
        this.updateTheme({ isDark: this.settings.isDark, colorTheme: this.settings.colorTheme });
        this.updateCmTheme(this.settings.isDark);
      },
      updateCmTheme(isDark) {
        this.cmOptions = {
          ...this.cmOptions,
          theme: isDark ? "material-darker" : "eclipse",
        };
      },
      
      // Project Methods
      editProjectName() {
        this.isEditingProject = true;
        this.$nextTick(() => {
          this.$refs.projectNameInput.focus();
        });
      },
      confirmNewProject() {
        this.projectName = "untitled_project";
        this.fileSystem = [{
          id: 'folder_src', name: 'src', isOpen: true, children: [
            { id: 'file_main', name: 'main.mi', content: 'define main as fun() -> void {\n  log("Hello World!")\n}' }
          ]
        }];
        this.panes = [{ id: 'pane_1', openTabsIds: ['file_main'], currentFileId: 'file_main', showDropRight: false }];
        this.activeFileId = 'file_main';
        this.paneCounter = 1;
        this.showNewProjectModal = false;
      },
      
      // Helpers
      sanitizeFileName(name) {
        if (!name) return "untitled";
        if (name.includes('.')) {
          name = name.substring(0, name.indexOf('.'));
        }
        name = name.replace(/[^a-zA-Z0-9_-]/g, '');
        return name || "untitled";
      },
      getFileById(id) {
        let found = null;
        function search(items) {
          for (const item of items) {
            if (item.id === id) found = item;
            else if (item.children && !found) search(item.children);
          }
        }
        search(this.fileSystem);
        return found;
      },
      openFile(id) {
        let targetPane = this.panes[0];
        if (!targetPane.openTabsIds.includes(id)) {
          targetPane.openTabsIds.push(id);
        }
        targetPane.currentFileId = id;
        this.activeFileId = id;
      },
      openFileInPane(paneId, fileId) {
        let pane = this.panes.find(p => p.id === paneId);
        pane.currentFileId = fileId;
        this.activeFileId = fileId;
      },
      closeTab(paneId, fileId) {
        let pane = this.panes.find(p => p.id === paneId);
        pane.openTabsIds = pane.openTabsIds.filter(tid => tid !== fileId);
        if (pane.currentFileId === fileId) {
          pane.currentFileId = pane.openTabsIds.length > 0 ? pane.openTabsIds[0] : null;
          this.activeFileId = pane.currentFileId;
        }
        if (pane.openTabsIds.length === 0 && this.panes.length > 1) {
          this.panes = this.panes.filter(p => p.id !== paneId);
        }
      },
      
      createNewTab(paneId) {
        let folder = this.fileSystem[0];
        let baseName = "untitled";
        let count = 1;
        while (folder.children.some(c => c.name === `${baseName}-${count}.mi`)) count++;
        let newName = `${baseName}-${count}.mi`;
        let newId = 'file_' + Date.now();
        folder.children.push({ id: newId, name: newName, content: "" });
        
        let pane = this.panes.find(p => p.id === paneId);
        pane.openTabsIds.push(newId);
        pane.currentFileId = newId;
        this.activeFileId = newId;
        
        this.beginEditTabName(newId);
      },
      beginEditTabName(tabId) {
        this.editingTabId = tabId;
        this.$nextTick(() => {
          let ref = this.$refs['tabInput_' + tabId];
          let el = Array.isArray(ref) ? ref[0] : ref;
          if (el) {
             el.focus();
             el.select();
          }
        });
      },
      commitTabName(event, tabId) {
        if (this.editingTabId !== tabId) return;
        let newName = this.sanitizeFileName(event.target.value.trim());
        newName += '.mi';
        
        let file = this.getFileById(tabId);
        let folder = null;
        function findParent(items) {
          for (let item of items) {
            if (item.children && item.children.some(c => c.id === tabId)) folder = item;
            else if (item.children && !folder) findParent(item.children);
          }
        }
        findParent(this.fileSystem);

        if (folder && folder.children.some(c => c.id !== tabId && c.name === newName)) {
           this.addToast("Error", "A file with this name already exists.", "error");
        } else {
           file.name = newName;
        }
        this.editingTabId = null;
      },
      
      startNewItem(type: any, parentId: any = null) {
        let parent = parentId || this.fileSystem[0].id;
        let folder = null;
        function findFolder(items) {
          for (let item of items) {
            if (item.id === parent) folder = item;
            else if (item.children && !folder) findFolder.call(this, item.children);
          }
        }
        findFolder.call(this, this.fileSystem);
        if(folder) folder.isOpen = true;
        
        this.newItem = {
          type: type,
          parentId: parent,
          name: ''
        };
        this.$nextTick(() => {
          let ref = this.$refs.newItemInput;
          let el = Array.isArray(ref) ? ref[0] : ref;
          if (el) {
            el.focus();
          }
        });
      },
      commitNewItem() {
        if (!this.newItem.name || this.newItem.name.trim() === '') {
          this.cancelNewItem();
          return;
        }
        
        let folder = null;
        function findFolder(items) {
          for (let item of items) {
            if (item.id === this.newItem.parentId) folder = item;
            else if (item.children && !folder) findFolder.call(this, item.children);
          }
        }
        findFolder.call(this, this.fileSystem);
        
        let name = this.sanitizeFileName(this.newItem.name.trim());
        
        if (this.newItem.type === 'file') {
          name += '.mi';
        }
        
        if (folder.children.some(child => child.name === name)) {
           this.addToast("Error", "A file or folder with this name already exists.", "error");
           return;
        }

        if (this.newItem.type === 'file') {
          let newId = 'file_' + Date.now();
          folder.children.push({ id: newId, name, content: "" });
          this.openFile(newId);
        } else {
          let newId = 'folder_' + Date.now();
          folder.children.push({ id: newId, name, isOpen: true, children: [] });
        }
        this.cancelNewItem();
      },
      cancelNewItem() {
        this.newItem = { type: null, parentId: null, name: '' };
      },

      dragFileFromTree(event, fileId) {
        event.dataTransfer.setData('fileId', fileId);
        event.dataTransfer.setData('source', 'tree');
      },
      dragTab(event, paneId, fileId) {
        event.dataTransfer.setData('fileId', fileId);
        event.dataTransfer.setData('sourcePaneId', paneId);
      },
      onDragOverPane(event, paneId) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        let pane = this.panes.find(p => p.id === paneId);
        if (x > rect.width * 0.7 && this.panes.length < 3) {
          pane.showDropRight = true;
        } else {
          pane.showDropRight = false;
        }
      },
      onDragLeavePane(event, paneId) {
        let pane = this.panes.find(p => p.id === paneId);
        if(pane) pane.showDropRight = false;
      },
      onDropTab(event, paneId) {
        event.stopPropagation();
        const fileId = event.dataTransfer.getData('fileId');
        const sourcePaneId = event.dataTransfer.getData('sourcePaneId');
        
        if (sourcePaneId && sourcePaneId !== paneId) {
          this.closeTab(sourcePaneId, fileId);
        }
        
        let pane = this.panes.find(p => p.id === paneId);
        if (pane && !pane.openTabsIds.includes(fileId)) {
          pane.openTabsIds.push(fileId);
        }
        pane.currentFileId = fileId;
        this.activeFileId = fileId;
        pane.showDropRight = false;
      },
      onDropPane(event, paneId) {
        const fileId = event.dataTransfer.getData('fileId');
        const sourcePaneId = event.dataTransfer.getData('sourcePaneId');
        let pane = this.panes.find(p => p.id === paneId);
        
        if (pane.showDropRight && this.panes.length < 3) {
          this.paneCounter++;
          let newPane = { id: 'pane_' + this.paneCounter, openTabsIds: [fileId], currentFileId: fileId, showDropRight: false };
          let index = this.panes.findIndex(p => p.id === paneId);
          this.panes.splice(index + 1, 0, newPane);
          
          if (sourcePaneId) {
            this.closeTab(sourcePaneId, fileId);
          }
        } else {
          if (!pane.openTabsIds.includes(fileId)) {
            pane.openTabsIds.push(fileId);
          }
          pane.currentFileId = fileId;
        }
        this.activeFileId = fileId;
        pane.showDropRight = false;
      },
      
      startResizeTerminal(e) {
        this.isResizingTerminal = true;
        document.addEventListener('mousemove', this.resizeTerminal);
        document.addEventListener('mouseup', this.stopResizeTerminal);
      },
      resizeTerminal(e) {
        if (!this.isResizingTerminal) return;
        let newHeight = window.innerHeight - e.clientY;
        if (newHeight < 100) newHeight = 100;
        if (newHeight > window.innerHeight * 0.8) newHeight = window.innerHeight * 0.8;
        this.terminalHeight = newHeight;
      },
      stopResizeTerminal() {
        this.isResizingTerminal = false;
        document.removeEventListener('mousemove', this.resizeTerminal);
        document.removeEventListener('mouseup', this.stopResizeTerminal);
      },

      showContextMenu(e, fileId) {
        this.closeSidebarContextMenu();
        this.contextMenu.show = true;
        this.contextMenu.x = e.clientX;
        this.contextMenu.y = e.clientY;
        this.contextMenu.targetFileId = fileId;
      },
      closeContextMenu() {
        this.contextMenu.show = false;
        this.closeSidebarContextMenu();
      },
      showSidebarContextMenu(e, id, type) {
        this.contextMenu.show = false;
        this.sidebarContextMenu.show = true;
        this.sidebarContextMenu.x = e.clientX;
        this.sidebarContextMenu.y = e.clientY;
        this.sidebarContextMenu.targetId = id;
        this.sidebarContextMenu.targetType = type;
      },
      closeSidebarContextMenu() {
        this.sidebarContextMenu.show = false;
      },
      deleteFileCtx() {
        if(this.sidebarContextMenu.targetId) {
          let id = this.sidebarContextMenu.targetId;
          function removeRecursive(items) {
            for (let i = 0; i < items.length; i++) {
              if (items[i].id === id) {
                items.splice(i, 1);
                return true;
              }
              if (items[i].children) {
                if (removeRecursive(items[i].children)) return true;
              }
            }
            return false;
          }
          removeRecursive(this.fileSystem);
          // If the file is open in any panes, close it
          for (let pane of this.panes) {
            if (pane.openTabsIds.includes(id)) {
              this.closeTab(pane.id, id);
            }
          }
        }
        this.closeSidebarContextMenu();
      },
      prettifyCodeCtx() {
        if(this.contextMenu.targetFileId) {
          this.showSwalModal("Prettify " + this.getFileById(this.contextMenu.targetFileId).name, true);
        }
        this.closeContextMenu();
      },
      compileCodeCtx() {
        if(this.contextMenu.targetFileId) {
          this.showDefaultOutput = false;
          this.wasExecuted = false;
          compileMiriaProject(this.fileSystem); 
          this.showSwalModal("Syntax Check", !this.compilationFailed);
          this.isTerminalCollapsed = false;
        }
        this.closeContextMenu();
      },
      downloadZip() {
        const zip = new JSZip();
        this.fileSystem.forEach(folder => {
          const folderZip = zip.folder(folder.name);
          folder.children.forEach(file => {
            folderZip.file(file.name, file.content);
          });
        });
        zip.generateAsync({type:"blob"}).then(content => {
            saveAs(content, `${this.projectName}.zip`);
        });
      },
      showSwalModal: function (subject, isSuccess) {
        const title = isSuccess ? `${subject} Successful` : `${subject} Failed`;
        this.addToast(title, "", isSuccess ? "success" : "error");
      },
      executeProject: function () {
        let mainFile = null;
        for (const folder of this.fileSystem) {
          mainFile = folder.children.find(f => f.name === 'main.mi');
          if (mainFile) break;
        }
        
        if (!mainFile) {
          this.showUnifiedAlert("Project Error", "Cannot run project: main.mi entry point is missing.", "OK", null, null, true);
          return;
        }

        this.showDefaultOutput = false;
        compileMiriaProject(this.fileSystem);
        if (!this.compilationFailed) {
          executeMiriaCode();
          this.wasExecuted = true;
          if (this.executionFailed) {
            this.showSwalModal("Project Execution", false);
          } else {
            if (this.output.length === 0) {
              this.showSwalModal("Project Execution", true);
            }
          }
        } else {
          this.showSwalModal("Project Execution", false);
        }
        this.isTerminalCollapsed = false;
      },
      loadSample(sampleObj) {
        this.showSamplesModal = false;
        this.showUnifiedAlert(
          "Are you sure?",
          "Loading this sample will create a new project and delete all your current unsaved work. Do you want to proceed?",
          "Yes, load project",
          "Cancel",
          () => {
            let files = sampleObj.files;
            let pName = sampleObj.pName;

            if (files.length > 0) {
               this.projectName = pName;
               this.fileSystem = [
                 { id: 'folder_src', name: 'src', isOpen: true, children: files }
               ];
               let allFiles = [];
               function extractFiles(items) {
                 for (let item of items) {
                   if (item.children) extractFiles(item.children);
                   else allFiles.push(item);
                 }
               }
               extractFiles(files);

               let mainId = allFiles.find(f => f.name === 'main.mi').id;
               this.panes = [
                 { id: 'pane_1', openTabsIds: allFiles.map(f => f.id), currentFileId: mainId, showDropRight: false }
               ];
               this.activeFileId = mainId;
               this.$store.dispatch('miria/setConsoleOutput', "");
               this.wasExecuted = false;
            }
          }
        );
      },
      addToast(title, text, type) {
        const id = Date.now() + Math.random();
        this.toastQueue.push({ id, title, text, type });
        setTimeout(() => {
          this.toastQueue = this.toastQueue.filter(t => t.id !== id);
        }, 3000);
      },
      goToStructure(node) {
        let file = this.getFileById(this.activeFileId);
        if (!file || !file.content) return;
        let lines = file.content.split('\n');
        let targetLine = -1;
        
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
          if (node.type === 'class' && line.startsWith('define class ' + node.name)) { targetLine = i; break; }
          else if (node.type === 'namespace' && line.startsWith('namespace ' + node.name)) { targetLine = i; break; }
          else if (node.type === 'interface' && line.startsWith('define interface ' + node.name)) { targetLine = i; break; }
          else if (node.type === 'function' && line.startsWith('define ' + node.name + ' as fun(')) { targetLine = i; break; }
        }
        
        if (targetLine !== -1) {
          this.$nextTick(() => {
             if (this.$refs.cmEditor && this.$refs.cmEditor.length > 0) {
               let index = this.panes.findIndex(p => p.currentFileId === this.activeFileId);
               if (index !== -1 && this.$refs.cmEditor[index]) {
                 this.$refs.cmEditor[index].jumpToLine(targetLine);
               }
             }
          });
        }
      }
    },
    computed: {
      activeFileStructure() {
        let file = this.getFileById(this.activeFileId);
        if (!file || !file.content) return [];
        let lines = file.content.split('\n');
        let structure = [];
        for (let line of lines) {
          line = line.trim();
          if (line.startsWith('define class ')) {
             let parts = line.split(' ');
             if (parts.length > 2) structure.push({ type: 'class', name: parts[2] });
          } else if (line.startsWith('namespace ')) {
             let parts = line.split(' ');
             if (parts.length > 1) structure.push({ type: 'namespace', name: parts[1] });
          } else if (line.startsWith('define interface ')) {
             let parts = line.split(' ');
             if (parts.length > 2) structure.push({ type: 'interface', name: parts[2] });
          } else if (line.startsWith('define ') && line.includes('as fun(')) {
             let parts = line.split(' ');
             if (parts.length > 1) structure.push({ type: 'function', name: parts[1] });
          }
        }
        return structure;
      },
      ...mapState(["isDark", "colorTheme"]),
      ...mapState("miria", ["results", "output"]),
      ...mapGetters("miria", ["compilationFailed", "executionFailed"]),
      codeHasErrors: function () {
        return this.compilationFailed || this.executionFailed;
      }
    },
    watch: {
      theme: function (value) {
        this.updateCmTheme(value);
      },
    },
    components: {
      ConsoleOutput,
      CodeMirrorEditor,
    },
  };
</script>

<style scoped>
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 10001;
    pointer-events: none;
  }
  .custom-toast {
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-main);
    pointer-events: auto;
    font-size: 15.5px;
    min-width: 250px;
  }
  .custom-toast.success svg { color: var(--success-msg, #2ecc71); }
  .custom-toast.error svg { color: var(--error-msg, #e74c3c); }
  .toast-content {
    display: flex;
    flex-direction: column;
  }
  .toast-content strong { font-weight: 800; font-size: 15.5px; }
  .toast-content span { font-size: 14.5px; color: var(--text-muted); }
  
  .toast-slide-enter-active, .toast-slide-leave-active {
    transition: all 0.3s ease;
  }
  .toast-slide-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }
  .toast-slide-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }

  .ide-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    max-width: 100vw;
    position: relative;
    overflow: hidden;
  }

  /* Premium Settings Modal */
  .glass-modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }
  .premium-modal {
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    width: 440px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05);
    overflow: hidden;
  }
  .fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
  .fade-enter-from, .fade-leave-to { opacity: 0; }
  
  .fade-enter-active .premium-modal, .fade-leave-active .premium-modal {
    transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .fade-enter-from .premium-modal, .fade-leave-to .premium-modal {
    transform: scale(0.95);
  }
  
  .premium-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
  }
  .premium-modal-header h3 {
    margin: 0;
    font-size: 19.5px;
    font-weight: 800;
    color: var(--text-main);
  }
  .close-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 6px;
    border-radius: 50%;
    display: flex;
    transition: all 0.2s ease;
  }
  .close-btn:hover {
    background: var(--bg-hover);
    color: var(--text-main);
  }
  
  .premium-modal-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    font-size: 16.5px;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  /* Samples Modal Specific Styles */
  .samples-modal {
    width: 800px;
    max-width: 95%;
  }
  .samples-modal-body {
    padding: 24px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .samples-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 12px;
  }
  .sample-tab {
    background: transparent;
    border: none;
    box-shadow: inset 0 0 0 1px transparent;
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 600;
    padding: 8px 16px;
    margin: 0;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    box-sizing: border-box;
    -webkit-appearance: none;
    outline: none;
  }
  .sample-tab:hover {
    color: var(--text-main);
    background: var(--bg-hover);
  }
  .sample-tab.active {
    color: var(--accent-primary);
    background: var(--bg-hover);
    box-shadow: inset 0 0 0 1px var(--border-color);
  }
  .samples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }
  .sample-card {
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 20px;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.2s;
  }
  .sample-card:hover {
    transform: translateY(-4px);
    border-color: var(--accent-primary);
  }
  .sample-card h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    color: var(--text-main);
  }
  .sample-card p {
    margin: 0;
    font-size: 13.5px;
    color: var(--text-muted);
    line-height: 1.4;
  }
  
  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .setting-info h4 {
    margin: 0 0 4px 0;
    font-size: 15.5px;
    font-weight: 700;
    color: var(--text-main);
  }
  .setting-info p {
    margin: 0;
    font-size: 13.5px;
    color: var(--text-muted);
  }
  
  .theme-toggles { display: flex; gap: 8px; flex-wrap: wrap; }
  .theme-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    background: transparent;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    font-weight: 600;
    font-size: 14.5px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .theme-toggle.active {
    border-color: var(--accent-primary);
    background: rgba(245, 194, 231, 0.1);
    color: var(--accent-primary);
  }
  .theme-preview { width: 12px; height: 12px; border-radius: 50%; }
  .dark-preview { background: #1e1e2e; border: 1px solid #cba6f7; }
  .light-preview { background: #fafafa; border: 1px solid #ff9e64; }
  
  /* Premium Theme Cards */
  .setting-row.card-layout {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .theme-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    width: 100%;
  }
  .theme-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    cursor: pointer;
  }
  .card-preview {
    height: 72px;
    border-radius: var(--radius-sm);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .theme-card.active .card-preview {
    border-color: var(--accent-primary) !important;
    box-shadow: 0 0 0 2px var(--accent-primary);
  }
  .preview-header { height: 16px; width: 100%; }
  .preview-body { padding: 8px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
  .preview-text { height: 4px; width: 60%; border-radius: 2px; opacity: 0.8; }
  .preview-btn { height: 12px; width: 40px; border-radius: 4px; margin-top: auto; align-self: flex-end; }
  .card-label {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--text-muted);
    text-align: center;
    transition: color 0.2s;
  }
  .theme-card.active .card-label {
    color: var(--text-main);
  }
  
  .font-scaler {
    display: flex;
    align-items: center;
    background: var(--bg-hover);
    border-radius: var(--radius-sm);
    padding: 4px;
  }
  .scaler-btn {
    background: transparent;
    border: none;
    color: var(--text-main);
    font-weight: 800;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 4px;
  }
  .scaler-btn:hover { background: rgba(255, 255, 255, 0.1); }
  .scaler-value {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--text-main);
    width: 48px;
    text-align: center;
  }

  /* Custom Modal Overlay */
  .custom-modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  .custom-modal {
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 24px;
    width: 400px;
    box-shadow: var(--shadow-float);
    animation: modalPop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes modalPop {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .custom-modal h3 {
    margin: 0 0 12px 0;
    font-weight: 800;
  }
  .custom-modal p {
    color: var(--text-muted);
    margin: 0 0 24px 0;
    line-height: 1.5;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  .modal-btn {
    padding: 8px 16px;
    border-radius: var(--radius-sm);
    font-family: var(--font-ui);
    font-weight: 700;
    cursor: pointer;
    border: none;
  }
  .modal-btn.outline {
    background: transparent;
    color: var(--text-main);
    border: 1px solid var(--border-color);
  }
  .modal-btn.outline:hover { background: var(--bg-hover); }
  .modal-btn.primary {
    background: var(--accent-primary);
    color: #11111b;
  }
  .light-theme .modal-btn.primary { color: #ffffff; }

  /* Floating Toolbar */
  .ide-toolbar {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    background: transparent;
    z-index: 10;
  }

  .toolbar-left, .toolbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .brand-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .divider {
    width: 2px;
    height: 16px;
    background: var(--border-color);
  }

  .logo {
    font-weight: 800;
    font-size: 19.5px;
    letter-spacing: -0.5px;
  }
  .logo-dot { color: var(--accent-primary); }

  .project-name-container {
    height: 28px;
    display: flex;
    align-items: center;
  }
  
  .project-name {
    font-size: 15.5px;
    font-weight: 700;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    transition: background 0.15s;
  }
  .project-name:hover {
    background: var(--bg-hover);
    color: var(--text-main);
  }
  
  .project-name-input {
    background: var(--bg-panel);
    border: 1px solid var(--accent-primary);
    color: var(--text-main);
    font-family: var(--font-ui);
    font-size: 15.5px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    outline: none;
    width: 140px;
  }

  .toolbar-link {
    color: var(--text-main);
    text-decoration: none;
    font-weight: 700;
    font-size: 15.5px;
    opacity: 0.8;
    transition: opacity 0.2s;
  }
  .toolbar-link:hover { opacity: 1; color: var(--accent-tertiary); }

  .toolbar-dropdown {
    position: relative;
    cursor: pointer;
    padding-bottom: 12px;
    margin-bottom: -12px;
  }
  .dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 700;
    opacity: 0.8;
    transition: opacity 0.2s;
  }
  .dropdown-trigger:hover { opacity: 1; color: var(--accent-tertiary); }
  
  .dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-float);
    z-index: 100;
    min-width: 160px;
    overflow: hidden;
  }
  .toolbar-dropdown:hover .dropdown-menu {
    display: block;
    animation: slideDown 0.15s ease-out forwards;
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-3px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .dropdown-item {
    padding: 10px 16px;
    font-weight: 600;
    font-size: 14.5px;
    transition: background 0.15s;
  }
  .dropdown-item:hover {
    background: var(--bg-hover);
    color: var(--accent-tertiary);
  }

  .run-project-btn {
    background: var(--accent-primary);
    color: #11111b;
    border: none;
    padding: 8px 16px;
    border-radius: var(--radius-sm);
    font-family: var(--font-ui);
    font-weight: 800;
    font-size: 15.5px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(245, 194, 231, 0.15);
    transition: all 0.15s ease;
  }
  .light-theme .run-project-btn { color: #ffffff; }
  .run-project-btn:hover {
    box-shadow: 0 4px 12px rgba(245, 194, 231, 0.3);
    transform: translateY(-1px);
  }

  /* Context Menu */
  .context-menu {
    position: fixed;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-float);
    z-index: 1000;
    min-width: 180px;
    overflow: hidden;
    padding: 4px;
  }
  .context-item {
    padding: 8px 12px;
    font-weight: 600;
    font-size: 14.5px;
    color: var(--text-main);
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    border-radius: 4px;
  }
  .context-item:hover {
    background: var(--accent-primary);
    color: #11111b;
  }
  .light-theme .context-item:hover { color: #ffffff; }

  .mobile-backdrop {
    display: none;
  }

  .mobile-nav-panel {
    display: none !important;
  }

  /* Body */
  .ide-body {
    flex: 1;
    display: flex;
    padding: 0 12px 12px 12px;
    gap: 12px;
    overflow: hidden;
    position: relative;
  }

  /* Structure Panel Island */
  .structure-panel {
    margin-top: 12px;
    flex: 0 0 220px;
  }
  .structure-empty {
    padding: 12px 16px;
    color: var(--text-muted);
    font-size: 14.5px;
    font-style: italic;
    opacity: 0.7;
  }
  .structure-item {
    font-size: 14.5px !important;
    padding: 6px 12px !important;
  }
  .structure-type {
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 800;
    color: var(--text-muted);
    opacity: 0.9;
    min-width: 80px;
    margin-right: 8px;
    display: inline-block;
  }
  .structure-name {
    color: var(--text-main);
  }

  /* CSS native width animation for Sidebar */
  .sidebar-container {
    width: 250px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), margin-right 0.3s ease;
    overflow: hidden;
    white-space: nowrap;
  }
  .sidebar-container.collapsed {
    width: 0;
    margin-right: -12px; /* Pull the editor to the left */
  }

  .sidebar-panel {
    flex: 1;
    background-color: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: var(--shadow-float);
    width: 250px; /* Keep internal width constant during collapse */
  }

  .sidebar-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12.5px;
    font-weight: 800;
    color: var(--text-muted);
    letter-spacing: 1px;
  }
  
  .sidebar-actions {
    display: flex;
    gap: 2px;
  }
  .icon-btn.mini {
    width: 28px;
    height: 28px;
  }

  .file-tree {
    flex: 1;
    overflow-y: auto;
    padding: 10px 0;
    min-height: 100px;
  }

  .tree-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-muted);
    gap: 8px;
    transition: all 0.15s;
    margin-bottom: 2px;
  }
  .tree-item:hover {
    background-color: var(--bg-hover);
    color: var(--text-main);
  }
  .tree-item.active {
    background-color: rgba(234, 118, 203, 0.1);
    color: var(--accent-primary);
  }
  .tree-children {
    padding-left: 20px;
  }

  /* Inline Input for New Files/Folders */
  .inline-input-wrapper {
    padding: 4px 12px !important;
  }
  .inline-input {
    background: transparent;
    border: 1px solid var(--accent-tertiary);
    color: var(--text-main);
    outline: none;
    font-family: var(--font-ui);
    font-size: 15px;
    font-weight: 600;
    width: 100%;
    padding: 4px 6px;
    border-radius: 4px;
  }

  .chevron { transition: transform 0.2s; }
  .rotated { transform: rotate(90deg); }

  /* Main Workspace Area */
  .main-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .editor-panes-container {
    flex: 1;
    display: flex;
    gap: 12px;
    min-width: 0;
    overflow: hidden;
  }

  /* Floating Editor Panel */
  .editor-panel {
    flex: 1;
    background-color: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: var(--shadow-float);
    position: relative;
    min-width: 0;
  }
  
  .drop-indicator {
    position: absolute;
    top: 0; right: 0; width: 50%; height: 100%;
    background: rgba(137, 180, 250, 0.2);
    border-left: 2px solid var(--accent-tertiary);
    z-index: 50;
    pointer-events: none;
  }

  .editor-tabs {
    height: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    background: rgba(0,0,0,0.02);
  }

  .tabs-scroll {
    display: flex;
    height: 100%;
    overflow-x: auto;
    padding-left: 8px;
    padding-top: 8px;
  }

  .editor-tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 16px;
    height: 100%;
    background-color: transparent;
    color: var(--text-muted);
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    cursor: pointer;
    font-size: 14.5px;
    font-weight: 700;
    transition: all 0.15s;
    margin-right: 4px;
    user-select: none;
  }
  .editor-tab:hover { background-color: var(--bg-hover); }
  .editor-tab.active {
    background-color: var(--bg-panel); 
    color: var(--text-main);
    border-top: 2px solid transparent;
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
  }
  .editor-tab.global-active {
    color: var(--accent-primary);
    border-top: 2px solid var(--accent-primary);
  }
  
  .editor-tab.active .tab-close { opacity: 1; }
  
  .tab-name-input {
    background: transparent;
    border: none;
    color: var(--text-main);
    font-size: 13.5px;
    font-weight: 800;
    width: 80px;
    outline: none;
    padding: 0;
    margin: 0;
    font-family: inherit;
  }
  .tab-extension {
    color: var(--text-muted);
    font-size: 13.5px;
    font-weight: 800;
  }

  .editor-tab.new-tab-btn {
    padding: 0 16px;
    margin-left: 2px;
    opacity: 0.6;
  }
  .editor-tab.new-tab-btn:hover {
    opacity: 1;
    background-color: var(--bg-hover);
  }
  
  .tab-close {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    transition: background 0.15s;
  }
  .tab-close:hover { background: var(--bg-hover); color: var(--text-main); }

  .editor-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    cursor: text;
  }
  .editor-content > * {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .editor-content :deep(.codemirror-container) {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    color: var(--text-muted);
    font-weight: 700;
    font-size: 17.5px;
    opacity: 0.5;
  }
  .empty-icon { font-size: 49.5px; margin-bottom: 16px; }

  /* CodeMirror Overrides */
  .editor-content :deep(.CodeMirror) {
    flex: 1;
    width: 100%;
    height: 100%;
    font-family: var(--font-code);
    font-size: inherit;
    line-height: 1.7;
    background: transparent;
    padding: 10px 0;
  }
  .editor-content :deep(.CodeMirror-gutters) {
    background: var(--bg-panel);
    border-right: none;
    transform: translateZ(0);
    will-change: transform;
  }
  .editor-content :deep(.CodeMirror-activeline-background) {
    background: rgba(255, 255, 255, 0.05);
  }
  .editor-content :deep(.CodeMirror-activeline .CodeMirror-line) {
    background: transparent;
  }

  /* Floating Terminal Panel */
  .terminal-panel {
    background-color: var(--bg-terminal);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    transition: height 0.25s ease-out;
    box-shadow: var(--shadow-float);
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
  }
  .terminal-panel.collapsed { height: 44px !important; }
  .terminal-panel.resizing { transition: none; }
  
  .terminal-resizer {
    height: 4px;
    width: 100%;
    cursor: row-resize;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.2s, background-color 0.2s;
  }
  .terminal-resizer:hover, .terminal-panel.resizing .terminal-resizer {
    opacity: 1;
    background-color: var(--accent-primary);
  }

  .ide-toolbar {
    height: 48px;
    background-color: var(--bg-app);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    flex-shrink: 0;
    position: relative;
    z-index: 1000;
  }

  .terminal-header {
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    cursor: pointer;
    background: rgba(0,0,0,0.03);
  }

  .term-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .term-tabs {
    display: flex;
    height: 100%;
  }
  .term-tab {
    display: flex;
    align-items: center;
    padding: 0 16px;
    font-size: 13.5px;
    font-weight: 800;
    color: var(--text-muted);
  }
  .term-tab.active { color: var(--accent-tertiary); }

  .terminal-content {
    flex: 1;
    overflow: hidden;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .ide-toolbar {
      padding: 0 8px;
    }
    .toolbar-left, .toolbar-right {
      gap: 4px;
    }
    .brand-group .logo {
      font-size: 1.1rem;
    }
    .brand-group .divider,
    .brand-group .project-name-container {
      display: none; /* Hide project name on mobile to save space */
    }
    .run-project-btn span {
      display: none; /* Hide 'Run' text, keep icon */
    }
    .run-project-btn {
      padding: 6px 10px;
    }
    /* Hide some extra toolbar icons on very small screens to ensure no cramping */
    .toolbar-right .icon-btn[title="Download Zip"] {
      display: none;
    }
    .toolbar-link {
      display: none !important;
    }
    .sidebar-container {
      position: absolute;
      z-index: 900;
      height: 100%;
      top: 0;
      left: 0;
      background: var(--bg-panel);
      box-shadow: 4px 0 16px rgba(0,0,0,0.5);
      border-right: 1px solid var(--border-color);
    }
    
    .sidebar-panel {
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      background: transparent !important;
    }
    
    .structure-panel {
      margin-top: 0 !important;
      border-top: 1px solid var(--border-color) !important;
    }

    .sidebar-container.collapsed {
      width: 0;
      border: none;
      box-shadow: none;
    }
    
    .mobile-backdrop.active {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      z-index: 800;
      backdrop-filter: blur(2px);
    }

    .sidebar-container.collapsed {
      width: 0;
      border: none;
      box-shadow: none;
    }
    .panes-container {
      flex-direction: column;
    }
    .pane {
      width: 100% !important;
      border-right: none;
      border-bottom: 1px solid var(--border-color);
    }
    .pane:last-child {
      border-bottom: none;
    }
    
    .mobile-nav-panel {
      display: flex !important;
      flex-direction: column;
      flex: 0 0 auto;
      margin-bottom: 0 !important;
      border-bottom: 1px solid var(--border-color) !important;
      padding: 12px;
      gap: 4px;
    }
    
    .mobile-nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      color: var(--text-main);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      background: rgba(0,0,0,0.05);
      cursor: pointer;
    }
    
    .mobile-nav-item:hover {
      background: var(--bg-hover);
    }
    
    /* Make setting modal fit */
    .premium-modal {
      width: calc(100% - 40px) !important;
      max-width: 360px !important;
      max-height: 80vh;
      overflow-y: auto;
      margin: 0 auto;
    }
    .premium-modal-body, .samples-modal-body {
      padding: 16px !important;
    }
    
    /* Stack setting items on mobile so they don't stretch the modal horizontally */
    .setting-item {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 12px;
    }
    .setting-control {
      width: 100%;
    }
    .setting-control .miria-select,
    .setting-control input {
      width: 100%;
      box-sizing: border-box;
    }

    .samples-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

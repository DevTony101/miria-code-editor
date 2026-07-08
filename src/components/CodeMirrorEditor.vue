<template>
  <div ref="editorContainer" class="codemirror-container"></div>
</template>

<script lang="ts">
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

export default {
  name: 'CodeMirrorEditor',
  props: {
    modelValue: String,
    options: Object
  },
  emits: ['update:modelValue'],
  mounted() {
    this.editor = CodeMirror(this.$refs.editorContainer, {
      value: this.modelValue,
      ...this.options
    });
    this.editor.on('change', (cm) => {
      this.$emit('update:modelValue', cm.getValue());
    });
  },
  watch: {
    options: {
      deep: true,
      handler(newOptions) {
        for (const key in newOptions) {
          this.editor.setOption(key, newOptions[key]);
        }
      }
    },
    modelValue(newVal) {
      if (newVal !== this.editor.getValue()) {
        this.editor.setValue(newVal);
      }
    }
  },
  methods: {
    jumpToLine(lineNum) {
      if (this.editor) {
        this.editor.setCursor({ line: lineNum, ch: 0 });
        this.editor.focus();
        
        const t = this.editor.charCoords({line: lineNum, ch: 0}, "local").top;
        const middleHeight = this.editor.getScrollerElement().offsetHeight / 2;
        this.editor.scrollTo(null, t - middleHeight - 5);
      }
    }
  },
  beforeUnmount() {
    if (this.editor && this.editor.toTextArea) {
      this.editor.toTextArea();
    }
  }
}
</script>

<style scoped>
.codemirror-container {
  height: 100%;
}
.codemirror-container :deep(.CodeMirror) {
  height: 100%;
  border-radius: 0.5em;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: inherit !important;
}
</style>

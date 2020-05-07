<template>
  <div class="home main-content">
    <div class="content-title">
      <div class="title">
        <h1>Live Code Editor</h1>
      </div>
      <div class="controls"></div>
    </div>
    <hr />
    <div class="codemirror-content">
      <codemirror v-model="code" :options="cmOptions"></codemirror>
    </div>
  </div>
</template>

<script>
  import { codemirror } from "vue-codemirror";
  import "codemirror/mode/javascript/javascript.js";
  import "codemirror/lib/codemirror.css";
  import "codemirror/theme/3024-day.css";
  import "codemirror/theme/material.css";

  export default {
    name: "Home",
    data: function() {
      return {
        code: "a -> String := 'Hola Mundo'\nlog(a)",
        cmOptions: {
          tabSize: 4,
          mode: "javascript",
          theme: "material",
          lineNumbers: true,
          line: true,
        },
      };
    },
    components: {
      codemirror,
    },
  };
</script>

<style scoped>
  .content-title {
    display: flex;
    justify-content: space-between;
  }

  .custom-button {
    background-color: var(--color-accent-dark);
  }

  .codemirror-content {
    margin-top: 20px;
    border: 1px solid var(--background-secondary);
    border-radius: 0.5em;
    height: 500px;
  }
</style>

<template>
  <div class="home main-content">
    <div class="content-title">
      <div class="title">
        <h1 style="margin: 0">Live Code Editor</h1>
        <small>Type miria code right away!</small>
      </div>
      <div class="toolbar">
        <BaseButton icon="wrench">Compile</BaseButton>
        <BaseButton icon="play">Run</BaseButton>
      </div>
    </div>
    <hr />
    <div class="codemirror-content">
      <codemirror v-model="code" :options="cmOptions"></codemirror>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import { codemirror } from "vue-codemirror";
  import "codemirror/mode/javascript/javascript.js";
  import "codemirror/lib/codemirror.css";
  import "codemirror/theme/xq-light.css";
  import "codemirror/theme/material.css";

  export default {
    name: "Home",
    mounted() {
      this.cmOptions = {
        tabSize: 4,
        mode: "javascript",
        theme: this.theme === "light-theme" ? "xq-light" : "material",
        lineNumbers: true,
        line: true,
      };
    },
    data: function() {
      return {
        code: "a -> String := 'Hola Mundo'\nlog(a)",
        cmOptions: {},
      };
    },
    methods: {
      compileCode: function() {
        alert("Compiling...");
      },
    },
    computed: mapState(["theme"]),
    watch: {
      // eslint-disable-next-line no-unused-vars
      theme: function(value, oldValue) {
        this.cmOptions = {
          ...this.cmOptions,
          theme: value === "light-theme" ? "xq-light" : "material",
        };
      },
    },
    components: {
      codemirror,
    },
  };
</script>

<style scoped>
  .content-title {
    display: grid;
    grid-template-columns: auto auto;
  }

  .custom-button {
    background-color: var(--color-accent-dark);
  }

  .codemirror-content {
    margin-top: 20px;
    border: 1px solid var(--background-secondary);
    border-radius: 0.5em;
    height: 520px;
    transition: height 100ms ease-in-out;
  }

  .toolbar {
    display: flex;
    justify-content: flex-end;
    margin: auto 0 auto 0;
  }

  /*Small Screen*/
  @media only screen and (max-width: 600px) {
    .codemirror-content {
      height: 450px;
    }
  }
</style>

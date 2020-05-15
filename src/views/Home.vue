<template>
  <div class="home main-content">
    <div class="main-title">
      <div class="title">
        <h1 style="margin: 0">Code Editor</h1>
        <small>Type miria code right away!</small>
      </div>
      <div class="toolbar">
        <BaseButton icon="wrench" @click="compileCode">Compile</BaseButton>
        <BaseButton icon="play" @click="executeCode">Run</BaseButton>
      </div>
    </div>
    <hr />
    <div class="miria-code">
      <div class="codemirror-content">
        <codemirror v-model="code" :options="cmOptions"></codemirror>
      </div>
      <ConsoleOutput>
        <template v-if="!this.showDefaultOutput">
          <pre v-if="this.compilationFailed" class="error-msg">{{
            this.output
          }}</pre>
          <template v-else>
            <span class="success-msg">Compiled Successfully</span>
          </template>
        </template>
      </ConsoleOutput>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from "vuex";
  import { codemirror } from "vue-codemirror";
  import {
    compileMiriaCode,
    executeMiriaCode,
  } from "../grammar/miria-compiler";
  import "codemirror/mode/javascript/javascript.js";
  import "codemirror/lib/codemirror.css";
  import "codemirror/theme/xq-light.css";
  import "codemirror/theme/material.css";
  import ConsoleOutput from "../components/ConsoleOutput";

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
        cmOptions: {},
        code: 'a -> String := "Hola Mundo"',
        showDefaultOutput: true,
      };
    },
    methods: {
      compileCode: function() {
        this.showDefaultOutput = false;
        compileMiriaCode(this.code);
        let message = "Oops! Compilation failed!";
        let type = "error";
        if (!this.compilationFailed) {
          console.log(this.results);
          message = "Compiled successfully";
          type = "success";
        }
        this.$swal(message, "See console output for more info", type);
      },
      executeCode: function() {
        this.compileCode();
        if (!this.compilationFailed) {
          executeMiriaCode();
        }
      },
    },
    computed: {
      ...mapState(["theme"]),
      ...mapState("miria", ["results", "output", "compilationStatus"]),
      ...mapGetters("miria", ["compilationFailed"]),
    },
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
      ConsoleOutput,
      codemirror,
    },
  };
</script>

<style scoped>
  .main-title {
    display: grid;
    grid-template-columns: auto auto;
  }

  .miria-code {
    display: grid;
    grid-template-columns: 850px auto;
    column-gap: 2rem;
    height: 520px;
    padding-top: 20px;
  }

  .custom-button {
    background-color: var(--color-accent-dark);
  }

  .codemirror-content {
    border: 1px solid var(--background-secondary);
    border-radius: 0.5em;
    height: 100%;
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

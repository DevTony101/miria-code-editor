<template>
  <div class="home main-content">
    <div class="main-title">
      <div class="title">
        <h1 style="margin: 0">Code Editor</h1>
        <small>Type miria code right away!</small>
      </div>
      <div class="toolbar">
        <BaseButton icon="wrench" @click="compileCode">Compile</BaseButton>
        <BaseButton icon="play">Run</BaseButton>
      </div>
    </div>
    <hr />
    <div class="miria-code">
      <div class="codemirror-content">
        <codemirror v-model="code" :options="cmOptions"></codemirror>
      </div>
      <ConsoleOutput>
        <pre v-if="this.csoutput && this.buildFailed" class="error-msg">
          {{ this.csoutput }}
        </pre>
        <template v-if="this.csoutput && !this.buildFailed">
          <span class="success-msg">Everything Compiled Successfully!</span>
        </template>
      </ConsoleOutput>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import { codemirror } from "vue-codemirror";
  import { getMiriaParser } from "../grammar/miria-parser";
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
        buildFailed: false,
        csoutput: null,
      };
    },
    methods: {
      compileCode: function() {
        this.csoutput = "a";
        const parser = getMiriaParser();
        let results = null;
        try {
          parser.feed(this.code);
          results = parser.results;
        } catch (err) {
          const endMsg = err.message.indexOf("Instead");
          let errorMsg = err.message.slice(0, endMsg - 1);
          this.csoutput = errorMsg;
          this.buildFailed = true;
          this.$swal(
            "Oops! Build failed!",
            "See console output for more info",
            "error"
          );
          console.error(errorMsg);
        }
        console.log(results);
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
    grid-template-columns: 800px auto;
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

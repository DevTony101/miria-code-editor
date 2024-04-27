<template>
  <div class="home main-content">
    <div class="main-title">
      <div class="title">
        <h1 style="margin: 0">Miria Code Editor</h1>
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
          <pre v-if="this.codeHasErrors" class="error-msg">{{
            this.output
          }}</pre>
          <template v-else>
            <pre v-if="this.wasExecuted">{{ this.output }}</pre>
            <hr v-if="this.output.length !== 0" />
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
  import { compileMiriaCode, executeMiriaCode } from "@/grammar/miria-compiler";
  import "../grammar/parser/miriaHighlight";
  import "codemirror/lib/codemirror.css";
  import "codemirror/theme/idea.css";
  import "codemirror/theme/material.css";
  import ConsoleOutput from "../components/ConsoleOutput";

  export default {
    name: "Home",
    mounted() {
      this.cmOptions = {
        tabSize: 4,
        mode: "miria",
        theme: this.theme === "light-theme" ? "idea" : "material",
        lineNumbers: true,
        line: true,
        viewportMargin: Infinity,
      };
    },
    data: function () {
      return {
        cmOptions: {},
        code: `define main as fun() -> void {\n  s -> string := "Hello world"\n  log(s + ", from Miria!")\n}`,
        showDefaultOutput: true,
        wasExecuted: false,
      };
    },
    methods: {
      showSwalModal: function (subject, isSuccess) {
        let message = `Oops! ${subject} failed!`;
        let type = "error";
        if (isSuccess) {
          console.log(this.results);
          message = `${subject} was successful`;
          type = "success";
        }
        this.$swal(message, "See console output for more info", type);
      },
      compileCode: function () {
        this.showDefaultOutput = false;
        this.wasExecuted = false;
        compileMiriaCode(this.code);
        this.showSwalModal("Compilation", !this.compilationFailed);
      },
      executeCode: function () {
        this.showDefaultOutput = false;
        compileMiriaCode(this.code);
        if (!this.compilationFailed) {
          executeMiriaCode();
          this.wasExecuted = true;
          if (this.executionFailed) {
            this.showSwalModal("Execution", false);
          } else {
            if (this.output.length === 0) {
              this.showSwalModal("Execution", true);
            }
          }
        } else {
          this.showSwalModal("Execution", false);
        }
      },
    },
    computed: {
      ...mapState(["theme"]),
      ...mapState("miria", ["results", "output"]),
      ...mapGetters("miria", ["compilationFailed", "executionFailed"]),
      codeHasErrors: function () {
        return this.compilationFailed || this.executionFailed;
      },
    },
    watch: {
      // eslint-disable-next-line no-unused-vars
      theme: function (value, oldValue) {
        this.cmOptions = {
          ...this.cmOptions,
          theme: value === "light-theme" ? "idea" : "material",
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
    .main-content {
      padding: 0;
    }

    .main-title {
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      align-items: stretch;
      justify-content: flex-start;
      position: fixed;
      top: 0;
      z-index: 9999;
      box-shadow: var(--nav-shadow);
      background-color: var(--nav-bg);
      padding: 0.5rem 0 0 0.5rem;
    }

    .toolbar {
      margin-bottom: 10px;
    }

    .title {
      width: 100%;
      margin-bottom: 16px;
    }

    .miria-code {
      margin: 140px 0 0 0;
      display: flex;
      flex-wrap: wrap;
      padding: 0 10px 0 10px;
    }
  }
</style>

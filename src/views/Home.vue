<template>
  <div class="home main-content">
    <div class="content-title">
      <div class="title">
        <h1 style="margin: 0">Live Code Editor</h1>
        <small>Type miria code right away!</small>
      </div>
      <div class="controls">
        <button class="button" @click="compileCode">
          <BaseIcon iconName="play" />
          Compile
        </button>
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
    height: 520px;
    transition: height 100ms ease-in-out;
  }

  .button {
    display: flex;
    border: transparent;
    border-radius: 0.5em;
    background-color: var(--green);
    padding: 10px;
    justify-content: space-evenly;
    justify-items: center;
    align-items: center;
    font-weight: 600;
    text-align: center;
    width: 120px;
  }

  .button:hover {
    cursor: pointer;
    fill: white;
    color: white;
  }

  .button:active {
    border: none;
    background-color: var(--green-dark);
  }

  .button svg {
    width: 2rem;
    min-width: 2rem;
    height: 20px;
    fill: var(--text-color);
  }

  /*Small Screen*/
  @media only screen and (max-width: 600px) {
    .codemirror-content {
      height: 450px;
    }
  }
</style>

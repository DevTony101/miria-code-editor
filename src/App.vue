<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
  import { mapState, mapActions } from "vuex";

  export default {
    name: "App",
    mounted() {
      this.initTheme();
    },
    methods: {
      ...mapActions(["initTheme"]),
    },
    computed: {
      ...mapState(["isDark", "colorTheme"]),
    }
  };
</script>

<style>
  @import url("./assets/styles/global.css");

  #app {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>

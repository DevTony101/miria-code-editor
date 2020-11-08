<template>
  <!--  TODO: Save the color theme in the local storage when creating the settings option-->
  <div id="app">
    <Sidenav ref="sidenav">
      <template>
        <Navitem icon="arrow" text="Miria" logo linkTo="/" />
        <Navitem
          icon="code"
          text="Code Editor"
          linkTo="/"
          :selected="currentPage === 'home'"
          @click="setSelectedPage('home')"
        />
        <Navitem
          icon="open-book"
          text="Docs"
          linkTo="/docs"
          :selected="currentPage === 'docs'"
          @click="setSelectedPage('docs')"
        />
        <Navitem
          icon="gh-icon"
          text="Repository"
          linkTo="/"
          @click="
            openExternalLink('https://github.com/DevTony101/miria-code-editor')
          "
        />
        <Navitem
          :icon="icon"
          text="Change Theme"
          :linkTo="this.$route.path"
          @click="changeTheme"
        />
      </template>
    </Sidenav>
    <router-view />
  </div>
</template>

<script>
  import Sidenav from "./components/Sidenav";
  import Navitem from "./components/Navitem";
  import { mapState, mapActions } from "vuex";

  export default {
    name: "App",
    mounted() {
      this.updateTheme();
    },
    data: function () {
      return {
        currentPage: "home",
      };
    },
    methods: {
      ...mapActions(["updateTheme"]),
      setSelectedPage: function (page) {
        this.currentPage = page;
      },
      changeTheme: function () {
        this.updateTheme(
          this.theme === "light-theme" ? "dark-theme" : "light-theme"
        );
      },
      openExternalLink: function (url) {
        window.open(url, "_blank");
      },
    },
    computed: {
      ...mapState(["theme"]),
      icon: function () {
        return this.theme === "light-theme" ? "moon" : "sun";
      },
    },
    components: { Navitem, Sidenav },
  };
</script>

<style>
  @import url("./assets/styles/global.css");
</style>

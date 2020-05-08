<template>
  <!--  TODO: Save the color theme in the local storage when creating the settings option-->
  <div id="app">
    <Sidenav ref="sidenav">
      <template>
        <Navitem icon="arrow" text="Miria" logo />
        <Navitem
          icon="code"
          text="Code Editor"
          :selected="currentPage === 'home'"
          @click="setSelectedPage('home')"
        />
        <Navitem
          icon="open-book"
          text="Docs"
          :selected="currentPage === 'list'"
          @click="setSelectedPage('list')"
        />
        <Navitem
          icon="users"
          text="About Miria"
          :selected="currentPage === 'create'"
          @click="setSelectedPage('create')"
        />
        <Navitem :icon="icon" text="Change Theme" @click="changeTheme" />
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
    components: { Navitem, Sidenav },
    data: function() {
      return {
        currentPage: "home",
      };
    },
    methods: {
      ...mapActions(["updateTheme"]),
      setSelectedPage: function(page) {
        this.currentPage = page;
      },
      changeTheme: function() {
        this.updateTheme(
          this.theme === "light-theme" ? "dark-theme" : "light-theme"
        );
      },
    },
    computed: {
      ...mapState(["theme"]),
      icon: function() {
        return this.theme === "light-theme" ? "moon" : "sun";
      },
    },
  };
</script>

<style>
  @import url("./assets/styles/global.css");
</style>

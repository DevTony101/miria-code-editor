<template>
  <!--  TODO: Save the color theme in the local storage when creating the settings option-->
  <div id="app">
    <Sidenav ref="sidenav">
      <template>
        <Navitem icon="arrow" text="AppPlus" logo />
        <Navitem
          icon="home"
          text="Home"
          :selected="currentPage === 'home'"
          @click="setSelectedPage('home')"
        />
        <Navitem
          icon="list"
          text="List All"
          :selected="currentPage === 'list'"
          @click="setSelectedPage('list')"
        />
        <Navitem
          icon="edit"
          text="Edit/Create"
          :selected="currentPage === 'create'"
          @click="setSelectedPage('create')"
        />
        <Navitem
          icon="cog"
          text="Settings"
          :selected="currentPage === 'settings'"
          @click="setSelectedPage('settings')"
        />
      </template>
    </Sidenav>
    <router-view />
  </div>
</template>

<script>
  import Sidenav from "./components/Sidenav";
  import Navitem from "./components/Navitem";
  export default {
    name: "App",
    components: { Navitem, Sidenav },
    data: function() {
      return {
        currentPage: "home",
      };
    },
    methods: {
      setSelectedPage: function(page) {
        this.currentPage = page;
      },
    },
  };
</script>

<style>
  @import url("./assets/styles/global.css");
</style>

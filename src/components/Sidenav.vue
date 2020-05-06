<template>
  <nav class="navbar">
    <ul class="navbar-nav">
      <slot />
    </ul>
  </nav>
</template>

<script>
  export default {
    name: "Sidenav",
  };
</script>

<style scoped>
  @import url("../assets/styles/sharedcss-navbar.css");
  .navbar {
    width: 5rem;
    height: 100vh;
    position: fixed;
    box-shadow: var(--nav-shadow);
    background-color: var(--nav-bg);
    transition: width 200ms ease;
  }

  .navbar-nav {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  /*Small Screen*/
  @media only screen and (max-width: 600px) {
    .navbar {
      bottom: 0;
      width: 100vw;
      height: 5rem;
    }

    .navbar-nav {
      flex-direction: row;
    }
  }

  /*Large Screen*/
  @media only screen and (min-width: 600px) {
    .navbar {
      top: 0;
      width: 5rem;
      height: 100vh;
    }

    .navbar:hover {
      width: 15rem;
    }
  }
</style>

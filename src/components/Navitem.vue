<template>
  <li :class="getClass" @click="$emit('click', $event)">
    <router-link :to="linkTo" class="nav-link" :class="{ selected: selected }">
      <BaseIcon :iconName="icon" />
      <span class="link-text">{{ text }}</span>
    </router-link>
  </li>
</template>

<script>
  export default {
    name: "Navitem",
    props: {
      icon: String,
      linkTo: {
        type: String,
        required: true,
      },
      logo: {
        type: Boolean,
        default: false,
      },
      selected: {
        type: Boolean,
        default: false,
      },
      text: {
        type: String,
        required: true,
      },
    },
    computed: {
      getClass: function () {
        return this.logo ? "logo" : "nav-item";
      },
    },
  };
</script>

<style scoped>
  @import url("../assets/styles/sharedcss-navbar.css");

  .nav-item {
    width: 100%;
  }

  .nav-item > .selected {
    filter: grayscale(0%) opacity(1);
    background-color: var(--color-accent-light);
  }

  .nav-item:last-child {
    margin-top: auto;
  }

  .nav-link {
    display: flex;
    align-items: center;
    height: 5rem;
    color: var(--text-color);
    text-decoration: none;
    filter: grayscale(100%) opacity(0.7);
    transition: var(--transition-speed);
  }

  .nav-link:hover {
    filter: grayscale(0%) opacity(1);
    background: var(--background-secondary);
    color: var(--text-color-secondary);
  }

  .nav-link svg {
    width: 2rem;
    min-width: 2rem;
    margin: 0 1.5rem;
  }

  .nav-link .icon {
    fill: var(--h-color);
  }

  .nav-link:hover .icon {
    fill: var(--color-accent-light);
  }

  .link-text {
    display: none;
    margin-left: 1rem;
    white-space: nowrap;
  }

  .logo {
    font-weight: bold;
    text-transform: uppercase;
    margin-bottom: 1rem;
    text-align: center;
    color: var(--text-color);
    background: var(--background-secondary);
    font-size: 1.5rem;
    letter-spacing: 0.3ch;
    width: 100%;
  }

  .logo svg {
    transform: rotate(0deg);
    transition: transform var(--transition-speed) ease;
  }

  .navbar:hover .logo svg {
    transform: rotate(-180deg);
  }

  /*Small Screen*/
  @media only screen and (max-width: 600px) {
    .logo {
      display: none;
    }

    .nav-link {
      justify-content: center;
    }
  }
</style>

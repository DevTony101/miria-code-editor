<template>
  <div class="container">
    <button
      v-on="$listeners"
      class="button"
      :class="buttonClass"
      v-bind="$attrs"
    >
      <BaseIcon :iconName="icon" v-if="icon" />
      <slot />
    </button>
  </div>
</template>

<script>
  export default {
    name: "BaseButton",
    inheritAttrs: false,
    props: {
      buttonClass: String,
      icon: String,
    },
  };
</script>

<style scoped>
  .container {
    margin: 0 10px 0 10px;
  }

  .button {
    display: flex;
    border: transparent;
    border-radius: 0.5em;
    background-color: var(--color-accent-light);
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
    background-color: var(--color-accent);
  }

  .button:active {
    border: none;
    background-color: var(--color-accent-dark);
  }

  .button svg {
    width: 2rem;
    min-width: 2rem;
    height: 15px;
    fill: var(--text-color);
  }
</style>

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
    width: auto;
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
    max-width: 1.5rem;
    height: 15px;
    fill: var(--text-color);
    padding-right: 0.5rem;
  }

  @media only screen and (max-width: 600px) {
    .container {
      margin: 0 20px 0 0;
    }

    .title {
      width: 100%;
      margin-bottom: 16px;
    }

    .miria-code {
      display: flex;
    }

    .codemirror-content {
      height: 450px;
    }
  }
</style>

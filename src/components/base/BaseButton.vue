<template>
  <div>
    <button
      v-on="$listeners"
      class="button"
      :class="buttonClass"
      v-bind="$attrs"
    >
      <slot />
    </button>
  </div>
</template>

<script>
  export default {
    name: "BaseButton",
    inheritAttrs: false,
    props: {
      buttonClass: {
        type: String,
      },
    },
  };
</script>

<style scoped>
  .button {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    padding: 0 40px;
    background: var(--green);
    border: none;
    border-radius: 6px;
    text-align: center;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.2s ease-in-out;
  }

  .button:hover {
    font-weight: 600;
    -webkit-transform: scale(1.01);
    transform: scale(1.01);
    box-shadow: var(--nav-shadow);
    cursor: pointer;
  }

  .button:active {
    box-shadow: none;
    background-color: var(--green-dark);
  }

  .button:focus {
    outline: 0;
  }

  .button:disabled {
    -webkit-transform: scale(1);
    transform: scale(1);
    background: rgba(0, 0, 0, 0.5) !important;
  }

  .button + .button {
    margin-left: 1em;
  }

  .button.-fill-gradient {
    background: linear-gradient(to right, #16c0b0, #84cf6a);
    color: #ffffff;
  }

  .button.-fill-gray {
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
  }

  .button.-size-small {
    height: 32px;
  }

  .button.-icon-right {
    text-align: left;
    padding: 0 20px;
  }

  .button.-icon-right > .icon {
    margin-left: 10px;
  }

  .button.-icon-left {
    text-align: right;
    padding: 0 20px;
  }

  .button.-icon-left > .icon {
    margin-right: 10px;
  }

  .button.-icon-center {
    padding: 0 20px;
  }
</style>

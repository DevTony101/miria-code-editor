<template>
  <svg class="icon">
    <use v-bind="{ 'xlink:href': source }" />
  </svg>
</template>

<script>
  export default {
    name: "BaseIcon",
    props: {
      iconName: {
        // The name of the symbol we want to use
        type: String,
        required: true,
      },
      width: {
        type: [String, Number],
        default: 24,
      },
      height: {
        type: [String, Number],
        default: 24,
      },
    },
    computed: {
      source: function () {
        return `/icons.svg#${this.iconName}`;
      },
    },
  };
</script>

<style scoped>
  .icon {
    fill: var(--text-color);
    transition: fill 200ms ease;
  }
</style>

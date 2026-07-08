<template>
  <li class="activity-item" :class="{ 'is-active': selected }" @click="$emit('click', $event)">
    <router-link :to="linkTo" class="nav-link">
      <div class="icon-wrapper">
        <BaseIcon :iconName="icon" class="icon" />
      </div>
    </router-link>
  </li>
</template>

<script lang="ts">
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
  };
</script>

<style scoped>
  .activity-item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .nav-link {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .icon {
    width: 24px;
    height: 24px;
    fill: var(--text-muted);
    transition: all 0.2s;
  }

  .activity-item:hover .icon-wrapper {
    background: rgba(255, 255, 255, 0.05);
    transform: scale(1.1);
  }

  .activity-item:hover .icon {
    fill: var(--text-main);
  }

  .activity-item.is-active .icon-wrapper {
    background: rgba(137, 180, 250, 0.15);
    box-shadow: inset 0 0 0 2px var(--accent-primary);
  }

  .activity-item.is-active .icon {
    fill: var(--accent-primary);
  }
</style>

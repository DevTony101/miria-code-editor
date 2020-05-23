<template>
  <div class="console-output">
    <h3 class="title">Console Output</h3>
    <hr />
    <div class="output">
      <slot>
        <span>
          The output of your miria code will appear <br />
          here. (Errors included!)
        </span>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ConsoleOutput",
  };
</script>

<style scoped>
  .console-output {
    background-color: var(--background-secondary);
    border-radius: 0.5em;
    padding: 10px 20px 20px;
    overflow-y: scroll;
    overflow-x: auto;
  }

  .output {
    margin-top: 20px;
  }

  .error-msg {
    color: var(--error-msg);
  }

  .success-msg {
    color: var(--success-msg);
  }
</style>

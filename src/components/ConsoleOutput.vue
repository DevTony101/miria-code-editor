<template>
  <div class="console-output">
    <h3 class="title">Console Output</h3>
    <hr />
    <div class="output">
      <span>
        The output of your miria code will appear here. <br />
        (Errors included!)
      </span>
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
    padding: 20px;
    padding-top: 10px;
  }

  .output {
    margin-top: 20px;
  }
</style>

<template>
  <section class="docs-section">
    <h2>Exceptions</h2>
    <p>Miria supports error handling through a robust <code>try / catch / finally</code> structure. This allows you to gracefully recover from unexpected conditions.</p>

    <h3>Throwing and Catching Exceptions</h3>
    <p>Use the <code>throw</code> keyword to raise an error. Use the <code>try</code> block to wrap risky code, and the <code>catch</code> block to handle any errors that occur.</p>
    <base-code-snippet runnable>
<pre><code v-highlight>define divide as fun(a -> number, b -> number) -> number {
  evaluate if (b == 0) {
    throw "Cannot divide by zero!"
  }
  return a / b
}

try {
  result := divide(10, 0)
  log(result)
} catch (err) {
  log("Caught an error: " + err)
} finally {
  log("Execution finished.")
}
    </code></pre>
</base-code-snippet>
  </section>
</template>

<script lang="ts">
export default {
  name: "Exceptions"
};
</script>

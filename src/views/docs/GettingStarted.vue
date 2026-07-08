<template>
  <section class="docs-section">
    <h2>Getting Started</h2>
    <p>
      Miria is designed to be expressive, object-oriented, and full of flavor.
      Every Miria program starts execution from a single global function called <b>main</b>. 
      Here is how you say hello to the world:
    </p>
    <base-code-snippet runnable>
<pre><code v-highlight>log("Hello World")
    </code></pre>
</base-code-snippet>
    <div class="tip-box">
      <span class="tip-title">TIP</span>
      <p>You don't need semicolons! Miria embraces clean, readable syntax. Use the global <code>log()</code> function to print output to the console.</p>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: "GettingStarted"
};
</script>

<template>
  <section class="docs-section">
    <h2>Variables & Types</h2>
    <p>
      Miria is dynamically typed by default, but allows for explicit type declarations when you want to enforce structure. 
      Use the <code>:=</code> operator for assigning values and <code>-></code> for type hints.
    </p>
    <base-code-snippet runnable>
<pre><code v-highlight>// Dynamically typed assignment
msg := "Hello"

// Explicitly typed assignment
name -> str := "John Doe"
age -> number := 25
isCool -> boolean := true
    </code></pre>
</base-code-snippet>
  </section>
</template>

<script lang="ts">
export default {
  name: "Variables"
};
</script>

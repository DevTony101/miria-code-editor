<template>
  <section class="docs-section">
    <h2>Namespaces</h2>
    <p>Namespaces allow you to organize your code into logical units. They act as a top-level module declaration for your files, making your code highly modular!</p>
    
    <h3>Declaring a Namespace</h3>
    <p>Use the <code>namespace</code> keyword at the top of a file to declare that all its definitions belong to that namespace.</p>
    <base-code-snippet id="namespace-colors">
<pre><code v-highlight>// In colors.mi
namespace Colors

define RED as fun() -> str {
  return "#FF0000"
}

define GREEN as fun() -> str {
  return "#00FF00"
}
    </code></pre>
</base-code-snippet>

    <h3>Importing and Using Namespaces</h3>
    <p>Once defined, you can import the file and access its contents using the <code>::</code> operator!</p>
    <base-code-snippet runnable :depends-on="['namespace-colors']">
<pre><code v-highlight>// In main.mi
import "colors.mi"

myColor := Colors::RED()
log("Selected color is: " + myColor)
    </code></pre>
</base-code-snippet>
  </section>
</template>

<script lang="ts">
export default {
  name: "Namespaces"
};
</script>

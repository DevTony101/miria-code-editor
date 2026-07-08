<template>
  <section class="docs-section">
    <h2>Dictionaries</h2>
    <p>Dictionaries allow you to store key-value pairs where keys can be strings or identifiers. They provide fast lookups and can be nested.</p>

    <h3>Creating and Accessing Dictionaries</h3>
    <p>Use curly braces <code>{}</code> to define a dictionary, and bracket notation <code>[]</code> or dot notation to access properties.</p>
    <base-code-snippet runnable>
<pre><code v-highlight>user := {
  "name": "Alice",
  "age": 30,
  "roles": ["admin", "editor"]
}

// Access properties
log(user.name) // "Alice"

// Dynamic access
key := "age"
log(user[key]) // 30

// Modify properties
user.age := 31
user["status"] := "active"
    </code></pre>
</base-code-snippet>
  </section>
</template>

<script lang="ts">
export default {
  name: "Dictionaries"
};
</script>

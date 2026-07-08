<template>
  <section class="docs-section">
    <h2>Enums</h2>
    <p>Enums allow you to define a finite set of named values. They are incredibly useful for state management and configuration.</p>
    
    <h3>Declaring an Enum</h3>
    <p>Use the <code>define enum</code> syntax to create an enumeration.</p>
    <base-code-snippet id="enum-def">
<pre><code v-highlight>define enum Status {
  PENDING,
  APPROVED,
  REJECTED
}
    </code></pre>
</base-code-snippet>

    <h3>Using Enums</h3>
    <p>Access enum values using dot notation and compare them directly!</p>
    <base-code-snippet runnable :depends-on="['enum-def']">
<pre><code v-highlight>define processOrder as fun(status) -> void {
  evaluate if (status == Status.APPROVED) {
    log("Order is ready to go!")
  } if not {
    log("Please wait.")
  }
}

myStatus := Status.PENDING
processOrder(myStatus)
    </code></pre>
</base-code-snippet>
  </section>
</template>

<script lang="ts">
export default {
  name: "Enums"
};
</script>

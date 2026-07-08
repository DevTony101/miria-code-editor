<template>
  <section class="docs-section">
    <h2>Control Flow</h2>
    <p>Miria uses the declarative <code>evaluate if</code> syntax for branching, and <code>repeat while</code> for loops.</p>
    
    <h3>If / Else</h3>
    <base-code-snippet runnable>
<pre><code v-highlight>age := 20
evaluate if (age >= 18) {
  log("Adult")
} if not {
  log("Minor")
}
    </code></pre>
</base-code-snippet>

    <h3>While Loops</h3>
    <p>A funky take on traditional loops!</p>
    <base-code-snippet runnable>
<pre><code v-highlight>n := 0
repeat {
  log(n)
  n := n + 1
} while (n < 5)

// Do-while loop variant
once repeat {
  log("This runs at least once!")
} while (false)
    </code></pre>
</base-code-snippet>

    <h3>Foreach Loops</h3>
    <p>Iterate directly over array elements cleanly using <code>foreach</code>.</p>
    <base-code-snippet runnable>
<pre><code v-highlight>names := ["Alice", "Bob", "Charlie"]

// Using an implicitly typed variable
foreach (name in names) {
  log("Hello, " + name)
}

// Using an explicitly typed variable definition
foreach (name -> string in names) {
  log(name)
}
    </code></pre>
</base-code-snippet>
    <h3>Break Statements</h3>
    <p>You can exit early out of any loop using the <code>break</code> keyword.</p>
    <base-code-snippet runnable>
<pre><code v-highlight>foreach (n in [1, 2, 3, 4, 5]) {
  evaluate if (n == 4) {
    break
  }
  log(n)
}
// Outputs: 1, 2, 3
    </code></pre>
</base-code-snippet>

    <h3>Switch Statements</h3>
    <p>Miria supports two funky variants of the switch statement. You can use it as a <b>statement</b> to execute blocks of code, or as an <b>expression</b> to return a value natively!</p>
    
    <base-code-snippet runnable>
<pre><code v-highlight>status := "APPROVED"

// 1. switch as a Statement (to fun)
switch from (status) to fun {
  case "APPROVED" -> log("Approved!")
  case "PENDING" as fun() -> void {
    log("Status is pending...")
  }
  default as fun() -> void {
    log("Unknown status")
  }
}

// 2. switch as an Expression (to value)
statusCode := switch from (status) to value {
  case "APPROVED" -> 0
  case "DECLINED" -> 1
  default -> -1
}
log("Status Code: " + statusCode)
    </code></pre>
</base-code-snippet>
  </section>
</template>

<script lang="ts">
export default {
  name: "ControlFlow"
};
</script>

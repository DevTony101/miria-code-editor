<template>
  <section class="docs-section">
    <h2>Functions</h2>
    <p>Functions are declared using the <code>define</code> keyword. You can specify parameter types and return types using the arrow <code>-></code>.</p>
    <base-code-snippet runnable>
<pre><code v-highlight>define add as fun(a -> number, b -> number) -> number {
  return a + b
}

result := add(10, 5)
log(result)
    </code></pre>
</base-code-snippet>

    <h3>Anonymous Functions (Lambdas)</h3>
    <p>You can create anonymous functions using the <code>lambda</code> syntax! Lambdas can be assigned to variables, passed around, and evaluated immediately.</p>
    <base-code-snippet runnable>
<pre><code v-highlight>// 1. Inline Lambda (Implicit Return)
adder := lambda(a, b) -> a + b
log( adder(2, 3) ) // 5

// 2. Multi-block Lambda
maths := lambda(a, b) {
  sum := a + b
  diff := a - b
  return sum * diff
}
log( maths(10, 5) ) // 75

// 3. Passing to Array Methods!
arr := [1, 2, 3]
doubled := arr.map(lambda(x) -> x * 2)
log(doubled) // [2, 4, 6]

// 4. Lambda Type Hints!
// Specify `lmd(args)` or `lmd(args) -> returnType`
define exec as fun(callback -> lmd(msg -> string) -> void) -> void {
  callback("Hello!")
}

exec(lambda(msg) -> log("Callback: " + msg))
    </code></pre>
</base-code-snippet>
  </section>
</template>

<script lang="ts">
export default {
  name: "Functions"
};
</script>

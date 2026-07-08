<template>
  <section class="docs-section">
    <h2>Strings & Arrays</h2>
    <p>Miria treats strings and arrays as robust objects equipped with built-in, chained methods.</p>

    <h3>String Methods</h3>
    <ul>
      <li><code>length()</code> - Get the string length</li>
      <li><code>upper()</code> - Convert to uppercase</li>
      <li><code>lower()</code> - Convert to lowercase</li>
      <li><code>concat(str)</code> - Append a string</li>
      <li><code>replace(regex, str)</code> - Replace occurrences using regex</li>
      <li><code>replaceAll(str, str)</code> - Replace all occurrences</li>
      <li><code>padLeft(str, count)</code> - Pad the start of a string</li>
      <li><code>padRight(str, count)</code> - Pad the end of a string</li>
      <li><code>center(str, count)</code> - Center the string</li>
      <li><code>strip()</code> - Remove whitespace</li>
      <li><code>format(...args)</code> - C-style string formatting</li>
    </ul>

    <base-code-snippet runnable>
<pre><code v-highlight>msg := "I have %d apples".format(5)
log(msg.upper()) // "I HAVE 5 APPLES"
    </code></pre>
</base-code-snippet>

    <h3>Array Methods (Functional Awesomeness!)</h3>
    <p>Arrays in Miria come with a slew of functional array-processing methods.</p>
    
    <details class="docs-details">
      <summary><h3>Array Operations</h3></summary>
      <div class="details-content">
        <ul>
          <li><code>length()</code> - Number of elements</li>
          <li><code>push(el)</code> - Add to the end</li>
          <li><code>pop()</code> - Remove from the end</li>
          <li><code>shift()</code> - Remove from the start</li>
          <li><code>unshift(el)</code> - Add to the start</li>
          <li><code>join(sep)</code> - Combine into a string</li>
          <li><code>reverse()</code> - Reverse array in-place</li>
        </ul>
      </div>
    </details>

    <details class="docs-details">
      <summary><h3>Functional Iterators</h3></summary>
      <div class="details-content">
        <p>Pass Lambdas directly to these methods to mutate and aggregate data like a pro!</p>
        <ul>
          <li>
            <b>map(lambda)</b>
            <base-code-snippet runnable style="margin-top: 10px">
<pre><code v-highlight>log([1, 2, 3].map(lambda(x) -> x * 2)) // [2, 4, 6]
            </code></pre>
</base-code-snippet>
          </li>
          <li>
            <b>filter(lambda)</b>
            <base-code-snippet runnable style="margin-top: 10px">
<pre><code v-highlight>log([1, 2, 3, 4].filter(lambda(x) -> x % 2 == 0)) // [2, 4]
            </code></pre>
</base-code-snippet>
          </li>
          <li>
            <b>reduce(lambda, initialValue)</b>
            <base-code-snippet runnable style="margin-top: 10px">
<pre><code v-highlight>log([1, 2, 3].reduce(lambda(acc, x) -> acc + x, 0)) // 6
            </code></pre>
</base-code-snippet>
          </li>
          <li>
            <b>flatMap(lambda)</b>
            <base-code-snippet runnable style="margin-top: 10px">
<pre><code v-highlight>log([1, 2].flatMap(lambda(x) -> [x, x * 10])) // [1, 10, 2, 20]
            </code></pre>
</base-code-snippet>
          </li>
          <li>
            <b>lookup(lambda)</b>
            <base-code-snippet runnable style="margin-top: 10px">
<pre><code v-highlight>log(["apple", "banana", "cherry"].lookup(lambda(x) -> x.length() > 5)) // "banana"
            </code></pre>
</base-code-snippet>
          </li>
          <li>
            <b>forEach(lambda)</b>
            <base-code-snippet runnable style="margin-top: 10px">
<pre><code v-highlight>[1, 2].forEach(lambda(x) -> log(x))
            </code></pre>
</base-code-snippet>
          </li>
          <li>
            <b>peek(lambda)</b> - Executes a lambda for its side effects, then returns the original array!
            <base-code-snippet runnable style="margin-top: 10px">
<pre><code v-highlight>log([1, 2, 3].peek(lambda(x) -> log("Checking: " + x)).map(lambda(x) -> x * 2))
            </code></pre>
</base-code-snippet>
          </li>
          <li>
            <b>sort(lambda?)</b>
            <base-code-snippet runnable style="margin-top: 10px">
<pre><code v-highlight>log([3, 1, 2].sort(lambda(a, b) -> a - b)) // [1, 2, 3]
            </code></pre>
</base-code-snippet>
          </li>
        </ul>
      </div>
    </details>

    <details class="docs-details">
      <summary><h3>Chaining Example</h3></summary>
      <div class="details-content">
        <base-code-snippet runnable>
<pre><code v-highlight>[1, 2, 3, 4, 5]
  .filter(lambda(x) -> x % 2 != 0)
  .map(lambda(x) -> x * 2)
  .forEach(lambda(x) -> log(x))
        </code></pre>
</base-code-snippet>
      </div>
    </details>
  </section>
</template>

<script lang="ts">
export default {
  name: "StringsArrays"
};
</script>

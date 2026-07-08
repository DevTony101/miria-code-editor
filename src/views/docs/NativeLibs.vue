<template>
  <section class="docs-section">
    <h2>Native Libraries</h2>
    <p>Miria comes bundled with several native libraries that you can import using the <code>import</code> statement.</p>

    <h3>Math Namespace</h3>
    <p>The Math namespace provides mathematical constants and functions.</p>
    <base-code-snippet runnable>
<pre><code v-highlight>import "math.mi"

log(Math::PI)
log(Math::pow(2, 3)) // 8
log(Math::random())  // Float between 0 and 1
log(Math::max(10, 20)) // 20
    </code></pre>
</base-code-snippet>

    <h3>Time Namespace</h3>
    <p>Dates in Miria are wrapped in a <code>Date</code> object which provides methods for mutation and retrieval.</p>
    <base-code-snippet runnable>
<pre><code v-highlight>import "time.mi"

today := Time::now()
log(today.year())
log(today.month())

// Date methods return 'this' so they can be chained!
nextWeek := today.addDays(7).addMonths(1)
    </code></pre>
</base-code-snippet>

    <h3>Custom Libraries</h3>
    <p>To create your own library, declare a file with functions or namespaces, and then <code>import</code> it into your main project.</p>
    <base-code-snippet id="logger-lib">
<pre><code v-highlight>// In logger.mi
namespace Logger

define info as fun(msg -> str) -> void {
  log("[INFO]: " + msg)
}
    </code></pre>
</base-code-snippet>

    <p>And then import it into your main project.</p>
    <base-code-snippet runnable :depends-on="['logger-lib']">
<pre><code v-highlight>// In main.mi
import "logger.mi"

Logger::info("App started")
    </code></pre>
</base-code-snippet>
  </section>
</template>

<script lang="ts">
export default {
  name: "NativeLibs"
};
</script>

<template>
  <div class="docs-hero">
    <h1 class="hero-title">What is Miria?</h1>
    <p class="hero-subtitle">
      A fun, expressive, and unapologetically quirky programming language built
      for the joy of it.
    </p>
  </div>

  <section class="docs-section">
    <h2>Overview</h2>
    <p>
      Miria is a high-level, object-oriented language with a clean and
      expressive syntax built around readability and personality. It borrows
      familiar concepts from modern programming paradigms, then puts its own
      spin on everything: from how you declare variables to how you define
      functions and classes.
    </p>
    <p>
      Miria ships with a built-in interpreter that runs entirely in the browser,
      so there is nothing to install. You write Miria, you click Run, and you
      see the output; that is the whole deal.
    </p>
    <p>
      Let's be clear about something upfront:
      <strong
        >Miria is a language built for educational and recreational
        purposes.</strong
      >
      Think of it as a fun experiment.
    </p>

  </section>

  <section class="docs-section">
    <h2>What makes it fun?</h2>
    <div class="tip-box">
      <span class="tip-title">THE SPIRIT OF MIRIA</span>
      <p>
        If you find yourself smiling at a keyword choice or enjoying the way a
        loop reads out loud, that is Miria working exactly as intended.
      </p>
    </div>
    <p>
      Miria leans into expressive, almost human-readable syntax. A few
      highlights:
    </p>
    <ul class="overview-list">
      <li>
        <code>evaluate if</code> instead of plain <code>if</code>: because you
        are <em>evaluating</em> a condition.
      </li>
      <li>
        <code>repeat { } while ()</code> for loops: the block comes first, just
        like your intentions.
      </li>
      <li>
        <code>define add as fun(a, b) -&gt; number</code>: functions that read
        like a declaration.
      </li>
      <li>
        <code>define class Cat inheriting from Pet implementing Animal</code>:
        OOP in plain English.
      </li>
      <li>
        F-strings, lambdas, namespaces, enums, and more: all with a consistent
        Miria twist.
      </li>
    </ul>
  </section>

  <section class="docs-section">
    <h2>How to use these docs</h2>
    <p>
      Use the sidebar to navigate through the language reference. Every page
      includes interactive code snippets you can run directly in the browser
      with no setup required. Start with <strong>Getting Started</strong> if you
      want to jump straight into writing code, or explore any section that
      catches your eye.
    </p>
  </section>
</template>

<script lang="ts">
  export default {
    name: "Overview",
  };
</script>

<style scoped>
  .overview-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .overview-list li {
    font-size: 1.05rem;
    line-height: 1.7;
    color: #a0a6bd;
    padding-left: 1.25rem;
    position: relative;
  }

  .overview-list li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: #c6a0f6;
    font-weight: 700;
  }
</style>

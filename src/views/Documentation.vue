<template>
  <div class="documentation main-content">
    <div class="title-box">
      <h2 class="title">MIRIA DOCUMENTATION</h2>
      <p>Currently in development process</p>
    </div>
    <hr />
    <p>
      Miria is an (or at least attempts to be) an object oriented programming
      language. Its syntax is inspired by those languages who force you to
      declare the type of your variable before you can do anything with it, in
      fact, those who programmed in <b>Swift</b> will see a resemblance, however
      <b>Miria</b> natively only supports three datatypes: <i>Number</i>,
      <i>String</i> and <i>Boolean</i>, this specs are explained thoroughly in
      coming sections. There iss also a fourth datatype <i>Void</i> that stands
      for the lack of a return statement in a function definition.
    </p>
    <p>
      Miria's syntax was made with effectiveness of code in mind, meaning that
      the resulting code would be as self explanatory as possible, since it
      picks up the best from other programming languages.
    </p>
    <h3>Getting Started</h3>
    <hr />
    <p>
      In a style similar to <b>C</b>, your source code must be enclosed in
      <i>functions</i> and this functions must be called from within a single
      function <b>main</b> that returns, yeah you guessed it, <b>void</b>. The
      reason behind this, at least for <b>Miria</b>, its because its so much
      easy to parse than having to write every possible grammatical rule in a
      <i>top level statement</i>. Of course you, the programmer, does not care
      about this, your only concern is how to write a <i>Hello World</i> program
      in <b>Miria</b>, and is as simple as:
    </p>
    <pre>
      define main as fun() -> void {
        log("Hello World")
      }</pre
    >
    <p>
      This little example serves to show us two main aspects of <b>Miria</b>:
    </p>
    <ul>
      <li>
        You can define a function with the keyword <b><i>define</i></b> followed
        by the name of your function, the keyword <b><i>fun</i></b
        >, the parameters of the function, in this case none and the return type
        of the function, that as you may recall, in the case of the
        <b>main</b> function, it needs to be <b>void</b>
      </li>
      <li>
        There is a global function named <b><i>log</i></b> that you can use to
        print stuff to the console
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "Documentation",
  };
</script>

<style scoped>
  .title-box {
    display: flex;
    align-items: center;
  }

  .title-box > p {
    margin-left: 15px;
    color: #d1d1d1;
  }

  p {
    text-align: justify;
  }

  pre {
    align-items: center;
  }
</style>

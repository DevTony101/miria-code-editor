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
    <h3>Expressions</h3>
    <hr />
    <p>
      A programming language wouldn't be one if it didn't support the evaluation
      of expressions of some sort (sorry HTML). But what are expressions? First
      we must define what an <b>statement</b> is, an statement is just a
      <i>command</i>, that your PC can recognize through a programming language,
      an <b>expression</b> is just an statement that returns a value, not
      necessarily a numeric one, currently <b>Miria</b> only supports the
      following expression statements:
    </p>
    <ul>
      <li>Arithmetic expressions</li>
      <li>Boolean expressions</li>
      <li>Function call expressions</li>
    </ul>
    <p>Here are some examples:</p>
    <pre>
      define main as fun() -> void {
        # prints 10
        log(2+2*(16/(8-4)))
        # prints true
        log(16 % 2 == 0)
        # prints false
        log(2 == 4)
      }</pre
    >
    <h3>Variables</h3>
    <hr />
    <p>
      Printing out numbers and boolean literals is cool and all, but most of the
      time you would want to store the result of an expression for later use,
      that's when <b>variables</b> come in. Lets say you want to print a very
      polite salute along with the name of the person, you may do something like
      this:
    </p>
    <pre>
      define main as fun() -> void {
        msg -> string
        name -> string := "Tony"
        msg := "Hello, " + name
        # prints "Hello, Tony"
        log(msg)
      }</pre
    >
    <p>
      This example serves to show us three important things:
    </p>
    <ul>
      <li>
        You can <b><i>declare</i></b> a variable by writing the name of it,
        followed by the <b><i>define</i></b> operator <i>-></i> and then the
        data type you want your variable to be
      </li>
      <li>
        You can <b><i>assign</i></b> a value to your variable by using the
        <b><i>assign</i></b> operator <i>:=</i>
      </li>
      <li>
        You can of course, do the previous in a single line
      </li>
    </ul>
    <p>
      Now lets say you want to say whether a number is even or not, you may do
      something like this:
    </p>
    <pre>
      define main as fun() -> void {
        n -> number := 16
        isEven -> boolean := n % 2 == 0
        msg -> string := n + " is even? " + isEven
        # prints "16 is even? true"
        log(msg)
      }</pre
    >
    <p>
      As you can see, you can assign the returning value of any expression in a
      variable as long as the return type of the expression matches that of the
      variable, if you try to do something like this:
    </p>
    <pre>
      define main as fun() -> void {
        s -> string := 2 == 2
      }</pre
    >
    <p>You will get the following error:</p>
    <pre style="color: var(--error-msg)">
      Error - Datatype string but storing a boolean at line 2 col 2
    </pre>
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

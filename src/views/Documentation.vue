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
    <h3>Control Structures</h3>
    <hr />
    <p>
      Currently, <b>Miria</b> only supports the <b><i>if statement</i></b> as
      its only control structure (it is planned that <b>Miria</b> recognizes the
      <b><i>switch statement</i></b> too). <i>If</i> you have programmed before
      this should be a bliss, <i>if not</i>, don't worry because in
      <b>Miria</b> is just as simple as:
    </p>
    <pre>
      define main as fun() -> void {
        # prints "Its true!"
        evaluate if (true) {
          log("Its true!")
        }
      }</pre
    >
    <p>
      This is pretty straight forward, what we are doing here is asking
      <i>if</i> the condition inside the parenthesis <b>evaluates</b> to
      <i>true</i>, if it does, executes the statements inside the curly
      brackets. Notice that the keyword <b>evaluate</b> it's not a coincidence,
      you can evaluate expressions inside here and even reference variables,
      anything that returns a <b>boolean</b>. Remember our program to see if a
      number was even? With an if statement would be as follows:
    </p>
    <pre>
      define main as fun() -> void {
        # prints "16 is even"
        n -> number := 16
        isEven -> boolean := n % 2 == 0
        evaluate if (isEven) {
          log(n + " is even")
        }
      }</pre
    >
    <p>
      But what if our number is, in fact, an odd number? Here's where the
      <b>if not</b> statement comes to play like so:
    </p>
    <pre>
      define main as fun() -> void {
        # prints "15 is odd"
        n -> number := 15
        isEven -> boolean := n % 2 == 0
        evaluate if (isEven) {
          log(n + " is even")
        } if not {
          log(n + " is odd")
        }
      }</pre
    >
    <p>
      This is the equivalent of the <b>else</b> statement in other programming
      languages. Of course you can nest more "if statements" if you want, in an
      "<b>else if</b>" fashion like so:
    </p>
    <pre>
      define main as fun() -> void {
        # prints "15 is odd"
        n -> number := 15
        isEven -> boolean := n % 2 == 0
        evaluate if (n == 0) {
          log("Is zero")
        } else evaluate if (isEven) {
          log(n + " is even")
        } if not {
          log(n + " is odd")
        }
      }</pre
    >
    <h3>Iteration control structures</h3>
    <hr />
    <p>
      More often than not you will like to repeat the same task a certain number
      of times instead of copy pasting, that's when the iteration control
      structures take place. <b>Miria</b> currently supports the following:
    </p>
    <h4>Foreach loop</h4>
    <p>
      It's <b>Miria's</b> version of a <i>for loop</i>, in <b>Miria</b> a
      <i>foreach loop</i> is an executable statement that cycles through what
      it's called an <b>iterable</b>, an iterable it's just anything that
      returns an <i>object</i> that you can iterate on. It sounds weird but
      actually its an easy concept, here's what you would do:
    </p>
    <pre>
      define main as fun() -> void {
        # prints numbers from 0 to 9
        foreach (i -> number in range(0, 10)) {
          log(i)
        }
      }</pre
    >
    <p>So, what exactly is happening here?</p>
    <ul>
      <li>
        First, we <b>declare</b> a variable named <b>i</b> and say to Miria that
        is a
        <i>number</i>
      </li>
      <li>
        We said that the foreach loop iterates over an iterable object and thats
        exactly what the <b>range</b> function is returning. The
        <b>range</b> function is a core function of <b>Miria</b> and what is
        doing is that is returning a list object and assigning each of the
        list's values to <b>i</b>
      </li>
      <li>
        Finally we are printing the different values that <b>i</b> is getting
      </li>
    </ul>
    <p>
      The 2 arguments that the <b>range</b> function take are the lower and
      upper limits and they can be anything you like
    </p>
    <pre>
      define main as fun() -> void {
        a -> number := 34
        b -> number := 52
        # prints numbers from 34 to 51
        foreach (i -> number in range(a, b)) {
          log(i)
        }
      }</pre
    >
    <p>
      The <b>range</b> function take exactly two arguments and returns a list
      with values that goes from <b><i>a</i></b> to <b><i>b - 1</i></b
      >, if you pass just one argument, it will be considered as the upper limit
      and the values will go from <b><i>0</i></b> to <b><i>b - 1</i></b
      >. However if you pass zero arguments or more than two, you will recieve
      the following errors:
    </p>
    <pre style="color: var(--error-msg)">
      Error - Range function should take exactly 2 arguments, none were given</pre
    >
    <pre style="color: var(--error-msg)">
      Error - Range function should take exactly 2 arguments, 3 were given</pre
    >
    <p>
      So, what if we now want to know all the even and odd numbers between the
      <b>range</b> that goes from 0 to 25? We may do something like this:
    </p>
    <pre>
      define main as fun() -> void {
        # prints even and odd number from 0 to 24
        b -> number := 25
        i -> number
        isEven -> boolean
        foreach (i in range(b)) {
          isEven := i % 2 == 0
          evaluate if (isEven) {
            log(i + " is even")
          } if not {
            log(i + " is odd")
          }
        }
      }</pre
    >
    <h4>Repeat-While loop</h4>
    <p>
      It's <b>Miria's</b> version of a <i>while loop</i>, in <b>Miria</b> a
      <i>repeat-while loop</i> it's what you use when you want your code to be
      repeated a certain number of times but you don't know <i>how many</i>. It
      does this by continuously checking a boolean expression,
      <b>if it's true</b>, then <b>repeat</b>, if not, then break the loop.
      Here's a simple example:
    </p>
    <pre>
      define main as fun() -> void {
        # prints "hello world" five times
        i -> number
        repeat {
          log("Hello world")
          i := i + 1
        } while (i &lt; 5)
      }</pre
    >
    <h4>Once repeat-while loop</h4>
    <p>
      It's <b>Miria's</b> version of a <i>do-while loop</i>, in <b>Miria</b> a
      <i>once repeat-while loop</i> does exactly what you think it would, it
      executes the code inside at least once regardless of the value of the
      boolean expression. Here's an example:
    </p>
    <pre>
      define main as fun() -> void {
        # prints "hello world" exactly once
        i -> number := 0
        once repeat {
          log("Hello world")
        } while (i > 0)
      }</pre
    >
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

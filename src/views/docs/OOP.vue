<template>
  <section class="docs-section">
    <h2>Object-Oriented Programming (OOP)</h2>
    <p>
      Miria provides a robust, fully-featured OOP model complete with <b>encapsulation</b>, <b>inheritance</b>, <b>interfaces</b>, and <b>polymorphism</b>.
      All properties inside a class are <b>private by default</b> and can only be accessed using <code>this.property</code>.
    </p>

    <h3>Classes, Constructors & Encapsulation</h3>
    <p>
      The engine automatically synthesizes getter and setter methods when a property is first assigned in the constructor!
      You can override these generated methods using the <code>@getter</code> and <code>@setter</code> decorators.
    </p>
    <base-code-snippet runnable>
<pre><code v-highlight>define class Dog as {
  constructor(name, age) -> Dog {
    // Automatically creates getName(), setName(), getAge(), setAge()
    this.name := name
    this.age := age
  }

  // Override the default getter for 'name'
  @getter(this.name)
  define getSpecialName as fun() -> str {
    return "Sir " + this.name
  }
}

// See it in action!
myDog := new Dog("Rex", 5)
log(myDog.getSpecialName())
    </code></pre>
</base-code-snippet>

    <h3>Interfaces & Inheritance</h3>
    <p>
      Implement interfaces and inherit from superclasses with ease. Use the <code>super</code> keyword to access properties of the parent class, or to invoke overridden methods!
    </p>
    <base-code-snippet runnable>
<pre><code v-highlight>define interface Animal as {
  define speak as fun() -> void
}

// Base class
define class Pet as {
  constructor(name) -> Pet {
    this.name := name
  }
}

// Cat inherits from Pet and implements Animal
define class Cat inheriting from Pet implementing Animal as {
  constructor(name) -> Cat {
    // Calling parent properties works seamlessly
    super.name := name
  }

  define speak as overriding fun() -> void {
    log("Meow! I am " + super.name)
  }
}

myCat := new Cat("Mittens")
myCat.speak()
    </code></pre>
</base-code-snippet>
  </section>
</template>

<script lang="ts">
export default {
  name: "OOP"
};
</script>

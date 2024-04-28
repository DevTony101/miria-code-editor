# Miria Code Editor
This is a little project that was made to practice the concepts of Vue and the concepts of grammars, especifically, the context free grammars for creating a new programming language called **Miria**. You can give it a try [here](https://miria-code-editor.herokuapp.com/).

## Features
![Banner](https://github.com/DevTony101/miria-code-editor/blob/main/banner.png)
The main view consist of a text area and a div that mimics a console in which the ouput of the code will appear. **Miria** is still a very young language and thus only supports the following:

- Declaration and assignment of variables
- If statements
- For, while and do-while statements

These specs a thoroughly explained in miria documentation [here](https://miria-code-editor.herokuapp.com/docs). The classic *hello world* program in Miria would be as follows:
```
define main as fun() -> void {
  log("Hello world")
}
```

**Miria** also recognizes errors related to data types, using variables that are not defined and ilegal operations.

## Known bugs
- Miria does not recognize scopes, thus when creating a variable inside any loop, miria will complain arguing that the variable already exist

## Future improvements
- Add *break* like statements
- Fix the bug related to scopes
- Add the ability to create arrays
- Add the ability to create functions

## Technologies used
- [Nearley](https://nearley.js.org/) was used to generate the parser for miria. The miria.ne file, which contains Miria's grammar, can be found in the *src/grammar/parser directory*
- [Codemirror](https://codemirror.net/) was used as the text editor

Huge thanks to @fireship-io for their tutorial on a css-only side navigation bar that ultimately defined the layout of the app.

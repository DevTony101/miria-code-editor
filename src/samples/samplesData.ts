export const categories = [
  "OOP & Structure",
  "Control Flow",
  "Functions",
  "Error Handling",
  "Real World Examples"
];

export const samples = [
  // OOP & Structure
  {
    id: "oop",
    category: "OOP & Structure",
    title: "OOP & Interfaces",
    description: "Learn how to define interfaces, classes, constructors, and override methods using inheritance.",
    pName: "OOP_Showcase",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'import "animals.mi"\n\ndefine main as fun() -> void {\n  myCat := new Cat("Whiskers")\n  myCat.speak()\n}' },
      { id: 'file_animals', name: 'animals.mi', content: 'define interface Animal as {\n  define speak as fun() -> void\n}\n\ndefine class Pet as {\n  constructor(name) -> Pet {\n    this.name := name\n  }\n}\n\ndefine class Cat inheriting from Pet implementing Animal as {\n  constructor(name) -> Cat {\n    super.name := name\n  }\n  define speak as overriding fun() -> void {\n    log("Meow! I am " + super.name)\n  }\n}' }
    ]
  },
  {
    id: "properties",
    category: "OOP & Structure",
    title: "Properties & Getters",
    description: "See how decorators like @getter and @setter provide encapsulation for class properties.",
    pName: "Properties_Showcase",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'define class User as {\n  constructor(age) -> User {\n    this.age := age\n  }\n  \n  @getter(this.age)\n  define getAge as fun() -> number {\n    return this.age\n  }\n  \n  @setter(this.age)\n  define setAge as fun(val) -> void {\n    evaluate if (val < 0) {\n      log("Age cannot be negative!")\n      this.age := 0\n      return\n    }\n    this.age := val\n  }\n}\n\ndefine main as fun() -> void {\n  u := new User(20)\n  log("Initial: " + u.getAge())\n  u.setAge(-5)\n  log("After negative set: " + u.getAge())\n  u.setAge(25)\n  log("After valid set: " + u.getAge())\n}' }
    ]
  },
  {
    id: "dictionaries",
    category: "OOP & Structure",
    title: "Dictionaries & Enums",
    description: "Create structured dictionaries and use predefined Enum states natively in Miria.",
    pName: "Dictionaries_Showcase",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'define enum Roles {\n  GUEST, USER, ADMIN\n}\n\ndefine main as fun() -> void {\n  user := {\n    "username": "jane_doe",\n    "role": Roles.ADMIN,\n    "active": true\n  }\n  log(f"User {user.username} has role ID: {user.role}")\n}' }
    ]
  },

  // Control Flow
  {
    id: "switch",
    category: "Control Flow",
    title: "Switch Statements",
    description: "Explore the dual nature of switch statements (as a block executor and as an expression evaluator).",
    pName: "Switch_Showcase",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'define main as fun() -> void {\n  status := "PENDING"\n  \n  // 1. Switch as a Statement\n  switch from (status) to fun {\n    case "APPROVED" -> log("It is approved!")\n    case "PENDING" as fun() -> void {\n      log("Waiting for approval...")\n    }\n    default as fun() -> void {\n      log("Unknown!")\n    }\n  }\n  \n  // 2. Switch as an Expression\n  code := switch from (status) to value {\n    case "APPROVED" -> 200\n    case "PENDING" -> 202\n    default -> 500\n  }\n  log(f"Status Code: {code}")\n}' }
    ]
  },
  {
    id: "sorting",
    category: "Control Flow",
    title: "Bubble Sort (Loops)",
    description: "A classic algorithm demonstrating nested repeat-while loops and array modifications.",
    pName: "Bubble_Sort",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'import "sorter.mi"\n\ndefine main as fun() -> void {\n  arr := [5, 3, 8, 1, 2]\n  log(f"Original: {arr}")\n  Sorter::bubbleSort(arr)\n  log(f"Sorted: {arr}")\n}' },
      { id: 'file_sorter', name: 'sorter.mi', content: 'namespace Sorter\n\ndefine bubbleSort as fun(arr) -> void {\n  n := arr.length()\n  i := 0\n  repeat {\n    j := 0\n    repeat {\n      evaluate if (arr[j] > arr[j + 1]) {\n        temp := arr[j]\n        arr[j] := arr[j + 1]\n        arr[j + 1] := temp\n      }\n      j := j + 1\n    } while (j < n - i - 1)\n    i := i + 1\n  } while (i < n - 1)\n}' }
    ]
  },
  {
    id: "ternary",
    category: "Control Flow",
    title: "Ternary Operator",
    description: "Write concise conditional logic using the evaluate ? : ternary syntax.",
    pName: "Ternary_Showcase",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'define main as fun() -> void {\n  score := 85\n  result := evaluate score > 80 ? "Pass" : "Fail"\n  log(f"Score: {score} -> Result: {result}")\n}' }
    ]
  },

  // Functions
  {
    id: "hofs",
    category: "Functions",
    title: "Lambdas & HOFs",
    description: "Chain higher-order array functions using lambda expressions for elegant data transformations.",
    pName: "Lambdas_And_HOFs",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'define main as fun() -> void {\n  arr := [1, 2, 3, 4, 5, 6]\n  log(f"Original Array: {arr}")\n\n  result := arr.filter(lambda(x) -> x % 2 == 0)\n               .map(lambda(x) -> x * 10)\n               .peek(lambda(x) -> log(f"Processing: {x}"))\n               .reduce(lambda(acc, x) -> acc + x, 0)\n\n  log(f"Final Sum of Processed Evens: {result}")\n}' }
    ]
  },
  {
    id: "callbacks",
    category: "Functions",
    title: "Callback Typing",
    description: "Pass functions as parameters and type-check callback signatures.",
    pName: "Callback_Types",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'import "tasks.mi"\n\ndefine main as fun() -> void {\n  myTask := new Tasks::TaskRunner("Compile Code")\n  myTask.execute(lambda(msg) {\n    log(f"Callback received msg: {msg}")\n  })\n}' },
      { id: 'file_tasks', name: 'tasks.mi', content: 'namespace Tasks\n\ndefine class TaskRunner as {\n  constructor(name) -> TaskRunner {\n    this.name := name\n  }\n  define execute as fun(callback -> lmd(msg -> string) -> void) -> void {\n    log(f"Starting task: {this.name}")\n    callback("SUCCESS")\n  }\n}' }
    ]
  },

  // Error Handling
  {
    id: "trycatch",
    category: "Error Handling",
    title: "Try / Catch blocks",
    description: "Gracefully catch exceptions and throw custom errors natively.",
    pName: "Error_Handling",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'define divide as fun(a, b) -> number {\n  evaluate if (b == 0) {\n    throw "Cannot divide by zero!"\n  }\n  return a / b\n}\n\ndefine main as fun() -> void {\n  try {\n    log("Attempting 10 / 2 ...")\n    log("Result: " + divide(10, 2))\n    log("Attempting 10 / 0 ...")\n    log("Result: " + divide(10, 0))\n    log("This will never print!")\n  } catch (error) {\n    log(f"Caught an exception: {error}")\n  }\n}' }
    ]
  },
  {
    id: "constants",
    category: "Error Handling",
    title: "Immutable Constants",
    description: "Define constants using 'as const'. Redefining them triggers errors that can be caught.",
    pName: "Constants_Showcase",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'define main as fun() -> void {\n  try {\n    PI := as const 3.14159\n    log(f"PI is {PI}")\n    log("Trying to reassign PI to 4...")\n    PI := 4\n  } catch (err) {\n    log(f"Error caught: {err}")\n  }\n}' }
    ]
  },

  // Real World Examples
  {
    id: "processor",
    category: "Real World Examples",
    title: "Data Processor",
    description: "A data processor filtering, mapping and converting statuses using switch statements.",
    pName: "Data_Processor",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'import "processor.mi"\n\ndefine main as fun() -> void {\n  data := [\n    { "id": 1, "status": "APPROVED" },\n    { "id": 2, "status": "PENDING" },\n    { "id": 3, "status": "DENIED" }\n  ]\n  Processor::processData(data)\n}' },
      { id: 'file_processor', name: 'processor.mi', content: 'namespace Processor\n\ndefine processData as fun(records) -> void {\n  evaluate if (records.length() == 0) {\n    log("No records to process.")\n    return\n  }\n  approved := records.filter(lambda(rec) -> rec.status == "APPROVED")\n  log(f"Found {approved.length()} approved records.")\n  \n  foreach (rec in records) {\n    code := switch from (rec.status) to value {\n      case "APPROVED" -> 200\n      case "PENDING" -> 202\n      default -> 500\n    }\n    log(f"Record {rec.id} processed with code {code}")\n  }\n}' }
    ]
  },
  {
    id: "banking",
    category: "Real World Examples",
    title: "Banking System",
    description: "Simulates a bank ledger with constant transaction fees, dictionary accounts, and error handling for insufficient funds.",
    pName: "Banking_System",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'import "bank.mi"\n\ndefine main as fun() -> void {\n  myBank := new Bank::Ledger("Miria Global")\n  myBank.createAccount("A100", "John", 500)\n  myBank.createAccount("B200", "Alice", 1000)\n\n  myBank.transfer("B200", "A100", 200)\n  myBank.transfer("A100", "B200", 900) // This should fail!\n}' },
      { id: 'file_bank', name: 'bank.mi', content: 'namespace Bank\n\ndefine class Ledger as {\n  property accounts : array\n\n  constructor(name) -> Ledger {\n    this.name := name\n    this.accounts := []\n  }\n\n  define createAccount as fun(id, owner, balance) -> void {\n    this.accounts.push({ "id": id, "owner": owner, "balance": balance })\n    log(f"Account {id} created for {owner} with ${balance}.")\n  }\n\n  define findAccount as fun(id) -> dictionary {\n    results := this.accounts.filter(lambda(acc) -> acc.id == id)\n    return evaluate results.length() > 0 ? results[0] : null\n  }\n\n  define transfer as fun(fromId, toId, amount) -> void {\n    FEE := as const 2.50\n    try {\n      fromAcc := this.findAccount(fromId)\n      toAcc := this.findAccount(toId)\n      \n      evaluate if (fromAcc == null or toAcc == null) {\n         throw "Invalid account IDs!"\n      }\n      evaluate if (fromAcc.balance < amount + FEE) {\n         throw f"Insufficient funds in {fromId}. Need {amount + FEE}"\n      }\n      \n      fromAcc.balance := fromAcc.balance - (amount + FEE)\n      toAcc.balance := toAcc.balance + amount\n      log(f"SUCCESS: ${amount} transferred from {fromId} to {toId}. Fee: ${FEE}")\n    } catch (err) {\n      log(f"TRANSFER FAILED: {err}")\n    }\n  }\n}' }
    ]
  },
  {
    id: "webserver",
    category: "Real World Examples",
    title: "Mock Web Server",
    description: "Simulates HTTP requests handling using dictionaries and static router methods.",
    pName: "Web_Server",
    files: [
      { id: 'file_main', name: 'main.mi', content: 'import "server.mi"\n\ndefine main as fun() -> void {\n  Server::Router.register("/home", lambda(req) -> { "status": 200, "body": "Welcome Home!" })\n  Server::Router.register("/api/data", lambda(req) -> { "status": 200, "body": "[1, 2, 3]" })\n\n  app := new Server::App()\n  app.handleRequest({ "method": "GET", "path": "/home" })\n  app.handleRequest({ "method": "POST", "path": "/api/data" })\n  app.handleRequest({ "method": "GET", "path": "/unknown" })\n}' },
      { id: 'file_server', name: 'server.mi', content: 'namespace Server\n\ndefine class Router as {\n  static property routes : dictionary\n\n  static define init as fun() -> void {\n    // Initialize static dictionary if null\n    evaluate if (this.routes == null) {\n      this.routes := {}\n    }\n  }\n\n  static define register as fun(path, handler) -> void {\n    this.init()\n    this.routes[path] := handler\n  }\n\n  static define route as fun(request) -> dictionary {\n    this.init()\n    handler := this.routes[request.path]\n    evaluate if (handler == null) {\n      return { "status": 404, "body": "Not Found" }\n    }\n    return handler(request)\n  }\n}\n\ndefine class App as {\n  constructor() -> App {\n    log("Server App Started...")\n  }\n  \n  define handleRequest as fun(req) -> void {\n    log(f"--> Incoming {req.method} {req.path}")\n    try {\n      res := Server::Router.route(req)\n      log(f"<-- [{res.status}] {res.body}")\n    } catch (e) {\n      log(f"<-- [500] Internal Error: {e}")\n    }\n  }\n}' }
    ]
  }
];

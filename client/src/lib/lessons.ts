import { Lesson } from "../types/lessons"


// Sample lesson data
const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Introduction to JavaScript",
    description: "Learn the basics of JavaScript programming language",
    duration: 15,
    videoUrl: "/videos/intro-to-js.mp4",
    thumbnailUrl: "/placeholder.svg?height=200&width=400&text=JavaScript%20Basics",
    theoryQuestions: [
      {
        id: 101,
        question: "Which of the following is NOT a JavaScript data type?",
        options: ["String", "Boolean", "Integer", "Object"],
        correctAnswer: "Integer",
        explanation:
          "JavaScript has Number type instead of Integer and Float. The other data types (String, Boolean, and Object) are all valid JavaScript data types.",
      },
      {
        id: 102,
        question: "What will be the output of: console.log(typeof [])?",
        options: ["array", "object", "undefined", "null"],
        correctAnswer: "object",
        explanation:
          "In JavaScript, arrays are actually objects, so typeof [] returns 'object'. To check if something is an array, you can use Array.isArray([]).",
      },
      {
        id: 103,
        question: "Which statement is used to declare a variable in JavaScript that cannot be reassigned?",
        options: ["var", "let", "const", "static"],
        correctAnswer: "const",
        explanation:
          "The const keyword is used to declare variables that cannot be reassigned. However, if the variable is an object or array, its properties or elements can still be modified.",
      },
    ],
    codingChallenge: {
      id: 201,
      title: "Create a Function to Calculate Sum",
      description:
        "Write a function called 'calculateSum' that takes an array of numbers and returns the sum of all numbers in the array.",
      language: "JavaScript",
      starterCode:
        "// Write your function here\nfunction calculateSum(numbers) {\n  // Your code here\n}\n\n// Test your function\nconst numbers = [1, 2, 3, 4, 5];\nconsole.log(calculateSum(numbers)); // Should output: 15",
      solutionKeyword: "reduce",
      hints: [
        "You can use a for loop to iterate through the array",
        "Consider using array methods like reduce()",
        "Don't forget to handle empty arrays",
      ],
    },
    totalLessons: 4,
  },
  {
    id: 2,
    title: "Working with Arrays",
    description: "Master JavaScript arrays and array methods",
    duration: 20,
    videoUrl: "/videos/js-arrays.mp4",
    thumbnailUrl: "/placeholder.svg?height=200&width=400&text=JavaScript%20Arrays",
    theoryQuestions: [
      {
        id: 104,
        question: "Which array method adds elements to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correctAnswer: "push()",
        explanation:
          "push() adds one or more elements to the end of an array and returns the new length. pop() removes the last element, shift() removes the first element, and unshift() adds elements to the beginning.",
      },
      {
        id: 105,
        question: "Which array method creates a new array with the results of calling a function on every element?",
        options: ["forEach()", "filter()", "map()", "reduce()"],
        correctAnswer: "map()",
        explanation:
          "map() creates a new array with the results of calling a function on every element. forEach() executes a function on each element but doesn't return anything, filter() creates a new array with elements that pass a test, and reduce() reduces the array to a single value.",
      },
      {
        id: 106,
        question: "What is the output of [1, 2, 3].concat([4, 5])?",
        options: ["[1, 2, 3, [4, 5]]", "[1, 2, 3, 4, 5]", "Error", "[5, 4, 3, 2, 1]"],
        correctAnswer: "[1, 2, 3, 4, 5]",
        explanation:
          "The concat() method is used to merge two or more arrays. It does not change the existing arrays but returns a new array containing the values of the joined arrays.",
      },
    ],
    codingChallenge: {
      id: 202,
      title: "Filter and Transform an Array",
      description:
        "Write a function called 'getEvenSquares' that takes an array of numbers, filters out the odd numbers, and returns a new array with the square of each even number.",
      language: "JavaScript",
      starterCode:
        "// Write your function here\nfunction getEvenSquares(numbers) {\n  // Your code here\n}\n\n// Test your function\nconst numbers = [1, 2, 3, 4, 5, 6];\nconsole.log(getEvenSquares(numbers)); // Should output: [4, 16, 36]",
      solutionKeyword: "filter",
      hints: [
        "Use filter() to get only even numbers",
        "Use map() to transform each number to its square",
        "You can chain these methods together",
      ],
    },
    totalLessons: 4,
  },
  {
    id: 3,
    title: "DOM Manipulation",
    description: "Learn how to interact with the Document Object Model",
    duration: 25,
    videoUrl: "/videos/dom-manipulation.mp4",
    thumbnailUrl: "/placeholder.svg?height=200&width=400&text=DOM%20Manipulation",
    theoryQuestions: [
      {
        id: 107,
        question: "Which method is used to select an element by its ID?",
        options: [
          "document.querySelector()",
          "document.getElementById()",
          "document.getElementByClass()",
          "document.selectElement()",
        ],
        correctAnswer: "document.getElementById()",
        explanation:
          "document.getElementById() selects a single element by its ID attribute. document.querySelector() can select elements using CSS selectors, but getElementById() is more specific and slightly faster for ID selection.",
      },
      {
        id: 108,
        question: "What does the addEventListener() method do?",
        options: [
          "Creates a new DOM element",
          "Removes an element from the DOM",
          "Attaches an event handler to an element",
          "Changes the CSS of an element",
        ],
        correctAnswer: "Attaches an event handler to an element",
        explanation:
          "The addEventListener() method attaches an event handler function to an element without overwriting existing event handlers. It allows you to add many events to the same element.",
      },
      {
        id: 109,
        question: "Which property is used to change the text content of an element?",
        options: ["element.text", "element.content", "element.textContent", "element.innerHTML"],
        correctAnswer: "element.textContent",
        explanation:
          "element.textContent sets or returns the text content of a node and its descendants. element.innerHTML can also be used, but it parses content as HTML, which can be a security risk if the content is user-generated.",
      },
    ],
    codingChallenge: {
      id: 203,
      title: "Create a Toggle Button",
      description:
        "Write JavaScript code that creates a button that toggles the background color of the page between white and black when clicked.",
      language: "JavaScript",
      starterCode:
        "// Your code here\n// Assume there's already a button with id='toggleButton' in the HTML\n\n// Write code to toggle the background color when the button is clicked",
      solutionKeyword: "addEventListener",
      hints: [
        "Use document.getElementById() to select the button",
        "Add a click event listener to the button",
        "Use document.body.style.backgroundColor to change the background color",
        "Keep track of the current state to toggle between colors",
      ],
    },
    totalLessons: 4,
  },
  {
    id: 4,
    title: "Asynchronous JavaScript",
    description: "Master promises, async/await, and fetch API",
    duration: 30,
    videoUrl: "/videos/async-js.mp4",
    thumbnailUrl: "/placeholder.svg?height=200&width=400&text=Async%20JavaScript",
    theoryQuestions: [
      {
        id: 110,
        question: "Which of the following is NOT a state of a Promise?",
        options: ["Pending", "Fulfilled", "Rejected", "Cancelled"],
        correctAnswer: "Cancelled",
        explanation:
          "Promises have three states: Pending (initial state), Fulfilled (operation completed successfully), and Rejected (operation failed). There is no 'Cancelled' state in the Promise API.",
      },
      {
        id: 111,
        question: "What does the 'async' keyword do when placed before a function?",
        options: [
          "Makes the function run faster",
          "Makes the function return a Promise",
          "Prevents the function from executing",
          "Runs the function in a separate thread",
        ],
        correctAnswer: "Makes the function return a Promise",
        explanation:
          "The async keyword before a function makes it return a Promise. If the function returns a value, the Promise will be resolved with that value. If the function throws an exception, the Promise will be rejected.",
      },
      {
        id: 112,
        question: "Which method is used to handle errors in a Promise chain?",
        options: ["then()", "finally()", "catch()", "error()"],
        correctAnswer: "catch()",
        explanation:
          "The catch() method is used to handle errors in a Promise chain. It's called when the Promise is rejected. then() is used for successful operations, finally() is executed regardless of success or failure, and error() is not a Promise method.",
      },
    ],
    codingChallenge: {
      id: 204,
      title: "Fetch and Display Data",
      description:
        "Write an async function that fetches data from an API and logs the results. Use the JSONPlaceholder API: https://jsonplaceholder.typicode.com/posts/1",
      language: "JavaScript",
      starterCode:
        "// Write your async function here\nasync function fetchData() {\n  // Your code here\n}\n\n// Call your function\nfetchData();",
      solutionKeyword: "await fetch",
      hints: [
        "Use the fetch API to make the request",
        "Use await to wait for the Promise to resolve",
        "Don't forget to parse the JSON response",
        "Handle potential errors with try/catch",
      ],
    },
    totalLessons: 4,
  },
]

export function getLessons(): Lesson[] {
  return LESSONS
}

export function getLessonById(id: number): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id)
}

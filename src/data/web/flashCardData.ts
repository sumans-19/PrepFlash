
export const flashCards = [
    {
      question: "Explain the box model in CSS.",
      answer: "CSS Box Model",
      explanation: "The CSS box model describes the rectangular boxes generated for elements in the document tree. Each box has a content area (e.g., text, image) and optional surrounding padding, border, and margin areas. The box model allows us to add a border around elements and to define space between elements."
    },
    {
      question: "What is the difference between == and === in JavaScript?",
      answer: "Type Comparison",
      explanation: "== (loose equality) compares values after converting them to a common type, while === (strict equality) compares both values and types without conversion. For example, '5' == 5 is true, but '5' === 5 is false because the types are different (string vs number)."
    },
    {
      question: "What is the purpose of the 'viewport' meta tag in responsive web design?",
      answer: "Control viewport behavior",
      explanation: "The viewport meta tag gives the browser instructions on how to control the page's dimensions and scaling. It's crucial for responsive design as it ensures the page renders correctly across different devices. The most common setting is width=device-width, initial-scale=1, which sets the width of the viewport to the width of the device and the initial zoom level to 1."
    },
    {
      question: "Explain what 'semantic HTML' means.",
      answer: "Meaningful markup",
      explanation: "Semantic HTML refers to using HTML elements that clearly describe their meaning to both the browser and the developer. Examples include <header>, <footer>, <article>, and <section> instead of generic <div> elements. Semantic HTML improves accessibility, SEO, and code readability by conveying the structure and meaning of web content."
    },
    {
      question: "What is the purpose of Media Queries in CSS?",
      answer: "Responsive design",
      explanation: "Media queries allow you to apply CSS styles based on various conditions, particularly the device characteristics like width, height, or resolution. They are fundamental to responsive web design, enabling you to create layouts that adapt to different screen sizes and devices without changing the content itself."
    },
    {
      question: "What is the difference between localStorage and sessionStorage?",
      answer: "Storage persistence",
      explanation: "Both are web storage options that allow storing key-value pairs in a web browser, but localStorage data has no expiration time and persists even after the browser is closed and reopened. In contrast, sessionStorage data is cleared when the browsing session ends (when the tab is closed)."
    },
    {
      question: "Explain the concept of 'hoisting' in JavaScript.",
      answer: "Variable and function declarations",
      explanation: "Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope. This means variables and functions can be used before they're declared in the code. However, only declarations are hoisted, not initializations. For example, you can call a function before it's defined, but a variable will be undefined if accessed before its initialization."
    },
    {
      question: "What is the CSS 'z-index' property used for?",
      answer: "Stacking order",
      explanation: "The z-index property determines the stacking order of positioned elements (elements with position: relative, absolute, or fixed). An element with a higher z-index is placed on top of an element with a lower z-index. If two elements have the same z-index, the one appearing later in the HTML code is displayed above the other."
    },
    {
      question: "What is a RESTful API?",
      answer: "Architectural style",
      explanation: "REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs use HTTP requests to perform CRUD operations (Create, Read, Update, Delete) on resources, which are represented as URLs. RESTful services are stateless, meaning each request from client to server must contain all information needed to understand and process the request."
    },
    {
      question: "What is the purpose of the 'this' keyword in JavaScript?",
      answer: "Context reference",
      explanation: "The 'this' keyword refers to the object it belongs to, providing a way to access object properties and methods within the context of that object. Its value depends on how a function is called: in a method, 'this' refers to the owner object; alone, it refers to the global object; in strict mode, it's undefined; in event handlers, it refers to the element that received the event."
    }
  ];
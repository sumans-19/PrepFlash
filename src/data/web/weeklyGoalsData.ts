
import { WeeklyGoalsByWeek, CourseRoadmap } from "@/types/weeklyGoals";

// Detailed weekly goals data organized by weeks
export const weeklyGoalsData: Record<string, WeeklyGoalsByWeek> = {
  "web-development": {
    "week1": [
      { id: "web-w1-1", title: "Learn HTML basics and document structure", deadline: "Monday", completed: false, description: "Focus on semantic HTML5 elements and proper document structure." },
      { id: "web-w1-2", title: "Practice CSS fundamentals and selectors", deadline: "Wednesday", completed: false, description: "Master CSS selectors, specificity, and the box model." },
      { id: "web-w1-3", title: "Build a simple landing page with HTML/CSS", deadline: "Friday", completed: false, description: "Apply your HTML/CSS knowledge by building a responsive landing page." },
    ],
    "week2": [
      { id: "web-w2-1", title: "Learn CSS flexbox and grid layouts", deadline: "Monday", completed: false, description: "Master modern CSS layout techniques for responsive design." },
      { id: "web-w2-2", title: "Study JavaScript syntax and variables", deadline: "Wednesday", completed: false, description: "Get comfortable with JS fundamentals, data types, and control structures." },
      { id: "web-w2-3", title: "Create interactive elements with JavaScript", deadline: "Friday", completed: false, description: "Build interactive web elements responding to user actions." },
    ],
    "week3": [
      { id: "web-w3-1", title: "Master DOM manipulation with JavaScript", deadline: "Tuesday", completed: false, description: "Learn to select, modify and create DOM elements dynamically." },
      { id: "web-w3-2", title: "Study JavaScript objects and arrays", deadline: "Thursday", completed: false, description: "Deep dive into working with complex data structures." },
      { id: "web-w3-3", title: "Build an interactive form with validation", deadline: "Sunday", completed: false, description: "Create a form with client-side validation using JavaScript." },
    ],
    "week4": [
      { id: "web-w4-1", title: "Learn JavaScript async programming", deadline: "Tuesday", completed: false, description: "Master promises, async/await and handling API requests." },
      { id: "web-w4-2", title: "Study fetch API and JSON data", deadline: "Thursday", completed: false, description: "Learn to make API calls and process JSON responses." },
      { id: "web-w4-3", title: "Build a weather app using a public API", deadline: "Sunday", completed: false, description: "Create an app that fetches and displays real-time weather data." },
    ],
    "week5": [
      { id: "web-w5-1", title: "Introduction to React and JSX", deadline: "Tuesday", completed: false, description: "Learn React fundamentals, component structure, and JSX syntax." },
      { id: "web-w5-2", title: "Create functional components with hooks", deadline: "Thursday", completed: false, description: "Master useState, useEffect and other essential React hooks." },
      { id: "web-w5-3", title: "Build a React todo app", deadline: "Sunday", completed: false, description: "Apply your React knowledge to create a functional todo application." },
    ],
    "week6": [
      { id: "web-w6-1", title: "Learn state management with context API", deadline: "Tuesday", completed: false, description: "Implement global state management in React applications." },
      { id: "web-w6-2", title: "Study React routing and navigation", deadline: "Thursday", completed: false, description: "Create multi-page React apps with React Router." },
      { id: "web-w6-3", title: "Build a multi-page React app", deadline: "Sunday", completed: false, description: "Create a complete application with multiple routes and shared state." },
    ],
    "week7": [
      { id: "web-w7-1", title: "Introduction to Node.js and Express", deadline: "Tuesday", completed: false, description: "Learn server-side JavaScript with Node.js and Express framework." },
      { id: "web-w7-2", title: "Create a simple REST API with Express", deadline: "Thursday", completed: false, description: "Build API endpoints for CRUD operations." },
      { id: "web-w7-3", title: "Connect React frontend to Express backend", deadline: "Sunday", completed: false, description: "Integrate your React app with a custom API." },
    ],
    "week8": [
      { id: "web-w8-1", title: "Introduction to databases with MongoDB", deadline: "Tuesday", completed: false, description: "Learn NoSQL database concepts and MongoDB basics." },
      { id: "web-w8-2", title: "Implement authentication with JWT", deadline: "Thursday", completed: false, description: "Add user authentication to your full-stack application." },
      { id: "web-w8-3", title: "Deploy your full-stack application", deadline: "Sunday", completed: false, description: "Learn to deploy your app to platforms like Vercel, Netlify or Heroku." },
    ],
    "week9": [
      { id: "web-w9-1", title: "Learn automated testing (Jest/React Testing Library)", deadline: "Wednesday", completed: false, description: "Write unit and integration tests for your React components." },
      { id: "web-w9-2", title: "Study progressive web apps (PWA)", deadline: "Friday", completed: false, description: "Convert your application to work offline with service workers." },
      { id: "web-w9-3", title: "Build a personal portfolio website", deadline: "Sunday", completed: false, description: "Create a professional portfolio showcasing your projects." },
    ],
    "week10": [
      { id: "web-w10-1", title: "Learn TypeScript basics", deadline: "Tuesday", completed: false, description: "Add static typing to your JavaScript applications." },
      { id: "web-w10-2", title: "Convert a React project to TypeScript", deadline: "Friday", completed: false, description: "Refactor an existing React app to use TypeScript." },
      { id: "web-w10-3", title: "Start a capstone project", deadline: "Sunday", completed: false, description: "Begin work on your final comprehensive web application." },
    ],
    "week11": [
      { id: "web-w11-1", title: "Advanced React patterns and optimization", deadline: "Wednesday", completed: false, description: "Learn code-splitting, memoization and performance optimization." },
      { id: "web-w11-2", title: "Study web accessibility (a11y)", deadline: "Friday", completed: false, description: "Make your applications accessible to all users." },
      { id: "web-w11-3", title: "Continue capstone project development", deadline: "Sunday", completed: false, description: "Implement advanced features in your capstone project." },
    ],
    "week12": [
      { id: "web-w12-1", title: "Add animations and transitions", deadline: "Wednesday", completed: false, description: "Enhance UX with smooth animations and transitions." },
      { id: "web-w12-2", title: "Perform security and performance audits", deadline: "Friday", completed: false, description: "Test your application for security vulnerabilities and performance issues." },
      { id: "web-w12-3", title: "Complete and present capstone project", deadline: "Sunday", completed: false, description: "Finalize your project and prepare for presentation/deployment." },
    ],
  },
  "mobile-development": {
    "week1": [
      { id: "mobile-w1-1", title: "Set up React Native development environment", deadline: "Tuesday", completed: false, description: "Install required tools for React Native development." },
      { id: "mobile-w1-2", title: "Learn React Native basics and components", deadline: "Thursday", completed: false, description: "Understand core React Native components and styling." },
      { id: "mobile-w1-3", title: "Create a simple mobile UI", deadline: "Sunday", completed: false, description: "Build a basic mobile interface with multiple components." },
    ],
    "week2": [
      { id: "mobile-w2-1", title: "Study navigation in React Native", deadline: "Tuesday", completed: false, description: "Learn stack, tab and drawer navigation patterns." },
      { id: "mobile-w2-2", title: "Implement screen navigation in a sample app", deadline: "Thursday", completed: false, description: "Create an app with multiple screens and navigation." },
      { id: "mobile-w2-3", title: "Learn about styling and responsive design for mobile", deadline: "Sunday", completed: false, description: "Adapt designs to different screen sizes and orientations." },
    ],
    "week3": [
      { id: "mobile-w3-1", title: "Study form components and user input", deadline: "Wednesday", completed: false, description: "Master text inputs, form controls and validation for mobile." },
      { id: "mobile-w3-2", title: "Work with lists and data", deadline: "Friday", completed: false, description: "Implement FlatList, SectionList and handle large datasets." },
      { id: "mobile-w3-3", title: "Build a contacts/todo app", deadline: "Sunday", completed: false, description: "Create an app managing a list of items with CRUD operations." },
    ],
    "week4": [
      { id: "mobile-w4-1", title: "State management in React Native", deadline: "Tuesday", completed: false, description: "Implement Context API or Redux for global state." },
      { id: "mobile-w4-2", title: "Learn networking and API integration", deadline: "Thursday", completed: false, description: "Make API calls and handle responses in mobile apps." },
      { id: "mobile-w4-3", title: "Build an app consuming a public API", deadline: "Sunday", completed: false, description: "Create a news or weather app with real data." },
    ],
    "week5": [
      { id: "mobile-w5-1", title: "Learn about mobile storage options", deadline: "Wednesday", completed: false, description: "Work with AsyncStorage for persistent data." },
      { id: "mobile-w5-2", title: "Study authentication flows for mobile", deadline: "Friday", completed: false, description: "Implement login, signup and token management." },
      { id: "mobile-w5-3", title: "Create an app with user authentication", deadline: "Sunday", completed: false, description: "Build a simple app with protected routes and user profiles." },
    ],
    "week6": [
      { id: "mobile-w6-1", title: "Learn device APIs and permissions", deadline: "Tuesday", completed: false, description: "Access camera, location, contacts and other device features." },
      { id: "mobile-w6-2", title: "Build a location-based app", deadline: "Friday", completed: false, description: "Create an app using maps and geolocation." },
      { id: "mobile-w6-3", title: "Learn about push notifications", deadline: "Sunday", completed: false, description: "Implement local and remote notifications." },
    ],
    "week7": [
      { id: "mobile-w7-1", title: "Study offline capabilities", deadline: "Wednesday", completed: false, description: "Make your apps work without internet connection." },
      { id: "mobile-w7-2", title: "Learn about animations in React Native", deadline: "Friday", completed: false, description: "Add smooth animations and transitions to your UI." },
      { id: "mobile-w7-3", title: "Build an interactive app with animations", deadline: "Sunday", completed: false, description: "Create an engaging UI with custom animations." },
    ],
    "week8": [
      { id: "mobile-w8-1", title: "Learn about app deployment", deadline: "Tuesday", completed: false, description: "Prepare your app for submission to app stores." },
      { id: "mobile-w8-2", title: "Study app performance optimization", deadline: "Thursday", completed: false, description: "Debug and optimize React Native performance." },
      { id: "mobile-w8-3", title: "Start your capstone mobile project", deadline: "Sunday", completed: false, description: "Begin development of a comprehensive mobile application." },
    ],
    "week9": [
      { id: "mobile-w9-1", title: "Advanced UI components and libraries", deadline: "Wednesday", completed: false, description: "Integrate third-party UI libraries for complex interfaces." },
      { id: "mobile-w9-2", title: "Learn about testing in React Native", deadline: "Friday", completed: false, description: "Write unit and integration tests for your app." },
      { id: "mobile-w9-3", title: "Continue capstone project development", deadline: "Sunday", completed: false, description: "Add core functionality to your capstone project." },
    ],
    "week10": [
      { id: "mobile-w10-1", title: "Implement in-app purchases/subscriptions", deadline: "Wednesday", completed: false, description: "Add monetization features to your application." },
      { id: "mobile-w10-2", title: "Study analytics integration", deadline: "Friday", completed: false, description: "Track user behavior and app performance." },
      { id: "mobile-w10-3", title: "Continue capstone project development", deadline: "Sunday", completed: false, description: "Add advanced features to your application." },
    ],
  },
  "cloud-computing": {
    "week1": [
      { id: "cloud-w1-1", title: "Learn cloud computing fundamentals", deadline: "Tuesday", completed: false, description: "Understand cloud service models (IaaS, PaaS, SaaS) and benefits." },
      { id: "cloud-w1-2", title: "Set up AWS account and learn IAM basics", deadline: "Thursday", completed: false, description: "Create a secure AWS account and understand identity management." },
      { id: "cloud-w1-3", title: "Deploy your first EC2 instance", deadline: "Sunday", completed: false, description: "Launch and connect to a virtual machine in the cloud." },
    ],
    "week2": [
      { id: "cloud-w2-1", title: "Study AWS networking basics (VPC)", deadline: "Wednesday", completed: false, description: "Learn about virtual private clouds, subnets and routing." },
      { id: "cloud-w2-2", title: "Configure S3 storage buckets", deadline: "Friday", completed: false, description: "Set up object storage and understand access policies." },
      { id: "cloud-w2-3", title: "Deploy a static website to S3", deadline: "Sunday", completed: false, description: "Host a website using S3 and CloudFront." },
    ],
    "week3": [
      { id: "cloud-w3-1", title: "Learn about database options in AWS", deadline: "Tuesday", completed: false, description: "Study RDS, DynamoDB, and other database services." },
      { id: "cloud-w3-2", title: "Set up a MySQL database with RDS", deadline: "Thursday", completed: false, description: "Launch and configure a relational database." },
      { id: "cloud-w3-3", title: "Create a simple application with database", deadline: "Sunday", completed: false, description: "Build an application that connects to your cloud database." },
    ],
    "week4": [
      { id: "cloud-w4-1", title: "Learn serverless computing with Lambda", deadline: "Wednesday", completed: false, description: "Understand serverless architecture and Lambda functions." },
      { id: "cloud-w4-2", title: "Build API Gateway integrations", deadline: "Friday", completed: false, description: "Create REST APIs with API Gateway and Lambda." },
      { id: "cloud-w4-3", title: "Deploy a serverless application", deadline: "Sunday", completed: false, description: "Build a complete serverless app with multiple functions." },
    ],
    "week5": [
      { id: "cloud-w5-1", title: "Study container technologies (Docker)", deadline: "Tuesday", completed: false, description: "Learn Docker basics and containerize an application." },
      { id: "cloud-w5-2", title: "Explore AWS container services (ECS/EKS)", deadline: "Thursday", completed: false, description: "Understand container orchestration in AWS." },
      { id: "cloud-w5-3", title: "Deploy a containerized application", deadline: "Sunday", completed: false, description: "Run your containerized app in AWS." },
    ],
    "week6": [
      { id: "cloud-w6-1", title: "Learn infrastructure as code with CloudFormation", deadline: "Wednesday", completed: false, description: "Automate infrastructure deployment with templates." },
      { id: "cloud-w6-2", title: "Study CI/CD pipelines with AWS", deadline: "Friday", completed: false, description: "Use CodePipeline for continuous integration/deployment." },
      { id: "cloud-w6-3", title: "Set up automated deployments", deadline: "Sunday", completed: false, description: "Create a complete CI/CD pipeline for an application." },
    ],
    "week7": [
      { id: "cloud-w7-1", title: "Learn monitoring and logging with CloudWatch", deadline: "Tuesday", completed: false, description: "Set up monitoring, alarms and log analysis." },
      { id: "cloud-w7-2", title: "Study AWS security best practices", deadline: "Thursday", completed: false, description: "Implement security controls and compliance measures." },
      { id: "cloud-w7-3", title: "Secure your cloud infrastructure", deadline: "Sunday", completed: false, description: "Apply security best practices to your applications." },
    ],
    "week8": [
      { id: "cloud-w8-1", title: "Learn about scaling and load balancing", deadline: "Wednesday", completed: false, description: "Implement auto-scaling and load balancing for high availability." },
      { id: "cloud-w8-2", title: "Study disaster recovery strategies", deadline: "Friday", completed: false, description: "Plan for backup, recovery and business continuity." },
      { id: "cloud-w8-3", title: "Start a cloud architecture project", deadline: "Sunday", completed: false, description: "Begin designing a scalable, resilient cloud architecture." },
    ],
    "week9": [
      { id: "cloud-w9-1", title: "Learn about messaging services (SQS, SNS)", deadline: "Tuesday", completed: false, description: "Understand decoupling applications with messaging." },
      { id: "cloud-w9-2", title: "Study cloud cost optimization", deadline: "Thursday", completed: false, description: "Implement strategies to reduce and manage cloud costs." },
      { id: "cloud-w9-3", title: "Continue cloud architecture project", deadline: "Sunday", completed: false, description: "Implement core infrastructure for your project." },
    ],
    "week10": [
      { id: "cloud-w10-1", title: "Learn about multi-region deployments", deadline: "Wednesday", completed: false, description: "Design globally distributed applications." },
      { id: "cloud-w10-2", title: "Study advanced networking features", deadline: "Friday", completed: false, description: "Implement VPC peering, Direct Connect, and Transit Gateway." },
      { id: "cloud-w10-3", title: "Complete cloud architecture project", deadline: "Sunday", completed: false, description: "Finalize and document your cloud architecture." },
    ],
  },
  "ai-ml": {
    "week1": [
      { id: "ai-w1-1", title: "Set up Python environment for data science", deadline: "Tuesday", completed: false, description: "Install Python and essential libraries (NumPy, Pandas)." },
      { id: "ai-w1-2", title: "Learn Python basics for data manipulation", deadline: "Thursday", completed: false, description: "Practice with arrays, dataframes and data cleaning." },
      { id: "ai-w1-3", title: "Complete data preprocessing tutorial", deadline: "Sunday", completed: false, description: "Clean, transform and prepare a dataset for analysis." },
    ],
    "week2": [
      { id: "ai-w2-1", title: "Learn data visualization with matplotlib/seaborn", deadline: "Wednesday", completed: false, description: "Create effective visualizations to understand data." },
      { id: "ai-w2-2", title: "Study descriptive statistics", deadline: "Friday", completed: false, description: "Perform statistical analysis on datasets." },
      { id: "ai-w2-3", title: "Complete an exploratory data analysis project", deadline: "Sunday", completed: false, description: "Analyze a dataset and present findings with visualizations." },
    ],
    "week3": [
      { id: "ai-w3-1", title: "Learn about supervised learning concepts", deadline: "Tuesday", completed: false, description: "Understand regression and classification problems." },
      { id: "ai-w3-2", title: "Study linear regression algorithms", deadline: "Thursday", completed: false, description: "Implement simple and multiple linear regression." },
      { id: "ai-w3-3", title: "Build your first regression model", deadline: "Sunday", completed: false, description: "Create and evaluate a model predicting continuous values." },
    ],
    "week4": [
      { id: "ai-w4-1", title: "Study classification algorithms", deadline: "Wednesday", completed: false, description: "Learn logistic regression, decision trees and KNN." },
      { id: "ai-w4-2", title: "Learn model evaluation metrics", deadline: "Friday", completed: false, description: "Understand accuracy, precision, recall and F1-score." },
      { id: "ai-w4-3", title: "Build a classification model", deadline: "Sunday", completed: false, description: "Create a model to categorize data and evaluate its performance." },
    ],
    "week5": [
      { id: "ai-w5-1", title: "Learn about unsupervised learning", deadline: "Tuesday", completed: false, description: "Study clustering and dimensionality reduction." },
      { id: "ai-w5-2", title: "Implement K-means clustering", deadline: "Thursday", completed: false, description: "Group data into clusters without labels." },
      { id: "ai-w5-3", title: "Apply PCA for dimensionality reduction", deadline: "Sunday", completed: false, description: "Reduce data complexity while preserving important information." },
    ],
    "week6": [
      { id: "ai-w6-1", title: "Introduction to neural networks", deadline: "Wednesday", completed: false, description: "Understand neurons, activation functions and network architecture." },
      { id: "ai-w6-2", title: "Learn about TensorFlow/PyTorch", deadline: "Friday", completed: false, description: "Set up deep learning frameworks and understand basics." },
      { id: "ai-w6-3", title: "Build a simple neural network", deadline: "Sunday", completed: false, description: "Create and train a neural network for a basic task." },
    ],
    "week7": [
      { id: "ai-w7-1", title: "Study convolutional neural networks (CNNs)", deadline: "Tuesday", completed: false, description: "Learn CNN architecture for image processing." },
      { id: "ai-w7-2", title: "Implement image classification with CNNs", deadline: "Thursday", completed: false, description: "Train a model to recognize objects in images." },
      { id: "ai-w7-3", title: "Build an image recognition application", deadline: "Sunday", completed: false, description: "Create a complete application using a CNN model." },
    ],
    "week8": [
      { id: "ai-w8-1", title: "Learn about recurrent neural networks (RNNs)", deadline: "Wednesday", completed: false, description: "Understand sequential data processing with RNNs." },
      { id: "ai-w8-2", title: "Study natural language processing basics", deadline: "Friday", completed: false, description: "Learn text preprocessing and vectorization techniques." },
      { id: "ai-w8-3", title: "Build a text classification model", deadline: "Sunday", completed: false, description: "Create a model to categorize text documents." },
    ],
    "week9": [
      { id: "ai-w9-1", title: "Learn about model deployment", deadline: "Tuesday", completed: false, description: "Understand serving ML models in production." },
      { id: "ai-w9-2", title: "Study REST API development for ML", deadline: "Thursday", completed: false, description: "Create APIs to serve predictions from your models." },
      { id: "ai-w9-3", title: "Deploy an ML model as a web service", deadline: "Sunday", completed: false, description: "Make your model accessible through an API endpoint." },
    ],
    "week10": [
      { id: "ai-w10-1", title: "Learn about reinforcement learning basics", deadline: "Wednesday", completed: false, description: "Understand agents, environments and rewards." },
      { id: "ai-w10-2", title: "Study A/B testing for ML models", deadline: "Friday", completed: false, description: "Learn how to compare model performance in production." },
      { id: "ai-w10-3", title: "Begin ML capstone project", deadline: "Sunday", completed: false, description: "Start work on a comprehensive ML application." },
    ],
    "week11": [
      { id: "ai-w11-1", title: "Learn about MLOps practices", deadline: "Tuesday", completed: false, description: "Study ML system design and operational best practices." },
      { id: "ai-w11-2", title: "Implement monitoring for ML models", deadline: "Thursday", completed: false, description: "Set up performance tracking for deployed models." },
      { id: "ai-w11-3", title: "Continue ML capstone project", deadline: "Sunday", completed: false, description: "Add advanced features to your ML application." },
    ],
    "week12": [
      { id: "ai-w12-1", title: "Study ethical considerations in AI", deadline: "Wednesday", completed: false, description: "Learn about bias, fairness and responsible AI." },
      { id: "ai-w12-2", title: "Final model optimizations", deadline: "Friday", completed: false, description: "Improve your model's performance and efficiency." },
      { id: "ai-w12-3", title: "Complete and present ML capstone project", deadline: "Sunday", completed: false, description: "Finalize your project and prepare documentation." },
    ],
  },
  "game-development": {
    "week1": [
      { id: "game-w1-1", title: "Install game engine (Unity) and set up", deadline: "Tuesday", completed: false, description: "Set up development environment and learn interface." },
      { id: "game-w1-2", title: "Learn about GameObjects and components", deadline: "Thursday", completed: false, description: "Understand the building blocks of Unity projects." },
      { id: "game-w1-3", title: "Create a simple 2D scene", deadline: "Sunday", completed: false, description: "Build your first game environment with basic objects." },
    ],
    "week2": [
      { id: "game-w2-1", title: "Learn C# basics for Unity", deadline: "Wednesday", completed: false, description: "Master fundamental programming concepts for game development." },
      { id: "game-w2-2", title: "Implement basic player movement", deadline: "Friday", completed: false, description: "Create scripts for controlling character movement." },
      { id: "game-w2-3", title: "Add collision detection", deadline: "Sunday", completed: false, description: "Implement physics interactions between game objects." },
    ],
    "week3": [
      { id: "game-w3-1", title: "Study game physics in Unity", deadline: "Tuesday", completed: false, description: "Learn about rigidbodies, forces and physics materials." },
      { id: "game-w3-2", title: "Create platformer game mechanics", deadline: "Thursday", completed: false, description: "Implement jumping, moving platforms and obstacles." },
      { id: "game-w3-3", title: "Build a simple platformer level", deadline: "Sunday", completed: false, description: "Design and implement a complete game level." },
    ],
    "week4": [
      { id: "game-w4-1", title: "Learn about game UI systems", deadline: "Wednesday", completed: false, description: "Create menus, HUDs and interactive UI elements." },
      { id: "game-w4-2", title: "Implement scoring and game state", deadline: "Friday", completed: false, description: "Add points system, win/lose conditions and state management." },
      { id: "game-w4-3", title: "Create a complete game loop", deadline: "Sunday", completed: false, description: "Build a game with start, play and end states." },
    ],
    "week5": [
      { id: "game-w5-1", title: "Study animation systems in Unity", deadline: "Tuesday", completed: false, description: "Learn about animation controllers and state machines." },
      { id: "game-w5-2", title: "Implement character animations", deadline: "Thursday", completed: false, description: "Add idle, walk, jump animations to a character." },
      { id: "game-w5-3", title: "Create animated game elements", deadline: "Sunday", completed: false, description: "Add visual polish with animations throughout your game." },
    ],
    "week6": [
      { id: "game-w6-1", title: "Learn about game audio", deadline: "Wednesday", completed: false, description: "Implement background music, sound effects and audio mixing." },
      { id: "game-w6-2", title: "Study particle systems", deadline: "Friday", completed: false, description: "Create visual effects like explosions, fire and magic." },
      { id: "game-w6-3", title: "Add polish to your platformer game", deadline: "Sunday", completed: false, description: "Enhance your game with audio and visual effects." },
    ],
    "week7": [
      { id: "game-w7-1", title: "Introduction to 3D game development", deadline: "Tuesday", completed: false, description: "Learn 3D coordinates, cameras and lighting." },
      { id: "game-w7-2", title: "Create a simple 3D environment", deadline: "Thursday", completed: false, description: "Build a 3D scene with terrain and objects." },
      { id: "game-w7-3", title: "Implement 3D character controller", deadline: "Sunday", completed: false, description: "Create movement and camera controls for 3D games." },
    ],
    "week8": [
      { id: "game-w8-1", title: "Learn about game AI basics", deadline: "Wednesday", completed: false, description: "Implement pathfinding and simple enemy behaviors." },
      { id: "game-w8-2", title: "Create enemy characters with AI", deadline: "Friday", completed: false, description: "Add NPCs with state machines and decision making." },
      { id: "game-w8-3", title: "Start a 3D game project", deadline: "Sunday", completed: false, description: "Begin work on a more complex 3D game." },
    ],
    "week9": [
      { id: "game-w9-1", title: "Study game optimization techniques", deadline: "Tuesday", completed: false, description: "Learn about profiling and performance improvement." },
      { id: "game-w9-2", title: "Implement game saving/loading", deadline: "Thursday", completed: false, description: "Create persistent data storage for game progress." },
      { id: "game-w9-3", title: "Continue 3D game development", deadline: "Sunday", completed: false, description: "Add core gameplay mechanics to your 3D game." },
    ],
    "week10": [
      { id: "game-w10-1", title: "Learn about game publishing", deadline: "Wednesday", completed: false, description: "Prepare your game for distribution platforms." },
      { id: "game-w10-2", title: "Study game monetization strategies", deadline: "Friday", completed: false, description: "Explore ads, in-app purchases and premium models." },
      { id: "game-w10-3", title: "Complete and publish a game", deadline: "Sunday", completed: false, description: "Finalize a game project and share it online." },
    ],
  },
};

// Course roadmaps with detailed milestones
export const courseRoadmaps: Record<string, CourseRoadmap> = {
  "web-development": {
    duration: "3 months (12 weeks)",
    milestones: [
      {
        title: "Frontend Fundamentals",
        description: "Master HTML, CSS, and JavaScript to build interactive web pages",
        weeks: [1, 2, 3, 4]
      },
      {
        title: "React Framework",
        description: "Learn component-based architecture and modern UI development",
        weeks: [5, 6]
      },
      {
        title: "Backend Development",
        description: "Build server-side applications with Node.js and Express",
        weeks: [7, 8]
      },
      {
        title: "Advanced Topics & Project",
        description: "Learn testing, optimization and build a capstone project",
        weeks: [9, 10, 11, 12]
      }
    ]
  },
  "mobile-development": {
    duration: "2.5 months (10 weeks)",
    milestones: [
      {
        title: "React Native Fundamentals",
        description: "Learn cross-platform mobile development basics",
        weeks: [1, 2, 3]
      },
      {
        title: "Mobile App Architecture",
        description: "Master state management and API integration",
        weeks: [4, 5]
      },
      {
        title: "Native Device Features",
        description: "Implement device-specific functionality and optimizations",
        weeks: [6, 7]
      },
      {
        title: "Deployment & Advanced Topics",
        description: "Publish your app and implement advanced patterns",
        weeks: [8, 9, 10]
      }
    ]
  },
  "cloud-computing": {
    duration: "2.5 months (10 weeks)",
    milestones: [
      {
        title: "Cloud Foundations",
        description: "Learn key cloud concepts and basic infrastructure",
        weeks: [1, 2]
      },
      {
        title: "Data & Application Services",
        description: "Master databases and serverless architecture",
        weeks: [3, 4, 5]
      },
      {
        title: "DevOps & CI/CD",
        description: "Implement automated pipelines and infrastructure as code",
        weeks: [6, 7]
      },
      {
        title: "Advanced Architecture",
        description: "Design scalable, resilient enterprise cloud solutions",
        weeks: [8, 9, 10]
      }
    ]
  },
  "ai-ml": {
    duration: "3 months (12 weeks)",
    milestones: [
      {
        title: "Data Science Foundations",
        description: "Master Python, statistics and data analysis",
        weeks: [1, 2, 3]
      },
      {
        title: "Machine Learning Fundamentals",
        description: "Learn core ML algorithms and evaluation techniques",
        weeks: [4, 5, 6]
      },
      {
        title: "Deep Learning",
        description: "Implement neural networks for complex tasks",
        weeks: [7, 8, 9]
      },
      {
        title: "ML Engineering & Deployment",
        description: "Build end-to-end ML systems and deploy models",
        weeks: [10, 11, 12]
      }
    ]
  },
  "game-development": {
    duration: "2.5 months (10 weeks)",
    milestones: [
      {
        title: "Game Engine Fundamentals",
        description: "Master Unity basics and create simple games",
        weeks: [1, 2, 3]
      },
      {
        title: "Game Systems & Polish",
        description: "Implement core mechanics and enhance player experience",
        weeks: [4, 5, 6]
      },
      {
        title: "3D Game Development",
        description: "Create immersive 3D worlds and advanced gameplay",
        weeks: [7, 8]
      },
      {
        title: "Production & Publication",
        description: "Optimize, test and publish your game",
        weeks: [9, 10]
      }
    ]
  }
};
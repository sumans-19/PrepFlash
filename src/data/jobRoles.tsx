import { Code2, Layout, Server, Layers, Smartphone, Gamepad, BarChart2, PieChart, Brain, Cpu, Database, MessageCircle, Cloud, GitMerge, Heart as Heartbeat, ShieldCheck, Shield, Lock, KeyRound, AlertCircle, CheckCircle, Zap, Activity, ClipboardList, Figma, Box, MousePointerClick, Search, Settings, HardDrive, Wifi, HelpCircle, Repeat, FileText, Target, CalendarCheck, Compass, BookOpen } from 'lucide-react';

export const jobRoles = [
  // 🧑‍💻 Core Development Roles
  {
    id: "software-dev",
    name: "Software Developer / Engineer",
    description: "Design, develop, and maintain software applications across platforms using various programming languages.",
    icon: "Code2",
    category: "development",
    popular: true
  },
  {
    id: "frontend-dev",
    name: "Frontend Developer",
    description: "Specialize in building user interfaces and client-side applications using HTML, CSS, and JavaScript frameworks.",
    icon: "Layout",
    category: "development",
    popular: true
  },
  {
    id: "backend-dev",
    name: "Backend Developer",
    description: "Focus on server-side applications, databases, and APIs that power web applications.",
    icon: "Server",
    category: "development",
    popular: true
  },
  {
    id: "fullstack-dev",
    name: "Full Stack Developer",
    description: "Develop both client and server software, working on all aspects of web applications.",
    icon: "Layers",
    category: "development"
  },
  {
    id: "mobile-dev",
    name: "Mobile App Developer",
    description: "Create applications for iOS, Android, and other mobile platforms using native or cross-platform technologies.",
    icon: "Smartphone",
    category: "development"
  },
  {
    id: "game-dev",
    name: "Game Developer",
    description: "Design and build interactive games for various platforms using game engines like Unity or Unreal.",
    icon: "Gamepad",
    category: "development"
  },

  // 🧠 Data & AI Roles
  {
    id: "data-scientist",
    name: "Data Scientist",
    description: "Apply statistical analysis, machine learning, and data visualization to extract insights from complex data.",
    icon: "BarChart2",
    category: "data"
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Analyze data to help businesses make better decisions through insights and visualizations.",
    icon: "PieChart",
    category: "data"
  },
  {
    id: "ml-engineer",
    name: "Machine Learning Engineer",
    description: "Build and deploy machine learning models and AI systems for production environments.",
    icon: "Brain",
    category: "data",
    popular: true
  },
  {
    id: "ai-engineer",
    name: "AI / Deep Learning Engineer",
    description: "Develop AI systems and deep learning architectures for computer vision, NLP, and other applications.",
    icon: "Cpu",
    category: "data"
  },
  {
    id: "data-engineer",
    name: "Data Engineer",
    description: "Design and manage scalable data pipelines and infrastructure for collecting, storing, and processing data.",
    icon: "Database",
    category: "data"
  },
  {
    id: "nlp-engineer",
    name: "NLP Engineer",
    description: "Specialize in natural language processing, building applications like chatbots and language models.",
    icon: "MessageCircle",
    category: "data"
  },

  // ☁️ Cloud & DevOps
  {
    id: "cloud-engineer",
    name: "Cloud Engineer",
    description: "Deploy and manage cloud infrastructure on platforms like AWS, Azure, and GCP.",
    icon: "Cloud",
    category: "operations"
  },
  {
    id: "devops-engineer",
    name: "DevOps Engineer",
    description: "Implement automation, CI/CD pipelines, and manage infrastructure to improve software delivery processes.",
    icon: "GitMerge",
    category: "operations",
    popular: true
  },
  {
    id: "sre",
    name: "Site Reliability Engineer (SRE)",
    description: "Ensure system reliability and uptime through automation, monitoring, and incident response.",
    icon: "Heartbeat",
    category: "operations"
  },
  {
    id: "cloud-security",
    name: "Cloud Security Engineer",
    description: "Secure cloud-based applications and infrastructure by implementing best practices and threat prevention.",
    icon: "ShieldCheck",
    category: "operations"
  },

  // 🔐 Cybersecurity
  {
    id: "cyber-analyst",
    name: "Cybersecurity Analyst",
    description: "Protect systems and data from threats through monitoring, analysis, and security implementation.",
    icon: "Shield",
    category: "security"
  },
  {
    id: "ethical-hacker",
    name: "Ethical Hacker / Penetration Tester",
    description: "Perform authorized tests to find and fix security vulnerabilities in systems and applications.",
    icon: "Lock",
    category: "security"
  },
  {
    id: "security-engineer",
    name: "Security Engineer",
    description: "Design and implement secure network and software systems to protect against cyber threats.",
    icon: "KeyRound",
    category: "security"
  },
  {
    id: "soc-analyst",
    name: "SOC Analyst",
    description: "Monitor and respond to security incidents in real-time within the Security Operations Center.",
    icon: "AlertCircle",
    category: "security"
  },

  // 🧪 Testing & QA
  {
    id: "qa-engineer",
    name: "QA Engineer / Test Engineer",
    description: "Design and execute tests to ensure software quality and detect issues before deployment.",
    icon: "CheckCircle",
    category: "quality"
  },
  {
    id: "automation-tester",
    name: "Automation Test Engineer",
    description: "Create automated test scripts using tools like Selenium or Cypress to ensure efficient testing.",
    icon: "Zap",
    category: "quality"
  },
  {
    id: "performance-tester",
    name: "Performance Test Engineer",
    description: "Evaluate system performance under load to ensure scalability and reliability.",
    icon: "Activity",
    category: "quality"
  },
  {
    id: "manual-tester",
    name: "Manual Tester",
    description: "Perform manual test cases and exploratory testing to identify bugs in software applications.",
    icon: "ClipboardList",
    category: "quality"
  },

  // 🎨 Design & UI/UX
  {
    id: "uiux-designer",
    name: "UI/UX Designer",
    description: "Design intuitive interfaces and user experiences through wireframes, prototypes, and user testing.",
    icon: "Figma",
    category: "design",
    popular: true
  },
  {
    id: "product-designer",
    name: "Product Designer",
    description: "Design product interfaces with a focus on usability, business goals, and user needs.",
    icon: "Box",
    category: "design"
  },
  {
    id: "interaction-designer",
    name: "Interaction Designer",
    description: "Focus on how users interact with products and design smooth, meaningful user flows.",
    icon: "MousePointerClick",
    category: "design"
  },
  {
    id: "ux-researcher",
    name: "UX Researcher",
    description: "Conduct research to understand user behavior and improve product design through insights.",
    icon: "Search",
    category: "design"
  },

  // 🧰 Other Technical Roles
  {
    id: "sys-admin",
    name: "System Administrator",
    description: "Maintain and configure computer systems, networks, and servers in an organization.",
    icon: "Settings",
    category: "it"
  },
  {
    id: "dba",
    name: "Database Administrator (DBA)",
    description: "Manage databases by ensuring performance, security, and availability of data.",
    icon: "HardDrive",
    category: "it"
  },
  {
    id: "network-engineer",
    name: "Network Engineer",
    description: "Design and manage computer networks to ensure seamless communication and connectivity.",
    icon: "Wifi",
    category: "it"
  },
  {
    id: "it-support",
    name: "IT Support Engineer",
    description: "Provide technical support and troubleshoot IT issues for users and systems.",
    icon: "HelpCircle",
    category: "it"
  },
  {
    id: "scrum-master",
    name: "Scrum Master / Agile Coach",
    description: "Facilitate agile practices, remove blockers, and support teams in delivering quality products.",
    icon: "Repeat",
    category: "it"
  },

  // 📊 Business & Tech Hybrid Roles
  {
    id: "business-analyst",
    name: "Business Analyst (IT)",
    description: "Bridge the gap between business needs and technical solutions through analysis and documentation.",
    icon: "FileText",
    category: "management"
  },
  {
    id: "product-manager",
    name: "Product Manager",
    description: "Lead product development by defining strategy, requirements, and coordinating across teams.",
    icon: "Target",
    category: "management",
    popular: true
  },
  {
    id: "technical-pm",
    name: "Technical Project Manager",
    description: "Manage technical projects, timelines, resources, and ensure successful delivery.",
    icon: "CalendarCheck",
    category: "management"
  },
  {
    id: "solution-architect",
    name: "Solution Architect",
    description: "Design high-level software solutions that meet business and technical requirements.",
    icon: "Compass",
    category: "management"
  },
  {
    id: "technical-writer",
    name: "Technical Writer",
    description: "Create documentation, guides, and manuals that explain technical concepts clearly.",
    icon: "BookOpen",
    category: "management"
  }
];
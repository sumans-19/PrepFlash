
import { Database, GitBranch, MapPin, Monitor, Briefcase, Target, GraduationCap, School, Book, Star, Code, FileCode, Terminal, QrCode, Store } from "lucide-react";

// Interest categories that users can select
export const interestsCategories = [
  "Web Development",
  "Mobile Development",
  "Machine Learning",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "UI/UX Design",
  "Game Development",
  "Blockchain",
  "IoT",
  "AR/VR",
  "Networking",
  "Database Management",
  "Artificial Intelligence",
  "Natural Language Processing",
  "Robotics",
  "Quantum Computing",
  "Open Source",
  "Technical Writing"
];

// Skill categories with their corresponding skills
export const skillCategories = [
  {
    name: "Programming Languages",
    icon: Code,
    skills: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C++",
      "C#",
      "Go",
      "Rust",
      "Swift",
      "Kotlin",
      "PHP",
      "Ruby"
    ]
  },
  {
    name: "Web Technologies",
    icon: Monitor,
    skills: [
      "React",
      "Angular",
      "Vue",
      "Next.js",
      "Node.js",
      "Express",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "SCSS",
      "GraphQL",
      "REST API"
    ]
  },
  {
    name: "Mobile Development",
    icon: QrCode,
    skills: [
      "React Native",
      "Flutter",
      "Android",
      "iOS",
      "Xamarin",
      "Ionic",
      "SwiftUI",
      "Kotlin Multiplatform"
    ]
  },
  {
    name: "Database",
    icon: Database,
    skills: [
      "SQL",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "Redis",
      "Cassandra",
      "DynamoDB",
      "Elasticsearch"
    ]
  },
  {
    name: "DevOps & Cloud",
    icon: GitBranch,
    skills: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "CircleCI",
      "GitHub Actions",
      "Terraform",
      "Ansible"
    ]
  }
];

// Career features for display in the profile
export const careerFeatures = [
  {
    id: 'dream-company',
    title: 'Dream Company',
    description: 'The company you aspire to work for',
    icon: Store
  },
  {
    id: 'target-role',
    title: 'Target Role',
    description: 'The position you are aiming for',
    icon: Target
  }
];

// Education features for display in the profile
export const educationFeatures = [
  {
    id: 'engineering-year',
    title: 'Academic Year',
    description: 'Your current year in engineering studies',
    icon: School
  }
];

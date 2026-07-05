// ══════════════════════════════════════
// Personal Data — Single source of truth (ME config)
// All command handlers pull from this object.
// ══════════════════════════════════════

const DATA = {
  name: 'Rathod Adesh Siddhartha',
  displayName: 'Adesh Siddhartha',
  shortName: 'Sidd',
  title: 'MSc Software Engineering Student',
  role: 'MSc Software Engineering Student · AI Enthusiast',
  location: 'Karlskrona, Sweden',
  country: 'Sweden',
  timezone: 'Europe/Stockholm',
  email: 'adrt25@student.bth.se',
  phone: '+46 0793256688',
  linkedin: 'https://www.linkedin.com/in/rathod-adesh-siddhartha-5751703bb',
  github: 'https://github.com/siddharth250305',
  x: '', // Add your X/Twitter URL here
  resumeUrl: '/AI_resume.pdf',

  // Short bio for the about command
  shortBio: `Currently pursuing MSc in Software Engineering at BTH, Sweden.
Passionate about AI/ML, System Design, and building intelligent software systems.
I love exploring the intersection of software engineering and artificial intelligence.`,

  education: [
    {
      degree: 'MSc Software Engineering',
      school: 'Blekinge Tekniska Högskola (BTH)',
      location: 'Sweden',
      period: '2024 – 2026',
      emoji: '🎓'
    },
    {
      degree: 'BTech Computer Science',
      school: 'JNTU Hyderabad',
      location: 'India',
      period: '2019 – 2023',
      emoji: '🎓'
    }
  ],

  experience: [
    {
      role: 'MSc Software Engineering Student',
      org: 'Blekinge Tekniska Högskola',
      location: 'Sweden',
      period: '2024 – present',
      description: 'Studying advanced software engineering with focus on AI and intelligent systems.',
      emoji: '🎓'
    },
    {
      role: 'BTech Computer Science',
      org: 'JNTU Hyderabad',
      location: 'India',
      period: '2019 – 2023',
      description: 'Completed bachelor\'s degree with focus on computer science fundamentals.',
      emoji: '💻'
    }
  ],

  // Grouped skills for the skills command
  skillGroups: {
    languages: ['Python', 'JavaScript', 'SQL', 'Java'],
    'ai/ml': ['PyTorch', 'TensorFlow', 'LangChain', 'LangGraph', 'OpenCV'],
    web: ['React', 'Vite', 'HTML/CSS', 'Flask', 'Node.js'],
    tools: ['Git', 'Docker', 'PostgreSQL', 'CI/CD', 'Linux'],
  },

  // Legacy skill bars (kept for backward compatibility)
  skills: {
    'Python': 85,
    'PostgreSQL': 75,
    'React': 70,
    'System Design': 70,
    'Software Arch.': 65,
    'LangChain': 60,
    'LangGraph': 60,
    'AI/ML': 65,
    'CI/CD & DevOps': 50,
    'Frontend Dev': 70
  },

  projects: [
    {
      name: 'Exam Seating System',
      description: 'Automated exam seating allocation system with constraint satisfaction.',
      tags: ['Python', 'Flask', 'PostgreSQL'],
      link: ''
    },
    {
      name: 'Emotion Detection',
      description: 'Real-time emotion detection system using deep learning and computer vision.',
      tags: ['Python', 'TensorFlow', 'OpenCV'],
      link: ''
    }
  ],

  // Neofetch card fields (PRD FR-4)
  neofetchInfo: {
    role: 'MSc Software Engineering',
    focus: 'AI · Intelligent Systems',
    stack: 'Python · PyTorch · React',
    based: 'Sweden',
    status: 'open to work',
  }
};

export default DATA;
